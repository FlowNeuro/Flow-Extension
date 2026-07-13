import { api } from "../lib/browser.js";
import { bindSettingToggles } from "../lib/bind-settings.js";
import { findRunning } from "../bridge/ping.js";
import { hasBridgePermission, requestBridgePermission } from "../lib/permissions.js";
import { FLOW_RELEASE_URL } from "../lib/const.js";

const statusEl = document.getElementById("status");

function setStatus(kind, text) {
  statusEl.className = `status status--${kind}`;
  statusEl.textContent = text;
}

async function refreshStatus(settings) {
  if (!(await hasBridgePermission())) {
    setStatus("unknown", "Enable silent mode");
    return;
  }
  setStatus("unknown", "Checking…");
  const running = await findRunning(settings.ports);
  if (running)
    setStatus("ok", running.version ? `Connected · v${running.version}` : "Connected");
  else setStatus("off", "Not running");
}

document.getElementById("get-flow").href = FLOW_RELEASE_URL;
document.getElementById("open-options").addEventListener("click", () => {
  api.runtime.openOptionsPage();
});

(async () => {
  const settings = await bindSettingToggles(document, {
    silentMode: {
      onEnable: async () =>
        (await hasBridgePermission()) ? true : requestBridgePermission(),
      onChange: refreshStatus,
    },
  });
  refreshStatus(settings);
})();
