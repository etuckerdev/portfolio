# Professional Portfolio for GitHub Pages

Modern, extensible portfolio for an AI engineer and Rust specialist. Built with semantic HTML, modular CSS, and a small dose of vanilla JavaScript so it stays fast and GitHub Pages ready.

## What you get

- 📄 Clean, semantic HTML5 with WCAG-conscious components
- 🎨 Minimalist visual system powered by CSS custom properties and dual light/dark themes
- ⚙️ JSON-driven project showcase for easy updates without editing markup
- 📱 Responsive grid and flexbox layouts tuned for Core Web Vitals
- 🧩 Project detail template, blog-ready "Insights" section, and hooks for future commenting systems

## Quick start

1. Open `index.html` in your browser to preview locally (no build step required).
2. Update content (see [Customization](#customization)).
3. Deploy via GitHub Pages (instructions below).

### Recommended local preview

```bash
# From the portfolio directory
python3 -m http.server 8000
```

Then visit `http://localhost:8000` to test fetch requests for the project JSON.

## File structure

```
portfolio/
├── index.html
├── README.md
├── css/
│   ├── responsive.css
│   └── style.css
├── images/
│   ├── headshot-placeholder.svg
│   └── project-placeholder.svg
├── js/
│   └── main.js
└── projects/
    ├── crux-ai.html
    ├── project-template.html
    └── projects.json
```

## Customization

### Global content

- Update the hero, about, experience, and contact copy directly inside `index.html`.
- Swap placeholder social links (`github.com/username`, etc.) with your own profiles.
- Replace `images/headshot-placeholder.svg` with a professional headshot (keep the same filename for instant updates).

### Projects

1. Edit `projects/projects.json` to add, remove, or reorder items. Each project accepts:
   ```json
   {
     "title": "Project name",
     "slug": "kebab-case-slug",
     "description": "One sentence summary.",
     "techStack": ["Rust", "Kubernetes"],
     "features": ["Short bullet", "Another bullet"],
     "links": {
       "github": "https://github.com/username/repo",
       "live": "projects/project-page.html"
     }
   }
   ```
2. Optional: create a deep-dive page by duplicating `projects/project-template.html`, filling in the sections, and pointing the `live` link to the new file.

### Theme + visuals

- Adjust color palette, spacing, or typography from the `:root` custom properties near the top of `css/style.css`.
- The dark/light toggle relies on the `data-theme` attribute and `main.js`; you can set a default theme by changing the attribute on the `<html>` tag.
- Drop new project thumbnails into `images/` and reference them inside project detail pages.

### Contact form

The form is static by default. To enable submissions, plug in any form backend (Formspree, Getform, etc.) by swapping the `action` attribute and updating the README for your future self.

### Blog & comments

- The "Insights" section is intentionally minimal. When you're ready, replace the placeholder with a card list or feed.
- Add a blog folder (`/insights`) and reuse the project template structure for individual posts.
- Integrate a comment system (e.g., [Giscus](https://giscus.app/), [Utterances](https://utteranc.es/)) by mounting it on the existing `<div id="comment-root"></div>` anchor near the bottom of the insights section.

## Deployment (GitHub Pages)

1. **Create a repository** named `username.github.io` (replace `username` with your GitHub handle).
2. **Copy the files** from the `portfolio/` directory into the repository root.
3. Commit and push to the `main` branch.
4. In **Repository Settings → Pages**, ensure the source is `Deploy from a branch` on `main / (root)`.
5. Wait for the GitHub Pages build (usually under a minute). Your site will be live at `https://username.github.io`.

### Optional enhancements

- Add a custom domain under **Settings → Pages → Custom domain**.
- Enable HTTPS (automatic) and enforce it once DNS has propagated.
- Configure analytics (e.g., Plausible, Google Analytics) by inserting your snippet near the end of `index.html`.

## Extensibility roadmap

- **Projects at scale:** continue populating `projects/projects.json`; the render function automatically adapts to any length.
- **RSS/Atom feed:** extend the JSON data with publication dates and generate a feed via GitHub Actions.
- **Performance budget:** compress imagery and audit with Lighthouse; the layout already scores highly thanks to limited dependencies.
- **Testing:** add Playwright or Cypress smoke tests to guard against regressions as the site evolves.

## License

Personal use permitted. Attribution appreciated if you share or fork publicly.
