# Architecture

This document maps the released source. It describes **what the code does now**, not an ideal
design. Read [REPRODUCTION.md](REPRODUCTION.md) for the build order and [TESTING.md](TESTING.md) for
what was verified.

## 1. Files and load order

```text
index.html          semantic shell, controls, drawers, modals; loads style.css and script.js
style.css           design tokens, reader themes, page-turn keyframes, responsive rules
script.js           all application logic, one top-level 'use strict' script
state.json          historical build record, fetched only for the footer provenance line
STATE.md            human-readable build record
favicon.svg         inline-style mark
.nojekyll           GitHub Pages passthrough
```

There is no build step, package manager, module graph or service worker. `script.js` is declared
`defer`, so it executes after the DOM is parsed; `init()` runs immediately if
`document.readyState !== 'loading'`, otherwise on `DOMContentLoaded`.

`window.GutenbergStudio` exposes a read-only debug surface: `state`, `book`, `view`, `openBook`,
`openRsvp`, `performSearch`, `version`. It is intentionally not a mutation API.

## 2. Module map (`script.js`)

| Section | Key identifiers | Responsibility |
| --- | --- | --- |
| Constants | `APP`, `DAY`, `TEXT_CACHE_VERSION`, `SRS_INTERVALS`, `SRS_LABELS`, `THEME_META`, `FONT_STACKS`, `TOPIC_LABELS` | Version, storage keys, cache TTLs, fixed SRS ladder, theme colours |
| Catalogue | `CURATED`, `POPULAR_GUTENBERG`, `STANDARD_EBOOKS`, `catalogKey`, `LOCAL_CATALOG`, `STANDARD_EBOOKS_BY_TITLE` | 20 curated + 140 popular + 9 Standard Ebooks entries, deduped by `title|author` |
| Utilities | `$`, `$$`, `clamp`, `escapeHtml`, `debounce`, `uid`, `coverUrl`, `formatAuthors`, `normalizeWord`, `tokenizeWords`, `sentenceAround`, `relativeTime`, `dueLabel`, `statusOf`, `prefersReducedMotion` | DOM and text helpers |
| Network | `fetchWithTimeout`, `fetchJson`, `fetchGutendex` | AbortController timeouts; Gutendex needs no JSON proxy |
| State | `defaultState`, `sanitizeSettings`, `normalizeBankEntry`, `mergeState`, `loadState`, `saveStateNow`, `saveStateSoon`, `ui` | Validated persistence and in-memory UI state |
| Settings | `applySettings`, `syncSettingsUI`, `setSetting`, `updateBionicUI`, `updateModeUI`, `updateAmbientUI` | CSS variables, theme meta, control sync, repagination |
| Search | `searchLocalCatalog`, `searchCacheKey`, `loadSearchCache`, `getCachedSearch`, `saveSearchCache`, `normalizeGutendexBook`, `renderCurated`, `renderCatalogShelf`, `bookCard`, `performSearch`, `loadMoreResults`, `clearSearch` | Local-first catalogue plus Gutendex |
| Text engine | `looksLikeBook`, `fetchText`, `fetchHtml`, `extractStandardEbooksText`, `TextCacheDB`, `gitenbergUrl`, `deriveRepoSlugs`, `resolveGitenbergRepos`, `getBookText`, `cleanGutenbergText`, `isChapterHeading`, `parseChapters`, `trimTitlePage`, `trimLeadingMatter` | Source chain, cleaning, chapter blocks |
| Pagination | `splitLongBlock`, `computePageLayout`, `paginate`, `pageAtPercent`, `buildRsvpWords` | Measured page model and global word index |
| Reader | `openBook`, `openBookById`, `updateReaderHeader`, `renderChapterSelect`, `renderCurrentView`, `pageHTML`, `renderPage`, `renderScroll`, `blocksToHtml`, `blockToHtml`, `inlineTextHtml`, `navigate`, `goToPage`, `jumpToChapter`, `switchMode`, `scheduleRepaginate` | Page-turn and scroll rendering, navigation, mode conversion |
| Bionic | `bionicText`, `bionicWord` | Bold-prefix spans with `data-word` for whole-word lookup |
| Vocabulary | `loadDictCache`, `persistDictCache`, `lookupWord`, `fetchDictionaryEntry`, `setupReaderSelection`, `wordInfoAtPoint`, `wordInfoFromSelection`, `contextFromElement`, `contextFromNode`, `showWordPopup`, `addCurrentWordToBank`, `removeWordFromBank`, `bankEntries`, `renderWordBank`, `gradeWord`, `openReview`, `renderReview`, `handleReviewGrade` | Selection → definition → Word Bank → SRS review |
| Notes | `noteBookIds`, `renderNotes`, `saveNote`, `editNote`, `deleteNote` | Per-book/page notes stored in state |
| RSVP | `openRsvp`, `rsvpWord`, `renderRsvpWord`, `scheduleRsvpTick`, `playRsvp`, `pauseRsvp`, `stepRsvp`, `closeRsvp` | One-word display, ORP alignment, timed advance |
| Teleprompter | `toggleTeleprompter`, `startTeleprompter`, `teleprompterStep`, `stopTeleprompter`, `toggleTeleprompterPause` | `requestAnimationFrame` auto-scroll in scroll mode |
| TTS | constants `TTS_MAX_CHUNK`, `TTS_PREVIEW_TEXT`, `TTS_FEMALE_NAMES`, `TTS_MALE_NAMES`, `TTS_NOVELTY_NAMES`; `ttsSupported`, `ttsVoices`, `ttsIsLocal`, `ttsInferGender`, `ttsAutoVoice`, `ttsSelectedVoice`, `populateTtsVoices`, `previewTtsVoice`, `splitIntoSentences`, `ttsPushSentences`, `ttsWrapBlock`, `ttsCollectElements`, `ttsLoadPage`, `startTts`, `stopTts`, `toggleTts`, `toggleTtsPause`, `ttsSpeakCurrent`, `ttsStep`, `ttsGoToPage`, `ttsAdvancePage`, `ttsOnPageRendered`, `ttsSyncHud`, `ttsHighlight`, `ttsHighlightWord`, `ttsScrollIntoView`, `ttsOnSurfaceClick` | Read-aloud narration |
| Ambient | `Ambient` object (`ensureContext`, `noiseBuffer`, `start`, `scheduleCrackle`, `stop`, `setVolume`) | Rain/café/fireplace Web Audio graph |
| Shell | `openDrawer`, `closeDrawers`, `openModal`, `closeModal`, `toast`, `showLoading`, `setLoadingStep`, `hideLoading`, `setHash`, `showLibrary`, `showReader`, `handleRoute` | Navigation and overlays |
| Data exchange | `exportState`, `importState`, `loadBuildState`, `openBuildState` | JSON Blob download, validated import, provenance |
| Boot | `setupEvents`, `handleKeydown`, `init` | Event wiring, shortcuts, first render |

## 3. Boot sequence

```text
DOMContentLoaded
  └─ init()
       1. Clear a persisted ambient choice (audio cannot autostart without a gesture).
       2. applySettings()          theme, --reader-size, --reader-leading, --reader-font, meta
       3. setupEvents()            all button/input/scroll/route listeners
       4. setupReaderSelection()   dblclick, mouseup, touchend on #reading-surface
       5. populateTtsVoices()      build the #tts-voice optgroups
       6. speechSynthesis 'voiceschanged' → populateTtsVoices
       7. renderCurated(), renderCatalogShelf()
       8. renderWordBank(), renderNotes(), updateContinueBanner(), updateNav()
       9. loadBuildState()         GET state.json (no-store), footer summary only
      10. handleRoute()            #read/<id> → openBookById(); otherwise showLibrary()
```

No book is fetched at boot. `handleRoute()` only reopens a saved book or resolves `#read/<id>` from
the local catalogue, Gutendex metadata, or the saved library.

## 4. Data flow

### 4.1 Search

```text
performSearch(query, {topic, page, append, localOnly})
  ├─ searchLocalCatalog(query, topic)          synchronous, over LOCAL_CATALOG + opened books
  ├─ getCachedSearch(...)                      localStorage, 7 days
  ├─ render merge(local, cached)               immediate first paint
  ├─ if localOnly → stop
  └─ fetchGutendex(https://gutendex.com/books/?languages=en&search=…&topic=…&sort=…)
        ├─ success → normalizeGutendexBook → mergeBookLists(local, api) → saveSearchCache
        └─ failure → mergeBookLists(local, cached) or renderSearchError
```

`requestId` increments on each search; late responses whose id no longer matches are discarded.
`loadMoreResults()` follows `data.next` from Gutendex and appends through the same merge.
`searchLocalCatalog()` matches every whitespace-separated query token against
`title + author + subjects + bookshelves` and sorts by `downloads` then title.

### 4.2 Open a book

```text
openBook(book)
  ├─ stopTts()
  ├─ state.library.activeBookId = id; books[id] = {…, lastOpened, progress}
  ├─ getBookText(book)                 memory → IndexedDB → source chain
  ├─ parseChapters(rawText)            headings + block arrays
  ├─ paginate(chapters, layout)        ui.bookData.pages
  ├─ restore progress                  page / scrollPercent / percent
  ├─ showReader(); renderCurrentView()
  ├─ wait 60 ms
  ├─ paginate() again against the measured .page-body
  └─ if page count changed, keep the percentage and re-render
```

`ui.bookData = {book, chapters, pages, rsvpWords}`. `rsvpWords` is a flat token list built from all
pages; `page.startWord` / `page.endWord` map any RSVP index back to a page.

### 4.3 Render

**Page mode** (`state.settings.pageTurn === true`): `renderPage(index, direction)` replaces the
single `.page-sheet` in `#page-viewport`, or animates the outgoing sheet. **Scroll mode**:
`renderScroll()` writes every page as `<section class="scroll-page" data-page-index="…">`, then
restores the saved percentage by `offsetTop` (or a fraction of `scrollHeight`). Scrolling updates
`ui.progressPercent` and derives `ui.currentPage` from the section crossing 35 % of the viewport.

`renderCurrentView()` hides the unused viewport; `updateProgress()` writes the bar, page label,
chapter label, button disabled states, and persists progress.

## 5. Text sources and parsing

### 5.1 Source chain (`getBookText`)

1. `ui.textCache` (in-memory `Map`, keyed by book id).
2. `TextCacheDB.get(id)` — IndexedDB, record `{text, savedAt, version}`; a record whose `version`
   is not `TEXT_CACHE_VERSION` (3) is ignored.
3. If `book.source === 'standardebooks'` and `book.textUrl` exists, fetch and parse XHTML directly.
   Failure is terminal for that book (wrapped error with the book attached).
4. If `book.source === 'catalog'` and a `seFallback` exists, try that Standard Ebooks edition first.
5. Build an ordered attempt list:
   - explicit GITenberg `repo` + `textFile`;
   - `resolveGitenbergRepos()` → GitHub repository search
     (`api.github.com/search/repositories?q=<id>+in:name+org:GITenberg`) → derived slugs
     `<slug>_<id>` from `deriveRepoSlugs()`;
   - file variants `id.txt`, `id-0.txt`, `id-8.txt`, `pg<id>.txt` for up to five repositories;
   - `book.textUrl`, then three `gutenberg.org/cache|files` URLs;
   - AllOrigins and CodeTabs CORS relays for the primary and cache URLs.
6. Each attempt goes through `fetchText()` → `looksLikeBook()` → `cleanGutenbergText()` and must
   yield at least 500 characters. Success is written to both caches.

Timeouts: Gutendex search 9 s/12 s, GitHub repo search 8 s, Standard Ebooks 25 s, normal text 14–15 s,
CORS relays 8 s. `fetchWithTimeout()` uses `AbortController`.

`looksLikeBook()` rejects bodies under 800 characters, anything whose first 400 characters look like
HTML/Cloudflare/an error page, and anything with a letter ratio ≤ 0.35.

### 5.2 Plain-text cleaning (`cleanGutenbergText`)

- Normalise BOM, CRLF, NBSP, trailing spaces.
- Slice between `*** START OF … PROJECT GUTENBERG EBOOK ***` and `*** END OF … ***`.
- Remove `Produced by…`, `Transcriber's note…`, `[Illustration…]`, short bracketed notes,
  trailing `End of Project Gutenberg…` / `THE END`, duplicate spaces and 3+ newlines.
- Drop standalone page numbers (`123`, `Page 123`) and short `Project Gutenberg` running heads.
- Return trimmed text.

### 5.3 Chapter parsing (`parseChapters`)

Blocks are separated by blank lines. A block is a heading when it is ≤120 characters, single-line,
and matches one of:

- `CHAPTER|BOOK|PART|ACT|SCENE|SECTION|LETTER|CANTO` + roman/arabic/uppercase numeral;
- `PROLOGUE|EPILOGUE|INTRODUCTION|PREFACE|FOREWORD|AFTERWORD|CONCLUSION|APPENDIX|DEDICATION`
  (under 70 characters);
- a standalone roman numeral;
- an all-caps line of 4–80 characters, ≤10 words, containing at least three consecutive capitals
  and no terminal punctuation.

`trimTitlePage()` drops a leading title/TOC chapter that has no prose block, or skips up to four
leading title-like blocks inside the first chapter. `trimLeadingMatter()` drops front matter before
the first real chapter only when it contains fewer than 10 blocks. If no chapter is found the whole
text becomes one `Full Text` chapter.

### 5.4 Standard Ebooks XHTML

`extractStandardEbooksText(html)`:

- `DOMParser.parseFromString(html, 'text/html')`, then `<main>` or `<body>`.
- Skip any node inside `nav`, `footer`, `aside`, non-heading `header`, or an ancestor whose
  `id` / `epub:type` / class matches `toc|colophon|uncopyright|copyright|imprint|titlepage|endnotes|loi|backmatter|frontmatter`.
- Collect `h1–h3`, `p`, `li`; collapse whitespace; skip empty/non-alphanumeric nodes.
- Roman-numeral headings become `CHAPTER <numeral>`; other headings ≤140 characters stay headings.
- Drop adjacent duplicate blocks; join with blank lines.

The result goes through `parseChapters()` like Gutenberg text — **there is no EPUB container
parsing**, only single-page XHTML. `textUrl` is
`https://standardebooks.org/ebooks/<slug>/text/single-page`.

## 6. Pagination model

`computePageLayout()` measures the live `.page-body` when it is at least 200×200 CSS pixels;
otherwise it estimates from `#page-viewport` minus 116 px width / 150 px height, with floors of
260 px and 240 px.

```text
fontSize      = state.settings.fontSize            // 14–32
lineHeight    = state.settings.lineHeight           // 1.2–2.2
lineHeightPx  = fontSize * lineHeight
charsPerLine  = max(24, floor(width / (0.5 * fontSize)))
paragraphGap  = 0.92 * fontSize * lineHeight
headingHeight = fontSize * 7.2
maxBlockChars = max(300, charsPerLine * max(4, floor(height / lineHeightPx) - 1))
```

`paginate(chapters, layout)` walks chapters and blocks:

```text
for each block:
  chunk long blocks at sentence boundaries (splitLongBlock)
  lines       = max(1, ceil(chunk.length / charsPerLine))
  blockHeight = lines * lineHeightPx + paragraphGap
  if page already has blocks and usedHeight + blockHeight > height → flush page
  add chunk; usedHeight += blockHeight (+ headingHeight on the first block of a chapter)
```

Each page carries `{index, chapterIndex, chapterTitle, blocks, chars, chapterStart, text,
startWord, endWord}`. `pageAtPercent(percent)` maps a percentage to
`clamp(floor(percent/100 * pageCount), 0, pageCount−1)`. `scheduleRepaginate` is debounced 260 ms
and is triggered by font size, line height, font family, bionic toggles and font-load completion;
it preserves the percentage, not the page number.

**Invariant:** `paginate()` is deterministic for a given `(chapters, layout)`. It does not query the
DOM during the loop, so re-pagination is cheap. The double call in `openBook()` exists because the
first call runs before the reader has real dimensions.

## 7. Page-turn rendering

`pageHTML(page)` emits:

```html
<header class="page-head">…chapter… page n / total</header>
<div class="page-body" data-page-index="n">
  <div class="chapter-heading">…</div>
  <p>…</p>
</div>
```

`renderPage()`:

- **next**: insert the new sheet before the old one with `.is-under`; add
  `.is-turning.is-turning-next` to the old sheet. The old sheet rotates from 0° to −96° around the
  left spine, revealing the new sheet underneath.
- **prev**: mark the old sheet `.is-under`; append the new sheet with
  `.is-turning.is-turning-prev`, animating from −96° to 0°.
- After 820 ms (or immediately with reduced motion), remove every sheet except the new one and strip
  the animation classes. `ui.pageRenderToken` cancels stale cleanups.

CSS: `#page-viewport` has `perspective: 3200px`; `.page-sheet` has `transform-origin: left center`;
the keyframes are `flipPageLeft` / `flipPageInFromLeft` at `0.8s cubic-bezier(0.42, 0, 0.58, 1)`.
`prefers-reduced-motion` disables the animation in both JS and CSS.

`switchMode(pageTurn, {percent})` converts the current position through `currentPercent()`, so a
mode switch does not lose the reader's place. `setSetting('pageTurn', …)` passes the pre-change
percentage explicitly.

## 8. Read-aloud (TTS) pipeline

### 8.1 Sentence model

```text
ttsLoadPage(pageIndex)
  ├─ container = .page-body[data-page-index]      (page mode)
  │              or .scroll-page[data-page-index] (scroll mode)
  ├─ ttsCollectElements(container)                h2, p, h3, blockquote, li, poem lines
  ├─ for each element:
  │    ├─ already data-tts-wrapped="1" → reuse its :scope > .tts-sentence spans
  │    └─ otherwise ttsWrapBlock(element):
  │         ttsTextNodes() → concatenated text + node offsets
  │         splitIntoSentences() → Intl.Segmenter('en', {granularity:'sentence'})
  │                               fallback: /[^.!?…]+…/ regex
  │         ttsPushSentences()  → trim, split anything > 220 chars at
  │                               ". " / "; " / ", " / " — " / " " boundaries
  │         Range.extractContents() → <span class="tts-sentence">
  └─ ui.tts.sentences = [{span, text}, …]
```

Only the current page is wrapped, and only while TTS is active. `ttsCollectElements()` skips
`.page-foot` so running feet are not narrated.

### 8.2 Playback

```text
startTts()
  ├─ guard speechSynthesis support and an open book
  ├─ cancel speech, close RSVP/teleprompter/popup/drawers
  ├─ set active/playing, show #tts-hud, set #quick-tts aria-pressed
  ├─ ttsLoadPage(ui.currentPage); index = 0 (page mode)
  │                                  or first sentence below the viewport top (scroll mode)
  └─ ttsSpeakCurrent()

ttsSpeakCurrent()
  ├─ resolve entry; if its span was replaced, reload the page and retry
  ├─ token = ++ui.tts.token
  ├─ new SpeechSynthesisUtterance(entry.text)
  │    voice = saved voiceURI or ttsAutoVoice()
  │    lang  = voice.lang or 'en-US'
  │    rate  = clamp(settings.ttsRate, 0.5, 2); pitch = 1
  ├─ onboundary → ttsHighlightWord(span, event.charIndex)
  ├─ onend      → if token matches and still playing → ttsStep(1)
  ├─ onerror    → ignore interrupted/canceled; otherwise pause and toast
  ├─ ttsHighlight(index) → .is-speaking + scroll into view
  └─ speechSynthesis.speak(utterance)
```

`ttsStep(δ)`: within the page moves the index; past the end calls `ttsAdvancePage()`, which is
enabled by `settings.ttsAutoAdvance`; before the start calls `ttsGoToPage(pageIndex−1, 'prev',
'last')`. `ttsReachedEnd()` stops and reports whether the book or only the page finished.

`ttsOnPageRendered(pageIndex)` runs from `renderPage()` / `renderScroll()`. If the page change was
requested by TTS (`ui.tts.expectedPage`), it does nothing; a manual page change reloads the
sentences, keeps the same sentence index if the page is unchanged, and resumes or re-highlights.

`ttsHighlightWord()` uses `Range` + `CSS.highlights.set('tts-word', new Highlight(range))`. Browsers
without the Custom Highlight API still get sentence highlighting. `ttsOnSurfaceClick()` jumps to a
clicked sentence when there is no text selection.

### 8.3 Voices

- `ttsAutoVoice()` filters novelty voices, then prefers the browser default if local, a local
  English voice, any local voice, then the default or first voice.
- `populateTtsVoices()` groups voices by `lang`, labels each with inferred gender (name lists) and
  "on this device"/"online", puts default and local voices first, groups novelty voices separately,
  and shows how many voices are on-device.
- `previewTtsVoice()` temporarily pauses active narration, cancels speech, speaks
  `TTS_PREVIEW_TEXT` with the selected voice/rate, then resumes the sentence it was on.
- A saved `ttsVoice` is matched by `voiceURI`; if it is unavailable the UI says so and falls back to
  automatic.

## 9. Vocabulary, notes, RSVP, ambient

- **Selection:** `wordInfoAtPoint()` uses `caretRangeFromPoint` / `caretPositionFromPoint`, expands to
  word characters, respects `.bw` bionic wrappers, and returns `{word, x, y, context}`. Context is
  the sentence from `sentenceAround()` with abbreviation handling.
- **Dictionary:** `lookupWord()` checks `ui.dictCache` (30 days), fetches
  `api.dictionaryapi.dev/api/v2/entries/en/<word>`, retries each part of hyphenated compounds, and
  persists at most 150 entries under `gutenbergStudio.dict.v1`.
- **Word Bank:** entries are normalised by `normalizeBankEntry()` and keyed by lowercase word.
  `gradeWord()` implements Again (+10 min, `intervalIndex = 0`) / Good (next interval) / Easy (skip
  one), with `SRS_INTERVALS = [1,3,7,14,30,60]` days. `statusOf()` is New at 0, Practicing at 1–3,
  Mastered at ≥4 reviews.
- **RSVP:** `rsvpWords` is the flattened token list. The optimal recognition point is
  `ceil(word.length * 0.34) − 1`; the word is centred on that character. Delay is `60000 / wpm`,
  ×1.6 after sentence punctuation, ×1.18 for words longer than 11 characters.
- **Teleprompter:** forced into scroll mode, then `scrollTop += speed * 2.2 * delta / 1000` per
  animation frame, clamped at 64 ms per frame; wheel/touch input pauses it.
- **Ambient:** one `AudioContext`, a 4-second noise buffer (white for rain, brown for café/fireplace),
  biquad filters and gain nodes. Rain = bandpass 2200 Hz + highpass 500 Hz; café = lowpass 760 Hz +
  92 Hz sine murmur; fireplace = lowpass 460 Hz plus scheduled crackle bursts. Volume lives in
  `settings.ambientVolume`.

## 10. State and persistence

`localStorage` key `gutenbergStudio.v1`:

```json
{
  "version": 1,
  "settings": {
    "theme": "paper", "font": "georgia", "fontSize": 19, "lineHeight": 1.65,
    "bionic": false, "pageTurn": true, "rsvpWpm": 260, "popupFontSize": 14,
    "teleprompterSpeed": 30, "ambient": "off", "ambientVolume": 0.45,
    "ttsRate": 1, "ttsVoice": "", "ttsAutoAdvance": true
  },
  "library": {
    "activeBookId": 1342,
    "books": {
      "1342": {
        "id": 1342, "title": "Pride and Prejudice", "author": "Jane Austen",
        "cover": "…", "lastOpened": 1790000000000,
        "progress": { "page": 12, "scrollPercent": 18.4, "percent": 18.4, "chapterIndex": 2, "updatedAt": 1790000000000 }
      }
    },
    "recent": [1342]
  },
  "wordBank": { "wandering": { "word": "wandering", "reviewCount": 1, "intervalIndex": 0, "nextReviewDue": 1790086400000, "status": "practicing" } },
  "notes": { "1342": [{ "id": "note_…", "text": "…", "page": 12, "createdAt": 1790000000000 }] },
  "stats": { "wordsCaptured": 1, "reviews": 1, "readingSeconds": 0 }
}
```

`mergeState()` is the validation boundary: unknown themes/fonts/ambient values fall back, every
numeric setting is clamped, bank entries are rebuilt, notes are filtered and truncated, and library
entries are limited to 30 recent ids. `saveStateSoon()` debounces writes by 250 ms; `saveStateNow()`
writes immediately and warns once on quota failure.

Other stores:

| Store | Key / database | Lifetime | Contents |
| --- | --- | --- | --- |
| Search cache | `gutenbergStudio.searchCache.v1` | 7 days, 40 entries | `{ts, results, next, total}` per query+topic+sort |
| Dictionary cache | `gutenbergStudio.dict.v1` | 30 days, 150 entries | `{ts, data}` per word |
| Book text | IndexedDB `gutenbergStudioText`, store `texts` | until cleared / version bump | `{text, savedAt, version}` keyed by book id |
| Export | `gutenberg_studio_state.json` | user file | full state + `exportedAt` + `app` metadata |

`importState()` accepts a file only if it has at least one of `settings`, `wordBank`, `notes` or
`library`, confirms replacement when both sides hold data, then re-runs `mergeState()`, resets the
open book, and returns to the library.

## 11. Extension points

| Change | Where |
| --- | --- |
| Add a catalogue book | `CURATED`, `POPULAR_GUTENBERG`, or `STANDARD_EBOOKS`; run the dedupe and check the count |
| Add a text source | `getBookText()` attempt list plus a validator; keep CORS and timeout rules |
| Change pagination | `computePageLayout()` / `paginate()`; re-test 14 px and 32 px overflow |
| Add a reading mode | `renderCurrentView()`, `updateModeUI()`, `switchMode()`, then the toolbar/HTML control |
| Add a TTS setting | `defaultState().settings`, `sanitizeSettings()`, `syncSettingsUI()`, the `#settings-drawer` control, `setSetting()` handler |
| Change SRS | `SRS_INTERVALS`, `gradeWord()`, `statusOf()`, README table, and migration in `normalizeBankEntry()` |
| Add a keyboard shortcut | `handleKeydown()` and the `#help-modal` shortcut grid |
| Change persistence | `defaultState()` + `mergeState()`; bump `version` only with a migration |
| Add UI copy | Static markup in `index.html`; dynamic text in the relevant render function |
| Add a check | `scripts/check.mjs`; keep it dependency-free |

## 12. Hard invariants

1. `paginate()` must remain deterministic and side-effect-free.
2. A mode switch must preserve the reading percentage, not the absolute page count.
3. The page-turn animation must leave exactly one `.page-sheet` after 820 ms.
4. TTS must speak one sentence per utterance and must invalidate stale callbacks with
   `ui.tts.token`.
5. Sentence wrapping must only happen while TTS is active; bionic and word lookup must keep working.
6. The app must not write book text into `localStorage`; use IndexedDB.
7. Every runtime network failure must leave the local catalogue usable.
8. `state.json` is read-only history.
