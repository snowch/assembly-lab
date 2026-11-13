// Copyright © 2026 Christopher Snow

import { describe, expect, it } from "vitest";
import { PLUS } from "../../../../content/lessons/adding-and-the-flags.listings";
import { inputExpression, type InputFormat } from "./input-display";
import { flagsModel } from "./model";

describe("input display readings", () => {
  it.each([
    ["hex", "0x7fffffff + 0x00000001"],
    ["unsigned", "2,147,483,647 + 1"],
    ["signed", "2,147,483,647 + 1"],
  ] satisfies [InputFormat, string][])(
    "formats the given positive inputs as %s",
    (format, expected) => {
      expect(inputExpression(flagsModel(PLUS, 32, 0x7fffffff, 1), format)).toBe(expected);
    },
  );

  it.each([
    ["hex", "0xffffffff + 0x80000000"],
    ["unsigned", "4,294,967,295 + 2,147,483,648"],
    ["signed", "−1 + (−2,147,483,648)"],
  ] satisfies [InputFormat, string][])(
    "retains high-bit-set input readings in %s",
    (format, expected) => {
      expect(inputExpression(flagsModel(PLUS, 32, 0xffffffff, 0x80000000), format)).toBe(expected);
    },
  );
});
