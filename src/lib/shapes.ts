// Procedural point clouds for the hero particle morph. Each shape fills exactly n points
// inside roughly [-1.5, 1.5]^3 so morphs between them stay centered.

export const SHAPE_NAMES = ["shelves", "window", "network", "shield"] as const;
export type ShapeName = (typeof SHAPE_NAMES)[number];

// Small deterministic PRNG so server and client agree and tests are stable.
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function fillBox(out: Float32Array, i: number, cx: number, cy: number, cz: number, sx: number, sy: number, sz: number, r: () => number) {
  out[i * 3] = cx + (r() - 0.5) * sx;
  out[i * 3 + 1] = cy + (r() - 0.5) * sy;
  out[i * 3 + 2] = cz + (r() - 0.5) * sz;
}

// Shops and CMS: a 3x3x3 lattice of small boxes, like shelving.
function shelves(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  const r = rng(11);
  const cells: [number, number, number][] = [];
  for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) cells.push([x, y, z]);
  for (let i = 0; i < n; i++) {
    const [x, y, z] = cells[i % cells.length];
    fillBox(out, i, x * 0.85, y * 0.85, z * 0.85, 0.5, 0.5, 0.5, r);
  }
  return out;
}

// Interfaces: a flat window with a header bar and a 4x3 grid of tiles.
function window_(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  const r = rng(23);
  const tiles: [number, number, number, number][] = [[0, 1.1, 2.6, 0.22]];
  for (let row = 0; row < 3; row++) for (let col = 0; col < 4; col++) tiles.push([-0.98 + col * 0.65, 0.6 - row * 0.6, 0.55, 0.45]);
  for (let i = 0; i < n; i++) {
    const [cx, cy, w, h] = tiles[i % tiles.length];
    fillBox(out, i, cx, cy, 0, w, h, 0.06, r);
  }
  return out;
}

// Automation and bots: a sphere surface with a few dense hubs.
function network(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  const r = rng(37);
  const hubs = 40;
  const golden = Math.PI * (3 - Math.sqrt(5));
  const hubPos: [number, number, number][] = [];
  for (let h = 0; h < hubs; h++) {
    const y = 1 - (h / (hubs - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const t = golden * h;
    hubPos.push([Math.cos(t) * rad * 1.3, y * 1.3, Math.sin(t) * rad * 1.3]);
  }
  for (let i = 0; i < n; i++) {
    if (i % 4 === 0) {
      const [x, y, z] = hubPos[(i / 4) % hubs];
      fillBox(out, i, x, y, z, 0.12, 0.12, 0.12, r);
    } else {
      const y = 1 - (i / (n - 1)) * 2;
      const rad = Math.sqrt(Math.max(0, 1 - y * y));
      const t = golden * i;
      out[i * 3] = Math.cos(t) * rad * 1.3;
      out[i * 3 + 1] = y * 1.3;
      out[i * 3 + 2] = Math.sin(t) * rad * 1.3;
    }
  }
  return out;
}

// Security: a shield silhouette, extruded a little.
function shield(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  const r = rng(53);
  let i = 0;
  while (i < n) {
    const x = (r() - 0.5) * 2.6;
    const y = (r() - 0.5) * 3;
    // top: flat-ish with rounded shoulders; bottom: pointed. Half-width as a function of y.
    let half: number;
    if (y > 0.9) half = 1.2 * Math.sqrt(Math.max(0, 1 - ((y - 0.9) / 0.6) ** 2));
    else if (y > -0.3) half = 1.2;
    else half = 1.2 * (1 - ((-0.3 - y) / 1.2) ** 1.4);
    if (Math.abs(x) <= half && y >= -1.5) {
      out[i * 3] = x;
      out[i * 3 + 1] = y;
      out[i * 3 + 2] = (r() - 0.5) * 0.3;
      i++;
    }
  }
  return out;
}

export function shape(name: ShapeName, n: number): Float32Array {
  switch (name) {
    case "shelves":
      return shelves(n);
    case "window":
      return window_(n);
    case "network":
      return network(n);
    case "shield":
      return shield(n);
  }
}
