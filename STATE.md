# Build State

| Field | Value |
| --- | --- |
| Project | Gutenberg Reader Studio & Vocabulary Lab (`gutenberg-reader-studio`) |
| Started | 2026-11-01 01:56:05.063000 UTC |
| Completed | 2026-11-01 02:47:26.003340 UTC |
| Duration | **0h 51m 20s** (3,080.9 seconds) |
| Harness | OpenCode 2.2.5 |
| Model | DeepSeek V4.1 Flash (`opencode-go/deepseek-v4.1-flash`) |
| Session | `ses_e6b2dd0caffeJNXNDXuZvo48oV` |
| Repository | <https://github.com/somphol/gutenberg-reader-studio> |
| Live demo | <https://somphol.github.io/gutenberg-reader-studio/> |

## Token usage

| Metric | Tokens |
| --- | ---: |
| Input | 133,026 |
| Output | 145,500 |
| Reasoning | 107,431 |
| **Total (input + output + reasoning)** | **385,957** |
| Cache read | 46,626,816 |
| Cache write | 1,204 |
| Total including cache | 47,013,977 |

> Snapshot taken from the OpenCode session record when the project was packaged at 2026-11-01T02:47:26.003340Z. The final commit, GitHub Pages deployment, and closing response occur outside this snapshot. `total = input + output + reasoning`; cache reads/writes are reported separately because they are a subset of context usage.

## What was built

- **Three production files**: `index.html` (638 lines), `style.css` (2,360 lines), `script.js` (3,632 lines). No build step, framework, backend, or database.
- **Discovery**: Gutendex search, language filtering, genre browsing, paged results, and 20 curated classics with verified GITenberg text sources.
- **Reader**: automatic Gutenberg header/license cleaning, chapter detection, height-aware pagination, page-turn and continuous-scroll modes, running heads, page numbers, drop caps, poetry blocks, italics, and a reading-position memory.
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
- 3D page-turn animation verified: leaving/entering classes applied and the page deck cleaned up to one sheet after the transition.
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

## Credits

Built with [OpenCode](https://opencode.ai) and **DeepSeek V4.1 Flash**. The app, design system, SRS engine, text pipeline, tests, screenshots, and documentation were generated in a single agent session.

Books are provided by [Project Gutenberg](https://www.gutenberg.org/) and mirrored by [GITenberg](https://github.com/GITenberg). Discovery uses [Gutendex](https://gutendex.com/). Definitions and pronunciation audio use the [Free Dictionary API](https://dictionaryapi.dev/). Fraunces and Inter are served by Google Fonts; OpenDyslexic is served by Fontsource/jsDelivr. This is an independent reading project and is not affiliated with Project Gutenberg, Gutendex, or the Free Dictionary API.
