const DEV = typeof __DEV__ !== "undefined" ? __DEV__ : false;
const PREFIX = "[Flow]";

export function log(...args) {
  if (DEV) console.debug(PREFIX, ...args);
}

export function warn(...args) {
  if (DEV) console.warn(PREFIX, ...args);
}
