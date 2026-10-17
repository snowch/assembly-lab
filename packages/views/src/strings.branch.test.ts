// Copyright © 2026 Christopher Snow

// The words of Module 4's figures: none empty, no em dash, every one marked DRAFT until it has been
// through the prose process (so the marks are the strings, and a new one is a decision somebody
// sees), and the names and rules of the conditions the very words of the lesson's list.

import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { BRANCH_STRINGS, CONDITION_ROWS } from "./strings.branch";

/** Every string in `value`, with where it was found; a function's result for sample arguments. */
function strings(value: unknown, path = "BRANCH_STRINGS"): [string, string][] {
  if (typeof value === "string") return [[path, value]];
  if (typeof value === "function")
    return strings((value as (...a: unknown[]) => unknown)("x", 1, 2, 3, 4, 5), `${path}()`);
  if (value && typeof value === "object")
    return Object.entries(value).flatMap(([k, v]) => strings(v, `${path}.${k}`));
  return [];
}

const source = readFileSync(new URL("./strings.branch.ts", import.meta.url), "utf8");

describe("the Module 4 figures' words", () => {
  const all = strings(BRANCH_STRINGS);

  it("are none of them empty", () => {
    expect(all.length).toBeGreaterThan(25);
    expect(all.filter(([, s]) => s.trim() === "").map(([p]) => p)).toEqual([]);
  });

  it("have no em dash", () => {
    expect(all.filter(([, s]) => s.includes("—")).map(([p]) => p)).toEqual([]);
  });

  it("went through the prose process (17 October 2026), so none of those is marked DRAFT; the 40 interface labels added with the panels, the condition table and the branch path since are", () => {
    // Each is a short label of a figure, not a sentence of a lesson, and is marked on the line above
    // it. The count is the list: a new string is a decision somebody sees.
    const marks = source.match(/^\s*\/\/ DRAFT$/gm) ?? [];
    expect(marks).toHaveLength(40);
    // Every mark sits directly above a string of the file.
    const lines = source.split("\n");
    lines.forEach((l, i) => {
      if (/^\s*\/\/ DRAFT$/.test(l)) expect(lines[i + 1], `line ${i + 2}`).toMatch(/^\s+\w+:/);
    });
  });

  it("use sentences a learner can read: a code span is closed and a name is not left in braces", () => {
    for (const [path, s] of all) {
      expect((s.match(/`/g) ?? []).length % 2, path).toBe(0);
      expect(s, path).not.toMatch(/[{}]|undefined|NaN/);
    }
  });
});

describe("the conditions the figure of every condition shows", () => {
  const prose = readFileSync(
    new URL("../../../docs/notes/module-4/prose.md", import.meta.url),
    "utf8",
  );
  const flat = (s: string) => s.replace(/[`*]/g, "").replace(/\s+/g, " ");
  const part7 = flat(prose.slice(prose.indexOf("## 7. What each condition reads")));

  it("have the names and rules the lesson's list gives, word for word", () => {
    for (const c of CONDITION_ROWS.filter((r) => r.name !== "vs")) {
      // One line per condition: its name, what it means, which reading, then what it reads.
      const esc = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      expect(part7, c.name).toMatch(
        new RegExp(`${esc(c.name)}, ${esc(c.means)}[^:]*: ${esc(c.reads)}\\.`),
      );
    }
    expect(part7).toContain("vs (met in Module 2): V is 1.");
  });

  it("are the lesson's ten, and vs", () => {
    expect(CONDITION_ROWS.map((c) => c.name)).toEqual([
      "eq",
      "ne",
      "cs",
      "cc",
      "hi",
      "ls",
      "ge",
      "lt",
      "gt",
      "le",
      "vs",
    ]);
  });
});
