// Copyright © 2026 Christopher Snow

// Every number lesson 2 of Module 2 states, run on the model, and every listing it shows or
// describes, held to the recorded file. The lesson's words say 2000, 49.71 days, C 0 and 1; this test
// says what the simulator gives, so a number cannot be right in the prose and wrong in the machine.
// The listings are held to docs/notes/module-2/listings.md (ARM64 GCC 16.1.0, -O1), and the lesson's
// own assembly to the differential test's corpus.

import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { additionSteps, bitAt, parseListing, traceOf } from "@al/views";

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
    expect(PROSE.question).toContain("two instructions, one subtraction and a `ret`");
    // The subtraction is the Write elapsed challenge's answer, so no text before it gives it.
    expect(PROSE.question).not.toContain("sub w0, w0, w1");
  });

  it("make sub_overflows subs w0, w0, w1 and then one more instruction that reads V", () => {
    const lines = functionIn(assembly(SUB_OVERFLOWS.listing), "sub_overflows");
    expect(lines).toEqual(["subs w0, w0, w1", "cset w0, vs", "ret"]);
    expect(PROSE.generalisation).toContain("runs `subs w0, w0, w1` and then an instruction");
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
    expect(PROSE.question).toContain("4294967296 milliseconds is about 49.71 days");
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
    expect(PROSE.elapsedTask).toContain("Four calls test it, two across the wrap");
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
