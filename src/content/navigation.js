import { debounce } from "../shared/debounce.js";

const NAV_EVENTS = ["yt-navigate-finish", "yt-page-data-updated", "yt-navigate-start"];

// Calls onChange on every YouTube SPA navigation, with a MutationObserver
// fallback for URL changes and late-rendered nodes.
export function onNavigate(onChange) {
  for (const event of NAV_EVENTS) {
    document.addEventListener(event, () => onChange());
    window.addEventListener(event, () => onChange());
  }

  let lastHref = location.href;
  const observer = new MutationObserver(
    debounce(() => {
      if (location.href !== lastHref) lastHref = location.href;
      onChange();
    }, 300),
  );
  observer.observe(document.documentElement, { childList: true, subtree: true });
}
