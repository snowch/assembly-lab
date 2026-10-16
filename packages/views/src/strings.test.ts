// Copyright © 2026 Christopher Snow

// The views' words: none empty, no em dash, and the book's shape.

import { describe, expect, it } from "vitest";

import { LESSONS } from "@al/content";

import { STEPS, createBook } from "./book";
import { INTERACTIVES } from "./interactives";
import { VIEW_STRINGS } from "./strings";

/** Every string in `value`, with where it was found; a function's result for sample arguments. */
function strings(value: unknown, path = "VIEW_STRINGS"): [string, string][] {
  if (typeof value === "string") return [[path, value]];
  if (typeof value === "function")
    return strings((value as (...a: unknown[]) => unknown)("x", 1), `${path}()`);
  if (Array.isArray(value)) return value.flatMap((v, i) => strings(v, `${path}[${i}]`));
  if (value && typeof value === "object")
    return Object.entries(value).flatMap(([k, v]) => strings(v, `${path}.${k}`));
  return [];
}

describe("the views' words", () => {
  const all = strings(VIEW_STRINGS);

  it("are none of them empty", () => {
    expect(all.length).toBeGreaterThan(50);
    expect(all.filter(([, s]) => s.trim() === "").map(([p]) => p)).toEqual([]);
  });

  it("have no em dash", () => {
    expect(all.filter(([, s]) => s.includes("—")).map(([p]) => p)).toEqual([]);
  });
});

describe("the book", () => {
  const book = createBook({ title: "Assembly Lab", lessons: LESSONS });

  it("has the id the stored work is namespaced by, the lessons, and the figures Module 0 uses", () => {
    expect(book.id).toBe("assembly-lab");
    expect(book.lessons).toBe(LESSONS);
    expect(Object.keys(book.interactives)).toEqual(
      expect.arrayContaining(["listing", "stepper", "trace-prediction"]),
    );
    expect(book.interactives).toBe(INTERACTIVES);
  });

  it("gives a note for the one model its figures run", () => {
    expect(Object.keys(book.timeModelNotes)).toEqual([STEPS]);
    expect(book.timeModelNotes[STEPS]).toBe(VIEW_STRINGS.modelNote);
  });
});
