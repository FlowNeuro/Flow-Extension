import { STYLES } from "./styles.js";

export const FLOATING_HOST_ID = "flow-ext-floating";

function styleElement() {
  const style = document.createElement("style");
  style.textContent = STYLES;
  return style;
}

// A single viewport-covering, click-through host for floating UI (overlay, toast).
export function floatingRoot() {
  let host = document.getElementById(FLOATING_HOST_ID);
  if (host?.shadowRoot) return host.shadowRoot;

  host = document.createElement("div");
  host.id = FLOATING_HOST_ID;
  host.style.cssText =
    "all: initial; position: fixed; inset: 0; z-index: 2147483000; pointer-events: none;";
  (document.body || document.documentElement).appendChild(host);

  const root = host.attachShadow({ mode: "open" });
  root.appendChild(styleElement());
  return root;
}

// A fresh isolated host to embed inline into a specific place in the page.
export function createInlineHost(id, hostCss = "all: initial; display: inline-flex;") {
  const host = document.createElement("div");
  host.id = id;
  host.style.cssText = hostCss;
  const root = host.attachShadow({ mode: "open" });
  root.appendChild(styleElement());
  return { host, root };
}
