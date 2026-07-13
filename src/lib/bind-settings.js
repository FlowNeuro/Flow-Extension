import { loadSettings, saveSettings } from "./settings.js";

// Wires every <input data-setting="key"> to the stored settings object.
// hooks[key] = { onEnable?: () => Promise<bool>, onChange?: (settings) => void }
export async function bindSettingToggles(root = document, hooks = {}) {
  const settings = await loadSettings();

  for (const input of root.querySelectorAll("input[type=checkbox][data-setting]")) {
    const key = input.dataset.setting;
    input.checked = !!settings[key];

    input.addEventListener("change", async () => {
      const hook = hooks[key];
      if (input.checked && hook?.onEnable) {
        const ok = await hook.onEnable();
        if (!ok) {
          input.checked = false;
          return;
        }
      }
      const next = await saveSettings({ [key]: input.checked });
      hook?.onChange?.(next);
    });
  }

  return settings;
}
