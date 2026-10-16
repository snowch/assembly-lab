// Copyright © 2026 Christopher Snow

// A register read three ways: the readings are what the model's `w0` holds, and the sums the page
// draws add up to them. Every claim is checked on patterns the lessons use and on many others.

import { describe, expect, it } from "vitest";

import {
  MINUS,
  NO_BITS,
  isPattern,
  patternOf,
  readingsOfPattern,
  readingsOfValue,
  shown,
  stateHolding,
  wholeNumber,
  worths,
} from "./readings";

/** Patterns that cover the corners, and a spread of others made from a fixed seed. */
function patterns(): string[] {
  const out = [
    NO_BITS,
    "1".repeat(32),
    "1" + "0".repeat(31),
    "0" + "1".repeat(31),
    "1".repeat(28) + "0100",
  ];
  let seed = 12345;
  for (let i = 0; i < 300; i++) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const hi = seed.toString(2).padStart(31, "0");
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    out.push((seed & 1 ? "1" : "0") + hi);
  }
  return out;
}

describe("a pattern put in w0 by the model", () => {
  it("is the register's value, read unsigned, in hexadecimal and signed", () => {
    const r = readingsOfPattern("1".repeat(28) + "0100");
    expect(r.digits).toBe("fffffff4");
    expect(r.unsigned).toBe(4294967284);
    expect(r.signed).toBe(-12);
    expect(r.pattern).toBe("1".repeat(28) + "0100");
  });

  it("leaves the upper half of x0 clear, because it is written through w0", () => {
    expect(stateHolding("1".repeat(32)).x[0]).toBe(0xffffffffn);
  });

  it("gives back every pattern it is given, with the readings arithmetic gives", () => {
    for (const p of patterns()) {
      const r = readingsOfPattern(p);
      expect(r.pattern).toBe(p);
      expect(r.unsigned).toBe(parseInt(p, 2));
      expect(r.signed).toBe(p[0] === "1" ? parseInt(p, 2) - 2 ** 32 : parseInt(p, 2));
      expect(r.digits).toBe(r.unsigned.toString(16).padStart(8, "0"));
    }
  });

  it("refuses text that is not 32 bits", () => {
    expect(isPattern("1".repeat(31))).toBe(false);
    expect(isPattern("1".repeat(31) + "2")).toBe(false);
    expect(() => stateHolding("101")).toThrow();
  });

  it("is the same by value as by pattern", () => {
    expect(readingsOfValue(-12)).toEqual(readingsOfPattern(patternOf(-12)));
    expect(readingsOfValue(4294967284)).toEqual(readingsOfValue(-12));
    expect(readingsOfValue(0xffffff38n).signed).toBe(-200);
  });
});

describe("the sums the page draws", () => {
  it("add up to the model's reading, for every pattern", () => {
    for (const p of patterns()) {
      const r = readingsOfPattern(p);
      expect(worths(p, "unsigned").reduce((a, b) => a + b, 0)).toBe(r.unsigned);
      expect(worths(p, "signed").reduce((a, b) => a + b, 0)).toBe(r.signed);
    }
  });

  it("differ only in the top bit: plus 2147483648 unsigned, minus 2147483648 signed", () => {
    const p = "1".repeat(28) + "0100";
    const [u0, ...u] = worths(p, "unsigned");
    const [s0, ...s] = worths(p, "signed");
    expect([u0, s0]).toEqual([2147483648, -2147483648]);
    expect(s).toEqual(u);
    expect(u.at(-1)).toBe(4);
  });

  it("have no term for a bit that is 0, and none at all for no bits", () => {
    expect(worths(NO_BITS, "unsigned")).toEqual([]);
    expect(worths("0".repeat(31) + "1", "signed")).toEqual([1]);
    expect(worths("1" + "0".repeat(31), "signed")).toEqual([-2147483648]);
  });

  it("worth twice the bit to the right, from 1 up to 2147483648", () => {
    const all = worths("1".repeat(32), "unsigned");
    expect(all[0]).toBe(2147483648);
    expect(all.at(-1)).toBe(1);
    for (let i = 1; i < all.length; i++) expect(all[i - 1]).toBe(2 * (all[i] as number));
  });
});

describe("numbers as the page and the learner write them", () => {
  it("shows a negative number with the minus sign the lessons use", () => {
    expect(shown(-12)).toBe(`${MINUS}12`);
    expect(shown(4294967284)).toBe("4294967284");
    expect(shown(0)).toBe("0");
  });

  it("reads a whole number written with a hyphen or the minus sign, and nothing else", () => {
    expect(wholeNumber("-200")).toBe(-200n);
    expect(wholeNumber(` ${MINUS}200 `)).toBe(-200n);
    expect(wholeNumber("42")).toBe(42n);
    for (const bad of ["", "4.5", "0x2a", "1e3", "--1", "4 2", undefined]) {
      expect(wholeNumber(bad), String(bad)).toBeNull();
    }
  });
});
