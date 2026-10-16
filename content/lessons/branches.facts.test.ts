// Copyright © 2026 Christopher Snow

// Every number lesson 2 of Module 4 states, run on the model, and every listing it shows or
// describes, held to the recorded file. The lesson's words say five instructions, six instructions,
// NZCV 0010 and the rest; this test says what the simulator gives, so a number cannot be right in the
// prose and wrong in the machine. The listings are held to docs/notes/module-4/listings.md (ARM64
// GCC 16.1.0, -O1), and the lesson's own assembly to the differential test's corpus.

import { describe, expect, it } from "vitest";

import { parseListing, type ListingLine } from "@al/views";

import { LESSONS } from ".";
import {
  DESCRIBE,
  DESCRIBE_BGE,
  FUEL_WARNING_SHARED_RET_TEXT,
  FUEL_WARNING_STARTING_TEXT,
  FUEL_WARNING_TEXT,
  SERVICE,
  TOLD_GRADIENTS,
} from "./branches.listings";
import { PROSE } from "./branches.prose";
import { fencesOf, lessonBody, partOf } from "./module-4.prose-file";
import { RECORDED_C, listingOf, shownFunction } from "./module-4.recorded";
import {
  ALL_SET,
  assembly,
  callText,
  corpusText,
  functionIn,
  nzcv,
  recorded,
} from "./module-4.runs";

const lesson = LESSONS.find((l) => l.id === "branches")!;
const body = lessonBody(2);

const TOP = 0x80000000;
const neg = (n: number) => Number(BigInt.asUintN(32, BigInt(n)));

/** The whole recorded listing as the assembler reads it, with a stub for the `beep` it calls. */
const RECORDED_TEXT = (() => {
  const blocks = [...recorded.matchAll(/```(\w*)\n([\s\S]*?)```/g)];
  return assembly(blocks.find((m) => m[1] === "")![2] as string) + "beep:\n  ret\n";
})();
const DESCRIBE_TEXT = assembly(DESCRIBE.listing);
const BGE_TEXT = assembly(DESCRIBE_BGE.listing);

const describeRun = (g: number, text = DESCRIBE_TEXT) => callText(text, "describe", [neg(g)]);

/** The flags after the step that ran instruction `text` (the first such step). */
function flagsAfter(out: ReturnType<typeof callText>, text: string): string {
  const step = out.result.steps.find((s) => s.text.replace(/\s+/g, " ").startsWith(text));
  if (!step) throw new Error(`${text} did not run`);
  return nzcv(step.flagsAfter);
}

describe("the listings the lesson shows or describes", () => {
  it("name the compiler and the setting the recorded file records", () => {
    expect(recorded).toContain("ARM64 GCC 16.1.0");
    expect(recorded).toContain("`-O1`");
  });

  it("show describe's C and eight instructions as recorded, counted from the function", () => {
    const shown = shownFunction("describe", 8);
    expect(DESCRIBE.c).toBe(shown.c);
    expect(parseListing(DESCRIBE.listing)).toEqual(shown.listing);
    expect(shown.c.split("\n")).toEqual(RECORDED_C.slice(13, 21));
    expect(parseListing(DESCRIBE.listing).filter((l) => l.kind === "instruction")).toHaveLength(8);
  });

  it("have the C lines the lesson names: cmp and bgt beside the first if, return 2 beside mov and b", () => {
    const c = DESCRIBE.c.split("\n");
    const on = (n: number) => (c[n - 1] ?? "").trim();
    const tag = (text: string) =>
      (
        parseListing(DESCRIBE.listing).find((l) => l.kind === "instruction" && l.text === text) as
          (ListingLine & { cLine: number | null }) | undefined
      )?.cLine ?? -1;
    expect(on(tag("cmp w0, 10"))).toBe("if (gradient > 10)");
    expect(on(tag("bgt .L9"))).toBe("if (gradient > 10)");
    expect(on(tag("cmn w0, #10"))).toBe("return 0;");
    expect(on(tag("mov w0, -2"))).toBe("return 0;");
    expect(on(tag("csel w0, w0, wzr, lt"))).toBe("return 0;");
    expect(on(tag("ret"))).toBe("}");
    expect(on(tag("mov w0, 2"))).toBe("return 2;");
    expect(on(tag("b .L7"))).toBe("return 2;");
    // No instruction is recorded against the second if or against return -2.
    const used = new Set(
      parseListing(DESCRIBE.listing).flatMap((l) => (l.kind === "instruction" ? [l.cLine] : [])),
    );
    expect(on(5)).toBe("if (gradient < -10)");
    expect(on(6)).toBe("return -2;");
    expect(used.has(5)).toBe(false);
    expect(used.has(6)).toBe(false);
  });

  it("have two labels, .L7 and .L9, and two instructions that use them", () => {
    const lines = parseListing(DESCRIBE.listing);
    expect(
      lines.filter((l) => l.kind === "label" && l.text.startsWith(".")).map((l) => l.text),
    ).toEqual([".L7", ".L9"]);
    const users = lines.filter((l) => l.kind === "instruction" && /\.L[79]$/.test(l.text));
    expect(users.map((l) => l.text)).toEqual(["bgt .L9", "b .L7"]);
  });

  it("give every listing in the prose as recorded, or as the lesson's own", () => {
    const fences = Object.values(PROSE)
      .filter((v): v is string => typeof v === "string")
      .flatMap((p) => fencesOf(p))
      .filter((f) => f.lang === "")
      .map((f) => f.lines.join("\n"));
    const noTags = (ls: ListingLine[]) =>
      ls.map((l) => (l.kind === "label" ? l : { ...l, cLine: null }));
    const as = (text: string) => noTags(parseListing(text));
    const wanted = [
      noTags(listingOf("describe")),
      as(SERVICE.listing),
      // The excerpt: maybe_beep's first two instructions only.
      noTags(listingOf("maybe_beep").slice(0, 3)),
    ];
    expect(fences.map(as)).toEqual(wanted);
  });

  it("show the C of describe as recorded where the prose gives it", () => {
    const c = fencesOf(PROSE.question).find((f) => f.lang === "c")!;
    expect(c.lines).toEqual(RECORDED_C.slice(13, 21));
    // maybe_beep's C is recorded over five lines; the prose gives it on one, with the same tokens.
    const oneLine = RECORDED_C.slice(22, 27).join(" ").replace(/\s+/g, " ");
    expect(oneLine).toBe("void maybe_beep(unsigned litres) { if (litres == 0) beep(); }");
    expect(PROSE.explanation).toContain(oneLine);
  });
});

describe("describe(15), (10), (-15) and (0)", () => {
  it("run 5, 6, 6 and 6 instructions, ret included, and return 2, 0, -2 and 0", () => {
    expect(describeRun(15).steps).toBe(5);
    expect(describeRun(15).int).toBe(2);
    expect(describeRun(10).steps).toBe(6);
    expect(describeRun(10).int).toBe(0);
    expect(describeRun(-15).steps).toBe(6);
    expect(describeRun(-15).int).toBe(-2);
    expect(describeRun(-15).w0).toBe(0xfffffffe);
    expect(describeRun(0).steps).toBe(6);
    expect(describeRun(0).int).toBe(0);
  });

  it("run, for 15, cmp w0, 10; bgt .L9; mov w0, 2; b .L7; ret, and skip cmn, mov w0, -2 and csel", () => {
    const texts = describeRun(15).result.steps.map((s) => s.text.replace(/\s+/g, " "));
    expect(texts).toEqual(["cmp w0, 10", "bgt .L9", "mov w0, 2", "b .L7", "ret"]);
  });

  it("run, for 10, cmn, mov and csel and then ret, after a bgt that is not taken", () => {
    const texts = describeRun(10).result.steps.map((s) => s.text.replace(/\s+/g, " "));
    expect(texts).toEqual([
      "cmp w0, 10",
      "bgt .L9",
      "cmn w0, #10",
      "mov w0, -2",
      "csel w0, w0, wzr, lt",
      "ret",
    ]);
  });

  it("take bgt for 15 only, and take b .L7 there", () => {
    const taken = (g: number, text: string) =>
      describeRun(g).result.steps.find((s) => s.text.replace(/\s+/g, " ") === text)?.branch?.taken;
    expect(taken(15, "bgt .L9")).toBe(true);
    expect(taken(15, "b .L7")).toBe(true);
    for (const g of [10, -15, 0]) expect(taken(g, "bgt .L9"), `${g}`).toBe(false);
  });

  it("leave cmp NZCV 0010, 0110, 1010 and 1000, and cmn NZCV -, -, 1000 and 0000", () => {
    expect(flagsAfter(describeRun(15), "cmp")).toBe("0010");
    expect(flagsAfter(describeRun(10), "cmp")).toBe("0110");
    expect(flagsAfter(describeRun(-15), "cmp")).toBe("1010");
    expect(flagsAfter(describeRun(0), "cmp")).toBe("1000");
    expect(flagsAfter(describeRun(-15), "cmn")).toBe("1000");
    expect(flagsAfter(describeRun(0), "cmn")).toBe("0000");
  });

  it("have gt yes after cmp w0, 10 for 15, since Z is 0 and N equals V, and no for 10, since Z is 1", () => {
    const gt = (g: number) =>
      callText("f:\n  cmp w0, 10\n  cset w1, gt\n  ret\n", "f", [neg(g)]).result.final.x[1];
    expect(gt(15)).toBe(1n);
    expect(gt(10)).toBe(0n);
    expect(flagsAfter(describeRun(15), "cmp")[1]).toBe("0");
    expect(flagsAfter(describeRun(10), "cmp")[1]).toBe("1");
  });

  it("end both paths at the one ret under .L7: by falling through, and by b .L7", () => {
    const last = (g: number) => describeRun(g).result.steps.at(-1)!;
    expect(last(15).address).toBe(last(10).address);
    expect(last(15).text.trim()).toBe("ret");
    // Entering .L7 by falling through (10) and by the branch (15): the step before ret is csel or b.
    const before = (g: number) => describeRun(g).result.steps.at(-2)!.text.replace(/\s+/g, " ");
    expect(before(10)).toBe("csel w0, w0, wzr, lt");
    expect(before(15)).toBe("b .L7");
  });
});

describe("cmn w0, #10", () => {
  it("sets the flags of w0 plus 10, the same as comparing with −10", () => {
    for (const g of [-15, -11, -10, -9, 0, 10, 0x7fffffff, TOP]) {
      const cmn = callText("f:\n  cmn w0, #10\n  ret\n", "f", [neg(g)]);
      const cmp = callText("f:\n  cmp w0, -10\n  ret\n", "f", [neg(g)]);
      expect(nzcv(cmn.flags), `${g}`).toBe(nzcv(cmp.flags));
      const adds = callText("f:\n  adds w1, w0, 10\n  ret\n", "f", [neg(g)]);
      expect(nzcv(cmn.flags), `${g}`).toBe(nzcv(adds.flags));
    }
  });

  it("is what GNU as makes of cmp w0, -10, and the course's assembler does the same", () => {
    const a = callText("f:\n  cmp w0, -10\n  ret\n", "f", [0]).result;
    const b = callText("f:\n  cmn w0, 10\n  ret\n", "f", [0]).result;
    expect(a.steps[0]!.flagsAfter).toEqual(b.steps[0]!.flagsAfter);
    expect(PROSE.investigation).toContain("GNU as itself turns `cmp w0, -10` into `cmn w0, 10`");
  });

  it("makes lt yes exactly when w0 is below −10", () => {
    for (let g = -20; g <= 20; g++) {
      const lt = callText("f:\n  cmn w0, #10\n  cset w1, lt\n  ret\n", "f", [neg(g)]);
      expect(lt.result.final.x[1] === 1n, `${g}`).toBe(g < -10);
    }
    expect(describeRun(TOP - 2 ** 32).int).toBe(-2);
  });

  it("is accepted with and without the #, and GCC's forms are cmp w0, 10 and cmn w0, #10", () => {
    expect(callText("f:\n  cmn w0, 10\n  ret\n", "f", [1]).flags).toEqual(
      callText("f:\n  cmn w0, #10\n  ret\n", "f", [1]).flags,
    );
    expect(functionIn(DESCRIBE_TEXT, "describe").slice(0, 3)).toEqual([
      "cmp w0, 10",
      "bgt .L9",
      "cmn w0, #10",
    ]);
  });

  it("leaves the flags alone with the mov that follows it, so csel reads cmn's flags", () => {
    const out = callText("f:\n  mov w0, -2\n  ret\n", "f", [0], ALL_SET);
    expect(nzcv(out.flags)).toBe("1111");
  });
});

describe("csel w0, w0, wzr, lt and wzr", () => {
  it("gives w0 (now −2) when lt is yes and wzr, which reads as 0, when it is no", () => {
    expect(describeRun(-11).int).toBe(-2);
    expect(describeRun(-10).int).toBe(0);
    // wzr reads as 0 whatever else is in the registers.
    const zero = callText("f:\n  mov w1, 77\n  mov w0, wzr\n  ret\n", "f", []);
    expect(zero.w0).toBe(0);
  });
});

describe("b.gt and the other spelling bgt", () => {
  it("are the same instruction, and the assembler accepts both", () => {
    const a = callText(
      "f:\n  cmp w0, 10\n  b.gt .L9\n  mov w0, 0\n  ret\n.L9:\n  mov w0, 2\n  ret\n",
      "f",
      [15],
    );
    const b = callText(
      "f:\n  cmp w0, 10\n  bgt .L9\n  mov w0, 0\n  ret\n.L9:\n  mov w0, 2\n  ret\n",
      "f",
      [15],
    );
    expect(a.w0).toBe(2);
    expect(b.w0).toBe(2);
    expect(a.steps).toBe(b.steps);
  });
});

describe("cbz and the branches that test a register", () => {
  it("do not read or change the flags: 0000 stays 0000 and 1111 stays 1111", () => {
    const cbz = (flags: typeof ALL_SET | undefined) =>
      callText("f:\n  cbz w0, .Lz\n  mov w1, 1\n.Lz:\n  ret\n", "f", [0], flags);
    expect(nzcv(cbz(undefined).flags)).toBe("0000");
    expect(nzcv(cbz(ALL_SET).flags)).toBe("1111");
    const cbnz = callText("f:\n  cbnz w0, .Lz\n  mov w1, 1\n.Lz:\n  ret\n", "f", [5], ALL_SET);
    expect(nzcv(cbnz.flags)).toBe("1111");
    const tbz = callText("f:\n  tbz w0, 1, .Lz\n  mov w1, 1\n.Lz:\n  ret\n", "f", [0], ALL_SET);
    expect(nzcv(tbz.flags)).toBe("1111");
  });

  it("go to the label when w0 is 0 (cbz) or not 0 (cbnz)", () => {
    const run = (op: string, v: number) =>
      callText(`f:\n  ${op} w0, .Lz\n  mov w1, 1\n  ret\n.Lz:\n  mov w1, 2\n  ret\n`, "f", [v])
        .result.final.x[1];
    expect(run("cbz", 0)).toBe(2n);
    expect(run("cbz", 7)).toBe(1n);
    expect(run("cbnz", 0)).toBe(1n);
    expect(run("cbnz", 7)).toBe(2n);
  });

  it("go to the label when bit 1 of w0 is 0 (tbz) or 1 (tbnz)", () => {
    const run = (op: string, v: number) =>
      callText(`f:\n  ${op} w0, 1, .Lz\n  mov w1, 1\n  ret\n.Lz:\n  mov w1, 2\n  ret\n`, "f", [v])
        .result.final.x[1];
    expect(run("tbz", 0x28)).toBe(2n);
    expect(run("tbz", 0x2a)).toBe(1n);
    expect(run("tbnz", 0x2a)).toBe(2n);
    expect(run("tbnz", 0x28)).toBe(1n);
  });

  it("give the course's service 1 for 0x2a and 0 for 0x28, in three instructions each", () => {
    const text = assembly(SERVICE.listing);
    const a = callText(text, "service", [0x2a]);
    const b = callText(text, "service", [0x28]);
    expect([a.w0, a.steps]).toEqual([1, 3]);
    expect([b.w0, b.steps]).toEqual([0, 3]);
    expect(a.result.steps[0]!.branch?.taken).toBe(false);
    expect(b.result.steps[0]!.branch?.taken).toBe(true);
    expect(PROSE.explanation).toContain(
      "`service(0x2a)` returns 1. Bit 1 is set, so `tbz` is not taken",
    );
  });

  it("run maybe_beep(5) in two instructions, cbz not taken and ret, and take cbz to .L17 for 0", () => {
    const five = callText(RECORDED_TEXT, "maybe_beep", [5]);
    expect(five.steps).toBe(2);
    expect(five.result.steps.map((s) => s.text.replace(/\s+/g, " "))).toEqual([
      "cbz w0, .L17",
      "ret",
    ]);
    expect(five.result.steps[0]!.branch?.taken).toBe(false);
    const zero = callText(RECORDED_TEXT, "maybe_beep", [0]);
    expect(zero.result.steps[0]!.branch?.taken).toBe(true);
    // The target is .L17, the instruction after the ret.
    const l17 = zero.result.steps[0]!.branch!.target;
    const after = zero.result.steps[1]!;
    expect(after.address).toBe(l17);
    expect(after.text.startsWith("stp")).toBe(true);
    expect(PROSE.explanation).toContain("`maybe_beep(5)` runs two instructions");
  });

  it("show maybe_beep's first two instructions as an excerpt: its rest runs beep and is not shown", () => {
    expect(listingOf("maybe_beep").filter((l) => l.kind === "instruction")).toHaveLength(7);
    expect(PROSE.explanation).toContain("not shown");
    expect(PROSE.explanation).not.toContain("stp");
    expect(PROSE.explanation).not.toContain("bl ");
  });
});

describe("when GCC uses a branch", () => {
  it("made warning_light cmp and cset with no branch but ret", () => {
    const lines = functionIn(RECORDED_TEXT, "warning_light");
    expect(lines).toEqual(["cmp w0, w1", "cset w0, cc", "ret"]);
  });

  it("made describe with one conditional branch, for gradient > 10, and a csel for gradient < -10", () => {
    const lines = functionIn(RECORDED_TEXT, "describe");
    expect(
      lines.filter((l) => /^b[a-z.]*\s/.test(l) && !l.startsWith("b ")).map((l) => l.split(" ")[0]),
    ).toEqual(["bgt"]);
    expect(lines.filter((l) => l.startsWith("csel"))).toHaveLength(1);
  });

  it("made maybe_beep with a branch, cbz", () => {
    expect(functionIn(RECORDED_TEXT, "maybe_beep")[0]).toBe("cbz w0, .L17");
  });
});

describe("the failure experiment: bge for bgt, on describe(10)", () => {
  it("is the recorded describe with only bgt changed to bge", () => {
    const a = functionIn(DESCRIBE_TEXT, "describe");
    const b = functionIn(BGE_TEXT, "describe");
    expect(b).toHaveLength(a.length);
    expect(b.filter((l, i) => l !== a[i])).toEqual(["bge .L9"]);
  });

  it("returns 2 in five instructions, because cmp leaves NZCV 0110 and ge needs only N equal to V", () => {
    const out = describeRun(10, BGE_TEXT);
    expect(out.int).toBe(2);
    expect(out.steps).toBe(5);
    expect(flagsAfter(out, "cmp")).toBe("0110");
    expect(out.result.steps[1]!.branch?.taken).toBe(true);
    // gt needs Z to be 0, and Z is 1, so GCC's bgt is not taken and describe(10) returns 0.
    expect(describeRun(10).int).toBe(0);
  });

  it("leaves 12 returning 2 and 9 returning 0", () => {
    expect(describeRun(12, BGE_TEXT).int).toBe(2);
    expect(describeRun(9, BGE_TEXT).int).toBe(0);
  });
});

describe("the construction challenge, fuel_warning", () => {
  const c = lesson.challenges.find((x) => x.id === "write-fuel-warning")!;
  const text = assembly(`fuel_warning:\n${FUEL_WARNING_TEXT}\n`);
  const other = assembly(`fuel_warning:\n${FUEL_WARNING_SHARED_RET_TEXT}\n`);
  const sources: [string, string][] = [
    ["the first reference", text],
    ["the second reference", other],
  ];

  it("has the tests' expected answers as both references give them", () => {
    if (c.tests.kind !== "answers") throw new Error("answers");
    expect(c.tests.cases).toHaveLength(5);
    for (const [name, src] of sources)
      for (const t of c.tests.cases) {
        const out = callText(src, "fuel_warning", [Number(t.given["w0"]), Number(t.given["w1"])]);
        expect(String(out.w0), `${name} ${t.label}`).toBe(String(t.expect["w0"]));
      }
  });

  it("has one call with litres equal to reserve and one with the top bit of litres set", () => {
    if (c.tests.kind !== "answers") throw new Error("answers");
    const calls = c.tests.cases.map((t) => [Number(t.given["w0"]), Number(t.given["w1"])] as const);
    expect(calls.filter(([l, r]) => l === r)).toHaveLength(1);
    expect(calls.filter(([l]) => l >= TOP)).toHaveLength(1);
    expect(PROSE.fuelWarningTask).toContain("one with `litres` equal to `reserve`");
    expect(PROSE.fuelWarningTask).toContain("one with the top bit of `litres` set");
  });

  it("runs the first reference in three instructions for 0 and five for the others, cmp leaving 1000, 0110, 0010 and 0011", () => {
    if (c.tests.kind !== "answers") throw new Error("answers");
    const outs = c.tests.cases.map((t) =>
      callText(text, "fuel_warning", [Number(t.given["w0"]), Number(t.given["w1"])]),
    );
    expect(outs.map((o) => o.steps)).toEqual([3, 5, 5, 5, 5]);
    expect(outs.slice(1).map((o) => flagsAfter(o, "cmp"))).toEqual([
      "1000",
      "0110",
      "0010",
      "0011",
    ]);
    const shared = c.tests.cases.map(
      (t) => callText(other, "fuel_warning", [Number(t.given["w0"]), Number(t.given["w1"])]).steps,
    );
    expect(shared).toEqual([3, 6, 6, 6, 6]);
  });

  it("is failed by the signed b.lt for the value with the top bit set, which returns 1, and by nothing else", () => {
    const wrong = assembly(`fuel_warning:\n${FUEL_WARNING_TEXT.replace("b.cc", "b.lt")}\n`);
    if (c.tests.kind !== "answers") throw new Error("answers");
    const failing = c.tests.cases.filter(
      (t) =>
        callText(wrong, "fuel_warning", [Number(t.given["w0"]), Number(t.given["w1"])]).w0 !==
        Number(t.expect["w0"]),
    );
    expect(failing.map((t) => t.given["w0"])).toEqual([TOP]);
    expect(callText(wrong, "fuel_warning", [TOP, 10]).w0).toBe(1);
  });

  it("is failed by b.ls for litres equal to reserve (it returns 1), and by cmp before cbz for 0 (it returns 1)", () => {
    const ls = assembly(`fuel_warning:\n${FUEL_WARNING_TEXT.replace("b.cc", "b.ls")}\n`);
    expect(callText(ls, "fuel_warning", [10, 10]).w0).toBe(1);
    const swapped = assembly(
      [
        "fuel_warning:",
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
      ].join("\n"),
    );
    expect(callText(swapped, "fuel_warning", [0, 10]).w0).toBe(1);
    expect(PROSE.fuelWarningHints[1]).toContain(
      "`litres` 0 also passes it, so it returns 1, not 2",
    );
  });

  it("starts from a function that returns 0, which fails the first two calls only", () => {
    expect(FUEL_WARNING_STARTING_TEXT).toBe("mov w0, 0\nret");
    if (c.tests.kind !== "answers") throw new Error("answers");
    const start = assembly(`fuel_warning:\n${FUEL_WARNING_STARTING_TEXT}\n`);
    const failing = c.tests.cases.filter(
      (t) =>
        callText(start, "fuel_warning", [Number(t.given["w0"]), Number(t.given["w1"])]).w0 !==
        Number(t.expect["w0"]),
    );
    expect(failing.map((t) => t.label)).toEqual(["fuel_warning(0, 10)", "fuel_warning(9, 10)"]);
  });

  it("is told that litres arrives in w0 and reserve in w1", () => {
    const args = callText("f:\n  ret\n", "f", [9, 10]).result.initial.x;
    expect([args[0], args[1]]).toEqual([9n, 10n]);
  });
});

describe("the last challenge: describe(11), describe(-10) and describe(-11)", () => {
  const c = lesson.challenges.find((x) => x.id === "count-describe-runs")!;

  it("gives 2 in five instructions, 0 in six and -2 in six", () => {
    expect([describeRun(11).int, describeRun(11).steps]).toEqual([2, 5]);
    expect([describeRun(-10).int, describeRun(-10).steps]).toEqual([0, 6]);
    expect([describeRun(-11).int, describeRun(-11).steps]).toEqual([-2, 6]);
    expect(c.reference.answers).toEqual({
      result11: "2",
      steps11: "5",
      resultM10: "0",
      stepsM10: "6",
      resultM11: "-2",
      stepsM11: "6",
    });
  });

  it("leaves cmp NZCV 0010, 1010 and 1010, cmn NZCV 0110 for −10 and 1000 for −11, and takes bgt for 11 only", () => {
    expect(flagsAfter(describeRun(11), "cmp")).toBe("0010");
    expect(flagsAfter(describeRun(-10), "cmp")).toBe("1010");
    expect(flagsAfter(describeRun(-11), "cmp")).toBe("1010");
    expect(flagsAfter(describeRun(-10), "cmn")).toBe("0110");
    expect(flagsAfter(describeRun(-11), "cmn")).toBe("1000");
    const taken = (g: number) => describeRun(g).result.steps[1]!.branch?.taken;
    expect([taken(11), taken(-10), taken(-11)]).toEqual([true, false, false]);
  });

  it("does not use the three gradients as calls anywhere else in the lesson", () => {
    const call = /describe\((11|-10|−10|-11|−11)\)/;
    const elsewhere = lesson.sections
      .filter((s) => s.kind !== "challenge")
      .flatMap((s) => [s.prose, ...s.interactives.flatMap((x) => JSON.stringify(x.props))]);
    expect(elsewhere.filter((t) => call.test(t))).toEqual([]);
    expect([...TOLD_GRADIENTS]).toEqual([15, 10, -15, 0]);
    expect(partOf(body, 9)).toContain("gradients 11");
  });
});

describe("the programs the lesson wrote itself", () => {
  it("are the programs the differential test runs against QEMU", () => {
    const fw = corpusText("module4-fuel-warning");
    expect(functionIn(fw, "fuel_warning")).toEqual(
      functionIn(assembly(`fuel_warning:\n${FUEL_WARNING_TEXT}\n`), "fuel_warning"),
    );
    expect(functionIn(fw, "fuel_warning_start")).toEqual(FUEL_WARNING_STARTING_TEXT.split("\n"));
    expect(functionIn(corpusText("module4-fuel-warning-b"), "fuel_warning")).toEqual(
      functionIn(assembly(`fuel_warning:\n${FUEL_WARNING_SHARED_RET_TEXT}\n`), "fuel_warning"),
    );
    expect(functionIn(corpusText("module4-describe-bge"), "describe")).toEqual(
      functionIn(BGE_TEXT, "describe"),
    );
    expect(functionIn(corpusText("module4-service"), "service")).toEqual(
      functionIn(assembly(SERVICE.listing), "service"),
    );
  });

  it("and GCC's describe and maybe_beep are in that test too, as recorded", () => {
    const gcc = corpusText("module4-gcc");
    for (const name of ["describe", "maybe_beep"])
      expect(functionIn(gcc, name), name).toEqual(functionIn(RECORDED_TEXT, name));
  });
});
