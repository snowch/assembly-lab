// Copyright © 2026 Christopher Snow
import { describe, expect, it } from "vitest";
import { fitsSlot, lineText, parseLine, replaceLine, withInstruction, withOperand } from "./tap";
describe("complete memory address operands", () => {
  it.each([
    "[x0]",
    "[x0, #4]",
    "[x0, #-4]!",
    "[x0], #4",
    "[x0, x1, lsl #2]",
    "[x3, x0]",
    "[x0, w1, uxtw #2]",
    "[sp, #-16]!",
    "[sp], #16",
    "[sp, -32]!",
    "[sp, 16]",
    "[sp], 32",
  ])("keeps %s as one address through parsing and instruction edits", (address) => {
    const line = `ldr w2, ${address}`;
    expect(fitsSlot(address, "address")).toBe(true);
    expect(parseLine(line).operands).toEqual(["w2", address]);
    expect(lineText(parseLine(line))).toBe(line);
    expect(lineText(withInstruction(parseLine(line), "str"))).toBe(`str w2, ${address}`);
  });
  it("replacing a post-index address leaves no stale third operand", () => {
    expect(lineText(withOperand(parseLine("ldr w2, [x0], #4"), 1, "[x0, #4]!"))).toBe(
      "ldr w2, [x0, #4]!",
    );
    expect(lineText(withOperand(parseLine("ldp x29, x30, [sp], #16"), 2, "[sp, #16]"))).toBe(
      "ldp x29, x30, [sp, #16]",
    );
  });
  it("keeps pair operands and updates direct-call targets when labels change", () => {
    expect(parseLine("ldp x29, x30, [sp], #16").operands).toEqual(["x29", "x30", "[sp], #16"]);
    expect(replaceLine(["bl helper", "helper:", "ret"], 1, "other:")).toEqual([
      "bl other",
      "other:",
      "ret",
    ]);
  });
});
