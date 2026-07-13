import { WATCH_ROW_ANCHORS } from "../extract/selectors.js";
import { createInlineHost } from "./shadow-host.js";
import { createButton } from "./button.js";
import { playIcon, downloadIcon } from "./icons.js";

const HOST_ID = "flow-ext-watch-row";

function findAnchor() {
  for (const selector of WATCH_ROW_ANCHORS) {
    const el = document.querySelector(selector);
    if (el) return el;
  }
  return null;
}

export function injectWatchRow({ onWatch, onDownload }) {
  if (document.getElementById(HOST_ID)) return true;

  const anchor = findAnchor();
  if (!anchor) return false;

  const { host, root } = createInlineHost(HOST_ID);
  const row = document.createElement("div");
  row.className = "flow-row";
  row.append(
    createButton({
      icon: playIcon,
      label: "Watch in Flow",
      variant: "primary",
      onClick: onWatch,
    }),
    createButton({
      icon: downloadIcon,
      label: "Download",
      onClick: onDownload,
    }),
  );
  root.appendChild(row);
  anchor.appendChild(host);
  return true;
}

export function removeWatchRow() {
  document.getElementById(HOST_ID)?.remove();
}
