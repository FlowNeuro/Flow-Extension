import { readFile } from "node:fs/promises";

// Ensures a release tag (e.g. refs/tags/v1.2.3 or v1.2.3) matches package.json.
const ref = process.argv[2] ?? "";
const tag = ref.replace(/^refs\/tags\//, "").replace(/^v/, "");
const { version } = JSON.parse(await readFile("package.json", "utf8"));

if (!tag) {
  console.error("no tag provided");
  process.exit(1);
}
if (tag !== version) {
  console.error(`tag v${tag} does not match package.json version ${version}`);
  process.exit(1);
}
console.log(`version ok: ${version}`);
