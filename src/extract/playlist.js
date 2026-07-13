import { PLAYLIST_ID_RE } from "../lib/const.js";

export function playlistId(href = location.href) {
  try {
    const list = new URL(href, location.origin).searchParams.get("list");
    return list && PLAYLIST_ID_RE.test(list) ? list : null;
  } catch {
    return null;
  }
}
