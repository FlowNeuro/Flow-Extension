import { api } from "./browser.js";
import { BRIDGE_PORTS } from "./const.js";

const KEY = "settings";

export const DEFAULT_SETTINGS = {
  overlayOnThumbnails: true,
  watchPageRow: true,
  silentMode: true,
  includeTimestamp: true,
  musicAsMusic: true,
  ports: BRIDGE_PORTS,
};

function merge(stored) {
  return { ...DEFAULT_SETTINGS, ...(stored ?? {}) };
}

export async function loadSettings() {
  const stored = await api.storage.sync.get(KEY);
  return merge(stored?.[KEY]);
}

export async function saveSettings(patch) {
  const next = { ...(await loadSettings()), ...patch };
  await api.storage.sync.set({ [KEY]: next });
  return next;
}

export function onSettingsChanged(callback) {
  const handler = (changes, area) => {
    if (area === "sync" && changes[KEY]) callback(merge(changes[KEY].newValue));
  };
  api.storage.onChanged.addListener(handler);
  return () => api.storage.onChanged.removeListener(handler);
}
