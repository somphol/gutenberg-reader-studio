# Testing

This document separates three things that are easy to confuse:

- **Run in this pass** — commands executed while preparing the release documentation.
- **Recorded during the build** — browser checks performed on 2026-11-01/02 and written into
  `STATE.md` / the session transcript. They are evidence, but they were **not** repeated here.
- **Not verified** — plausible behaviour that no one has exercised in a supported browser.

A documentation-only commit does not revalidate runtime behaviour.

## 1. Run in this documentation pass

Environment: macOS, Node.js 26.13.0, Git, `curl`.

```bash
cd ~/Projects/gutenberg-reader-studio
node --check script.js
node scripts/check.mjs
```

Result: `node --check` printed nothing (pass). `scripts/check.mjs` printed `OK 76 checks` and exited
0 after the docs and skill were in place. The count includes every required file, every local
`index.html` asset, every relative Markdown link/image, every `.js` syntax check, every `.json`
parse, and the three template-parity checks.

Live deployment probes (2026-11-02):

```bash
for path in "" style.css script.js state.json docs/social-card.png; do
  curl -s -o /dev/null -w "%{http_code} /$path\n" -L \
    "https://somphol.github.io/gutenberg-reader-studio/$path"
done
```

Result: `200` for all five paths. Response headers showed `server: GitHub.com`,
`cache-control: max-age=600`, and the expected `content-type` for HTML, CSS and JavaScript.

Also verified by inspection during this pass:

- `index.html` references only `style.css`, `script.js`, `favicon.svg` locally; everything else is
  HTTPS or an in-page anchor.
- Every relative link in `README.md`, `AGENTS.md` and `docs/*.md` resolves.
- The three files in `skills/gutenberg-reader-studio/assets/template/` are byte-identical to
  `index.html`, `style.css` and `script.js` (SHA-256 compared).
- `git status` contained only the documentation/skill additions before the release commit.

**Not run in this pass:** a browser session, TTS, page-turn animation, IndexedDB, search, or import/
export. Those rows below are historical or unverified.

## 2. Recorded during the build

These checks were run in Chrome during the build and are recorded in `STATE.md` and the session
transcripts. Treat them as historical evidence tied to those source revisions, not as a current CI
result.

| Area | Check | Evidence |
| --- | --- | --- |
| Catalogue | 20 curated + 140 popular + 9 Standard Ebooks, deduped to 165 | Build record |
| Search | Gutendex “sherlock” returned results; opened Sherlock Holmes (604 pages) | Build record |
| Search | “persuasion” painted a local result before Gutendex; repeat used cache | Build record |
| Search | Browse-all-local rendered 165 books without an API call | Build record |
| Text | Gutenberg header/license/transcriber cleanup | Build record |
| Text | Title page/TOC removed on Sherlock Holmes and The Yellow Wallpaper | Build record |
| Text | Standard Ebooks: Persuasion 423 pp, Wuthering Heights 619 pp, Around the World 405 pp | Build record |
| Text | Odyssey resolves to the Bryant edition (566 pp, Book I–XXIV) | Build record |
| Text | IndexedDB reopen skipped download (~0.4 s) | Build record |
| Pagination | `scrollHeight === clientHeight` (592 px) at 19 px and 24 px | Build record |
| Pagination | Page count stable across the first measured layout | Build record |
| Page turn | Outgoing sheet angled, next sheet visible underneath, one sheet after the turn | Build record |
| Page turn | Previous swings the earlier page back from the left | Build record |
| Modes | Switching page-turn ⇄ scroll renders immediately | Build record |
| Bionic | 117 `.bw` wrappers on page 1; bold prefix looked up the full word | Build record |
| Dictionary | Definition, phonetics and audio card opened | Build record |
| Word Bank | Add, context capture, search/filter, delete with undo | Build record |
| SRS | First Good: New → Practicing, `nextReviewDue` = now + 1 day | Build record |
| Notes | Add, edit, delete, undo, per-book/page timestamps | Build record |
| RSVP | Starts on the current page, advances, pauses/resumes, 150–500 wpm | Build record |
| Teleprompter | HUD scrolls, manual wheel pauses, HUD closes | Build record |
| Ambient | Rain, café, fireplace, off; Web Audio graph starts cleanly | Build record |
| TTS | Start/stop, pause/resume, sentence stepping, auto page advance | Build record (stubbed engine) |
| TTS | Scroll mode, bionic mode, poem lines, click-to-jump | Build record (stubbed engine) |
| TTS | Manual page navigation keeps narration in sync | Build record |
| TTS | Real macOS `speechSynthesis` spoke with the selected rate | Build record (limited voice metadata) |
| TTS | Voice picker groups, on-device badges, preview, refresh | Build record |
| Persistence | Reload restored theme, size, notes, Word Bank, active book, position | Build record |
| Export/import | JSON export and validated import restored the studio | Build record |
| Responsive | 1440×… desktop layout | Build record |
| Responsive | 390×844 reader: no overflow, scroll default, bottom bar visible | Build record |
| Hosting | Pages root/CSS/JS/state.json returned 200 | Build record |
| Hosting | Live “sherlock” search on Pages opened a book | Build record |

## 3. Manual test matrix

Use this when changing the reader, parser, pagination, TTS or persistence. Mark each row.

### Desktop (1440 × 900, Chrome)

| # | Test | Expected | Status |
| --- | --- | --- | --- |
| D1 | Load the app | Hero, 165-count, curated cards, no console errors | recorded |
| D2 | Search `persuasion` | Local card appears before the API result | recorded |
| D3 | Clear search | Curated shelf returns; genre bar stays visible | recorded |
| D4 | Open *Pride and Prejudice* | Page 1 is prose; running head + page number | recorded |
| D5 | Next/previous page | 3D turn, one sheet remains | recorded |
| D6 | Toggle scroll mode | Immediate render; same approximate position | recorded |
| D7 | Change font size | Repaginates after ~260 ms; position preserved | recorded |
| D8 | Toggle bionic | Bold prefixes; double-click still looks up full word | recorded |
| D9 | Add a word with context | Word Bank entry with sentence and definition | recorded |
| D10 | Grade Good | Practicing, due +1 day | recorded |
| D11 | Add/edit/delete a note | Persists per book and page | recorded |
| D12 | Open RSVP | Starts at current page; Space pauses; ←/→ steps | recorded |
| D13 | Start teleprompter | Scrolls; wheel pauses; HUD closes | recorded |
| D14 | Ambient rain/café/fireplace | Audio starts/stops; no console error | recorded |
| D15 | Press `L` | TTS HUD, sentence highlight, speech | recorded |
| D16 | Pause/resume/step | Same sentence resumes; HUD updates | recorded |
| D17 | Let page finish | Auto-advance continues narration | recorded |
| D18 | Turn page while listening | New page narration resets/continues correctly | recorded |
| D19 | Export, reset, import | Studio restored | recorded |
| D20 | Reload | Book, page, settings, Word Bank restored | recorded |

### Mobile (390 × 844)

| # | Test | Expected | Status |
| --- | --- | --- | --- |
| M1 | Load | No horizontal overflow; compact header | recorded |
| M2 | Open a book | Continuous scroll is the default | recorded |
| M3 | Bottom previous/next bar | Stays in the viewport | recorded |
| M4 | Quick tools | Bionic/Listen/Scroll/Sound remain usable | recorded |
| M5 | Settings drawer | Full-width, scrollable, controls reachable | recorded |
| M6 | Word popup | Full-width bottom sheet | recorded |
| M7 | TTS HUD | Fits and does not cover controls | recorded |
| M8 | 3D page-turn | Still available after switching | recorded |
| M9 | Tablet width (720–1180) | Sidebar stacks; no overflow | not verified |

### Keyboard

| Key | Expected | Status |
| --- | --- | --- |
| `←` / `→` | Page/scroll navigation | recorded |
| `B`, `R`, `T` | Bionic, RSVP, teleprompter | recorded |
| `L` | Start/stop read aloud | recorded |
| `Space` while listening | Pause/resume | recorded |
| `S`, `W`, `N`, `/`, `?` | Settings, Word Bank, Notes, search, help | recorded |
| `Esc` | Closes popup → RSVP → modal → drawer → teleprompter → TTS | reviewed, not automated |
| Typing in a field | Single-key shortcuts suppressed | reviewed, not automated |
| `Ctrl/Cmd+S` | Export library | recorded |

### Persistence and recovery

| Case | Expected | Status |
| --- | --- | --- |
| Reload after reading | Same book, page/percentage, settings | recorded |
| Corrupt `localStorage` JSON | Falls back to defaults, no crash | reviewed, not automated |
| IndexedDB unavailable | App continues without text cache | reviewed, not automated |
| `localStorage` quota exceeded | Toast asks for export; app keeps running | reviewed, not automated |
| Import invalid JSON | Rejected with a toast | reviewed, not automated |
| Import with existing data | Confirmation before replacement | reviewed, not automated |

### Audio / speech

| Case | Expected | Status |
| --- | --- | --- |
| No `speechSynthesis` | “Read aloud is not available…” toast | reviewed, not automated |
| No voices reported | Hint says so; preview toasts | recorded |
| Saved voice missing | Picker falls back to Automatic with a hint | reviewed, not automated |
| Speech error other than cancel | Pauses, keeps HUD, offers Resume | reviewed, not automated |
| Word highlight unsupported | Sentence highlight still works | reviewed, not automated |
| Background tab | Browser-dependent mute/throttle | not verified |

### Offline / online

| Case | Expected | Status |
| --- | --- | --- |
| First load offline | Fails (no service worker) | by design, not tested |
| Search offline after load | Local catalogue only | recorded (fallback path) |
| Reopen cached book offline | IndexedDB text opens | recorded |
| Open uncached book offline | Error toast + Gutenberg link | reviewed, not automated |
| Read aloud offline | On-device voice works | not verified end-to-end |
| Dictionary offline | Cached words only | reviewed, not automated |

## 4. Test data

- *Pride and Prejudice* (id 1342) — curated GITenberg route, reliable prose.
- *The Yellow Wallpaper* — title-page cleanup and short-book pagination.
- *The Adventures of Sherlock Holmes* — long book (604 pages) and chapter navigation.
- *Persuasion*, *Wuthering Heights*, *Around the World in Eighty Days* — Standard Ebooks XHTML.
- *The Odyssey* — curated `seSlug` fallback and Book I–XXIV headings.
- Synthetic three-page fixture with several sentences per page and a poem block — used for TTS
  stepping, auto-advance and poem narration. Do not use one-line fixtures: they paginate to a single
  page and make stepping assertions meaningless.

## 5. Known gaps

- No browser test suite is committed. Build-time checks used temporary Chrome/CDP scripts.
- Safari and Firefox were not automated; `Intl.Segmenter`, speech voices and `CSS.highlights`
  support differ.
- 14 px and 32 px overflow was not exhaustively checked at every viewport.
- Tablet breakpoints and landscape mobile were not separately recorded.
- Screen-reader traversal, focus trapping and reduced-motion behaviour were reviewed, not
  automated.
- Background-tab TTS, OS voice changes mid-session, and Bluetooth output switching are unverified.
- `stats.readingSeconds` is never updated and cannot be tested.
- Screenshots and the social card are historical build artifacts.
- The check script validates structure and syntax only; it does not exercise runtime behaviour.

## 6. Adding a check

1. Prefer a deterministic static assertion in `scripts/check.mjs`.
2. Keep it dependency-free; use `node:fs`, `node:path`, `node:child_process` only.
3. For runtime behaviour, add a row here with an explicit status. Do not mark it “verified” until it
   has actually run.
4. If a check needs a fixture, commit it under `docs/fixtures/` (not under the skill template) and
   keep it small.
