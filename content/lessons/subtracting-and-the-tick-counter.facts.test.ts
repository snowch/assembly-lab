// Copyright © 2026 Christopher Snow

// Every number lesson 2 of Module 2 states, run on the model, and every listing it shows or
// describes, held to the recorded file. The lesson's words say 2000, 49.71 days, C 0 and 1; this test
// says what the simulator gives, so a number cannot be right in the prose and wrong in the machine.
// The listings are held to docs/notes/module-2/listings.md (ARM64 GCC 16.1.0, -O1), and the lesson's
// own assembly to the differential test's corpus.

import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { additionSteps, bitAt, parseListing, ringReading, secondAsGiven, traceOf } from "@al/views";
import { learnerText } from "@platform/lesson-schema";

import { LESSONS } from ".";
import {
  ELAPSED,
  ELAPSED_FIXED_TEXT,
  ELAPSED_STARTING_TEXT,
  ELAPSED_SUBS,
  NEGATE,
  NEGATE_FLAGS,
  SUB_OVERFLOWS,
} from "./subtracting-and-the-tick-counter.listings";
import { PROSE } from "./subtracting-and-the-tick-counter.prose";
import { shownFunction } from "./module-2.recorded";
import { statedNumbers } from "./stated-numbers";
import {
  ALL_SET,
  assembly,
  callText,
  corpusText,
  functionIn,
  nzcv,
  recorded,
} from "./module-2.runs";

const lesson = LESSONS.find((l) => l.id === "subtracting-and-the-tick-counter")!;

const MAX = 0xffffffff;
const elapsed = (now: number, then: number) =>
  callText(assembly(ELAPSED.listing), "elapsed", [now, then]);
const subs = (now: number, then: number) =>
  callText(assembly(ELAPSED_SUBS.listing), "elapsed_subs", [now, then]);

describe("the listings the lesson shows or describes", () => {
  it("name the compiler and the setting the recorded file records", () => {
    expect(recorded).toContain("ARM64 GCC 16.1.0");
    expect(recorded).toContain("`-O1`");
  });

  it.each([
    ["elapsed", ELAPSED],
    ["sub_overflows", SUB_OVERFLOWS],
    ["negate", NEGATE],
  ] as const)(
    "show %s's C and instructions as recorded, counted from the function",
    (name, listing) => {
      const shown = shownFunction(name);
      expect(listing.c).toBe(shown.c);
      expect(parseListing(listing.listing)).toEqual(shown.listing);
    },
  );

  it("make elapsed one subtraction and a return, which the question counts without writing out", () => {
    expect(functionIn(assembly(ELAPSED.listing), "elapsed")).toEqual(["sub w0, w0, w1", "ret"]);
    expect(PROSE.question).toContain("GCC makes it one subtraction and a `ret`");
    // The subtraction is the Write elapsed challenge's answer, so no text before it gives it.
    expect(PROSE.question).not.toContain("sub w0, w0, w1");
  });

  it("make sub_overflows subs w0, w0, w1 and then one more instruction that reads V", () => {
    const lines = functionIn(assembly(SUB_OVERFLOWS.listing), "sub_overflows");
    expect(lines).toEqual(["subs w0, w0, w1", "cset w0, vs", "ret"]);
    // The lesson no longer describes it (it showed nothing the learner could check); the listing stays recorded.
    expect(PROSE.generalisation).not.toContain("sub_overflows");
    // It returns 1 exactly when V is set after the subtraction, as add_overflows did after an addition.
    const text = assembly(SUB_OVERFLOWS.listing);
    for (const [a, b] of [
      [0x80000000, 1],
      [5, 3],
      [0, 0x80000000],
      [1000, 4294966296],
      [0x7fffffff, MAX],
    ] as const) {
      expect(callText(text, "sub_overflows", [a, b]).w0, `${a} - ${b}`).toBe(
        subs(a, b).flags.v ? 1 : 0,
      );
    }
  });

  it("make elapsed with a plain sub, which leaves the flags alone", () => {
    const out = callText(assembly(ELAPSED.listing), "elapsed", [1000, 4294966296], ALL_SET);
    expect(nzcv(out.flags)).toBe("1111");
  });
});

describe("the counter", () => {
  it("takes 2^32 values, 4294967296 milliseconds, which is 49.71 days and about 50", () => {
    expect(2 ** 32).toBe(4294967296);
    expect(2 ** 32 / 86400000).toBeCloseTo(49.71, 2);
    expect((2 ** 32 / 86400000).toFixed(2)).toBe("49.71");
    expect(Math.round(2 ** 32 / 86400000)).toBe(50);
    expect(PROSE.question).toContain(
      "One full turn of the counter, 4294967296 ticks, is about 49.71 days",
    );
  });

  it("goes from 4294967295 back to 0, which is the wrap", () => {
    const out = callText("f:\n  add w0, w0, 1\n  ret\n", "f", [MAX]);
    expect(out.w0).toBe(0);
    expect(MAX).toBe(4294967295);
  });

  it("is 1000 steps from 4294966296 to the wrap, and 1000 more to reach 1000", () => {
    expect(2 ** 32 - 4294966296).toBe(1000);
    expect(1000 - 0).toBe(1000);
  });
});

describe("elapsed(1000, 4294966296)", () => {
  it("returns 2000, and none of the other three options", () => {
    expect(elapsed(1000, 4294966296).w0).toBe(2000);
    const options = lesson.sections[2]!.interactives[0]!.props["options"] as { label: string }[];
    // The right option is not first.
    expect(options.map((o) => o.label)).toEqual(["−4294965296", "4294965296", "2000", "0"]);
    // The other options are what a subtraction without the wrap would say, and the wrong turns.
    expect(1000 - 4294966296).toBe(-4294965296);
    expect(4294966296 - 1000).toBe(4294965296);
    expect(elapsed(1000, 4294966296).w0).not.toBe(4294965296);
  });

  it("sets C 0 with subs: the subtraction borrowed, because the counter wrapped", () => {
    const out = subs(1000, 4294966296);
    expect(out.flags.c).toBe(false);
    expect(out.w0).toBe(2000);
  });

  it("does the subtraction as a plus the bits of b turned over, plus 1, in the same adder as lesson 1", () => {
    const record = additionSteps(
      traceOf(ELAPSED_SUBS, { entry: "elapsed_subs", args: [1000, 4294966296] }),
    )[0]!.addition!;
    expect(record.subtraction).toBe(true);
    expect(record.a).toBe(1000n);
    expect(record.b).toBe(BigInt.asUintN(32, ~BigInt(4294966296)));
    expect(record.carryIn).toBe(1);
    expect(record.result).toBe(2000n);
    expect((record.a + record.b + BigInt(record.carryIn)) % 2n ** 32n).toBe(2000n);
  });
});

describe("the adder drawing elapsed_subs", () => {
  const figures = lesson.sections.flatMap((s) => s.interactives);
  const figure = (id: string) => figures.find((x) => x.id === id)!;
  const recordOf = (a: number, b: number) =>
    additionSteps(traceOf(ELAPSED_SUBS, { entry: "elapsed_subs", args: [a, b] }))[0]!.addition!;
  const bits = (v: bigint) => v.toString(2).padStart(32, "0");

  it("draws 1000 minus 4294966296: b turned over is 999, 1 carried in, the answer 2000, no carry out, C 0", () => {
    expect(figure("subtract-wrapped").kind).toBe("adder");
    expect(figure("subtract-wrapped").props["call"]).toEqual({
      entry: "elapsed_subs",
      args: [1000, 4294966296],
    });
    const record = recordOf(1000, 4294966296);
    expect(record.subtraction).toBe(true);
    expect(record.a).toBe(1000n);
    expect(record.b).toBe(999n);
    expect(bits(record.b)).toBe("00000000000000000000001111100111");
    expect(record.carryIn).toBe(1);
    expect(bitAt(record.carries, 0)).toBe(1);
    expect(record.result).toBe(2000n);
    expect(record.carryOut).toBe(0);
    expect(nzcv(subs(1000, 4294966296).flags)).toBe("0000");
  });

  it("carries only in the low columns: nothing runs into the top bit or out of it, and the carries into columns 0 to 4 and 6 to 10 are 1", () => {
    const record = recordOf(1000, 4294966296);
    // 1000 is 1111101000 and 999 is 1111100111, with 1 carried in: the carry into column 5 is 0.
    expect(bitAt(record.carries, 31)).toBe(0);
    expect(
      [...Array(33).keys()].filter(
        (c) => (c === 32 ? record.carryOut : bitAt(record.carries, c)) === 1,
      ),
    ).toEqual([0, 1, 2, 3, 4, 6, 7, 8, 9, 10]);
  });

  it("draws 9000 minus 2500 as a second case, where C is 1: no wrap, no borrow", () => {
    expect(figure("subtract-no-wrap").kind).toBe("adder");
    expect(figure("subtract-no-wrap").props["call"]).toEqual({
      entry: "elapsed_subs",
      args: [9000, 2500],
    });
    const record = recordOf(9000, 2500);
    expect(record.subtraction).toBe(true);
    expect(record.a).toBe(9000n);
    expect(record.b).toBe(BigInt.asUintN(32, ~2500n));
    expect(record.b).toBe(4294964795n);
    expect(record.carryIn).toBe(1);
    expect(record.result).toBe(6500n);
    expect(record.carryOut).toBe(1);
    expect(nzcv(subs(9000, 2500).flags)).toBe("0010");
    expect(elapsed(9000, 2500).w0).toBe(6500);
  });

  it("is a call no challenge tests, and both adders open after the prediction about elapsed", () => {
    const calls = lesson.challenges.flatMap((c) =>
      c.tests.kind === "answers"
        ? c.tests.cases.map((t) => [t.given["w0"], t.given["w1"]].join(","))
        : [],
    );
    expect(calls).not.toContain("9000,2500");
    // The wrapped call is the prediction's and the ring's, not a challenge's.
    expect(calls).not.toContain("1000,4294966296");
    for (const id of ["subtract-wrapped", "subtract-no-wrap"])
      expect(figure(id).props["after"]).toBe("predict-elapsed");
  });

  it("are in the differential test's corpus, as calls of elapsed_subs", () => {
    const json = JSON.parse(
      readFileSync(
        new URL("../../scripts/real-tools/corpus/module2-subs.json", import.meta.url),
        "utf8",
      ),
    ) as { calls: { entry: string; args: [string, number][] }[] };
    const has = (a: string, b: string) =>
      json.calls.some(
        (c) => c.entry === "elapsed_subs" && c.args[0]?.[0] === a && c.args[1]?.[0] === b,
      );
    expect(has("1000", "4294966296")).toBe(true);
    expect(has("9000", "2500")).toBe(true);
    // The question of the last section, and the call the adder after the challenge draws.
    expect(has("296", "4294967000")).toBe(true);
    expect(has("250", "4294967046")).toBe(true);
  });
});

describe("C after subs", () => {
  // The values the lesson's sentences cover: a borrow is needed when a is less than b, read as unsigned.
  const values = [0, 1, 2, 3, 5, 1000, 0x7fffffff, 0x80000000, 4294966296, MAX - 1, MAX];

  it("is 1 when no borrow was needed, a at least b unsigned, and 0 when one was", () => {
    for (const a of values)
      for (const b of values) expect(subs(a, b).flags.c, `${a} - ${b}`).toBe(a >= b);
  });

  it("is the carry out of the same addition as lesson 1, so it is 1 for equal numbers", () => {
    expect(subs(3, 3).flags.c).toBe(true);
    expect(subs(3, 3).flags.z).toBe(true);
  });

  it("differs from C after adds: there it is 1 when the unsigned answer did not fit", () => {
    const adds = callText("f:\n  adds w0, w0, w1\n  ret\n", "f", [MAX, 1]);
    expect(adds.flags.c).toBe(true);
    expect(subs(MAX, 1).flags.c).toBe(true);
    expect(subs(1, MAX).flags.c).toBe(false);
  });
});

describe("a wrapped counter", () => {
  it("gives the right distance by plain subtraction, as long as less than one full turn passed", () => {
    const thens = [0, 1, 1000, 0x7fffffff, 0x80000000, 4294966296, MAX - 1, MAX];
    const distances = [0, 1, 2000, 86400000, 0x7fffffff, 0x80000000, MAX - 1, MAX];
    for (const then of thens)
      for (const d of distances) {
        const now = Number((BigInt(then) + BigInt(d)) % 2n ** 32n);
        expect(elapsed(now, then).w0, `${then} + ${d}`).toBe(d);
      }
  });

  it("keeps the low 32 bits of the true answer: 1000 minus 4294966296 is −4294965296, and 2000 is its low 32 bits", () => {
    expect(Number(BigInt.asUintN(32, BigInt(1000 - 4294966296)))).toBe(2000);
  });
});

describe("the construction challenge", () => {
  const c = lesson.challenges.find((x) => x.id === "write-elapsed")!;
  const text = assembly(`f:\n${ELAPSED_FIXED_TEXT}\n`);

  it("has the tests' expected answers as the recorded elapsed gives them", () => {
    if (c.tests.kind !== "answers") throw new Error("answers");
    for (const t of c.tests.cases) {
      const out = callText(text, "f", [Number(t.given["w0"]), Number(t.given["w1"])]);
      expect(String(out.w0), t.label).toBe(String(t.expect["w0"]));
    }
  });

  it("has four calls, two across the wrap, and elapsed(5000, 1000) is 4000", () => {
    if (c.tests.kind !== "answers") throw new Error("answers");
    expect(c.tests.cases).toHaveLength(4);
    const across = c.tests.cases.filter((t) => Number(t.given["w0"]) < Number(t.given["w1"]));
    expect(across).toHaveLength(2);
    expect(elapsed(5000, 1000).w0).toBe(4000);
    expect(PROSE.elapsedTask).toContain("Four calls test it, two of them across the wrap");
  });

  it("does not test the step from 4294967295 to 0, which the last challenge asks about", () => {
    if (c.tests.kind !== "answers") throw new Error("answers");
    expect(c.tests.cases.filter((t) => Number(t.given["w1"]) === MAX)).toEqual([]);
  });

  it("starts from a function that returns now unchanged, and its reference is the recorded elapsed", () => {
    expect(ELAPSED_STARTING_TEXT).toBe("ret");
    expect(functionIn(text, "f")).toEqual(functionIn(assembly(ELAPSED.listing), "elapsed"));
  });

  it("allows no neg, which its reference does not need, and reads its values as unsigned", () => {
    expect(c.allowedConstructs).not.toContain("neg");
    const mnemonics = functionIn(text, "f").map((l) => l.split(" ")[0]);
    for (const m of mnemonics) expect(c.allowedConstructs).toContain(m);
    if (c.tests.kind !== "answers") throw new Error("answers");
    expect(c.tests.cases.map((t) => t.given["reading"])).toEqual([
      "unsigned",
      "unsigned",
      "unsigned",
      "unsigned",
    ]);
    // Every expected answer is a number the unsigned reading writes as it is.
    for (const t of c.tests.cases) expect(Number(t.expect["w0"])).toBeGreaterThanOrEqual(0);
  });

  it("is told that now arrives in w0 and then in w1", () => {
    const args = callText("f:\n  ret\n", "f", [1000, 4294966296]).result.initial.x;
    expect([args[0], args[1]]).toEqual([1000n, 4294966296n]);
  });
});

describe("negs on 0x80000000", () => {
  const negs = (x: number) => callText(assembly(NEGATE_FLAGS.listing), "negate_flags", [x]);

  it("lists the right option second, not first", () => {
    const section = lesson.sections.find((s) => s.kind === "failureExperiment")!;
    const options = section.interactives[0]!.props["options"] as { value: string }[];
    expect(options.map((o) => o.value)).toEqual([
      "0x7fffffff",
      "0x80000000",
      "0x00000000",
      "error",
    ]);
    expect(options[1]!.value).toBe("0x" + negs(0x80000000).w0.toString(16).padStart(8, "0"));
  });

  it("holds 0x80000000 afterwards, unchanged, and sets V 1", () => {
    const out = negs(0x80000000);
    expect(out.w0).toBe(0x80000000);
    expect(out.flags.v).toBe(true);
  });

  it("reads as −2147483648 signed, whose negative, 2147483648, does not fit", () => {
    expect(BigInt.asIntN(32, 0x80000000n)).toBe(-2147483648n);
    expect(2147483648).toBeGreaterThan(2147483647);
  });

  it("is a subtraction from 0: neg is 0 minus the value, and no other value comes back as itself except 0", () => {
    for (const x of [0, 1, 5, 0x7fffffff, 0x80000000, MAX]) {
      const negated = callText(assembly(NEGATE.listing), "negate", [x]).w0;
      const zeroMinus = callText("f:\n  sub w0, wzr, w0\n  ret\n", "f", [x]).w0;
      expect(negated, `${x}`).toBe(zeroMinus);
    }
    const itself = [0, 1, 5, 0x7fffffff, 0x80000000, MAX].filter(
      (x) => callText(assembly(NEGATE.listing), "negate", [x]).w0 === x,
    );
    expect(itself).toEqual([0, 0x80000000]);
  });

  it("sets V only for 0x80000000", () => {
    for (const x of [1, 5, 0x7fffffff, MAX]) expect(negs(x).flags.v, `${x}`).toBe(false);
  });
});

describe("one step past the top: elapsed(0, 4294967295)", () => {
  it("returns 1, and C after subs is 0", () => {
    expect(elapsed(0, MAX).w0).toBe(1);
    expect(subs(0, MAX).w0).toBe(1);
    expect(subs(0, MAX).flags.c).toBe(false);
  });

  it("is a step: one after 4294967295 the counter reads 0", () => {
    expect(callText("f:\n  add w0, w0, 1\n  ret\n", "f", [MAX]).w0).toBe(0);
  });

  it("is the reference of the last challenge", () => {
    const c = lesson.challenges.find((x) => x.id === "one-step-past")!;
    expect(c.reference.answers).toEqual({ result: "1", c: "0" });
  });
});

describe("the programs the lesson wrote itself", () => {
  it("are the programs the differential test runs against QEMU", () => {
    const corpus = corpusText("module2-subs");
    expect(functionIn(corpus, "elapsed_subs")).toEqual(
      functionIn(assembly(ELAPSED_SUBS.listing), "elapsed_subs"),
    );
    expect(functionIn(corpus, "negate_flags")).toEqual(
      functionIn(assembly(NEGATE_FLAGS.listing), "negate_flags"),
    );
    expect(functionIn(corpus, "elapsed_start")).toEqual([ELAPSED_STARTING_TEXT]);
    expect(functionIn(corpus, "elapsed_fixed")).toEqual(
      functionIn(assembly(`f:\n${ELAPSED_FIXED_TEXT}\n`), "f"),
    );
  });

  it("and GCC's elapsed, sub_overflows and negate are in that test too, as recorded", () => {
    const gcc = corpusText("module2-gcc");
    for (const [label, listing] of [
      ["elapsed", ELAPSED],
      ["sub_overflows", SUB_OVERFLOWS],
      ["negate", NEGATE],
    ] as const)
      expect(functionIn(gcc, label)).toEqual(functionIn(assembly(listing.listing), label));
  });
});

describe("subtraction as addition, in the four columns the lesson draws", () => {
  const record = additionSteps(traceOf(ELAPSED_SUBS, { entry: "elapsed_subs", args: [5, 3] }))[0]!
    .addition!;
  const low = (value: bigint, n = 4) =>
    value
      .toString(2)
      .padStart(32, "0")
      .slice(32 - n);

  it("shows 5 as 0101, 3 as 0011 and 3 with every bit changed as 1100, in the low four columns of a real subs", () => {
    expect(record.subtraction).toBe(true);
    expect(low(record.a)).toBe("0101");
    expect(low(secondAsGiven(record))).toBe("0011");
    expect(low(record.b)).toBe("1100");
    expect(secondAsGiven(record)).toBe(3n);
  });

  it("adds the 1 into the first column: the low four columns of the sum are 0010, kept as 2, with a carry out of the fourth", () => {
    expect(record.carryIn).toBe(1);
    expect(low(record.result)).toBe("0010");
    expect(Number.parseInt(low(record.result), 2)).toBe(2);
    // The carry out of column 3 is the carry into column 4.
    expect(bitAt(record.carries, 4)).toBe(1);
    // The four-bit sum on paper: 0101 + 1100 + 1 is 10010.
    expect((0b0101 + 0b1100 + 1).toString(2)).toBe("10010");
  });

  it("makes the real instruction's result 2, with C 1: 5 is at least 3, so no borrow", () => {
    expect(record.result).toBe(2n);
    expect(subs(5, 3).flags.c).toBe(true);
    expect(subs(5, 3).w0).toBe(2);
  });

  it("gives 2^32 minus b for b with every bit changed and 1 added, which is 4294967296 minus b", () => {
    for (const b of [1, 3, 2500, 4294966296, 4294967000, 4294967295]) {
      const rec = additionSteps(traceOf(ELAPSED_SUBS, { entry: "elapsed_subs", args: [0, b] }))[0]!
        .addition!;
      expect((rec.b + BigInt(rec.carryIn)) % 2n ** 32n, `${b}`).toBe(
        (2n ** 32n - BigInt(b)) % 2n ** 32n,
      );
    }
    expect(2 ** 32).toBe(4294967296);
  });

  it("is drawn by the figures that follow: the second operand, its bits changed, the carry in of 1, the result and the carry out", () => {
    const rec = additionSteps(
      traceOf(ELAPSED_SUBS, { entry: "elapsed_subs", args: [1000, 4294966296] }),
    )[0]!.addition!;
    expect(secondAsGiven(rec)).toBe(4294966296n);
    expect(rec.carryIn).toBe(1);
    expect(rec.result).toBe(2000n);
    expect(rec.carryOut).toBe(0);
  });
});

describe("the final states the two subtraction figures open with", () => {
  it("shows 9000 minus 2500 as 6500 with C 1, no borrow", () => {
    expect(subs(9000, 2500).w0).toBe(6500);
    expect(9000 - 2500).toBe(6500);
    expect(subs(9000, 2500).flags.c).toBe(true);
    expect(elapsed(9000, 2500).w0).toBe(6500);
  });

  it("shows 1000 minus 4294966296 as 2000 with C 0, a borrow", () => {
    expect(subs(1000, 4294966296).w0).toBe(2000);
    expect(subs(1000, 4294966296).flags.c).toBe(false);
  });

  it("makes both figures open after the prediction, at their final states, with the detail", () => {
    for (const id of ["subtract-wrapped", "subtract-no-wrap"]) {
      const figure = lesson.sections.flatMap((s) => s.interactives).find((x) => x.id === id)!;
      expect(figure.props["after"]).toBe("predict-elapsed");
      expect(figure.props["opensAtEnd"]).toBe(true);
      expect(figure.props["detail"]).toBe(true);
      expect(figure.props["summary"]).toBe(true);
    }
  });
});

describe("the strip's two stretches and their total", () => {
  const reading = (now: number, then: number) =>
    ringReading(ELAPSED, ELAPSED_SUBS, { entry: "elapsed", args: [now, then] }, "elapsed_subs");

  it("split elapsed(1000, 4294966296) into 1000 ticks to the wrap and 1000 after it, 2000 in all", () => {
    const r = reading(1000, 4294966296);
    expect(r.segments).toEqual({ before: 1000, after: 1000 });
    expect(r.elapsed).toBe(2000);
    expect(r.segments!.before + r.segments!.after).toBe(elapsed(1000, 4294966296).w0);
    expect(2 ** 32 - 4294966296).toBe(1000);
  });

  it("split the answer to the lesson's question, 296 and 296, into 592 in all", () => {
    const r = reading(296, 4294967000);
    expect(r.segments).toEqual({ before: 296, after: 296 });
    expect(r.elapsed).toBe(592);
    expect(2 ** 32 - 4294967000).toBe(296);
  });

  it("make elapsed(0, 4294967295) one tick, all of it before the wrap", () => {
    const r = reading(0, MAX);
    expect(r.elapsed).toBe(1);
    expect(r.segments).toEqual({ before: 1, after: 0 });
  });

  it("are called a borrow and say no more: a wrap once is what a borrow means only while fewer than 2^32 ticks passed", () => {
    // Fewer than a full turn passed: a borrow means the counter wrapped once.
    for (const then of [0, 1, 1000, 0x7fffffff, 4294966296, MAX])
      for (const d of [0, 1, 2000, 86400000, 0x7fffffff, MAX]) {
        const now = Number((BigInt(then) + BigInt(d)) % 2n ** 32n);
        const wrapped = then + d >= 2 ** 32;
        expect(reading(now, then).borrowed, `${then} + ${d}`).toBe(wrapped);
      }
    // But the readings are the same for a gap of 2000 ticks and for 2000 ticks and one full turn.
    const then = 1000;
    const nowShort = Number((BigInt(then) + 2000n) % 2n ** 32n);
    const nowLong = Number((BigInt(then) + 2000n + 2n ** 32n) % 2n ** 32n);
    expect(nowLong).toBe(nowShort);
    expect(elapsed(nowLong, then).w0).toBe(2000);
  });
});

describe("the question of the last section: then 4294967000, now 296", () => {
  it("returns 592, and subs sets C to 0: a borrow was needed", () => {
    expect(elapsed(296, 4294967000).w0).toBe(592);
    expect(subs(296, 4294967000).flags.c).toBe(false);
    expect(2 ** 32 - 4294967000).toBe(296);
    expect(296 + 296).toBe(592);
  });
});

describe("negs on 0x80000000: the three lines of the explanation", () => {
  it("has an input of −2147483648, a negative of +2147483648, and a largest signed value of +2147483647", () => {
    expect(BigInt.asIntN(32, 0x80000000n)).toBe(-2147483648n);
    expect(-BigInt.asIntN(32, 0x80000000n)).toBe(2147483648n);
    expect(BigInt.asIntN(32, 0x7fffffffn)).toBe(2147483647n);
    expect(2147483648).toBeGreaterThan(2147483647);
    // The explanation's block, line by line.
    expect(PROSE.failureExplain).toContain("the input                         −2147483648");
    expect(PROSE.failureExplain).toContain("its negative                      +2147483648");
    expect(PROSE.failureExplain).toContain("the largest signed 32-bit value   +2147483647");
  });

  it("gives back 0x80000000 and sets V: the negative does not fit, so the same 32 bits return", () => {
    const out = callText(assembly(NEGATE_FLAGS.listing), "negate_flags", [0x80000000]);
    expect(out.w0).toBe(0x80000000);
    expect(out.flags.v).toBe(true);
    expect(nzcv(out.flags)).toBe("1001");
  });
});

describe("the numbers the improved text states", () => {
  const stated = statedNumbers([
    ...learnerText(lesson),
    ...lesson.challenges.flatMap((c) => c.fields.map((f) => f.label)),
  ]);

  it("are each a result of the model, an argument of a call, a count of bits, or a pattern of the four-bit example", () => {
    const decimal = new Map<number, string>([
      [0, "the wrap's first value, a flag"],
      [1, "a carry in, a flag, a bit"],
      [2, "kept in the four-bit example, and a flag"],
      [3, "the second operand of the four-bit example"],
      [5, "the first operand of the four-bit example"],
      [10, "0010, the four bits kept"],
      [11, "0011, 3 in four bits"],
      [32, "the bits of a register"],
      [49.71, "days in a turn of the counter"],
      [101, "0101, 5 in four bits"],
      [250, "a call of the challenge"],
      [296, "the question's now, and its ticks to the wrap"],
      [592, "the question's answer"],
      [1000, "now of the prediction, and its ticks to the wrap"],
      [1100, "1100, 3 with every bit changed"],
      [2000, "the prediction's answer"],
      [2500, "the no-borrow figure's second operand"],
      [4000, "elapsed(5000, 1000)"],
      [5000, "a call of the challenge"],
      [6500, "9000 minus 2500"],
      [9000, "the no-borrow figure's first operand"],
      [10010, "10010, the four-bit sum"],
      [2147483647, "the largest signed value"],
      [2147483648, "the negative of the smallest signed value, and 2^31"],
      [4294965296, "the prediction's option"],
      [4294966296, "then of the prediction"],
      [4294967000, "then of the question"],
      [4294967046, "then of a call of the challenge"],
      [4294967295, "the counter's largest value"],
      [4294967296, "2^32, one full turn"],
    ]);
    expect(stated.decimal.filter((n) => !decimal.has(n))).toEqual([]);
    expect(stated.binary).toEqual([]);
    const hexes = new Set(["0x80000000", "0x7fffffff", "0x00000000"]);
    expect(stated.hex.filter((h) => !hexes.has(h))).toEqual([]);
  });

  it("agrees with the model on each result the new text states", () => {
    expect(elapsed(5000, 1000).w0).toBe(4000);
    expect(elapsed(250, 4294967046).w0).toBe(500);
    expect(elapsed(1000, 4294966296).w0).toBe(2000);
    expect(elapsed(296, 4294967000).w0).toBe(592);
    expect(subs(9000, 2500).w0).toBe(6500);
    expect(2 ** 32).toBe(4294967296);
    expect(4294967296 - 4294966296).toBe(1000);
    expect(4294967296 - 4294967000).toBe(296);
    expect((2 ** 32 / 86400000).toFixed(2)).toBe("49.71");
    expect(1000 - 4294966296).toBe(-4294965296);
  });
});
