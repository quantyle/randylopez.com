<p align="center">
  <img src="frontend/public/pear.svg" alt="Pear logo" width="110" />
</p>

<h1 align="center">randylopez.com</h1>

<p align="center">
  An interactive developer portfolio for <strong>Randy Lopez</strong>, built as a vintage all-in-one computer.
</p>

You land on a CRT monitor floating over a drifting cloud sky; the screen powers
on, runs a BIOS-style boot sequence, and types out a terminal greeting. Click
anywhere to "enter" and the machine boots into a full-screen retro desktop —
draggable windows, a menu bar, and desktop icons — where the About, Contact,
System, Studio, and Date & Time windows hold the actual portfolio content.

Built with **Vite + SolidJS**. The animated sky is rendered with **Vanta.js /
three.js**; the monitor frame and screen curvature are pure CSS 3D, so the
desktop inside stays fully interactive. Fully responsive — it works on phones as
well as large monitors.

## Repository layout

    randylopez.com/
    ├── frontend/    SolidJS + Vite app (the site).  Build output → frontend/dist
    └── server/      nginx config for serving the built site

## Getting started

Requires **Node 18+**.

```bash
cd frontend
npm install
npm run dev          # dev server at http://localhost:5173
```

Build and preview the production bundle:

```bash
npm run build        # outputs frontend/dist
npm run preview      # serve the built bundle locally
```

## Deployment

### nginx (server/)

The build is a static single-page app. `server/randylopez.com.conf` serves
`frontend/dist` with SPA routing, hashed-asset caching, and gzip:

```bash
cd frontend && npm ci && npm run build      # produce frontend/dist
sudo cp ../server/randylopez.com.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/randylopez.com.conf \
           /etc/nginx/sites-enabled/randylopez.com.conf
sudo nginx -t && sudo systemctl reload nginx
```

Update the `root` directive in the conf to wherever you publish `frontend/dist`
on the server (it defaults to `/var/www/randylopez.com/frontend/dist`).

### Static hosts (Vercel / Netlify)

`frontend/` also ships with `vercel.json` and `public/_redirects` for SPA
fallback, so it deploys as-is to Vercel or Netlify with build command
`npm run build` and output directory `dist`.

## Customizing

Most changes are content or a single constant:

- **Résumé content** — `frontend/src/data/portfolio.js` (name, bio, experience,
  education, programming languages, projects, and contact links).
- **Intro greeting & typed bio** — the `INTRO_GREET` / `INTRO_BIO` constants in
  `frontend/src/App.jsx` (plus `GREET_CPS` / `BIO_CPS` typing speeds).
- **Sky** — the `DEFAULT_SKY` index in `frontend/src/components/SkyBackground.jsx`
  selects a fixed time-of-day palette (e.g. sunrise, midday, golden hour, night).
- **Dialog theme** — the `--bar-*` and `--hud-*` CSS variables at the top of
  `frontend/src/styles/desktop.css` control the desktop window colors.

## Project structure

    frontend/
    ├── index.html
    ├── vite.config.js
    ├── public/                 fonts, favicons, OG image, SPA redirects
    └── src/
        ├── index.jsx           app entry
        ├── App.jsx             intro (CRT boot + typed terminal) + desktop shell
        ├── store.js            window manager + clock state
        ├── apps.jsx            app/window registry
        ├── data/portfolio.js   all résumé/content data
        ├── components/
        │   ├── SkyBackground.jsx   Vanta.js cloud sky
        │   ├── BootSequence.jsx    power-on / boot animation
        │   ├── Desktop.jsx         desktop + icons
        │   ├── Window.jsx          draggable/resizable window frame
        │   ├── MenuBar.jsx         top menu bar
        │   ├── AppContent.jsx      window contents (About, Contact, System, …)
        │   └── Icons.jsx           SVG icons
        └── styles/                 index.css, desktop.css, boot.css

## License

MIT
