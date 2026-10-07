# Abhi Jha — Portfolio

Personal portfolio site for **Abhi Jha** — Junior Computer Science undergraduate working on
AI/ML-driven cybersecurity: network intrusion detection, audio deepfake & voice-spoofing
forensics, and synthetic media detection.

Static site. No build step, no framework, no dependencies — just `index.html`, `style.css`
and `script.js`.

---

## Running it locally

A local server is recommended over opening the file directly, because the contact form,
web fonts and relative asset paths behave slightly differently under `file://`.

```bash
# Option 1 — Node
npx serve -l 3000 .

# Option 2 — Python
python3 -m http.server 3000
```

Then open <http://localhost:3000>.

**Windows:** double-click `preview.bat` (uses `npx serve`, falls back to opening the file).
**VS Code:** *Run and Debug* → **Launch Portfolio in Chrome (local server)**, which pairs with
the *Serve portfolio on :3000* task in `.vscode/tasks.json`.

---

## Project layout

```
.
├── index.html               # Single page: hero, about, skills, experience,
│                            # projects, certifications, contact, resume modal
├── style.css                # Design system, light + dark themes, print styles
├── script.js                # Theme, scroll spy, skills filter, terminal,
│                            # modals, form submission, toast
├── 404.html                 # GitHub Pages not-found page
├── robots.txt               # → sitemap.xml
├── sitemap.xml
├── manifest.webmanifest     # PWA metadata
├── .htmlvalidate.json       # HTML validation config
├── assets/
│   ├── images/              # portrait (jpg / webp / avif) + 1200×630 social card
│   ├── icons/               # favicon.ico, apple-touch-icon, PWA icons
│   └── source/              # raw, unpublished originals (excluded from deploy)
└── .github/workflows/       # → deploys to GitHub Pages on push to main
```

---

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which:

1. resolves the live Pages base URL,
2. substitutes the `{{SITE_URL}}` placeholders (so `canonical`, `og:image`, `sitemap.xml`
   and `robots.txt` always carry correct **absolute** URLs),
3. validates the HTML,
4. checks for broken internal links and missing assets,
5. publishes to GitHub Pages.

**One-time setup:** repository *Settings → Pages → Build and deployment → Source* =
**GitHub Actions**.

> The `{{SITE_URL}}` placeholders are intentional. Until the workflow runs they appear
> literally in the source, which is why they must be substituted at deploy time rather than
> hardcoded — the same source then works on any host or domain.

### Custom domain

Add the domain in *Settings → Pages → Custom domain* and commit a `CNAME` file at the
repository root.

---

## Contact form setup

The form POSTs to [Formspree](https://formspree.io) and shows a spinner, then reports the
real outcome. It also has a hidden honeypot (`_gotcha`) to drop bots without telling them.

**To activate it** (two places, same value):

1. `index.html` → `<form id="contactForm" action="https://formspree.io/f/{{FORMSPREE_ID}}">`
2. `script.js` → `const FORM_ENDPOINT = 'https://formspree.io/f/{{FORMSPREE_ID}}'`

Replace `{{FORMSPREE_ID}}` with your endpoint ID, e.g. `https://formspree.io/f/abcdwxyz`.

**Until then it degrades safely** rather than silently swallowing messages:

| Situation | Behaviour |
|---|---|
| Endpoint not configured | Opens the visitor's mail client, prefilled |
| Network / server error | Opens the visitor's mail client, prefilled |
| JavaScript disabled | Native POST to the `action` URL |
| Honeypot filled | Dropped silently |

---

## Accessibility notes

- Skip-to-content link, and visible `:focus-visible` rings on every interactive element
- Modals move focus in on open, trap Tab, and restore focus to the trigger on close
- Skills filter uses `aria-pressed` + the `hidden` attribute (state exposed to assistive tech)
- `role="status"` / `role="log"` live regions for form results and terminal output
- All text meets WCAG AA contrast; icons are `aria-hidden`, decorative SVGs are ignored
- `prefers-reduced-motion` disables smooth scroll, card floats and hover transforms

## Browser support

Modern evergreen browsers. Uses `aspect-ratio`, `:focus-visible`, `<picture>` with
AVIF/WebP, and CSS custom properties. AVIF/WebP fall back to JPEG automatically.

## License

Code: [MIT](LICENSE). Personal content — name, photograph, résumé, and the written
descriptions of experience — is **not** licensed for reuse.
