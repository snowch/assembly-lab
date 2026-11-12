// Copyright © 2026 Christopher Snow
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  fourBitFlags,
  primerAttempt,
  primerCorrect,
  primerReady,
  FLAG_PRIMER_INPUTS,
} from "./flag-primer";

describe("four-bit flag teaching model", () => {
  it("matches independent signed and unsigned bounds for all 256 additions", () => {
    const signed = (n: number) => (n < 8 ? n : n - 16);
    for (let a = 0; a < 16; a++)
      for (let b = 0; b < 16; b++) {
        const view = fourBitFlags(a, b),
          result = (a + b) % 16,
          sum = signed(a) + signed(b);
        expect(view.addition.result.unsigned).toBe(result);
        expect(view.signedSum).toBe(sum);
        expect(view.flags).toEqual({
          n: result >= 8,
          z: result === 0,
          c: a + b > 15,
          v: sum < -8 || sum > 7,
        });
      }
  });
  it("covers each focus and an independent fresh case with both overflow flags", () => {
    const actual = Object.values(FLAG_PRIMER_INPUTS).map((pair) => {
      const { flags } = fourBitFlags(pair[0], pair[1]);
      return [flags.n, flags.z, flags.c, flags.v].map(Number).join("");
    });
    expect(actual).toEqual(["1000", "0100", "0010", "1001", "0011"]);
  });
  it("pins the numerical facts used by the practice feedback", () => {
    expect(FLAG_PRIMER_INPUTS.practice).toEqual([8, 9]);
    const { addition, signedSum } = fourBitFlags(...FLAG_PRIMER_INPUTS.practice);
    expect([addition.a.signed, addition.b.signed, signedSum]).toEqual([-8, -7, -15]);
    expect([
      addition.fullSum,
      addition.result.pattern,
      addition.result.unsigned,
      addition.result.signed,
    ]).toEqual([17, "0001", 1, 1]);
  });
  it("keeps every displayed arithmetic call in the GNU/QEMU corpus", () => {
    const { calls } = JSON.parse(
      readFileSync("scripts/real-tools/corpus/module1-four-bit.json", "utf8"),
    );
    for (const [a, b] of Object.values(FLAG_PRIMER_INPUTS))
      expect(calls).toContainEqual({
        entry: "calculate_add",
        args: [
          [String(a), 32],
          [String(b), 32],
        ],
      });
  });
  it("validates restored answers instead of trusting a saved completion", () => {
    expect(primerReady(primerAttempt({ submitted: true, choices: { n: "2" } }))).toBe(false);
    expect(
      primerCorrect(
        primerAttempt({
          submitted: true,
          correct: true,
          choices: { n: "0", z: "0", c: "0", v: "0" },
        }),
      ),
    ).toBe(false);
    expect(primerCorrect(primerAttempt({ choices: { n: "0", z: "0", c: "1", v: "1" } }))).toBe(
      true,
    );
  });
});
