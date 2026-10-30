// Copyright © 2026 Christopher Snow

// Every number lesson 1 of Module 2 states, run on the model, and the one listing it shows, held to
// the recorded file. The lesson's words say 0x80000000, 2147483648 and −2147483648, and N 1, Z 0, C 0
// and V 1; this test says what the simulator gives, so a number cannot be right in the prose and
// wrong in the machine. The listing is held to docs/notes/module-2/listings.md (ARM64 GCC 16.1.0,
// -O1), and the lesson's own assembly to the differential test's corpus.

import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { additionSteps, bitAt, columnWork, parseListing, topCarries, traceOf } from "@al/views";
import { learnerText } from "@platform/lesson-schema";

import { LESSONS } from ".";
import { ADD_OVERFLOWS, PLUS, SUM_FLAGS } from "./adding-and-the-flags.listings";
import { PROSE } from "./adding-and-the-flags.prose";
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

const units = ["adding-and-the-flags", "flags-and-overflow"].map((id) =>
  LESSONS.find((l) => l.id === id)!,
);
const lesson = {
  ...units[0]!,
  sections: units.flatMap((unit) => unit.sections),
  challenges: units.flatMap((unit) => unit.challenges),
};

const plus = (a: number, b: number) => callText(assembly(PLUS.listing), "plus", [a, b]);
const signed = (v: number) => Number(BigInt.asIntN(32, BigInt(v)));

describe("the listing the lesson shows", () => {
  it("names the compiler and the setting the recorded file records", () => {
    expect(recorded).toContain("ARM64 GCC 16.1.0");
    expect(recorded).toContain("`-O1`");
    expect(PROSE.investigationDetails).toContain("GCC 16.1 with `-O1`");
  });

  it("shows add_overflows's C and instructions as recorded, C line numbers counted from the function", () => {
    const shown = shownFunction("add_overflows");
    expect(ADD_OVERFLOWS.c).toBe(shown.c);
    expect(parseListing(ADD_OVERFLOWS.listing)).toEqual(shown.listing);
  });

  it("puts the recorded instructions in the closed note, as the note quotes them", () => {
    const quoted = PROSE.investigationDetails
      .split("```")[1]!
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l !== "");
    const shown = shownFunction("add_overflows").listing.map((l) =>
      l.kind === "label" ? `${l.text}:` : l.text,
    );
    // The note quotes GCC's own spacing; compared by words, the lines are the recorded lines.
    expect(quoted.map((l) => l.replace(/\s+/g, " "))).toEqual(shown);
  });

  it("is run by GCC's __builtin_add_overflow listing exactly when V is set", () => {
    const text = assembly(ADD_OVERFLOWS.listing);
    const pairs = [
      [0x7fffffff, 1],
      [5, 3],
      [0x80000000, 0x80000000],
      [0x80000000, 0xffffffff],
      [0xffffffff, 1],
      [0x7ffffffe, 1],
      [0x7ffffffe, 2],
      [0, 0],
      [0x40000000, 0x40000000],
      [0x40000000, 0x3fffffff],
    ] as const;
    for (const [a, b] of pairs) {
      const returned = callText(text, "add_overflows", [a, b]).w0;
      const v = plus(a, b).flags.v;
      expect(returned, `${a} + ${b}`).toBe(v ? 1 : 0);
    }
    // And the two instructions before ret are the two the note describes.
    expect(functionIn(text, "add_overflows")).toEqual(["cmn w0, w1", "cset w0, vs", "ret"]);
  });
});

describe("0x7fffffff plus 1", () => {
  it("is 2147483647 plus 1, and the answer is 0x80000000", () => {
    expect(0x7fffffff).toBe(2147483647);
    expect(plus(0x7fffffff, 1).w0).toBe(0x80000000);
  });

  it("reads 2147483648 unsigned, which is right, and −2147483648 signed, which is wrong", () => {
    const { w0 } = plus(0x7fffffff, 1);
    expect(w0).toBe(2147483648);
    expect(signed(w0)).toBe(-2147483648);
    // Right unsigned: the sum of the two numbers is the answer. Wrong signed: it is not.
    expect(0x7fffffff + 1).toBe(w0);
    expect(2147483647 + 1).not.toBe(signed(w0));
    expect(2147483647 + 1).toBe(2147483648);
    // The signed reading cannot hold 2147483648: the largest it holds is 2147483647.
    expect(signed(0x7fffffff)).toBe(2147483647);
  });

  it("sets N 1, Z 0, C 0 and V 1", () => {
    expect(nzcv(plus(0x7fffffff, 1).flags)).toBe("1001");
  });

  it("carries through every column into the top bit, and nothing comes out of it", () => {
    const step = additionSteps(traceOf(PLUS, { entry: "plus", args: [0x7fffffff, 1] }))[0]!;
    const record = step.addition!;
    for (let column = 1; column <= 31; column++)
      expect(bitAt(record.carries, column), `into column ${column + 1}`).toBe(1);
    expect(bitAt(record.carries, 0)).toBe(0);
    expect(record.carryOut).toBe(0);
    expect(record.width).toBe(32);
  });
});

describe("module 1's pattern", () => {
  it("has 4294967284 and −12 as one pattern", () => {
    expect(BigInt.asUintN(32, -12n)).toBe(4294967284n);
    expect(BigInt.asIntN(32, 4294967284n)).toBe(-12n);
  });
});

describe("the three additions the challenge predicts", () => {
  const flagsOf = (a: number, b: number) => nzcv(plus(a, b).flags);

  it("give 0xffffffff plus 1: N 0, Z 1, C 1, V 0, and an answer of 0 with a carry out of the top bit", () => {
    expect(flagsOf(0xffffffff, 1)).toBe("0110");
    expect(plus(0xffffffff, 1).w0).toBe(0);
    const record = additionSteps(traceOf(PLUS, { entry: "plus", args: [0xffffffff, 1] }))[0]!
      .addition!;
    expect(record.carryOut).toBe(1);
  });

  it("give 5 plus 3 an answer of 8, with all four flags 0 and no carry reaching the top bit", () => {
    expect(plus(5, 3).w0).toBe(8);
    expect(flagsOf(5, 3)).toBe("0000");
    const record = additionSteps(traceOf(PLUS, { entry: "plus", args: [5, 3] }))[0]!.addition!;
    expect(bitAt(record.carries, 31)).toBe(0);
    expect(record.carryOut).toBe(0);
  });

  it("give 0x80000000 plus 0x80000000: N 0, Z 1, C 1, V 1", () => {
    expect(flagsOf(0x80000000, 0x80000000)).toBe("0111");
  });

  it("have one addition that sets both C and V, and one that sets only C", () => {
    const sets = [plus(0xffffffff, 1).flags, plus(5, 3).flags, plus(0x80000000, 0x80000000).flags];
    expect(sets.filter((f) => f.c && f.v)).toHaveLength(1);
    expect(sets.filter((f) => f.c && !f.v)).toHaveLength(1);
  });

  it("are the cases of the challenge, named as the prose names them", () => {
    const c = lesson.challenges.find((x) => x.id === "predict-flags")!;
    if (c.tests.kind !== "answers") throw new Error("answers");
    expect(c.tests.cases.map((t) => [t.label, t.given["w0"], t.given["w1"]])).toEqual([
      ["`0xffffffff` plus 1", 0xffffffff, 1],
      ["5 plus 3", 5, 3],
      ["`0x80000000` plus `0x80000000`", 0x80000000, 0x80000000],
    ]);
  });
});

describe("the failure experiment", () => {
  const CALL = [0x7fffffff, 1, 0xffffffff];
  const keeping = callText(assembly(SUM_FLAGS.listing), "sum_flags", CALL);
  const plusFlags = (a: number, b: number) => nzcv(plus(a, b).flags);

  it("runs an adds on 0xffffffff plus 0xffffffff, then an add on 0x7fffffff plus 1", () => {
    const steps = keeping.result.steps;
    expect(steps.map((s) => s.text)).toEqual(["adds w3, w2, w2", "add w0, w0, w1", "ret"]);
    // The adds: w3 is 0xfffffffe, N 1, Z 0, C 1, V 0. The add leaves the flags and ret too.
    expect(nzcv(steps[0]!.flagsBefore)).toBe("0000");
    expect(nzcv(steps[0]!.flagsAfter)).toBe("1010");
    expect(nzcv(steps[1]!.flagsAfter)).toBe("1010");
    expect(nzcv(steps[2]!.flagsAfter)).toBe("1010");
    expect(nzcv(keeping.flags)).toBe("1010");
    expect(keeping.result.final.x[3]).toBe(0xfffffffen);
  });

  it("gives w0 0x80000000 after the add, the answer of 0x7fffffff plus 1", () => {
    expect(keeping.w0).toBe(0x80000000);
    expect(keeping.w0).toBe(plus(0x7fffffff, 1).w0);
    expect(keeping.result.final.x[1]).toBe(1n);
    expect(keeping.result.final.x[2]).toBe(0xffffffffn);
  });

  it("tells leaving the flags from setting them and from clearing them: 1010, 1001 and 0000", () => {
    // Left alone: the adds' flags, N and C. Set by the add: the flags of its own addition, N and V.
    expect(plusFlags(0x7fffffff, 1)).toBe("1001");
    // Cleared: all four 0. The three outcomes are different.
    const outcomes = [nzcv(keeping.flags), plusFlags(0x7fffffff, 1), "0000"];
    expect(new Set(outcomes).size).toBe(3);
    // The adds' own addition is 0xffffffff plus 0xffffffff: N 1, Z 0, C 1, V 0.
    expect(plusFlags(0xffffffff, 0xffffffff)).toBe("1010");
  });

  it("uses none of the additions of the flags challenge", () => {
    const challenge = lesson.challenges.find((x) => x.id === "predict-flags")!;
    if (challenge.tests.kind !== "answers") throw new Error("answers");
    const additions = challenge.tests.cases.map((t) => [t.given["w0"], t.given["w1"]].join(","));
    for (const pair of ["2147483647,1", "4294967295,4294967295"])
      expect(additions, pair).not.toContain(pair);
    // The figure's call is the one tested here.
    const figure = lesson.sections
      .flatMap((s) => s.interactives)
      .find((x) => x.id === "predict-add-flags")!;
    expect(figure.props["call"]).toEqual({ entry: "sum_flags", args: CALL });
    expect(figure.props["inputs"]).toEqual([0, 1, 2]);
    expect(figure.props["measure"]).toEqual({ kind: "flags" });
  });

  it("leaves flags as it found them, whatever they were", () => {
    for (const start of [ALL_SET, { n: false, z: true, c: false, v: false }]) {
      const out = callText(assembly(SUM_FLAGS.listing), "sum_flags", CALL, start);
      // adds w3, w2, w2 rewrites the flags to 1010 whatever they were; the add keeps that.
      expect(nzcv(out.result.steps[0]!.flagsAfter)).toBe("1010");
      expect(nzcv(out.flags)).toBe("1010");
    }
    const only = callText("f:\n  add w0, w0, w1\n  ret\n", "f", [0x7fffffff, 1], ALL_SET);
    expect(nzcv(only.flags)).toBe("1111");
    const left = { n: true, z: false, c: true, v: false };
    const after = callText("f:\n  add w0, w0, w1\n  ret\n", "f", [0x7fffffff, 1], left);
    expect(nzcv(after.flags)).toBe("1010");
  });

  it("has the model pick the option N and C are still 1 (value c), not V", () => {
    const options = lesson.sections
      .flatMap((s) => s.interactives)
      .find((x) => x.id === "predict-add-flags")!.props["options"] as {
      value: string;
      label: string;
    }[];
    expect(options.map((o) => o.value).sort()).toEqual(["c", "error", "none", "v"]);
    // N 1, Z 0, C 1, V 0 is "c" for the prediction (C set, V clear).
    const [n, z, c, v] = nzcv(keeping.flags).split("").map(Number);
    expect([n, z, c, v]).toEqual([1, 0, 1, 0]);
    expect(options.find((o) => o.value === "c")!.label).toMatch(/N and C are still 1/);
  });

  it("finds that, of the instructions met so far, only adds records the four facts", () => {
    // add, sub, mov, movk and ret (Modules 0 and 1) leave the flags alone; adds sets them.
    const met: [string, string][] = [
      ["add w0, w0, w1", "add"],
      ["sub w0, w0, w1", "sub"],
      ["mov w0, 7", "mov"],
      ["mov w0, w1", "mov"],
      ["movk w0, 1, lsl 16", "movk"],
    ];
    for (const [line, name] of met) {
      const out = callText(`f:\n  ${line}\n  ret\n`, "f", [0x7fffffff, 1], ALL_SET);
      expect(nzcv(out.flags), name).toBe("1111");
    }
    const adds = callText("f:\n  adds w0, w0, w1\n  ret\n", "f", [0x7fffffff, 1], ALL_SET);
    expect(nzcv(adds.flags)).toBe("1001");
  });
});

describe("the figure after the flags challenge: 1 plus 0xffffffff", () => {
  const call = { entry: "plus", args: [1, 0xffffffff] };
  const addition = () => additionSteps(traceOf(PLUS, call))[0]!.addition!;

  it("is an answer of 0 with N 0, Z 1, C 1 and V 0", () => {
    expect(plus(1, 0xffffffff).w0).toBe(0);
    expect(nzcv(plus(1, 0xffffffff).flags)).toBe("0110");
  });

  it("carries through every column, into the top bit and out of it", () => {
    const record = addition();
    for (let column = 1; column <= 31; column++)
      expect(bitAt(record.carries, column), `into column ${column + 1}`).toBe(1);
    expect(bitAt(record.carries, 0)).toBe(0);
    expect(record.carryOut).toBe(1);
    expect(record.a).toBe(1n);
    expect(record.b).toBe(0xffffffffn);
    expect(record.result).toBe(0n);
  });

  it("is none of the three calls of the flags challenge, and opens only after that challenge", () => {
    const challenge = lesson.challenges.find((x) => x.id === "predict-flags")!;
    if (challenge.tests.kind !== "answers") throw new Error("answers");
    const calls = challenge.tests.cases.map((t) => [t.given["w0"], t.given["w1"]].join(","));
    expect(calls).not.toContain(call.args.join(","));
    const figure = lesson.sections
      .flatMap((s) => s.interactives)
      .find((x) => x.id === "add-carry-out")!;
    expect(figure.kind).toBe("adder");
    expect(figure.props["afterChallenge"]).toBe("predict-flags");
    expect(figure.props["call"]).toEqual(call);
    // The same flags as the challenge's first addition, with the operands the other way round.
    expect(nzcv(plus(0xffffffff, 1).flags)).toBe(nzcv(plus(1, 0xffffffff).flags));
  });

  it("is in the differential test's corpus, as a call of plus", () => {
    const json = JSON.parse(
      readFileSync(
        new URL("../../scripts/real-tools/corpus/module2-flags.json", import.meta.url),
        "utf8",
      ),
    ) as { calls: { entry: string; args: [string, number][] }[] };
    expect(
      json.calls.some(
        (c) => c.entry === "plus" && c.args[0]?.[0] === "1" && c.args[1]?.[0] === "4294967295",
      ),
    ).toBe(true);
  });
});

describe("the smallest overflow", () => {
  it("is made by 2: 0x7ffffffe plus 1 fits, and plus 2 does not", () => {
    expect(0x7ffffffe).toBe(2147483646);
    expect(plus(0x7ffffffe, 1).flags.v).toBe(false);
    expect(plus(0x7ffffffe, 2).flags.v).toBe(true);
    expect(nzcv(plus(0x7fffffff, 1).flags)[3]).toBe("1");
  });

  it("is not about C: the unsigned answer fits for these small numbers", () => {
    for (const n of [1, 2, 3, 100, 0x7fffffff - 0x7ffffffe + 5])
      expect(plus(0x7ffffffe, n).flags.c, `${n}`).toBe(false);
  });
});

describe("the programs the lesson wrote itself", () => {
  it("are the programs the differential test runs against QEMU", () => {
    const corpus = corpusText("module2-flags");
    expect(functionIn(corpus, "plus")).toEqual(functionIn(assembly(PLUS.listing), "plus"));
    expect(functionIn(corpus, "sum_flags")).toEqual(
      functionIn(assembly(SUM_FLAGS.listing), "sum_flags"),
    );
  });

  it("and GCC's add_overflows is in that test too, as recorded", () => {
    expect(functionIn(corpusText("module2-gcc"), "add_overflows")).toEqual(
      functionIn(assembly(ADD_OVERFLOWS.listing), "add_overflows"),
    );
  });
});

describe("the carries into and out of bit 31, for each addition the lesson names", () => {
  const record = (a: number, b: number) =>
    additionSteps(traceOf(PLUS, { entry: "plus", args: [a, b] }))[0]!.addition!;

  it.each([
    ["0x7fffffff plus 1", 0x7fffffff, 1, { into: 1, out: 0 }, "1001"],
    ["0xffffffff plus 1", 0xffffffff, 1, { into: 1, out: 1 }, "0110"],
    ["5 plus 3", 5, 3, { into: 0, out: 0 }, "0000"],
    ["0x80000000 plus 0x80000000", 0x80000000, 0x80000000, { into: 0, out: 1 }, "0111"],
    ["0xc0000000 plus 0xc0000000", 0xc0000000, 0xc0000000, { into: 1, out: 1 }, "1010"],
  ] as const)(
    "%s: the carry into bit 31 is %j, and the flags are %s",
    (_, a, b, carries, flags) => {
      expect(topCarries(record(a, b))).toEqual(carries);
      expect(nzcv(plus(a, b).flags)).toBe(flags);
    },
  );

  it("makes C the carry out of bit 31 and V 1 exactly when the two carries differ, for any addition", () => {
    const values = [
      0, 1, 5, 3, 0x40000000, 0x7ffffffe, 0x7fffffff, 0x80000000, 0xc0000000, 0xffffffff,
    ];
    for (const a of values)
      for (const b of values) {
        const { into, out } = topCarries(record(a, b));
        const { flags } = plus(a, b);
        expect(flags.c, `${a} + ${b}`).toBe(out === 1);
        expect(flags.v, `${a} + ${b}`).toBe(into !== out);
        // N is the top bit of the 32-bit result, and Z is 1 when all 32 result bits are 0.
        expect(flags.n, `${a} + ${b}`).toBe(plus(a, b).w0 >= 0x80000000);
        expect(flags.z, `${a} + ${b}`).toBe(plus(a, b).w0 === 0);
      }
  });

  it("has a column total of 0, 1, 2 or 3 in every column, with the lowest bit kept and the other carried", () => {
    const seen = new Set<number>();
    for (const [a, b] of [
      [0x7fffffff, 1],
      [0xffffffff, 1],
      [0x80000000, 0x80000000],
      [0xffffffff, 0xffffffff],
    ] as const) {
      const rec = record(a, b);
      for (let column = 0; column < 32; column++) {
        const work = columnWork(rec, column);
        seen.add(work.total);
        expect([0, 1, 2, 3]).toContain(work.total);
        expect(work.kept).toBe(work.total % 2);
        expect(work.carryOut).toBe(Math.floor(work.total / 2));
      }
    }
    expect([...seen].sort()).toEqual([0, 1, 2, 3]);
  });

  it("is a 32-bit addition: the top bit is bit 31, which the figure labels", () => {
    expect(record(1, 1).width).toBe(32);
  });
});

describe("0xc0000000 plus 0xc0000000, the question of the last section", () => {
  it("gives 0x80000000 with C 1 and V 0: the unsigned result does not fit, the signed one does", () => {
    const out = plus(0xc0000000, 0xc0000000);
    expect(out.w0).toBe(0x80000000);
    expect(out.flags.c).toBe(true);
    expect(out.flags.v).toBe(false);
    expect(signed(0xc0000000)).toBe(-1073741824);
    expect(signed(0xc0000000) + signed(0xc0000000)).toBe(-2147483648);
    expect(signed(out.w0)).toBe(-2147483648);
    // The signed sum is in range, so the signed result fits; the unsigned sum is over 2^32.
    expect(0xc0000000 + 0xc0000000).toBeGreaterThanOrEqual(2 ** 32);
    expect(PROSE.reflectionAnswer).toContain("−1073741824 plus −1073741824 is −2147483648");
  });
});

describe("the additions of the improved text are in the differential test's corpus", () => {
  it("includes 0xc0000000 plus 0xc0000000, the question of the last section", () => {
    const json = JSON.parse(
      readFileSync(
        new URL("../../scripts/real-tools/corpus/module2-flags.json", import.meta.url),
        "utf8",
      ),
    ) as { calls: { entry: string; args: [string, number][] }[] };
    expect(
      json.calls.some(
        (c) =>
          c.entry === "plus" &&
          c.args[0]?.[0] === String(0xc0000000) &&
          c.args[1]?.[0] === String(0xc0000000),
      ),
    ).toBe(true);
  });
});

describe("what the three sentences after the flags challenge say", () => {
  it("are true of the three additions they name", () => {
    // C and V, as the two digits the model gives after N and Z.
    const cv = (a: number, b: number) => nzcv(plus(a, b).flags).slice(2);
    // 0xffffffff plus 1 carries into bit 31 and out of it: C 1, V 0.
    expect(cv(0xffffffff, 1)).toBe("10");
    // 0x7fffffff plus 1 carries into bit 31 but not out: C 0, V 1.
    expect(cv(0x7fffffff, 1)).toBe("01");
    // 0x80000000 plus 0x80000000 makes C and V both 1.
    expect(cv(0x80000000, 0x80000000)).toBe("11");
  });
});

describe("the numbers the improved text states", () => {
  const stated = statedNumbers([
    ...learnerText(lesson),
    ...lesson.challenges.flatMap((c) => c.fields.map((f) => f.label)),
  ]);
  const reflection = lesson.sections.find((section) => section.kind === "reflection")!;

  it("are each a result of the model, an argument of a call, a count of bits or the recorded compiler's version", () => {
    const decimal = new Map<number, string>([
      [0, "a flag, a bit or a total of a column"],
      [1, "an argument, a flag, a bit or a total"],
      [2, "a total of a column, and the smallest overflow"],
      [3, "the largest total of a column, and an argument"],
      [5, "an argument of 5 plus 3"],
      [8, "5 plus 3"],
      [16.1, "the compiler's version"],
      [31, "the top bit"],
      [32, "the bits of a register"],
      [1073741824, "the size of 0xc0000000 read as signed"],
      [2147483646, "0x7ffffffe, read as unsigned"],
      [2147483647, "0x7fffffff, read as unsigned"],
      [2147483648, "0x80000000, read as unsigned"],
    ]);
    expect(stated.decimal.filter((n) => !decimal.has(n))).toEqual([]);
    expect(stated.binary).toEqual([]);
    const hexes = new Set([
      "0x7fffffff",
      "0x00000001",
      "0x80000000",
      "0xffffffff",
      "0xc0000000",
      "0x7ffffffe",
    ]);
    expect(stated.hex.filter((h) => !hexes.has(h))).toEqual([]);
  });

  it("agrees with the model on each: 5 plus 3 is 8, the signed readings, and the compiler's version", () => {
    expect(plus(5, 3).w0).toBe(8);
    expect(signed(0xc0000000)).toBe(-1073741824);
    expect(signed(0x80000000)).toBe(-2147483648);
    expect(signed(0x7fffffff)).toBe(2147483647);
    expect(signed(0x7ffffffe)).toBe(2147483646);
    expect(0x7ffffffe).toBe(2147483646);
    expect(recorded).toContain("ARM64 GCC 16.1.0");
    // 2147483647 plus 1 is 2147483648 as an unsigned number.
    expect(0x7fffffff + 1).toBe(2147483648);
    expect(reflection.details?.prose).toContain("0x80000000");
  });

  it("holds the three additions' hexadecimal arguments to the calls of the challenge", () => {
    const c = lesson.challenges.find((x) => x.id === "predict-flags")!;
    if (c.tests.kind !== "answers") throw new Error("answers");
    expect(c.tests.cases.map((t) => [t.given["w0"], t.given["w1"]])).toEqual([
      [0xffffffff, 1],
      [5, 3],
      [0x80000000, 0x80000000],
    ]);
  });
});
