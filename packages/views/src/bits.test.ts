// Copyright © 2026 Christopher Snow

// What Module 3's figures share: a typed word read as 32 bits, a word written in hexadecimal, the
// phrase for a list of bit numbers, and the number pad's sign.

import { describe, expect, it } from "vitest";

import {
  bitList,
  bitString,
  differing,
  fieldOf,
  hex,
  parseWord,
  range,
  signedOf,
  unsignedOf,
} from "./bits";
import { negated, numberOf, withDigit, withoutLastDigit } from "./tap";

describe("a word the learner types", () => {
  it("is decimal, with a minus sign allowed, or 0x and hexadecimal, read as 32 bits", () => {
    expect(parseWord("53")).toBe(53);
    expect(parseWord("0x35")).toBe(0x35);
    expect(parseWord("0X35")).toBe(0x35);
    expect(parseWord(" 0xfffffff9 ")).toBe(0xfffffff9);
    expect(parseWord("-7")).toBe(0xfffffff9);
    expect(parseWord("4294967295")).toBe(0xffffffff);
    expect(parseWord("-2147483648")).toBe(0x80000000);
  });

  it("is refused when it is not a number of 32 bits", () => {
    for (const text of ["", "x", "0x", "0x123456789", "4294967296", "-2147483649", "1.5", "5 5"])
      expect(parseWord(text), text).toBeNull();
  });
});

describe("a word written out", () => {
  it("is 0x and the digits with no leading zeros, and has an unsigned and a signed reading", () => {
    expect(hex(0x35)).toBe("0x35");
    expect(hex(-5)).toBe("0xfffffffb");
    expect(hex(0)).toBe("0x0");
    expect(unsignedOf(-7)).toBe(4294967289);
    expect(signedOf(0xfffffff9)).toBe(-7);
  });

  it("has fields", () => {
    expect(fieldOf(0x35, 4, 6)).toBe(3);
    expect(fieldOf(0xffffffff, 0, 31)).toBe(0xffffffff);
    expect(fieldOf(0x35, 0, 0)).toBe(1);
  });
});

describe("bits", () => {
  it("are listed as a phrase", () => {
    expect(bitList([2])).toBe("2");
    expect(bitList([3, 2])).toBe("2 and 3");
    expect(bitList([6, 0, 2])).toBe("0, 2 and 6");
    expect(bitList([])).toBe("");
  });

  it("differ where two words differ, and are read from a word highest first", () => {
    expect([...differing(0xf, 0xb)]).toEqual([2]);
    expect(range(4, 6)).toEqual(new Set([4, 5, 6]));
    expect(bitString(0x35, [0, 1, 2, 3])).toBe("0101");
    expect(bitString(0x35, range(4, 6))).toBe("011");
  });
});

describe("the number pad's sign", () => {
  it("is kept as digits are pressed, and changed by the sign key", () => {
    expect(withDigit("", "1")).toBe("1");
    expect(withDigit("1", "1")).toBe("11");
    expect(withDigit("0", "5")).toBe("5");
    expect(withDigit(negated("11"), "3")).toBe("-113");
    expect(negated("")).toBe("");
    expect(negated("-113")).toBe("113");
    expect(withDigit("-0", "5")).toBe("-5");
  });

  it("loses the minus sign with its last digit", () => {
    expect(withoutLastDigit("-113")).toBe("-11");
    expect(withoutLastDigit("-1")).toBe("");
    expect(withoutLastDigit("7")).toBe("");
  });

  it("is read from an operand only where the slot is signed", () => {
    expect(numberOf("#-113", true)).toBe("-113");
    expect(numberOf("-113", true)).toBe("-113");
    expect(numberOf("#-113")).toBeNull();
    expect(numberOf("#113", true)).toBe("113");
  });
});
