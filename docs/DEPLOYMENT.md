# Deployment

The studio is a plain static site. Deployment is a push; there is no build, artifact upload or
Actions workflow in this repository.

## 1. Hosting configuration

| Setting | Value |
| --- | --- |
| Host | GitHub Pages (legacy branch build) |
| Repository | `somphol/gutenberg-reader-studio` (public) |
| Source branch | `main` |
| Source folder | `/` (repository root) |
| Custom domain | None; the canonical URL is the `github.io` project URL |
| HTTPS | GitHub-managed certificate |
| Build step | None |
| Actions workflow | None |
| `.nojekyll` | Present at the root; disables Jekyll processing |
| Publish URL | <https://somphol.github.io/gutenberg-reader-studio/> |

`.nojekyll` matters because the site serves `.json`, `.md`, dotfiles and the `docs/` image without
Jekyll filtering. Do not delete it.

## 2. What is published

Everything tracked at the repository root is publicly readable, including:

- `index.html`, `style.css`, `script.js`, `favicon.svg`
- `README.md`, `AGENTS.md`, `docs/*.md`, `docs/social-card.png`
- `state.json`, `STATE.md` (historical build record; intentionally public)
- `screenshots*.png`, `sitemap.xml`, `robots.txt`, `.nojekyll`
- `skills/gutenberg-reader-studio/` (Markdown + the three template source files)
- `.github/` templates (served as files, not part of the app)

Nothing secret may be committed. The app has no API keys, no server and no private configuration.
GitHub Pages responses are public; treat every tracked file as published.

## 3. Deploy

```bash
cd ~/Projects/gutenberg-reader-studio
node scripts/check.mjs
node ~/.config/opencode/skills/skill-publish/scripts/check-skill.mjs skills/gutenberg-reader-studio
git add -A
git commit -m "docs: add release documentation, reproduction book and skill"
git push origin main
```

GitHub Pages rebuilds on the push to `main` (usually under a minute). No force-push. If the push is
rejected, inspect `git status`, rebase or merge normally, and retry; do not rewrite published
history.

If Pages is ever disabled, enable it in **Settings → Pages → Build and deployment → Source:
Deploy from a branch → `main` / `/ (root)`** and save.

## 4. Verify the deployment

```bash
# All should print 200
for path in "" style.css script.js state.json docs/social-card.png; do
  curl -s -o /dev/null -w "%{http_code} /$path\n" -L \
    "https://somphol.github.io/gutenberg-reader-studio/$path"
done
```

Expected on 2026-11-02:

```text
200 /
200 /style.css
200 /script.js
200 /state.json
200 /docs/social-card.png
```

Response headers observed:

```text
server: GitHub.com
content-type: text/html; charset=utf-8       (index)
content-type: text/css; charset=utf-8        (style.css)
content-type: application/javascript; charset=utf-8
cache-control: max-age=600
access-control-allow-origin: *               (Pages default)
```

Then open the site and check:

1. The library hero shows the local catalogue count (165) and cards render.
2. Opening a curated book reaches a paginated page (requires a working connection and a reachable
   text source).
3. `#read/<id>` deep links reopen a saved book in the same browser profile.
4. `state.json` loads in a new tab and the footer “Build state” link resolves.
5. The browser console has no 404s for `style.css`, `script.js`, `favicon.svg`.

## 5. Caching

GitHub Pages serves static assets with `cache-control: max-age=600` and an ETag; there is no
repository-controlled header configuration. Consequences:

- An updated `script.js` can be cached for up to ten minutes. A hard reload or a cache-busting query
  (`?v=2`) forces the new copy.
- The app's own `fetch('state.json', { cache: 'no-store' })` bypasses the HTTP cache for the footer
  provenance line only.
- `localStorage` and IndexedDB caches are per-browser and independent of the CDN. Bump
  `TEXT_CACHE_VERSION` in `script.js` when a parser change must invalidate stored book text.
- Google Fonts, cover images, Gutendex, GITenberg, Standard Ebooks and the dictionary API are
  third-party caches/endpoints and can fail independently of Pages.

There is no service worker and therefore no app-shell cache to invalidate.

## 6. Rollback

Preferred, history-preserving rollback:

```bash
cd ~/Projects/gutenberg-reader-studio
git log --oneline -5
git revert <bad-commit-sha>       # creates a new commit
git push origin main
```

For a documentation-only regression, revert only that commit. For an app regression, revert the
commit that introduced it and rerun `node scripts/check.mjs`. Do not `git reset --hard` and
force-push `main`; published history and caches may already reference it.

If the live site is broken but the repository is correct, wait for the Pages build, then check
**Settings → Pages** for the build status. If a deploy is stuck, push an empty commit
(`git commit --allow-empty -m "chore: rebuild pages"`) to trigger a new build.

## 7. Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| 404 on the root | Pages source not `main` / `/`, or the build has not finished | Check Settings → Pages; wait and retry |
| CSS/JS 404 after deploy | Wrong branch/folder, or files not committed | `git ls-files` and verify the paths; push again |
| Old JS still running | 10-minute Pages cache or browser cache | Hard reload / append a query string |
| Blank reader after opening a book | Text source blocked, CORS relay down, or extractor mismatch | Check the console/network; try a Standard Ebooks title; verify `getBookText` attempts |
| Search shows only local books | Gutendex unreachable or rate-limited | Expected graceful degradation; retry later |
| Definitions fail | Free Dictionary API unreachable or word not found | Cached definitions still work; retry |
| Read aloud silent | No voices, speech engine blocked, or tab not focused | Pick a voice in Settings, press **Refresh voices**, interact with the page first |
| Voice missing after reload | The saved `voiceURI` is no longer installed | The picker falls back to Automatic and reports it in the hint |
| Fonts look like system serif | Google Fonts blocked | Expected fallback; self-hosting fonts would be a source change |
| `#read/<id>` 404s in the app | The id is not saved and Gutendex can't resolve it | Open the book from search first |
| Import rejected | File lacks `settings`, `wordBank`, `notes` or `library` | Export from this app and retry |
| `localStorage` quota warning | Very large library/notes/dictionary cache | Export, reset, re-import; caches are capped |
| Page count shifts after resize | Pagination is measured per viewport | Expected; reading percentage is preserved |

## 8. Credentials and publication rules

- No credentials belong in this repository, the docs, the skill or the app.
- Use the machine's existing Git credential configuration for pushes. Do not print, copy or commit
  credential files.
- Keep the repository public and Pages on `main` / `/`; the README and metadata assume that URL.
- If the repository or owner is renamed, update `APP.repository` / `APP.pages` in `script.js`, the
  canonical and Open Graph URLs in `index.html`, `README.md`, `AGENTS.md`, `sitemap.xml`,
  `robots.txt`, and the deployment block in `state.json`.
- `AGENTS.md` must be updated in the same push as any change that makes it stale.
