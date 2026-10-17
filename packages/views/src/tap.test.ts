// Copyright © 2026 Christopher Snow

// The tap editor's model of a line: read out of the text, changed, and put back as text.

import { describe, expect, it } from "vitest";

import {
  linesOf,
  lineText,
  numberOf,
  parseLine,
  replaceLine,
  splitOperands,
  textOf,
  withInstruction,
  withOperand,
} from "./tap";

describe("a line", () => {
  it("is an instruction and its operands", () => {
    expect(parseLine("  SUB w0, w0,w1 ")).toEqual({
      mnemonic: "sub",
      operands: ["w0", "w0", "w1"],
    });
    expect(parseLine("ret")).toEqual({ mnemonic: "ret", operands: [] });
    expect(parseLine("")).toEqual({ mnemonic: "", operands: [] });
  });

  it("splits at commas outside brackets, and keeps a gap", () => {
    expect(splitOperands("x0, [x1, 8]")).toEqual(["x0", "[x1, 8]"]);
    expect(splitOperands("w0, , w1")).toEqual(["w0", "", "w1"]);
    expect(splitOperands("w0,")).toEqual(["w0", ""]);
    expect(splitOperands("")).toEqual([]);
  });

  it("is written back as text, dropping operands left empty at the end", () => {
    expect(lineText({ mnemonic: "sub", operands: ["w0", "w0", "w1"] })).toBe("sub w0, w0, w1");
    expect(lineText({ mnemonic: "sub", operands: ["w0", "", ""] })).toBe("sub w0");
    expect(lineText({ mnemonic: "sub", operands: ["", "", "w1"] })).toBe("sub , , w1");
    expect(lineText({ mnemonic: "ret", operands: [] })).toBe("ret");
  });

  it("keeps the operands that still fit when its instruction changes", () => {
    const line = parseLine("add w0, w1, w2");
    expect(withInstruction(line, "sub")).toEqual({ mnemonic: "sub", operands: ["w0", "w1", "w2"] });
    expect(withInstruction(line, "ret")).toEqual({ mnemonic: "ret", operands: [] });
  });

  it("clears an operand that does not fit the slot it lands in, and keeps the ones that do", () => {
    // A number is not a label: `mov w0, 0` changed to `cbz` must not branch to 0.
    const cbz = withInstruction(parseLine("mov w0, 0"), "cbz");
    expect(cbz).toEqual({ mnemonic: "cbz", operands: ["w0", ""] });
    expect(lineText(cbz)).toBe("cbz w0");
    // A label is not a register or a number.
    expect(withInstruction(parseLine("cbz w0, .Llow"), "mov")).toEqual({
      mnemonic: "mov",
      operands: ["w0", ""],
    });
    expect(withInstruction(parseLine("cbz w0, .Llow"), "cbnz").operands).toEqual(["w0", ".Llow"]);
    expect(withInstruction(parseLine("cmp w0, #10"), "mov").operands).toEqual(["w0", "#10"]);
    // A register is not a condition, and a condition is not a register.
    expect(withInstruction(parseLine("csel w0, w1, w2, w3"), "csel").operands).toEqual([
      "w0",
      "w1",
      "w2",
      "",
    ]);
    expect(withInstruction(parseLine("cset w0, ge"), "csel").operands).toEqual(["w0", ""]);
    // The number of `movk`, and its shift.
    expect(withInstruction(parseLine("mov w0, 5"), "movk").operands).toEqual(["w0", "5"]);
    expect(withInstruction(parseLine("movk w0, 5, lsl 16"), "movk").operands).toEqual([
      "w0",
      "5",
      "lsl 16",
    ]);
  });

  it("takes an operand at any place, leaving gaps before it", () => {
    expect(lineText(withOperand(parseLine("sub"), 2, "w1"))).toBe("sub , , w1");
    expect(lineText(withOperand(parseLine("sub w0, w1, w0"), 1, "w0"))).toBe("sub w0, w0, w0");
  });

  it("reads a constant with or without the #", () => {
    expect(numberOf("#50")).toBe("50");
    expect(numberOf("50")).toBe("50");
    expect(numberOf("w0")).toBeNull();
    expect(numberOf("#")).toBeNull();
  });
});

describe("lines and text", () => {
  it("round-trip, a blank last line included", () => {
    for (const lines of [[], ["a"], ["a", "b"], [""], ["a", ""], ["", "a", "", ""]]) {
      expect(linesOf(textOf(lines)), JSON.stringify(lines)).toEqual(lines);
    }
  });

  it("do not count a final newline as a line", () => {
    expect(linesOf("a\nb\n")).toEqual(["a", "b"]);
    expect(linesOf("")).toEqual([]);
  });
});

describe("renaming a label", () => {
  const program = [
    "cbz w0, .Lempty",
    "cmp w0, w1",
    "b.cc .Llow",
    "mov w0, 0",
    "ret",
    ".Llow:",
    "mov w0, 1",
    "ret",
    ".Lempty:",
    "mov w0, 2",
    "ret",
  ];

  it("takes every branch to the old name to the new one", () => {
    expect(replaceLine(program, 5, ".Lok:")).toEqual([
      "cbz w0, .Lempty",
      "cmp w0, w1",
      "b.cc .Lok",
      "mov w0, 0",
      "ret",
      ".Lok:",
      "mov w0, 1",
      "ret",
      ".Lempty:",
      "mov w0, 2",
      "ret",
    ]);
    const renamed = replaceLine(program, 8, ".Lzero:");
    expect(renamed[0]).toBe("cbz w0, .Lzero");
    expect(renamed[2]).toBe("b.cc .Llow");
  });

  it("leaves a line that is not a label alone, and a label given the name it has", () => {
    expect(replaceLine(program, 3, "mov w0, 7")[3]).toBe("mov w0, 7");
    expect(replaceLine(program, 3, "mov w0, 7").filter((l, i) => l !== program[i])).toEqual([
      "mov w0, 7",
    ]);
    expect(replaceLine(program, 5, ".Llow:")).toEqual(program);
    // A label line turned into an instruction renames nothing.
    expect(replaceLine(program, 5, "ret")[2]).toBe("b.cc .Llow");
  });

  it("changes only a name in a label slot: the same word as a register or a number stays", () => {
    const odd = ["mov w0, 5", "b .L5", ".L5:", "ret"];
    expect(replaceLine(odd, 2, ".Lx:")).toEqual(["mov w0, 5", "b .Lx", ".Lx:", "ret"]);
  });
});
