# Security policy

## Reporting a vulnerability

Please **do not** open a public issue for security problems. Report privately via
[GitHub Security Advisories](https://github.com/FlowNeuro/Flow-Extension/security/advisories/new)
or email [flow.aedev@gmail.com](mailto:flow.aedev@gmail.com). We aim to acknowledge
within a few days.

## Design notes

The extension is deliberately low-privilege:

- It transmits only a YouTube video id (plus optional `t` and `list`) — never cookies, page HTML, or watch history.
- No remote code, no `eval`, no CDN scripts. Everything is bundled and inlined.
- Host access is limited to YouTube. Access to `127.0.0.1` is an **optional** permission requested only when silent mode is enabled.
- Actions are always user-initiated (click / context menu), never automatic on page load.

The local bridge to Flow Desktop is loopback-only, CORS-restricted to YouTube
origins, and validates every field. See the desktop app's security model for the
server side of that contract.
