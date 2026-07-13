import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { encodePng } from "./png.mjs";
import { flattenPath, bounds, rasterize } from "./svg-raster.mjs";

const SIZES = [16, 48, 128];

// The Flow logo: YouTube-shaped container + slanted "F".
const CONTAINER =
  "M21.58 7.16C21.33 6.22 20.59 5.48 19.65 5.23C17.96 4.77 12 4.77 12 4.77C12 4.77 6.04 4.77 4.35 5.23C3.41 5.48 2.67 6.22 2.42 7.16C1.96 8.85 1.96 12.38 1.96 12.38C1.96 12.38 1.96 15.91 2.42 17.6C2.67 18.54 3.41 19.28 4.35 19.53C6.04 19.99 12 19.99 12 19.99C12 19.99 17.96 19.99 19.65 19.53C20.59 19.28 21.33 18.54 21.58 17.6C22.04 15.91 22.04 12.38 22.04 12.38C22.04 12.38 22.04 8.85 21.58 7.16Z";
const SYMBOL = "M10 7L18 7L17.2 9.5H12.8L12.2 11.5H16L15.2 14H11.5L10.5 17H7.5L10 7Z";

const RED = [0xff, 0x00, 0x00];
const WHITE = [0xff, 0xff, 0xff];

const container = flattenPath(CONTAINER);
const symbol = flattenPath(SYMBOL);
const box = bounds([...container, ...symbol]);

const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
  <path d="${CONTAINER}" fill="#FF0000"/>
  <path d="${SYMBOL}" fill="#FFFFFF"/>
</svg>
`;

export async function generateIcons(dir) {
  await mkdir(dir, { recursive: true });
  for (const size of SIZES) {
    const rgba = rasterize({
      size,
      box,
      layers: [
        { polys: container, color: RED },
        { polys: symbol, color: WHITE },
      ],
    });
    await writeFile(path.join(dir, `${size}.png`), encodePng(size, rgba));
  }
  await writeFile(path.join(dir, "flow-mark.svg"), LOGO_SVG);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const dir = path.join(process.cwd(), "icons");
  await generateIcons(dir);
  console.log(`icons written to ${dir}`);
}
