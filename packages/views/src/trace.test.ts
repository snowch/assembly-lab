// Copyright © 2026 Christopher Snow

// A recorded listing, parsed and run: the lines a figure draws, and what each step leaves.

import { describe, expect, it } from "vitest";

import { assemblyOf, cLinesOf, deleteLine, parseListing } from "./listing";
import { bitsOf, traceOf, viewAt, wValue, wValueAsInt } from "./trace";
import { TRIP, TRIP_AND_FUEL, TRIP_CALL } from "./testing";

describe("a recorded listing", () => {
  it("is a label and instructions, each with the C line the compiler recorded", () => {
    expect(parseListing(TRIP.listing)).toEqual([
      { kind: "label", text: "trip_distance" },
      { kind: "instruction", text: "add w0, w0, w1", cLine: 3 },
      { kind: "instruction", text: "add w0, w0, w2", cLine: 4 },
      { kind: "instruction", text: "sub w0, w0, w3", cLine: 7 },
      { kind: "instruction", text: "ret", cLine: 7 },
    ]);
  });

  it("keeps the compiler's spacing out of an instruction, and takes a line with no tag as untagged", () => {
    expect(parseListing("f:\n\tadd\tw0,  w0, w1\t\t\tC4\n  ret\n")).toEqual([
      { kind: "label", text: "f" },
      { kind: "instruction", text: "add w0, w0, w1", cLine: 4 },
      { kind: "instruction", text: "ret", cLine: null },
    ]);
  });

  it("is the text the assembler reads, line for line", () => {
    expect(assemblyOf(parseListing(TRIP.listing)).split("\n")).toEqual([
      "trip_distance:",
      "add w0, w0, w1",
      "add w0, w0, w2",
      "sub w0, w0, w3",
      "ret",
      "",
    ]);
  });

  it("loses one line, the first matching one after the label, to deleteLine", () => {
    const lines = deleteLine(parseListing(TRIP_AND_FUEL.listing), {
      label: "trip_distance",
      text: "ret",
    });
    expect(lines.map((l) => l.text)).toEqual([
      "trip_distance",
      "add w0, w0, w1",
      "add w0, w0, w2",
      "sub w0, w0, w3",
      "fuel_used",
      "sub w0, w0, w1",
      "ret",
    ]);
  });

  it("says so when the line or the label is not there", () => {
    const lines = parseListing(TRIP.listing);
    expect(() => deleteLine(lines, { label: "nope", text: "ret" })).toThrow(/no label nope/);
    expect(() => deleteLine(lines, { label: "trip_distance", text: "nop" })).toThrow(/no line nop/);
  });

  it("numbers the C from 1 and drops a final newline", () => {
    expect(cLinesOf("a\n\nb\n")).toEqual(["a", "", "b"]);
  });
});

describe("a run, as the figures see it", () => {
  const trace = traceOf(TRIP, TRIP_CALL);

  it("starts with the marker on the first instruction and nothing run", () => {
    const v = viewAt(trace, 0);
    expect([v.k, v.total, v.next, v.ran, v.litC, v.stop]).toEqual([0, 4, 1, null, null, null]);
    expect([0, 1, 2, 3].map((n) => wValue(v.state, n))).toEqual([120, 85, 42, 15]);
    expect(v.written.size).toBe(0);
  });

  it("moves the marker, lights the C line of the instruction that ran, and says which register it wrote", () => {
    const v = viewAt(trace, 1);
    expect([v.next, v.ran, v.litC]).toEqual([2, 1, 3]);
    expect([...v.written]).toEqual([0]);
    expect(wValue(v.state, 0)).toBe(205);
    expect(wValue(v.state, 1)).toBe(85);
  });

  it("records the last subtraction and ret against the closing brace, as the compiler did", () => {
    expect(viewAt(trace, 3).litC).toBe(7);
    expect(viewAt(trace, 4).litC).toBe(7);
  });

  it("ends with no marker and the way the run ended", () => {
    const v = viewAt(trace, 4);
    expect([v.next, v.stop, wValue(v.state, 0)]).toEqual([null, { kind: "returned" }, 232]);
  });

  it("does not go past either end", () => {
    expect(viewAt(trace, -3).k).toBe(0);
    expect(viewAt(trace, 99).k).toBe(4);
  });

  it("runs on into the next function when a line is taken out, and shows the marker there", () => {
    const without = traceOf(TRIP_AND_FUEL, TRIP_CALL, { label: "trip_distance", text: "ret" });
    expect(without.result.steps).toHaveLength(5);
    const third = viewAt(without, 3);
    expect(without.lines[third.next!]).toEqual({
      kind: "instruction",
      text: "sub w0, w0, w1",
      cLine: 12,
    });
    expect(wValue(viewAt(without, 5).state, 0)).toBe(147);
  });

  it("reads a register as its 32 bits, and as a whole number that may be negative", () => {
    const state = { ...viewAt(trace, 0).state, x: [0xfffffff4n, (1n << 40n) | 5n] };
    expect(wValue(state, 0)).toBe(4294967284);
    expect(wValueAsInt(state, 0)).toBe(-12);
    expect(wValue(state, 1)).toBe(5);
    expect(bitsOf(232)).toBe("00000000000000000000000011101000");
    expect(bitsOf(4294967284)).toHaveLength(32);
  });

  it("says what is wrong with a listing that does not assemble", () => {
    expect(() => traceOf({ listing: "f:\n  mulx w0, w0\n" }, { entry: "f", args: [] })).toThrow(
      /does not assemble: line 2/,
    );
  });
});
