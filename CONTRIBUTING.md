# Contributing

Thanks for helping improve the Flow extension.

## Setup

```bash
npm install
npm run dev      # rebuild on change → dist/chromium, dist/firefox
```

Load the unpacked build:

- **Chromium** — `chrome://extensions` → Developer mode → Load unpacked → `dist/chromium`
- **Firefox** — `about:debugging` → Load Temporary Add-on → `dist/firefox/manifest.json`

Reload the extension and refresh YouTube after each rebuild.

## Project shape

Code is intentionally split into small, single-purpose modules — see the layout in the [README](README.md). Keep it that way:

- One responsibility per file; no monolithic files.
- All injected UI stays in the Shadow DOM. Never import YouTube or Flow CSS.
- The extension only ever transmits a video id (plus optional `t` / `list`). Don't add data collection.
- No new host permissions or remote code without a clear reason.

## Before opening a PR

```bash
npm run format:check
npm run build
```

Both must pass (CI enforces them). Test the surface you touched in at least one browser.

## Releases (maintainers)

1. Bump `version` in `package.json`.
2. Commit and tag: `git tag vX.Y.Z && git push --tags`.
3. The release workflow builds, packages, and publishes the zips to GitHub Releases.
