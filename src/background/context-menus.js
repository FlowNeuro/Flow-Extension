import { api } from "../lib/browser.js";

const DOCUMENT_PATTERNS = ["*://*.youtube.com/*"];
const VIDEO_URL_PATTERNS = [
  "*://*.youtube.com/watch*",
  "*://*.youtube.com/shorts/*",
  "*://youtu.be/*",
];
const WATCH_PAGE_PATTERNS = ["*://*.youtube.com/watch*", "*://*.youtube.com/shorts/*"];

// Two groups so both surfaces work: one targets video links/thumbnails
// (targetUrlPatterns), the other targets an empty right-click but only on a
// watch/shorts page. targetUrlPatterns would otherwise suppress the page context.
const MENU_GROUPS = [
  {
    suffix: "link",
    contexts: ["link", "video"],
    documentUrlPatterns: DOCUMENT_PATTERNS,
    targetUrlPatterns: VIDEO_URL_PATTERNS,
  },
  {
    suffix: "page",
    contexts: ["page"],
    documentUrlPatterns: WATCH_PAGE_PATTERNS,
  },
];

const ITEMS = [
  { action: "watch", title: "Watch in Flow" },
  { action: "download", title: "Download with Flow" },
];

export function menuAction(menuItemId) {
  return String(menuItemId).includes("download") ? "download" : "watch";
}

export function createMenus() {
  api.contextMenus.removeAll(() => {
    for (const group of MENU_GROUPS) {
      for (const item of ITEMS) {
        api.contextMenus.create({
          id: `flow-${item.action}-${group.suffix}`,
          title: item.title,
          contexts: group.contexts,
          documentUrlPatterns: group.documentUrlPatterns,
          ...(group.targetUrlPatterns && { targetUrlPatterns: group.targetUrlPatterns }),
        });
      }
    }
  });
}
