# Portfolio — Venkata Yedupati

Personal portfolio site. **[venkatayedupati.vercel.app](https://venkatayedupati.vercel.app/)**

A single static page — no build step, no framework, no runtime data fetch. All
content lives directly in `index.html` so it is fully readable by crawlers,
link-unfurlers, and browsers with JavaScript disabled.

## Files

| File            | Purpose                                                             |
| --------------- | ------------------------------------------------------------------- |
| `index.html`    | The whole page: content, SEO/Open Graph tags, and `Person` JSON-LD. |
| `styles.css`    | Styling. Light palette on `:root`, dark under `prefers-color-scheme: dark`. |
| `script.js`     | Progressive enhancement only — reveal-on-scroll, active nav, count-up stats. The page works without it. |
| `og-image.png`  | 1200×630 social preview image.                                       |
| `vercel.json`   | Clean URLs, security headers, cache headers.                         |
| `robots.txt` / `sitemap.xml` | Search-engine basics.                                   |

## Editing content

Edit `index.html` directly. When changing `styles.css` or `script.js`, bump the
`?v=` query string on their `<link>` / `<script>` tags to bust caches.

The social image is generated from `tools/og.html` (open it at 1200×630 and
screenshot, or use headless Chrome:
`chrome --headless --screenshot=og-image.png --window-size=1200,630 tools/og.html`).

## Deployment

Auto-deploys on push to `main` via Vercel.
