import { loadSettings, onSettingsChanged } from "../lib/settings.js";
import { currentWatchId } from "../extract/video-id.js";
import { injectWatchRow, removeWatchRow } from "../ui/watch-row.js";
import { initOverlay, setOverlayEnabled } from "../ui/overlay.js";
import { onNavigate } from "./navigation.js";
import { createActions } from "./actions.js";
import { listenForContextMenu } from "./messaging.js";
import { log } from "../lib/log.js";

let settings;
const actions = createActions(() => settings);

function render() {
  if (settings.watchPageRow && currentWatchId()) {
    injectWatchRow({
      onWatch: () => actions.watch(currentWatchId()),
      onDownload: () => actions.download(currentWatchId()),
    });
  } else {
    removeWatchRow();
  }
}

async function start() {
  settings = await loadSettings();

  initOverlay({
    onWatch: (id) => actions.watch(id),
    onDownload: (id) => actions.download(id),
  });
  setOverlayEnabled(settings.overlayOnThumbnails);

  listenForContextMenu(actions);

  onNavigate(render);
  onSettingsChanged((next) => {
    settings = next;
    setOverlayEnabled(settings.overlayOnThumbnails);
    render();
  });

  render();
  log("content script ready");
}

start();
