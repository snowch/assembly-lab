// Copyright © 2026 Christopher Snow

// What lesson 1 of Module 4 states about the compare, the condition and the select, run on the model:
// `cmp` writes no register; `cmp w1, w0` is b minus a and `cmp w0, w1` a minus b; `steeper_s` and
// `steeper_u` keep their recorded results; `ge` and `cs` are read off the same flags; and the three
// stages the figures draw (the panel beside the two listings, beside the stepper, and beside the
// learner's own `less_fuel`) are what the steps of the run record, never a number of the lesson's.

import { describe, expect, it } from "vitest";

import { grade, quoted, readConditions, selectModel, traceOf } from "@al/views";

import { LESSONS } from ".";
import {
  ARGS,
  LESS_FUEL_SIGNED_TEXT,
  LESS_FUEL_TEXT,
  SMALLEST_AND_ONE,
  STEEPER_S,
  STEEPER_U,
  STEEPER_U_GE,
} from "./compare-and-choose.listings";
import { PROSE } from "./compare-and-choose.prose";
import { callText, nzcv } from "./module-4.runs";

const MAX = 0xffffffff;
const TOP = 0x80000000;
const NAMES = ["a", "b"] as const;

const model = (program: { listing: string }, entry: string, args: readonly number[]) =>
  selectModel(traceOf(program, { entry, args }), NAMES);

describe("cmp writes no register, and the order of its operands is the order of the subtraction", () => {
  const pairs = [
    [MAX, 1],
    [1, MAX],
    [TOP, 1],
    [3, 7],
    [7, 3],
    [8, 8],
  ] as const;

  it("writes nothing: the step of every cmp records no register written", () => {
    for (const [a, b] of pairs) {
      const out = callText("f:\n  cmp w1, w0\n  ret\n", "f", [a, b]);
      expect(out.result.steps[0]!.writes, `${a} ${b}`).toEqual([]);
      expect(out.result.final.x.slice(0, 2)).toEqual([BigInt(a), BigInt(b)]);
    }
  });

  it("is b minus a for cmp w1, w0, and a minus b for cmp w0, w1", () => {
    for (const [a, b] of pairs) {
      const bMinusA = callText("f:\n  cmp w1, w0\n  ret\n", "f", [a, b]);
      const aMinusB = callText("f:\n  cmp w0, w1\n  ret\n", "f", [a, b]);
      expect(nzcv(bMinusA.flags), `${a} ${b}`).toBe(
        nzcv(callText("f:\n  subs w2, w1, w0\n  ret\n", "f", [a, b]).flags),
      );
      expect(nzcv(aMinusB.flags), `${a} ${b}`).toBe(
        nzcv(callText("f:\n  subs w2, w0, w1\n  ret\n", "f", [a, b]).flags),
      );
    }
  });

  it("gives other flags the other way round: 0xffffffff and 1 leave 0000 as b minus a and 1010 as a minus b", () => {
    expect(nzcv(callText("f:\n  cmp w1, w0\n  ret\n", "f", [MAX, 1]).flags)).toBe("0000");
    expect(nzcv(callText("f:\n  cmp w0, w1\n  ret\n", "f", [MAX, 1]).flags)).toBe("1010");
    expect(PROSE.motivation).toContain("its flags can differ");
  });
});

describe("steeper_s and steeper_u keep their recorded results", () => {
  it("return 1 and 4294967295 for 0xffffffff and 1, and 7 for 3 and 7", () => {
    const run = (p: { listing: string }, entry: string, args: readonly number[]) =>
      traceOf(p, { entry, args }).result.final.x[0];
    expect(run(STEEPER_S, "steeper_s", ARGS)).toBe(1n);
    expect(run(STEEPER_U, "steeper_u", ARGS)).toBe(4294967295n);
    expect(run(STEEPER_S, "steeper_s", [3, 7])).toBe(7n);
    expect(run(STEEPER_U, "steeper_u", [3, 7])).toBe(7n);
  });
});

describe("the three stages of steeper_s and steeper_u on 0xffffffff and 1", () => {
  const s = model(STEEPER_S, "steeper_s", ARGS);
  const u = model(STEEPER_U, "steeper_u", ARGS);

  it("compare: w0 is a, w1 is b, cmp w1, w0 is b minus a, NZCV 0000, and no register written", () => {
    for (const m of [s, u]) {
      expect(m.compare?.inputs).toEqual([
        { register: "w0", name: "a", value: MAX },
        { register: "w1", name: "b", value: 1 },
      ]);
      expect([
        m.compare?.instruction,
        m.compare?.first,
        m.compare?.sign,
        m.compare?.second,
      ]).toEqual(["cmp w1, w0", "b", "minus", "a"]);
      expect(nzcv(m.compare!.flagsAfter)).toBe("0000");
      expect(m.compare?.wrote).toEqual([]);
    }
  });

  it("condition: ge is yes (N = 0, V = 0) for steeper_s, and cs is no (C = 0) for steeper_u", () => {
    expect(s.condition?.condition).toMatchObject({
      name: "ge",
      holds: true,
      read: [
        { flag: "N", value: 0 },
        { flag: "V", value: 0 },
      ],
    });
    expect(u.condition?.condition).toMatchObject({
      name: "cs",
      holds: false,
      read: [{ flag: "C", value: 0 }],
    });
    expect(s.condition?.condition.row?.reads).toBe("N equals V");
    expect(u.condition?.condition.row?.reads).toBe("C is 1");
  });

  it("select: steeper_s chooses its first source, w1, and steeper_u its second, w0, and each ends with the function's result", () => {
    expect(s.select).toMatchObject({
      destination: "w0",
      whenYes: { register: "w1", value: 1 },
      whenNo: { register: "w0", value: MAX },
      chosen: "yes",
      after: 1,
      destinationIsSource: true,
    });
    expect(u.select).toMatchObject({ chosen: "no", after: MAX, destinationIsSource: true });
  });

  it("read ge and cs off the same flags, and the model gives ge yes and cs no", () => {
    const flags = s.compare!.flagsAfter;
    const [ge, cs] = readConditions(flags, ["ge", "cs"]);
    expect([ge?.holds, cs?.holds]).toEqual([true, false]);
    expect(nzcv(u.compare!.flagsAfter)).toBe(nzcv(flags));
  });

  it("agree with the run whichever of the two the learner looks at: the select ends with w0", () => {
    for (const [p, entry] of [
      [STEEPER_S, "steeper_s"],
      [STEEPER_U, "steeper_u"],
    ] as const) {
      const t = traceOf(p, { entry, args: ARGS });
      const m = selectModel(t, NAMES);
      expect(BigInt(m.select!.after)).toBe(BigInt.asUintN(32, t.result.final.x[0] ?? 0n));
    }
  });
});

describe("the stepper's panel for steeper_u with ge, on 0x80000000 and 1", () => {
  const m = selectModel(
    traceOf(STEEPER_U_GE, { entry: "steeper_u", args: SMALLEST_AND_ONE }),
    NAMES,
    ["cs"],
  );

  it("compares with NZCV 1001: ge reads N = 1, V = 1 and is yes; cs, on the same flags, reads C = 0 and is no", () => {
    expect(nzcv(m.compare!.flagsAfter)).toBe("1001");
    expect(m.condition?.condition).toMatchObject({
      name: "ge",
      holds: true,
      read: [
        { flag: "N", value: 1 },
        { flag: "V", value: 1 },
      ],
    });
    expect(m.condition?.also).toHaveLength(1);
    expect(m.condition?.also[0]).toMatchObject({
      name: "cs",
      holds: false,
      read: [{ flag: "C", value: 0 }],
    });
  });

  it("selects w1, which is 1, and the destination ends holding 1", () => {
    expect(m.select).toMatchObject({
      whenYes: { register: "w1", value: 1 },
      whenNo: { register: "w0", value: TOP },
      chosen: "yes",
      after: 1,
    });
  });

  it("shows the stages in the steps they happen: the compare is the first step, the select the second", () => {
    expect([m.compare?.step, m.condition?.step, m.select?.step]).toEqual([0, 1, 1]);
  });
});

describe("the panel beside the learner's own less_fuel", () => {
  const text = (body: string) => `less_fuel:\n${body}\n`;
  const calls = [
    [3, 7],
    [7, 3],
    [5, 5],
    [TOP, 1],
    [1, TOP],
  ] as const;
  const lesson = LESSONS.find((l) => l.id === "compare-and-choose")!;

  it("is offered the five tests of the challenge, read from the challenge's own cases", () => {
    const c = lesson.challenges.find((x) => x.id === "write-less-fuel")!;
    if (c.tests.kind !== "answers") throw new Error("answers");
    expect(c.tests.cases.map((t) => [Number(t.given["w0"]), Number(t.given["w1"])])).toEqual(
      calls.map((x) => [...x]),
    );
  });

  it("reads cmp w0, w1 as a minus b and csel w0, w0, w1, cc, and ends with the result of each call", () => {
    for (const [a, b] of calls) {
      const t = traceOf({ listing: text(LESS_FUEL_TEXT) }, { entry: "less_fuel", args: [a, b] });
      const m = selectModel(t, NAMES);
      expect([m.compare?.first, m.compare?.sign, m.compare?.second]).toEqual(["a", "minus", "b"]);
      expect(m.compare?.wrote).toEqual([]);
      expect(m.condition?.condition.name).toBe("cc");
      // cc is yes when a is lower than b, unsigned; the model's own cset says so.
      expect(m.condition?.condition.holds, `${a} ${b}`).toBe(a < b);
      expect(m.select?.chosen).toBe(a < b ? "yes" : "no");
      expect(m.select?.after).toBe(Math.min(a, b));
      expect(BigInt(m.select!.after)).toBe(BigInt.asUintN(32, t.result.final.x[0] ?? 0n));
    }
  });

  it("shows the signed condition lt answer yes for 0x80000000 and 1, as the signed order reads it", () => {
    const t = traceOf(
      { listing: text(LESS_FUEL_SIGNED_TEXT) },
      { entry: "less_fuel", args: [TOP, 1] },
    );
    const m = selectModel(t, NAMES);
    expect(m.condition?.condition).toMatchObject({ name: "lt", holds: true });
    expect(m.select?.after).toBe(TOP);
  });
});

describe("the last question of the lesson", () => {
  it("compares 2 and 0xfffffffe with NZCV 0000: gt is yes and keeps 2, hi is no and gets 0xfffffffe", () => {
    const run = (cond: string) =>
      callText(`f:\n  cmp w0, w1\n  csel w0, w0, w1, ${cond}\n  ret\n`, "f", [2, 0xfffffffe]);
    expect(nzcv(run("gt").flags)).toBe("0000");
    expect(run("gt").w0).toBe(2);
    expect(run("hi").w0).toBe(0xfffffffe);
    const [gt, hi] = readConditions(run("gt").flags, ["gt", "hi"]);
    expect([gt?.holds, hi?.holds]).toEqual([true, false]);
    // As signed, 2 is greater than −2; as unsigned, 2 is lower than 4294967294.
    expect(BigInt.asIntN(32, 0xfffffffen)).toBe(-2n);
    expect(PROSE.reflectionNote).toContain("2 is lower than 4294967294");
  });
});

describe("what the grader says for a failed less_fuel", () => {
  const c = LESSONS.find((l) => l.id === "compare-and-choose")!.challenges.find(
    (x) => x.id === "write-less-fuel",
  )!;
  const said = PROSE.lessFuelFeedback;
  const verdict = (text: string) => grade(c, { text });
  const details = (text: string) => verdict(text).failures.map((f) => [f.label, f.detail]);

  it("says the top bit when only the two calls with the top bit set fail, the signed condition's calls", () => {
    expect(details(LESS_FUEL_SIGNED_TEXT)).toEqual([
      ["less_fuel(0x80000000, 1)", quoted(said.topBit)],
      ["less_fuel(1, 0x80000000)", undefined],
    ]);
  });

  it("says the larger value comes back for the condition the wrong way round, once, and keeps the values for the rest", () => {
    // `hi` takes a when a is higher: the larger comes back for every unequal call.
    const larger = details("cmp w0, w1\ncsel w0, w0, w1, hi\nret");
    expect(larger.filter(([, d]) => d !== undefined)).toEqual([
      ["less_fuel(3, 7)", quoted(said.larger)],
    ]);
    expect(larger.map(([label]) => label)).toEqual([
      "less_fuel(3, 7)",
      "less_fuel(7, 3)",
      "less_fuel(0x80000000, 1)",
      "less_fuel(1, 0x80000000)",
    ]);
  });

  it("says the larger value for the starting point too, which returns a on every call", () => {
    expect(details(c.initial.text ?? "")[0]).toEqual(["less_fuel(7, 3)", quoted(said.larger)]);
  });

  it("says nothing of the equal-values sentence unless the equal call fails, which csel alone cannot make happen", () => {
    // Whichever source csel takes, equal values give the same value; a program that fails that call
    // returns something else altogether, such as w1 plus nothing: here, an early ret with w0 changed.
    const odd = details("cmp w0, w1\ncsel w0, w1, wzr, cc\nret");
    expect(odd.find(([label]) => label === "less_fuel(5, 5)")?.[1]).toBe(quoted(said.equal));
  });

  it("never says the value a test wanted, and says nothing of a program that passes", () => {
    expect(JSON.stringify(Object.values(said))).not.toMatch(/\d/);
    expect(verdict(LESS_FUEL_TEXT).failures).toEqual([]);
    expect(verdict(LESS_FUEL_TEXT).passed).toBe(true);
  });
});
