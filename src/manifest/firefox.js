import { base } from "./base.js";

export const firefox = {
  ...base,
  background: { scripts: ["background.js"] },
  browser_specific_settings: {
    gecko: {
      id: "flow@flowneuro.github.io",
      strict_min_version: "128.0",
    },
  },
};
