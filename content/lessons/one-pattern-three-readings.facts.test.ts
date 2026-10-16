// Copyright © 2026 Christopher Snow

// Every number the first lesson of Module 1 states, run on the model. The lesson's words say
// 4294967284, −12, 0, 4294967296 and the rest; this test says what the simulator gives, so a number
// cannot be right in the prose and wrong in the machine. The listings are held to the recorded file
// in module-1.listings.test.ts.

import { describe, expect, it } from "vitest";

import { assemble, run, stateAfter, type Program } from "@al/machine";
import { learnerText } from "@platform/lesson-schema";
import {
  assemblyOf,
  compareListings,
  parseListing,
  readingsOfPattern,
  readingsOfValue,
  traceOf,
  viewAt,
  wValue,
  wValueAsInt,
} from "@al/views";

import { LESSONS } from ".";
import {
  FUEL_CALL,
  FUEL_USED_WRONG,
  FUEL_USED_WRONG_PLUS_12,
  FUEL_USED_WRONG_U,
} from "./module-1.listings";

const lesson = LESSONS.find((l) => l.id === "one-pattern-three-readings")!;
const challenge = (id: string) => lesson.challenges.find((c) => c.id === id)!;

const build = (text: string): Program => {
  const { program, errors } = assemble(text);
  if (!program) throw new Error(errors.map((e) => e.key).join(", "));
  return program;
};
const fuel = (p: { listing: string }, a = 50, b = 38) =>
  run(build(assemblyOf(parseListing(p.listing))), {
    entry: (parseListing(p.listing)[0] as { text: string }).text,
    args: [a, b].map((value) => ({ value: BigInt(value), width: 32 as const })),
  });
const w0 = (state: { x: bigint[] }) => BigInt.asUintN(32, state.x[0]!);
const grouped = (bits: string) => bits.match(/.{4}/g)!.join(" ");

describe("fuel_used(50, 38) as first written", () => {
  const result = fuel(FUEL_USED_WRONG);

  it("leaves 32 bits in w0 after sub w0, w1, w0: 1111 1111 1111 1111 1111 1111 1111 0100", () => {
    const after = stateAfter(result, 0);
    expect(grouped(w0(after).toString(2).padStart(32, "0"))).toBe(
      "1111 1111 1111 1111 1111 1111 1111 0100",
    );
  });

  it("is 4294967284 read as a number, written 0xfffffff4, and −12 read as a signed one", () => {
    const state = stateAfter(result, 0);
    expect(wValue(state, 0)).toBe(4294967284);
    expect(w0(state).toString(16)).toBe("fffffff4");
    expect(wValueAsInt(state, 0)).toBe(-12);
    const r = readingsOfPattern(w0(state).toString(2).padStart(32, "0"));
    expect([r.digits, r.unsigned, r.signed]).toEqual(["fffffff4", 4294967284, -12]);
  });

  it("is the same value the lesson's first figure draws for w0, and the C says 38 minus 50", () => {
    const trace = traceOf(FUEL_USED_WRONG, FUEL_CALL);
    expect(wValue(viewAt(trace, 1).state, 0)).toBe(4294967284);
    expect(38 - 50).toBe(-12);
    expect(result.steps.map((s) => s.text)).toEqual(["sub w0, w1, w0", "ret"]);
  });

  it("is the same 32 bits at the end of the run: ret does not change w0", () => {
    expect(w0(result.final)).toBe(4294967284n);
  });
});

describe("adding 12 to that pattern", () => {
  const result = fuel(FUEL_USED_WRONG_PLUS_12);

  it("gives 0 in w0, and the run returns", () => {
    expect(result.steps.map((s) => s.text)).toEqual(["sub w0, w1, w0", "add w0, w0, 12", "ret"]);
    expect(wValue(stateAfter(result, 0), 0)).toBe(4294967284);
    expect(wValue(stateAfter(result, 1), 0)).toBe(0);
    expect(result.stop.kind).toBe("returned");
    expect(w0(result.final)).toBe(0n);
  });

  it("is 4294967284 plus 12, which is 4294967296: a 1 and then 32 zeros, 33 bits", () => {
    expect(4294967284 + 12).toBe(4294967296);
    const bits = (4294967284 + 12).toString(2);
    expect(bits).toBe("1" + "0".repeat(32));
    expect(bits).toHaveLength(33);
    expect(w0(stateAfter(result, 0)) + 12n).toBe(4294967296n);
  });

  it("does not stop with an error, so the prediction's right option is 0", () => {
    expect(result.stop.kind).not.toBe("fault");
    const options = lesson.sections[2]!.interactives[0]!.props["options"] as {
      value: string;
      label: string;
    }[];
    expect(options.map((o) => o.value)).toEqual(["0", "4294967296", "24", "error"]);
    expect(String(wValue(result.final, 0))).toBe("0");
  });

  it("treats the pattern as −12: the signed reading plus 12 is 0", () => {
    expect(wValueAsInt(stateAfter(result, 0), 0) + 12).toBe(0);
  });
});

describe("the worth of each bit", () => {
  it("doubles from 1 up to 2147483648 for the leftmost, which is the top bit", () => {
    const worth = (bit: number) => readingsOfPattern("0".repeat(31 - bit) + "1" + "0".repeat(bit));
    expect([0, 1, 2, 3].map((b) => worth(b).unsigned)).toEqual([1, 2, 4, 8]);
    expect(worth(31).unsigned).toBe(2147483648);
    for (let bit = 1; bit < 32; bit++)
      expect(worth(bit).unsigned).toBe(2 * worth(bit - 1).unsigned);
  });

  it("is the same in the signed reading for every bit but the top, which is minus 2147483648", () => {
    for (let bit = 0; bit < 31; bit++) {
      const r = readingsOfPattern("0".repeat(31 - bit) + "1" + "0".repeat(bit));
      expect(r.signed).toBe(r.unsigned);
    }
    expect(readingsOfPattern("1" + "0".repeat(31)).signed).toBe(-2147483648);
  });

  it("agrees between the two readings when the top bit is 0, and differs by 4294967296 when it is 1", () => {
    let seed = 99;
    for (let i = 0; i < 400; i++) {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      const value = (seed * 2 + (i % 2)) >>> 0;
      const r = readingsOfValue(value);
      if (r.pattern[0] === "0") expect(r.signed).toBe(r.unsigned);
      else expect(r.unsigned - r.signed).toBe(4294967296);
    }
  });

  it("runs from 0 to 4294967295 unsigned and −2147483648 to 2147483647 signed", () => {
    const low = readingsOfPattern("0".repeat(32));
    const high = readingsOfPattern("1".repeat(32));
    const mid = readingsOfPattern("0" + "1".repeat(31));
    const top = readingsOfPattern("1" + "0".repeat(31));
    expect([low.unsigned, high.unsigned]).toEqual([0, 4294967295]);
    expect([top.signed, mid.signed]).toEqual([-2147483648, 2147483647]);
  });

  it("writes four bits as one hexadecimal digit: 0 to 9, then a to f for ten to fifteen", () => {
    const digit = (n: number) => readingsOfValue(n).digits.at(-1);
    expect([0, 9, 10, 15].map(digit)).toEqual(["0", "9", "a", "f"]);
    expect(readingsOfValue(0xfffffff4).digits).toBe("fffffff4");
  });
});

describe("the int and the unsigned function", () => {
  it("are the same instructions, line by line, for the model", () => {
    const rows = compareListings(FUEL_USED_WRONG, FUEL_USED_WRONG_U);
    expect(rows).toHaveLength(2);
    expect(rows.every((r) => r.same)).toBe(true);
    expect(rows.map((r) => r.left)).toEqual(["sub w0, w1, w0", "ret"]);
  });

  it("leave the same bits in w0 for every pair of arguments, so one sub serves both", () => {
    const pairs: [number, number][] = [
      [50, 38],
      [0, 0],
      [4294967295, 1],
      [2147483648, 2147483647],
      [1, 4294967295],
    ];
    for (const [a, b] of pairs) {
      const signed = w0(fuel(FUEL_USED_WRONG, a, b).final);
      const unsigned = w0(fuel(FUEL_USED_WRONG_U, a, b).final);
      expect(unsigned, `${a} ${b}`).toBe(signed);
    }
  });
});

describe("the challenges", () => {
  it("Make −1: all 32 bits set read as −1 signed and 4294967295 unsigned, and adding 1 gives 0", () => {
    const ones = readingsOfPattern("1".repeat(32));
    expect([ones.signed, ones.unsigned, ones.digits]).toEqual([-1, 4294967295, "ffffffff"]);
    const program = build("add w0, w0, 1\nret\n");
    const result = run(program, { entry: 0x400000, args: [{ value: 0xffffffffn, width: 32 }] });
    expect(w0(result.final)).toBe(0n);
    expect(challenge("make-minus-one").reference.answers).toEqual({
      bits: "1".repeat(32),
      unsigned: "4294967295",
    });
  });

  it("Make −1, hints: −1 is not 1 with the top bit set, and −12 is 0xfffffff4", () => {
    expect(readingsOfPattern("1" + "0".repeat(30) + "1").signed).not.toBe(-1);
    expect(readingsOfValue(-12).digits).toBe("fffffff4");
  });

  it("Two readings each: 0x0000002a is 42 both ways, 0x80000000 is 2147483648 and −2147483648, 0xffffff38 is 4294967096 and −200", () => {
    const read = (hex: string) => readingsOfValue(BigInt(hex));
    const got = ["0x0000002a", "0x80000000", "0xffffff38"].map(read);
    expect(got.map((r) => [r.unsigned, r.signed])).toEqual([
      [42, 42],
      [2147483648, -2147483648],
      [4294967096, -200],
    ]);
    expect(challenge("two-readings-each").reference.answers).toEqual({
      u1: "42",
      s1: "42",
      u2: "2147483648",
      s2: "-2147483648",
      u3: "4294967096",
      s3: "-200",
    });
  });

  it("Two readings each: the patterns the cases give are the ones the task names", () => {
    const c = challenge("two-readings-each");
    if (c.tests.kind !== "answers") throw new Error("answer tests");
    expect([...new Set(c.tests.cases.map((t) => t.given["pattern"]))]).toEqual([
      "0x0000002a",
      "0x80000000",
      "0xffffff38",
    ]);
    for (const p of ["0x0000002a", "0x80000000", "0xffffff38"]) expect(c.task).toContain(p);
  });
});

// ---------------------------------------------------------------------------------------------
// Every number the learner reads

describe("every number the lesson states", () => {
  // The numbers of the calls, and what the model gives for them. A number in the lesson's words
  // that is in no list here is a number nothing pins.
  const model = new Set<number>([
    // fuel_used(50, 38), and the 12 of −12 and of add w0, w0, 12.
    50, 38, 12,
    // w0 after sub w0, w1, w0, read unsigned; and plus 12.
    4294967284, 4294967296,
    // The 32 bits of a register, and the 33 bits that 4294967296 needs; the 64 bits it holds in all,
    // which Lesson 2 shows.
    32,
    33, 64,
    // GCC's version, 16.1 (its 1 is a bit's worth, below).
    16,
    // The prediction's options: 0 is the right one, 24 is not one of the model's results.
    0, 24,
    // The worths of the bits: 1, 2, 4 and 8, and the top bit's.
    1, 2, 4, 8, 2147483648,
    // The digits 0 to 9 of hexadecimal, of which 9 is the highest.
    9,
    // The range of the readings, and the patterns of the last challenge.
    4294967295, 2147483647, 42, 4294967096, 200,
  ]);

  const text = learnerText(lesson).join("\n");
  const hexes = [...text.matchAll(/0x[0-9a-f]+/g)].map((m) => m[0]);
  const bitGroups = [...text.matchAll(/(?:[01]{4} ){7}[01]{4}/g)].map((m) => m[0]);

  it("is pinned: each is an argument of a call, a result of the model, or a fact the tests above check", () => {
    // Names such as w0 and fuel_used_wrong_u hold digits that are not numbers; so do hexadecimal
    // numbers and groups of bits, which are held to the model below.
    const plain = text
      .replace(/(?:[01]{4} ){7}[01]{4}/g, " ")
      .replace(/0x[0-9a-f]+/g, " ")
      .replace(/[A-Za-z_][A-Za-z_0-9]*/g, " ");
    const numbers = [...plain.matchAll(/\d+/g)].map((m) => Number(m[0]));
    expect(numbers.length).toBeGreaterThan(30);
    expect(numbers.filter((n) => !model.has(n))).toEqual([]);
  });

  it("writes each hexadecimal number as the pattern the model holds", () => {
    expect([...new Set(hexes)].sort()).toEqual(
      ["0x0000002a", "0x80000000", "0xffffff38", "0xfffffff4", "0xffffffff"].sort(),
    );
    for (const h of hexes) {
      const r = readingsOfValue(BigInt(h));
      expect(`0x${r.digits}`).toBe(h);
    }
  });

  it("writes the 32 bits of w0 as the model holds them", () => {
    expect(bitGroups).toEqual(["1111 1111 1111 1111 1111 1111 1111 0100"]);
    expect(grouped(readingsOfValue(-12).pattern)).toBe(bitGroups[0]);
  });

  it("agrees with the model on every pinned result", () => {
    const sub = fuel(FUEL_USED_WRONG);
    const add = fuel(FUEL_USED_WRONG_PLUS_12);
    const results = [
      wValue(stateAfter(sub, 0), 0),
      -wValueAsInt(stateAfter(sub, 0), 0),
      wValue(stateAfter(add, 1), 0),
      wValue(stateAfter(sub, 0), 0) + 12,
    ];
    for (const n of results) expect(model.has(n), String(n)).toBe(true);
  });
});
