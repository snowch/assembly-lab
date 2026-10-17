// Copyright © 2026 Christopher Snow

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { assemble, run, type Flags } from "@al/machine";
import {
  DIM_UP,
  DIM_DOWN,
  DIM_DO,
  DIM_WRONG_GCC,
  DIM_DOWN_WRONG,
  DIM_UP_BEQ,
  DIM_UP_TEXT,
  DIM_DOWN_TEXT,
  DIM_UNTIL_DARK_TEXT,
  DIM_UP_STARTING_TEXT,
  DIM_DOWN_STARTING_TEXT,
  DIM_UNTIL_DARK_STARTING_TEXT,
} from "./loops.listings";

const plain = (s: string) => s.replace(/ C\d+$/gm, "");
const normal = (s: string) =>
  plain(s)
    .split("\n")
    .map((l) => l.trim().replace(/\s+/g, " "))
    .filter((l) => l && !l.startsWith("//"))
    .join("\n");
const nzcv = (f: Flags) => `${+f.n}${+f.z}${+f.c}${+f.v}`;
function call(listing: string, args: readonly number[], maxSteps = 200) {
  const a = assemble(plain(listing));
  if (!a.program) throw new Error(JSON.stringify(a.errors));
  return run(a.program, {
    entry: 0x400000,
    args: args.map((value) => ({ value: BigInt(value), width: 32 })),
    maxSteps,
  });
}
const bodyVisits = (r: ReturnType<typeof call>) =>
  r.steps.filter((s) => s.text.startsWith("lsr")).length;
const value = (r: ReturnType<typeof call>) => Number(r.final.x[0]);
const corpus = (name: string) =>
  readFileSync(
    new URL(`../../scripts/real-tools/corpus/module5-${name}.s`, import.meta.url),
    "utf8",
  );

describe("Module 5 compiler records and shown programs", () => {
  it.each([
    ["dim_up", DIM_UP],
    ["dim_down", DIM_DOWN],
    ["dim_do", DIM_DO],
    ["dim_wrong", DIM_WRONG_GCC],
  ] as const)("%s agrees with the submitted C and raw source-line mapping", (name, shown) => {
    const base = `../../docs/notes/module-5/compiler/${name}`;
    const source = readFileSync(new URL(`${base}.c`, import.meta.url), "utf8");
    const request = JSON.parse(
      readFileSync(new URL(`${base}.request.json`, import.meta.url), "utf8"),
    );
    const response = JSON.parse(
      readFileSync(new URL(`${base}.response.json`, import.meta.url), "utf8"),
    ) as { code: number; asm: { text: string; source?: { line: number } | null }[] };
    expect(request.source).toBe(source);
    expect(request.options.userArguments).toBe("-O1");
    expect(source.split("\n").slice(1).join("\n").trimEnd()).toBe(shown.c);
    expect(response.code).toBe(0);
    const mapped = response.asm
      .map(
        (row) =>
          row.text.trim().replace(/\s+/g, " ") + (row.source ? ` C${row.source.line - 1}` : ""),
      )
      .join("\n");
    expect(
      shown.listing
        .split("\n")
        .map((l) => l.trim())
        .join("\n"),
    ).toBe(mapped);
    const notes = readFileSync(
      new URL("../../docs/notes/module-5/listings.md", import.meta.url),
      "utf8",
    );
    expect(notes).toContain(shown.c);
    expect(notes).toContain(shown.listing);
  });

  it.each([
    ["dim-up", DIM_UP.listing],
    ["dim-down", DIM_DOWN.listing],
    ["dim-do", DIM_DO.listing],
    ["dim-wrong-gcc", DIM_WRONG_GCC.listing],
    ["dim-down-wrong", DIM_DOWN_WRONG.listing],
    ["dim-up-beq", DIM_UP_BEQ.listing],
    ["dim-up-reference", `dim_up_reference:\n${DIM_UP_TEXT}`],
    ["dim-down-reference", `dim_down_reference:\n${DIM_DOWN_TEXT}`],
    ["dim-until-dark-reference", `dim_until_dark_reference:\n${DIM_UNTIL_DARK_TEXT}`],
  ])("%s is unchanged in the GNU as / QEMU corpus", (name, text) => {
    expect(normal(corpus(name!))).toBe(normal(text!));
  });

  it("covers each identical challenge starting point in the real-tool corpus", () => {
    for (const start of [
      DIM_UP_STARTING_TEXT,
      DIM_DOWN_STARTING_TEXT,
      DIM_UNTIL_DARK_STARTING_TEXT,
    ]) {
      expect(normal(corpus("dim-start"))).toBe(`dim_start:\n${start}`);
    }
  });
});

describe("counting up", () => {
  it.each([
    [128, 2, 5, 16, 3],
    [128, 0, 0, 128, 0],
    [128, 5, 2, 128, 0],
    [128, 0xfffffffc, 0xffffffff, 16, 3],
    [128, 0xffffffff, 0xffffffff, 128, 0],
    [0xffffffff, 0x7ffffffe, 0x80000001, 0x1fffffff, 3],
    [128, 2, 3, 64, 1],
    [128, 2, 4, 32, 2],
  ])(
    "brightness %i, interval [%i,%i) returns %i after %i body visits",
    (brightness, start, end, want, visits) => {
      for (const listing of [DIM_UP.listing, DIM_UP_TEXT]) {
        const r = call(listing, [brightness, start, end]);
        expect(r.stop.kind).toBe("returned");
        expect(value(r)).toBe(want);
        expect(bodyVisits(r)).toBe(visits);
        expect(r.steps).toHaveLength(4 * visits + 3);
      }
    },
  );
  it("runs 15 instructions with backedge outcomes taken, taken, not taken", () => {
    const r = call(DIM_UP.listing, [128, 2, 5]);
    expect(r.steps).toHaveLength(15);
    expect(r.steps.filter((s) => s.text.startsWith("bne")).map((s) => s.branch?.taken)).toEqual([
      true,
      true,
      false,
    ]);
    expect(
      r.steps.filter((s) => s.text.startsWith("lsr")).map((s) => Number(s.writes[0]?.after)),
    ).toEqual([64, 32, 16]);
  });
  it("reversing the backedge condition returns after one shift", () => {
    const r = call(DIM_UP_BEQ.listing, [128, 2, 5]);
    expect(r.stop.kind).toBe("returned");
    expect(value(r)).toBe(64);
    expect(bodyVisits(r)).toBe(1);
    expect(r.steps).toHaveLength(7);
  });
});

describe("counting down and the zero guard", () => {
  it.each([
    [128, 0, 128, 0],
    [128, 1, 64, 1],
    [128, 3, 16, 3],
    [0xffffffff, 31, 1, 31],
    [0xffffffff, 32, 0, 32],
  ])("brightness %i, count %i returns %i after %i visits", (brightness, count, want, visits) => {
    for (const listing of [DIM_DOWN.listing, DIM_DOWN_TEXT]) {
      const r = call(listing, [brightness, count]);
      expect(r.stop.kind).toBe("returned");
      expect(value(r)).toBe(want);
      expect(bodyVisits(r)).toBe(visits);
      expect(r.steps).toHaveLength(3 * visits + 2);
    }
  });
  it("uses subtraction flags, with Z set only on the last of three iterations", () => {
    const r = call(DIM_DOWN.listing, [128, 3]);
    expect(r.steps).toHaveLength(11);
    expect(
      r.steps
        .filter((s) => s.text.startsWith("subs"))
        .map((s) => [Number(s.writes[0]?.after), nzcv(s.flagsAfter)]),
    ).toEqual([
      [2, "0010"],
      [1, "0010"],
      [0, "0110"],
    ]);
    expect(call(DIM_DOWN.listing, [128, 0]).steps).toHaveLength(2);
  });
  it("the do loop enters at zero and wraps, but a finite prefix does not establish nontermination", () => {
    const r = call(DIM_DO.listing, [128, 0], 12);
    expect(r.stop).toEqual({ kind: "limit", steps: 12 });
    expect(bodyVisits(r)).toBe(4);
    const s = r.steps.find((s) => s.text.startsWith("subs"))!;
    expect(Number(s.writes[0]?.after)).toBe(0xffffffff);
    expect(nzcv(s.flagsAfter)).toBe("1000");
    // Modulo 2^32, zero decremented k times returns to zero first at k = 2^32.
    expect(BigInt.asUintN(32, -1n)).toBe(4294967295n);
    expect(BigInt.asUintN(32, -(1n << 32n))).toBe(0n);
  });
  it("the displayed zero-count do prefix stops after 20 instructions, partway through its seventh body visit", () => {
    const r = call(DIM_DO.listing, [128, 0], 20);
    expect(r.stop).toEqual({ kind: "limit", steps: 20 });
    expect(r.steps).toHaveLength(20);
    expect(bodyVisits(r)).toBe(7);
    expect(value(r)).toBe(1);
    expect(r.final.x[1]).toBe(4294967289n);
    expect(nzcv(r.final.flags)).toBe("1010");
    expect(r.steps.at(-1)?.text).toBe("subs w1, w1, #1");
    // The seventh decrement has run, but its branch has not. A body visit is not a backedge.
    expect(r.steps.filter((step) => step.branch).map((step) => step.branch?.taken)).toEqual([
      true,
      true,
      true,
      true,
      true,
      true,
    ]);
  });
  it("the displayed wrong-countdown prefix completes five body visits in 20 instructions", () => {
    const r = call(DIM_DOWN_WRONG.listing, [128, 3], 20);
    expect(r.stop).toEqual({ kind: "limit", steps: 20 });
    expect(r.steps).toHaveLength(20);
    expect(bodyVisits(r)).toBe(5);
    expect(value(r)).toBe(4);
    expect(r.final.x[1]).toBe(4294967294n);
    expect(nzcv(r.final.flags)).toBe("1010");
    expect(r.steps.at(-1)?.text).toBe("bcs .Lloop");
    expect(r.final.pc).toBe(r.initial.pc);
    expect(r.steps.filter((step) => step.branch).map((step) => step.branch?.taken)).toEqual([
      true,
      true,
      true,
      true,
      true,
    ]);
    const decrements = r.steps.filter((step) => step.text.startsWith("subs"));
    expect(decrements.map((step) => Number(step.writes[0]?.after))).toEqual([
      2, 1, 0, 0xffffffff, 0xfffffffe,
    ]);
  });
  it("the written compare overwrites the subtraction carry and keeps branching", () => {
    const r = call(DIM_DOWN_WRONG.listing, [128, 1], 12);
    expect(r.stop.kind).toBe("limit");
    expect(r.steps.filter((s) => s.text.startsWith("subs")).map((s) => nzcv(s.flagsAfter))).toEqual(
      ["0110", "1000", "1010"],
    );
    expect(r.steps.filter((s) => s.text.startsWith("cmp")).map((s) => nzcv(s.flagsAfter))).toEqual([
      "0110",
      "1010",
      "1010",
    ]);
    expect(r.steps.filter((s) => s.text.startsWith("bcs")).every((s) => s.branch?.taken)).toBe(
      true,
    );
  });
  it("unsigned comparison with zero sets C at zero, the signed boundary and UINT_MAX", () => {
    for (const n of [0, 1, 0x7fffffff, 0x80000000, 0xffffffff])
      expect(call("cmp w0, #0\nret", [n]).final.flags.c).toBe(true);
  });
  it("GCC's observed wrong-loop output repeatedly branches to the same address", () => {
    const r = call(DIM_WRONG_GCC.listing, [128, 3], 12);
    expect(r.stop.kind).toBe("limit");
    expect(value(r)).toBe(128);
    expect(r.steps.every((s) => s.branch?.taken && s.branch.target === s.address)).toBe(true);
  });
});

describe("bounded countdown capstone", () => {
  it.each([
    [128, 0, 128, 0],
    [128, 1, 64, 1],
    [128, 3, 16, 3],
    [0, 0xffffffff, 0, 0],
    [1, 0xffffffff, 0, 1],
    [0xffffffff, 0xffffffff, 0, 32],
    [0x80000000, 31, 1, 31],
    [0x80000000, 32, 0, 32],
  ])("brightness %i, count %i returns %i after %i visits", (brightness, count, want, visits) => {
    const r = call(DIM_UNTIL_DARK_TEXT, [brightness, count]);
    expect(r.stop.kind).toBe("returned");
    expect(value(r)).toBe(want);
    expect(bodyVisits(r)).toBe(visits);
    expect(r.steps.length).toBeLessThanOrEqual(131);
  });
  it("agrees with the recorded ordinary countdown for bounded counts", () => {
    for (const brightness of [0, 1, 128, 0x80000000, 0xffffffff])
      for (const count of [0, 1, 3, 31, 32, 40])
        expect(value(call(DIM_UNTIL_DARK_TEXT, [brightness, count]))).toBe(
          value(call(DIM_DOWN.listing, [brightness, count])),
        );
  });
});
