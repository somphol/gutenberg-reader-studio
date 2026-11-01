# Build State

| Field | Value |
| --- | --- |
| Project | Gutenberg Reader Studio & Vocabulary Lab (`gutenberg-reader-studio`) |
| Started | 2026-11-01 01:56:05.063000 UTC |
| Completed | 2026-11-01 07:14:25.251078 UTC |
| Duration | **5h 18m 20s** (19,100.2 seconds) |
| Harness | OpenCode 2.2.5 |
| Model | DeepSeek V4.1 Flash (`opencode-go/deepseek-v4.1-flash`) |
| Session | `ses_e6b2dd0caffeJNXNDXuZvo48oV` |
| Repository | <https://github.com/somphol/gutenberg-reader-studio> |
| Live demo | <https://somphol.github.io/gutenberg-reader-studio/> |

## Token usage

| Metric | Tokens |
| --- | ---: |
| Input | 622,312 |
| Output | 218,223 |
| Reasoning | 181,335 |
| **Total (input + output + reasoning)** | **1,021,870** |
| Cache read | 128,888,320 |
| Cache write | 1,204 |
| Total including cache | 129,911,394 |

> Snapshot taken from the OpenCode session record when the project was packaged at 2026-11-01T07:14:25.251078Z. The final commit/push and closing response occur outside this snapshot. `total = input + output + reasoning`; cache reads/writes are reported separately because they are a subset of context usage.

## What was built

- **Three production files**: `index.html` (651 lines), `style.css` (2,387 lines), `script.js` (7,302 lines). No build step, framework, backend, or database.
- **Local catalogue**: 165 books — 20 curated classics, 140 popular Gutenberg titles, and 8 unique Standard Ebooks editions. A 12-book shelf and a “Browse all local books” view make the catalogue visible.
- **Local-first search**: the local catalogue filters synchronously, Gutendex supplements in the background, and API responses are cached for 7 days. The “Searching the full Gutendex catalogue…” state only appears when neither local nor cached results exist.
- **Standard Ebooks source**: single-page XHTML is stripped of front matter, notes, and colophons, then parsed into chapter headings and prose.
- **Full-text cache**: opened books are stored in IndexedDB so they reopen without another download.
- **Reader**: automatic Gutenberg header/license cleaning, chapter detection, measured pagination, page-turn and continuous-scroll modes, running heads, page numbers, drop caps, poetry blocks, italics, and a reading-position memory.
- **Page turn**: the outgoing page hinges on the spine and swings left, revealing the next page already waiting underneath; Previous swings the earlier page back in from the left.
- **Customization**: four themes, three typefaces, 14–32px font size, 1.2×–2.2× line height, persisted in `localStorage`.
- **Focus modes**: bionic reading with full-word capture, RSVP at 150–500 wpm with ORP alignment, teleprompter auto-scroll, and Web Audio rain/café/fireplace soundscapes.
- **Vocabulary**: dictionary lookup with phonetics/audio, automatic context-sentence extraction, Word Bank with New/Practicing/Mastered status, real timestamp SRS intervals, due queue, flashcard review, and Again/Good/Easy grading.
- **Notes**: per-book/page notes with add, edit, delete, and undo.
- **Persistence**: automatic local state, `gutenberg_studio_state.json` export, and validated import that restores positions, settings, notes, and vocabulary.
- **UI**: editorial paper-and-ink design system, responsive mobile layout, accessible drawers/modals, keyboard shortcuts, reduced-motion support, and a build-provenance link.

## Verification

- 20 curated classics rendered with real Gutenberg cover art and reliable GITenberg text sources.
- Gutendex discovery verified: philosophy topic returned 32 results; search for “yellow wallpaper” returned the correct book and opened a 41-page reading session.
- Arbitrary Gutenberg text fetch verified through the GITenberg/GitHub lookup path when direct Gutenberg CORS requests were blocked.
- Pagination height model verified at 19px and 24px: page body scrollHeight equalled clientHeight (592px) with no page overflow.
- 3D page-turn animation verified: the outgoing page hinges on the spine and swings left, revealing the next page underneath; the deck cleans up to one sheet after the turn.
- Bionic reading verified: 117 word wrappers on page 1; double-clicking a bold prefix looked up the full word (“universally”), not the fragment.
- RSVP verified: starts at the first word of the current page (“It”), advances while playing, pauses/resumes, and updates 150–500 wpm.
- Teleprompter verified: HUD opens, scrollTop advances, manual wheel pauses, and the HUD closes cleanly.
- Ambient audio verified for rain, cafe, fireplace, and off; Web Audio graph starts without console exceptions.
- Word Bank verified: dictionary lookup, automatic context sentence capture, add, search/filter, delete with undo, and review grading.
- SRS verified: first “Good” review moved a word from New to Practicing with nextReviewDue exactly +1 day.
- Notes verified: add, edit, delete, undo, and per-book/page timestamps.
- Export verified: gutenberg_studio_state.json downloaded with settings, library progress, notes, and Word Bank.
- Import verified: restored theme, font size, notes, Word Bank, active book ID, and reading position; Resume reading mapped the saved percentage to the new pagination.
- Responsive checks at 1440px and 390px: mobile defaults to continuous scroll, quick-action labels are visible, and the bottom navigation stays in the viewport.
- All four themes and all three typefaces applied live; OpenDyslexic loaded successfully via document.fonts.check.
- GitHub Pages build completed and served index.html, style.css, script.js, and state.json with HTTP 200.
- Live GitHub Pages build verified: index.html, style.css, script.js, and state.json all served with HTTP 200; the live app rendered 20 curated cards with no console errors.
- Live Gutendex search verified on GitHub Pages: “sherlock” returned 16 results and opened The Adventures of Sherlock Holmes (604 pages) from the GITenberg text path.
- Title-page cleanup verified on Sherlock Holmes and The Yellow Wallpaper: table-of-contents/author front matter is dropped so page 1 opens on prose.
- Context extraction verified around abbreviations: selecting “Bennet” captured the full sentence beginning “My dear Mr. Bennet…” instead of cutting at “Mr.”.
- Mobile reader layout verified at 390×844: the bottom Previous/Next bar stays in the viewport and the quick-action labels remain visible.
- Page-turn animation verified in both directions at 400ms: the outgoing page is visibly angled while the next sheet is already visible underneath; Previous swings the earlier page back in from the left.
- Local catalogue verified: 165 books (20 curated, 140 popular Gutenberg, 8 Standard Ebooks) render instantly; the library hero and a 12-book “Popular from the local catalogue” shelf show the offline count.
- Local-first search verified: a “persuasion” query rendered the local result before Gutendex answered, then supplemented with the API result; a repeat query used the 7-day search cache.
- Standard Ebooks extraction verified: Persuasion (423 pages), Wuthering Heights (619 pages), and Around the World in Eighty Days (405 pages) loaded from single-page XHTML with chapters and prose intact.
- IndexedDB full-text cache verified: reopening The Yellow Wallpaper skipped the download and completed in about 0.4 seconds.
- Page-count stability verified on open: the first measured layout and the final pagination match before the loading overlay is removed.
- Browse-all-local view verified: 165 cached books rendered without a Gutendex request.

## Credits

Built with [OpenCode](https://opencode.ai) and **DeepSeek V4.1 Flash**. The app, design system, SRS engine, text pipeline, tests, screenshots, and documentation were generated in a single agent session.

Books are provided by [Project Gutenberg](https://www.gutenberg.org/) and [Standard Ebooks](https://standardebooks.org/), with Gutenberg text mirrored by [GITenberg](https://github.com/GITenberg). Discovery uses [Gutendex](https://gutendex.com/). Definitions and pronunciation audio use the [Free Dictionary API](https://dictionaryapi.dev/). Fraunces and Inter are served by Google Fonts; OpenDyslexic is served by Fontsource/jsDelivr. This is an independent reading project and is not affiliated with Project Gutenberg, Gutendex, Standard Ebooks, or the Free Dictionary API.
