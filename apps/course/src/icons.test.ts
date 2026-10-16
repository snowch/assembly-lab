// Copyright © 2026 Christopher Snow

// The course's icons: every file web-manifest.ts names is in public/, a PNG at the size it claims,
// and the SVG they are drawn from (scripts/icons.mjs) is there too. Run `node scripts/icons.mjs`
// after changing icon.svg.

import { existsSync, readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { ICONS, webManifest } from "./web-manifest";

// Vitest runs from the repository root, as the check script does.
const PUBLIC = "apps/course/public";

/** A PNG's width and height, from its header. */
function pngSize(file: string): number[] {
  const b = readFileSync(file);
  if (
    b.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a" ||
    b.toString("latin1", 12, 16) !== "IHDR"
  )
    throw new Error(`${file} is not a PNG`);
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
}

describe("the course's icons", () => {
  it("are the PNGs web-manifest.ts names, at the sizes it claims", () => {
    const pngs = [ICONS.tabPng, ICONS.homeScreen, ...ICONS.installed, ICONS.maskable];
    for (const icon of pngs) {
      expect(existsSync(`${PUBLIC}/${icon.src}`), icon.src).toBe(true);
      expect(pngSize(`${PUBLIC}/${icon.src}`), icon.src).toEqual([icon.size, icon.size]);
    }
  });

  it("are drawn from an SVG with the rounded corner scripts/icons.mjs squares off", () => {
    expect(readFileSync(`${PUBLIC}/${ICONS.tab}`, "utf8")).toContain('rx="14"');
  });

  it("are all in the manifest the build writes, installable at 192 and 512 pixels", () => {
    const sizes = webManifest("x").icons.map((i) => i.sizes);
    expect(sizes).toEqual(expect.arrayContaining(["192x192", "512x512"]));
    expect(webManifest("x").icons.some((i) => "purpose" in i && i.purpose === "maskable")).toBe(
      true,
    );
  });
});
