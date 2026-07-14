import { currentWatchId } from "../extract/video-id.js";
import { currentTimeSeconds } from "../extract/player.js";
import { playlistId } from "../extract/playlist.js";
import { MUSIC_HOST } from "../lib/const.js";
import { ACTION } from "../lib/messages.js";

export function watchAction(settings) {
  return location.host === MUSIC_HOST && settings.musicAsMusic
    ? ACTION.MUSIC
    : ACTION.WATCH;
}

export function downloadAction(settings) {
  return location.host === MUSIC_HOST && settings.musicAsMusic
    ? ACTION.MUSIC_DOWNLOAD
    : ACTION.DOWNLOAD;
}

// t and list only make sense for the video currently open in the player.
export function watchParams(id, settings) {
  const params = { v: id };
  if (currentWatchId() === id) {
    if (settings.includeTimestamp) {
      const t = currentTimeSeconds();
      if (t > 0) params.t = t;
    }
    const list = playlistId();
    if (list) params.list = list;
  }
  return params;
}

export function downloadParams(id) {
  return { v: id };
}
