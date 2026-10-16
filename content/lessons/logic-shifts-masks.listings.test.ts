// Copyright © 2026 Christopher Snow

// Every listing Module 3 shows, held to the recorded file, and every program the module runs held
// to the differential test's corpus. The file is docs/notes/module-3/listings.md (ARM64 GCC
// 16.1.0, -O1): its first listing has the trip computer's functions, its second the four shifts
// of Lesson 2's last challenge. The lessons show each function by itself, as the one C line that
// defines it with every instruction tagged C1; this test finds that line in the recorded C by the
// line number GCC recorded for the instructions, and holds the instructions to the recorded ones.

import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { assemblyOf, parseListing, type ListingLine } from "@al/views";

import {
  COMPARE_SHIFTS,
  PICK_INSTRUCTION,
  RECORDED_FUNCTIONS,
  RECORDED_SHIFTS,
  SET_GEAR_REFERENCE_TEXT,
  SET_GEAR_START_TEXT,
  SET_GEAR_WITHOUT_CLEAR,
  SHIFT_AMOUNTS,
  SHIFT_OPS,
  TRACE_THREE,
} from "./logic-shifts-masks.listings";

const recorded = readFileSync(
  new URL("../../docs/notes/module-3/listings.md", import.meta.url),
  "utf8",
);

/** The fenced blocks of a part of the file, as [language, text]. */
function blocksOf(part: string): [string, string][] {
  return [...part.matchAll(/```(\w*)\n([\s\S]*?)```/g)].map((m) => [
    m[1] as string,
    m[2] as string,
  ]);
}

const second = recorded.indexOf("\n## ");
const firstPart = recorded.slice(0, second);
const secondPart = recorded.slice(second);

function program(part: string) {
  const blocks = blocksOf(part);
  const c = (blocks.find(([lang]) => lang === "c")![1] as string).replace(/\n+$/, "").split("\n");
  const listing = parseListing(blocks.find(([lang]) => lang === "")![1] as string);
  return { c, listing };
}

const first = program(firstPart);
const last = program(secondPart);

/** The recorded instructions of the function labelled `label`, with the C line each was recorded against. */
function recordedFunction(listing: ListingLine[], label: string) {
  const start = listing.findIndex((l) => l.kind === "label" && l.text === label);
  expect(start, `the recorded file has ${label}`).toBeGreaterThanOrEqual(0);
  const lines: ListingLine[] = [];
  for (let i = start + 1; i < listing.length; i++) {
    const line = listing[i] as ListingLine;
    if (line.kind === "label") break;
    lines.push(line);
  }
  return lines.flatMap((l) => (l.kind === "instruction" ? [l] : []));
}

const labelOf = (listing: string) => (parseListing(listing)[0] as { text: string }).text;

describe("the listings the lessons show", () => {
  it("name the compiler and the setting the recorded file records", () => {
    expect(recorded).toContain("ARM64 GCC 16.1.0");
    expect(recorded).toContain("flags `-O1`");
    expect(first.c[0]).toMatch(/^\/\/ Copyright/);
    expect(last.c[0]).toMatch(/^\/\/ Copyright/);
  });

  const cases: [string, { c: string; listing: string }, typeof first][] = [
    ...Object.entries(RECORDED_FUNCTIONS).map(
      ([name, p]) => [name, p, first] as [string, { c: string; listing: string }, typeof first],
    ),
    ...Object.entries(RECORDED_SHIFTS).map(
      ([name, p]) => [name, p, last] as [string, { c: string; listing: string }, typeof first],
    ),
  ];

  it.each(cases)(
    "%s: its C is the recorded line GCC recorded its instructions against, and its instructions are as recorded",
    (name, shown, file) => {
      const ours = parseListing(shown.listing);
      expect(labelOf(shown.listing)).toBe(name);
      const want = recordedFunction(file.listing, name);
      // The lesson shows each instruction against the one C line it draws as line 1.
      const tags = new Set(want.map((l) => l.cLine));
      expect(tags.size, `${name} is recorded against one C line`).toBe(1);
      const line = [...tags][0] as number;
      expect(shown.c).toBe(file.c[line - 1]);
      expect(ours.flatMap((l) => (l.kind === "instruction" ? [l.text] : []))).toEqual(
        want.map((l) => l.text),
      );
      for (const l of ours) if (l.kind === "instruction") expect(l.cLine).toBe(1);
    },
  );

  it("show every function of the recorded file, none more than once", () => {
    const labels = (listing: ListingLine[]) =>
      listing.flatMap((l) => (l.kind === "label" ? [l.text] : []));
    expect(Object.keys(RECORDED_FUNCTIONS)).toEqual(labels(first.listing));
    expect(Object.keys(RECORDED_SHIFTS)).toEqual(labels(last.listing));
  });

  it("start the three bit meanings from the recorded C: the flags are bits 0, 1 and 2, the lights bit 3, the gear bits 4 to 6", () => {
    const define = (name: string) =>
      first.c.find((l) => l.startsWith(`#define ${name} `))?.slice(`#define ${name} `.length);
    expect(define("FUEL_LOW")).toBe("(1u << 0)");
    expect(define("SERVICE_DUE")).toBe("(1u << 1)");
    expect(define("DOOR_OPEN")).toBe("(1u << 2)");
    expect(RECORDED_FUNCTIONS.toggle_lights.c).toContain("w ^ (1u << 3)");
    expect(RECORDED_FUNCTIONS.set_gear.c).toContain("7u << 4");
    expect(RECORDED_FUNCTIONS.gear_of.c).toContain("(w >> 4) & 7");
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

  it("hold every recorded function, as recorded", () => {
    expect(corpus("module3-gcc")).toBe(
      text(...Object.values(RECORDED_FUNCTIONS), ...Object.values(RECORDED_SHIFTS)),
    );
  });

  it("hold the reader's set_gear, the challenge's starting point and the failure experiment", () => {
    const labelled = (label: string, body: string) => `${label}:\n${body}`;
    expect(corpus("module3-setgear")).toBe(
      text({
        listing: [
          labelled("set_gear_reference", SET_GEAR_REFERENCE_TEXT),
          labelled("set_gear_start", SET_GEAR_START_TEXT),
          // The failure experiment's listing, under another label.
          SET_GEAR_WITHOUT_CLEAR.listing.replace("set_gear:", "set_gear_no_clear:"),
        ].join("\n"),
      }),
    );
  });

  it("hold the programs the answers challenges' graders run", () => {
    expect(corpus("module3-answers")).toBe(text(TRACE_THREE, COMPARE_SHIFTS));
  });

  it("hold the four shifts of the last challenge, which the grader runs", () => {
    expect(PICK_INSTRUCTION.listing).toBe(
      Object.values(RECORDED_SHIFTS)
        .map((p) => p.listing)
        .join("\n"),
    );
  });

  it("hold each shift the shift figure offers, by each amount it offers", () => {
    const listing = SHIFT_OPS.flatMap((op) =>
      SHIFT_AMOUNTS.map((n) => `${op}_${n}:\n  ${op} w0, w0, ${n}\n  ret`),
    ).join("\n");
    expect(corpus("module3-shift-figure")).toBe(text({ listing }));
  });
});
