---
name: Gutenberg Reader Studio
description: Build a static, local-first Gutenberg reading studio with text cleaning, measured pagination, 3D page turns, bionic/RSVP modes, sentence-level read-aloud TTS, a spaced-repetition Word Bank, and a verified GitHub Pages release.
version: 1.0.0
---

# Gutenberg Reader Studio

Build a production reading application for public-domain books as three static files:
`index.html`, `style.css`, `script.js`. It searches a bundled catalogue and Gutendex, fetches
cleaned text from GITenberg / Standard Ebooks / Gutenberg mirrors, paginates it in the browser, and
adds page-turn and scroll reading, bionic reading, RSVP, a teleprompter, read-aloud narration,
ambient Web Audio, a dictionary-backed Word Bank with SRS, notes, and JSON export/import.

`assets/template/` is the released implementation, not a blank starter. It is byte-identical to
the three source files in the project it came from. Use it as a working reference and replace the
catalogue/content deliberately; do not ship the demo catalogue as a new product.

## When to use

- A user asks for a Gutenberg/Standard Ebooks reader, a public-domain reading room, a vocabulary
  studio built around reading, or a read-aloud/TTS reading app.
- The result must run on GitHub Pages or any read-only static host, with no build, backend,
  framework or account system.
- The reader needs measured pagination, page-turn animation, scroll mode, dictionary lookup,
  spaced repetition, local persistence, or browser speech synthesis.
- You need a reproducible, checkable release rather than a mockup.

**Not for:** EPUB file import (this skill has no container parser), DRM, server-side search or
accounts, multilingual UI, a hosted book library, or an AI summarizer. If the task requires reading
local `.epub` files, write an EPUB unzip/OPF/NCX pipeline first — do not relabel the XHTML extractor
as EPUB support.

## What it produces

- `index.html` — semantic shell, search/library, reader, settings and word-bank drawers, notes,
  word popup, RSVP overlay, TTS HUD, help/review modals, loading and toast layers.
- `style.css` — paper/sepia/midnight/OLED themes, editorial typography, page sheet, 3D turn,
  scroll viewport, TTS highlight, responsive layout.
- `script.js` — catalogue, network and caches, text cleaning, chapter parsing, pagination, reader,
  bionic, dictionary, Word Bank/SRS, notes, RSVP, teleprompter, TTS, ambient audio, state, events.
- Optional but recommended: `scripts/check.mjs`, `AGENTS.md`, `docs/`, a skill directory.

## Quick start

```sh
mkdir -p ~/Projects/my-reader
cp skills/gutenberg-reader-studio/assets/template/{index.html,style.css,script.js} \
   ~/Projects/my-reader/
cd ~/Projects/my-reader
python3 -m http.server 8000
# open http://localhost:8000/
node --check script.js
node scripts/check.mjs        # after adding the check script
```

No install step. Node is only for syntax and static checks.

## Workflow

1. **Decide the catalogue.** Keep the three array shapes (`CURATED`, `POPULAR_GUTENBERG`,
   `STANDARD_EBOOKS`) or replace their contents. Every entry needs `id`, `title`, `author`,
   `subjects`, `topics`, `source` and a trustworthy text route. Run the dedupe and confirm the
   visible count.
2. **Keep the shell contract.** Preserve the ids used by `script.js` (`#search-form`, `#page-viewport`,
   `#scroll-viewport`, `#tts-voice`, `#tts-hud`, …). If you rename one, rename it in both files.
3. **Build the text pipeline before the UI.** Implement source order, `looksLikeBook`,
   `cleanGutenbergText`, `parseChapters`, then pagination. Verify with real Gutenberg and Standard
   Ebooks titles, not fixtures only.
4. **Build the reader.** Page mode first, then scroll mode, then `switchMode()` with percentage
   preservation and the page-turn cleanup.
5. **Add modes in this order:** bionic → dictionary/Word Bank → RSVP → teleprompter → ambient →
   TTS. Each has its own overlay/HUD and must close the others cleanly.
6. **TTS last, on top of a stable page model.** Sentence wrapping depends on rendered pages; page
   advance depends on `renderPage()` notifying `ttsOnPageRendered()`.
7. **Persist through `mergeState()` only.** Never trust a stored object shape; clamp and rebuild.
8. **Verify** with `node --check` and `scripts/check.mjs`, then the manual matrix in
   `references/verification.md`.
9. **Document and publish**: README, AGENTS.md, docs set, skill, Pages from `main` / root.

## Module map

| Area | Identifiers |
| --- | --- |
| Catalogue | `CURATED`, `POPULAR_GUTENBERG`, `STANDARD_EBOOKS`, `catalogKey`, `LOCAL_CATALOG` |
| Search | `searchLocalCatalog`, `performSearch`, `getCachedSearch`, `normalizeGutendexBook` |
| Text | `getBookText`, `TextCacheDB`, `looksLikeBook`, `cleanGutenbergText`, `parseChapters` |
| Standard Ebooks | `extractStandardEbooksText`, `fetchStandardEbooksText`, `seFallback` |
| Pagination | `computePageLayout`, `paginate`, `splitLongBlock`, `pageAtPercent` |
| Reader | `openBook`, `renderPage`, `renderScroll`, `switchMode`, `updateProgress` |
| Focus modes | `bionicText`, `openRsvp`, `scheduleRsvpTick`, `teleprompterStep` |
| TTS | `populateTtsVoices`, `ttsLoadPage`, `ttsSpeakCurrent`, `ttsStep`, `ttsOnPageRendered` |
| Vocabulary | `lookupWord`, `wordInfoAtPoint`, `addCurrentWordToBank`, `gradeWord` |
| Audio | `Ambient.start`, `noiseBuffer`, `scheduleCrackle` |
| State | `defaultState`, `mergeState`, `saveStateSoon`, `exportState`, `importState` |
| Boot | `init`, `setupEvents`, `handleKeydown`, `handleRoute` |

## Core recipes

### 1. Add or replace a text source

```js
// inside getBookText(), before the CORS relays
addAttempt('https://example.org/book.txt', 'Example archive', 15000);
```

Rules that make this safe:

- Put CORS-enabled first-party sources before relays; relays are last resort and third-party.
- Validate with `looksLikeBook()` (≥800 chars, not an HTML/Cloudflare page, letter ratio > 0.35) and
  require ≥500 cleaned characters before caching.
- Cache only cleaned text, in IndexedDB, not `localStorage`.
- Keep a source label for the loading UI (`onStatus('Trying …')`).
- Test at least one 404, one HTML error page and one very short response.

For XHTML, extract with `DOMParser`, skip `nav/footer/aside`, then feed the block text through the
same `parseChapters()` path. Do not invent an EPUB abstraction unless you implement the ZIP/OPF/NCX
layers.

### 2. Change pagination without breaking the reader

The model is an estimate, then a measured re-run:

```text
charsPerLine  = max(24, floor(pageWidth / (0.5 * fontSize)))
lineHeightPx  = fontSize * lineHeight
blockHeight   = ceil(chars / charsPerLine) * lineHeightPx + 0.92 * fontSize * lineHeight
headingHeight = fontSize * 7.2 (first block of a chapter only)
flush when usedHeight + blockHeight > pageHeight
```

If you change the glyph-width factor, paragraph margin or heading reserve:

1. Re-test at 14 px / 1.2 and 32 px / 2.2 on desktop and 390 px mobile.
2. Confirm `.page-body.scrollHeight <= clientHeight + 1` for every page.
3. Keep the 60 ms second `paginate()` in `openBook()`; it prevents the page count jumping after
   fonts settle.
4. Keep percentage preservation in `scheduleRepaginate()` and `switchMode()`.

### 3. Add or tune read-aloud

For a new TTS setting:

1. Add the default to `defaultState().settings`.
2. Clamp/validate it in `sanitizeSettings()`.
3. Set the control in `syncSettingsUI()`.
4. Add the control to `#settings-drawer` in `index.html`.
5. Wire it in `setupEvents()` through `setSetting()`.
6. Consume it in `ttsSpeakCurrent()` (or the relevant TTS function).

Never add a TTS setting only to the DOM — `sanitizeSettings()` will drop it on the next load.

For playback behaviour:

- One utterance per sentence; split anything over `TTS_MAX_CHUNK = 220` at punctuation, then space.
- Increment `ui.tts.token` for every utterance and reject callbacks whose token is stale.
- Treat `interrupted` / `canceled` errors as normal cancellation, not failure.
- Prefer local voices in `ttsAutoVoice()`; label online ones.
- Wrap sentence spans only while listening; keep `data-tts-wrapped="1"` for reuse.
- Route manual page changes through `ttsOnPageRendered()`; ignore pages requested by
  `ttsGoToPage()` via `ui.tts.expectedPage`.

## Failure boundaries

- **No EPUB support.** XHTML single-page extraction is not EPUB.
- **No offline app shell.** Without a service worker, a first load needs network. Say so.
- **No offline dictionary.** Only cached definitions resolve without network.
- **Pagination is approximate.** Unusual fonts/poetry can overflow into the page's internal scroll.
- **TTS is platform-dependent.** Voice availability, pronunciation and background behaviour vary.
  Word-level highlight needs the CSS Custom Highlight API.
- **Third-party sources can change.** Gutendex, GITenberg naming, Standard Ebooks markup, the
  dictionary API and CORS relays are outside your control. Keep the local shelf usable on failure.
- **No accounts or sync.** Import/export is the portability story.
- **English catalogue only** in the reference implementation.

## Verification

```sh
node --check script.js
node scripts/check.mjs
# expected: OK <n> checks
```

`scripts/check.mjs` must be dependency-free and check: required files, local `src`/`href` targets,
relative Markdown links, `node --check` for every `.js`, every `.json` parse, and byte-identical
skill templates. Add checks when you add release-critical files.

Functional checks (manual or headless): search local-first, open Gutenberg and Standard Ebooks
titles, page overflow, both page-turn directions, mode switch percentage, bionic double-click, RSVP
stepping, teleprompter pause, dictionary add/grade, reload restore, export/import, TTS start/pause/
step/auto-advance/manual-page-change/stop, and 390 px overflow.

See `references/method.md` for the full build order and data flow,
`references/lessons.md` for the bugs this pattern regresses into, and
`references/verification.md` for exact checks and expected output.
