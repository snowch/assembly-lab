// Copyright © 2026 Christopher Snow

// The colour tokens, held to WCAG 2.2 in each theme: text at 4.5:1 or more on every surface the
// stylesheets set it on. Read from tokens.css itself, so a changed value is checked the day it
// lands; the explicit dark block is the one the dark theme's toggle uses, and the system-dark
// block must say the same. This course's accent differs from Digital Design's, so the test also
// holds each text and accent pair to at least the contrast Digital Design's pair has (the floors
// below are measured from its tokens.css), and the colours index.html and the web app manifest
// give a browser to the page's own.

import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { BACKGROUND } from "./web-manifest";

// Vitest runs from the repository root, as the check script does.
const css = readFileSync("apps/course/src/styles/tokens.css", "utf8");

function tokens(block: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of block.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-f]{6})\s*;/gi)) out[m[1]!] = m[2]!;
  return out;
}

/** The body of the first rule whose selector is exactly this, braces matched. */
function rule(selector: string): string {
  const at = css.indexOf(`${selector} {`);
  if (at < 0) throw new Error(`no rule ${selector}`);
  let depth = 0;
  for (let i = css.indexOf("{", at); i < css.length; i++) {
    if (css[i] === "{") depth++;
    if (css[i] === "}" && --depth === 0) return css.slice(at, i);
  }
  throw new Error(`unclosed rule ${selector}`);
}

const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
};

const light = tokens(rule(":root"));
const dark = tokens(rule(':root[data-theme="dark"]'));
const systemDark = tokens(rule(':root:not([data-theme="light"])'));

/** Ink, and the surfaces the stylesheets set it on. */
const TEXT: readonly [string, readonly string[]][] = [
  ["fg", ["bg", "bg-raised", "bg-sunken", "bg-inset", "note-bg", "accent-soft"]],
  ["fg-muted", ["bg", "bg-raised", "bg-sunken", "note-bg", "accent-soft"]],
  ["accent", ["bg", "bg-raised", "accent-soft"]],
  ["accent-strong", ["bg"]],
  ["accent-fg", ["accent"]],
  ["hero-fg", ["hero-bg-1", "hero-bg-2"]],
  ["hero-sub", ["hero-bg-1", "hero-bg-2"]],
  ["hero-muted", ["hero-bg-1", "hero-bg-2"]],
  ["hero-action-fg", ["hero-action"]],
  ["ok", ["ok-bg", "bg-raised"]],
  ["warn", ["warn-bg"]],
  ["bad", ["bad-bg", "bg-raised"]],
];

/**
 * What Digital Design's tokens give, pair by pair, in each theme, to two decimals: this
 * course's gives at least as much. [ink, surface, light theme, dark theme].
 */
const FLOORS: readonly [string, string, number, number][] = [
  ["fg", "bg", 15.97, 15.31],
  ["fg", "bg-raised", 17.41, 14.01],
  ["fg-muted", "bg", 5.8, 7.82],
  ["fg-muted", "bg-raised", 6.32, 7.16],
  ["accent", "bg", 7.14, 8.74],
  ["accent", "bg-raised", 7.78, 8.0],
  ["accent", "accent-soft", 6.49, 6.81],
  ["accent-strong", "bg", 9.93, 11.78],
  ["accent-fg", "accent", 7.78, 8.88],
  ["hero-fg", "hero-bg-1", 7.78, 10.15],
  ["hero-sub", "hero-bg-1", 5.02, 6.55],
  ["hero-sub", "hero-bg-2", 9.35, 11.03],
  ["hero-muted", "hero-bg-1", 5.9, 7.69],
  ["hero-muted", "hero-bg-2", 10.98, 12.96],
  ["hero-action-fg", "hero-action", 10.82, 12.03],
];

/**
 * The borders that mark a control (the theme select, the skip link), against every surface a
 * control sits on: WCAG 1.4.11 asks 3:1. The --border token only draws dividers, which mark nothing.
 */
const CONTROL_BORDERS: readonly [string, readonly string[]][] = [
  ["border-strong", ["bg", "bg-raised", "bg-sunken", "bg-inset"]],
];

describe("the colour tokens", () => {
  it("defines the same tokens for the dark theme whether chosen or from the system", () => {
    expect(systemDark).toEqual(dark);
    expect(Object.keys(dark).sort()).toEqual(
      Object.keys(light)
        .filter((k) => k in dark)
        .sort(),
    );
  });

  for (const [theme, t, at] of [
    ["light", light, 2],
    ["dark", { ...light, ...dark }, 3],
  ] as const) {
    it(`gives text at least 4.5:1 on its surfaces, in the ${theme} theme`, () => {
      const short: string[] = [];
      for (const [ink, surfaces] of TEXT)
        for (const s of surfaces) {
          const r = contrast(t[ink]!, t[s]!);
          if (r < 4.5) short.push(`${ink} on ${s}: ${r.toFixed(2)}`);
        }
      expect(short).toEqual([]);
    });

    it(`gives a control's border at least 3:1 on its surfaces, in the ${theme} theme`, () => {
      const short: string[] = [];
      for (const [border, surfaces] of CONTROL_BORDERS)
        for (const s of surfaces) {
          const r = contrast(t[border]!, t[s]!);
          if (r < 3) short.push(`${border} on ${s}: ${r.toFixed(2)}`);
        }
      expect(short).toEqual([]);
    });

    it(`keeps every pair at least as strong as Digital Design's, in the ${theme} theme`, () => {
      const short: string[] = [];
      for (const floor of FLOORS) {
        const [ink, surface] = floor;
        const r = contrast(t[ink]!, t[surface]!);
        if (r < floor[at]!) short.push(`${ink} on ${surface}: ${r.toFixed(2)} < ${floor[at]}`);
      }
      expect(short).toEqual([]);
    });
  }
});

describe("the colours a browser takes from outside the stylesheets", () => {
  it("gives the browser's bar and an installed course the page's ground in each theme", () => {
    expect(BACKGROUND).toEqual({ light: light.bg, dark: dark.bg });
  });
});
