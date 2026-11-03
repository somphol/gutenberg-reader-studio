# Method — build order, data flow and invariants

This is the engineering method behind the template. Read `SKILL.md` first for scope; use this file
when reconstructing or extending the app.

## 1. Non-negotiable architecture

```text
index.html   structure and every control id
style.css    tokens, themes, page sheet, page-turn keyframes, responsive rules
script.js    one 'use strict' script; no modules, no build, no dependencies
```

- No `package.json`, bundler, service worker, framework or runtime audio/image assets.
- State lives in `localStorage` under one versioned key; book text lives in IndexedDB.
- Network access is limited to catalogue/text/dictionary/font/cover endpoints. Every failure must
  degrade to the local shelf and cached data.
- The app is **local-first, not offline-first**. Never claim full offline operation without a
  service worker and a bundled corpus.

## 2. Build order

### Stage A — Shell and design system

1. Write `index.html` with stable ids for search, library grids, reader viewports, quick tools,
   settings, word bank, notes, popup, RSVP, modals, HUDs and toasts.
2. Write `style.css` tokens first (paper/ink/accent), then the page sheet, then the page-turn
   keyframes, then drawers/modals, then responsive breakpoints.
3. Acceptance: no horizontal overflow at 390 px; page sheet has a left spine and a visible page
   stack; reduced-motion turns off the animation.

### Stage B — Catalogue and search

1. Define `CURATED`, `POPULAR_GUTENBERG`, `STANDARD_EBOOKS`.
2. Dedupe by `catalogKey = lowercase(title-before-;|:)|lowercase(author)`.
3. Implement `searchLocalCatalog` as a synchronous filter over the merged local list plus opened
   books; sort by downloads, then title.
4. Implement `performSearch` so the local/cached paint happens before the Gutendex await.
5. Cache API results in `localStorage` for 7 days (40 entries) and discard stale responses with a
   request id.
6. Acceptance: local-only browsing makes no network request; a network failure leaves a usable
   result grid.

### Stage C — Text pipeline

1. `fetchWithTimeout` everywhere (AbortController).
2. `getBookText` order: memory → IndexedDB → Standard Ebooks (if direct) → Standard Ebooks fallback
   (if catalog) → GITenberg → Gutenberg → relays.
3. `looksLikeBook` gate before cleaning.
4. `cleanGutenbergText` for plain text.
5. `extractStandardEbooksText` for single-page XHTML.
6. `parseChapters` + `trimTitlePage` + `trimLeadingMatter`.
7. Cache cleaned text with a schema version.
8. Acceptance: page 1 starts on prose for both a Gutenberg text and a Standard Ebooks title.

### Stage D — Pagination and reader

1. Implement the layout estimate and block accounting (see §3).
2. Build `renderPage` with the page-turn contract and `renderScroll` with per-page sections.
3. Implement `updateProgress` persistence and `switchMode` percentage preservation.
4. Re-paginate after the first render (60 ms) and on typography changes (260 ms debounce).
5. Acceptance: every page body fits; only one `.page-sheet` remains after 820 ms; mode switches
   keep the percentage.

### Stage E — Reading modes

Order matters because each mode builds on the page model:

1. **Bionic** — render-time `<span class="bw" data-word="…"><b>pre</b>fix</span>`; keep the whole
   word for lookup.
2. **Dictionary / Word Bank** — selection → word range → context sentence → cached definition →
   normalised bank entry → SRS grade.
3. **RSVP** — flatten page text into `rsvpWords`, map page start/end, centre the ORP.
4. **Teleprompter** — force scroll mode, `requestAnimationFrame` scroll, pause on wheel/touch.
5. **Ambient** — one `AudioContext`, generated noise, filters, scheduled crackle.
6. **TTS** — last, because it needs rendered sentence spans and page notifications.

### Stage F — TTS

1. Voice discovery and picker; automatic preference for on-device voices.
2. Sentence segmentation and 220-character chunking.
3. Lazy DOM wrapping into `.tts-sentence` spans, only while listening.
4. One utterance per sentence with a token guard.
5. Page advance, manual-page-change resync, click-to-jump, HUD, highlighting.
6. Persist `ttsRate`, `ttsVoice`, `ttsAutoAdvance` through `sanitizeSettings`.

### Stage G — Persistence, exchange, release

1. `defaultState` + `mergeState` are the only entry points for stored data.
2. Debounced save (250 ms); immediate save on reviews and import.
3. Export a Blob with `exportedAt` and `app` metadata; validate imports before replacing state.
4. Add `scripts/check.mjs`, docs, `AGENTS.md`, skill, `.nojekyll`.
5. Publish Pages from `main` / root and verify HTTP 200 for root, CSS, JS and `state.json`.

## 3. Pagination math

```text
pageWidth, pageHeight = measured .page-body, or viewport − 116 / − 150
charsPerLine   = max(24, floor(pageWidth / (0.5 * fontSize)))
lineHeightPx   = fontSize * lineHeight
maxBlockChars  = max(300, charsPerLine * max(4, floor(pageHeight / lineHeightPx) - 1))
paragraphGap   = 0.92 * fontSize * lineHeight
headingHeight  = fontSize * 7.2
```

For each block chunk:

```text
lines       = max(1, ceil(chunk.length / charsPerLine))
blockHeight = lines * lineHeightPx + paragraphGap
if blocks.length && usedHeight + blockHeight > pageHeight → flush
```

`splitLongBlock()` breaks over-long paragraphs at sentence boundaries. The page model is an
estimate; the browser still lays out the text. The second measured pass on open is what keeps the
visible page count stable.

## 4. Page-turn contract

```text
next: insert incoming .page-sheet.is-under before the old sheet
      old sheet += .is-turning.is-turning-next   (rotateY 0 → −96°)
prev: old sheet += .is-under
      append incoming .page-sheet.is-turning.is-turning-prev (rotateY −96° → 0)
after 820 ms: remove every sheet except the incoming one; strip animation classes
```

- CSS duration is 0.8 s; JS cleanup must be later (820 ms).
- `ui.pageRenderToken` prevents an older timeout from deleting a newer sheet.
- Reduced motion skips the animation and replaces the sheet immediately.

## 5. TTS contract

```text
startTts
  └─ ttsLoadPage(currentPage)
       └─ collect p/h3/blockquote/li/poem lines/heading
            └─ splitIntoSentences → chunk > 220 chars
                 └─ wrap in .tts-sentence spans
  └─ ttsSpeakCurrent
       ├─ utterance.text = sentence text
       ├─ token = ++ui.tts.token
       ├─ onend → ttsStep(1) if token still current and playing
       └─ onerror → ignore interrupted/canceled; else pause + toast
```

Invariants:

- Never speak a whole page in one utterance.
- Never reuse an utterance after `cancel()`.
- Never wrap text at rest.
- Keep `ui.tts.expectedPage` so TTS-requested page renders do not reload the queue.
- A manual page change must reload sentences and either resume or re-highlight.
- Auto-advance is a setting; with it off, stop at the page boundary with a clear message.

## 6. State schema

```json
{
  "version": 1,
  "settings": { "theme": "paper", "font": "georgia", "fontSize": 19, "lineHeight": 1.65,
                "bionic": false, "pageTurn": true, "rsvpWpm": 260, "popupFontSize": 14,
                "teleprompterSpeed": 30, "ambient": "off", "ambientVolume": 0.45,
                "ttsRate": 1, "ttsVoice": "", "ttsAutoAdvance": true },
  "library": { "activeBookId": 1342, "books": { "1342": { "progress": { "page": 12, "percent": 18.4 } } }, "recent": [1342] },
  "wordBank": {},
  "notes": {},
  "stats": { "wordsCaptured": 0, "reviews": 0, "readingSeconds": 0 }
}
```

`mergeState()` clamps every setting and rebuilds every bank entry. Add new settings in both
`defaultState()` and `sanitizeSettings()`, or they disappear on reload.

Caches:

| Cache | Key | TTL / cap |
| --- | --- | --- |
| Search | `gutenbergStudio.searchCache.v1` | 7 days, 40 |
| Dictionary | `gutenbergStudio.dict.v1` | 30 days, 150 |
| Text | IndexedDB `gutenbergStudioText` / `texts` | until version bump |

## 7. Local-first rules

- Paint local results synchronously; never block the UI on Gutendex.
- Merge API results into the local list rather than replacing it.
- Show “Searching the full Gutendex catalogue…” only when there is nothing local or cached.
- Keep the bundled shelf large enough to browse without a network.
- Cache opened text so reopening is instant and offline-capable.
- Prefer on-device TTS voices so narration survives a dropped connection.
- Label online-only capabilities honestly (voices, dictionary, covers, fonts).

## 8. Extension recipes

### New reading mode

1. Add state if needed (`defaultState` + `sanitizeSettings`).
2. Add a control and its id.
3. Render in `renderCurrentView` or a dedicated overlay.
4. Stop conflicting modes (`stopTts`, `closeRsvp`, `stopTeleprompter`).
5. Persist the choice and restore it on boot.
6. Add a manual test row to `references/verification.md`.

### New persistence field

1. Add to `defaultState`.
2. Validate in `mergeState` (clamp/whitelist).
3. Write through `saveStateSoon` / `saveStateNow`.
4. Include it in export automatically; confirm import still validates.
5. Never store book text in `localStorage`.

### Parser change

1. Change `cleanGutenbergText` or `extractStandardEbooksText`.
2. Bump `TEXT_CACHE_VERSION`.
3. Re-open one Gutenberg and one Standard Ebooks title; confirm page 1 is prose.
4. Check chapter count and the chapter select.
5. Re-run pagination overflow checks.
