// `version` is injected at build time from package.json (single source of truth).
export const base = {
  manifest_version: 3,
  name: "Flow — Watch & Download on YouTube",
  description: "Send any YouTube video to the Flow desktop app to watch or download.",
  icons: {
    16: "icons/16.png",
    48: "icons/48.png",
    128: "icons/128.png",
  },
  permissions: ["contextMenus", "storage"],
  host_permissions: [
    "*://www.youtube.com/*",
    "*://m.youtube.com/*",
    "*://music.youtube.com/*",
  ],
  optional_host_permissions: ["http://127.0.0.1/*", "http://localhost/*"],
  content_scripts: [
    {
      matches: [
        "*://www.youtube.com/*",
        "*://m.youtube.com/*",
        "*://music.youtube.com/*",
      ],
      js: ["content.js"],
      run_at: "document_idle",
      all_frames: false,
    },
  ],
  action: {
    default_popup: "popup/popup.html",
    default_icon: "icons/48.png",
  },
  options_ui: {
    page: "options/options.html",
    open_in_tab: true,
  },
};
