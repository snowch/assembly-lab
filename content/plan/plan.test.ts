// Copyright © 2026 Christopher Snow

// The plan as data: what the front page and the cover for a browser with no scripts list.

import { describe, expect, it } from "vitest";

import { MODULES, OPTIONAL_PART, PARTS, PLAN, STATUSES, moduleByNumber } from "./plan";

describe("the course's plan", () => {
  it("has four parts, then the optional chapter", () => {
    expect(PARTS.map((p) => p.title)).toEqual([
      "The machine's state",
      "Choosing what runs next",
      "Memory",
      "Functions and C",
    ]);
    expect(PLAN).toEqual([...PARTS, OPTIONAL_PART]);
  });

  it("gives every part, and every module, an id nobody else has", () => {
    const ids = [...PLAN.map((p) => p.id), ...MODULES.map((m) => m.id)];
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z][a-z0-9-]*$/);
  });

  it("numbers the modules 0 to 11 in order across the parts, then the optional chapter A", () => {
    expect(PARTS.flatMap((p) => p.modules).map((m) => m.label)).toEqual(
      Array.from({ length: 12 }, (_, i) => String(i)),
    );
    expect(OPTIONAL_PART.modules.map((m) => m.label)).toEqual(["A"]);
  });

  it("gives every part at least one module", () => {
    for (const p of PLAN) expect(p.modules.length, p.title).toBeGreaterThan(0);
  });

  it("gives every module a title, a line on what the learner does and a known status", () => {
    for (const m of MODULES) {
      expect(m.title.trim(), `module ${m.label}`).not.toBe("");
      expect(m.line.trim(), `module ${m.label}`).not.toBe("");
      expect(STATUSES, `module ${m.label}`).toContain(m.status);
    }
  });

  it("gives every module a title nobody else has", () => {
    const titles = MODULES.map((m) => m.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("has every module planned, until the author approves the plan", () => {
    expect(MODULES.filter((m) => m.status !== "planned")).toEqual([]);
  });

  it("finds a module by the number a lesson holds", () => {
    expect(moduleByNumber(0)?.title).toBe("Meet the machine");
    expect(moduleByNumber(11)?.title).toBe("Where C and the machine disagree");
    expect(moduleByNumber(12)).toBeUndefined();
  });
});
