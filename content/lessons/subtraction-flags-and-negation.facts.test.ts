// Copyright © 2026 Christopher Snow

import { describe, expect, it } from "vitest";
import subtractionCorpus from "../../scripts/real-tools/corpus/module2-subs.json";
import { additionSteps, traceOf } from "@al/views";
import { NEGATE_FLAGS } from "./subtracting-and-the-tick-counter.listings";
import {
  NEGATION_INPUTS,
  PRESERVED_NEGATION,
  SUBTRACT_FLAGS,
} from "./subtraction-flags-and-negation.listings";
import { assembly, callText, corpusText, functionIn, nzcv } from "./module-2.runs";

describe("focused subtraction and negation facts", () => {
  it.each([
    [8, 3, 5, "0010"],
    [3, 8, 4294967291, "1000"],
    [8, 0, 8, "0010"],
    [8, 8, 0, "0110"],
  ] as const)("%s minus %s retains %s with NZCV %s", (a, b, result, flags) => {
    const outcome = callText(SUBTRACT_FLAGS.listing, "subtract_flags", [a, b]);
    expect(outcome.w0).toBe(result);
    expect(nzcv(outcome.flags)).toBe(flags);
    const record = additionSteps(
      traceOf(SUBTRACT_FLAGS, { entry: "subtract_flags", args: [a, b] }),
    )[0]!.addition!;
    expect(record.a + record.b + BigInt(record.carryIn)).toBe(BigInt(a) + 2n ** 32n - BigInt(b));
    expect(record.carryOut).toBe(a >= b ? 1 : 0);
  });

  it.each([
    [5, 4294967291, "1000"],
    [0x80000000, 2147483648, "1001"],
    [0, 0, "0110"],
    [0x80000001, 2147483647, "0000"],
    [7, 4294967289, "1000"],
  ] as const)("negs input %s retains %s with NZCV %s", (input, result, flags) => {
    const outcome = callText(NEGATE_FLAGS.listing, "negate_flags", [input]);
    expect(outcome.w0).toBe(result);
    expect(nzcv(outcome.flags)).toBe(flags);
    expect(outcome.w0).toBe(Number(BigInt.asUintN(32, -BigInt(input))));
  });

  it("uses fresh zero and near-minimum inputs after the ordinary and minimum examples", () => {
    expect(NEGATION_INPUTS).toEqual([0, 0x80000001]);
    expect(BigInt.asIntN(32, BigInt(NEGATION_INPUTS[1]))).toBe(-2147483647n);
    expect(2147483648n).toBeGreaterThan(2147483647n);
  });

  it("plain neg preserves the earlier V even though this exact signed result fits", () => {
    const outcome = callText(PRESERVED_NEGATION.listing, "negate_preserved_flags", [3, 0x80000000]);
    expect(outcome.w0).toBe(4294967293);
    expect(BigInt.asIntN(32, BigInt(outcome.w0))).toBe(-3n);
    expect(nzcv(outcome.flags)).toBe("1001");
  });

  it("holds every authored demonstration and fresh call to the native differential corpus", () => {
    const corpus = corpusText("module2-subs");
    for (const [name, program] of [
      ["subtract_flags", SUBTRACT_FLAGS],
      ["negate_preserved_flags", PRESERVED_NEGATION],
    ] as const)
      expect(functionIn(corpus, name)).toEqual(functionIn(assembly(program.listing), name));
  });

  it.each([
    [7, 8, 4294967295, "1000"],
    [8, 8, 0, "0110"],
    [9, 8, 1, "0010"],
  ] as const)(
    "checks boundary input %s minus %s in the model and native corpus",
    (a, b, result, flags) => {
      const outcome = callText(SUBTRACT_FLAGS.listing, "subtract_flags", [a, b]);
      expect(outcome.w0).toBe(result);
      expect(nzcv(outcome.flags)).toBe(flags);
      expect(subtractionCorpus.calls).toContainEqual({
        entry: "subtract_flags",
        args: [
          [String(a), 32],
          [String(b), 32],
        ],
      });
    },
  );
});
