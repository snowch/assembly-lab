// Copyright © 2026 Christopher Snow

// Every number the second lesson of Module 3 states, run on the model, and every claim it makes
// about what a shift does, checked by running the shift. The lesson's words say -4, 0x7ffffffc and
// -3; this test says what the simulator gives, so a number cannot be right in the prose and wrong
// in the machine. The listings are held to the recorded file in
// logic-shifts-masks.listings.test.ts, where GCC's choice of `asr` for an `int` and `lsr` for an
// `unsigned` is the recorded instruction.

import { describe, expect, it } from "vitest";

import { assemble, run, stateAfter, type Program } from "@al/machine";
import { assemblyOf, parseListing, traceOf, viewAt, wValue, wValueAsInt } from "@al/views";
import { learnerText } from "@platform/lesson-schema";

import { LESSONS } from ".";
import {
  COMPARE_SHIFTS,
  DIV2,
  HALVE_COUNT,
  HALVE_GRADIENT,
  PICK_INSTRUCTION,
  RECORDED_FUNCTIONS,
  RECORDED_SHIFTS,
  SHIFT_AMOUNTS,
  SHIFT_OPS,
} from "./logic-shifts-masks.listings";
import { statedNumbers } from "./stated-numbers";

const lesson = LESSONS.find((l) => l.id === "shifts")!;

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
const w0 = (program: Program, entry: string, ...args: number[]) =>
  wValue(call(program, entry, args).final, 0);
const signed = (program: Program, entry: string, ...args: number[]) =>
  wValueAsInt(call(program, entry, args).final, 0);
const hex = (n: number) => `0x${(n >>> 0).toString(16)}`;

const gcc = programOf({
  listing: [...Object.values(RECORDED_FUNCTIONS), ...Object.values(RECORDED_SHIFTS)]
    .map((p) => p.listing)
    .join("\n"),
});
const compare = programOf(COMPARE_SHIFTS);
const shift = (op: string, n: number) => build(`f:\n ${op} w0, w0, ${n}\n ret\n`);

const WORDS = [0, 1, 7, 100, 0x35, 0x7fffffff, 0x80000000, 0x80000001, 0xfffffff9, 0xffffffff];

describe("GCC's choice of shift", () => {
  it("is asr for an int and lsr for an unsigned, for g >> 1 and for x >> 3", () => {
    const first = (p: { listing: string }) =>
      (parseListing(p.listing).find((l) => l.kind === "instruction") as { text: string }).text;
    expect(first(HALVE_GRADIENT)).toBe("asr w0, w0, 1");
    expect(first(HALVE_COUNT)).toBe("lsr w0, w0, 1");
    expect(first(RECORDED_SHIFTS.shr3_int)).toBe("asr w0, w0, 3");
    expect(first(RECORDED_SHIFTS.shr3_unsigned)).toBe("lsr w0, w0, 3");
    expect(first(RECORDED_SHIFTS.shl3_int)).toBe("lsl w0, w0, 3");
    expect(first(RECORDED_SHIFTS.shl3_unsigned)).toBe("lsl w0, w0, 3");
    expect(first(RECORDED_FUNCTIONS.times8)).toBe("lsl w0, w0, 3");
  });

  it("makes the same function of the C for the two types differ only in the shift", () => {
    const texts = (p: { listing: string }) =>
      parseListing(p.listing).flatMap((l) => (l.kind === "instruction" ? [l.text] : []));
    const [a, b] = [texts(HALVE_GRADIENT), texts(HALVE_COUNT)];
    expect(a).toHaveLength(b.length);
    expect(a.map((t, i) => t !== b[i])).toEqual([true, false]);
  });
});

describe("what a shift does", () => {
  it("moves every bit one place left to double an unsigned value, and one place right to halve it, dropping the remainder", () => {
    for (const n of [0, 1, 5, 100, 0x1234]) expect(w0(gcc, "times8", n)).toBe(n * 8);
    expect(w0(shift("lsl", 1), "f", 21)).toBe(42);
    for (const n of WORDS) expect(w0(gcc, "halve_count", n)).toBe(Math.floor(n / 2));
    expect(w0(gcc, "halve_count", 7)).toBe(3);
  });

  it("loses the bits that move past the end, and lsl fills the bottom with zeros", () => {
    for (const n of SHIFT_AMOUNTS) {
      const got = w0(shift("lsl", n), "f", 0xffffffff);
      expect(got).toBe((0xffffffff << n) >>> 0);
      expect(got & ((1 << n) - 1)).toBe(0);
    }
  });

  it("fills the top with zeros for lsr, and with copies of the top bit for asr", () => {
    for (const n of SHIFT_AMOUNTS)
      for (const word of WORDS) {
        expect(w0(shift("lsr", n), "f", word)).toBe(word >>> n);
        expect(w0(shift("asr", n), "f", word)).toBe(((word | 0) >> n) >>> 0);
      }
    // The top n bits of an arithmetic shift are the old top bit.
    expect(hex(w0(shift("asr", 4), "f", 0x80000000))).toBe("0xf8000000");
    expect(hex(w0(shift("asr", 4), "f", 0x7fffffff))).toBe("0x7ffffff");
  });

  it("halves the unsigned reading with lsr, and the signed reading, rounding down, with asr", () => {
    for (const word of WORDS) {
      expect(w0(gcc, "halve_count", word)).toBe(Math.floor(word / 2));
      expect(signed(gcc, "halve_gradient", word)).toBe(Math.floor((word | 0) / 2));
    }
  });
});

describe("-7 moved one place right", () => {
  it("is 0xfffffff9; asr gives 0xfffffffc, which is -4, and lsr gives 0x7ffffffc, which is 2147483644", () => {
    expect(hex(-7)).toBe("0xfffffff9");
    expect(hex(w0(gcc, "halve_gradient", -7))).toBe("0xfffffffc");
    expect(signed(gcc, "halve_gradient", -7)).toBe(-4);
    expect(hex(w0(gcc, "halve_count", -7))).toBe("0x7ffffffc");
    expect(w0(gcc, "halve_count", -7)).toBe(2147483644);
  });

  it("is filled at the top by a copy of the old top bit, which is 1, for asr: not by a 0, and not by the bit that fell off (also 1 here)", () => {
    const before = w0(gcc, "halve_gradient", 0x80000001);
    // Old top bit 1, fallen bit 1: a copy and the fallen bit agree; with 0x80000000 they do not.
    expect(before >>> 31).toBe(1);
    expect(w0(gcc, "halve_gradient", 0x80000000) >>> 31).toBe(1);
    expect(w0(gcc, "halve_gradient", 0x00000001) >>> 31).toBe(0);
  });
});

describe("g / 2 for an int", () => {
  it("rounds towards zero: -7 / 2 is -3, where asr gives -4", () => {
    expect(signed(gcc, "div2", -7)).toBe(-3);
    expect(hex(w0(gcc, "div2", -7))).toBe("0xfffffffd");
    expect(signed(gcc, "halve_gradient", -7)).toBe(-4);
    for (const word of [-7, -1, -100, 7, 100, 0, 1, -2147483648, 2147483647])
      expect(signed(gcc, "div2", word)).toBe(Math.trunc(word / 2) + 0);
  });

  it("is made by GCC as an add of the shifted top bit and then an asr", () => {
    const result = call(programOf(DIV2), "div2", [-7]);
    expect(result.steps.map((s) => s.text)).toEqual([
      "add w0, w0, w0, lsr 31",
      "asr w0, w0, 1",
      "ret",
    ]);
    // The first instruction adds 1 when g is negative, and 0 otherwise.
    for (const word of [-7, -1, -2147483648, 7, 0, 100, 2147483647]) {
      const run1 = call(programOf(DIV2), "div2", [word]);
      const before = wValue(run1.initial, 0);
      const after = wValue(stateAfter(run1, 0), 0);
      expect((after - before) >>> 0, String(word)).toBe(word < 0 ? 1 : 0);
    }
    expect(wValue(stateAfter(result, 0), 0)).toBe(-6 >>> 0);
    // The operand `w0, lsr 31` moves the top bit to the bottom.
    for (const word of WORDS) expect(word >>> 31).toBe(word >>> 0 >= 0x80000000 ? 1 : 0);
    expect(signed(programOf(DIV2), "div2", -7)).toBe(-3);
  });

  it("and the figure agrees with the run", () => {
    const trace = traceOf(DIV2, { entry: "div2", args: [-7] });
    expect([1, 2].map((k) => wValueAsInt(viewAt(trace, k).state, 0))).toEqual([-6, -3]);
  });
});

describe("21 and -21, by 2 and by C's / 4", () => {
  const calls = (entry: string) =>
    [21, -21].map((w) => [signed(compare, entry, w), w0(compare, entry, w)]);

  it("give 5, 5 and 5 for 21, and -6, 1073741818 (unsigned) and -5 for -21", () => {
    expect(calls("asr_by_2").map((x) => x[0])).toEqual([5, -6]);
    expect(calls("lsr_by_2").map((x) => x[1])).toEqual([5, 1073741818]);
    expect(calls("div_by_4").map((x) => x[0])).toEqual([5, -5]);
  });

  it("are what the challenge's reference answers, and asr rounds down where C's / rounds towards zero", () => {
    const c = lesson.challenges.find((x) => x.id === "compare-shifts")!;
    expect(c.reference.answers).toEqual({
      asr21: "5",
      lsr21: "5",
      div21: "5",
      asr_neg: "-6",
      lsr_neg: "1073741818",
      div_neg: "-5",
    });
    expect(signed(compare, "asr_by_2", -21)).toBe(Math.floor(-21 / 4));
    expect(signed(compare, "div_by_4", -21)).toBe(Math.trunc(-21 / 4) + 0);
  });

  it("agree for a positive value, and give the hint's -7 results: asr by 1 is -4, -7 / 2 is -3", () => {
    expect(
      new Set([
        signed(compare, "asr_by_2", 21),
        w0(compare, "lsr_by_2", 21),
        signed(compare, "div_by_4", 21),
      ]).size,
    ).toBe(1);
    expect(signed(gcc, "halve_gradient", -7)).toBe(-4);
    expect(signed(gcc, "div2", -7)).toBe(-3);
  });
});

describe("the last challenge", () => {
  it("is asr for int x >> 3, lsr for unsigned x >> 3, and lsl for x << 3 with either", () => {
    const pick = programOf(PICK_INSTRUCTION);
    const ran = (entry: string) => call(pick, entry, [1]).steps[0]?.text.split(" ")[0];
    expect([ran("shr3_int"), ran("shr3_unsigned"), ran("shl3_int"), ran("shl3_unsigned")]).toEqual([
      "asr",
      "lsr",
      "lsl",
      "lsl",
    ]);
    const c = lesson.challenges.find((x) => x.id === "pick-instruction")!;
    expect(c.reference.answers).toEqual({ shr_int: "asr", shr_unsigned: "lsr", shl: "lsl" });
  });
});

// ---------------------------------------------------------------------------------------------
// Every number the learner reads

describe("every number the lesson states", () => {
  const decimal = new Map<number, string>([
    [0, "a fill of 0; adds 0 otherwise"],
    [1, "a shift by 1; adds 1 when g is negative"],
    [2, "g / 2; asr and lsr by 2"],
    [3, "x >> 3 and x << 3; -3; w0, lsl 3"],
    [4, "/ 4; asr of -7 by 1 is -4"],
    [5, "21 / 4 is 5; -5"],
    [6, "-6, asr of -21 by 2"],
    [7, "-7, the word the figure takes"],
    [8, "n * 8"],
    [21, "the positive value of the challenge"],
    [
      16,
      "movk w0, 0xf, lsl 16 puts the 16-bit number 0xf in the upper half (held by the model, below)",
    ],
    [31, "w0, lsr 31 moves the top bit to the bottom"],
    [9, "int g = -9 in the closing question"],
    // The compiler's version, from the recorded file's header (held in
    // logic-shifts-masks.listings.test.ts), now named in the note "What C says".
    [16.1, "GCC 16.1, the compiler of the recorded listings"],
    [1073741818, "lsr of -21 by 2, unsigned reading"],
    [2147483644, "lsr of -7 by 1, unsigned reading"],
  ]);
  // 0xf is the constant of movk w0, 0xf, lsl 16 (held by the model, above).
  const hexes = new Set(["0xfffffff9", "0xfffffffc", "0x7ffffffc", "0xf"]);

  const stated = statedNumbers([
    // Reference issue dates identify documents, rather than arithmetic values.
    ...learnerText(lesson).map((text) => text.replace(/https?:\/\/[^\s)]+/g, " ")),
    ...lesson.challenges.flatMap((c) => c.fields.map((f) => f.label)),
  ]);

  it("is pinned: each is a result of the model, an argument of a call, or a constant of a listing", () => {
    expect(stated.decimal.length).toBeGreaterThan(30);
    expect(stated.decimal.filter((n) => !decimal.has(n))).toEqual([]);
    expect(stated.hex.filter((h) => !hexes.has(h))).toEqual([]);
    expect(stated.binary).toEqual([]);
  });

  it("agrees with the model on every pinned result", () => {
    const model: [number, number][] = [
      [9, -signed(build("f:\n mov w0, -9\n ret\n"), "f", 0)],
      [2147483644, w0(gcc, "halve_count", -7)],
      [4, -signed(gcc, "halve_gradient", -7)],
      [3, -signed(gcc, "div2", -7)],
      [5, signed(compare, "div_by_4", 21)],
      [6, -signed(compare, "asr_by_2", -21)],
      [1073741818, w0(compare, "lsr_by_2", -21)],
      [8, w0(gcc, "times8", 1)],
      [
        31,
        (() => {
          const first = parseListing(DIV2.listing).find((l) => l.kind === "instruction") as {
            text: string;
          };
          return Number(first.text.split(" ").pop());
        })(),
      ],
    ];
    for (const [n, got] of model) expect(got, String(n)).toBe(n);
    expect(hexes).toEqual(
      new Set([
        hex(-7),
        hex(w0(gcc, "halve_gradient", -7)),
        hex(w0(gcc, "halve_count", -7)),
        // movk's constant: the upper half the model puts it in is held above.
        hex(w0(build("f:\n movk w0, 0xf, lsl 16\n ret\n"), "f", 0) >>> 16),
      ]),
    );
  });
});

describe("movk with lsl 16", () => {
  it("moves a 16-bit number into the upper half and keeps the lower half", () => {
    const movk = build("f:\n movk w0, 0xf, lsl 16\n ret\n");
    expect(hex(w0(movk, "f", 0x1234))).toBe("0xf1234");
    // The shift is by 16: 0xf lands in bits 16 to 31.
    expect(Math.log2((w0(movk, "f", 0) - 0) / 0xf)).toBe(16);
    expect(w0(movk, "f", 0xffff)).toBe(0xfffff);
  });
});

describe("the shift figure's programs", () => {
  it("offer lsl, lsr and asr by 1, 2, 3, 4 and 8, each of which assembles and returns", () => {
    for (const op of SHIFT_OPS)
      for (const n of SHIFT_AMOUNTS) {
        const result = call(shift(op, n), "f", [0x80000001]);
        expect(result.stop.kind).toBe("returned");
      }
  });
});

// ---------------------------------------------------------------------------------------------
// The rework's numbers (17 October 2026): each one the figures draw or the new words state

describe("the rework's numbers", () => {
  it("-7 asr 1 is -4 and -7 lsr 1 is 2147483644, and the filled top bit is 1 in the asr result and 0 in the lsr one", () => {
    expect(signed(shift("asr", 1), "f", -7)).toBe(-4);
    expect(w0(shift("lsr", 1), "f", -7)).toBe(2147483644);
    expect(hex(w0(shift("asr", 1), "f", -7))).toBe("0xfffffffc");
    expect(hex(w0(shift("lsr", 1), "f", -7))).toBe("0x7ffffffc");
    // The old top bit of -7 is 1: asr fills the top with a copy of it, lsr with 0.
    expect(w0(shift("asr", 1), "f", -7) >>> 31).toBe(1);
    expect(w0(shift("lsr", 1), "f", -7) >>> 31).toBe(0);
  });

  it("loses the bits the figure marks lost, and fills the bits it marks filled, for lsl, lsr and asr", () => {
    const word = 0x80000001;
    for (const n of SHIFT_AMOUNTS) {
      const bits = (v: number, from: number, to: number) =>
        (v >>> from) & ((1 << (to - from + 1)) - 1);
      // lsl: the top n bits go, the bottom n are zeros.
      const left = w0(shift("lsl", n), "f", word);
      expect(left & ((1 << n) - 1), `lsl ${n}`).toBe(0);
      expect(bits(left, n, 31)).toBe(bits(word, 0, 31 - n));
      // lsr: the bottom n bits go, the top n are zeros.
      const lsr = w0(shift("lsr", n), "f", word);
      expect(lsr >>> (32 - n), `lsr ${n}`).toBe(0);
      expect(lsr).toBe(word >>> n);
      // asr: the bottom n bits go, the top n are copies of the old top bit.
      const asr = w0(shift("asr", n), "f", word);
      expect(asr >>> (32 - n), `asr ${n}`).toBe((1 << n) - 1);
      expect(asr >>> 0).toBe(((word | 0) >> n) >>> 0);
    }
    // The lost bits are the ones the shift's amount names: asr of 0x7ffffffe by 1 loses the 0 and fills with 0.
    expect(hex(w0(shift("asr", 1), "f", 0x7ffffffe))).toBe("0x3fffffff");
  });

  it("21 and -21 by 2 and by / 4: 5, 5, 5 and -6, 1073741818, -5", () => {
    expect([21, -21].map((w) => signed(compare, "asr_by_2", w))).toEqual([5, -6]);
    expect([21, -21].map((w) => w0(compare, "lsr_by_2", w))).toEqual([5, 1073741818]);
    expect([21, -21].map((w) => signed(compare, "div_by_4", w))).toEqual([5, -5]);
  });

  it("div2(-7) writes -6 and then -3, and div2(7) adds 0 and gives 3", () => {
    const run7 = call(programOf(DIV2), "div2", [-7]);
    expect(run7.steps.map((s) => s.text)).toEqual([
      "add w0, w0, w0, lsr 31",
      "asr w0, w0, 1",
      "ret",
    ]);
    expect([0, 1].map((k) => wValueAsInt(stateAfter(run7, k), 0))).toEqual([-6, -3]);
    expect(run7.steps.map((s) => s.writes.length)).toEqual([1, 1, 0]);
    const run0 = call(programOf(DIV2), "div2", [7]);
    expect(wValueAsInt(stateAfter(run0, 0), 0)).toBe(7);
    expect(wValueAsInt(stateAfter(run0, 1), 0)).toBe(3);
    expect(signed(gcc, "div2", 7)).toBe(3);
  });

  it("the shifted operand is worked out from w0 before the add and changes nothing by itself: the add is the only step that writes w0 before the asr", () => {
    for (const word of [-7, 7, -1, 0, 100, -100, 2147483647, -2147483648]) {
      const result = call(programOf(DIV2), "div2", [word]);
      const before = wValue(result.initial, 0);
      const operand = before >>> 31;
      const add = result.steps[0]!;
      expect(add.writes.map((w) => w.reg)).toEqual([0]);
      // Nothing wrote w0 between the call and the add: the operand read the argument.
      expect(wValue(stateAfter(result, 0), 0)).toBe((before + operand) >>> 0);
      expect(result.steps.filter((s) => s.writes.some((w) => w.reg === 0))).toHaveLength(2);
    }
  });

  it("for g = -9: g / 2 is -4 and asr by 1 gives -5, and GCC's add makes -8 first, which asr halves to -4", () => {
    expect(signed(gcc, "div2", -9)).toBe(-4);
    expect(signed(shift("asr", 1), "f", -9)).toBe(-5);
    const run = call(programOf(DIV2), "div2", [-9]);
    expect(wValueAsInt(stateAfter(run, 0), 0)).toBe(-8);
    expect(wValueAsInt(stateAfter(run, 1), 0)).toBe(-4);
    expect(signed(shift("asr", 1), "f", -8)).toBe(-4);
  });

  it("C's / rounds towards zero where asr rounds down: 7 / 2 is 3 and -7 / 2 is -3", () => {
    expect(Math.trunc(7 / 2)).toBe(3);
    expect(signed(gcc, "div2", 7)).toBe(3);
    expect(signed(gcc, "div2", -7)).toBe(-3);
  });
});
