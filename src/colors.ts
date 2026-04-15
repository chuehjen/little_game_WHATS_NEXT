import type { HSL, RGB } from './types';

const MAX_RGB_DIST = 44.167; // normalizer for 0–10 scoring

/** Convert HSL to RGB. Each channel 0–255. */
export function hslToRgb(h: number, s: number, l: number): RGB {
  h = ((h % 360) + 360) % 360;
  s = Math.min(Math.max(s, 0), 100) / 100;
  l = Math.min(Math.max(l, 0), 100) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;

  let r: number, g: number, b: number;
  if      (h < 60)  { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else              { r = c; g = 0; b = x; }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

/** Score player's color vs. target using RGB Euclidean distance. Returns 0.00–10.00. */
export function calcScore(target: HSL, player: HSL): number {
  const t = hslToRgb(target.h, target.s, target.l);
  const p = hslToRgb(player.h, player.s, player.l);
  const d = Math.sqrt(
    (t.r - p.r) ** 2 +
    (t.g - p.g) ** 2 +
    (t.b - p.b) ** 2
  );
  return Math.round(Math.max(0, 10 - d / MAX_RGB_DIST) * 100) / 100;
}

/** Generate a random, visually distinct color. Avoids extremely dark/light/desaturated. */
export function randomColor(): HSL {
  return {
    h: Math.floor(Math.random() * 360),
    s: 30 + Math.floor(Math.random() * 60),   // 30–89
    l: 30 + Math.floor(Math.random() * 40),    // 30–69
  };
}

/** Format HSL to CSS color string. */
export function toHSLString(hsl: HSL): string {
  return `hsl(${hsl.h},${hsl.s}%,${hsl.l}%)`;
}
