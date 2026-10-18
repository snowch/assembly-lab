// Copyright © 2026 Christopher Snow

import { describe, expect, it } from "vitest";
import { STACK_TOP } from "@al/machine";
import { FADE_SUM } from "../../../content/lessons/calls.listings";
import { traceOf } from "./trace";
import { stackFrames, stackReturnTarget } from "./stack";

describe("stack annotations follow executed calls and stores", () => {
  it("keeps distinct recursive call identities and the incoming register values saved by each", () => {
    const trace = traceOf(FADE_SUM, { entry: "fade_sum", args: [7] });
    const frames = stackFrames(trace, 25);
    expect(frames.map((frame) => frame.invocation)).toEqual([1, 2, 3, 4]);
    expect(
      frames.map((frame) => frame.slots.find((slot) => slot.register === "x19")?.value),
    ).toEqual([0n, 7n, 3n, 1n]);
    expect(stackFrames(trace, trace.result.steps.length)).toEqual([]);
    expect(stackFrames(trace, 0)).toEqual([]);
  });
  it("uses actual store addresses and register operands for a different allocation and a pointer alias", () => {
    const trace = traceOf(
      {
        listing:
          "entry:\nmov x19, #37\nmov x20, #81\nstp x19, x30, [sp, #-48]!\nmov x1, sp\nstr x20, [x1, #32]\nldp x19, x30, [sp], #48\nret",
      },
      { entry: "entry", args: [] },
    );
    const frame = stackFrames(trace, 5)[0]!;
    expect(frame.base).toBe(STACK_TOP - 48);
    expect(
      frame.slots.map(({ address, register, size, value }) => ({ address, register, size, value })),
    ).toEqual([
      { address: STACK_TOP - 48, register: "x19", size: 8, value: 37n },
      { address: STACK_TOP - 40, register: "x30", size: 8, value: trace.result.initial.x[30] },
      { address: STACK_TOP - 16, register: "x20", size: 8, value: 81n },
    ]);
  });
  it("removes a whole-register annotation when part of its bytes is overwritten", () => {
    const trace = traceOf(
      {
        listing:
          "entry:\nstp x19, x30, [sp, #-16]!\nstr w0, [sp, #4]\nldp x19, x30, [sp], #16\nret",
      },
      { entry: "entry", args: [42] },
    );
    expect(stackFrames(trace, 1)[0]!.slots.map((slot) => slot.register)).toEqual(["x19", "x30"]);
    expect(stackFrames(trace, 2)[0]!.slots.map((slot) => slot.register)).toEqual(["w0", "x30"]);
    expect(stackFrames(trace, 2)[0]!.slots[0]!.value).toBe(42n);
  });
  it("assigns new ordinals when sequential calls reuse the same stack addresses", () => {
    const trace = traceOf(
      {
        listing:
          "entry:\nstp x29, x30, [sp, #-16]!\nbl child\nbl child\nldp x29, x30, [sp], #16\nret\nchild:\nstr x19, [sp, #-16]!\nldr x19, [sp], #16\nret",
      },
      { entry: "entry", args: [] },
    );
    expect(stackFrames(trace, 3).map((frame) => frame.invocation)).toEqual([1, 2]);
    expect(stackFrames(trace, 7).map((frame) => frame.invocation)).toEqual([1, 3]);
  });
  it("maps a return address through the assembled listing and reports an external address without inventing a line", () => {
    const trace = traceOf(
      {
        listing:
          "entry:\nstp x29, x30, [sp, #-16]!\nbl child\nldp x29, x30, [sp], #16\nret\nchild:\nret",
      },
      { entry: "entry", args: [] },
    );
    expect(stackReturnTarget(trace, 0).instruction).toBeNull();
    expect(stackReturnTarget(trace, 2)).toEqual({
      address: BigInt(trace.result.steps[1]!.address + 4),
      instruction: "ldp x29, x30, [sp], #16",
    });
    expect(stackReturnTarget(trace, 4).instruction).toBeNull();
  });
});
