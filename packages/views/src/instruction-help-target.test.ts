// Copyright © 2026 Christopher Snow

import { describe, expect, it } from "vitest";
import { instructionHelpForm } from "./instruction-help-target";

describe("operand-specific reference targets", () => {
  it.each([
    ["add", "add w0, w0, 4294966296", "immediate"],
    ["sub", "sub w8, w9, w10", "register"],
    ["adds", "here: adds x8, x9, #2, lsl #12", "immediate"],
    ["add", "add x8, x9, w10, sxtw #2", "extended-register"],
    ["add", "add w8, w9, w10, lsr #2", "shifted-register"],
    ["lsr", "lsr x8, x9, #64", "immediate"],
    ["asr", "asr w8, w9, w10", "register"],
    ["movk", "movk x8, #0x51, lsl #64", "shifted-immediate"],
    ["ldr", "ldr x8, [x9]", "base"],
    ["str", "str x8, [x9, #8]", "immediate-offset"],
    ["ldp", "ldp x8, x10, [x9, #16]!", "pre-index"],
    ["str", "str x8, [x9], #8", "post-index"],
    ["ldr", "ldr w8, [x9, w10, uxtw #2]", "register-offset"],
    ["b.cond", "here: b.eq missing", "label-condition"],
    ["tbz", "tbz w8, #32, target", "register-bit-label"],
    ["csel", "csel w8, w9, w10, ne", "register-condition"],
    ["ret", "ret", "default"],
    ["ret", "ret x9", "register"],
    ["sxtb", "sxtb x8, x9", "x-result"],
    ["sxtb", "sxtb w8, x9", "w-result"],
    ["uxtb", "uxtb x8, x9", "x-spelling"],
    ["uxth", "uxth w8, x9", "w-result"],
    ["sxtw", "sxtw x8, x9", "x-result"],
    ["ubfx", "ubfx w8, w9, #31, #2", "field"],
  ])("%s selects the matching form for %s", (mnemonic, line, expected) => {
    expect(instructionHelpForm(mnemonic!, line!)).toBe(expected);
  });
});
