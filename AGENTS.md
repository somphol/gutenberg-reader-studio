# AGENTS.md — Gutenberg Reader Studio & Vocabulary Lab

> **Start here for handoff:** [docs/REPRODUCTION.md](docs/REPRODUCTION.md) is the rebuild and
> verification book. [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) is the module map and algorithm
> reference. [docs/TESTING.md](docs/TESTING.md) records what was actually run.
> [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) covers Pages operations.

## 1. What this is

A static, local-first reading room for public-domain books. It searches a bundled 165-title
catalogue and the Gutendex API, downloads cleaned plain text from GITenberg, Standard Ebooks or
Gutenberg mirrors, paginates it in the browser, and presents it as typeset pages (3D page-turn) or
continuous scroll. Around the reader sit bionic reading, an RSVP speed reader, a teleprompter,
sentence-by-sentence read-aloud narration (TTS), synthesized ambient sound, dictionary lookup with a
spaced-repetition Word Bank, per-book notes, and whole-library JSON export/import.

It is **not** an EPUB reader, a book mirror, a server, an account system, or a framework starter.
There is no copy of any book in the repository; text is fetched on demand or replayed from the local
IndexedDB cache. It is not an AI reader and makes no content recommendations beyond catalogue search.
Current app version: **1** (`APP.version` in `script.js`).

Live copy: <https://somphol.github.io/gutenberg-reader-studio/>
Local master: `~/Projects/gutenberg-reader-studio`

## 2. Commands

```bash
cd ~/Projects/gutenberg-reader-studio

# run — no install, no build, no package manager
python3 -m http.server 8000
# open http://localhost:8000/  (file:// mostly works; fetch/IndexedDB prefer HTTP)

# verification — dependency-free, Node 18+ (tested on 26.13.0)
node --check script.js
node scripts/check.mjs

# deploy = push to main; GitHub Pages serves the repository root
git push origin main
```

`scripts/check.mjs` validates required files, local `src`/`href` targets in `index.html`, relative
Markdown links, JavaScript syntax for every `.js` file, every `.json` file, and byte-identical skill
templates. It prints `OK <n> checks` and exits 0; failures print `FAIL ...` and exit 1.

## 3. Architecture

Load order: `index.html` → `style.css` → `script.js` (deferred). `script.js` is one top-level
`'use strict'` script, not a module and not an IIFE. `init()` runs on `DOMContentLoaded`.

1. **Data** — `APP` constants, `CURATED` (20), `POPULAR_GUTENBERG` (140), `STANDARD_EBOOKS` (9),
   deduped by `catalogKey(title, author)` into `LOCAL_CATALOG`. `state` is loaded by `loadState()`.
2. **Boot** — `init()` → `applySettings` → `setupEvents` → `setupReaderSelection` →
   `populateTtsVoices` (plus `voiceschanged`) → `renderCurated` / `renderCatalogShelf` /
   `renderWordBank` / `renderNotes` → `updateContinueBanner` / `updateNav` → `loadBuildState`
   (read-only `state.json`) → `handleRoute` (`#library` or `#read/<id>`).
3. **Search** — `performSearch()` filters `LOCAL_CATALOG` synchronously via `searchLocalCatalog()`,
   then asks Gutendex; results merge through `mergeBookLists()`. Responses are cached for 7 days in
   `gutenbergStudio.searchCache.v1` (40 entries max). A failed request falls back to local + cached.
4. **Text** — `getBookText()` checks the in-memory `ui.textCache`, then IndexedDB (`TextCacheDB`,
   database `gutenbergStudioText`, store `texts`, version `TEXT_CACHE_VERSION = 3`), then runs the
   source chain. `cleanGutenbergText()` strips Gutenberg furniture; `parseChapters()` splits headings
   and prose; `paginate(chapters, computePageLayout())` produces `ui.bookData.pages`.
5. **Reader** — `renderPage(index, direction)` draws one `.page-sheet`; `renderScroll()` draws every
   page as `.scroll-page`. `switchMode()` converts the current position through a percentage.
   Bionic text is produced by `bionicText()` / `bionicWord()` at render time.
6. **Read aloud** — `startTts()` → `ttsLoadPage(ui.currentPage)` → `ttsWrapBlock()` wraps sentence
   spans → `ttsSpeakCurrent()` speaks one sentence per `SpeechSynthesisUtterance`. `onend` calls
   `ttsStep(1)`; page changes route through `ttsOnPageRendered()`.
7. **Vocabulary** — `setupReaderSelection()`, `wordInfoAtPoint()`, `lookupWord()` (30-day dictionary
   cache), `addCurrentWordToBank()`, `gradeWord()` and `dueLabel()` implement capture and SRS.

Key formulas:

```text
charsPerLine   = max(24, floor(pageWidth / (0.5 * fontSize)))
maxBlockChars  = max(300, charsPerLine * max(4, floor(pageHeight / lineHeightPx) - 1))
blockHeight    = ceil(blockChars / charsPerLine) * lineHeightPx + 0.92 * fontSize * lineHeight
bionic bold    = ceil(letters * 0.42)   // minimum 1
TTS chunk      = 220 characters, split on . ; , em-dash then space
```

Persistence: one `localStorage` key, `gutenbergStudio.v1`, holding `{version, settings, library,
wordBank, notes, stats}`. Writes are debounced 250 ms by `saveStateSoon()`; export adds
`exportedAt` and `app` metadata. Book text is **not** stored there — only progress.

## 4. Decisions and constraints

- **Three source files, no build, no dependencies.** Keep `index.html`, `style.css`, `script.js`
  directly servable. Do not add a bundler, framework, service worker or package manager.
- **The app is local-first, not offline-first.** The bundled catalogue, saved library, notes, Word
  Bank, cached search results, cached book text (IndexedDB), and on-device TTS voices work without a
  network. Uncached book text, Gutendex, dictionary definitions/audio, cover images and Google Fonts
  need a connection. Preserve that split and its UI language; do not claim the app is fully offline.
- **Plain text and XHTML only.** Gutenberg text is cleaned as text/plain. Standard Ebooks is parsed
  as single-page XHTML with `DOMParser` (`extractStandardEbooksText`). There is no EPUB/ZIP parsing.
  Do not add a `.epub` file input and call it supported without writing a container reader.
- **Source order matters.** GITenberg (`raw.githubusercontent.com`) is tried before direct Gutenberg
  because Gutenberg does not send CORS headers for plain text; CORS relays are last-resort and
  third-party. `looksLikeBook()` rejects HTML error pages, Cloudflare pages and letter-sparse text.
- **Pagination is a measured heuristic, not a CSS layout engine.** It estimates glyph width at
  `0.5 × fontSize` and measures `.page-body` twice on open (60 ms apart). Changing `0.5`, `0.92`,
  `7.2` or the `page-body` padding requires rechecking page overflow at 14 px and 32 px.
- **Page-turn DOM contract is fixed.** The outgoing sheet is `.is-turning.is-turning-next` over an
  `.is-under` incoming sheet; CSS rotates around the left spine from 0° to −96° over 0.8 s; JS cleans
  up at 820 ms. Do not rename those classes or lengthen one side without the other.
- **TTS must stay sentence-scoped.** One utterance per sentence, maximum 220 characters, so pause,
  resume, stepping, highlighting and page advance stay responsive. The `ui.tts.token` guard is what
  prevents stale `onend`/`onboundary` callbacks from double-speaking. Never queue the whole page.
- **Voice selection must prefer on-device voices.** `ttsAutoVoice()` chooses a local default, then a
  local English voice, then any local voice. Online voices are allowed but labelled. This is what
  keeps narration usable offline.
- **Only wrap sentence spans while listening.** `ttsWrapBlock()` sets `data-tts-wrapped="1"` and
  rewrites text nodes. Normal reading, bionic markup and word lookup must not be wrapped at rest.
- **Storage keys and cache lifetimes are part of the contract.**
  `gutenbergStudio.v1` (state), `gutenbergStudio.searchCache.v1` (7 days, 40 entries),
  `gutenbergStudio.dict.v1` (30 days, 150 entries), IndexedDB `gutenbergStudioText` with
  `TEXT_CACHE_VERSION = 3` (bump the version to invalidate old text).
- **One language, one interface.** The app UI and catalogue are English-only. There is no i18n
  layer; do not introduce half-translated strings.
- **No analytics, accounts, cookies, or uploads.** All exports are local Blobs. TTS is played by the
  platform speech engine; no audio is recorded or sent anywhere.
- **`state.json` and `STATE.md` are historical build records.** The runtime only fetches `state.json`
  to print the footer provenance line. Do not wire build statistics into app logic or rewrite history.
- **Documentation and checks ship with the app.** `scripts/check.mjs` must stay dependency-free and
  pass before every push. The skill template under `skills/gutenberg-reader-studio/assets/template/`
  must remain byte-identical to the three source files.

## 5. Known issues

- **Browser coverage is historical, not continuous.** Chrome (desktop and mobile widths) was used
  for the build-time checks recorded in `STATE.md`. Safari and Firefox are plausible but were not
  automated. Sentence highlighting works everywhere; per-word highlight requires the CSS Custom
  Highlight API and degrades silently without it.
- **No service worker and no offline app shell.** A first visit needs the network for HTML/CSS/JS.
  After that, only the bundled catalogue, IndexedDB text and on-device voices are offline-capable.
- **Pagination can still overflow.** Long unbroken words, unusual poetry, very large type or a
  different font stack can exceed the estimate; `.page-body` scrolls rather than clipping, so the
  page is not lost, but the page count may feel uneven.
- **Only English catalogue metadata is requested** (`languages=en` in the Gutendex URL). The local
  shelf is English too. Non-English Gutendex results are not surfaced.
- **Third-party sources can change or fail.** Gutendex, GITenberg repository naming, Standard Ebooks
  markup, the Free Dictionary API and the two CORS relays are outside this repository. Extraction
  heuristics and timeouts are the only defence.
- **TTS is platform-dependent.** Voice inventory, pronunciation, pause behaviour and offline
  availability come from the OS/browser. The automatic voice is a heuristic; the voice picker can
  show stale entries until **Refresh voices**. Long utterances are chunked because some engines drop
  or stall on very long text.
- **TTS is page-scoped in page mode.** It narrates the current page, then advances only when
  `ttsAutoAdvance` is on. With it off, narration stops at the page boundary. Background tabs may be
  throttled or suspended by the browser.
- **`stats.readingSeconds` is exported but never incremented.** Only `wordsCaptured` and `reviews`
  are updated. Do not rely on reading-time analytics.
- **The Word Bank is a fixed ladder**, not SM-2: intervals `[1, 3, 7, 14, 30, 60]` days with Again
  fixed at 10 minutes.
- **No EPUB import, no local file reader, no DRM support.** Book text always comes from a remote
  source or the IndexedDB cache.
- **Google Fonts is an external dependency for the intended typography.** The app falls back to
  system serif/sans stacks if the stylesheet is blocked.
- **`state.json` / `STATE.md` metrics are a snapshot**, not live telemetry.

## 6. Continuity

- **Deployed copy:** GitHub Pages, `main`, repository root, `.nojekyll`. URL above.
- **Local master:** `~/Projects/gutenberg-reader-studio`.
- **Documentation map:** [README.md](README.md) is the human entry point;
  [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) the module map and algorithms;
  [docs/REPRODUCTION.md](docs/REPRODUCTION.md) the rebuild book;
  [docs/TESTING.md](docs/TESTING.md) the test record and gaps;
  [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) Pages operations;
  [skills/gutenberg-reader-studio/SKILL.md](skills/gutenberg-reader-studio/SKILL.md) the reusable
  build skill; [CHANGELOG.md](CHANGELOG.md) release history;
  [STATE.md](STATE.md) and [state.json](state.json) the historical build record.
- **Policies:** [CONTRIBUTING.md](CONTRIBUTING.md), [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md),
  [SECURITY.md](SECURITY.md), [LICENSE](LICENSE) (MIT).
- **Publishing rules:** keep Pages on `main` / `/`. Update `AGENTS.md` in the same push as any change
  that makes it stale. Run `node scripts/check.mjs` before pushing. Do not commit credentials,
  tokens, `.env` files, or personal data. Do not force-push `main`.
- **If the repository is renamed:** update the absolute URLs in `index.html` (canonical, Open Graph,
  Twitter), `script.js` (`APP.repository`, `APP.pages`), `README.md`, `AGENTS.md`,
  `sitemap.xml`, `robots.txt`, and `state.json`'s deployment block.
