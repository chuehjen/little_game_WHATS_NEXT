import { describe, it, expect } from 'vitest';
import { hslToRgb, calcScore, randomColor, toHSLString } from '../src/colors';
import type { HSL } from '../src/types';

describe('hslToRgb', () => {
  it('converts pure red correctly', () => {
    const rgb = hslToRgb(0, 100, 50);
    expect(rgb).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('converts pure green correctly', () => {
    const rgb = hslToRgb(120, 100, 50);
    expect(rgb).toEqual({ r: 0, g: 255, b: 0 });
  });

  it('converts pure blue correctly', () => {
    const rgb = hslToRgb(240, 100, 50);
    expect(rgb).toEqual({ r: 0, g: 0, b: 255 });
  });

  it('converts white correctly', () => {
    const rgb = hslToRgb(0, 0, 100);
    expect(rgb).toEqual({ r: 255, g: 255, b: 255 });
  });

  it('converts black correctly', () => {
    const rgb = hslToRgb(0, 0, 0);
    expect(rgb).toEqual({ r: 0, g: 0, b: 0 });
  });

  it('converts gray correctly', () => {
    const rgb = hslToRgb(0, 0, 50);
    expect(rgb).toEqual({ r: 128, g: 128, b: 128 });
  });

  it('wraps hue values above 360', () => {
    const rgb1 = hslToRgb(360, 100, 50);
    const rgb2 = hslToRgb(0, 100, 50);
    expect(rgb1).toEqual(rgb2);
  });

  it('handles negative hue values', () => {
    const rgb1 = hslToRgb(-120, 100, 50);
    const rgb2 = hslToRgb(240, 100, 50);
    expect(rgb1).toEqual(rgb2);
  });

  it('clamps saturation to valid range', () => {
    const rgb1 = hslToRgb(0, -10, 50);
    const rgb2 = hslToRgb(0, 0, 50);
    expect(rgb1).toEqual(rgb2);

    const rgb3 = hslToRgb(0, 150, 50);
    const rgb4 = hslToRgb(0, 100, 50);
    expect(rgb3).toEqual(rgb4);
  });

  it('clamps lightness to valid range', () => {
    const rgb1 = hslToRgb(0, 100, -10);
    const rgb2 = hslToRgb(0, 100, 0);
    expect(rgb1).toEqual(rgb2);

    const rgb3 = hslToRgb(0, 100, 150);
    const rgb4 = hslToRgb(0, 100, 100);
    expect(rgb3).toEqual(rgb4);
  });
});

describe('calcScore', () => {
  it('returns 10 for perfect match', () => {
    const color: HSL = { h: 180, s: 50, l: 50 };
    const score = calcScore(color, color);
    expect(score).toBe(10);
  });

  it('returns 0 for maximum distance (black vs white)', () => {
    const black: HSL = { h: 0, s: 0, l: 0 };
    const white: HSL = { h: 0, s: 0, l: 100 };
    const score = calcScore(black, white);
    expect(score).toBe(0);
  });

  it('returns a value between 0 and 10', () => {
    const target: HSL = { h: 45, s: 70, l: 50 };
    const player: HSL = { h: 200, s: 30, l: 40 };
    const score = calcScore(target, player);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(10);
  });

  it('returns same score regardless of argument order', () => {
    const a: HSL = { h: 90, s: 60, l: 45 };
    const b: HSL = { h: 270, s: 40, l: 55 };
    expect(calcScore(a, b)).toBe(calcScore(b, a));
  });
});

describe('randomColor', () => {
  it('returns an object with h, s, l properties', () => {
    const color = randomColor();
    expect(color).toHaveProperty('h');
    expect(color).toHaveProperty('s');
    expect(color).toHaveProperty('l');
  });

  it('generates hue in 0–359 range', () => {
    for (let i = 0; i < 100; i++) {
      const color = randomColor();
      expect(color.h).toBeGreaterThanOrEqual(0);
      expect(color.h).toBeLessThan(360);
    }
  });

  it('generates saturation in 30–89 range', () => {
    for (let i = 0; i < 100; i++) {
      const color = randomColor();
      expect(color.s).toBeGreaterThanOrEqual(30);
      expect(color.s).toBeLessThan(90);
    }
  });

  it('generates lightness in 30–69 range', () => {
    for (let i = 0; i < 100; i++) {
      const color = randomColor();
      expect(color.l).toBeGreaterThanOrEqual(30);
      expect(color.l).toBeLessThan(70);
    }
  });
});

describe('toHSLString', () => {
  it('formats HSL to CSS string', () => {
    const result = toHSLString({ h: 180, s: 50, l: 50 });
    expect(result).toBe('hsl(180,50%,50%)');
  });

  it('handles edge values', () => {
    expect(toHSLString({ h: 0, s: 0, l: 0 })).toBe('hsl(0,0%,0%)');
    expect(toHSLString({ h: 360, s: 100, l: 100 })).toBe('hsl(360,100%,100%)');
  });
});
