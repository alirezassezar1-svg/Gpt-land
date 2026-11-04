# Alireza Yazdi — Digital Experience Portfolio

A flat, static, GitHub Pages-ready portfolio built with HTML5, CSS3, vanilla JavaScript and a real-time WebGL/GLSL orb.

## Run locally
Open `index.html` directly, or serve the folder with any static server:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Deploy to GitHub Pages
1. Create a repository (or use a dedicated portfolio repository).
2. Upload the contents of this folder to the repository root.
3. In **Settings → Pages**, select **Deploy from a branch**, choose `main` and `/ (root)`.
4. Save. GitHub Pages will publish `index.html`.

No build step, Node runtime or backend is required. `style.css` is already production CSS. `scss/style.scss` is included as the Sass source/reference; if you edit it, compile with `sass scss/style.scss style.css`.

## Customize before publishing
- Replace the three featured project cards in `index.html` with real project names, descriptions and repository/demo URLs.
- Confirm the contact email `hello@nononick.ir`.
- Update the profile link if your GitHub username changes.
- The hero orb is rendered with a custom WebGL fragment shader in `js/app.js`; `shaders/orb.frag` is the standalone shader reference. If WebGL is unavailable, the page remains readable and the orb gracefully degrades.

## Performance and accessibility
- Responsive layout with iPhone safe-area-compatible viewport.
- Reduced-motion preference disables continuous animation and smooth scrolling.
- Lenis is progressive enhancement via CDN; if unavailable, native scrolling works.
- Canvas pixel ratio is capped to reduce mobile GPU load.
