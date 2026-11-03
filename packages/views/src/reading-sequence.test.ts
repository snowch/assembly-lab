// Copyright © 2026 Christopher Snow
import { describe, expect, it } from "vitest";
import { fourBitReadings } from "./complement";
import { bitWeightsOfPattern } from "./readings";
import { READING_EXAMPLES as E, groupedReading, smallReadingSum } from "./reading-sequence";
describe("worked reading examples and the width bridge", () => {
  it("pins worked results and keeps the fresh cases distinct", () => {
    expect([E.before.unsigned, E.before.signed, E.set.unsigned, E.set.signed]).toEqual([
      3, 3, 11, -5,
    ]);
    expect([E.practice.unsigned, E.practice.signed]).toEqual([9, -7]);
    expect([E.bridge.unsigned, E.bridge.signed]).toEqual([2147483648, -2147483648]);
    expect([E.transfer.unsigned, E.transfer.signed]).toEqual([2147483650, -2147483646]);
    expect([E.cleared.unsigned, E.cleared.signed]).toEqual([2, 2]);
    expect(E.transfer.pattern[30]).toBe("1");
    expect(E.transfer.pattern.slice(1, 30)).toBe("0".repeat(29));
  });
  it("keeps signed top weight unchanged when clearing it and lower weights positive", () => {
    const set = bitWeightsOfPattern(E.transfer.pattern, "signed"),
      clear = bitWeightsOfPattern(E.cleared.pattern, "signed");
    expect(set[0]!.weight).toBe(clear[0]!.weight);
    expect(clear[0]!.contribution).toBe(0);
    expect(set.slice(1).every((p) => p.weight > 0)).toBe(true);
    expect(set[30]!.contribution).toBe(clear[30]!.contribution);
  });
  it("shows all four positional contributions, including clear bits, with ordinary minus notation", () => {
    for (let i = 0; i < 16; i++) {
      const r = fourBitReadings(i.toString(2).padStart(4, "0"));
      for (const way of ["unsigned", "signed"] as const) {
        expect(r.places.reduce((sum, p) => sum + p[way], 0)).toBe(r[way]);
        expect(smallReadingSum(r, way)).not.toContain("+ −");
      }
    }
    expect(smallReadingSum(E.before, "signed")).toBe("0 + 0 + 2 + 1 = 3");
    expect(groupedReading(E.transfer.signed)).toBe("−2,147,483,646");
  });
});
