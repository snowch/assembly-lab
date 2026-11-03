// Copyright © 2026 Christopher Snow

import { expect, it } from "vitest";
import { calculate } from "./calculator";

it.each([
  ["2,147,483,648 + 2,147,483,645", "4294967293"],
  ["-2,147,483,648 + 2,147,483,645", "-3"],
  ["12 + 3 * (8 - 2)", "30"],
  ["−18 ÷ (-3) × 2", "12"],
  ["9007199254740993 + 1", "9007199254740994"],
  ["1 - -2", "3"],
  ["0 / -7", "0"],
])("evaluates exact scratch arithmetic: %s", (expression, value) => {
  expect(calculate(expression)).toEqual({ value });
});
it.each([
  "0xfffffffd",
  "1e3",
  "1.5",
  "1,23",
  "12 34",
  "2(3)",
  "1 +",
  "(2+3",
  "2**3",
  "alert(1)",
  "1;2",
])("rejects unsupported or incomplete input: %s", (expression) => {
  expect(calculate(expression)).toEqual({ error: "invalid" });
});
it("reports empty, unbounded, zero-divisor and nonintegral work without rounding", () => {
  expect(calculate(" ")).toEqual({ error: "empty" });
  expect(calculate("1".repeat(201))).toEqual({ error: "large" });
  expect(calculate("5 / (3-3)")).toEqual({ error: "zeroDivision" });
  expect(calculate("-5 / 2")).toEqual({ error: "fraction" });
});
