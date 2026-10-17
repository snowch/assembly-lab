// Copyright © 2026 Christopher Snow

// The words Module 0's stepper adds to the figures: none empty, no em dash, and every one marked
// DRAFT until it has been through the prose process (so the number of marks is the number of
// strings).

import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { MODULE0_STRINGS } from "./strings.module0";

/** Every string in `value`; a function's result for sample arguments counts as one string. */
function strings(value: unknown, path = "MODULE0_STRINGS"): [string, string][] {
  if (typeof value === "string") return [[path, value]];
  if (typeof value === "function")
    return strings((value as (...a: unknown[]) => unknown)("x", "y"), `${path}()`);
  if (value && typeof value === "object")
    return Object.entries(value).flatMap(([k, v]) => strings(v, `${path}.${k}`));
  return [];
}

describe("Module 0's added figure words", () => {
  const all = strings(MODULE0_STRINGS);

  it("are none of them empty, and have no em dash", () => {
    expect(all.length).toBeGreaterThan(15);
    expect(all.filter(([, s]) => s.trim() === "").map(([p]) => p)).toEqual([]);
    expect(all.filter(([, s]) => s.includes("—")).map(([p]) => p)).toEqual([]);
  });

  it("are each marked DRAFT, so a string that has not been through the prose process is seen", () => {
    const source = readFileSync(new URL("./strings.module0.ts", import.meta.url), "utf8");
    expect(source.match(/\/\/ DRAFT/g) ?? []).toHaveLength(all.length);
  });

  it("use none of the terms Module 0 withholds", () => {
    const withheld =
      /\b(flags?|hex|hexadecimal|signed|unsigned|address(es)?|stack|link register|calling convention|opcode|mnemonic)\b/i;
    expect(all.filter(([, s]) => withheld.test(s)).map(([p]) => p)).toEqual([]);
  });
});
