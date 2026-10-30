// Copyright © 2026 Christopher Snow

// What lesson 2 of Module 4 shows about a run through branches, taken from the trace: the path of
// each run, whether each branch to a label was taken, not taken or not reached, the targets, the
// counts (labels are not instructions, and `ret` counts), `ret` as no branch to a label, the sentence
// after a step that ran a branch, and the two conditions read off the flags of `bge`'s compare. Every
// value is what the steps of the run record; none is a number of the lesson's.

import { describe, expect, it } from "vitest";

import {
  BRANCH_STRINGS as B,
  branchArrows,
  branchStatusAt,
  goesToLabel,
  grade,
  outcomeOf,
  pathOf,
  quoted,
  traceOf,
  twoConditions,
  viewAt,
} from "@al/views";

import { LESSONS } from ".";
import {
  DESCRIBE,
  DESCRIBE_BGE,
  FUEL_WARNING_SHARED_RET_TEXT,
  FUEL_WARNING_STARTING_TEXT,
  FUEL_WARNING_TEXT,
  SERVICE,
} from "./branches.listings";
import { PROSE } from "./branches.prose";
import { assembly, callText, corpusText, functionIn, nzcv } from "./module-4.runs";

const units = ["branches", "zero-and-threshold-branches", "register-and-bit-branches"].map((id) =>
  LESSONS.find((l) => l.id === id)!,
);
const lesson = {
  ...units[0]!,
  sections: units.flatMap((unit) => unit.sections),
  challenges: units.flatMap((unit) => unit.challenges),
};
const challenge = (id: string) => lesson.challenges.find((c) => c.id === id)!;
const neg = (n: number) => Number(BigInt.asUintN(32, BigInt(n)));
const run = (g: number, program = DESCRIBE) =>
  traceOf(program, { entry: "describe", args: [neg(g)] });

describe("the path of describe for 15, 10, -15 and 0, from the trace", () => {
  const cases = [
    {
      g: 15,
      path: ["cmp w0, 10", "bgt .L9", "mov w0, 2", "b .L7", "ret"],
      outcomes: [null, "taken", null, "taken", null],
      returned: 2,
    },
    {
      g: 10,
      path: ["cmp w0, 10", "bgt .L9", "cmn w0, #10", "mov w0, -2", "csel w0, w0, wzr, lt", "ret"],
      outcomes: [null, "not taken", null, null, null, null],
      returned: 0,
    },
    {
      g: -15,
      path: ["cmp w0, 10", "bgt .L9", "cmn w0, #10", "mov w0, -2", "csel w0, w0, wzr, lt", "ret"],
      outcomes: [null, "not taken", null, null, null, null],
      returned: -2,
    },
    {
      g: 0,
      path: ["cmp w0, 10", "bgt .L9", "cmn w0, #10", "mov w0, -2", "csel w0, w0, wzr, lt", "ret"],
      outcomes: [null, "not taken", null, null, null, null],
      returned: 0,
    },
  ];

  it.each(cases)(
    "runs %# in the instructions the trace records, with each branch's outcome",
    (c) => {
      const t = run(c.g);
      const path = pathOf(t);
      expect(path.map((p) => p.text)).toEqual(c.path);
      expect(
        path.map((p) => (p.branch === null ? null : p.branch.taken ? "taken" : "not taken")),
      ).toEqual(c.outcomes);
      expect(t.result.steps).toHaveLength(c.path.length);
      expect(Number(BigInt.asIntN(32, t.result.final.x[0] ?? 0n))).toBe(c.returned);
    },
  );

  it("counts 5, 6, 6 and 6 instructions, ret included, and never counts a label", () => {
    expect(cases.map((c) => run(c.g).result.steps.length)).toEqual([5, 6, 6, 6]);
    const labels = DESCRIBE.listing.split("\n").filter((l) => /^\.?\w+:$/.test(l.trim()));
    expect(labels.map((l) => l.trim())).toEqual(["describe:", ".L7:", ".L9:"]);
    // Eleven lines, eight instructions: the trace's lines include the labels, the steps do not.
    expect(run(15).lines).toHaveLength(11);
    expect(run(15).program.instructions).toHaveLength(8);
  });

  it("takes bgt's target and b's from the trace: the instruction under the label named", () => {
    const t = run(15);
    const steps = t.result.steps;
    const at = (text: string) => steps.find((s) => s.text.replace(/\s+/g, " ") === text)!;
    const underL9 = t.program.instructions.find(
      (i) => i.text.replace(/\s+/g, " ") === "mov w0, 2",
    )!;
    const underL7 = t.program.instructions.find((i) => i.text.trim() === "ret")!;
    expect(at("bgt .L9").branch).toEqual({ taken: true, target: underL9.address });
    expect(at("bgt .L9").nextPc).toBe(underL9.address);
    expect(at("b .L7").branch).toEqual({ taken: true, target: underL7.address });
    // The arrows join each branch to the label's line, from the program the model assembled.
    expect(branchArrows(t).map((a) => [a.label, t.lines[a.from]?.kind, t.lines[a.to]])).toEqual([
      [".L9", "instruction", { kind: "label", text: ".L9" }],
      [".L7", "instruction", { kind: "label", text: ".L7" }],
    ]);
  });

  it("tells taken, not taken and not reached apart: 15 takes both, 10 does not take bgt and never reaches b", () => {
    expect(branchArrows(run(15)).map((a) => a.state)).toEqual(["taken", "taken"]);
    expect(branchArrows(run(10)).map((a) => a.state)).toEqual(["not-taken", "not-run"]);
    expect(branchArrows(run(-15)).map((a) => a.state)).toEqual(["not-taken", "not-run"]);
    expect(branchArrows(run(0)).map((a) => a.state)).toEqual(["not-taken", "not-run"]);
  });

  it("never draws ret as a branch to a label, though the trace calls it a taken branch", () => {
    const t = run(15);
    const ret = t.result.steps.at(-1)!;
    expect(ret.text.trim()).toBe("ret");
    expect(ret.branch?.taken).toBe(true);
    const ins = t.program.instructions.find((i) => i.address === ret.address)!;
    expect(goesToLabel(ins)).toBe(false);
    expect(outcomeOf(t, ret)).toBeNull();
    expect(branchArrows(t)).toHaveLength(2);
  });

  it("marks the entry as the first instruction under describe:", () => {
    const t = run(15);
    expect(t.lines[t.lineAt.get(t.result.initial.pc) ?? -1]).toEqual({
      kind: "instruction",
      text: "cmp w0, 10",
      cLine: 3,
      sourceLines: [3],
    });
  });
});

describe("with bge for bgt, describe(10) takes the branch", () => {
  const t = run(10, DESCRIBE_BGE);

  it("returns 2 in five instructions, the branch taken", () => {
    expect(t.result.steps).toHaveLength(5);
    expect(Number(BigInt.asIntN(32, t.result.final.x[0] ?? 0n))).toBe(2);
    expect(pathOf(t).map((p) => p.branch?.taken ?? null)).toEqual([null, true, null, true, null]);
  });

  it("reads the flags NZCV 0110 with gt as no (Z = 1) and ge as yes (N = 0, V = 0), and names bge as the one used", () => {
    const two = twoConditions(t, ["gt", "ge"])!;
    expect(nzcv(two.flagsAfter)).toBe("0110");
    expect(
      two.conditions.map((c) => [c.name, c.holds, c.read.map((r) => `${r.flag} = ${r.value}`)]),
    ).toEqual([
      ["gt", false, ["N = 0", "Z = 1", "V = 0"]],
      ["ge", true, ["N = 0", "V = 0"]],
    ]);
    expect(two.used).toEqual({ condition: "ge", instruction: "bge .L9" });
    // GCC's bgt reads the same flags and is not taken.
    expect(run(10).result.steps[1]!.branch?.taken).toBe(false);
  });
});

describe("the sentence after a step that ran a branch", () => {
  const status = (g: number, k: number, program = DESCRIBE) => {
    const t = run(g, program);
    return branchStatusAt(t, viewAt(t, k));
  };

  it("says taken, and what runs next and where, for bgt on 15", () => {
    expect(status(15, 2)).toBe("`bgt .L9` was taken. Next: `mov w0, 2` at `.L9`.");
    expect(status(15, 2)).toBe(B.status.taken("bgt .L9", "mov w0, 2", ".L9"));
  });

  it("says not taken, and what runs next, for bgt on 10", () => {
    expect(status(10, 2)).toBe("`bgt .L9` was not taken. Next: `cmn w0, #10`.");
  });

  it("says b always goes to its label, and what runs next", () => {
    expect(status(15, 4)).toBe("`b .L7` always goes to `.L7`. Next: `ret`.");
  });

  it("says nothing for the steps that ran no branch, and nothing for ret", () => {
    expect(status(15, 0)).toBeNull();
    expect(status(15, 1)).toBeNull();
    expect(status(15, 3)).toBeNull();
    expect(status(15, 5)).toBeNull();
  });

  it("takes taken or not taken from branch.taken and the next instruction from nextPc", () => {
    for (const g of [15, 10, -15, 0, 11, -10, -11]) {
      const t = run(g);
      t.result.steps.forEach((step, i) => {
        const said = branchStatusAt(t, viewAt(t, i + 1));
        const outcome = outcomeOf(t, step);
        if (outcome === null) return expect(said).toBeNull();
        const next = t.lines[t.lineAt.get(step.nextPc) ?? -1];
        expect(said, `${g} step ${i}`).toContain(
          `Next: \`${next?.kind === "instruction" ? next.text : ""}\``,
        );
        if (outcome.conditional)
          expect(said).toContain(outcome.taken ? "was taken" : "was not taken");
      });
    }
  });

  it("says it for tbz, a branch that tests a register: service(0x28) takes tbz to .Lno", () => {
    const t = traceOf(SERVICE, { entry: "service", args: [0x28] });
    expect(branchStatusAt(t, viewAt(t, 1))).toBe(
      "`tbz w0, 1, .Lno` was taken. Next: `mov w0, 0` at `.Lno`.",
    );
    const u = traceOf(SERVICE, { entry: "service", args: [0x2a] });
    expect(branchStatusAt(u, viewAt(u, 1))).toBe(
      "`tbz w0, 1, .Lno` was not taken. Next: `mov w0, 1`.",
    );
  });
});

describe("fuel_warning: other solutions pass", () => {
  const c = challenge("write-fuel-warning");
  /**
   * Other orders and spellings of the same three outcomes, each with the check for 0 first. The
   * three after the first are in the differential test's corpus (`module4-fuel-warning-alt.s`), and
   * their labels are the learner's own: any name works.
   */
  const others: [string, string, string | null][] = [
    ["the shared ret", FUEL_WARNING_SHARED_RET_TEXT, null],
    [
      "the empty case last in the file, and b.lo for b.cc",
      [
        "cbz w0, .Lempty_c",
        "cmp w0, w1",
        "b.lo .Llow_c",
        "mov w0, 0",
        "ret",
        ".Lempty_c:",
        "mov w0, 2",
        "ret",
        ".Llow_c:",
        "mov w0, 1",
        "ret",
      ].join("\n"),
      "fuel_warning_c",
    ],
    [
      "the compare first, then cbz (which neither reads nor changes the flags)",
      [
        "cmp w0, w1",
        "cbz w0, .Lzero_d",
        "b.cs .Lenough_d",
        "mov w0, 1",
        "ret",
        ".Lenough_d:",
        "mov w0, 0",
        "ret",
        ".Lzero_d:",
        "mov w0, 2",
        "ret",
      ].join("\n"),
      "fuel_warning_d",
    ],
    [
      "b over the empty case, with the compare the other way round and b.hi",
      [
        "cbz w0, .Lnone_e",
        "cmp w1, w0",
        "b.hi .Lshort_e",
        "mov w0, 0",
        "b .Lend_e",
        ".Lshort_e:",
        "mov w0, 1",
        "b .Lend_e",
        ".Lnone_e:",
        "mov w0, 2",
        ".Lend_e:",
        "ret",
      ].join("\n"),
      "fuel_warning_e",
    ],
  ];

  it.each(others)("passes all five calls: %s", (_name, text) => {
    const verdict = grade(c, { text });
    expect(verdict.blocked).toBeUndefined();
    expect(verdict.failures).toEqual([]);
    expect(verdict.passed).toBe(true);
  });

  it("and so does the reference; the starting point does not", () => {
    expect(grade(c, c.reference).passed).toBe(true);
    expect(grade(c, { text: FUEL_WARNING_STARTING_TEXT }).passed).toBe(false);
  });

  it("run each of them to the same results the reference gives, for calls other than the five", () => {
    const ref = assembly(`fuel_warning:\n${FUEL_WARNING_TEXT}\n`);
    for (const [name, text] of others) {
      const alt = assembly(`fuel_warning:\n${text}\n`);
      for (const [l, r] of [
        [0, 0],
        [0, 1],
        [1, 1],
        [1, 0],
        [0x7fffffff, 0x80000000],
        [0x80000000, 0x7fffffff],
        [0xffffffff, 0],
        [0xffffffff, 0xffffffff],
      ] as const)
        expect(callText(alt, "fuel_warning", [l, r]).w0, `${name} ${l} ${r}`).toBe(
          callText(ref, "fuel_warning", [l, r]).w0,
        );
    }
  });

  it("are in the differential test's corpus", () => {
    const alt = corpusText("module4-fuel-warning-alt");
    for (const [, text, name] of others)
      if (name !== null)
        expect(functionIn(alt, name), name).toEqual(
          functionIn(assembly(`${name}:\n${text}\n`), name),
        );
    // The shared-ret order is in the corpus already.
    expect(functionIn(corpusText("module4-fuel-warning-b"), "fuel_warning")).toEqual(
      functionIn(assembly(`fuel_warning:\n${FUEL_WARNING_SHARED_RET_TEXT}\n`), "fuel_warning"),
    );
  });
});

describe("what the graders say for a failed call", () => {
  const warning = challenge("write-fuel-warning");
  const counts = challenge("count-describe-runs");
  const said = PROSE.fuelWarningFeedback;
  const details = (text: string) => grade(warning, { text }).failures.map((f) => f.detail);

  it("says the check for 0 comes first when a litres of 0 returned 1", () => {
    const swapped = [
      "cmp w0, w1",
      "b.cc .Llow",
      "cbz w0, .Lempty",
      "mov w0, 0",
      "ret",
      ".Llow:",
      "mov w0, 1",
      "ret",
      ".Lempty:",
      "mov w0, 2",
      "ret",
    ].join("\n");
    expect(details(swapped)).toEqual([quoted(said.zeroFirst)]);
  });

  describe("a litres of 0 that returned 1", () => {
    const wrongOrder = [
      "cmp w0, w1",
      "b.cc .Llow",
      "cbz w0, .Lempty",
      "mov w0, 0",
      "ret",
      ".Llow:",
      "mov w0, 1",
      "ret",
      ".Lempty:",
      "mov w0, 2",
      "ret",
    ].join("\n");
    // The check for 0 is first, and the block under `.Lempty` has no `ret`: the run goes on into `.Llow`.
    const missingRet = [
      "cbz w0, .Lempty",
      "cmp w0, w1",
      "b.cc .Llow",
      "mov w0, 0",
      "ret",
      ".Lempty:",
      "mov w0, 2",
      ".Llow:",
      "mov w0, 1",
      "ret",
    ].join("\n");
    // The same, with the test of 0 made by `cmp` and `b.eq`.
    const missingRetEq = [
      "cmp w0, 0",
      "b.eq .Lempty",
      "cmp w0, w1",
      "b.cc .Llow",
      "mov w0, 0",
      "ret",
      ".Lempty:",
      "mov w0, 2",
      ".Llow:",
      "mov w0, 1",
      "ret",
    ].join("\n");
    // The order is wrong with the test of 0 made by `cmp` and `b.eq`.
    const wrongOrderEq = [
      "cmp w0, w1",
      "b.cc .Llow",
      "cmp w0, 0",
      "b.eq .Lempty",
      "mov w0, 0",
      "ret",
      ".Llow:",
      "mov w0, 1",
      "ret",
      ".Lempty:",
      "mov w0, 2",
      "ret",
    ].join("\n");
    // Right order, shared `ret`, and the wrong value for 0. The block for 0 falls into the `ret` that
    // two other blocks branch to, which is a right layout.
    const sharedRetWrongValue = [
      "cbz w0, .Lempty",
      "cmp w0, w1",
      "b.cs .Lok",
      "mov w0, 1",
      "b .Ldone",
      ".Lok:",
      "mov w0, 0",
      "b .Ldone",
      ".Lempty:",
      "mov w0, 1",
      ".Ldone:",
      "ret",
    ].join("\n");
    // Right order and right values, and a `ret` for the block of 0, but the value 1 comes from there.
    const wrongValueWithRet = FUEL_WARNING_TEXT.replace("mov w0, 2", "mov w0, 1");

    it("says the run went on into the next block when the test of 0 was taken and a block has no ret", () => {
      expect(details(missingRet)).toEqual([quoted(said.fellThrough)]);
      expect(details(missingRetEq)).toEqual([quoted(said.fellThrough)]);
    });

    it("does not say the check for 0 comes first when it does: that was not the fault", () => {
      for (const text of [missingRet, missingRetEq])
        expect(details(text)).not.toContain(quoted(said.zeroFirst));
    });

    it("still says the check for 0 comes first when the run took no branch for the test of 0", () => {
      expect(details(wrongOrder)).toEqual([quoted(said.zeroFirst)]);
      expect(details(wrongOrderEq)).toEqual([quoted(said.zeroFirst)]);
    });

    it("says neither when the run went into a shared ret, which is right, and the value was wrong", () => {
      expect(grade(warning, { text: FUEL_WARNING_SHARED_RET_TEXT }).passed).toBe(true);
      expect(details(sharedRetWrongValue)).toEqual([quoted(said.label)]);
      expect(details(wrongValueWithRet)).toEqual([quoted(said.label)]);
    });

    it("says the one sentence once, and never the value a test wanted", () => {
      expect(said.fellThrough).not.toMatch(/\bexpected\b/);
      const found = details(missingRet).filter((d) => d === quoted(said.fellThrough));
      expect(found).toHaveLength(1);
      expect(said.fellThrough).not.toContain("returns 2");
    });
  });

  it("says is below read as unsigned when only the call with the top bit set fails, and it returned 1", () => {
    const signed = FUEL_WARNING_TEXT.replace("b.cc", "b.lt");
    expect(details(signed)).toEqual([quoted(said.topBit)]);
  });

  it("says which label the run reached for any other wrong value", () => {
    const strict = FUEL_WARNING_TEXT.replace("b.cc", "b.ls");
    // b.ls sends litres equal to reserve to .Llow: the wrong value comes back.
    expect(details(strict)).toEqual([quoted(said.label)]);
  });

  it("says an input was overwritten when a mov into w0 ran before a later test", () => {
    const moved = [
      "mov w0, 0",
      "cbz w0, .Lempty",
      "cmp w0, w1",
      "b.cc .Llow",
      "ret",
      ".Llow:",
      "mov w0, 1",
      "ret",
      ".Lempty:",
      "mov w0, 2",
      "ret",
    ].join("\n");
    const found = details(moved);
    expect(found).toContain(quoted(said.overwritten));
  });

  it("never says the value a test wanted, and says each sentence once", () => {
    const starting = grade(warning, { text: FUEL_WARNING_STARTING_TEXT });
    expect(starting.failures.map((f) => f.label)).toEqual([
      "fuel_warning(0, 10)",
      "fuel_warning(9, 10)",
    ]);
    expect(starting.failures.map((f) => f.detail)).toEqual([quoted(said.label), undefined]);
    for (const sentence of Object.values(said)) expect(sentence).not.toMatch(/\bexpected\b/);
  });

  it("tells a wrong count where to look, and a wrong result nothing it did not before", () => {
    const right = counts.reference.answers!;
    const wrongSteps = grade(counts, { answers: { ...right, steps11: "6" } });
    expect(wrongSteps.failures.map((f) => f.detail)).toEqual([PROSE.countsFeedback]);
    const wrongResult = grade(counts, { answers: { ...right, result11: "0" } });
    expect(wrongResult.failures.map((f) => f.detail)).toEqual([
      "Your answer for ‘describe(11) returns’ is not right.",
    ]);
    expect(JSON.stringify(wrongSteps)).not.toContain('"5"');
  });
});

describe("the last question of the lesson: service given 0x29", () => {
  const t = traceOf(SERVICE, { entry: "service", args: [0x29] });

  it("takes tbz, runs tbz, mov w0, 0 and ret, three instructions, and returns 0", () => {
    expect(t.result.steps.map((s) => s.text.replace(/\s+/g, " "))).toEqual([
      "tbz w0, 1, .Lno",
      "mov w0, 0",
      "ret",
    ]);
    expect(t.result.steps[0]!.branch?.taken).toBe(true);
    expect(t.result.final.x[0]).toBe(0n);
    expect(t.result.steps).toHaveLength(3);
  });

  it("is 0010 1001, with bit 1 clear, and .Lno: is a label, which is not counted", () => {
    expect((0x29).toString(2).padStart(8, "0")).toBe("00101001");
    expect((0x29 >> 1) & 1).toBe(0);
    expect(PROSE.reflectionNote).toContain("`0x29` is `0010 1001`");
    expect(t.lines.filter((l) => l.kind === "label")).toHaveLength(2);
    expect(t.program.instructions).toHaveLength(5);
  });
});
