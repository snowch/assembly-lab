// Copyright © 2026 Christopher Snow

import { describe, expect, it } from "vitest";

import { CallSchema } from "./interactives/props";
import { loopSummary } from "./loop";
import { traceOf, viewAt, wValue } from "./trace";

const UP = {
  listing:
    "f:\n cmp w1, w2\n b.cs done\nbody:\n lsr w0, w0, 1\n add w1, w1, 1\n cmp w1, w2\n b.ne body\ndone:\n ret",
};
const DOWN = {
  listing: "f:\n cbz w1, done\nbody:\n lsr w0, w0, 1\n subs w1, w1, 1\n b.ne body\ndone:\n ret",
};

describe("loop counts and register history", () => {
  it("counts body executions, including the first that needs no backward jump", () => {
    const trace = traceOf(UP, { entry: "f", args: [128, 0, 3] });
    const summary = loopSummary(trace, "body");
    expect(summary).toEqual({
      initial: 128,
      returned: true,
      visits: [
        { step: 3, value: 64 },
        { step: 7, value: 32 },
        { step: 11, value: 16 },
      ],
    });
    expect(
      trace.result.steps.filter((step) => step.branch?.taken && /b.ne/.test(step.text)),
    ).toHaveLength(2);
  });

  it.each([
    [0, 0],
    [0xffffffff, 0xffffffff],
    [5, 3],
  ])("does not count the body when the initial comparison skips it (%i, %i)", (start, end) => {
    expect(loopSummary(traceOf(UP, { entry: "f", args: [128, start, end] }), "body")).toEqual({
      initial: 128,
      visits: [],
      returned: true,
    });
  });

  it.each([
    [0xfffffffc, 0xffffffff],
    [0x7ffffffe, 0x80000001],
  ])("runs short unsigned intervals at a type boundary (%i, %i)", (start, end) => {
    const trace = traceOf(UP, { entry: "f", args: [0xffffffff, start, end] });
    expect(loopSummary(trace, "body").visits.map((visit) => visit.value)).toEqual([
      0x7fffffff, 0x3fffffff, 0x1fffffff,
    ]);
    expect(wValue(trace.result.final, 1)).toBe(end);
  });

  it("marks a bounded prefix as unfinished even if the body just ran", () => {
    const trace = traceOf(DOWN, { entry: "f", args: [128, 3], maxSteps: 2 });
    expect(trace.result.stop).toEqual({ kind: "limit", steps: 2 });
    expect(loopSummary(trace, "body")).toEqual({
      initial: 128,
      returned: false,
      visits: [{ step: 2, value: 64 }],
    });
    expect(wValue(viewAt(trace, 2).state, 1)).toBe(3);
  });

  it("preserves an explicit budget and observes 32-bit wrap in a broken countdown", () => {
    const broken = { listing: "f:\nbody:\n subs w1, w1, 1\n b.cs body\n ret" };
    const trace = traceOf(broken, { entry: "f", args: [0, 0], maxSteps: 1 });
    expect(loopSummary(trace, "body", 1).visits).toEqual([{ step: 1, value: 0xffffffff }]);
    expect(trace.result.stop.kind).toBe("limit");
  });

  it("returns when ret uses the last permitted step", () => {
    const trace = traceOf(DOWN, { entry: "f", args: [128, 0], maxSteps: 2 });
    expect(trace.result.stop.kind).toBe("returned");
    expect(loopSummary(trace, "body").visits).toEqual([]);
  });

  it("rejects a missing body instruction rather than drawing a false zero", () => {
    expect(() => loopSummary(traceOf(UP, { entry: "f", args: [128, 0, 3] }), "missing")).toThrow(
      /does not name an instruction/,
    );
  });

  it("keeps old calls valid and rejects invalid or excessive UI budgets", () => {
    const call = { entry: "f", args: [] };
    expect(CallSchema.parse(call)).toEqual(call);
    expect(CallSchema.parse({ ...call, maxSteps: 16 }).maxSteps).toBe(16);
    for (const maxSteps of [0, -1, 1.5, 1001])
      expect(CallSchema.safeParse({ ...call, maxSteps }).success).toBe(false);
  });
});
