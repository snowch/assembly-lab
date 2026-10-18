// Copyright © 2026 Christopher Snow

// The plan as data: what the front page and the cover for a browser with no scripts list.

import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { LESSONS } from "../lessons";
import {
  MODULES,
  OPTIONAL_PART,
  PARTS,
  PLAN,
  STATUSES,
  lessonsOf,
  moduleByNumber,
  statusOf,
} from "./plan";

describe("the course's plan", () => {
  it("has four parts, then the optional chapter", () => {
    expect(PARTS.map((p) => p.title)).toEqual([
      "The machine's state",
      "Choosing what runs next",
      "Memory and wider values",
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
      expect(STATUSES, `module ${m.label}`).toContain(statusOf(m, LESSONS));
    }
  });

  it("types no status: the plan's data has none, and statusOf works it out from the lessons", () => {
    for (const m of MODULES)
      expect(Object.keys(m).sort(), m.title).toEqual([
        "id",
        "label",
        "lessonModule",
        "line",
        "title",
      ]);
  });

  it("gives every module a title nobody else has", () => {
    const titles = MODULES.map((m) => m.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("publishes a module exactly when a lesson of it is written, and plans every other", () => {
    const published = MODULES.filter((m) => statusOf(m, LESSONS) === "published");
    expect(published.map((m) => m.label)).toEqual([
      ...new Set(LESSONS.map((l) => moduleByNumber(l.module)!.label)),
    ]);
    expect(published.map((m) => m.title)).toEqual(
      MODULES.filter((m) => LESSONS.some((l) => l.module === m.lessonModule)).map((m) => m.title),
    );
    expect(published.slice(0, 4).map((m) => m.title)).toEqual([
      "Meet the machine",
      "Registers and readings",
      "Adding, subtracting and the flags",
      "Logic, shifts and masks",
    ]);
    for (const m of MODULES.filter((m) => !published.includes(m)))
      expect(statusOf(m, LESSONS), m.title).toBe("planned");
  });

  it("finds a module's lessons by the module number a lesson holds", () => {
    const meet = moduleByNumber(0)!;
    expect(lessonsOf(meet, LESSONS).map((l) => l.id)).toEqual(["meet-the-machine"]);
    // Modules 1 and 2 have two lessons each, in the order they are taught.
    expect(lessonsOf(moduleByNumber(1)!, LESSONS).map((l) => l.id)).toEqual([
      "one-pattern-three-readings",
      "constants-and-widths",
    ]);
    expect(lessonsOf(moduleByNumber(2)!, LESSONS).map((l) => l.id)).toEqual([
      "adding-and-the-flags",
      "subtracting-and-the-tick-counter",
    ]);
    // Module 3 has two lessons, in the order they are taught.
    expect(lessonsOf(moduleByNumber(3)!, LESSONS).map((l) => l.id)).toEqual(["masks", "shifts"]);
    expect(lessonsOf(moduleByNumber(11)!, LESSONS).map((l) => l.id)).toEqual([
      "c-and-overflow",
      "checked-arithmetic",
    ]);
    expect(statusOf(meet, [])).toBe("planned");
    expect(statusOf(meet, [{ id: "x", module: 0 }])).toBe("published");
    expect(statusOf(meet, [{ id: "y", module: 1 }])).toBe("planned");
  });

  it("finds a module by the number a lesson holds", () => {
    expect(moduleByNumber(0)?.title).toBe("Meet the machine");
    expect(moduleByNumber(11)?.title).toBe("Where C and the machine disagree");
    expect(moduleByNumber(12)?.label).toBe("A");
    expect(lessonsOf(moduleByNumber(12)!, [{ id: "arm32", module: 12 }])).toEqual([
      { id: "arm32", module: 12 },
    ]);
    expect(moduleByNumber(13)).toBeUndefined();
  });

  it("names its parts and modules exactly as docs/plan.md does, so the two cannot drift", () => {
    const doc = readFileSync(new URL("../../docs/plan.md", import.meta.url), "utf8");
    PARTS.forEach((part, i) => {
      expect(doc, part.title).toContain(`### Part ${i + 1}: ${part.title}\n`);
    });
    for (const m of MODULES) expect(doc, m.title).toContain(`| ${m.label} ${m.title} |`);
  });
});
