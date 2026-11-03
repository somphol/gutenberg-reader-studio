# Lessons — bugs, dead ends and regressions

These are failures that actually occurred while building the reference implementation, plus the
regressions the architecture invites. Each row states the symptom, the cause and the durable rule.

## Text sources

### Direct Gutenberg fetch looked correct but never worked in the browser

`https://www.gutenberg.org/...txt` does not send `Access-Control-Allow-Origin` for plain text. A
`fetch` succeeds only in environments that disable CORS. The fix was to use GITenberg on
`raw.githubusercontent.com` first and keep Gutenberg/relays as fallbacks.

**Rule:** a text source is not usable just because `curl` returns 200. Test it from the page origin.

### GITenberg repository names are not derivable with confidence

`<title-slug>_<gutenberg-id>` works often but not always (punctuation, subtitles, translations,
multi-volume works). The first implementation guessed one slug and failed silently.

**Rule:** try an explicit repo first, then GitHub repository search constrained to `org:GITenberg`,
then several derived slugs, and several file names (`id.txt`, `id-0.txt`, `id-8.txt`, `pg<id>.txt`).
Bound the list.

### The Odyssey fell through to a slow CORS relay

A curated entry pointed at a Gutenberg text URL; when direct access failed the chain reached a
public relay and took seconds. The entry lacked a Standard Ebooks route. Fixed by giving it a
`seSlug` and preferring `seFallback` for catalogue titles.

**Rule:** curated entries need a known-good fast route, not just a Gutenberg id.

### HTML error pages were cached as books

A CDN/Cloudflare error page can be 200 and several kilobytes. `looksLikeBook()` now rejects HTML
shells, Cloudflare/error markers and letter-sparse bodies before cleaning.

**Rule:** validate the body, not the HTTP status, and cache only after the clean-text length floor.

### Standard Ebooks chapter headings disappeared

The extractor skipped any node inside a `header` unless it was `h1–h3`, but chapter headings nested
inside a bodymatter header were also caught by an over-broad front-matter class match. The TOC and
colophon must be skipped; a chapter `<h2>` inside `<header>` must not.

**Rule:** test extraction against a real book with bodymatter headers, not only a synthetic page.

## Search and catalogue

### The genre bar vanished when results opened

The chip row lived inside the curated shelf section, which `showResultsView()` hides. Moved it out
so it persists across library/search views.

**Rule:** global controls must not live inside a view that gets toggled.

### Local results were replaced by the API response

An early merge overwrote the immediate local cards, causing a flash and losing offline-only books.
The final `performSearch` merges local + cached first, then merges the API list.

**Rule:** local-first means local data survives the network response.

## Pagination and page turn

### Page count jumped after a book opened

The first `paginate()` ran before the reader had real dimensions/fonts; a second layout produced a
different count while the loading overlay was visible. Fixed by re-paginating 60 ms after the first
render, preserving the percentage, and only then hiding the overlay.

**Rule:** measure the real `.page-body` at least once before declaring the page count.

### Pages overflowed the sheet

The estimate can undershoot for long words or wide glyphs. The check is
`.page-body.scrollHeight <= clientHeight + 1` at 19 px and 24 px (and now 14/32 px). The page body
scrolls rather than clipping, so content is not lost, but the count is approximate.

**Rule:** treat pagination as a layout estimate with a visible fallback, not as a guarantee.

### Page-turn sheets accumulated

The animation inserts an incoming sheet and leaves the outgoing one; without cleanup the viewport
grows a stack. The 820 ms cleanup must be longer than the 0.8 s animation, and
`ui.pageRenderToken` must cancel stale cleanups when the reader turns again quickly.

**Rule:** animation duration and cleanup timeout are a pair; change them together.

### Toggling page-turn showed an empty scroll viewport

`setSetting('pageTurn', …)` called `switchMode(..., {silent:true})`, which updated visibility but
did not render the scroll sections. Fixed by letting `switchMode` render. This was an existing bug
discovered during TTS testing.

**Rule:** a mode switch is a render operation, not only a visibility toggle.

## Read aloud (TTS)

### Long utterances stalled or dropped in Chrome

Speaking a whole page as one utterance made pause/resume sluggish and sometimes lost the end event.
Split into sentences and chunk anything over 220 characters at punctuation, then space.

**Rule:** one sentence per utterance; cap the length; never make pause depend on a long utterance.

### Speech callbacks fired after cancel

`speechSynthesis.cancel()` emits `end`/`error` for the cancelled utterance. Without a guard, a
stale `onend` advanced the index and spoke the next sentence after the user pressed stop. Fixed
with `ui.tts.token`: every utterance captures a token, and callbacks whose token is stale return
early. `interrupted`/`canceled` errors are ignored; other errors pause with a toast.

**Rule:** treat every speech callback as untrusted and versioned.

### Voice list was empty on first paint

`speechSynthesis.getVoices()` can return `[]` until the engine has loaded. The app calls
`populateTtsVoices()` at boot and again on `voiceschanged`, and offers a **Refresh voices** button.

**Rule:** never conclude “no voices” from the first call.

### The picker hid most voices

An early version filtered to `localService` voices only, which left very few choices. The final
picker lists every voice, groups by language/accent, labels on-device vs online, infers gender,
separates novelty voices, and lets automatic mode prefer local.

**Rule:** list everything, recommend local; do not hide capability.

### Word-level highlight was assumed to be universal

`CSS.highlights` / `Highlight` are not available everywhere. Sentence highlight is the baseline;
word highlight is a progressive enhancement that silently does nothing elsewhere.

**Rule:** make the accessibility/usability baseline independent of the newest API.

### Bionic markup broke word lookup

Bionic splits a word into `<b>` and plain text nodes. Double-clicking the bold prefix looked up
only the fragment. The fix wraps the whole word in `.bw[data-word]` and `wordInfoAtPoint()` prefers
that attribute.

**Rule:** any render-time text splitting must preserve a whole-word lookup path.

### TTS lost its place on manual page turn

`ttsLoadPage()` only ran on start. Manual navigation changed the DOM and left the sentence spans
disconnected. `renderPage()`/`renderScroll()` now call `ttsOnPageRendered()`, which reloads the
queue; TTS-requested pages are identified by `ui.tts.expectedPage` and skipped to avoid double
loading.

**Rule:** every renderer that can change pages must notify the speech layer.

### Scroll-mode narration started above the fold

In continuous scroll, the current page's first sentence can be off-screen. `ttsFirstVisibleIndex()`
selects the first sentence whose bottom is below the viewport top. Page mode starts at 0.

**Rule:** “first sentence” means first visible sentence in scroll mode.

### Test fixtures were too short to paginate

Early synthetic books produced one page and zero poem lines, making assertions meaningless. The
fixtures were replaced with several long sentences per page and real poem blocks.

**Rule:** a reader test fixture must be long enough to create at least three pages and multiple
sentences per page.

## Persistence and state

### New settings silently disappeared

`sanitizeSettings()` whitelists known keys. A control added only to `index.html` is dropped on the
next load. Add the key to `defaultState()` and `sanitizeSettings()` first.

**Rule:** the schema is enforced on read; the DOM is not the schema.

### Book text in `localStorage` hit quota

`localStorage` is small and synchronous. Full text belongs in IndexedDB; state holds only metadata
and progress. Bump `TEXT_CACHE_VERSION` when the parser changes so stale text is ignored.

**Rule:** `localStorage` for preferences/progress, IndexedDB for bulk text.

### `readingSeconds` was never incremented

It is exported for compatibility but no timer updates it. Do not build analytics or UI on it
without implementing tracking.

**Rule:** exported fields are not automatically live fields.

## Process regressions

- **Do not “fix” typography by changing pagination constants alone.** Re-test overflow at both
  extremes and on mobile.
- **Do not rename page-turn classes without changing CSS, JS cleanup and reduced-motion rules.**
- **Do not add a TTS call without the token guard.**
- **Do not wrap sentence spans at rest.**
- **Do not claim offline support without a service worker and bundled content.**
- **Do not call XHTML extraction EPUB support.**
- **Do not add a network source without a local fallback and a timeout.**
- **Do not run the check script with missing skill templates** — template parity is a release check.
