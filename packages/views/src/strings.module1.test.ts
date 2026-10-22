// Copyright © 2026 Christopher Snow

// The words Module 1's code fixes add to the figures: none empty, no em dash, and legacy strings marked
// DRAFT until it has been through the prose process (so the number of marks is the number of
// strings, a string that takes a name counting as one).

import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { MODULE1_STRINGS } from "./strings.module1";

/** Every string in the object, and a string a function makes from sample names. */
function strings(value: unknown, path = "MODULE1_STRINGS"): [string, string][] {
  if (typeof value === "string") return [[path, value]];
  if (typeof value === "function")
    return [[path, (value as (...a: string[]) => string)("x3", "w3")]];
  if (value && typeof value === "object")
    return Object.entries(value).flatMap(([k, v]) => strings(v, `${path}.${k}`));
  return [];
}

describe("Module 1's added figure words", () => {
  const all = strings(MODULE1_STRINGS);

  it("are none of them empty, and have no em dash", () => {
    expect(all.length).toBe(35);
    expect(all.filter(([, s]) => s.trim() === "").map(([p]) => p)).toEqual([]);
    expect(all.filter(([, s]) => s.includes("—")).map(([p]) => p)).toEqual([]);
  });

  it("keep legacy drafts visible and identify the separately reviewed opener labels", () => {
    const source = readFileSync(new URL("./strings.module1.ts", import.meta.url), "utf8");
    // Issue #18 labels completed separate drafting, learner and technical review.
    // Keep the remaining legacy marks rather than marking reviewed copy as a new draft.
    const reviewed = strings(MODULE1_STRINGS.opener);
    expect(reviewed).toHaveLength(13);
    expect(source).toContain("see the lesson review notes");
    expect(source.match(/^\s*\/\/ DRAFT$/gm) ?? []).toHaveLength(all.length - reviewed.length);
  });

  it("write the minus sign and the hexadecimal prefix as the lessons do", () => {
    expect(all.filter(([, s]) => /(^|\s)-\d/.test(s)).map(([p]) => p)).toEqual([]);
  });
});
