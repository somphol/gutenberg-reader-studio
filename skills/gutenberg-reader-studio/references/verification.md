# Verification

## 1. Static checks (run every release)

```sh
cd ~/Projects/gutenberg-reader-studio
node --check script.js
node scripts/check.mjs
```

Expected:

```text
$ node --check script.js
$ node scripts/check.mjs
OK 76 checks
```

The exact number grows when files or links are added; the contract is that the command prints a
single `OK <n> checks` line and exits 0. On failure it prints one `FAIL …` line per problem and exits
1.

`scripts/check.mjs` covers:

1. Required files: `index.html`, `style.css`, `script.js`, `README.md`, `AGENTS.md`, the docs set,
   licence/changelog/favicon/state, and every skill file.
2. Every local `src`/`href` in `index.html` resolves (external URLs, `data:`, `#`, `mailto:` skipped).
3. Every relative Markdown link and image in `README.md`, `AGENTS.md` and `docs/*.md` resolves.
4. `node --check` passes for every `.js` file, including the skill template.
5. Every `.json` file parses.
6. The three skill template files are byte-identical to the release sources.

It uses only Node built-ins (`node:fs`, `node:path`, `node:child_process`) and makes no network
calls.

## 2. Smoke test

```sh
python3 -m http.server 8000
```

Open <http://localhost:8000/>. Expected:

- library hero and catalogue cards render; `#offline-count` shows the local catalogue size;
- no 404s for `style.css`, `script.js` or `favicon.svg`;
- console has no uncaught exception on load.

This was not automated in the repository. It is a manual smoke test.

## 3. Functional matrix

Status legend: **recorded** = verified during the build sessions and recorded in `STATE.md` /
transcripts; **not re-run** = not repeated during the documentation-only pass; **not verified** =
never exercised in a supported browser.

| Area | Check | Status |
| --- | --- | --- |
| Search | Local card appears before Gutendex responds | recorded |
| Search | Gutendex “sherlock” returns results and opens a book | recorded |
| Search | Repeat query uses the 7-day cache | recorded |
| Search | Network failure falls back to local/cached | recorded (implementation and UI reviewed) |
| Search | “Browse all local books” makes no Gutendex request | recorded |
| Catalogue | 165 deduped local titles render | recorded |
| Text | Gutenberg header/license removal | recorded |
| Text | Title page/TOC dropped from page 1 | recorded (Sherlock Holmes, The Yellow Wallpaper) |
| Text | Standard Ebooks extraction (Persuasion, Wuthering Heights, Around the World) | recorded |
| Text | Odyssey resolves to the Bryant Standard Ebooks edition | recorded |
| Text | IndexedDB reopen skips download (~0.4 s) | recorded |
| Text | EPUB import | not supported |
| Pagination | Page bodies fit at 19 px and 24 px | recorded |
| Pagination | Page count stable across first measured layout | recorded |
| Pagination | 14 px / 32 px overflow extremes | not verified |
| Reader | 3D page-turn next and previous, one sheet left | recorded |
| Reader | Switch page-turn ⇄ scroll keeps position | recorded |
| Reader | Resume reading maps saved percentage | recorded |
| Bionic | 117 word wrappers on page 1 | recorded |
| Bionic | Double-click bold prefix looks up the whole word | recorded (“universally”) |
| Dictionary | Definition card, phonetics, audio | recorded |
| Word Bank | Add with context, search/filter, delete | recorded |
| SRS | First Good moves New → Practicing, due +1 day | recorded |
| Notes | Add, edit, delete, undo | recorded |
| RSVP | Starts at page word, plays, pauses, steps, wpm 150–500 | recorded |
| Teleprompter | HUD advances scroll, wheel pauses, closes | recorded |
| Ambient | Rain, café, fireplace, off start/stop cleanly | recorded |
| TTS | Start/stop with stubbed speech engine | recorded |
| TTS | Sentence stepping forward/back across pages | recorded |
| TTS | Pause/resume and Space shortcut | recorded |
| TTS | Auto page advance | recorded |
| TTS | Manual page change while listening | recorded |
| TTS | Scroll mode and bionic mode | recorded |
| TTS | Poem lines narrated line by line | recorded |
| TTS | Real `speechSynthesis` engine on macOS Chrome | recorded (limited voice metadata) |
| TTS | Voice picker groups, badges, preview, refresh | recorded |
| TTS | Voice highlight (`CSS.highlights`) | recorded where supported; not verified in Safari/Firefox |
| TTS | Background-tab playback | not verified |
| Persistence | Reload restores book/page/settings/Word Bank | recorded |
| Export/import | JSON export then import restores studio | recorded |
| Responsive | 1440 px desktop layout | recorded |
| Responsive | 390×844 no overflow, scroll default, bottom bar visible | recorded |
| Responsive | Tablet widths (720–1180) | not verified |
| Accessibility | Keyboard shortcuts, Escape order, focus-visible | reviewed, not automated |
| Accessibility | Screen-reader traversal of the reader | not verified |
| Hosting | Pages root/CSS/JS/state.json return 200 | recorded and rechecked 2026-11-02 |
| Hosting | `docs/social-card.png` returns 200 | rechecked 2026-11-02 |

## 4. Read-aloud acceptance script

Use a book with at least three pages and several sentences per page.

1. Press `L` or click **Listen**.
   - `#tts-hud` appears.
   - `#tts-position` reads `1 / <sentences-on-page>`.
   - The first sentence has `.is-speaking`.
   - One utterance is active (stub or real engine).
2. Wait for the sentence to end.
   - The next sentence highlights and is spoken; position increments.
3. Press `Space`.
   - Button reads **Resume**; no new utterance starts.
4. Press `Space` again.
   - Button reads **Pause**; speech resumes on the same sentence.
5. Press `#tts-next` / `#tts-prev`.
   - Position moves within the page; stepping back from sentence 1 goes to the previous page's last
     sentence.
6. Turn the page with `→` while listening.
   - The new page's first sentence is spoken (or remains paused with the first sentence highlighted).
7. Let the page finish with auto-advance on.
   - `ui.currentPage` and `ui.tts.pageIndex` advance together; the HUD position resets for the page.
8. Disable auto-advance in Settings and repeat.
   - Narration stops at the page end with “Page finished. Turn the page to keep listening.”
9. Click a sentence.
   - Narration jumps to that sentence.
10. Press `L` or the close button.
    - HUD hides, `#quick-tts` is `aria-pressed="false"`, no `.is-speaking` spans remain.
11. Switch to scroll mode and repeat steps 1–3.
    - Narration starts at the first visible sentence.
12. Enable bionic and repeat.
    - Text content is unchanged; bionic spans still render; narration still works.
13. Reload.
    - `ttsRate`, `ttsVoice` and `ttsAutoAdvance` persist.

## 5. Page-turn acceptance script

1. Open a book in page mode.
2. Click **Next**.
   - Exactly two sheets exist during the animation: one `.is-under`, one `.is-turning-next`.
   - The turning sheet rotates left around the spine.
3. Wait 900 ms.
   - Exactly one `.page-sheet` remains; no `is-turning`/`is-under` classes.
4. Click **Previous**.
   - The incoming sheet animates from −96° to 0°.
5. Toggle **3D page-turn** off in Settings.
   - Scroll sections render immediately; the viewport is not blank.
6. Toggle it back on.
   - The page corresponding to the current percentage renders.
7. Enable `prefers-reduced-motion` in the OS/browser.
   - Page changes are instant; no rotation.

## 6. Offline / online acceptance

| Scenario | Expected |
| --- | --- |
| First visit, no network | App does not load (no service worker) |
| Loaded app, then offline, search | Local catalogue results only |
| Loaded app, offline, open an uncached book | Clear error with a Gutenberg link; library remains usable |
| Loaded app, offline, reopen a cached book | Opens from IndexedDB |
| Offline, read aloud | Works with an on-device voice; online voices fail with a toast |
| Offline, dictionary | Cached words resolve; uncached lookup fails |
| Offline, ambient sound | Works (Web Audio, generated) |
| Offline, covers/fonts | Covers fall back to styled placeholders; fonts fall back to system stacks |

These behaviours follow from the implementation; the first-load and cached-text paths were recorded
during the build. A full offline audit was **not** re-run in the documentation pass.

## 7. Known gaps

- Safari and Firefox were not automated; the TTS voice model and highlight support differ.
- No automated browser test suite lives in the repository. The build used temporary headless Chrome
  scripts that were not committed.
- 14 px / 32 px pagination overflow was not exhaustively checked at every viewport.
- Tablet breakpoints (720–1180 px) were not separately recorded.
- Word-level highlight is not verified without the CSS Custom Highlight API.
- Background-tab TTS behaviour is browser-dependent and unverified.
- `stats.readingSeconds` is not updated, so it cannot be tested.
- Screenshots are historical and are not regenerated by the checks.
- The check script does not verify runtime behaviour, only structure and syntax.

Never upgrade a “recorded” row to “verified” without re-running it. A documentation-only pass does
not revalidate browser behaviour.
