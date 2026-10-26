// Copyright © 2026 Christopher Snow

import { describe, expect, it } from "vitest";
import { assemble, STACK_TOP, RETURN_ADDRESS } from "@al/machine";
import { traceOf, viewAt, wValue } from "@al/views";
import { stackFrames } from "../../packages/views/src/stack";
import { REGISTER_OR, SMALL_CALL } from "./prerequisite-bridges";

describe("preparation for logical and call compositions", () => {
  it.each([
    [5, 8, 13],
    [0, 257, 257],
    [0xffffffff, 0, 0xffffffff],
  ])("register OR reads both inputs and preserves its source: %s, %s", (left, right, result) => {
    const trace = traceOf(REGISTER_OR, { entry: "join_warnings", args: [left, right] });
    expect(wValue(viewAt(trace, 1).state, 0)).toBe(result);
    expect(wValue(viewAt(trace, 1).state, 1)).toBe(right);
    expect(trace.result.stop.kind).toBe("returned");
  });
  it("distinguishes a non-encodable logical immediate from a register holding the same bits", () => {
    expect(assemble("orr w0, w0, #257\nret").errors).not.toEqual([]);
    expect(assemble(REGISTER_OR.listing).errors).toEqual([]);
  });
  it.each([
    [0, 0],
    [128, 64],
    [0xffffffff, 2147483647],
  ])("the smaller returning caller relays %s as %s", (input, result) => {
    const trace = traceOf(SMALL_CALL, { entry: "relay_distance", args: [input] });
    const frame = stackFrames(trace, 1);
    expect(frame).toHaveLength(1);
    expect(frame[0]!.bytes).toHaveLength(16);
    expect(viewAt(trace, 1).state.sp).toBe(BigInt(STACK_TOP - 16));
    const final = trace.result.final;
    expect(wValue(final, 0)).toBe(result);
    expect(final.sp).toBe(BigInt(STACK_TOP));
    expect(final.x[30]).toBe(BigInt(RETURN_ADDRESS));
    expect(trace.result.stop.kind).toBe("returned");
    expect(stackFrames(trace, trace.result.steps.length)).toEqual([]);
    // No extra live value is saved in this first call example.
    expect(trace.result.steps.some((step) => step.writes.some((write) => write.reg === 19))).toBe(
      false,
    );
  });
});
