// Broad, ordered lists. YouTube renames these often, so match many and always
// re-derive the id from the anchor href rather than a fixed attribute.

export const CARD_SELECTORS = [
  "ytd-rich-item-renderer",
  "ytd-video-renderer",
  "ytd-compact-video-renderer",
  "ytd-grid-video-renderer",
  "ytd-playlist-video-renderer",
  "ytd-reel-item-renderer",
  "ytd-rich-grid-media",
  "yt-lockup-view-model",
  "ytmusic-responsive-list-item-renderer",
  "ytmusic-two-row-item-renderer",
];

export const CARD_SELECTOR = CARD_SELECTORS.join(",");

export const WATCH_ANCHOR_SELECTOR = [
  "a#thumbnail",
  "a.yt-simple-endpoint",
  "a[href*='watch?v=']",
  "a[href*='/shorts/']",
  "a.yt-lockup-view-model-wiz__content-image",
].join(",");

export const PLAYER_SELECTOR = "#movie_player";
export const VIDEO_EL_SELECTOR = "video.html5-main-video, #movie_player video";

export const WATCH_ROW_ANCHORS = [
  "ytd-watch-metadata #actions-inner",
  "ytd-watch-metadata #actions",
  "#top-level-buttons-computed",
  "#menu-container",
  "#above-the-fold #title",
];
