import { floatingRoot } from "./shadow-host.js";
import { createButton } from "./button.js";
import { playIcon, downloadIcon } from "./icons.js";
import { CARD_SELECTOR } from "../extract/selectors.js";
import { idFromCard } from "../extract/video-id.js";

let overlayEl;
let handlers = null;
let enabled = false;
let listening = false;
let activeCard = null;
let activeId = null;

function ensureOverlay() {
  if (overlayEl?.isConnected) return overlayEl;

  overlayEl = document.createElement("div");
  overlayEl.className = "flow-overlay";
  overlayEl.append(
    createButton({
      icon: playIcon,
      variant: "icon",
      title: "Watch in Flow",
      onClick: () => activeId && handlers?.onWatch(activeId),
    }),
    createButton({
      icon: downloadIcon,
      variant: "icon",
      title: "Download with Flow",
      onClick: () => activeId && handlers?.onDownload(activeId),
    }),
  );
  overlayEl.addEventListener("mouseleave", (e) => {
    if (!activeCard || !activeCard.contains(e.relatedTarget)) hide();
  });
  floatingRoot().appendChild(overlayEl);
  return overlayEl;
}

function show(card, id) {
  activeCard = card;
  activeId = id;
  const el = ensureOverlay();
  el.classList.add("is-visible");
  const rect = card.getBoundingClientRect();
  el.style.top = `${Math.round(rect.top + 8)}px`;
  el.style.left = `${Math.round(rect.right - el.offsetWidth - 8)}px`;
}

function hide() {
  activeCard = null;
  activeId = null;
  overlayEl?.classList.remove("is-visible");
}

function onMouseOver(e) {
  if (!enabled) return;
  const target = e.target;
  if (!(target instanceof Element)) return;
  if (overlayEl?.contains(target)) return;

  const card = target.closest(CARD_SELECTOR);
  if (!card) {
    if (activeCard) hide();
    return;
  }
  if (card === activeCard) return;

  const id = idFromCard(card);
  if (!id) {
    hide();
    return;
  }
  show(card, id);
}

export function initOverlay(nextHandlers) {
  handlers = nextHandlers;
  if (listening) return;
  listening = true;
  document.addEventListener("mouseover", onMouseOver, { passive: true });
  document.addEventListener("scroll", hide, { passive: true, capture: true });
  window.addEventListener("resize", hide);
}

export function setOverlayEnabled(value) {
  enabled = value;
  if (!enabled) hide();
}
