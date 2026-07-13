import { bindSettingToggles } from "../lib/bind-settings.js";
import { loadSettings, saveSettings, DEFAULT_SETTINGS } from "../lib/settings.js";
import { hasBridgePermission, requestBridgePermission } from "../lib/permissions.js";
import { FLOW_RELEASE_URL, EXTENSION_REPO_URL } from "../lib/const.js";

const grantBtn = document.getElementById("grant");
const portsInput = document.getElementById("ports");

async function refreshGrant() {
  const granted = await hasBridgePermission();
  grantBtn.textContent = granted ? "Access granted" : "Grant access";
  grantBtn.disabled = granted;
}

function parsePorts(value) {
  const ports = value
    .split(",")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => Number.isInteger(n) && n > 0 && n < 65536);
  return ports.length ? ports : DEFAULT_SETTINGS.ports;
}

grantBtn.addEventListener("click", async () => {
  await requestBridgePermission();
  refreshGrant();
});

portsInput.addEventListener("change", async () => {
  const ports = parsePorts(portsInput.value);
  portsInput.value = ports.join(", ");
  await saveSettings({ ports });
});

document.getElementById("get-flow").href = FLOW_RELEASE_URL;
document.getElementById("repo").href = EXTENSION_REPO_URL;

(async () => {
  await bindSettingToggles(document, {
    silentMode: {
      onEnable: async () =>
        (await hasBridgePermission()) ? true : requestBridgePermission(),
    },
  });
  const settings = await loadSettings();
  portsInput.value = settings.ports.join(", ");
  refreshGrant();
})();
