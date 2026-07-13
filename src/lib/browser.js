export const api = globalThis.browser ?? globalThis.chrome;

export const isFirefox = typeof globalThis.browser !== "undefined";
