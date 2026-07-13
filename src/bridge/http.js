import { toQuery } from "../lib/query.js";

export async function sendToBridge(port, action, params) {
  const res = await fetch(`http://127.0.0.1:${port}/flow/${action}?${toQuery(params)}`);
  return res.ok;
}
