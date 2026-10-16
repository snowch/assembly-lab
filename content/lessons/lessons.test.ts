// Copyright © 2026 Christopher Snow

// Every lesson that is written belongs to the plan. With no lessons yet, these hold vacuously;
// the first lesson makes them real.

import { describe, expect, it } from "vitest";

import { moduleByNumber } from "../plan/plan";
import { LESSONS } from ".";

describe("the lessons", () => {
  it("have ids nobody else has", () => {
    const ids = LESSONS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each belong to a module the plan has", () => {
    for (const l of LESSONS) expect(moduleByNumber(l.module), l.id).toBeDefined();
  });
});
