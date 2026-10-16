// Copyright © 2026 Christopher Snow

// Every function in the A64 listings GCC made for checkpoint 1 assembles unchanged and runs. The
// listings are read from docs/notes/checkpoint-1/listings.md, so the test cannot drift from them.

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { assemble } from "./assemble.ts";
import { DATA_BASE } from "./layout.ts";
import { run } from "./run.ts";
import type { Program } from "./types.ts";

const text = readFileSync(
  new URL("../../../docs/notes/checkpoint-1/listings.md", import.meta.url),
  "utf8",
);

/** The A64 blocks of the file, each a list of functions with their lines. */
function a64Blocks(): string[] {
  const blocks: string[] = [];
  let cur: string[] | null = null;
  for (const line of text.split("\n")) {
    if (line.startsWith("===== A64")) cur = [];
    else if (cur && line.startsWith("stderr:")) {
      blocks.push(cur.join("\n") + "\n");
      cur = null;
    } else if (cur) {
      // Each line ends with the C line it came from, `C4`, which is not assembly.
      cur.push(line.replace(/\s+C\d+\s*$/, "").replace(/\s+$/, ""));
    }
  }
  return blocks;
}

const blocks = a64Blocks();
const functionNames = (src: string): string[] =>
  src
    .split("\n")
    .filter((l) => /^[a-z_][a-z0-9_]*:$/i.test(l))
    .map((l) => l.slice(0, -1));

const data = `
  .data
  .balign 16
buf: .byte 0x80, 0x7f, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
arr: .word 1, -2, 3, 0x7fffffff, 5, 6
`;

describe("the GCC listings of checkpoint 1", () => {
  it("finds the two A64 listings and all fifteen functions", () => {
    expect(blocks).toHaveLength(2);
    expect(blocks.flatMap(functionNames)).toEqual([
      "inc8",
      "big",
      "wrapped",
      "load_s",
      "load_u",
      "max_s",
      "max_u",
      "clear",
      "div10",
      "check",
      "add_i",
      "add_l",
      "sdiv0",
      "elapsed",
      "sum",
    ]);
  });

  it.each([0, 1])("listing %i assembles unchanged, labels and all", (i) => {
    const { errors, program } = assemble(blocks[i] as string);
    expect(errors).toEqual([]);
    expect(program?.instructions.length).toBeGreaterThan(10);
  });

  function go(program: Program, entry: string, args: [bigint, 32 | 64][]) {
    return run(program, { entry, args: args.map(([value, width]) => ({ value, width })) });
  }
  const prog = (i: number): Program => assemble((blocks[i] as string) + data).program as Program;
  const BUF = BigInt(DATA_BASE);
  const ARR = BigInt(DATA_BASE + 16);

  it("inc8 adds one to a signed byte, extending first", () => {
    const p = prog(0);
    // GCC sign-extends the argument byte and then adds: 127 + 1 does not wrap to -128.
    expect(go(p, "inc8", [[127n, 32]]).final.x[0]).toBe(128n);
    expect(go(p, "inc8", [[0xffn, 32]]).final.x[0]).toBe(0n);
    expect(go(p, "inc8", [[0x180n, 32]]).final.x[0]).toBe(0xffffff81n);
  });

  it("big returns 257", () => {
    expect(go(prog(0), "big", []).final.x[0]).toBe(257n);
  });

  it("wrapped is 1 only when the subtraction borrowed", () => {
    const p = prog(0);
    expect(
      go(p, "wrapped", [
        [1n, 32],
        [2n, 32],
      ]).final.x[0],
    ).toBe(1n);
    expect(
      go(p, "wrapped", [
        [5n, 32],
        [3n, 32],
      ]).final.x[0],
    ).toBe(0n);
    expect(
      go(p, "wrapped", [
        [0n, 32],
        [0n, 32],
      ]).final.x[0],
    ).toBe(0n);
    expect(
      go(p, "wrapped", [
        [0n, 32],
        [0xffffffffn, 32],
      ]).final.x[0],
    ).toBe(1n);
  });

  it("load_s sign-extends the byte and load_u zero-extends it", () => {
    const p = prog(0);
    expect(go(p, "load_s", [[BUF, 64]]).final.x[0]).toBe(0xffffff80n);
    expect(go(p, "load_s", [[BUF + 1n, 64]]).final.x[0]).toBe(0x7fn);
    expect(go(p, "load_u", [[BUF, 64]]).final.x[0]).toBe(0x80n);
  });

  it("max_s and max_u differ for the same bits", () => {
    const p = prog(0);
    expect(
      go(p, "max_s", [
        [0xffffffffn, 32],
        [1n, 32],
      ]).final.x[0],
    ).toBe(1n);
    expect(
      go(p, "max_u", [
        [0xffffffffn, 32],
        [1n, 32],
      ]).final.x[0],
    ).toBe(0xffffffffn);
    expect(
      go(p, "max_s", [
        [5n, 32],
        [9n, 32],
      ]).final.x[0],
    ).toBe(9n);
    expect(
      go(p, "max_s", [
        [9n, 32],
        [5n, 32],
      ]).final.x[0],
    ).toBe(9n);
  });

  it("clear writes n zero bytes, and does nothing for n of zero", () => {
    const p = prog(0);
    const none = go(p, "clear", [
      [BUF, 64],
      [0n, 32],
    ]);
    expect(none.steps).toHaveLength(2);
    expect(none.read(DATA_BASE, 4)).toEqual(new Uint8Array([0x80, 0x7f, 1, 2]));
    const five = go(p, "clear", [
      [BUF, 64],
      [5n, 32],
    ]);
    expect(five.read(DATA_BASE, 7)).toEqual(new Uint8Array([0, 0, 0, 0, 0, 4, 5]));
    expect(five.stop.kind).toBe("returned");
  });

  it("div10 divides by ten rounding toward zero, with a multiply", () => {
    const p = prog(0);
    for (const v of [0, 9, 10, 99, 100, 12345678, 2147483647]) {
      expect(go(p, "div10", [[BigInt(v), 32]]).final.x[0], String(v)).toBe(
        BigInt(Math.trunc(v / 10)),
      );
    }
    for (const v of [-1, -9, -10, -99, -2147483648]) {
      const want = BigInt.asUintN(32, BigInt(Math.trunc(v / 10)));
      expect(go(p, "div10", [[BigInt.asUintN(32, BigInt(v)), 32]]).final.x[0], String(v)).toBe(
        want,
      );
    }
  });

  it("check is always 1", () => {
    const p = prog(0);
    for (const v of [0n, 5n, 0x7fffffffn, 0x80000000n]) {
      expect(go(p, "check", [[v, 32]]).final.x[0]).toBe(1n);
    }
  });

  it("add_i and add_l", () => {
    const p = prog(1);
    expect(
      go(p, "add_i", [
        [2147483647n, 32],
        [1n, 32],
      ]).final.x[0],
    ).toBe(0x80000000n);
    expect(
      go(p, "add_l", [
        [1n, 64],
        [0xffffffffn, 32],
      ]).final.x[0],
    ).toBe(0n);
    expect(
      go(p, "add_l", [
        [0n, 64],
        [0x80000000n, 32],
      ]).final.x[0],
    ).toBe(0xffffffff80000000n);
  });

  it("sdiv0 divides, and a zero divisor gives zero without stopping", () => {
    const p = prog(1);
    expect(
      go(p, "sdiv0", [
        [7n, 32],
        [2n, 32],
      ]).final.x[0],
    ).toBe(3n);
    const zero = go(p, "sdiv0", [
      [7n, 32],
      [0n, 32],
    ]);
    expect(zero.final.x[0]).toBe(0n);
    expect(zero.stop.kind).toBe("returned");
    expect(
      go(p, "sdiv0", [
        [0x80000000n, 32],
        [0xffffffffn, 32],
      ]).final.x[0],
    ).toBe(0x80000000n);
  });

  it("elapsed subtracts and wraps", () => {
    const p = prog(1);
    expect(
      go(p, "elapsed", [
        [10n, 32],
        [3n, 32],
      ]).final.x[0],
    ).toBe(7n);
    expect(
      go(p, "elapsed", [
        [3n, 32],
        [10n, 32],
      ]).final.x[0],
    ).toBe(0xfffffff9n);
  });

  it("sum adds the first n words, and is zero for an empty array", () => {
    const p = prog(1);
    expect(
      go(p, "sum", [
        [ARR, 64],
        [0n, 32],
      ]).final.x[0],
    ).toBe(0n);
    expect(
      go(p, "sum", [
        [ARR, 64],
        [-1n & 0xffffffffn, 32],
      ]).final.x[0],
    ).toBe(0n);
    expect(
      go(p, "sum", [
        [ARR, 64],
        [3n, 32],
      ]).final.x[0],
    ).toBe(2n);
    // 1 - 2 + 3 + 0x7fffffff wraps at 32 bits.
    expect(
      go(p, "sum", [
        [ARR, 64],
        [4n, 32],
      ]).final.x[0],
    ).toBe(0x80000001n);
    const six = go(p, "sum", [
      [ARR, 64],
      [6n, 32],
    ]);
    expect(six.stop.kind).toBe("returned");
    expect(six.final.x[0]).toBe((0x80000001n + 11n) & 0xffffffffn);
  });

  it("every function runs from its label to its ret", () => {
    for (let i = 0; i < 2; i++) {
      const p = prog(i);
      for (const name of functionNames(blocks[i] as string)) {
        const r = go(p, name, [
          [BUF, 64],
          [2n, 32],
        ]);
        expect(r.stop.kind, name).toBe("returned");
      }
    }
  });
});
