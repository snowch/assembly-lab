// Copyright © 2026 Christopher Snow
import { describe, expect, it } from "vitest";
import { DATA_BASE } from "@al/machine";
import { Challenge } from "@platform/lesson-schema";
import { argumentsGiven, machineArgs, memoryBytes, withMemory } from "./call";
import { gradeWritten } from "./grader";
import { MemoryCallSchema } from "./interactives/props";
import { memoryAt, traceOf } from "./trace";

const bytes = [17, 34, 51, 68, 85, 102, 119, 136];
const pointer = { value: DATA_BASE, width: 64 as const };

describe("exact-width memory calls", () => {
  it("preserves 64-bit values above JavaScript's exact-number range", () => {
    const trace = traceOf(
      { listing: "keep:\n  ret" },
      {
        entry: "keep",
        args: [{ value: "0xfedcba9876543211", width: 64 }],
      },
    );
    expect(trace.result.initial.x[0]).toBe(0xfedcba9876543211n);
    expect(trace.result.final.x[0]).toBe(0xfedcba9876543211n);
    expect(() => machineArgs([{ value: 9007199254740992, width: 64 }])).toThrow();
    expect(
      MemoryCallSchema.safeParse({ entry: "keep", args: [{ value: "1.5", width: 64 }] }).success,
    ).toBe(false);
  });

  it("keeps legacy numeric arguments as 32-bit writes", () => {
    expect(machineArgs([-1, 0x100000001])).toEqual([
      { value: -1n, width: 32 },
      { value: 0x100000001n, width: 32 },
    ]);
    const trace = traceOf({ listing: "keep:\n  ret" }, { entry: "keep", args: [-1] });
    expect(trace.result.initial.x[0]).toBe(0xffffffffn);
  });

  it("loads real little-endian fixture bytes through x0", () => {
    const trace = traceOf(
      { listing: "read:\n  ldr x1, [x0]\n  ret" },
      {
        entry: "read",
        args: [pointer],
        memory: bytes,
      },
    );
    expect(trace.result.stop.kind).toBe("returned");
    expect(trace.result.final.x[1]).toBe(0x8877665544332211n);
    expect(trace.result.steps[0]?.loads).toEqual([{ address: DATA_BASE, size: 8 }]);
  });

  it("reconstructs overlapping stores at each step and starts each run with a fresh fixture", () => {
    const program = { listing: "write:\n  str w1, [x0]\n  strb w2, [x0, 1]\n  ret" };
    const call = { entry: "write", args: [pointer, 0x12345678, 255], memory: bytes };
    const trace = traceOf(program, call);
    expect(memoryAt(trace, 0, DATA_BASE, 8)).toEqual(bytes);
    expect(memoryAt(trace, 1, DATA_BASE, 8)).toEqual([120, 86, 52, 18, 85, 102, 119, 136]);
    expect(memoryAt(trace, 2, DATA_BASE, 8)).toEqual([120, 255, 52, 18, 85, 102, 119, 136]);
    expect(memoryAt(trace, 3, DATA_BASE + 1, 2)).toEqual([255, 52]);
    expect(memoryAt(traceOf(program, call), 0, DATA_BASE, 8)).toEqual(bytes);
    expect(memoryAt(trace, 0, DATA_BASE - 1, 8)).toBeUndefined();
    expect(() => memoryAt(trace, 4, DATA_BASE, 8)).toThrow();
  });

  it("validates fixture bytes and refuses existing data sections", () => {
    expect(memoryBytes("0xff, 0, 42")).toEqual([255, 0, 42]);
    for (const invalid of ["256", "-1", "1,,2", "1.5", "", "0x100"])
      expect(() => memoryBytes(invalid)).toThrow();
    for (const source of [
      "ret\n.data\n.byte 9",
      "ret\n.DATA\n.byte 9",
      "ret; .data\n.byte 9",
      "ret\na: .data\n.byte 9",
    ])
      expect(() => withMemory(source, [1])).toThrow();
    expect(() => withMemory("ret", Array(4097).fill(0))).toThrow();
    expect(() => argumentsGiven({ x0: "9", w0: 3 })).toThrow();
    expect(() => argumentsGiven({ x1: "9" })).toThrow();
  });
});

const challenge = (
  given: Record<string, string | number>,
  expected: Record<string, string | number>,
) =>
  Challenge.parse({
    id: "memory-runtime",
    title: "Memory",
    task: "Read or write the fixture.",
    gradedDirection: "write",
    palette: ["x0", "w0", "w1", "x1"],
    allowedConstructs: ["ldr", "ldrb", "ldrsb", "str", "strb", "ret", "mov"],
    initial: { text: "ret" },
    tests: {
      kind: "answers",
      grader: "run-registers",
      cases: [{ label: "fixture", given, expect: expected }],
    },
    hints: ["a", "b", "c", "d", "e"],
    reference: { text: "ret" },
  });

describe("written memory grading", () => {
  it("compares all fixture bytes and catches an overwide store", () => {
    const test = challenge(
      { x0: DATA_BASE, w1: 255, memory: bytes.join(",") },
      {
        memory: [255, ...bytes.slice(1)].join(","),
      },
    );
    expect(gradeWritten(test, { text: "strb w1, [x0]\nret" }).passed).toBe(true);
    const verdict = gradeWritten(test, { text: "str w1, [x0]\nret" });
    expect(verdict.passed).toBe(false);
    expect(verdict.failures[0]?.actual["memory"]).toBe("255, 0, 0, 0, 85, 102, 119, 136");
    expect(gradeWritten(test, { text: "ret" }).passed).toBe(false);
  });

  it("compares both views and keeps 64-bit return values exact", () => {
    const test = challenge(
      { x0: DATA_BASE, memory: bytes.join(","), reading: "unsigned" },
      {
        x1: "0x8877665544332211",
        w1: "0x44332211",
      },
    );
    expect(gradeWritten(test, { text: "ldr x1, [x0]\nret" }).passed).toBe(true);
    const failed = gradeWritten(test, { text: "ldr w1, [x0]\nret" });
    expect(failed.passed).toBe(false);
    expect(failed.failures[0]?.expected["x1"]).toBe("9833440827789222417");
  });

  it("uses per-register signed readings without changing bit comparisons", () => {
    const test = challenge(
      { x0: DATA_BASE, memory: "255,255", reading: "unsigned", "reading.w1": "signed" },
      {
        w0: 255,
        w1: -1,
      },
    );
    expect(gradeWritten(test, { text: "ldrsb w1, [x0]\nldrb w0, [x0]\nret" }).passed).toBe(true);
    const failed = gradeWritten(test, { text: "ldrb w1, [x0]\nldrsb w0, [x0]\nret" });
    expect(failed.failures[0]?.actual).toEqual({ w0: "4294967295", w1: "255" });
    expect(failed.failures[0]?.expected).toEqual({ w0: "255", w1: "-1" });
  });

  it("blocks conflicting learner sections and reports invalid pointer accesses as faults", () => {
    const test = challenge({ x0: "0x20000000000001", memory: "1,2,3,4" }, { w0: 0 });
    expect(gradeWritten(test, { text: "ldr w0, [x0]\nret" }).failures[0]?.detail).toContain(
      "20000000000001",
    );
    for (const text of [
      "ret\n.data\n.byte 9",
      "ret\n.DATA\n.byte 9",
      "ret; .data\n.byte 9",
      "ret\na: .data\n.byte 9",
    ])
      expect(gradeWritten(test, { text }).blocked).toBeDefined();
  });

  it("rejects lesson expectations that omit neighbouring fixture bytes", () => {
    const test = challenge({ x0: DATA_BASE, memory: "1,2,3,4" }, { memory: "1" });
    expect(() => gradeWritten(test, { text: "ret" })).toThrow("whole initial fixture");
  });
});
