// Copyright © 2026 Christopher Snow

// The cover's program, held to the recorded file docs/notes/front-page/cover.md (ARM64 GCC 16.1.0,
// -O1): the C without that file's first line, the listing with every C line number lowered by one,
// the values the cover shows (38, 44, 54) from the simulator, the differential test's copy of it,
// and that it is in no lesson.

import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { assemblyOf, parseListing, traceOf, viewAt, wValue, type ListingLine } from "@al/views";
import { learnerText } from "@platform/lesson-schema";

import { COVER_CALL, COVER_PROGRAM } from "./cover";
import { LESSONS } from ".";

const recorded = readFileSync(
  new URL("../docs/notes/front-page/cover.md", import.meta.url),
  "utf8",
);
const blocks = [...recorded.matchAll(/```(\w*)\n([\s\S]*?)```/g)].map(
  (m) => [m[1] ?? "", m[2] ?? ""] as const,
);
const block = (lang: string) => blocks.find(([l]) => l === lang)?.[1] ?? "";
const recordedC = block("c").replace(/\n+$/, "").split("\n");
const recordedListing = parseListing(block(""));

/** The listing with every recorded C line number lowered by one, as the page shows it. */
const shown = (lines: ListingLine[]): ListingLine[] =>
  lines.map((l) =>
    l.kind === "instruction" ? { ...l, cLine: l.cLine === null ? null : l.cLine - 1 } : l,
  );

describe("the cover's program", () => {
  it("names the compiler and the setting the recorded file records", () => {
    expect(recorded).toContain("ARM64 GCC 16.1.0");
    expect(recorded).toContain("`-O1`");
    expect(recorded).toContain("fuel_on_board(38, 6, 10)");
  });

  it("is the recorded C without its copyright line", () => {
    expect(recordedC[0]).toMatch(/^\/\/ Copyright/);
    expect(COVER_PROGRAM.c.split("\n")).toEqual(recordedC.slice(1));
  });

  it("is the recorded listing, with its C lines one lower", () => {
    expect(parseListing(COVER_PROGRAM.listing)).toEqual(shown(recordedListing));
    expect(
      parseListing(COVER_PROGRAM.listing).flatMap((l) =>
        l.kind === "instruction" ? [l.text] : [],
      ),
    ).toEqual(["add w0, w0, w1", "add w0, w0, w2", "ret"]);
  });

  it("makes w0 38, then 44, then 54, and returns after three instructions", () => {
    const trace = traceOf(COVER_PROGRAM, COVER_CALL);
    expect(trace.result.stop).toEqual({ kind: "returned" });
    expect(trace.result.steps).toHaveLength(3);
    const w0 = [0, 1, 2, 3].map((k) => wValue(viewAt(trace, k).state, 0));
    expect(w0).toEqual([38, 44, 54, 54]);
  });

  it("is the program the differential test runs against QEMU", () => {
    const corpus = readFileSync(
      new URL("../scripts/real-tools/corpus/cover-fuel-on-board.s", import.meta.url),
      "utf8",
    )
      .split("\n")
      .filter((l) => !l.startsWith("//"))
      .join("\n");
    expect(assemblyOf(parseListing(corpus))).toBe(assemblyOf(parseListing(COVER_PROGRAM.listing)));
    const calls = JSON.parse(
      readFileSync(
        new URL("../scripts/real-tools/corpus/cover-fuel-on-board.json", import.meta.url),
        "utf8",
      ),
    ) as { entry: string; calls: { args: [string, number][] }[] };
    expect(calls.entry).toBe(COVER_CALL.entry);
    expect(calls.calls[0]?.args.map(([v]) => Number(v))).toEqual([...COVER_CALL.args]);
  });

  it("is in no lesson", () => {
    for (const lesson of LESSONS) {
      expect(learnerText(lesson), lesson.id).not.toContain("fuel_on_board");
      expect(JSON.stringify(lesson), lesson.id).not.toContain("fuel_on_board");
    }
  });
});
