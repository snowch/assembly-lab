// Copyright © 2026 Christopher Snow

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  retainedBits,
  storageInput,
  RETAINED_BITS_CASES,
  RETAINED_BITS_PROGRAM,
} from "./retained-bits";

describe("kept storage bits", () => {
  it("uses native-checked operations and keeps all authored examples in the corpus", () => {
    const source = readFileSync("scripts/real-tools/corpus/module1-four-bit.s", "utf8");
    const calls = JSON.parse(
      readFileSync("scripts/real-tools/corpus/module1-four-bit.json", "utf8"),
    ).calls;
    expect(source).toContain(RETAINED_BITS_PROGRAM);
    for (const width of [4, 8])
      for (const value of RETAINED_BITS_CASES)
        expect(calls).toContainEqual({
          entry: width === 4 ? "keep_four" : "keep_eight",
          args: [[String(value), 32]],
        });
  });

  it("separates kept and removed place values for every accepted input and both widths", () => {
    for (const width of [4, 8] as const)
      for (let value = 0; value <= 255; value++) {
        const view = retainedBits(value, width);
        const expected = value % 2 ** width;
        const sum = (places: typeof view.keptPlaces) =>
          places.reduce((total, place) => total + place.value * place.weight, 0);
        expect(view.kept).toBe(expected);
        expect(view.keptPattern).toBe(expected.toString(2).padStart(width, "0"));
        expect(view.fullPattern).toBe(value.toString(2).padStart(width, "0"));
        expect(sum(view.keptPlaces)).toBe(expected);
        expect(sum(view.removedPlaces)).toBe(value - expected);
        expect(view.removedGroups * view.range + view.kept).toBe(value);
        expect(view.fits).toBe(value <= view.maximum);
      }
  });

  it("explains decimal 100 and the edge without a carry-flag interpretation", () => {
    expect(retainedBits(100, 4)).toMatchObject({
      fullPattern: "1100100",
      removedPattern: "110",
      removed: 96,
      removedGroups: 6,
      keptPattern: "0100",
      kept: 4,
      range: 16,
      maximum: 15,
      fits: false,
    });
    expect(retainedBits(100, 8)).toMatchObject({
      fullPattern: "01100100",
      removedPattern: "",
      removed: 0,
      keptPattern: "01100100",
      kept: 100,
      fits: true,
    });
    expect([14, 15, 16].map((value) => retainedBits(value, 4).kept)).toEqual([14, 15, 0]);
    expect(retainedBits(100, 4)).not.toHaveProperty("carryOut");
  });

  it("distinguishes explorer validation from narrowing a valid full input", () => {
    expect(storageInput("100")).toBe(100);
    expect(storageInput(" 16 ")).toBe(16);
    expect(storageInput("255")).toBe(255);
    for (const invalid of ["", "-1", "256", "0x64", "0b100", "1.5", "1e2", "100words"])
      expect(storageInput(invalid)).toBeNull();
    for (const invalid of [-1, 256, NaN, Infinity, 1.5])
      expect(() => retainedBits(invalid, 4)).toThrow();
  });
});
