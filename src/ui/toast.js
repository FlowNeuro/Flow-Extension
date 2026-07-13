import { floatingRoot } from "./shadow-host.js";

let container;

function ensureContainer() {
  if (container?.isConnected) return container;
  container = document.createElement("div");
  container.className = "flow-toasts";
  floatingRoot().appendChild(container);
  return container;
}

export function toast({ message, variant = "info", cta, duration = 4000 }) {
  const el = document.createElement("div");
  el.className = `flow-toast flow-toast--${variant}`;

  const msg = document.createElement("span");
  msg.className = "flow-toast__msg";
  msg.textContent = message;
  el.appendChild(msg);

  if (cta) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "flow-toast__cta";
    btn.textContent = cta.label;
    btn.addEventListener("click", () => window.open(cta.href, "_blank", "noopener"));
    el.appendChild(btn);
  }

  ensureContainer().appendChild(el);
  requestAnimationFrame(() => el.classList.add("is-visible"));

  setTimeout(() => {
    el.classList.remove("is-visible");
    setTimeout(() => el.remove(), 220);
  }, duration);
}
