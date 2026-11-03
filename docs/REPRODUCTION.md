# Reproduction book

This is the complete rebuild and verification handoff for **Gutenberg Reader Studio & Vocabulary
Lab**. Read it with [ARCHITECTURE.md](ARCHITECTURE.md). If the three source files exist, they are the
source of truth: use this book to understand, verify, extend or reconstruct — not to rewrite working
code for style.

## 1. What is being reproduced

A single-page, static, local-first reading studio for public-domain books:

- **Delivery:** `index.html`, `style.css`, `script.js`; no build, framework, backend, database or
  service worker. Deployed on GitHub Pages from `main` / root.
- **Catalogue:** 20 hand-picked classics, 140 popular Gutenberg titles and 9 Standard Ebooks
  editions, deduped at runtime into `LOCAL_CATALOG` (165 titles), supplemented by Gutendex search.
- **Text sources:** GITenberg raw text, Standard Ebooks single-page XHTML, Project Gutenberg
  mirrors, then two public CORS relays.
- **Reader:** automatic Gutenberg furniture cleaning, chapter detection, measured pagination,
  3D page-turn (hinge on the spine, outgoing page swings left) and continuous scroll.
- **Modes:** bionic reading, RSVP speed reading (150–500 wpm), teleprompter auto-scroll, read-aloud
  narration (sentence-by-sentence, platform voices, optional auto page turn), synthesized ambient
  sound (rain, café, fireplace).
- **Vocabulary:** double-click/selection dictionary lookup, context capture, Word Bank with
  New/Practicing/Mastered SRS, due queue and flashcard grading, per-book notes.
- **Persistence:** one `localStorage` state, IndexedDB full-text cache, JSON library export/import.
- **Language:** English-only interface and catalogue.
- **Release:** `APP.version = 1`. The build record is `state.json` / `STATE.md` (2026-11-01;
  read-aloud added 2026-11-02). Documentation and the skill are release artifacts, not app code.

**Out of scope / not reproduced:** EPUB or ZIP parsing, local file reading, OCR, DRM, accounts,
server sync, translation, a recommendation engine, a computer reading coach, and any hosted copy of
book text.

## 2. Requirements matrix

| Requirement | Implementation | File |
| --- | --- | --- |
| Search 75,000+ Gutenberg books | `performSearch` → `fetchGutendex` | `script.js` |
| Instant local search | `searchLocalCatalog`, `LOCAL_CATALOG`, `mergeBookLists` | `script.js` |
| 165-book shelf | `CURATED` (20), `POPULAR_GUTENBERG` (140), `STANDARD_EBOOKS` (9), `catalogKey` dedupe | `script.js` |
| Genre browsing | `TOPIC_LABELS`, `inferTopics`, `#genre-chips`, `performSearch({topic})` | `script.js`, `index.html` |
| Search cache | `gutenbergStudio.searchCache.v1`, 7 days, 40 entries | `script.js` |
| Open saved book by URL | `handleRoute`, `openBookById`, `#read/<id>` | `script.js` |
| CORS-safe text fetch | `getBookText` source chain, `fetchText`, `looksLikeBook` | `script.js` |
| Standard Ebooks source | `extractStandardEbooksText`, `seFallback`, `fetchStandardEbooksText` | `script.js` |
| Gutenberg cleaning | `cleanGutenbergText` | `script.js` |
| Chapter detection | `isChapterHeading`, `parseChapters`, `trimTitlePage`, `trimLeadingMatter` | `script.js` |
| Pagination | `computePageLayout`, `paginate`, `splitLongBlock`, `pageAtPercent` | `script.js` |
| Page count stability on open | second `paginate()` 60 ms after first render | `script.js` |
| 3D page turn | `renderPage`, `.is-under`, `.is-turning`, `flipPageLeft` / `flipPageInFromLeft` | `script.js`, `style.css` |
| Continuous scroll | `renderScroll`, `#scroll-viewport` scroll handler | `script.js` |
| Preserve place across modes | `switchMode(currentPercent())`, `pageAtPercent` | `script.js` |
| Themes | `THEME_META`, `html[data-theme]`, CSS tokens | `script.js`, `style.css` |
| Typefaces / size / leading | `FONT_STACKS`, `--reader-font`, `--reader-size`, `--reader-leading` | `script.js`, `style.css` |
| Bionic reading | `bionicText`, `bionicWord`, `.bw[data-word]` | `script.js` |
| RSVP | `buildRsvpWords`, `openRsvp`, `scheduleRsvpTick`, `renderRsvpWord` | `script.js`, `index.html` |
| Teleprompter | `toggleTeleprompter`, `teleprompterStep`, `#teleprompter-hud` | `script.js`, `index.html` |
| Read aloud | `startTts` → `ttsLoadPage` → `ttsSpeakCurrent` → `ttsStep` | `script.js` |
| Sentence + word highlight | `.tts-sentence.is-speaking`, `CSS.highlights` `tts-word` | `script.js`, `style.css` |
| Voice picker / preview | `populateTtsVoices`, `ttsAutoVoice`, `previewTtsVoice` | `script.js`, `index.html` |
| Auto page turn while listening | `ttsAdvancePage`, `ttsGoToPage`, `ttsOnPageRendered` | `script.js` |
| Ambient sound | `Ambient.start` Web Audio graph | `script.js` |
| Dictionary lookup | `wordInfoAtPoint`, `lookupWord`, `fetchDictionaryEntry` | `script.js` |
| Context sentence | `sentenceAround`, `contextFromElement`, `contextFromNode` | `script.js` |
| Word Bank / SRS | `addCurrentWordToBank`, `gradeWord`, `openReview`, `dueLabel` | `script.js` |
| Notes | `saveNote`, `editNote`, `deleteNote`, `renderNotes` | `script.js`, `index.html` |
| State persistence | `defaultState`, `mergeState`, `saveStateSoon`, `gutenbergStudio.v1` | `script.js` |
| Full-text cache | `TextCacheDB`, `gutenbergStudioText` / `texts`, version 3 | `script.js` |
| Export / import | `exportState`, `importState`, Blob download, hidden file input | `script.js`, `index.html` |
| Responsive reader | breakpoints at 1180 / 760 / 420 px; ≤720 px starts in scroll | `style.css`, `script.js` |
| Keyboard shortcuts | `handleKeydown`, `#help-modal` | `script.js`, `index.html` |
| Build provenance | footer `loadBuildState`, `openBuildState` | `script.js`, `state.json` |

## 3. Non-negotiable constraints and enforcement

| Constraint | Why | Enforcement |
| --- | --- | --- |
| Three static files, no build | Works on any read-only host; long-lived simplicity | `scripts/check.mjs` checks required files; no package manifest |
| No framework or bundler | The source is the deployable | review; nothing to compile |
| Local-first, not offline-first | Books are remote objects; honest capability | UI copy, IndexedDB cache, this document |
| Plain text + XHTML only | The source sites expose text, not EPUB blobs | `getBookText`; no `.epub` code path |
| GITenberg before direct Gutenberg | Gutenberg plain text lacks CORS headers | ordered `attempts` in `getBookText` |
| CORS relays are last resort | Third-party availability and privacy | appended after all first-party URLs |
| Pagination preserves percentage | Page counts change with type settings | `scheduleRepaginate`, `switchMode` |
| Page-turn classes stay paired | CSS animation and JS cleanup depend on them | `.is-turning-next` / `.is-turning-prev` + 820 ms cleanup |
| One sentence per TTS utterance | Responsive pause/step/highlight | `TTS_MAX_CHUNK = 220`, `ttsSpeakCurrent` |
| On-device voice preferred | Narration must work offline | `ttsAutoVoice`, `ttsIsLocal` |
| Stale speech callbacks ignored | `cancel()` fires `onend`/`onerror` | `ui.tts.token` comparison |
| No book text in `localStorage` | Quota and portability | `state.library` stores progress only; text in IndexedDB |
| No analytics / accounts / uploads | Privacy claim | no such code; TTS is platform-local |
| `state.json` is historical | Honest provenance | footer-only `fetch`, never loaded into `state` |
| Docs and checks ship together | Handoff quality | `scripts/check.mjs` + this document |

## 4. Reference environment

| Tool | Version / note |
| --- | --- |
| macOS | Darwin, Apple Silicon |
| Node.js | 26.13.0 local (script uses only `node:fs`, `node:path`, `node:child_process`) |
| Python | 3.x, only for `python3 -m http.server` |
| Git | system Git, `main` branch |
| Chrome | 156 headless used during the build for DOM/TTS checks |
| Dependencies | **none**; no `npm install` |
| Hosting | GitHub Pages, `main`, `/` (root), `.nojekyll` |

The app itself needs a modern browser with `fetch`, `localStorage`, `DOMParser`, `Blob`, and — for
read-aloud — `speechSynthesis` + `SpeechSynthesisUtterance`. `Intl.Segmenter` is optional (regex
fallback), as is the CSS Custom Highlight API (word highlight only).

## 5. Repository map

| Path | Role |
| --- | --- |
| `index.html` | Shell, search, library, reader, drawers, modals, TTS HUD, settings |
| `style.css` | Design tokens, themes, page sheet, page-turn keyframes, responsive layout |
| `script.js` | Catalogue, network, parsing, pagination, reader, TTS, audio, state, events |
| `scripts/check.mjs` | Dependency-free release checks (files, links, syntax, JSON, template parity) |
| `docs/ARCHITECTURE.md` | Module map and algorithms |
| `docs/REPRODUCTION.md` | This book |
| `docs/DEPLOYMENT.md` | Pages operations, rollback, troubleshooting |
| `docs/TESTING.md` | Test record, manual matrix, gaps |
| `skills/gutenberg-reader-studio/` | Reusable skill + byte-identical template |
| `state.json`, `STATE.md` | Historical build/session/token record |
| `.github/` | CODEOWNERS, issue forms, pull request template |
| `screenshots*.png` | README captures (not loaded by the app) |

## 6. Build from scratch

If the sources exist, skip to §8. Otherwise follow these stages in order. Each stage has an
acceptance check; do not start the next one until it passes. There is no package install at any stage.

### Stage 0 — Scaffold

```bash
mkdir gutenberg-reader-studio && cd gutenberg-reader-studio
git init -b main
touch index.html style.css script.js .nojekyll
```

Create `LICENSE` (MIT), `.gitignore`, `README.md`, and a `docs/` folder. No `package.json`.

**Accept:** `python3 -m http.server 8000` serves a blank page with no 404s.

### Stage 1 — HTML shell

Build `index.html` in this order:

1. `<head>`: charset, viewport, theme-color, description, title, favicon, canonical, Open Graph and
   Twitter metadata, Google Fonts preconnect + Fraunces/Inter stylesheet, `style.css`.
2. App bar: brand, Library/Reader/Word Bank nav, save/load/help/settings buttons.
3. Library view: hero with search form and `#offline-count`, genre chips, curated grid
   (`#book-grid`), local shelf (`#catalog-section`, `#catalog-grid`), search results
   (`#results-section`, `#search-grid`, `#sort-select`, `#load-more`), export/import call-to-action.
4. Reader view: back, title/author, progress bar, quick tools (`data-quick="bionic|rsvp|tts|teleprompter|sound"`),
   chapter select, mode buttons (`.mode-btn[data-mode="page|scroll"]`), `#page-viewport`,
   `#scroll-viewport`, prev/next bar, `#tts-hud`, `#teleprompter-hud`.
5. Settings drawer: theme grid, font grid, size/leading sliders, page-turn and bionic toggles, TTS
   voice/rate/auto-advance/preview/refresh/start, RSVP and teleprompter controls, ambient grid and
   volume, save/load, reset, build provenance.
6. Word Bank drawer, Notes drawer, word popup, RSVP overlay, help modal, review modal, loading
   overlay, toast stack, hidden `#import-file`.
7. `<script src="script.js" defer></script>`.

Use stable ids for every control and keep `<button type="button">` on non-submit buttons.

**Accept:** the page renders without CSS, every referenced id exists, and `document.querySelector`
finds each id used by `script.js`.

### Stage 2 — CSS system

Implement the paper-and-ink design:

- Tokens for paper, sepia, midnight and OLED themes; `--reader-paper`, `--reader-ink`,
  `--reader-line`, accent/amber/coral/emerald semantics.
- `#page-viewport { perspective: 3200px; }`, `.page-sheet` with spine gradients, left
  `transform-origin`, running head, justified body, drop cap, poem block.
- Page-turn keyframes `flipPageLeft` and `flipPageInFromLeft` at 0.8 s, plus `.is-under` and
  `.is-turning` layers; disable under `prefers-reduced-motion`.
- Scroll viewport, responsive breakpoints (1180 px sidebar, 760 px compact, 420 px clock/bar),
  mobile defaults handled in JS at 720 px.
- Drawers, modals, popup, RSVP overlay, toasts, focus-visible outlines, skip link, `.sr-only`.
- TTS: `.tts-sentence.is-speaking` background and `::highlight(tts-word)`.

**Accept:** 1440×900 and 390×844 have no horizontal overflow; switching theme changes paper and ink;
reduced motion suppresses the page-turn animation.

### Stage 3 — Constants, catalogue, utilities

In `script.js`:

- `APP` with name, version, storage keys, export filename, repository and Pages URLs.
- `DAY`, `TEXT_CACHE_VERSION = 3`, `SRS_INTERVALS = [1,3,7,14,30,60]`, `SRS_LABELS`,
  `THEME_META`, `FONT_STACKS`, `TOPIC_LABELS`.
- `CURATED` (20), `POPULAR_GUTENBERG` (140), `STANDARD_EBOOKS` (9, mapped to `id: se-<slug>` with
  `source: 'standardebooks'` and a `textUrl` ending in `/text/single-page`).
- `catalogKey()` and `LOCAL_CATALOG` dedupe; attach `seFallback` by title+author.
- Utilities: `$`, `$$`, `clamp`, `escapeHtml`, `debounce`, `uid`, number/author/title formatting,
  `normalizeWord`, `tokenizeWords`, `sentenceAround`, `relativeTime`, `dueLabel`, `statusOf`,
  `prefersReducedMotion`, `fetchWithTimeout`, `fetchJson`, `fetchGutendex`.

**Accept:** `LOCAL_CATALOG.length === 165` (20 + 140 + 9 minus 4 duplicate title/author pairs);
the hero `#offline-count` reads `165`.

### Stage 4 — State and settings

- `defaultState()` exactly as in [ARCHITECTURE §10](ARCHITECTURE.md#10-state-and-persistence).
- `sanitizeSettings()`, `normalizeBankEntry()`, `mergeState()`, `loadState()`, `saveStateNow()`,
  `saveStateSoon()` (250 ms debounce).
- `ui` object with view, search, currentBook, bookData, currentPage, progressPercent,
  pageRenderToken, loadingBook, drawer, popup, textCache, dictCache, rsvp, review, teleprompter,
  tts, lastFocus, ignoreHash.
- `applySettings()`, `syncSettingsUI()`, `setSetting()` (repaginate, rerender, mode switch),
  `updateBionicUI()`, `updateModeUI()`, `updateAmbientUI()`.

**Accept:** reload preserves theme, font, size, leading, page-turn choice and TTS settings; a
corrupt `localStorage` value falls back to defaults instead of throwing.

### Stage 5 — Search and local-first catalogue

Implement `searchLocalCatalog`, search cache (7 days / 40 entries), `normalizeGutendexBook`,
`renderCurated`, `renderCatalogShelf`, `bookCard` (cover image with fallback and error removal),
`performSearch`, `loadMoreResults`, `clearSearch`, `renderSearchError`.

`performSearch` must paint local + cached results before the API call, set
`Searching the full Gutendex catalogue…` only when there is nothing local, discard stale responses
by `requestId`, and merge rather than replace.

**Accept:** a search for `persuasion` paints a local card immediately; `browse all local books`
makes no Gutendex request; blocking the network leaves the local results usable.

### Stage 6 — Text fetching, cleaning, chapters

Implement `looksLikeBook`, `fetchText`, `fetchHtml`, `TextCacheDB`, `gitenbergUrl`,
`deriveRepoSlugs`, `resolveGitenbergRepos`, `getBookText`, `cleanGutenbergText`, `parseChapters`,
`trimTitlePage`, `trimLeadingMatter`, and `extractStandardEbooksText`.

Order the attempts exactly as §5.1 of ARCHITECTURE. Do not trust a 200 HTML error page: run
`looksLikeBook` before cleaning. Persist cleaned text only after it passes the 500-character floor.

**Accept:** open a curated Gutenberg book and a Standard Ebooks book; page 1 contains prose, not a
Gutenberg header, title page or table of contents; reopening is served from IndexedDB.

### Stage 7 — Pagination

Implement `splitLongBlock`, `computePageLayout`, `paginate`, `pageAtPercent`, `buildRsvpWords`.
Use the formulas in [ARCHITECTURE §6](ARCHITECTURE.md#6-pagination-model). Each page must record
`index`, `chapterIndex`, `chapterTitle`, `blocks`, `chars`, `chapterStart`, `text`, `startWord`,
`endWord`.

**Accept:** at 19 px / 1.65, every `.page-body` has `scrollHeight <= clientHeight + 1`; changing
font size repaginates after ~260 ms and keeps the reading percentage.

### Stage 8 — Reader rendering and modes

Implement `openBook`, `openBookById`, `updateReaderHeader`, `renderChapterSelect`,
`renderCurrentView`, `pageHTML`, `noDropCap`, `renderPage`, `renderScroll`, `blocksToHtml`,
`blockToHtml`, `inlineTextHtml`, `isSubheading`, `isPoemBlock`, `currentPercent`, `updateProgress`,
`navigate`, `goToPage`, `jumpToChapter`, `switchMode`, `scheduleRepaginate`.

`openBook` must render, wait 60 ms, re-paginate against the measured body, and only then hide the
loading overlay if the count changed. `renderPage` must insert the incoming sheet underneath and
clean up to one sheet at 820 ms.

**Accept:** next/prev animates in both directions and leaves one `.page-sheet`; flipping mode keeps
the same percentage; reopening resumes the saved page/scroll position; no blank viewport after
toggling page-turn in settings.

### Stage 9 — Bionic, dictionary, Word Bank, notes

Implement `bionicText`, `bionicWord`, dictionary cache, `lookupWord`, `fetchDictionaryEntry`,
`setupReaderSelection`, `wordInfoAtPoint`, `wordInfoFromSelection`, context extraction, popup,
add/remove bank, bank rendering, `gradeWord`, review modal, notes.

**Accept:** double-clicking a bionic prefix looks up the whole word; an added word gets the
surrounding sentence; Good moves New → Practicing with +1 day; notes survive reload.

### Stage 10 — RSVP, teleprompter, ambient

Implement `openRsvp` … `closeRsvp`, `toggleTeleprompter` … `toggleTeleprompterPause`, and the
`Ambient` object. RSVP starts at the current page's `startWord`; teleprompter forces scroll mode;
ambient starts only after a gesture and resets to off on a fresh load.

**Accept:** RSVP steps at the selected wpm, pauses/resumes with Space, and ends with a toast; manual
wheel pauses teleprompter; all three ambience types start and stop without console errors.

### Stage 11 — Read aloud (TTS)

Implement the TTS section in this order:

1. Constants and capability checks (`TTS_MAX_CHUNK = 220`, name lists, `ttsSupported`, `ttsVoices`,
   `ttsIsLocal`, `ttsInferGender`, `ttsIsNovelty`, language labels).
2. Voice selection and picker (`ttsAutoVoice`, `ttsSelectedVoice`, `populateTtsVoices`,
   `previewTtsVoice`).
3. Sentence splitting (`splitIntoSentences`, `ttsPushSentences`).
4. DOM wrapping (`ttsTextNodes`, `ttsOffsetPoint`, `ttsWrapBlock`, `ttsPageContainer`,
   `ttsCollectElements`, `ttsLoadPage`, `ttsFirstVisibleIndex`).
5. Playback (`startTts`, `stopTts`, `toggleTts`, `toggleTtsPause`, `ttsSpeakCurrent`, `ttsStep`,
   `ttsGoToPage`, `ttsAdvancePage`, `ttsReachedEnd`).
6. Integration (`ttsOnPageRendered` from both renderers, `ttsSyncHud`, `ttsClearHighlight`,
   `ttsHighlight`, `ttsHighlightWord`, `ttsScrollIntoView`, `ttsOnSurfaceClick`).
7. Settings and shortcuts: `ttsRate` (0.5–2), `ttsVoice` (voiceURI, ≤300 chars),
   `ttsAutoAdvance`, `#tts-voice`, `#tts-preview`, `#tts-refresh-voices`, `L`, Space.

**Accept:** start, pause, resume, next/previous sentence, auto page advance, manual page change,
scroll mode, bionic mode, poem lines, click-to-jump, stop, and reload persistence all work with a
stubbed speech engine; no console errors.

### Stage 12 — Routing, export/import, build provenance

Implement `setHash`, `showLibrary`, `showReader`, `updateContinueBanner`, `updateNav`,
`handleRoute`, `exportState`, `importState`, `loadBuildState`, `openBuildState`.

**Accept:** `#read/<id>` reopens a book; export downloads a JSON with `exportedAt` and `app`;
import validates and resets to the library; footer reads a summary from `state.json`.

### Stage 13 — Events, keyboard, help, boot

Implement `setupEvents`, `isTypingTarget`, `handleKeydown`, `init`. Required shortcuts:
`←`/`→`, `B`, `R`, `L`, `T`, `S`, `W`, `N`, `/`, `?`, `Esc`, `Space`, `Ctrl/Cmd+S`.

**Accept:** every shortcut works in the reader; typing in search/notes does not trigger single-key
shortcuts; Escape closes popup → RSVP → modal → drawer → teleprompter → TTS in that order.

### Stage 14 — Documentation, checks, deploy

Create `README.md`, `AGENTS.md`, `docs/{ARCHITECTURE,REPRODUCTION,DEPLOYMENT,TESTING}.md`,
`scripts/check.mjs`, `CHANGELOG.md`, policies, `.github/` files, `.nojekyll`, `state.json`/`STATE.md`.
Copy the three source files byte-for-byte into
`skills/gutenberg-reader-studio/assets/template/`.

**Accept:** `node scripts/check.mjs` prints `OK <n> checks`; Pages serves root, CSS, JS and
`state.json` with 200.

## 7. Where the non-obvious numbers came from

| Number | Value | Origin / reason |
| --- | --- | --- |
| Catalogue counts | 20 / 140 / 9 → 165 | 20 curated classics from the brief; 140 popular Gutendex entries captured into the local shelf; 9 Standard Ebooks editions; four duplicate title/author pairs collapse |
| Font size range | 14–32 px | Product brief |
| Line height range | 1.2–2.2 | Product brief |
| RSVP range / default | 150–500 wpm / 260 | Product brief; 260 is a comfortable adult default |
| RSVP punctuation hold | ×1.6 | Longer pause at sentence ends without a second timer |
| RSVP long-word hold | ×1.18 | Words over 11 characters need more fixation time |
| RSVP ORP | `ceil(length × 0.34) − 1` | Puts the recognition point slightly left of centre |
| Bionic bold ratio | `ceil(letters × 0.42)` | Matches "first ~42 % of letters" in the README; at least one letter |
| TTS chunk | 220 characters | Short enough for reliable pause/resume and Chrome engines that stall on long utterances |
| TTS rate | 0.5–2.0, default 1.0 | Platform speech rate units |
| Glyph width estimate | `0.5 × fontSize` | Conservative average for proportional serif/sans; generates `charsPerLine` |
| Paragraph gap | `0.92 × fontSize × lineHeight` | Matches the CSS `margin-bottom: 0.92em` |
| Chapter heading reserve | `7.2 × fontSize` | Kicker + h2 + margins on a chapter-opening page |
| Page body fallback | width −116, height −150 | Page padding + running head when `.page-body` is not measurable |
| Line floor / block floor | 24 chars, 300 chars | Prevents pathological one-word pages in narrow layouts |
| Save debounce | 250 ms | Batches scroll/progress writes |
| Repaginate debounce | 260 ms | Lets a slider settle before reflow |
| Page count check delay | 60 ms | Enough for the first sheet to lay out |
| Page-turn duration | 0.8 s CSS / 820 ms JS cleanup | Cleanup must outlive the animation |
| Page-turn angle | 0 → −96° | Past 90° sells a lifted page without showing a mirrored back face |
| Perspective | 3200 px | Strong foreshortening without extreme distortion |
| Mobile default | `innerWidth > 720` for page mode | Phones read better in scroll |
| Search cache | 7 days, 40 entries | Catalogue results are stable for days; cap protects localStorage |
| Dictionary cache | 30 days, 150 entries | Definitions are stable; cap protects localStorage |
| Text cache version | 3 | Bump to invalidate every IndexedDB record after a parser change |
| SRS ladder | 1, 3, 7, 14, 30, 60 days | Fixed, explainable intervals; not SM-2 |
| Again interval | 10 minutes | Same-session relearning |
| Teleprompter factor | `speed × 2.2 × Δms / 1000` | 30 → ~66 px/s, comfortable at default type |
| Fetch timeouts | 8–25 s | Relays 8 s, Gutendex 9–12 s, text 14–15 s, XHTML 25 s |
| Theme colours | `#FBF9F5`, `#F4ECD8`, `#1E222A`, `#000000` | Product brief |
| TTS preview text | "The quick brown fox…" | Contains varied phonemes and fits one utterance |

## 8. Verification procedure

```bash
cd ~/Projects/gutenberg-reader-studio
node --check script.js
node scripts/check.mjs
python3 -m http.server 8000
```

Expected: `node --check` prints nothing; `scripts/check.mjs` prints `OK <n> checks` and exits 0.
Then run the manual matrix in [TESTING.md](TESTING.md). Minimum release sequence:

1. Search `persuasion`; confirm a local card appears before the network result.
2. Open *Pride and Prejudice*; page 1 is prose with a running head and page number.
3. Turn pages forward and back; the outgoing sheet hinges left and one sheet remains.
4. Toggle scroll mode and back; the percentage is preserved.
5. Press `L`; narration starts, the sentence highlights, `Space` pauses, next/previous steps.
6. Let a page finish with auto-advance on; the next page loads and narration continues.
7. Manually turn a page while listening; narration reloads on the new page.
8. Double-click a word; the definition card opens; add it with context; grade it Good.
9. Reload; book, page, settings and Word Bank are restored.
10. Export, reset data, import; library returns.
11. At 390×844 there is no horizontal overflow and the reader defaults to scroll.
12. Open a Standard Ebooks title (e.g. *Persuasion*) and a Gutenberg-only title; both paginate.

## 9. What was tried and rejected

From the build sessions (2026-11-01 and 2026-11-02):

- **Direct Gutenberg `text/plain` fetch** — blocked by missing CORS headers. Rejected as primary;
  GITenberg on `raw.githubusercontent.com` became the primary source, with Gutenberg and CORS relays
  as fallbacks.
- **Unreliable GITenberg repo naming** — a title-derived slug does not always exist. Added the
  GitHub repository search for `<id> in:name org:GITenberg`, then up to six derived `slug_id`
  candidates and four file-name variants.
- **Odyssey falling through to a slow relay** — the curated entry pointed at a Gutenberg text URL;
  fixed by resolving it to the Standard Ebooks Bryant translation (`seSlug`) and using `seFallback`
  before the network chain.
- **Genre bar disappearing with search results** — the chip row was inside the curated shelf that
  gets hidden; moved outside the shelf sections (commit `6d0bcb5`).
- **Page count changing after open** — the first pagination ran before fonts/layout settled. Fixed
  by a second measured pagination 60 ms after the first render, before the loading overlay hides.
- **Standard Ebooks chapter headings dropped** — the skip rule treated headings inside a
  `header`/front-matter container as navigation; relaxed to retain `h1–h3` while still skipping TOC,
  colophon, notes and back matter.
- **Toggling page-turn produced an empty scroll viewport** — `setSetting` called
  `switchMode(..., {silent:true})`, which updated visibility without rendering. Fixed by letting
  `switchMode` render; this was an existing bug found during TTS work.
- **Long TTS utterances stalling or dropping** — Chrome can fail on very long utterances. Rejected
  whole-page speech; adopted a 220-character sentence chunk with punctuation-aware splitting.
- **Speech callbacks firing after cancel** — `speechSynthesis.cancel()` emits `end`/`error`; without
  a token guard the next sentence could double-speak or resume after stop. Adopted
  `ui.tts.token` and the `interrupted` / `canceled` error filter.
- **Word-level highlight as the primary cue** — unsupported in some browsers. Rejected as a
  requirement; sentence highlight is the baseline, word highlight is a Custom Highlight API
  enhancement.
- **A voice list restricted to local voices** — too few choices on some platforms. Rejected;
  the picker lists all voices, groups by accent, labels on-device vs online, and automatic mode
  still prefers local.
- **Saving the full book text in `localStorage`** — quota pressure. Rejected; IndexedDB stores text,
  `localStorage` stores progress and metadata only.

## 10. Honest deviations and unfinished parts

| Item | State |
| --- | --- |
| EPUB import | Not implemented; Standard Ebooks XHTML is not an EPUB container reader |
| Offline app shell | No service worker; first load requires network |
| Offline dictionary | Not built; only previously cached definitions resolve offline |
| `stats.readingSeconds` | Exported, never incremented |
| Non-English catalogue | Not surfaced; Gutendex requests are fixed to `languages=en` |
| Translation / i18n | None; English UI only |
| TTS word highlight | Requires CSS Custom Highlight API; silent fallback |
| TTS background playback | Browser-dependent; tab throttling can pause narration |
| Voice gender labels | Name-list heuristic, not metadata |
| Pagination | Estimate-based; unusual typography can overflow and scroll within a page |
| Browser coverage | Chrome built-time checks only; Safari/Firefox not automated |
| Screenshots | Captured during the build; not regenerated by `scripts/check.mjs` |
| Release tag | None; `APP.version` is 1 and Pages tracks `main` |

## 11. Where to change what

| Change | Files |
| --- | --- |
| Catalogue entries | `script.js` (`CURATED`, `POPULAR_GUTENBERG`, `STANDARD_EBOOKS`) |
| Text sources / timeouts | `script.js` (`getBookText`, `fetchWithTimeout`) |
| Cleaning / chapter heuristics | `script.js` (`cleanGutenbergText`, `parseChapters`, `extractStandardEbooksText`) |
| Pagination constants | `script.js` (`computePageLayout`, `paginate`) |
| Page-turn motion | `style.css` keyframes + `script.js` `renderPage` cleanup |
| Themes / typography | `style.css` tokens + `script.js` `THEME_META`, `FONT_STACKS` |
| Read-aloud | `script.js` TTS section + `#tts-*` controls in `index.html` |
| Word Bank / SRS | `script.js` vocabulary section + `README.md` table |
| Persistence | `script.js` `defaultState`, `mergeState`, cache TTLs |
| Shortcuts | `script.js` `handleKeydown` + help modal |
| Checks | `scripts/check.mjs` |
| Docs / skill | `AGENTS.md`, `docs/`, `skills/gutenberg-reader-studio/` |
| Deployment | `docs/DEPLOYMENT.md` |

## 12. Handoff checklist

- [ ] `node --check script.js` passes.
- [ ] `node scripts/check.mjs` prints `OK <n> checks`.
- [ ] `python3 -m http.server 8000` serves the app and the reader opens a book.
- [ ] Read-aloud starts, pauses, steps and advances a page.
- [ ] The skill template matches the three source files byte-for-byte.
- [ ] `git remote -v` points at the expected repository.
- [ ] The live site returns 200 for root, `style.css`, `script.js`, `state.json`.
- [ ] `state.json` / `STATE.md` are treated as history, not runtime state.
- [ ] No credentials, tokens or personal data are staged.
