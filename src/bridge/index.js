import { findRunning } from "./ping.js";
import { sendToBridge } from "./http.js";
import { buildDeepLink, launchDeepLink } from "./deep-link.js";
import { FLOW_RELEASE_URL } from "../lib/const.js";
import { log } from "../lib/log.js";

export const HANDOFF = {
  SILENT: "silent",
  LAUNCHED: "launched",
  NOT_INSTALLED: "not_installed",
};

// A → B → CTA cascade:
//   (A) localhost bridge if Flow is running (silent, instant)
//   (B) flow:// deep link (launches Flow if installed)
//   (C) "Get Flow" toast if nothing handled it
export async function handoff(action, params, { ports, silent = true, toast } = {}) {
  if (silent) {
    const running = await findRunning(ports);
    if (running) {
      try {
        if (await sendToBridge(running.port, action, params)) {
          toast?.({ message: "Sent to Flow", variant: "success" });
          return HANDOFF.SILENT;
        }
      } catch (err) {
        log("bridge send failed", err);
      }
    }
  }

  if (await launchDeepLink(buildDeepLink(action, params))) {
    toast?.({ message: "Opening Flow…", variant: "info" });
    return HANDOFF.LAUNCHED;
  }

  toast?.({
    message: "Flow isn't installed",
    variant: "error",
    cta: { label: "Get Flow", href: FLOW_RELEASE_URL },
  });
  return HANDOFF.NOT_INSTALLED;
}
