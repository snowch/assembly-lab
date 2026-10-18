// Copyright © 2026 Christopher Snow

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { assemble, run, stateAfter, STACK_TOP, RETURN_ADDRESS } from "@al/machine";
import { assemblyOf, parseListing, traceOf } from "@al/views";
import { stackFrames } from "../../packages/views/src/stack";
import {
  REPORT,
  FADE_SUM,
  FADE_TEXT,
  FADE_STARTING_TEXT,
  CALL_TEXT,
  CALL_STARTING_TEXT,
  RESERVE_TEXT,
  RESERVE_STARTING_TEXT,
  COUNT_TEXT,
  COUNT_STARTING_TEXT,
  WRONG_LINK,
  WRONG_FADE,
} from "./calls.listings";

const execute = (text: string, entry: string, args: number[], maxSteps = 1000) => {
  const built = assemble(text);
  expect(built.errors).toEqual([]);
  return run(built.program!, {
    entry,
    args: args.map((value) => ({ value: BigInt(value), width: 32 })),
    preserved: { 19: 0x123456789abcdef0n, 29: 0x1122334455667788n },
    maxSteps,
  });
};

describe("Module 9 recorded compiler evidence", () => {
  for (const [name, recorded] of [
    ["report", REPORT],
    ["fade-sum", FADE_SUM],
  ] as const) {
    it(`${name} preserves the exact instructions and source mapping`, () => {
      const base = `docs/notes/module-9/compiler/${name}`;
      const request = JSON.parse(readFileSync(base + ".request.json", "utf8"));
      const response = JSON.parse(readFileSync(base + ".response.json", "utf8"));
      expect(request.options.userArguments).toBe("-O1 -fno-inline");
      expect(response.code).toBe(0);
      expect(request.source).toBe(readFileSync(base + ".c", "utf8"));
      expect(recorded.c).toBe(request.source.split("\n").slice(1).join("\n").trimEnd());
      const lines = response.asm
        .filter((l: { text: string }) => l.text.trim())
        .map(
          (l: { text: string; source?: { line: number } | null }) =>
            l.text.trim() + (l.source ? ` C${l.source.line - 1}` : ""),
        );
      expect(recorded.listing).toBe(lines.join("\n"));
    });
  }
});

describe("Module 9 calls and stack facts", () => {
  it("BL writes the instruction after the call, RET visits it, and outer RET reaches its caller", () => {
    const trace = traceOf(REPORT, { entry: "trip_report", args: [128, 9] });
    const call = trace.result.steps.find((s) => s.text.startsWith("bl "))!;
    expect(call.writes.find((w) => w.reg === 30)?.after).toBe(BigInt(call.address + 4));
    const returns = trace.result.steps.filter((s) => s.text === "ret");
    expect(returns.map((s) => s.nextPc)).toEqual([call.address + 4, RETURN_ADDRESS]);
    expect(trace.result.final.x[0]).toBe(73n);
    expect(trace.result.steps).toHaveLength(11);
    expect(trace.result.final.sp).toBe(BigInt(STACK_TOP));
  });
  it("the compiler saves the full link, frame pointer and x19 in a 32-byte frame", () => {
    const r = execute(assemblyOf(parseListing(REPORT.listing)), "trip_report", [128, 9]);
    expect(r.stop.kind).toBe("returned");
    expect(r.final.x[19]).toBe(0x123456789abcdef0n);
    expect(r.final.x[29]).toBe(0x1122334455667788n);
    expect(r.steps.some((s) => s.spMisaligned)).toBe(false);
    expect(Math.min(...r.steps.map((_, i) => Number(stateAfter(r, i).sp)))).toBe(STACK_TOP - 32);
  });
  it("the missing link save repeats its own return continuation", () => {
    const t = traceOf(WRONG_LINK, { entry: "report_once", args: [128], maxSteps: 20 });
    expect(t.result.stop).toEqual({ kind: "limit", steps: 20 });
    expect(
      t.result.steps.filter((s) => s.text === "ret").every((s) => s.nextPc !== RETURN_ADDRESS),
    ).toBe(true);
    expect(t.result.final.sp).toBe(BigInt(STACK_TOP));
  });
  const inputs = [0, 1, 7, 128, 0xffffffff];
  for (const [text, entry, answers] of [
    [CALL_TEXT, "report_once", [1, 1, 4, 65, 2147483648]],
    [FADE_TEXT, "fade_sum", [0, 1, 11, 255, 4294967262]],
    [COUNT_TEXT, "lit_count", [0, 1, 3, 8, 32]],
  ] as const) {
    it.each(inputs)(`${entry} input %i computes the result and preserves caller state`, (value) => {
      const r = execute(text, entry, [value]);
      expect(r.stop.kind).toBe("returned");
      expect(r.final.x[0]).toBe(BigInt(answers[inputs.indexOf(value)]!));
      expect(r.final.x[19]).toBe(0x123456789abcdef0n);
      expect(r.final.x[29]).toBe(0x1122334455667788n);
      expect(r.final.sp).toBe(BigInt(STACK_TOP));
      expect(r.steps.some((s) => s.spMisaligned)).toBe(false);
    });
  }
  it.each([
    [0, 9, 9],
    [1, 0, 0],
    [7, 2, 5],
    [128, 9, 73],
    [0xffffffff, 0xffffffff, 2147483646],
  ])("reserve call (%i,%i) survives a helper changing w1", (a, b, want) => {
    const r = execute(RESERVE_TEXT, "trip_report", [a, b]);
    expect(r.stop.kind).toBe("returned");
    expect(r.final.x[0]).toBe(BigInt(want));
    expect(r.final.x[1]).toBe(0n);
    expect(r.final.x[19]).toBe(0x123456789abcdef0n);
    expect(r.final.sp).toBe(BigInt(STACK_TOP));
  });
  it("each recursive invocation has its own stored values, then every allocation is released", () => {
    const trace = traceOf(FADE_SUM, { entry: "fade_sum", args: [7] });
    expect(trace.result.steps).toHaveLength(48);
    expect(trace.result.final.x[0]).toBe(11n);
    const peak = stackFrames(trace, 22);
    expect(peak).toHaveLength(4);
    expect(peak.map((f) => f.top - f.base)).toEqual([32, 32, 32, 32]);
    expect(peak.map((f) => f.base)).toEqual([
      STACK_TOP - 32,
      STACK_TOP - 64,
      STACK_TOP - 96,
      STACK_TOP - 128,
    ]);
    expect(stackFrames(trace, 48)).toEqual([]);
    expect(trace.result.final.sp).toBe(BigInt(STACK_TOP));
    const calls = trace.result.steps.filter((s) => s.text === "bl fade_sum");
    expect(calls.map((s) => Number(stateAfter(trace.result, s.index - 1).x[0]))).toEqual([3, 1, 0]);
  });
  it("zero is a real base case, but unchanged nonzero brightness consumes more stack", () => {
    const zero = execute(FADE_TEXT, "fade_sum", [0]);
    expect(zero.stop.kind).toBe("returned");
    expect(zero.steps).toHaveLength(9);
    const t = traceOf(WRONG_FADE, { entry: "fade_sum", args: [7], maxSteps: 32 });
    expect(t.result.stop).toEqual({ kind: "limit", steps: 32 });
    expect(t.result.final.x[0]).toBe(7n);
    expect(t.result.final.sp).toBeLessThan(BigInt(STACK_TOP - 32));
  });
  it("the deliberately broken exercise starters fail their intended cases", () => {
    expect(execute(CALL_STARTING_TEXT, "report_once", [128], 20).stop.kind).toBe("limit");
    expect(execute(RESERVE_STARTING_TEXT, "trip_report", [128, 9]).final.x[0]).toBe(64n);
    expect(execute(FADE_STARTING_TEXT, "fade_sum", [7]).final.x[0]).toBe(7n);
    expect(execute(COUNT_STARTING_TEXT, "lit_count", [7]).final.x[0]).toBe(0n);
  });
});

describe("Module 9 published programs have real-tool corpus copies", () => {
  for (const [name, text] of [
    ["report-gcc", assemblyOf(parseListing(REPORT.listing))],
    ["fade-sum-gcc", FADE_TEXT],
    ["call-text", CALL_TEXT],
    ["call-starting-text", CALL_STARTING_TEXT],
    ["reserve-text", RESERVE_TEXT],
    ["reserve-starting-text", RESERVE_STARTING_TEXT],
    ["count-text", COUNT_TEXT],
    ["count-starting-text", COUNT_STARTING_TEXT],
    ["fade-starting-text", FADE_STARTING_TEXT],
    ["wrong-fade-text", WRONG_FADE.listing],
  ] as const) {
    it(name, () => {
      const source = readFileSync(`scripts/real-tools/corpus/module9-${name}.s`, "utf8");
      const normal = (s: string) =>
        s
          .split("\n")
          .map((l) => l.trim())
          .filter((l) => l && !l.startsWith("//") && l !== ".text")
          .join("\n")
          .replace(/\s+/g, " ");
      expect(normal(source)).toBe(normal(text));
    });
  }
});
