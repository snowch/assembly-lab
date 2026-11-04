// Copyright © 2026 Christopher Snow

import { assemble, run } from "@al/machine";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { columnWork } from "./arith";
import { fourBitAddition, fourBitSubtraction, FOUR_BIT_EXAMPLES } from "./four-bit-arithmetic";

const programs = {
  add: assemble("calculate:\nadd w0, w0, w1\nret").program!,
  sub: assemble("calculate:\nsub w0, w0, w1\nret").program!,
};
const execute = (operation: "add" | "sub", a: number, b: number) =>
  run(programs[operation], {
    entry: "calculate",
    args: [a, b].map((value) => ({ value: BigInt(value), width: 32 as const })),
  });

describe("four-place arithmetic views of the real machine", () => {
  it("keeps the worked and practice runs in the GNU/QEMU corpus", () => {
    const source = readFileSync("scripts/real-tools/corpus/module1-four-bit.s", "utf8");
    const calls = JSON.parse(
      readFileSync("scripts/real-tools/corpus/module1-four-bit.json", "utf8"),
    ).calls as {
      entry: string;
      args: [string, number][];
    }[];
    expect(source).toContain("add w0, w0, w1");
    expect(source).toContain("sub w0, w0, w1");
    for (const [operation, a, b] of [
      ["add", 3, 1],
      ["add", 15, 1],
      ["add", 3, 11],
      ["add", 6, 13],
      ["sub", 3, 5],
      ["sub", 6, 3],
      ["sub", 0, 5],
    ] as const) {
      expect(calls).toContainEqual({
        entry: `calculate_${operation}`,
        args: [
          [String(a), 32],
          [String(b), 32],
        ],
      });
    }
  });
  it("matches ADD and independent modulo arithmetic for all 256 pairs", () => {
    for (let a = 0; a < 16; a++) {
      for (let b = 0; b < 16; b++) {
        const view = fourBitAddition(a, b);
        const machine = execute("add", a, b);
        const result = (a + b) % 16;
        expect(machine.stop.kind).toBe("returned");
        expect(view.a.unsigned).toBe(a);
        expect(view.b.unsigned).toBe(b);
        expect(view.fullSum).toBe(Number(machine.final.x[0]));
        expect(view.fullSum).toBe(a + b);
        expect(view.fullPattern).toBe((a + b).toString(2).padStart(4, "0"));
        expect(view.result.unsigned).toBe(result);
        expect(view.result.signed).toBe(result < 8 ? result : result - 16);
        expect(view.result.pattern).toBe(result.toString(2).padStart(4, "0"));
        expect(view.carryOut).toBe(Math.floor((a + b) / 16));
        let incoming = 0;
        for (const column of view.columns) {
          expect(column).toEqual(columnWork(machine.steps[0]!.addition!, column.bit));
          expect(column.a).toBe((a >> column.bit) & 1);
          expect(column.b).toBe((b >> column.bit) & 1);
          expect(column.carryIn).toBe(incoming);
          const total = ((a >> column.bit) & 1) + ((b >> column.bit) & 1) + incoming;
          expect(column.total).toBe(total);
          expect(column.kept).toBe(total % 2);
          expect(column.carryOut).toBe(Math.floor(total / 2));
          incoming = Math.floor(total / 2);
        }
        expect(view.columns.map((column) => column.bit)).toEqual([0, 1, 2, 3]);
      }
    }
  });

  it("matches SUB and independent modulo arithmetic for all 256 pairs", () => {
    for (let a = 0; a < 16; a++) {
      for (let b = 0; b < 16; b++) {
        const view = fourBitSubtraction(a, b);
        const machine = execute("sub", a, b);
        const result = (a - b + 16) % 16;
        expect(machine.stop.kind).toBe("returned");
        expect(view.a.unsigned).toBe(a);
        expect(view.b.unsigned).toBe(b);
        expect(view.result.unsigned).toBe(Number(machine.final.x[0]! & 15n));
        expect(view.result.unsigned).toBe(result);
        expect(view.result.signed).toBe(result < 8 ? result : result - 16);
        expect(view.negation.inverted.unsigned).toBe(15 - b);
        expect(view.negation.after.unsigned).toBe((16 - b) % 16);
        expect(view.addition.b).toEqual(view.negation.after);
        expect(view.addition.result).toEqual(view.result);
      }
    }
  });

  it("pins the worked examples and zero, signed-boundary and maximum inputs", () => {
    const { addition, width, subtraction } = FOUR_BIT_EXAMPLES;
    expect(fourBitAddition(addition.a, addition.b).result.pattern).toBe("0100");
    const wrapped = fourBitAddition(width.a, width.b);
    expect([wrapped.fullPattern, wrapped.result.pattern, wrapped.carryOut]).toEqual([
      "10000",
      "0000",
      1,
    ]);
    const subtracted = fourBitSubtraction(subtraction.a, subtraction.b);
    expect([
      subtracted.b.pattern,
      subtracted.negation.inverted.pattern,
      subtracted.negation.after.pattern,
      subtracted.addition.fullPattern,
      subtracted.result.signed,
    ]).toEqual(["0101", "1010", "1011", "1110", -2]);
    for (const value of [0, 8, 15]) {
      expect(fourBitSubtraction(value, value).result.pattern).toBe("0000");
      expect(fourBitAddition(value, 0).result.unsigned).toBe(value);
    }
    expect(fourBitSubtraction(0, 0).negation.fullPattern).toBe("10000");
    expect(fourBitSubtraction(0, 8).negation.after.pattern).toBe("1000");
  });

  it("rejects values outside the four-bit integer input domain", () => {
    for (const invalid of [-1, 16, 1.5, NaN, Infinity, -Infinity]) {
      for (const helper of [fourBitAddition, fourBitSubtraction]) {
        expect(() => helper(invalid, 0)).toThrow();
        expect(() => helper(0, invalid)).toThrow();
      }
    }
  });
});
