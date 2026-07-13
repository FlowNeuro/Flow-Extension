import { SCHEME, HANDOFF_TIMEOUT_MS } from "../lib/const.js";
import { toQuery } from "../lib/query.js";

export function buildDeepLink(action, params) {
  return `${SCHEME}://${action}?${toQuery(params)}`;
}

// Fires the flow:// url in a hidden iframe (so the YouTube tab never navigates)
// and resolves true if the OS grabbed focus within the window — the signal that
// the desktop app is launching. Resolves false when nothing handled the scheme.
export function launchDeepLink(url) {
  return new Promise((resolve) => {
    let handedOff = false;
    const onHide = () => {
      if (document.hidden) handedOff = true;
    };
    const onBlur = () => {
      handedOff = true;
    };

    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("blur", onBlur, { once: true });

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);

    setTimeout(() => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("blur", onBlur);
      iframe.remove();
      resolve(handedOff);
    }, HANDOFF_TIMEOUT_MS);
  });
}
