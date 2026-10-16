// Copyright © 2026 Christopher Snow

// What Module 4's figures read out of the model: a value the learner types, the conditions after a
// compare (the model's own `cset`), how two listings differ, and the arrows of a run.

import { describe, expect, it } from "vitest";

import {
  branchArrows,
  changeBetween,
  compareResult,
  diffRows,
  differingItems,
  parseInt32,
  parseTyped,
  ranLines,
} from "./branch";
import { traceOf } from "./trace";

const STEEPER_S = {
  listing: "steeper_s:\n  cmp w1, w0 C1\n  csel w0, w1, w0, ge C1\n  ret C1",
};
const STEEPER_U = {
  listing: "steeper_u:\n  cmp w1, w0 C1\n  csel w0, w1, w0, cs C1\n  ret C1",
};
const DESCRIBE = {
  listing: [
    "describe:",
    "  cmp w0, 10 C3",
    "  bgt .L9 C3",
    "  cmn w0, #10 C7",
    "  mov w0, -2 C7",
    "  csel w0, w0, wzr, lt C7",
    ".L7:",
    "  ret C8",
    ".L9:",
    "  mov w0, 2 C4",
    "  b .L7 C4",
  ].join("\n"),
};

describe("a typed value", () => {
  it("is a decimal or hexadecimal number, as a 32-bit pattern", () => {
    expect(parseTyped("8")).toEqual({ kind: "ok", pattern: 8 });
    expect(parseTyped(" 0x7fffffff ")).toEqual({ kind: "ok", pattern: 0x7fffffff });
    expect(parseTyped("0xFFFFFFFF")).toEqual({ kind: "ok", pattern: 0xffffffff });
    expect(parseTyped("-1")).toEqual({ kind: "ok", pattern: 0xffffffff });
    expect(parseTyped("-0x80000000")).toEqual({ kind: "ok", pattern: 0x80000000 });
    expect(parseTyped("4294967295")).toEqual({ kind: "ok", pattern: 0xffffffff });
  });

  it("is refused when it is not a number, or does not fit 32 bits", () => {
    expect(parseTyped("")).toEqual({ kind: "empty" });
    expect(parseTyped("eight")).toEqual({ kind: "not-a-number" });
    expect(parseTyped("1.5")).toEqual({ kind: "not-a-number" });
    expect(parseTyped("0x")).toEqual({ kind: "not-a-number" });
    expect(parseTyped("4294967296")).toEqual({ kind: "out-of-range" });
    expect(parseTyped("-2147483649")).toEqual({ kind: "out-of-range" });
    expect(parseTyped("0x100000000")).toEqual({ kind: "out-of-range" });
  });

  it("is a whole number in decimal from −2147483648 to 2147483647 where an int is meant", () => {
    expect(parseInt32("15")).toBe(15);
    expect(parseInt32("-15")).toBe(0xfffffff1);
    expect(parseInt32("2147483647")).toBe(0x7fffffff);
    expect(parseInt32("-2147483648")).toBe(0x80000000);
    expect(parseInt32("2147483648")).toBeNull();
    expect(parseInt32("0x10")).toBeNull();
    expect(parseInt32("")).toBeNull();
  });
});

describe("the conditions after a compare", () => {
  const all = ["eq", "ne", "cs", "cc", "hi", "ls", "ge", "lt", "gt", "le", "vs"];

  it("are the model's own, from a cset for each: 8 and 8 leave NZCV 0110", () => {
    const r = compareResult(8, 8, all);
    expect(r.flags).toEqual({ n: false, z: true, c: true, v: false });
    expect(
      Object.entries(r.holds)
        .filter(([, yes]) => yes)
        .map(([c]) => c),
    ).toEqual(["eq", "cs", "ls", "ge", "le"]);
  });

  it("read V as well as N: 0x7fffffff and 0xffffffff leave NZCV 1001, ge yes and cc yes", () => {
    const r = compareResult(0x7fffffff, 0xffffffff, all);
    expect(r.flags).toEqual({ n: true, z: false, c: false, v: true });
    expect(r.holds["ge"]).toBe(true);
    expect(r.holds["lt"]).toBe(false);
    expect(r.holds["cc"]).toBe(true);
    expect(r.holds["cs"]).toBe(false);
    expect(r.holds["vs"]).toBe(true);
  });

  it("have exactly one of each pair hold, for every pair of some patterns", () => {
    const patterns = [0, 1, 7, 0x7fffffff, 0x80000000, 0xfffffffb, 0xffffffff];
    for (const a of patterns)
      for (const b of patterns) {
        const { holds } = compareResult(a, b, all);
        for (const [x, y] of [
          ["eq", "ne"],
          ["cs", "cc"],
          ["hi", "ls"],
          ["ge", "lt"],
          ["gt", "le"],
        ] as const)
          expect(holds[x] !== holds[y], `${x} ${y} after cmp ${a}, ${b}`).toBe(true);
      }
  });
});

describe("how two listings differ", () => {
  it("is one item for steeper_s and steeper_u: the last item of csel", () => {
    const rows = diffRows(STEEPER_S, STEEPER_U);
    expect(rows.map((r) => [...r.differing])).toEqual([[], [4], []]);
    expect(rows[1]!.left).toEqual(["csel", "w0", "w1", "w0", "ge"]);
    expect(rows[1]!.right).toEqual(["csel", "w0", "w1", "w0", "cs"]);
    expect(differingItems(rows)).toBe(1);
  });

  it("names the change in the model's terms: csel:last", () => {
    expect(changeBetween(STEEPER_S, STEEPER_U)).toEqual({
      value: "csel:last",
      mnemonic: "csel",
      how: "last",
    });
  });

  it("tells a change of operands from a change of last item and from another instruction", () => {
    const swapped = { listing: "steeper_u:\n  cmp w0, w1\n  csel w0, w1, w0, ge\n  ret" };
    expect(changeBetween(STEEPER_S, swapped)).toMatchObject({ value: "cmp:operands" });
    const other = { listing: "steeper_u:\n  cmn w1, w0\n  csel w0, w1, w0, ge\n  ret" };
    expect(changeBetween(STEEPER_S, other)).toMatchObject({ value: "cmp:instruction" });
    const two = { listing: "steeper_u:\n  cmp w0, w1\n  csel w0, w1, w0, cs\n  ret" };
    expect(changeBetween(STEEPER_S, two)).toEqual({ value: "several" });
    expect(changeBetween(STEEPER_S, STEEPER_S)).toEqual({ value: "none" });
  });

  it("treats the same instruction written two ways as the same", () => {
    const a = { listing: "f:\n  cmn w0, #10\n  ret" };
    const b = { listing: "f:\n  cmn w0, 10\n  ret" };
    expect(changeBetween(a, b)).toEqual({ value: "none" });
  });
});

describe("the arrows of a run", () => {
  const run = (g: number) => traceOf(DESCRIBE, { entry: "describe", args: [g] });

  it("go from each branch to the label it names, and ret is not one", () => {
    const arrows = branchArrows(run(15));
    expect(arrows.map((a) => [a.label, a.from, a.to])).toEqual([
      [".L9", 2, 8],
      [".L7", 10, 6],
    ]);
  });

  it("are taken for describe(15): bgt and b both ran and went", () => {
    expect(branchArrows(run(15)).map((a) => a.state)).toEqual(["taken", "taken"]);
  });

  it("are not taken for bgt and not run for b, for describe(10)", () => {
    expect(branchArrows(run(10)).map((a) => a.state)).toEqual(["not-taken", "not-run"]);
  });

  it("keep arrows whose spans overlap in different lanes, and one that does not in the same lane", () => {
    const arrows = branchArrows(run(15));
    expect(arrows[0]!.lane).not.toBe(arrows[1]!.lane);
    const apart = traceOf(
      {
        listing: ["f:", "  cbz w0, .La", ".La:", "  cbz w0, .Lb", ".Lb:", "  ret"].join("\n"),
      },
      { entry: "f", args: [0] },
    );
    expect(branchArrows(apart).map((a) => a.lane)).toEqual([0, 0]);
  });

  it("draw cbz, cbnz, tbz, tbnz and b.cond, and not bl or ret", () => {
    const t = traceOf(
      {
        listing: [
          "f:",
          "  cbz w0, .L1",
          ".L1:",
          "  cbnz w0, .L2",
          ".L2:",
          "  tbz w0, 1, .L3",
          ".L3:",
          "  tbnz w0, 1, .L4",
          ".L4:",
          "  b.eq .L5",
          ".L5:",
          "  ret",
        ].join("\n"),
      },
      { entry: "f", args: [0] },
    );
    expect(branchArrows(t).map((a) => a.label)).toEqual([".L1", ".L2", ".L3", ".L4", ".L5"]);
  });

  it("know which lines the run ran", () => {
    const ran10 = [...ranLines(run(10))].sort((a, b) => a - b);
    expect(ran10).toEqual([1, 2, 3, 4, 5, 7]);
    const ran15 = [...ranLines(run(15))].sort((a, b) => a - b);
    expect(ran15).toEqual([1, 2, 7, 9, 10]);
  });
});
