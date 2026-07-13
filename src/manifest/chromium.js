import { base } from "./base.js";

export const chromium = {
  ...base,
  background: { service_worker: "background.js" },
};
