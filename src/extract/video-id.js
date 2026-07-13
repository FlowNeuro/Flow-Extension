import { VIDEO_ID_RE } from "../lib/const.js";
import { WATCH_ANCHOR_SELECTOR } from "./selectors.js";

const PATH_ID_RE = /\/(?:shorts|embed|v)\/([A-Za-z0-9_-]{11})/;
const YOUTU_BE_RE = /^\/([A-Za-z0-9_-]{11})/;

export function idFromWatchUrl(href = location.href) {
  let url;
  try {
    url = new URL(href, location.origin);
  } catch {
    return null;
  }

  const v = url.searchParams.get("v");
  if (v && VIDEO_ID_RE.test(v)) return v;

  const path = url.pathname.match(PATH_ID_RE);
  if (path) return path[1];

  if (url.hostname === "youtu.be") {
    const short = url.pathname.match(YOUTU_BE_RE);
    if (short) return short[1];
  }

  return null;
}

export function currentWatchId() {
  return idFromWatchUrl(location.href);
}

// Resolve a card/thumbnail element to its video id via the nearest watch link.
export function idFromCard(el) {
  if (!el) return null;
  const anchor =
    el.closest?.(WATCH_ANCHOR_SELECTOR) || el.querySelector?.(WATCH_ANCHOR_SELECTOR);
  return anchor?.href ? idFromWatchUrl(anchor.href) : null;
}
