// Copyright © 2026 Christopher Snow

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { RETURN_ADDRESS, STACK_TOP } from "@al/machine";
import { parseListing, traceOf, viewAt, wValue } from "@al/views";
import { PLAYGROUND_CALL, PLAYGROUND_PROGRAM, PLAYGROUND_STARTER } from "./where-next.example";

const trace = () =>
  traceOf(PLAYGROUND_PROGRAM, { ...PLAYGROUND_CALL, args: [...PLAYGROUND_CALL.args] });

describe("the plain-assembly playground starter", () => {
  it("keeps the displayed source, download and native corpus identical", () => {
    for (const path of [
      "../apps/course/public/examples/trip-playground.s",
      "../scripts/real-tools/corpus/where-next-trip.s",
    ])
      expect(readFileSync(new URL(path, import.meta.url), "utf8")).toBe(PLAYGROUND_STARTER);
    const cases = JSON.parse(
      readFileSync(
        new URL("../scripts/real-tools/corpus/where-next-trip.json", import.meta.url),
        "utf8",
      ),
    );
    expect(cases).toEqual({ entry: "main", calls: [{ args: [] }] });
  });
  it("keeps the existing trip function's four instructions unchanged", () => {
    const old = readFileSync(
      new URL("../apps/course/public/native/trip_distance.s", import.meta.url),
      "utf8",
    );
    const body = old
      .slice(old.indexOf("trip_distance:\n") + "trip_distance:\n".length)
      .split(".size")[0]!;
    const current = PLAYGROUND_PROGRAM.listing.split("trip_distance:\n")[1]!;
    const instructions = (s: string) =>
      parseListing(s)
        .filter((l) => l.kind === "instruction")
        .map((l) => l.text);
    expect(instructions(current)).toEqual(instructions(body));
  });
  it("supplies the known arguments before calling the unchanged trip function", () => {
    const t = trace();
    const initialTrip = viewAt(t, 7).state;
    expect([0, 1, 2, 3].map((n) => wValue(initialTrip, n))).toEqual([120, 85, 42, 15]);
    expect(t.result.steps[7]!.text).toBe("add w0, w0, w1");
    const returnedTrip = viewAt(t, 11).state;
    expect(wValue(returnedTrip, 0)).toBe(232);
    expect([1, 2, 3].map((n) => wValue(returnedTrip, n))).toEqual([85, 42, 15]);
  });
  it("restores the caller frame and link register before main returns", () => {
    const t = trace();
    expect(viewAt(t, 1).state.sp).toBe(BigInt(STACK_TOP - 16));
    expect(t.result.final.sp).toBe(BigInt(STACK_TOP));
    expect(t.result.final.x[30]).toBe(BigInt(RETURN_ADDRESS));
    expect(wValue(t.result.final, 0)).toBe(232);
    expect(t.result.stop.kind).toBe("returned");
    expect(t.result.steps.at(-1)!.writes).toEqual([]);
  });
});
