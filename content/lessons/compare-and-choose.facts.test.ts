// Copyright © 2026 Christopher Snow

// Every number lesson 1 of Module 4 states, run on the model, and every listing it shows or
// describes, held to the recorded file. The lesson's words say 1, 4294967295, NZCV 0000 and the rest;
// this test says what the simulator gives, so a number cannot be right in the prose and wrong in the
// machine. The listings are held to docs/notes/module-4/listings.md (ARM64 GCC 16.1.0, -O1), and the
// lesson's own assembly to the differential test's corpus.

import { describe, expect, it } from "vitest";

import { parseListing, type ListingLine } from "@al/views";

import { LESSONS } from ".";
import {
  ARGS,
  HOLDS_PROGRAM,
  LESS_FUEL_SIGNED_TEXT,
  LESS_FUEL_STARTING_TEXT,
  LESS_FUEL_TEXT,
  STEEPER_BOTH,
  STEEPER_S,
  STEEPER_U,
  STEEPER_U_GE,
} from "./compare-and-choose.listings";
import { PROSE } from "./compare-and-choose.prose";
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

const lesson = LESSONS.find((l) => l.id === "compare-and-choose")!;
const body = lessonBody(1);

const MAX = 0xffffffff;
const TOP = 0x80000000;
const GCC = assembly(listingOf("steeper_s").concat(listingOf("steeper_u")).map(textOf).join("\n"));

/** A recorded line as source text, with the C column dropped. */
function textOf(l: ListingLine): string {
  return l.kind === "label" ? `${l.text}:` : l.text;
}

/** The whole recorded listing as the assembler reads it. */
const RECORDED_TEXT = (() => {
  const blocks = [...recorded.matchAll(/```(\w*)\n([\s\S]*?)```/g)];
  const listing = blocks.find((m) => m[1] === "")![2] as string;
  return assembly(listing) + "beep:\n  ret\n";
})();

const call = (entry: string, ...args: number[]) => callText(RECORDED_TEXT, entry, args);

describe("the listings the lesson shows or describes", () => {
  it("name the compiler and the setting the recorded file records", () => {
    expect(recorded).toContain("ARM64 GCC 16.1.0");
    expect(recorded).toContain("`-O1`");
    expect(RECORDED_C[0]).toMatch(/^\/\/ Copyright/);
  });

  it.each([
    ["steeper_s", STEEPER_S],
    ["steeper_u", STEEPER_U],
  ] as const)(
    "show %s's C and instructions as recorded, counted from the function",
    (name, shown) => {
      const recordedFunction = shownFunction(name);
      expect(shown.c).toBe(recordedFunction.c);
      expect(parseListing(shown.listing)).toEqual(recordedFunction.listing);
    },
  );

  it("show the C of both functions beside the instructions of steeper_s", () => {
    expect(STEEPER_BOTH.c.split("\n")).toEqual([
      shownFunction("steeper_s").c,
      shownFunction("steeper_u").c,
    ]);
    expect(STEEPER_BOTH.listing).toBe(STEEPER_S.listing);
  });

  it("make steeper_s and steeper_u from the same cmp and ret, and csel with ge and with cs", () => {
    expect(functionIn(GCC, "steeper_s")).toEqual(["cmp w1, w0", "csel w0, w1, w0, ge", "ret"]);
    expect(functionIn(GCC, "steeper_u")).toEqual(["cmp w1, w0", "csel w0, w1, w0, cs", "ret"]);
  });

  it("give every listing in the prose as recorded, and name nothing else", () => {
    const fences = Object.values(PROSE)
      .filter((v): v is string => typeof v === "string")
      .flatMap((p) => fencesOf(p))
      .filter((f) => f.lang === "");
    const listings = fences.map((f) => parseListing(f.lines.join("\n")));
    const wanted = new Map(
      ["steeper_s", "steeper_u", "fuel_low", "warning_light", "downhill"].map((name) => [
        name,
        listingOf(name).map((l) => (l.kind === "label" ? l : { ...l, cLine: null })),
      ]),
    );
    const seen = new Set<string>();
    for (const listing of listings) {
      // A fence holds one recorded function, or two one after the other.
      let rest = listing;
      while (rest.length > 0) {
        const head = rest[0] as ListingLine;
        if (head.kind !== "label")
          throw new Error("a listing in the prose does not start with a label");
        const next = rest.findIndex((l, i) => i > 0 && l.kind === "label");
        const one = next < 0 ? rest : rest.slice(0, next);
        expect(one, head.text).toEqual(wanted.get(head.text));
        seen.add(head.text);
        rest = next < 0 ? [] : rest.slice(next);
      }
    }
    expect([...seen].sort()).toEqual([
      "downhill",
      "fuel_low",
      "steeper_s",
      "steeper_u",
      "warning_light",
    ]);
  });

  it("show the C as recorded where the prose gives it", () => {
    const c = fencesOf(PROSE.question).find((f) => f.lang === "c")!;
    expect(c.lines).toEqual([shownFunction("steeper_s").c, shownFunction("steeper_u").c]);
    expect(PROSE.generalisation).toContain(
      shownFunction("fuel_low")
        .c.replace(/^bool /, "bool ")
        .trim(),
    );
    expect(PROSE.generalisation).toContain(shownFunction("downhill").c);
  });
});

describe("steeper_s and steeper_u", () => {
  it("are given the same two patterns, 0xffffffff and 1, and return 1 and 4294967295", () => {
    expect(ARGS).toEqual([MAX, 1]);
    expect(call("steeper_s", MAX, 1).int).toBe(1);
    expect(call("steeper_u", MAX, 1).w0).toBe(4294967295);
    expect(call("steeper_s", MAX, 1).w0).toBe(1);
    expect(PROSE.question).toContain("`steeper_s` returns 1, and `steeper_u` returns 4294967295");
  });

  it("read 0xffffffff as −1 signed and 4294967295 unsigned", () => {
    expect(BigInt.asIntN(32, BigInt(MAX))).toBe(-1n);
    expect(Number(BigInt(MAX))).toBe(4294967295);
  });

  it("run three instructions, ret included", () => {
    expect(call("steeper_s", MAX, 1).steps).toBe(3);
    expect(call("steeper_u", MAX, 1).steps).toBe(3);
  });

  it("leave NZCV 0000 after cmp w1, w0 for a 0xffffffff and b 1: all four are 0", () => {
    expect(nzcv(call("steeper_s", MAX, 1).flags)).toBe("0000");
    expect(nzcv(call("steeper_u", MAX, 1).flags)).toBe("0000");
  });

  it("give ge yes and cs no there, so steeper_s takes b and steeper_u keeps a", () => {
    // `cmp w1, w0` is 1 minus 0xffffffff: N 0 equals V 0, and C 0, a borrow.
    const ge = callText("f:\n  cmp w1, w0\n  cset w2, ge\n  cset w3, cs\n  ret\n", "f", [MAX, 1]);
    expect(ge.result.final.x[2]).toBe(1n);
    expect(ge.result.final.x[3]).toBe(0n);
  });

  it("both return 7 for 3 and 7, with NZCV 0010 after cmp w1, w0", () => {
    expect(call("steeper_s", 3, 7).w0).toBe(7);
    expect(call("steeper_u", 3, 7).w0).toBe(7);
    expect(nzcv(call("steeper_s", 3, 7).flags)).toBe("0010");
    expect(nzcv(call("steeper_u", 3, 7).flags)).toBe("0010");
  });

  it("return the larger of two values, signed and unsigned, over a range of patterns", () => {
    const values = [0, 1, 2, 5, 0x7fffffff, TOP, 0xfffffff6, MAX];
    for (const a of values)
      for (const b of values) {
        const signed = (v: number) => Number(BigInt.asIntN(32, BigInt(v)));
        expect(call("steeper_s", a, b).int, `${a} ${b}`).toBe(Math.max(signed(a), signed(b)));
        expect(call("steeper_u", a, b).w0, `${a} ${b}`).toBe(Math.max(a, b));
      }
  });
});

describe("cmp and cmn", () => {
  const pairs = [
    [5, 8],
    [8, 8],
    [9, 8],
    [MAX, 1],
    [1, MAX],
    [TOP, 1],
    [0x7fffffff, MAX],
    [0xfffffffb, 2],
    [0, 0],
  ] as const;

  it("set the flags of subs and write no register; cmn those of adds", () => {
    for (const [a, b] of pairs) {
      const cmp = callText("f:\n  cmp w0, w1\n  ret\n", "f", [a, b]);
      const subs = callText("f:\n  subs w2, w0, w1\n  ret\n", "f", [a, b]);
      expect(nzcv(cmp.flags), `cmp ${a} ${b}`).toBe(nzcv(subs.flags));
      expect(cmp.result.steps[0]!.writes, `cmp ${a} ${b}`).toEqual([]);
      const cmn = callText("f:\n  cmn w0, w1\n  ret\n", "f", [a, b]);
      const adds = callText("f:\n  adds w2, w0, w1\n  ret\n", "f", [a, b]);
      expect(nzcv(cmn.flags), `cmn ${a} ${b}`).toBe(nzcv(adds.flags));
      expect(cmn.result.steps[0]!.writes, `cmn ${a} ${b}`).toEqual([]);
    }
  });

  it("take a constant, as subs does", () => {
    expect(nzcv(callText("f:\n  cmp w0, 10\n  ret\n", "f", [10]).flags)).toBe("0110");
    expect(nzcv(callText("f:\n  subs w1, w0, 10\n  ret\n", "f", [10]).flags)).toBe("0110");
  });

  it("keep the flags until another instruction records them", () => {
    // Module 2's add_overflows used `cmn w0, w1`, and a plain `add` leaves the flags as they were.
    const out = callText("f:\n  add w0, w0, w1\n  ret\n", "f", [1, 2], ALL_SET);
    expect(nzcv(out.flags)).toBe("1111");
  });
});

describe("what each condition reads", () => {
  const settings = Array.from({ length: 16 }, (_, i) => ({
    n: (i & 8) !== 0,
    z: (i & 4) !== 0,
    c: (i & 2) !== 0,
    v: (i & 1) !== 0,
  }));
  /** The rule for each condition, as the lesson's list words it. */
  const rule: Record<string, (f: (typeof settings)[number]) => boolean> = {
    eq: (f) => f.z,
    ne: (f) => !f.z,
    cs: (f) => f.c,
    cc: (f) => !f.c,
    hi: (f) => f.c && !f.z,
    ls: (f) => !f.c || f.z,
    ge: (f) => f.n === f.v,
    lt: (f) => f.n !== f.v,
    gt: (f) => !f.z && f.n === f.v,
    le: (f) => f.z || f.n !== f.v,
    vs: (f) => f.v,
  };
  const holds = (cond: string, f: (typeof settings)[number]) =>
    callText(`f:\n  cset w0, ${cond}\n  ret\n`, "f", [], f).w0 === 1;

  it("hold as the lesson's list says, at all sixteen settings of the flags", () => {
    expect(PROSE.explanation).toContain("checked at all sixteen settings of the flags");
    for (const [cond, reads] of Object.entries(rule))
      for (const f of settings) expect(holds(cond, f), `${cond} at ${nzcv(f)}`).toBe(reads(f));
  });

  it("have exactly one of each pair hold, at every setting", () => {
    for (const [x, y] of [
      ["eq", "ne"],
      ["cs", "cc"],
      ["hi", "ls"],
      ["ge", "lt"],
      ["gt", "le"],
    ] as const)
      for (const f of settings)
        expect(holds(x, f) !== holds(y, f), `${x} ${y} ${nzcv(f)}`).toBe(true);
  });

  it("are also written hs and lo, and the assembler accepts both", () => {
    for (const f of settings) {
      expect(holds("hs", f)).toBe(holds("cs", f));
      expect(holds("lo", f)).toBe(holds("cc", f));
    }
  });

  it("mean, after cmp a, b, the relations of a and b: unsigned for cs, cc, hi, ls and signed for ge, lt, gt, le", () => {
    const patterns = [
      0,
      1,
      2,
      5,
      8,
      10,
      0x7fffffff,
      TOP,
      TOP + 1,
      0xfffffff6,
      0xfffffffb,
      0xfffffffe,
      MAX,
      0x7ffffffe,
      0x10,
      0xff,
      0x100,
    ];
    const signed = (v: number) => BigInt.asIntN(32, BigInt(v));
    const names = ["eq", "ne", "cs", "cc", "hi", "ls", "ge", "lt", "gt", "le"];
    let checked = 0;
    for (const a of patterns)
      for (const b of patterns) {
        const out = callText(
          `f:\n  cmp w0, w1\n${names.map((c, i) => `  cset w${2 + i}, ${c}`).join("\n")}\n  ret\n`,
          "f",
          [a, b],
        );
        const got = (c: string) => out.result.final.x[2 + names.indexOf(c)] === 1n;
        const want: Record<string, boolean> = {
          eq: a === b,
          ne: a !== b,
          cs: a >= b,
          cc: a < b,
          hi: a > b,
          ls: a <= b,
          ge: signed(a) >= signed(b),
          lt: signed(a) < signed(b),
          gt: signed(a) > signed(b),
          le: signed(a) <= signed(b),
        };
        for (const c of names) {
          expect(got(c), `${c} after cmp ${a}, ${b}`).toBe(want[c]);
          checked++;
        }
      }
    expect(patterns).toHaveLength(17);
    expect(checked).toBe(2890);
  });

  it("at equality, 8 and 8, leave NZCV 0110: eq, ge, le, cs, ls yes; ne, gt, lt, hi, cc no", () => {
    const names = ["eq", "ne", "ge", "gt", "le", "lt", "cs", "hi", "ls", "cc"];
    const out = callText(
      `f:\n  cmp w0, w1\n${names.map((c, i) => `  cset w${2 + i}, ${c}`).join("\n")}\n  ret\n`,
      "f",
      [8, 8],
    );
    expect(nzcv(out.flags)).toBe("0110");
    const yes = names.filter((_, i) => out.result.final.x[2 + i] === 1n);
    expect(yes.sort()).toEqual(["cs", "eq", "ge", "le", "ls"]);
  });

  it("read V as well as N: 0x7fffffff and 0xffffffff leave NZCV 1001, ge yes, lt no, cc yes, cs no", () => {
    const names = ["ge", "lt", "cc", "cs"];
    const out = callText(
      `f:\n  cmp w0, w1\n${names.map((c, i) => `  cset w${2 + i}, ${c}`).join("\n")}\n  ret\n`,
      "f",
      [0x7fffffff, MAX],
    );
    expect(nzcv(out.flags)).toBe("1001");
    expect(names.map((_, i) => Number(out.result.final.x[2 + i]))).toEqual([1, 0, 1, 0]);
    // N is 1, yet 2147483647 is not less than −1: the signed subtraction overflowed.
    expect(out.flags.n).toBe(true);
    expect(out.flags.v).toBe(true);
  });

  it("make gt ge with equality left out, and hi cs with equality left out", () => {
    for (const f of settings) {
      expect(holds("gt", f)).toBe(holds("ge", f) && !f.z);
      expect(holds("hi", f)).toBe(holds("cs", f) && !f.z);
    }
  });
});

describe("the failure experiment: steeper_u with ge, on 0x80000000 and 1", () => {
  const ge = assembly(STEEPER_U_GE.listing);

  it("is the recorded steeper_u with only cs changed to ge", () => {
    expect(functionIn(ge, "steeper_u")).toEqual(["cmp w1, w0", "csel w0, w1, w0, ge", "ret"]);
    expect(functionIn(ge, "steeper_u")[0]).toBe(functionIn(GCC, "steeper_u")[0]);
    expect(functionIn(ge, "steeper_u")[2]).toBe(functionIn(GCC, "steeper_u")[2]);
  });

  it("returns 1, with NZCV 1001, where the recorded steeper_u returns 2147483648", () => {
    const changed = callText(ge, "steeper_u", [TOP, 1]);
    expect(changed.w0).toBe(1);
    expect(nzcv(changed.flags)).toBe("1001");
    expect(call("steeper_u", TOP, 1).w0).toBe(2147483648);
    expect(nzcv(call("steeper_u", TOP, 1).flags)).toBe("1001");
    // N and V are both 1, so ge is yes; C is 0, so cs would be no.
    expect(changed.flags.n && changed.flags.v).toBe(true);
    expect(changed.flags.c).toBe(false);
  });

  it("reads 0x80000000 as the smallest int", () => {
    expect(BigInt.asIntN(32, BigInt(TOP))).toBe(-(2n ** 31n));
  });
});

describe("what GCC does with the same two instructions", () => {
  it("makes fuel_low and warning_light the same cmp and cset cc", () => {
    expect(functionIn(RECORDED_TEXT, "fuel_low")).toEqual(["cmp w0, w1", "cset w0, cc", "ret"]);
    expect(functionIn(RECORDED_TEXT, "warning_light")).toEqual(
      functionIn(RECORDED_TEXT, "fuel_low"),
    );
  });

  it("gives fuel_low(5, 8) 1 with NZCV 1000, (8, 8) 0 with 0110 and (0x80000000, 8) 0 with 0011, in three instructions", () => {
    for (const [args, want, flags] of [
      [[5, 8], 1, "1000"],
      [[8, 8], 0, "0110"],
      [[TOP, 8], 0, "0011"],
    ] as const) {
      const out = call("fuel_low", ...args);
      expect(out.w0, `${args}`).toBe(want);
      expect(nzcv(out.flags), `${args}`).toBe(flags);
      expect(out.steps).toBe(3);
    }
  });

  it("gives warning_light(5, 8) 1 and warning_light(8, 8) 0", () => {
    expect(call("warning_light", 5, 8).w0).toBe(1);
    expect(call("warning_light", 8, 8).w0).toBe(0);
  });

  it("makes downhill one lsr by 31, which moves the top bit to the bottom", () => {
    expect(functionIn(RECORDED_TEXT, "downhill")).toEqual(["lsr w0, w0, 31", "ret"]);
    for (const [arg, want] of [
      [0xfffffffd, 1], // −3
      [4, 0],
      [0, 0],
      [TOP, 1],
    ] as const) {
      const out = call("downhill", arg);
      expect(out.w0, `${arg}`).toBe(want);
      expect(out.steps).toBe(2);
    }
  });

  it("sets the flags of w0 AND 2 with tst, writing no register: NZCV 0000 for 0x2a and 0100 for 0x28", () => {
    const tst = (w: number) => callText("f:\n  tst w0, 2\n  ret\n", "f", [w]);
    expect(nzcv(tst(0x2a).flags)).toBe("0000");
    expect(nzcv(tst(0x28).flags)).toBe("0100");
    expect(tst(0x2a).result.steps[0]!.writes).toEqual([]);
    // Z is 1 when bit 1 is clear, and N is the top bit of the AND.
    expect(nzcv(callText("f:\n  tst w0, 128\n  ret\n", "f", [0x2a]).flags)).toBe("0100");
  });

  it("writes the AND to w1 as well with ands: w1 is 2 and NZCV 0000 for 0x2a", () => {
    const ands = callText("f:\n  ands w1, w0, 2\n  ret\n", "f", [0x2a]);
    expect(ands.result.final.x[1]).toBe(2n);
    expect(nzcv(ands.flags)).toBe("0000");
  });

  it("leaves the flags as they were with and alone", () => {
    expect(nzcv(callText("f:\n  and w1, w0, 2\n  ret\n", "f", [0x2a], ALL_SET).flags)).toBe("1111");
  });

  it("clears C and V with a flag-setting AND, and N is the top bit of the AND", () => {
    const out = callText("f:\n  ands w1, w0, 0x80000000\n  ret\n", "f", [0xf0000000], ALL_SET);
    expect(out.result.final.x[1]).toBe(BigInt(TOP));
    expect(nzcv(out.flags)).toBe("1000");
  });
});

describe("the construction challenge, less_fuel", () => {
  const c = lesson.challenges.find((x) => x.id === "write-less-fuel")!;
  const text = assembly(`less_fuel:\n${LESS_FUEL_TEXT}\n`);

  it("has the tests' expected answers as the reference gives them, in three instructions each", () => {
    if (c.tests.kind !== "answers") throw new Error("answers");
    expect(c.tests.cases).toHaveLength(5);
    for (const t of c.tests.cases) {
      const out = callText(text, "less_fuel", [Number(t.given["w0"]), Number(t.given["w1"])]);
      expect(String(out.w0), t.label).toBe(String(t.expect["w0"]));
      expect(out.steps).toBe(3);
    }
    expect(PROSE.lessFuelTask).toContain("Five calls test it");
  });

  it("leaves the flags of cmp w0, w1 that each test is about: 1000, 0010, 0110, 0011 and 1001", () => {
    if (c.tests.kind !== "answers") throw new Error("answers");
    const flags = c.tests.cases.map((t) =>
      nzcv(callText(text, "less_fuel", [Number(t.given["w0"]), Number(t.given["w1"])]).flags),
    );
    expect(flags).toEqual(["1000", "0010", "0110", "0011", "1001"]);
  });

  it("has two calls with the top bit set in one value, and the signed condition fails exactly those", () => {
    if (c.tests.kind !== "answers") throw new Error("answers");
    const topSet = c.tests.cases.filter(
      (t) => Number(t.given["w0"]) >= TOP || Number(t.given["w1"]) >= TOP,
    );
    expect(topSet).toHaveLength(2);
    const wrong = assembly(`less_fuel:\n${LESS_FUEL_SIGNED_TEXT}\n`);
    const failing = c.tests.cases.filter((t) => {
      const out = callText(wrong, "less_fuel", [Number(t.given["w0"]), Number(t.given["w1"])]);
      return String(out.w0) !== String(t.expect["w0"]);
    });
    expect(failing).toEqual(topSet);
    // It returns 0x80000000 for both.
    for (const t of topSet)
      expect(callText(wrong, "less_fuel", [Number(t.given["w0"]), Number(t.given["w1"])]).w0).toBe(
        TOP,
      );
  });

  it("starts from a function that is only ret, and its reference is cmp w0, w1, csel w0, w0, w1, cc and ret", () => {
    expect(LESS_FUEL_STARTING_TEXT).toBe("ret");
    expect(functionIn(text, "less_fuel")).toEqual(["cmp w0, w1", "csel w0, w0, w1, cc", "ret"]);
    expect(PROSE.lessFuelHints.at(-1)).toBe("`cmp w0, w1`, `csel w0, w0, w1, cc`, `ret`.");
  });

  it("is told that a arrives in w0 and b in w1", () => {
    const args = callText("f:\n  ret\n", "f", [3, 7]).result.initial.x;
    expect([args[0], args[1]]).toEqual([3n, 7n]);
  });

  it("is told cc is yes when C is 0, that is, when w0 is lower than w1, and lo is the same", () => {
    const lo = assembly(`less_fuel:\ncmp w0, w1\ncsel w0, w0, w1, lo\nret\n`);
    for (const [a, b] of [
      [3, 7],
      [TOP, 1],
      [1, TOP],
    ] as const)
      expect(callText(lo, "less_fuel", [a, b]).w0).toBe(callText(text, "less_fuel", [a, b]).w0);
  });
});

describe("the last challenge: four conditions after cmp w0, w1", () => {
  const c = lesson.challenges.find((x) => x.id === "read-four-conditions")!;
  const names = ["ge", "cs", "lt", "cc"];
  const after = (a: number, b: number) =>
    callText(
      `f:\n  cmp w0, w1\n${names.map((n, i) => `  cset w${2 + i}, ${n}`).join("\n")}\n  ret\n`,
      "f",
      [a, b],
    );

  it("gives, for 0xfffffffb and 2, NZCV 1010 and ge 0, cs 1, lt 1, cc 0", () => {
    const out = after(0xfffffffb, 2);
    expect(nzcv(out.flags)).toBe("1010");
    expect(names.map((_, i) => Number(out.result.final.x[2 + i]))).toEqual([0, 1, 1, 0]);
    expect(c.reference.answers).toEqual({ ge: "0", cs: "1", lt: "1", cc: "0" });
  });

  it("reads 0xfffffffb as −5 signed and 4294967291 unsigned, and 2 as 2 either way", () => {
    expect(BigInt.asIntN(32, 0xfffffffbn)).toBe(-5n);
    expect(0xfffffffb).toBe(4294967291);
  });

  it("would give ge 1, cs 0, lt 0, cc 1 with the values swapped, and that pair is nowhere in the other prose", () => {
    const swapped = after(2, 0xfffffffb);
    expect(nzcv(swapped.flags)).toBe("0000");
    expect(names.map((_, i) => Number(swapped.result.final.x[2 + i]))).toEqual([1, 0, 0, 1]);
    // The pair, in either form, appears in the challenge's own part and nowhere else of the lesson.
    const pair = /0xfffffffb|4294967291|−5\b/;
    const challengePart = partOf(body, 9);
    expect(pair.test(challengePart)).toBe(true);
    const others = lesson.sections
      .filter((s) => s.kind !== "challenge")
      .flatMap((s) => [s.prose, ...s.interactives.flatMap((x) => JSON.stringify(x.props))]);
    expect(others.filter((t) => pair.test(t))).toEqual([]);
    expect(HOLDS_PROGRAM.listing).toBe("cmp w0, w1");
  });
});

describe("the programs the lesson wrote itself", () => {
  it("are the programs the differential test runs against QEMU", () => {
    const less = corpusText("module4-less-fuel");
    expect(functionIn(less, "less_fuel")).toEqual(
      functionIn(assembly(`less_fuel:\n${LESS_FUEL_TEXT}\n`), "less_fuel"),
    );
    expect(functionIn(less, "less_fuel_signed")).toEqual(
      functionIn(assembly(`less_fuel_signed:\n${LESS_FUEL_SIGNED_TEXT}\n`), "less_fuel_signed"),
    );
    expect(functionIn(less, "less_fuel_start")).toEqual([LESS_FUEL_STARTING_TEXT]);
    const ge = corpusText("module4-steeper-ge");
    expect(functionIn(ge, "steeper_u")).toEqual(
      functionIn(assembly(STEEPER_U_GE.listing), "steeper_u"),
    );
  });

  it("and GCC's functions are in that test too, as recorded", () => {
    const gcc = corpusText("module4-gcc");
    for (const name of [
      "steeper_s",
      "steeper_u",
      "fuel_low",
      "downhill",
      "service_due",
      "warning_light",
    ])
      expect(functionIn(gcc, name), name).toEqual(functionIn(RECORDED_TEXT, name));
  });

  it("include the tst and ands lines and a compare of every condition", () => {
    const lines = corpusText("module4-flags");
    expect(functionIn(lines, "tst_service")).toEqual(["tst w0, 2", "ret"]);
    expect(functionIn(lines, "ands_service")).toEqual(["ands w1, w0, 2", "ret"]);
    expect(functionIn(lines, "and_service")).toEqual(["and w1, w0, 2", "ret"]);
  });
});
