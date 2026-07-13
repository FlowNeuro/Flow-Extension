import { PLAYER_SELECTOR, VIDEO_EL_SELECTOR } from "./selectors.js";

export function currentTimeSeconds() {
  const player = document.querySelector(PLAYER_SELECTOR);
  if (player && typeof player.getCurrentTime === "function") {
    const t = player.getCurrentTime();
    if (Number.isFinite(t)) return Math.floor(t);
  }
  const video = document.querySelector(VIDEO_EL_SELECTOR);
  return video ? Math.floor(video.currentTime || 0) : 0;
}
