# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow
[Semantic Versioning](https://semver.org/).

## [1.0.1]

### Fixed

- Watch-page buttons now render as a full-width bar directly below the player and above the metadata, instead of crowding and wrapping the like/share actions row.
- Thumbnail hover overlay no longer flickers: mouseover events that retarget to the overlay's own Shadow-DOM host are handled, and hiding is debounced.

## [1.0.0]

### Added

- Watch-page button row: **Watch in Flow** / **Download**.
- Hover overlay on video thumbnails across feeds, search, sidebar, playlists, and YouTube Music.
- Right-click context-menu items for video links and watch pages.
- Handoff cascade: silent `127.0.0.1` bridge → `flow://` deep link → "Get Flow" toast.
- Popup with live connection status and quick toggles; full settings page.
- Chromium and Firefox builds from a single source.
- Release packaging and GitHub Actions CI/release pipelines.
