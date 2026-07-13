import esbuild from "esbuild";
import { rm, mkdir, cp, writeFile, access, readFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "./src/manifest/chromium.js";
import { firefox } from "./src/manifest/firefox.js";
import { generateIcons } from "./scripts/gen-icons.mjs";

const dev = process.argv.includes("--dev");
const watch = process.argv.includes("--watch");

const { version } = JSON.parse(await readFile("package.json", "utf8"));

const TARGETS = { chromium, firefox };

const ENTRY_POINTS = {
  content: "src/content/main.js",
  background: "src/background/index.js",
  "popup/popup": "src/popup/popup.js",
  "options/options": "src/options/options.js",
};

const STATIC_FILES = [
  ["src/popup/popup.html", "popup/popup.html"],
  ["src/popup/popup.css", "popup/popup.css"],
  ["src/options/options.html", "options/options.html"],
  ["src/options/options.css", "options/options.css"],
];

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function ensureIcons() {
  if (!(await exists("icons/16.png"))) await generateIcons("icons");
}

async function copyStatics(outdir) {
  for (const [from, to] of STATIC_FILES) {
    await cp(from, path.join(outdir, to));
  }
  await cp("icons", path.join(outdir, "icons"), { recursive: true });
}

async function buildTarget(name, manifest) {
  const outdir = path.join("dist", name);
  await rm(outdir, { recursive: true, force: true });
  await mkdir(path.join(outdir, "popup"), { recursive: true });
  await mkdir(path.join(outdir, "options"), { recursive: true });

  const context = await esbuild.context({
    entryPoints: ENTRY_POINTS,
    outdir,
    bundle: true,
    format: "iife",
    target: ["chrome110", "firefox115"],
    define: { __DEV__: String(dev) },
    minify: !dev,
    sourcemap: dev,
    legalComments: "none",
    logLevel: "info",
  });

  await context.rebuild();
  await copyStatics(outdir);
  await writeFile(
    path.join(outdir, "manifest.json"),
    JSON.stringify({ ...manifest, version }, null, 2),
  );

  if (watch) {
    await context.watch();
    return context;
  }
  await context.dispose();
  return null;
}

await ensureIcons();
const contexts = [];
for (const [name, manifest] of Object.entries(TARGETS)) {
  const ctx = await buildTarget(name, manifest);
  if (ctx) contexts.push(ctx);
  console.log(`built dist/${name}`);
}

if (watch) {
  console.log("watching for changes… (ctrl+c to stop)");
} else {
  console.log("done");
}
