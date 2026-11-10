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

it.each([
  ["131075 / 65536", "2"],
  ["131075 - 2 * 65536", "3"],
  ["65535 / 65536", "0"],
  ["65536 / 65536", "1"],
  ["4294967295 / 65536", "65535"],
  ["4294967295 - 65535 * 65536", "65535"],
  ["7 / 2", "3"],
  ["-7 / 2", "-3"],
  ["7 / -2", "-3"],
  ["-7 / -2", "3"],
  ["1 / 2 * 2", "0"],
  ["2^(7 / 2)", "8"],
])("keeps the whole-number part of each division only when opted in: %s", (text, value) => {
  expect(calculate(text, { division: "whole" })).toEqual({ value });
});

it("preserves validation and exact default division alongside the opt-in mode", () => {
  expect(calculate("7 / 2")).toEqual({ error: "fraction" });
  expect(calculate("7 / 2", { division: "exact" })).toEqual({ error: "fraction" });
  expect(calculate("7 / 0", { division: "whole" })).toEqual({ error: "zeroDivision" });
  expect(calculate("7 /", { division: "whole" })).toEqual({ error: "invalid" });
  expect(calculate("1.5", { division: "whole" })).toEqual({ error: "invalid" });
  expect(calculate("2^-1", { division: "whole" })).toEqual({ error: "negativePower" });
  expect(calculate("2^4097", { division: "whole" })).toEqual({ error: "large" });
});

it.each([
  ["0xff + 1", "256"],
  ["0X1000000000000000 + 3", "1152921504606846979"],
  ["0xffffffffffffffff", "18446744073709551615"],
  ["0xffffffffffffffff + 1", "18446744073709551616"],
  ["2^64 - 1", "18446744073709551615"],
  ["-0x10 + 3", "-13"],
  ["0x10^2", "256"],
  ["0x20 / 0x8", "4"],
])(
  "evaluates optional exact hex scratch arithmetic without register wrapping: %s",
  (source, value) => {
    expect(calculate(source, { hexadecimal: true })).toEqual({ value });
  },
);
it.each(["0x", "0xG", "0xff,ff", "1.5", "0x1p3", "0xff 1", "0x10junk", "0x1.2"])(
  "rejects malformed integer scratch input: %s",
  (source) => {
    expect(calculate(source, { hexadecimal: true })).toEqual({ error: "invalid" });
  },
);
it("retains exact division and power/error limits in hex mode", () => {
  expect(calculate("0x5/2", { hexadecimal: true })).toEqual({ error: "fraction" });
  expect(calculate("0x5/0", { hexadecimal: true })).toEqual({ error: "zeroDivision" });
  expect(calculate("2^-1", { hexadecimal: true })).toEqual({ error: "negativePower" });
  expect(calculate("2^4097", { hexadecimal: true })).toEqual({ error: "large" });
});
