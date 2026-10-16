// Copyright © 2026 Christopher Snow

// Every number lesson 1 of Module 2 states, run on the model, and the one listing it shows, held to
// the recorded file. The lesson's words say 0x80000000, 2147483648 and −2147483648, and N 1, Z 0, C 0
// and V 1; this test says what the simulator gives, so a number cannot be right in the prose and
// wrong in the machine. The listing is held to docs/notes/module-2/listings.md (ARM64 GCC 16.1.0,
// -O1), and the lesson's own assembly to the differential test's corpus.

import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { parseListing, traceOf, additionSteps, bitAt } from "@al/views";

import { LESSONS } from ".";
import { ADD_OVERFLOWS, PLUS, SUM_FLAGS } from "./adding-and-the-flags.listings";
import { PROSE } from "./adding-and-the-flags.prose";
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

const lesson = LESSONS.find((l) => l.id === "adding-and-the-flags")!;

const plus = (a: number, b: number) => callText(assembly(PLUS.listing), "plus", [a, b]);
const signed = (v: number) => Number(BigInt.asIntN(32, BigInt(v)));

describe("the listing the lesson shows", () => {
  it("names the compiler and the setting the recorded file records", () => {
    expect(recorded).toContain("ARM64 GCC 16.1.0");
    expect(recorded).toContain("`-O1`");
    expect(PROSE.investigationDetails).toContain("GCC 16.1 at `-O1`");
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
  const keeping = callText(assembly(SUM_FLAGS.listing), "sum_flags", [0x7fffffff, 1]);

  it("runs an adds that leaves N and V at 1, then an add that leaves them as they were", () => {
    const steps = keeping.result.steps;
    expect(steps.map((s) => s.text)).toEqual(["adds w2, w0, w1", "add w0, w0, w1", "ret"]);
    expect(nzcv(steps[0]!.flagsAfter)).toBe("1001");
    expect(nzcv(steps[1]!.flagsAfter)).toBe("1001");
    expect(nzcv(keeping.flags)).toBe("1001");
    // The adds put the answer in w2, which the add does not touch: w2 is 0x80000000.
    expect(keeping.result.final.x[2]).toBe(0x80000000n);
  });

  it("starts the adds from flags that are all clear, so the add is seen to leave a set flag", () => {
    expect(nzcv(keeping.result.steps[0]!.flagsBefore)).toBe("0000");
  });

  it("gives add the same answer as adds: 0x80000000", () => {
    expect(keeping.w0).toBe(0x80000000);
    expect(keeping.w0).toBe(plus(0x7fffffff, 1).w0);
  });

  it("leaves flags as it found them, whatever they were", () => {
    const set = callText(assembly(SUM_FLAGS.listing), "sum_flags", [0x7fffffff, 1], ALL_SET);
    // adds w2, w0, w1 rewrites the flags to 1001; add then leaves them. Starting from 1111, an add alone keeps 1111.
    expect(nzcv(set.result.steps[0]!.flagsAfter)).toBe("1001");
    expect(nzcv(set.flags)).toBe("1001");
    const only = callText("f:\n  add w0, w0, w1\n  ret\n", "f", [0x7fffffff, 1], ALL_SET);
    expect(nzcv(only.flags)).toBe("1111");
  });

  it("is not an add that clears the flags: an add from the flags the adds left keeps 1001", () => {
    const left = { n: true, z: false, c: false, v: true };
    const after = callText("f:\n  add w0, w0, w1\n  ret\n", "f", [0x7fffffff, 1], left);
    expect(nzcv(after.flags)).toBe("1001");
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
