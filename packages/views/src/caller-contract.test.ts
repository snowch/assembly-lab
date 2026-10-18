// Copyright © 2026 Christopher Snow
import { describe, expect, it } from "vitest";
import { assemble, run, STACK_TOP } from "@al/machine";
import { Challenge } from "@platform/lesson-schema";
import { gradeWritten } from "./grader";

const reference =
  "keep:\n stp x19, x30, [sp, -16]!\n mov x19, 7\n mov w0, 5\n ldp x19, x30, [sp], 16\n ret";
const challenge = Challenge.parse({
  id: "caller-contract",
  title: "Caller contract",
  task: "Restore the caller state.",
  gradedDirection: "write",
  palette: ["x19", "x30", "sp"],
  allowedConstructs: ["stp", "ldp", "mov", "ret", "sub", "add"],
  initial: { text: "mov w0, 5\nret" },
  tests: {
    kind: "answers",
    grader: "run-registers",
    cases: [0, "0xfedcba9876543210"].map((seed) => ({
      label: "caller",
      given: { "seed.x19": seed },
      expect: { w0: 5, x19: seed, sp: STACK_TOP },
    })),
  },
  hints: ["a", "b", "c", "d", "e"],
  reference: { text: reference },
});

describe("callee preservation exercises", () => {
  it("checks nonzero exact caller values and the restored stack", () => {
    expect(gradeWritten(challenge, { text: reference }).passed).toBe(true);
    const clobbered = gradeWritten(challenge, { text: "mov w0, 5\nmov x19, 0\nret" });
    expect(clobbered.passed).toBe(false);
    expect(clobbered.failures).toHaveLength(1);
    const leaked = gradeWritten(challenge, { text: "mov w0, 5\nsub sp, sp, 16\nret" });
    expect(leaked.passed).toBe(false);
    expect(leaked.failures[0]?.actual["sp"]).toBe(String(STACK_TOP - 16));
  });
  it("initialises each call independently and rejects non-preserved register seeds", () => {
    const program = assemble("ret").program!;
    expect(run(program, { entry: 0x400000, preserved: { 19: -1n } }).initial.x[19]).toBe(
      0xffffffffffffffffn,
    );
    expect(run(program, { entry: 0x400000 }).initial.x[19]).toBe(0n);
    expect(() => run(program, { entry: 0x400000, preserved: { 30: 0n } })).toThrow();
    expect(() => run(program, { entry: 0x400000, preserved: { 0: 0n } })).toThrow();
  });
});
