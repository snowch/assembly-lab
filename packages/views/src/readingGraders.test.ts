// Copyright © 2026 Christopher Snow

// The graders of Module 1's answers challenges. Each takes what it checks from the model, blocks
// until every number is a whole number, rejects a wrong answer with a sentence that names no value,
// and compares exactly: a reading of 4294967096 is not −200.

import { describe, expect, it } from "vitest";

import { Challenge } from "@platform/lesson-schema";

import { fieldList } from "./fields";
import { grade } from "./grader";
import { NO_BITS } from "./readings";
import { VIEW_STRINGS as S } from "./strings";

const hints = ["a", "b", "c", "d", "e"];

const bits = Challenge.parse({
  id: "bits",
  title: "Make a pattern",
  task: "Make it.",
  gradedDirection: "answer",
  fields: [
    { id: "bits", label: "the bits", kind: "bits", width: 32, weights: "signed" },
    { id: "unsigned", label: "its unsigned reading", kind: "number" },
  ],
  tests: {
    kind: "answers",
    grader: "bit-readings",
    cases: [
      { label: "the bits", given: { reading: "signed" }, expect: { bits: -1 } },
      {
        label: "its unsigned reading",
        given: { reading: "unsigned" },
        expect: { unsigned: "bits" },
      },
    ],
  },
  hints,
  reference: { answers: { bits: "1".repeat(32), unsigned: "4294967295" } },
});

const patterns = Challenge.parse({
  id: "patterns",
  title: "Read patterns",
  task: "Read them.",
  gradedDirection: "answer",
  fields: ["u1", "s1", "u2", "s2"].map((id) => ({ id, label: `field ${id}`, kind: "number" })),
  tests: {
    kind: "answers",
    grader: "pattern-readings",
    cases: [
      { label: "u1", given: { pattern: "0xffffff38" }, expect: { u1: "unsigned" } },
      { label: "s1", given: { pattern: "0xffffff38" }, expect: { s1: "signed" } },
      { label: "u2", given: { pattern: "0x0000002a" }, expect: { u2: "unsigned" } },
      { label: "s2", given: { pattern: "0x0000002a" }, expect: { s2: "signed" } },
    ],
  },
  hints,
  reference: { answers: { u1: "4294967096", s1: "-200", u2: "42", s2: "42" } },
});

const registers = Challenge.parse({
  id: "registers",
  title: "Registers",
  task: "Work them out.",
  gradedDirection: "answer",
  fields: [
    { id: "x1", label: "`x1` at the end", kind: "number" },
    { id: "w2", label: "`w2` at the end", kind: "number" },
  ],
  initial: {
    data: {
      program: {
        c: "",
        listing: "mov x1, -1\nmov w1, 5\nmov w2, 16960\nmovk w2, 0xf, lsl 16",
      },
    },
  },
  tests: {
    kind: "answers",
    grader: "registers-after",
    cases: [
      { label: "x1", given: {}, expect: { x1: "x1" } },
      { label: "w2", given: {}, expect: { w2: "w2" } },
    ],
  },
  hints,
  reference: { answers: { x1: "5", w2: "1000000" } },
});

describe("bit-readings", () => {
  it("passes the reference: all 32 bits set, and 4294967295", () => {
    const v = grade(bits, bits.reference);
    expect(v.passed).toBe(true);
    expect(v.total).toBe(2);
  });

  it("blocks until the number is a whole number", () => {
    const empty = grade(bits, { answers: { bits: "1".repeat(32) } });
    expect(empty.blocked).toBe(S.grader.unanswered(fieldList(["its unsigned reading"]), 1));
    const text = grade(bits, { answers: { bits: "1".repeat(32), unsigned: "lots" } });
    expect(text.blocked).toBe(S.grader.notWhole("its unsigned reading"));
  });

  it("reads untouched bits as 32 zeros: signed 0 is not −1, and 0 is their unsigned reading", () => {
    const v = grade(bits, { answers: { unsigned: "0" } });
    expect(v.passed).toBe(false);
    expect(v.failures.map((f) => f.label)).toEqual(["the bits"]);
    expect(v.failures[0]?.detail).toBe(S.readings.bitsRead("0"));
    expect(NO_BITS).toHaveLength(32);
  });

  it("says what the learner's own bits read as, never the right value", () => {
    const v = grade(bits, { answers: { bits: "1".repeat(28) + "0100", unsigned: "4294967284" } });
    expect(v.failures).toHaveLength(1);
    expect(v.failures[0]?.detail).toBe(S.readings.bitsRead("−12"));
    expect(JSON.stringify(v)).not.toContain("4294967295");
  });

  it("grades the number against the learner's own bits, so a right number for wrong bits passes only that test", () => {
    const v = grade(bits, { answers: { bits: "1".repeat(28) + "0100", unsigned: "4294967284" } });
    expect(v.failures.map((f) => f.label)).toEqual(["the bits"]);
    const w = grade(bits, { answers: { bits: "1".repeat(32), unsigned: "4294967284" } });
    expect(w.failures.map((f) => f.label)).toEqual(["its unsigned reading"]);
    expect(w.failures[0]?.detail).toBe(S.readings.notThis);
  });
});

describe("pattern-readings", () => {
  it("passes the reference", () => {
    const v = grade(patterns, patterns.reference);
    expect(v.passed).toBe(true);
    expect(v.total).toBe(4);
  });

  it("compares exactly: the signed reading is not the unsigned one, and the minus sign is accepted", () => {
    const swapped = grade(patterns, {
      answers: { u1: "-200", s1: "4294967096", u2: "42", s2: "42" },
    });
    expect(swapped.failures.map((f) => f.label)).toEqual(["u1", "s1"]);
    const typographic = grade(patterns, {
      answers: { u1: "4294967096", s1: "−200", u2: "42", s2: "42" },
    });
    expect(typographic.passed).toBe(true);
  });

  it("does not wrap a number into 32 bits: 4294967096 plus 2 to the 32 is wrong", () => {
    const v = grade(patterns, {
      answers: { u1: "8589934392", s1: "-200", u2: "42", s2: "42" },
    });
    expect(v.failures.map((f) => f.label)).toEqual(["u1"]);
  });

  it("answers a wrong reading with a sentence that is the same for every wrong answer", () => {
    const v = grade(patterns, { answers: { u1: "1", s1: "2", u2: "42", s2: "42" } });
    expect(v.failures.map((f) => f.detail)).toEqual([S.readings.notThis, S.readings.notThis]);
    expect(JSON.stringify(v)).not.toContain("4294967096");
  });

  it("blocks until all four fields are whole numbers, and names the empty ones", () => {
    const v = grade(patterns, { answers: { u1: "4294967096", s1: "-200" } });
    expect(v.blocked).toBe(S.grader.unanswered(fieldList(["field u2", "field s2"]), 2));
  });
});

describe("registers-after", () => {
  it("passes the reference: x1 is 5 and w2 is 1000000 after the four instructions", () => {
    const v = grade(registers, registers.reference);
    expect(v.passed).toBe(true);
    expect(v.total).toBe(2);
  });

  it("fails the number x1 would hold if writing w1 kept the upper half, as a 64-bit number", () => {
    // 0xffffffff00000005 is x1 if the upper half were kept; reduced to 32 bits it would be 5.
    const kept = String(0xffffffff00000005n);
    const v = grade(registers, { answers: { x1: kept, w2: "1000000" } });
    expect(v.passed).toBe(false);
    expect(v.failures.map((f) => f.label)).toEqual(["x1"]);
    expect(v.failures[0]?.detail).toBe(S.readings.registerWrong("x1"));
    expect(JSON.stringify(v)).not.toMatch(/\b5\b/);
  });

  it("fails a w2 that has the upper half's worth added, which a 32-bit comparison would let through", () => {
    const v = grade(registers, { answers: { x1: "5", w2: String(1000000 + 2 ** 32) } });
    expect(v.failures.map((f) => f.label)).toEqual(["w2"]);
  });

  it("blocks with nothing answered, and does not need a ret in the listing", () => {
    expect(grade(registers, registers.initial).blocked).toBe(
      S.grader.unanswered(fieldList(["x1 at the end", "w2 at the end"]), 2),
    );
    expect(registers.initial.data?.["program"]).toMatchObject({
      listing: expect.not.stringContaining("ret"),
    });
  });
});
