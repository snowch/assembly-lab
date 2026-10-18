// Copyright © 2026 Christopher Snow
import { describe, expect, it } from "vitest";
import { runC } from "./compilerRun";
import { parseListing } from "./listing";
import { viewAt } from "./trace";
describe("C preflight and emitted A64", () => {
  it("keeps source lines, including comments and blank lines, mapped to actual instructions", () => {
    const source = "// test\n\nunsigned charge(unsigned value)\n{\n    return value + 7;\n}";
    const r = runC(source, [6]);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value).toBe(13);
    expect(r.program.c).toBe(source);
    const lines = parseListing(r.program.listing).filter((l) => l.kind === "instruction");
    expect(lines.every((l) => l.kind === "instruction" && l.cLine === 5)).toBe(true);
    expect(viewAt(r.trace, 1).litC).toBe(5);
  });
  it.each([
    ["unsigned f(unsigned x) { return 7 / x; }", [0], "division-zero"],
    ["unsigned f(unsigned x) { return x << 32; }", [1], "shift-range"],
    ["unsigned f(void) { return 2147483647 + 1; }", [], "signed-overflow"],
    ["unsigned f(unsigned x) { while (x != 0) { x = x; } return x; }", [1], "step-limit"],
    ["unsigned f(unsigned x) { return x; }", [-1], "argument-range"],
    ["unsigned f(unsigned x) { return x; }", [], "argument-count"],
  ] as const)("rejects %s before producing a machine trace", (source, args, code) => {
    const result = runC(source, args);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.stage).toBe("evaluate");
    expect(result.diagnostics[0]!.code).toBe(code);
    expect("trace" in result).toBe(false);
  });
  it("accepts a branch that avoids division by zero and rejects malformed or unsupported C", () => {
    expect(runC("unsigned f(unsigned x) { if (x == 0) { return 0; } return 7 / x; }", [0]).ok).toBe(
      true,
    );
    const invalid = runC("int f(int x) { return x; }", [1]);
    expect(invalid.ok).toBe(false);
    if (!invalid.ok) expect(invalid.stage).toBe("compile");
  });
});

it("preserves an instruction-budget stop after successful C evaluation", () => {
  const source =
    "unsigned f(unsigned count) { unsigned total=0; for(unsigned i=0;i<count;i++){total=total+1;} return total; }";
  const result = runC(source, [800]);
  expect(result.ok).toBe(false);
  if (!result.ok && result.stage === "machine")
    expect(result.stop).toEqual({ kind: "limit", steps: 10000 });
  else throw Error("Expected the machine budget, not a C evaluation failure");
});
