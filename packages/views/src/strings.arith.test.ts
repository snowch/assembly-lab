// Copyright © 2026 Christopher Snow

// The words of Module 2's figures: none empty, no em dash, every one marked DRAFT until it has been
// through the prose process (so the number of marks is the number of strings), and the tap editor
// able to build the instructions the module's challenge allows.

import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { ARITH_STRINGS } from "./strings.arith";
import { SLOTS, lineText, parseLine, withInstruction, withOperand } from "./tap";

/** Every string in `value`, with where it was found; a function's result for sample arguments. */
function strings(value: unknown, path = "ARITH_STRINGS"): [string, string][] {
  if (typeof value === "string") return [[path, value]];
  if (typeof value === "function")
    return strings((value as (...a: unknown[]) => unknown)("x", 1, 2, 3, 4, 5), `${path}()`);
  if (value && typeof value === "object")
    return Object.entries(value).flatMap(([k, v]) => strings(v, `${path}.${k}`));
  return [];
}

describe("the arithmetic figures' words", () => {
  const all = strings(ARITH_STRINGS);

  it("are none of them empty", () => {
    expect(all.length).toBeGreaterThan(30);
    expect(all.filter(([, s]) => s.trim() === "").map(([p]) => p)).toEqual([]);
  });

  it("have no em dash", () => {
    expect(all.filter(([, s]) => s.includes("—")).map(([p]) => p)).toEqual([]);
  });

  it("went through the prose process, but the six added after Module 2's review: each is marked DRAFT, so it is seen", () => {
    // The rest were redrafted by Haiku and checked for meaning, 16 October 2026. The six marked
    // are the top bit's status sentence and the key under the carry row, the lock on a figure
    // that waits for a challenge, the fixed sentence for a wrong flag and for a wrong value, and
    // the sentence for flags chosen from but not yet chosen.
    const source = readFileSync(new URL("./strings.arith.ts", import.meta.url), "utf8");
    const marked = source.match(/\/\/ DRAFT/g) ?? [];
    expect(marked).toHaveLength(0);
  });
});

describe("the tap editor for the module's instructions", () => {
  it("offers the operands of adds, subs and neg, as it does add and sub", () => {
    expect(SLOTS["adds"]).toEqual(SLOTS["add"]);
    expect(SLOTS["subs"]).toEqual(SLOTS["sub"]);
    expect(SLOTS["neg"]).toEqual(["register", "register"]);
  });

  it("builds sub w0, w0, w1 from a line that holds ret, and neg w1, w1 from sub's operands", () => {
    let line = withInstruction(parseLine("ret"), "sub");
    line = withOperand(withOperand(withOperand(line, 0, "w0"), 1, "w0"), 2, "w1");
    expect(lineText(line)).toBe("sub w0, w0, w1");
    // Changing sub to neg keeps the two operands that still fit.
    expect(lineText(withInstruction(parseLine("sub w1, w1, w0"), "neg"))).toBe("neg w1, w1");
    expect(lineText(withInstruction(parseLine("add w0, w0, w1"), "subs"))).toBe("subs w0, w0, w1");
  });
});
