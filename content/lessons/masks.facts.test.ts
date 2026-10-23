// Copyright © 2026 Christopher Snow

// Every number the first lesson of Module 3 states, run on the model, and every claim it makes
// about what an instruction does to a word, checked by running the instruction. The lesson's words
// say 0xb, 0x55, 0x75 and 0x2b; this test says what the simulator gives, so a number cannot be
// right in the prose and wrong in the machine. The listings are held to the recorded file in
// logic-shifts-masks.listings.test.ts.

import { describe, expect, it } from "vitest";

import { assemble, run, stateAfter, type Program } from "@al/machine";
import { assemblyOf, parseListing, traceOf, viewAt, wValue } from "@al/views";
import { learnerText } from "@platform/lesson-schema";

import { LESSONS } from ".";
import {
  CLEAR_DOOR,
  GEAR_OF,
  RECORDED_FUNCTIONS,
  SERVICE_DUE,
  SET_GEAR,
  SET_GEAR_REFERENCE_TEXT,
  SET_GEAR_WITHOUT_CLEAR,
  TOGGLE_LIGHTS,
  TRACE_THREE,
  WARN_FUEL,
} from "./logic-shifts-masks.listings";
import { statedNumbers } from "./stated-numbers";

const lesson = LESSONS.find((l) => l.id === "masks")!;

// ---------------------------------------------------------------------------------------------
// The model

const build = (text: string): Program => {
  const { program, errors } = assemble(text);
  if (!program) throw new Error(errors.map((e) => e.key).join(", "));
  return program;
};
const programOf = (p: { listing: string }) => build(assemblyOf(parseListing(p.listing)));
const call = (program: Program, entry: string | number, args: number[]) =>
  run(program, { entry, args: args.map((value) => ({ value: BigInt(value), width: 32 })) });
const w0 = (program: Program, entry: string | number, ...args: number[]) =>
  wValue(call(program, entry, args).final, 0);
const hex = (n: number) => `0x${(n >>> 0).toString(16)}`;
const bitsSet = (n: number) => [...Array(32).keys()].filter((i) => (n >>> i) & 1);

/** The constant an instruction carries, as the assembler read it (its operand `index`, the third by default). */
const immediate = (line: string, index = 2): number => {
  const operand = build(`f:\n ${line}\n ret\n`).instructions[0]?.operands[index];
  if (operand?.kind !== "imm") throw new Error(`${line} has no constant at operand ${index}`);
  return Number(operand.value);
};

const gcc = programOf({
  listing: Object.values(RECORDED_FUNCTIONS)
    .map((p) => p.listing)
    .join("\n"),
});
const reference = build(SET_GEAR_REFERENCE_TEXT);
const withoutClear = programOf(SET_GEAR_WITHOUT_CLEAR);
const three = programOf(TRACE_THREE);

describe("the warning word's functions, as GCC made them", () => {
  it("set bit 0 with orr, clear bit 2 with and, flip bit 3 with eor, and no other bit changes", () => {
    for (const word of [0, 0x35, 0xf, 0x2a, 0xffffffff, 0x80000000]) {
      expect(w0(gcc, "warn_fuel", word)).toBe((word | 1) >>> 0);
      expect(w0(gcc, "clear_door", word)).toBe((word & ~4) >>> 0);
      expect(w0(gcc, "toggle_lights", word)).toBe((word ^ 8) >>> 0);
    }
    expect(w0(gcc, "warn_fuel", 0)).toBe(1);
    expect(w0(gcc, "toggle_lights", 0)).toBe(8);
    expect(w0(gcc, "toggle_lights", 8)).toBe(0);
  });

  it("read the service flag as bit 1 and the gear as bits 4 to 6, a number from 0 to 7", () => {
    expect(w0(gcc, "service_due", 2)).toBe(1);
    expect(w0(gcc, "service_due", 0xd)).toBe(0);
    expect(w0(gcc, "gear_of", 0x35)).toBe(3);
    expect(w0(gcc, "gear_of", 0xffffffff)).toBe(7);
    expect(w0(gcc, "gear_of", 0x8f)).toBe(0);
  });

  it("make clear_door(0xf) 0xb, which is 11, and gear_of(0x35) 3", () => {
    expect(hex(w0(gcc, "clear_door", 0xf))).toBe("0xb");
    expect(w0(gcc, "clear_door", 0xf)).toBe(11);
    expect(w0(gcc, "gear_of", 0x35)).toBe(3);
  });

  it("replace an in-range gear without changing warning bits in the preparation attempt", () => {
    const result = w0(gcc, "set_gear", 0x35, 2);
    expect(hex(result)).toBe("0x25");
    expect(result & 0xf).toBe(0x35 & 0xf);
    expect((result >>> 4) & 7).toBe(2);
  });

  it("write the gear with bfi: set_gear(0x35, 5) is 0x55, only the low 3 bits of g land, and the rest of w is left alone", () => {
    expect(hex(w0(gcc, "set_gear", 0x35, 5))).toBe("0x55");
    expect(w0(gcc, "set_gear", 0x35, 5 + 8)).toBe(0x55);
    expect(hex(w0(gcc, "set_gear", 0xffffffff, 0))).toBe("0xffffff8f");
    for (const [word, gear] of [
      [0x1234, 13],
      [0, 7],
      [0xffffffff, 0],
      [0xa5a5a5a5, 6],
    ] as const) {
      expect(w0(gcc, "set_gear", word, gear)).toBe(((word & ~0x70) | ((gear & 7) << 4)) >>> 0);
    }
  });

  it("clear_door run on a word with every bit set clears bit 2 and no other: the mask is 0xfffffffb, which is -5", () => {
    const all = w0(gcc, "clear_door", 0xffffffff);
    expect(hex(all)).toBe("0xfffffffb");
    expect(bitsSet(~all >>> 0)).toEqual([2]);
    expect(all | 0).toBe(-5);
    expect(BigInt.asIntN(32, 0xfffffffbn)).toBe(-5n);
  });
});

describe("the reader's set_gear", () => {
  const calls: [number, number][] = [
    [0x35, 5],
    [0, 7],
    [0xffffffff, 0],
    [0x1234, 13],
  ];

  it("gives what GCC's bfi gives for the four calls of the challenge, and those are the expected values in the data", () => {
    const cases = lesson.challenges.find((c) => c.id === "write-set-gear")!.tests;
    if (cases.kind !== "answers") throw new Error("the challenge has answer tests");
    const gccGives = calls.map(([w, g]) => w0(gcc, "set_gear", w, g));
    const ours = calls.map(([w, g]) => wValue(call(reference, 0x400000, [w, g]).final, 0));
    expect(ours).toEqual(gccGives);
    expect(cases.cases.map((c) => [c.given["w0"], c.given["w1"]])).toEqual(calls);
    expect(cases.cases.map((c) => Number(c.expect["w0"]))).toEqual(gccGives);
    expect(gccGives.map(hex)).toEqual(["0x55", "0x70", "0xffffff8f", "0x1254"]);
  });

  it("takes four instructions before ret, and -113 is every bit except bits 4 to 6", () => {
    expect(SET_GEAR_REFERENCE_TEXT.split("\n")).toHaveLength(5);
    expect(hex(-113)).toBe("0xffffff8f");
    expect(bitsSet(~-113 >>> 0)).toEqual([4, 5, 6]);
  });

  it("lsl by 4 moves bits 0 to 2 up to bits 4 to 6, and and with 7 keeps the low 3 bits of g", () => {
    const lsl = build("f:\n lsl w0, w0, 4\n ret\n");
    const mask = build("f:\n and w0, w0, 7\n ret\n");
    expect(bitsSet(w0(lsl, "f", 0b111))).toEqual([4, 5, 6]);
    expect(w0(mask, "f", 13)).toBe(5);
    expect(bitsSet(w0(mask, "f", 0xffffffff))).toEqual([0, 1, 2]);
  });
});

describe("set_gear without the clear", () => {
  const result = call(withoutClear, "set_gear", [0x35, 5]);

  it("returns 0x75 for set_gear(0x35, 5), and does not stop with an error", () => {
    expect(result.stop.kind).toBe("returned");
    expect(hex(wValue(result.final, 0))).toBe("0x75");
    expect(wValue(result.final, 0)).toBe(117);
  });

  it("leaves bits 4 and 5, the old gear 3, set beside the new gear's bits 4 and 6", () => {
    expect(bitsSet(0x35 & 0x70)).toEqual([4, 5]);
    expect((0x35 >> 4) & 7).toBe(3);
    expect(bitsSet(5 << 4)).toEqual([4, 6]);
    expect(bitsSet(wValue(result.final, 0) & 0x70)).toEqual([4, 5, 6]);
  });

  it("runs four instructions, one at a time, and the figure agrees", () => {
    expect(result.steps.map((s) => s.text)).toEqual([
      "and w1, w1, 7",
      "lsl w1, w1, 4",
      "orr w0, w0, w1",
      "ret",
    ]);
    expect(wValue(stateAfter(result, 1), 1)).toBe(0x50);
    expect(wValue(stateAfter(result, 2), 0)).toBe(0x75);
    const trace = traceOf(SET_GEAR_WITHOUT_CLEAR, { entry: "set_gear", args: [0x35, 5] });
    expect(wValue(viewAt(trace, 3).state, 0)).toBe(0x75);
  });

  it("is the right answer once the field is cleared first: 0x55", () => {
    expect(wValue(call(reference, 0x400000, [0x35, 5]).final, 0)).toBe(0x55);
  });
});

describe("what each operation does, one bit at a time", () => {
  const words = [0, 1, 0x35, 0x2a, 0xf0f0f0f0, 0xffffffff, 0x80000001, 0x12345678];
  const masks = [0, 1, 4, 8, 0x70, 0xfffffffb, 0xffffff8f, 0xffffffff, 0x0f0f0f0f];
  const ops = build(
    "and_:\n and w0, w0, w1\n ret\norr_:\n orr w0, w0, w1\n ret\neor_:\n eor w0, w0, w1\n ret\nnot_:\n mvn w0, w1\n ret\n",
  );

  it("AND keeps a bit only where both values have 1: it clears where the mask has 0", () => {
    for (const w of words) for (const m of masks) expect(w0(ops, "and_", w, m)).toBe((w & m) >>> 0);
  });

  it("OR sets a bit where the mask has 1, and exclusive OR flips it", () => {
    for (const w of words)
      for (const m of masks) {
        expect(w0(ops, "orr_", w, m)).toBe((w | m) >>> 0);
        expect(w0(ops, "eor_", w, m)).toBe((w ^ m) >>> 0);
      }
  });

  it("each bit of the answer depends only on the same bit of the two values: no carry runs between bits", () => {
    // Change one bit of the word: only that bit of the answer can change.
    for (const op of ["and_", "orr_", "eor_"])
      for (const m of masks)
        for (let bit = 0; bit < 32; bit++) {
          const a = w0(ops, op, 0x35, m);
          const b = w0(ops, op, (0x35 ^ (1 << bit)) >>> 0, m);
          expect(bitsSet((a ^ b) >>> 0).every((i) => i === bit)).toBe(true);
        }
  });

  it("NOT turns every bit over", () => {
    for (const w of words) expect(w0(ops, "not_", 0, w)).toBe(~w >>> 0);
  });

  it("an and with the signed reading of a mask is an and with the mask: -5, -9 and -113", () => {
    const m = build(
      "a:\n and w0, w0, -5\n ret\nb:\n and w0, w0, -9\n ret\nc:\n and w0, w0, -113\n ret\n",
    );
    expect([hex(-5), hex(-9), hex(-113)]).toEqual(["0xfffffffb", "0xfffffff7", "0xffffff8f"]);
    for (const w of words) {
      expect(w0(m, "a", w)).toBe((w & 0xfffffffb) >>> 0);
      expect(w0(m, "b", w)).toBe((w & 0xfffffff7) >>> 0);
      expect(w0(m, "c", w)).toBe((w & 0xffffff8f) >>> 0);
    }
  });
});

describe("the last challenge: three results for 0x2a", () => {
  it("are 0x2b, 0x22 and 0x2, each from the original word", () => {
    expect(hex(w0(three, "after_orr", 0x2a))).toBe("0x2b");
    expect(hex(w0(three, "after_and", 0x2a))).toBe("0x22");
    expect(hex(w0(three, "the_gear", 0x2a))).toBe("0x2");
    const c = lesson.challenges.find((x) => x.id === "trace-three-results")!;
    expect(c.reference.answers).toEqual({ after_orr: "0x2b", after_and: "0x22", the_gear: "0x2" });
  });

  it("starts from 0x2a, which is 0010 1010 with bits 1, 3 and 5 set", () => {
    expect(
      (0x2a)
        .toString(2)
        .padStart(8, "0")
        .replace(/(\d{4})(\d{4})/, "$1 $2"),
    ).toBe("0010 1010");
    expect(bitsSet(0x2a)).toEqual([1, 3, 5]);
  });

  it("clears bit 3 with -9, which is 0xfffffff7, every bit except bit 3", () => {
    expect(bitsSet(~-9 >>> 0)).toEqual([3]);
  });

  it("is told apart from a wrong order of work: from the result before gives different words", () => {
    expect(hex(w0(three, "after_and", w0(three, "after_orr", 0x2a)))).toBe("0x23");
  });
});

// ---------------------------------------------------------------------------------------------
// Every number the learner reads

describe("every number the lesson states", () => {
  // Each is a number of the model, a constant in a recorded listing, or a fact the recorded file
  // states. A number in the lesson's words that is in no list here is a number nothing pins.
  const decimal = new Map<number, string>([
    [0, "bit 0, and 0 in 0 to 7"],
    [1, "bit 1; the mask of orr w0, w0, 1; the width of ubfx's service field"],
    [2, "bit 2 (DOOR_OPEN); the 2 of 0x2"],
    [3, "bit 3 (the lights); the 3 bits of the gear field; gear_of(0x35)"],
    [4, "the field starts at bit 4; lsl by 4"],
    [5, "-5, the signed reading of the mask; g = 5; bit 5"],
    [6, "bit 6, the top of the gear field"],
    [7, "the gear's largest value, and the mask of and w1, w1, 7"],
    [8, "the mask of eor w0, w0, 8"],
    [9, "-9, the mask that clears bit 3"],
    [11, "clear_door(0xf) is 0xb"],
    [32, "a register's 32 bits; gear 2 positioned at bit 4"],
    [37, "the model returns 0x25 for set_gear(0x35, 2)"],
    // The compiler's version, from the recorded file's header (held in
    // logic-shifts-masks.listings.test.ts), and the width of x0, which w0 names the low 32 bits of
    // (held by the model, below).
    [16.1, "GCC 16.1, the compiler of the recorded listings"],
    [64, "x0 is the 64-bit name for the register; w0 names its low 32 bits"],
    [53, "0x35, an option's value"],
    [85, "0x55, an option's value"],
    [113, "-113, the mask that clears bits 4 to 6"],
    [117, "0x75, an option's value"],
    // The rework of 17 October 2026 (held by the tests under "the rework's numbers", below).
    [31, "bit 31, the top bit of a word: bits moved past it are lost"],
    [16, "the `lsl 16` of movk w0, 0xf, lsl 16, from Module 1"],
    [13, "g = 13, the fourth call of set_gear, which is larger than 7"],
    [1101, "13 in its low four bits"],
    [100, "bits 6 to 4 of 0x47, the gear 4 written in three bits"],
  ]);
  const hexes = new Set(
    [
      "0xfffffffb",
      "0xf",
      "0xb",
      "0x35",
      "0x25",
      "0x20",
      "0x75",
      "0x55",
      "0x2a",
      "0xffffff8f",
      "0xfffffff7",
      "0x2b",
      "0x22",
      "0x2",
      "0x47",
      "0x43",
    ].map((h) => h.toLowerCase()),
  );

  const stated = statedNumbers([
    ...learnerText(lesson),
    ...lesson.challenges.flatMap((c) => c.fields.map((f) => f.label)),
  ]);

  it("is pinned: each is a result of the model, an argument of a call, or a constant of a listing", () => {
    expect(stated.decimal.length).toBeGreaterThan(40);
    expect(stated.decimal.filter((n) => !decimal.has(n))).toEqual([]);
    expect(stated.hex.filter((h) => !hexes.has(h))).toEqual([]);
    // Each is a byte of a result the model produced (checked under "the rework's numbers").
    expect([...new Set(stated.binary)].sort()).toEqual(
      [
        "0010 0101", // 0x25 from bounded field replacement
        "0010 1010", // 0x2a
        "0011 0101", // 0x35
        "0100 0111", // 0x47
        "0101 0000", // 0x35's new gear, moved into place: 5 << 4
        "0101 0101", // 0x55
        "0111 0101", // 0x75
      ].sort(),
    );
  });

  it("agrees with the model on every pinned hexadecimal result", () => {
    const model = new Set([
      hex(w0(gcc, "clear_door", 0xffffffff)),
      hex(0xf),
      hex(w0(gcc, "clear_door", 0xf)),
      hex(0x35),
      hex(w0(gcc, "set_gear", 0x35, 2)),
      hex(w0(gcc, "set_gear", 0, 2)),
      hex(wValue(call(withoutClear, "set_gear", [0x35, 5]).final, 0)),
      hex(0x47),
      hex(w0(build("f:\n eor w0, w0, 4\n ret\n"), "f", 0x47)),
      hex(w0(gcc, "set_gear", 0x35, 5)),
      hex(0x2a),
      hex(w0(gcc, "set_gear", 0xffffffff, 0)),
      hex(-9),
      hex(w0(three, "after_orr", 0x2a)),
      hex(w0(three, "after_and", 0x2a)),
      hex(w0(three, "the_gear", 0x2a)),
    ]);
    expect([...hexes].filter((h) => !model.has(h))).toEqual([]);
  });

  it("names the register x0 for all 64 bits and w0 for its low 32: the gear is the same either way", () => {
    // x0 holds 64 bits: one less than 0 is 64 ones, and w0 is its low 32 bits.
    const wide = call(build("f:\n sub x0, x0, 1\n ret\n"), "f", [0]).final.x[0] ?? 0n;
    expect(wide).toBe(2n ** 64n - 1n);
    expect(wValue(call(build("f:\n sub x0, x0, 1\n ret\n"), "f", [0]).final, 0)).toBe(0xffffffff);
    // The gear lies in the low 32 bits, so ubfx on x0 and on w0 give the same result.
    const gear = (reg: "x" | "w", word: number) =>
      w0(build(`f:\n ubfx ${reg}0, ${reg}0, 4, 3\n ret\n`), "f", word);
    for (const word of [0x35, 0x8f, 0xffffffff, 0x2a])
      expect(gear("x", word)).toBe(gear("w", word));
  });

  it("agrees with the model on every pinned decimal result", () => {
    const model = new Map<number, number>([
      [11, w0(gcc, "clear_door", 0xf)],
      [53, 0x35],
      [85, w0(gcc, "set_gear", 0x35, 5)],
      [117, wValue(call(withoutClear, "set_gear", [0x35, 5]).final, 0)],
      [3, w0(gcc, "gear_of", 0x35)],
      [7, w0(gcc, "gear_of", 0xffffffff)],
      [5, -(w0(gcc, "clear_door", 0xffffffff) | 0)],
      [9, -immediate("and w0, w0, -9")],
      [113, -immediate("and w0, w0, -113")],
      [8, immediate("eor w0, w0, 8")],
      [1, immediate("orr w0, w0, 1")],
      [4, immediate("ubfx x0, x0, 4, 3")],
      [3, immediate("ubfx x0, x0, 4, 3", 3)],
      [
        64,
        (call(build("f:\n sub x0, x0, 1\n ret\n"), "f", [0]).final.x[0] ?? 0n).toString(2).length,
      ],
      // The rework of 17 October 2026.
      [31, Math.max(...bitsSet(w0(build("f:\n lsl w0, w0, 1\n ret\n"), "f", 0x40000000)))],
      [16, Math.log2(w0(build("f:\n movk w0, 0xf, lsl 16\n ret\n"), "f", 0) / 0xf)],
      [13, w0(build("f:\n and w0, w0, 15\n ret\n"), "f", 13)],
      [1101, Number((13).toString(2))],
      [100, Number((w0(gcc, "gear_of", 0x47) >>> 0).toString(2))],
    ]);
    for (const [n, got] of model) expect(got, String(n)).toBe(n);
  });

  it("matches the first instruction of each function the lesson names by its constants", () => {
    const first = (p: { listing: string }) =>
      (parseListing(p.listing).find((l) => l.kind === "instruction") as { text: string }).text;
    expect(first(WARN_FUEL)).toBe("orr w0, w0, 1");
    expect(first(CLEAR_DOOR)).toBe("and w0, w0, -5");
    expect(first(TOGGLE_LIGHTS)).toBe("eor w0, w0, 8");
    expect(first(GEAR_OF)).toBe("ubfx x0, x0, 4, 3");
    expect(first(SET_GEAR)).toBe("bfi w0, w1, 4, 3");
    expect(first(SERVICE_DUE)).toBe("ubfx x0, x0, 1, 1");
  });
});

// ---------------------------------------------------------------------------------------------
// The rework's numbers (17 October 2026): each one the figures draw or the new words state

describe("the rework's numbers", () => {
  const low8 = (n: number) =>
    (n & 0xff)
      .toString(2)
      .padStart(8, "0")
      .replace(/(\d{4})(\d{4})/, "$1 $2");

  it("clear_door(0xf) is 0xb: the low eight bits are 0000 1111, 1111 1011 and 0000 1011, and bit 2 is the only one that differs", () => {
    const mask = immediate("and w0, w0, -5") >>> 0;
    const result = w0(gcc, "clear_door", 0xf);
    expect(hex(result)).toBe("0xb");
    expect([0xf, mask, result].map(low8)).toEqual(["0000 1111", "1111 1011", "0000 1011"]);
    expect(hex(mask)).toBe("0xfffffffb");
    expect(mask | 0).toBe(-5);
    // Bit 2 is the only bit where the mask has a 0, and the only bit the result differs in.
    expect(bitsSet(~mask >>> 0)).toEqual([2]);
    expect(bitsSet((0xf ^ result) >>> 0)).toEqual([2]);
  });

  it("shows the same input in the prediction and its low-eight-bit mask view", () => {
    const figure = lesson.sections
      .flatMap((section) => section.interactives)
      .find((figure) => figure.id === "predict-minus-five")!;
    const call = figure.props["call"] as { args: number[] };
    const maskView = figure.props["maskView"] as { word: number };
    expect(maskView.word).toBe(call.args[0]);
    const result = w0(gcc, "clear_door", maskView.word);
    expect([maskView.word, result].map(low8)).toEqual(["1111 1111", "1111 1011"]);
    expect(bitsSet((maskView.word ^ result) >>> 0)).toEqual([2]);
  });

  it("orr 1 changes only bit 0, and only when it was 0; eor 8 flips only bit 3", () => {
    for (const word of [0, 1, 0x2a, 0x35, 0xf, 0xffffffff, 0x80000000]) {
      const orr = w0(gcc, "warn_fuel", word);
      expect(bitsSet((word ^ orr) >>> 0)).toEqual((word & 1) === 0 ? [0] : []);
      expect(bitsSet((word ^ w0(gcc, "toggle_lights", word)) >>> 0)).toEqual([3]);
    }
  });

  it("gear_of(0x35) is 3: bits 6 to 4 of 0x35 are 011, and ubfx takes 3 bits starting at bit 4", () => {
    expect(w0(gcc, "gear_of", 0x35)).toBe(3);
    expect((0x35 >> 4) & 7).toBe(3);
    expect(((0x35 >> 4) & 7).toString(2).padStart(3, "0")).toBe("011");
    expect([immediate("ubfx x0, x0, 4, 3", 2), immediate("ubfx x0, x0, 4, 3", 3)]).toEqual([4, 3]);
  });

  it("set_gear(0x35, 5) is 0x55, and 0x75 without the clear: 0011 0101 or 0101 0000 is 0111 0101", () => {
    expect(hex(w0(gcc, "set_gear", 0x35, 5))).toBe("0x55");
    expect(hex(wValue(call(withoutClear, "set_gear", [0x35, 5]).final, 0))).toBe("0x75");
    // The new gear, moved into place, is w1 after the second instruction.
    const moved = wValue(stateAfter(call(withoutClear, "set_gear", [0x35, 5]), 1), 1);
    expect([0x35, moved, 0x75, 0x55].map(low8)).toEqual([
      "0011 0101",
      "0101 0000",
      "0111 0101",
      "0101 0101",
    ]);
    expect((0x35 | moved) >>> 0).toBe(0x75);
    // The old gear's bits 4 and 5 stay set under an OR; the clear is what takes them away.
    expect(bitsSet(0x35 & 0x70)).toEqual([4, 5]);
    expect(bitsSet(0x75 & 0x70)).toEqual([4, 5, 6]);
    expect(bitsSet((0x75 ^ 0x55) >>> 0)).toEqual([5]);
  });

  it("set_gear(0x1234, 13) keeps only the low 3 bits of 13, which are 5's bits, and nothing outside the field changes", () => {
    expect(hex(w0(gcc, "set_gear", 0x1234, 13))).toBe("0x1254");
    expect(w0(gcc, "set_gear", 0x1234, 13)).toBe(w0(gcc, "set_gear", 0x1234, 5));
    expect(13 & 7).toBe(5);
    // 13 is 1101 in its low four bits; without keeping the low 3, its bit 3 would land in bit 7.
    expect((13).toString(2)).toBe("1101");
    const noMask = build("f:\n lsl w1, w1, 4\n and w0, w0, -113\n orr w0, w0, w1\n ret\n");
    expect(hex(w0(noMask, "f", 0x1234, 13))).toBe("0x12d4");
    expect(bitsSet((w0(noMask, "f", 0x1234, 13) ^ 0x1254) >>> 0)).toEqual([7]);
    // The bits outside the field are the word's own, for the reader's code and GCC's.
    for (const [word, gear] of [
      [0x1234, 13],
      [0xffffffff, 0],
      [0xa5a5a5a5, 6],
      [0x35, 5],
    ] as const) {
      const ours = wValue(call(reference, 0x400000, [word, gear]).final, 0);
      expect((ours & ~0x70) >>> 0).toBe((word & ~0x70) >>> 0);
      expect((ours >> 4) & 7).toBe(gear & 7);
      expect(ours).toBe(w0(gcc, "set_gear", word, gear));
    }
  });

  it("the closing question: the gear of 0x47 is 4, and eor 4 gives 0x43", () => {
    expect(w0(gcc, "gear_of", 0x47)).toBe(4);
    expect(low8(0x47)).toBe("0100 0111");
    expect(((0x47 >> 4) & 7).toString(2)).toBe("100");
    const eor4 = build("f:\n eor w0, w0, 4\n ret\n");
    expect(hex(w0(eor4, "f", 0x47))).toBe("0x43");
    expect(bitsSet(0x47 & 4)).toEqual([2]);
    expect(bitsSet((0x47 ^ 0x43) >>> 0)).toEqual([2]);
  });

  it("the third challenge's chained mistake is 0x23: the same and, worked on 0x2b instead of 0x2a", () => {
    const chained = w0(three, "after_and", w0(three, "after_orr", 0x2a));
    expect(hex(chained)).toBe("0x23");
    expect(chained).not.toBe(w0(three, "after_and", 0x2a));
    expect(w0(three, "after_orr", 0x2a)).toBe(0x2a | 1);
  });
});
