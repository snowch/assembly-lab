// Copyright © 2026 Christopher Snow

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { traceOf, viewAt, wValue } from "@al/views";
import { parseListing, programLines } from "../../packages/views/src/listing";
import { ADD_INTS } from "./two-argument-function.listings";

const record = (file: string) =>
  readFileSync(new URL(`../../docs/notes/module-0/two-arguments/${file}`, import.meta.url), "utf8");
const response = JSON.parse(record("response.json"));
const request = JSON.parse(record("request.json"));

describe("the recorded two-argument function", () => {
  it("keeps the submitted C, actual compiler identity and original debug references", () => {
    expect(request.source).toBe(record("add_ints.c"));
    expect(ADD_INTS.c + "\n").toBe(record("add_ints.c").split("\n").slice(1).join("\n"));
    expect(JSON.parse(record("compiler.json"))).toMatchObject({
      id: "carm64g1610",
      name: "ARM64 GCC 16.1.0",
      instructionSet: "aarch64",
      semver: "16.1.0",
    });
    expect(request.options.userArguments).toBe("-g -O1 -fno-verbose-asm");
    expect(response.code).toBe(0);
    expect(response.stderr).toEqual([]);
    expect(response.timedOut).toBe(false);
    expect(response.truncated).toBe(false);
    expect(
      parseListing(ADD_INTS.listing).map((line) => ({
        text: line.kind === "label" ? line.text + ":" : line.text,
        cLine: line.kind === "label" ? null : line.cLine,
      })),
    ).toEqual(
      response.asm.map((line: { text: string; source: { line: number } | null }) => ({
        text: line.text.trim().replace(/\s+/g, " "),
        cLine: line.source ? line.source.line - 1 : null,
      })),
    );
    expect(ADD_INTS.sourceLines).toEqual([[3], [3]]);
    expect(
      programLines(ADD_INTS)
        .filter((line) => line.kind === "instruction")
        .map((line) => line.sourceLines),
    ).toEqual([[3], [3]]);
  });

  it("shows both incoming arguments, prepares the result, then returns without writing a register", () => {
    const trace = traceOf(ADD_INTS, { entry: "add_ints", args: [7, 5] });
    const views = [0, 1, 2].map((k) => viewAt(trace, k));
    expect(views.map((v) => [wValue(v.state, 0), wValue(v.state, 1)])).toEqual([
      [7, 5],
      [12, 5],
      [12, 5],
    ]);
    expect(views.map((v) => [...v.written])).toEqual([[], [0], []]);
    expect(views.map((v) => v.stop?.kind ?? null)).toEqual([null, null, "returned"]);
    expect(trace.lines[views[1]!.next!]!.text).toBe("ret");
    expect(views[2]!.next).toBeNull();
  });

  it.each([
    [0, 0],
    [-3, 2],
    [0, 9],
    [4, 0],
    [6, 4],
    [-2147483648, 0],
    [2147483646, 1],
  ])("adds the safe C inputs %i and %i, preserving the second input", (a, b) => {
    const trace = traceOf(ADD_INTS, { entry: "add_ints", args: [a, b] });
    expect(trace.result.stop.kind).toBe("returned");
    expect(wValue(trace.result.final, 0)).toBe((a + b) >>> 0);
    expect(wValue(trace.result.final, 1)).toBe(b >>> 0);
  });

  it("holds the GNU/QEMU corpus to the actual emitted program and includes the shown call", () => {
    const source = readFileSync(
      new URL("../../scripts/real-tools/corpus/module0-add-ints.s", import.meta.url),
      "utf8",
    );
    expect(
      source
        .split("\n")
        .slice(1)
        .filter(Boolean)
        .map((line) => line.trim().replace(/\s+/g, " ")),
    ).toEqual(response.asm.map((line: { text: string }) => line.text.trim().replace(/\s+/g, " ")));
    const corpus = JSON.parse(
      readFileSync(
        new URL("../../scripts/real-tools/corpus/module0-add-ints.json", import.meta.url),
        "utf8",
      ),
    );
    expect(corpus.entry).toBe("add_ints");
    expect(corpus.calls).toContainEqual({
      args: [
        ["7", 32],
        ["5", 32],
      ],
    });
  });
});
