import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import path from "node:path";
import { zipDir } from "./zip.mjs";

const TARGETS = ["chromium", "firefox"];
const OUT_DIR = "release";

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

const { version } = JSON.parse(await readFile("package.json", "utf8"));
await mkdir(OUT_DIR, { recursive: true });

for (const target of TARGETS) {
  const dist = path.join("dist", target);
  if (!(await exists(dist))) {
    console.error(`missing ${dist} — run \`npm run build\` first`);
    process.exit(1);
  }
  const buffer = await zipDir(dist);
  const file = path.join(OUT_DIR, `flow-extension-${target}-v${version}.zip`);
  await writeFile(file, buffer);
  console.log(`packaged ${file} (${(buffer.length / 1024).toFixed(1)} KB)`);
}
