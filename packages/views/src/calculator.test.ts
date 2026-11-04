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
  ["2^31", "2147483648"],
  ["2^64", "18446744073709551616"],
  ["2^8 + 4", "260"],
  ["3 * 2^4 + 1", "49"],
  ["2^3^2", "512"],
  ["(2^3)^2", "64"],
  ["-2^2", "-4"],
  ["(-2)^2", "4"],
  ["(-2)^3", "-8"],
  ["2^+3", "8"],
  ["2^(7 - 7)", "1"],
  ["0^0", "1"],
  ["0^8", "0"],
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
  "2^",
  "^2",
  "2^^3",
  "2^1.5",
])("rejects unsupported or incomplete input: %s", (expression) => {
  expect(calculate(expression)).toEqual({ error: "invalid" });
});
it("reports empty, unbounded, zero-divisor and nonintegral work without rounding", () => {
  expect(calculate(" ")).toEqual({ error: "empty" });
  expect(calculate("1".repeat(201))).toEqual({ error: "large" });
  expect(calculate("5 / (3-3)")).toEqual({ error: "zeroDivision" });
  expect(calculate("-5 / 2")).toEqual({ error: "fraction" });
  expect(calculate("2^-1")).toEqual({ error: "negativePower" });
  expect(calculate("2^(1-3)")).toEqual({ error: "negativePower" });
  expect(calculate("2^(3/2)")).toEqual({ error: "fraction" });
  expect(calculate("2^4097")).toEqual({ error: "large" });
  expect(calculate("2^(2^64)")).toEqual({ error: "large" });
  expect(calculate("(2^4096)^4")).toEqual({ error: "large" });
  expect(calculate("2^4096")).toEqual({ value: (2n ** 4096n).toString() });
  expect(calculate("(2^4096)^3 * 2^4095")).toEqual({ value: (2n ** 16383n).toString() });
  expect(calculate("(2^4096)^3 * 2^4095 * 2")).toEqual({ error: "large" });
});
