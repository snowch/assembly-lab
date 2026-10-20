// Copyright © 2026 Christopher Snow

// The words Module 3's figures gained in the rework of 17 October 2026 are in strings.ts, each marked
// DRAFT until it has been through the prose process. This test counts the marks, so a new string
// there is a decision somebody sees, and holds the block's strings to the rules every string keeps.

import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { VIEW_STRINGS as S } from "./strings";

const source = readFileSync(new URL("./strings.ts", import.meta.url), "utf8");

describe("the strings of Module 3's rework", () => {
  it("are each marked DRAFT, and these are all the marks in the file", () => {
    // 38 in the block between module3-block-start and module3-block-end ...
    const block = source.slice(
      source.indexOf("module3-block-start"),
      source.indexOf("module3-block-end"),
    );
    expect(block.match(/\/\/ DRAFT/g) ?? []).toHaveLength(38);
    // ... and the 26 in the bit operations' and the shift's objects, which are older strings
    // reworded or added beside them. The 10 of Module 0's operands diagram and its expect ask
    // (the roles of the operands, and the ask before a step) join the count as their own group.
    expect(source.match(/\/\/ DRAFT/g) ?? []).toHaveLength(38 + 26 + 10);
  });

  it("say the rule of each logic operation in one line, as the lesson's list does", () => {
    expect(S.bitOps.rule.and).toBe("AND: a mask bit of 0 clears the bit, and a 1 keeps it.");
    expect(S.bitOps.rule.orr).toBe("OR: a mask bit of 1 sets the bit, and a 0 keeps it.");
    expect(S.bitOps.rule.eor).toBe(
      "Exclusive OR: a mask bit of 1 flips the bit, and a 0 keeps it.",
    );
  });

  it("say what fills the gap of each shift: zeros for lsl and lsr, copies of the old top bit for asr", () => {
    expect(S.shift.rule.lsl).toContain("zeros");
    expect(S.shift.rule.lsr).toContain("zeros");
    expect(S.shift.rule.asr).toContain("copies of the old top bit");
  });

  it("read as sentences with the numbers they are given", () => {
    expect(S.bitOps.column(2, 1, 0, 0)).toBe("Bit 2: input 1, mask 0, result 0.");
    expect(S.bitOps.columnPlain(4, 1, 0)).toBe("Bit 4: input 1, result 0.");
    expect(S.shift.moves("asr", 1, false)).toBe("`asr` moves every bit 1 place right.");
    expect(S.shift.moves("lsl", 3, true)).toBe("`lsl` moves every bit 3 places left.");
    expect(S.maskView.mask("-5", "0xfffffffb")).toBe("The mask is -5, which is 0xfffffffb.");
    expect(S.warning.unused(7, 31)).toBe("Bits 7 to 31 are not used in this example.");
    expect(S.fieldReading.selected(4, 6, "011")).toBe("Bits 6 to 4 are 011.");
  });
});
