import { handoff } from "../bridge/index.js";
import { toast } from "../ui/toast.js";
import { hasBridgePermission } from "../lib/permissions.js";
import { ACTION } from "../lib/messages.js";
import { watchAction, watchParams, downloadParams } from "./params.js";

// getSettings is a live getter so actions always read the latest settings.
export function createActions(getSettings) {
  async function silentAllowed(settings) {
    return settings.silentMode && (await hasBridgePermission());
  }

  async function run(action, params, settings) {
    return handoff(action, params, {
      ports: settings.ports,
      silent: await silentAllowed(settings),
      toast,
    });
  }

  return {
    watch(id) {
      const settings = getSettings();
      return run(watchAction(settings), watchParams(id, settings), settings);
    },
    download(id) {
      const settings = getSettings();
      return run(ACTION.DOWNLOAD, downloadParams(id), settings);
    },
  };
}
