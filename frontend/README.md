# Retro CRT Portfolio

A developer portfolio built as an interactive vintage all-in-one computer.
You open on the framed machine sitting on a desk; press **Start** and the view
zooms into the CRT, which powers on (a smiling computer → "Welcome to my portfolio") and the
classic System 6/7-style desktop takes over the **whole screen** — fully
responsive, so it works on phones as well as large monitors. Draggable windows,
a working menu bar, desktop icons, and an interactive terminal. Choose **Shut
Down** from the Special menu to return to the framed starter screen.

Built with **Vite + SolidJS**. The monitor frame and screen curvature use CSS 3D
(not WebGL) so the desktop inside stays fully interactive. Icons are hand-drawn
1-bit SVGs and the type is authentic Chicago / Geneva / Monaco.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
```

Build for production:

```bash
npm run build    # outputs to dist/
npm run preview
```

## Make it yours

All copy lives in **`src/data/portfolio.js`** — profile, about text, projects,
skills, experience, contact links, and the terminal boot lines. Edit that one
file to put your own content in; nothing else needs to change.

### Favicon & link previews

The browser-tab icon and link-preview card use the pear/computer artwork in
`public/` (`computer.svg`, `favicon-*.png`, `apple-touch-icon.png`,
`og-image.png`). One thing to set before sharing the link: open `index.html`
and replace `https://YOUR-DOMAIN.com` in the `og:image` and `og:url` tags with
your real deployed URL. Social platforms (Slack, iMessage, X, LinkedIn) require
an absolute URL to fetch the preview image.

## How it's organized

- `src/App.jsx` — the machine: room, scaling, pointer parallax, power/boot state.
- `src/components/BootSequence.jsx` — Happy Mac + welcome screen.
- `src/components/Desktop.jsx` — desktop, icons, menu bar, open windows.
- `src/components/Window.jsx` — draggable / resizable classic windows.
- `src/components/MenuBar.jsx` — the system (pear) menu plus File/Edit/View/Special + clock.
- `src/components/AppContent.jsx` — the contents of each app (About, Projects,
  Skills, Contact, Finder, Terminal, Trash, About This Developer).
- `src/store.js` — tiny window manager.
- `src/index.css` / `src/styles/*.css` — the case, CRT effects, desktop, boot.

Tip: press Start to boot, click (or tap) a desktop icon to open its window, and
try the Terminal — `help`, `ls`, `projects`, `open contact`, etc.
