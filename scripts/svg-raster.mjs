// Minimal SVG-path rasteriser: enough to fill the M/L/H/V/C/Z paths used by the
// Flow logo. Paths are flattened to polygons and filled with supersampled AA.

const BEZIER_STEPS = 24;

export function flattenPath(d) {
  const tokens = [];
  const re = /([MmLlHhVvCcSsQqTtAaZz])|(-?\d*\.?\d+(?:[eE][-+]?\d+)?)/g;
  let m;
  while ((m = re.exec(d))) tokens.push(m[1] ?? parseFloat(m[2]));

  const subpaths = [];
  let cur = [];
  let cx = 0;
  let cy = 0;
  let sx = 0;
  let sy = 0;
  let cmd = "";
  let i = 0;
  const n = () => tokens[i++];

  const cubic = (x1, y1, x2, y2, x, y) => {
    for (let s = 1; s <= BEZIER_STEPS; s++) {
      const t = s / BEZIER_STEPS;
      const u = 1 - t;
      cur.push([
        u * u * u * cx + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x,
        u * u * u * cy + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y,
      ]);
    }
    cx = x;
    cy = y;
  };

  while (i < tokens.length) {
    if (typeof tokens[i] === "string") cmd = tokens[i++];
    const rel = cmd >= "a";
    const ox = rel ? cx : 0;
    const oy = rel ? cy : 0;

    switch (cmd.toUpperCase()) {
      case "M":
        if (cur.length) (subpaths.push(cur), (cur = []));
        cx = ox + n();
        cy = oy + n();
        sx = cx;
        sy = cy;
        cur.push([cx, cy]);
        cmd = rel ? "l" : "L";
        break;
      case "L":
        cx = ox + n();
        cy = oy + n();
        cur.push([cx, cy]);
        break;
      case "H":
        cx = ox + n();
        cur.push([cx, cy]);
        break;
      case "V":
        cy = oy + n();
        cur.push([cx, cy]);
        break;
      case "C":
        cubic(ox + n(), oy + n(), ox + n(), oy + n(), ox + n(), oy + n());
        break;
      case "Z":
        if (cur.length) {
          cur.push([sx, sy]);
          subpaths.push(cur);
          cur = [];
        }
        cx = sx;
        cy = sy;
        break;
      default:
        i++;
    }
  }
  if (cur.length) subpaths.push(cur);
  return subpaths;
}

function pointInPolygon(x, y, poly) {
  let inside = false;
  for (let a = 0, b = poly.length - 1; a < poly.length; b = a++) {
    const [xi, yi] = poly[a];
    const [xj, yj] = poly[b];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

export function bounds(polys) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const poly of polys) {
    for (const [x, y] of poly) {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
  return { minX, minY, width: maxX - minX, height: maxY - minY };
}

// Fit polygons into a `size` square with `margin`, keeping aspect + centering.
function fit(polys, box, size, margin) {
  const scale = (size * (1 - 2 * margin)) / Math.max(box.width, box.height);
  const tx = (size - box.width * scale) / 2 - box.minX * scale;
  const ty = (size - box.height * scale) / 2 - box.minY * scale;
  return polys.map((poly) => poly.map(([x, y]) => [x * scale + tx, y * scale + ty]));
}

// layers: painted back-to-front, each { polys, color:[r,g,b] }. Returns RGBA.
export function rasterize({ layers, box, size, margin = 0.06, samples = 4 }) {
  const fitted = layers.map((layer) => ({
    color: layer.color,
    polys: fit(layer.polys, box, size, margin),
  }));
  const rgba = Buffer.alloc(size * size * 4);
  const total = samples * samples;

  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let covered = 0;

      for (let sy = 0; sy < samples; sy++) {
        for (let sx = 0; sx < samples; sx++) {
          const x = px + (sx + 0.5) / samples;
          const y = py + (sy + 0.5) / samples;
          let hit = null;
          for (const layer of fitted) {
            if (layer.polys.some((poly) => pointInPolygon(x, y, poly))) hit = layer.color;
          }
          if (hit) {
            r += hit[0];
            g += hit[1];
            b += hit[2];
            covered++;
          }
        }
      }

      if (covered > 0) {
        const i = (py * size + px) * 4;
        rgba[i] = Math.round(r / covered);
        rgba[i + 1] = Math.round(g / covered);
        rgba[i + 2] = Math.round(b / covered);
        rgba[i + 3] = Math.round((255 * covered) / total);
      }
    }
  }
  return rgba;
}
