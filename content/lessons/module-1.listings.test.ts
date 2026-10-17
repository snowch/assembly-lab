// Copyright © 2026 Christopher Snow

// Every listing Module 1 shows, held to the recorded file docs/notes/module-1/listings.md (ARM64
// GCC 16.1.0, -O1): the C as recorded, the instructions as recorded, and each instruction's C line
// as recorded less the recorded lines the figure leaves out above its first function. The programs
// the lessons run are the programs the differential test runs against QEMU.

import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { assemblyOf, parseListing, type ListingLine } from "@al/views";

import {
  FOUR_INSTRUCTIONS,
  FUEL_USED_WRONG,
  FUEL_USED_WRONG_PLUS_12,
  FUEL_USED_WRONG_U,
  MOVK_EXAMPLE,
  ODOMETER_LIMIT_TEXT,
  SERVICE_AND_ODOMETER,
  SERVICE_INTERVAL,
  WIDTHS,
  X5_QUESTION,
} from "./module-1.listings";

const recorded = readFileSync(
  new URL("../../docs/notes/module-1/listings.md", import.meta.url),
  "utf8",
);

const blocks = [...recorded.matchAll(/```(\w*)\n([\s\S]*?)```/g)].map((m) => ({
  lang: m[1] as string,
  text: m[2] as string,
}));
const recordedC = blocks
  .find((b) => b.lang === "c")!
  .text.replace(/\n+$/, "")
  .split("\n");
const recordedListing = parseListing(blocks.find((b) => b.lang === "")!.text);

interface Recorded {
  readonly name: string;
  /** The line of the recorded C that holds the function (the first line is line 1). */
  readonly line: number;
  readonly c: string;
  readonly instructions: { text: string; cLine: number | null }[];
}

/** The recorded functions: each label, its instructions, and its line of the recorded C. */
const functions: Recorded[] = [];
for (const l of recordedListing) {
  if (l.kind === "label") {
    const line = recordedC.findIndex((c) => new RegExp(`\\b${l.text}\\(`).test(c)) + 1;
    functions.push({ name: l.text, line, c: recordedC[line - 1] ?? "", instructions: [] });
  } else functions.at(-1)!.instructions.push({ text: l.text, cLine: l.cLine });
}
const fn = (name: string) => functions.find((f) => f.name === name)!;

/** Holds a shown program to the recorded functions it is made of, taken in the order given. */
function expectShown(shown: { c: string; listing: string }, names: string[]) {
  const wanted = names.map(fn);
  const first = wanted[0]!;
  // The C shown is the recorded lines of these functions, one after another, as recorded.
  expect(shown.c.split("\n")).toEqual(wanted.map((f) => f.c));
  wanted.forEach((f, i) => expect(f.line, f.name).toBe(first.line + i));
  // Every recorded instruction of a function is recorded against the function's own line.
  for (const f of wanted) for (const ins of f.instructions) expect(ins.cLine, f.name).toBe(f.line);
  // The listing shown is the recorded one, its C lines lowered by the lines left out above.
  const offset = first.line - 1;
  const lines: ListingLine[] = wanted.flatMap((f) => [
    { kind: "label" as const, text: f.name },
    ...f.instructions.map((ins) => ({
      kind: "instruction" as const,
      text: ins.text,
      cLine: ins.cLine === null ? null : ins.cLine - offset,
    })),
  ]);
  expect(parseListing(shown.listing)).toEqual(lines);
}

describe("the recorded file", () => {
  it("names the compiler and the setting, and records the nine functions the lessons use", () => {
    expect(recorded).toContain("ARM64 GCC 16.1.0");
    expect(recorded).toContain("flags `-O1`");
    expect(functions.map((f) => f.name)).toEqual([
      "service_interval",
      "odometer_limit",
      "no_reading",
      "all_ones",
      "no_reading_long",
      "widen",
      "widen_signed",
      "fuel_used_wrong",
      "fuel_used_wrong_u",
    ]);
    expect(recordedC[0]).toMatch(/^\/\/ Copyright/);
    for (const f of functions) expect(f.line, f.name).toBeGreaterThan(1);
  });
});

describe("the listings the lessons show", () => {
  it("show service_interval and odometer_limit as recorded, C line numbers one less", () => {
    expectShown(SERVICE_AND_ODOMETER, ["service_interval", "odometer_limit"]);
  });

  it("show service_interval alone as recorded, for the Question, which does not show odometer_limit", () => {
    expectShown(SERVICE_INTERVAL, ["service_interval"]);
    expect(SERVICE_INTERVAL.listing).not.toContain("odometer_limit");
    expect(SERVICE_INTERVAL.listing).not.toContain("movk");
  });

  it("show fuel_used_wrong as recorded, with its one line of C numbered 1", () => {
    expectShown(FUEL_USED_WRONG, ["fuel_used_wrong"]);
  });

  it("show fuel_used_wrong_u as recorded, with its one line of C numbered 1", () => {
    expectShown(FUEL_USED_WRONG_U, ["fuel_used_wrong_u"]);
  });

  it("add one instruction to fuel_used_wrong, add w0, w0, 12, and that instruction has no C line", () => {
    const lines = parseListing(FUEL_USED_WRONG_PLUS_12.listing);
    expect(lines.filter((l) => l.kind === "instruction")).toEqual([
      { kind: "instruction", text: "sub w0, w1, w0", cLine: 1 },
      { kind: "instruction", text: "add w0, w0, 12", cLine: null },
      { kind: "instruction", text: "ret", cLine: 1 },
    ]);
    expect(lines.filter((l) => l.text !== "add w0, w0, 12")).toEqual(
      parseListing(FUEL_USED_WRONG.listing),
    );
  });

  it("give odometer_limit's reference answer the recorded instructions", () => {
    expect(parseListing(ODOMETER_LIMIT_TEXT).map((l) => (l as { text: string }).text)).toEqual(
      fn("odometer_limit").instructions.map((i) => i.text),
    );
  });
});

describe("the listings the prose describes", () => {
  it("make mov w0, -1 of the int and the unsigned constant, as the second lesson says", () => {
    expect(fn("no_reading").instructions.map((i) => i.text)).toEqual(["mov w0, -1", "ret"]);
    expect(fn("all_ones").instructions.map((i) => i.text)).toEqual(["mov w0, -1", "ret"]);
  });

  it("make mov x0, -1 of the long constant", () => {
    expect(fn("no_reading_long").instructions.map((i) => i.text)).toEqual(["mov x0, -1", "ret"]);
  });

  it("make the same two instructions of the int and the unsigned subtraction", () => {
    const texts = (name: string) => fn(name).instructions.map((i) => i.text);
    expect(texts("fuel_used_wrong")).toEqual(["sub w0, w1, w0", "ret"]);
    expect(texts("fuel_used_wrong_u")).toEqual(texts("fuel_used_wrong"));
  });

  it("make one instruction of 30000, and two of 1000000", () => {
    const body = (name: string) => fn(name).instructions.filter((i) => i.text !== "ret");
    expect(body("service_interval")).toHaveLength(1);
    expect(body("odometer_limit")).toHaveLength(2);
  });
});

describe("the programs the differential test runs against QEMU", () => {
  const corpus = (name: string) =>
    assemblyOf(
      parseListing(
        readFileSync(new URL(`../../scripts/real-tools/corpus/${name}.s`, import.meta.url), "utf8")
          .split("\n")
          .filter((l) => !l.startsWith("//"))
          .join("\n"),
      ),
    );
  const text = (...programs: { listing: string }[]) =>
    assemblyOf(parseListing(programs.map((p) => p.listing).join("\n")));
  /** A program with the C line tags taken off. */
  const bare = (p: { listing: string }) => ({ listing: p.listing.replace(/ C\d+$/gm, "") });

  it("hold the compiler's fuel_used_wrong and fuel_used_wrong_u", () => {
    expect(corpus("module1-fuel")).toBe(text(bare(FUEL_USED_WRONG), bare(FUEL_USED_WRONG_U)));
  });

  it("hold the prediction's program, fuel_used_wrong with add w0, w0, 12", () => {
    expect(corpus("module1-fuel-plus-12")).toBe(text(bare(FUEL_USED_WRONG_PLUS_12)));
  });

  it("hold the compiler's constants, and the long that has an x register", () => {
    const mov = (name: string) =>
      `${name}:\n${fn(name)
        .instructions.map((i) => i.text)
        .join("\n")}`;
    expect(corpus("module1-constants")).toBe(
      assemblyOf(
        parseListing(
          [
            bare(SERVICE_AND_ODOMETER).listing,
            mov("no_reading"),
            mov("all_ones"),
            mov("no_reading_long"),
          ].join("\n"),
        ),
      ),
    );
  });

  it("hold the worked example of movk and the closing question's program, which no compiler made, and two other solutions of Build 1000000", () => {
    const labelled = (name: string, program: { listing: string }) => [
      { kind: "label" as const, text: name },
      ...parseListing(program.listing),
    ];
    expect(corpus("module1-halves")).toBe(
      assemblyOf([
        ...labelled("worked", MOVK_EXAMPLE),
        ...labelled("five", X5_QUESTION),
        ...labelled("movk_first", { listing: "movk w0, 16960\nmovk w0, 15, lsl 16\nret" }),
        ...labelled("three_steps", {
          listing: "mov w0, 1\nmovk w0, 15, lsl 16\nmovk w0, 16960\nret",
        }),
      ]),
    );
  });

  it("say, in the corpus file, that the programs are hand-written", () => {
    const header = readFileSync(
      new URL("../../scripts/real-tools/corpus/module1-halves.s", import.meta.url),
      "utf8",
    ).split("\n")[0];
    expect(header).toContain("no compiler made");
  });

  it("hold the two programs no compiler made, the second with the ret the figure leaves out", () => {
    const widths = parseListing(WIDTHS.listing);
    const four = parseListing([FOUR_INSTRUCTIONS.listing, "ret"].join("\n"));
    expect(corpus("module1-widths")).toBe(
      assemblyOf([
        { kind: "label", text: "widths" },
        ...widths,
        { kind: "label", text: "four" },
        ...four,
      ]),
    );
  });
});
