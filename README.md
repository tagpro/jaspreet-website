# jaspreet.info

Personal site for Jaspreet Singh — one static page, no framework, no build step.
Served by GitHub Pages from `master` at <https://www.jaspreet.info>.

## Working on it

There is nothing to install and nothing to compile. Open `index.html` in a
browser, or serve the directory if you want correct relative paths:

```sh
python3 -m http.server 3000    # then http://localhost:3000
```

Push to `master` to deploy.

## Layout

| Path            | What it is |
|-----------------|------------|
| `index.html`    | The whole page — content included |
| `css/site.css`  | All styles: design tokens, light/dark themes, print |
| `js/site.js`    | Theme toggle + trace interaction. Progressive enhancement only |
| `assets/Jaspreet-Singh-CV.pdf` | Downloadable CV — **generated from `index.html`**, see below |
| `Jaspreet Singh CV.md` | Source CV the page is written from. **Git-ignored** — it lists referees' personal phone numbers, and this repo is public |
| `copier.html`   | Unrelated standalone cover-letter tool — the only user of `js/clipboard.min.js` |
| `CNAME`         | Custom domain for GitHub Pages |

## The experience section

The career is drawn as a distributed-tracing waterfall. **The geometry is real
data**: the axis runs Jan 2015 → Aug 2026, which is 139 months, and each span's
`--l` / `--w` custom properties are `(months since Jan 2015) / 139` and
`(duration in months) / 139` as percentages.

When a role changes, recompute both numbers — the footer claims the span lengths
are true durations, so they have to stay true. The gridlines sit at multiples of
`12 / 139 = 8.633%`, and extending the axis past Aug 2026 means updating the
divisor everywhere.

Span colour encodes the chapter of the career, not the employer: banking (also
the page accent), SaaS infrastructure, observability, and a deliberately
receding neutral for early-career roles. Study spans are outlined rather than
filled.

## Regenerating the CV PDF

The PDF is not maintained separately — it is this page printed, so the two can
never drift. After changing any content, re-render it:

```sh
python3 -m http.server 4173 &
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --disable-javascript --no-pdf-header-footer \
  --virtual-time-budget=8000 \
  --print-to-pdf=assets/Jaspreet-Singh-CV.pdf http://localhost:4173/
```

`--disable-javascript` is load-bearing: with JS off, every role card stays open
(they ship that way), which is exactly the full-content state the PDF needs.
The `@media print` block handles the rest — it restores the contact details,
swaps in a phone number, un-truncates the trace labels, and hides anything
meaningless on paper (nav, theme toggle, "select a span", and `.self-link`,
which is any link pointing at the PDF itself).

## Accessibility and no-JS behaviour

Both are load-bearing, not afterthoughts — keep them working:

- Every role card ships `open` in the HTML and every span is a real anchor to
  its card, so the page is complete with JavaScript disabled. `site.js` collapses
  the cards into an index only once it runs.
- `beforeprint` reopens every card, so printing gets the full CV rather than a
  list of headings.
- Colour never carries meaning alone — every span is labelled.
- The theme follows `prefers-color-scheme` and the toggle overrides it, stored in
  `localStorage`. The pre-paint script in `<head>` sets `data-theme` before first
  paint; without it the page flashes.

## History

This replaced a Start Bootstrap "Resume" template (Bootstrap 4 + jQuery + a Gulp
SCSS pipeline). That template's MIT `LICENSE` was removed along with the last of
its code; no third-party code remains in the repo.
