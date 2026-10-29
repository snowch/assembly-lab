// Copyright © 2026 Christopher Snow

import { describe, expect, it } from "vitest";
import { LESSONS } from "./lessons";
import { parseListing, programLines, type RecordedProgram } from "../packages/views/src/listing";

/** Inspect rendered data, including nested comparison sides and challenge editors. */
function records(value: unknown, found = new Map<string, RecordedProgram>()) {
  if (value === null || typeof value !== "object") return found;
  const object = value as Record<string, unknown>;
  if (typeof object["c"] === "string" && typeof object["listing"] === "string") {
    const program = object as unknown as RecordedProgram;
    found.set(JSON.stringify([program.c, program.listing]), program);
  }
  for (const child of Object.values(object)) records(child, found);
  return found;
}

describe("source connections for every displayed program", () => {
  for (const program of records(LESSONS).values()) {
    const name = program.listing.split("\n")[0];
    if (!program.c.trim()) continue;
    it(`${name}: covers each instruction without changing the compiler record`, () => {
      const original = parseListing(program.listing);
      const instructions = original.filter((line) => line.kind === "instruction");
      expect(
        program.sourceLines,
        "C-backed snippets need checked source associations",
      ).toHaveLength(instructions.length);
      const lineCount = program.c.replace(/\n+$/, "").split("\n").length;
      for (const sources of program.sourceLines ?? []) {
        expect(sources).toEqual([...new Set(sources)].sort((a, b) => a - b));
        expect(
          sources.every((line) => Number.isInteger(line) && line > 0 && line <= lineCount),
        ).toBe(true);
      }
      expect(
        programLines(program).map((line) => {
          if (line.kind === "label") return line;
          const { sourceLines: _sourceLines, ...recorded } = line;
          return recorded;
        }),
      ).toEqual(original);
    });
  }
});

it("shows compiler references only in the introduction and the lesson discussing a mismatch", () => {
  const optedIn = LESSONS.flatMap((lesson) =>
    lesson.sections.flatMap((section) =>
      section.interactives
        .filter(
          (figure) =>
            figure.props["showCompilerLines"] === true ||
            (figure.props["stage"] as { showCompilerLines?: boolean } | undefined)
              ?.showCompilerLines === true,
        )
        .map((figure) => [lesson.id, figure.id, figure.kind]),
    ),
  );
  expect(optedIn).toEqual([
    ["tiny-function", "worked-function", "primitive-operation"],
    ["branches", "describe-listing", "listing"],
  ]);
});
