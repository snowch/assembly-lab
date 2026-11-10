// Copyright © 2026 Christopher Snow

import { describe, expect, it } from "vitest";
import {
  calculatorCompute,
  calculatorHalves,
  calculatorMask,
  calculatorParse,
  calculatorPattern,
  calculatorReading,
  calculatorSetHalf,
  type CalculatorOperation,
  type CalculatorReading,
  type CalculatorWidth,
} from "./index.ts";

const widths: CalculatorWidth[] = [4, 32, 64];
const readings: CalculatorReading[] = ["unsigned", "signed"];

describe("programmer calculator pattern and readings", () => {
  it.each(widths)("normalises arbitrary integers at %i bits", (width) => {
    const modulus = 2n ** BigInt(width);
    expect(calculatorMask(width)).toBe(modulus - 1n);
    for (const value of [0n, 1n, modulus - 1n, modulus, modulus + 3n, -1n, -modulus - 3n]) {
      expect(calculatorPattern(value, width)).toBe(BigInt.asUintN(width, value));
      expect(calculatorReading(value, width, "unsigned")).toBe(BigInt.asUintN(width, value));
      expect(calculatorReading(value, width, "signed")).toBe(BigInt.asIntN(width, value));
    }
  });

  it.each(widths)("changing reading preserves all bits at %i bits", (width) => {
    const samples = [0n, calculatorMask(width)];
    for (let bit = 0; bit < width; bit++) {
      const value = 1n << BigInt(bit);
      samples.push(value - 1n, value, value + 1n);
    }
    for (const value of samples) {
      for (const reading of readings) {
        const number = calculatorReading(value, width, reading);
        expect(calculatorPattern(number, width)).toBe(BigInt.asUintN(width, value));
      }
    }
  });

  it("uses explicit narrowing and zero-filled widening", () => {
    const initial = 0x10000000bn;
    const narrowed = calculatorPattern(initial, 32);
    expect(narrowed).toBe(11n);
    expect(calculatorPattern(narrowed, 64)).toBe(11n);
    expect(calculatorPattern(0xffffffffn, 64)).toBe(4294967295n);
  });
});

describe("programmer calculator entry", () => {
  it.each([
    [" 18,446_744 073,709_551 615 ", "decimal", 64, "unsigned", "18446744073709551615"],
    ["-9_223 372,036_854 775,808", "decimal", 64, "signed", "9223372036854775808"],
    ["9,223,372,036,854,775,807", "decimal", 64, "signed", "9223372036854775807"],
    ["0xFFFF FFFF_FFFF,FFFF", "hex", 64, "signed", "18446744073709551615"],
    ["0X8000_0000", "hex", 32, "signed", "2147483648"],
    ["ffffffff", "hex", 32, "unsigned", "4294967295"],
    ["-8", "decimal", 4, "signed", "8"],
    ["7", "decimal", 4, "signed", "7"],
    ["15", "decimal", 4, "unsigned", "15"],
    ["f", "hex", 4, "signed", "15"],
    ["00000000000000000000001", "decimal", 4, "unsigned", "1"],
    ["0x0000000000000000000000f", "hex", 4, "unsigned", "15"],
  ] as const)("parses %s exactly", (text, format, width, reading, pattern) => {
    expect(calculatorParse(text, format, width, reading)).toEqual({ ok: true, pattern });
  });

  it.each([
    ["", "decimal", "unsigned", "empty"],
    [" , _ ", "hex", "unsigned", "empty"],
    ["1.5", "decimal", "unsigned", "decimal"],
    ["1e3", "decimal", "unsigned", "decimal"],
    ["0x10", "decimal", "unsigned", "decimal"],
    ["+1", "decimal", "signed", "decimal"],
    ["Infinity", "decimal", "unsigned", "decimal"],
    ["--1", "decimal", "signed", "decimal"],
    ["0x", "hex", "unsigned", "hex"],
    ["0xfg", "hex", "unsigned", "hex"],
    ["-1", "hex", "signed", "hex"],
    ["-1", "decimal", "unsigned", "range"],
    ["-0", "decimal", "unsigned", "range"],
    ["8", "decimal", "signed", "range"],
    ["-9", "decimal", "signed", "range"],
    ["16", "decimal", "unsigned", "range"],
    ["10", "hex", "unsigned", "range"],
  ] as const)("rejects %s with %s notation", (text, format, reading, error) => {
    expect(calculatorParse(text, format, 4, reading)).toEqual({ ok: false, error });
  });

  it.each(widths)("checks decimal and hexadecimal range edges at %i bits", (width) => {
    const modulus = 1n << BigInt(width);
    const signBit = modulus / 2n;
    for (const reading of readings) {
      const minimum = reading === "signed" ? -signBit : 0n;
      const maximum = reading === "signed" ? signBit - 1n : modulus - 1n;
      for (const value of [minimum, maximum]) {
        expect(calculatorParse(value.toString(), "decimal", width, reading)).toEqual({
          ok: true,
          pattern: BigInt.asUintN(width, value).toString(),
        });
      }
      for (const value of [minimum - 1n, maximum + 1n]) {
        expect(calculatorParse(value.toString(), "decimal", width, reading)).toEqual({
          ok: false,
          error: "range",
        });
      }
      expect(calculatorParse(modulus.toString(16), "hex", width, reading)).toEqual({
        ok: false,
        error: "range",
      });
    }
  });

  it("round-trips exact 64-bit patterns through decimal readings and hexadecimal", () => {
    const values = [0n, 1n, 0x20000000000001n, 0x7fffffffffffffffn, 0x8000000000000000n];
    for (let bit = 0; bit < 64; bit++) {
      values.push(
        (1n << BigInt(bit)) - 1n,
        1n << BigInt(bit),
        calculatorMask(64) ^ (1n << BigInt(bit)),
      );
    }
    for (const pattern of values) {
      for (const reading of readings) {
        expect(
          calculatorParse(
            calculatorReading(pattern, 64, reading).toString(),
            "decimal",
            64,
            reading,
          ),
        ).toEqual({ ok: true, pattern: pattern.toString() });
        expect(calculatorParse(pattern.toString(16), "hex", 64, reading)).toEqual({
          ok: true,
          pattern: pattern.toString(),
        });
      }
    }
  });

  it("bounds significant digits before converting long input", () => {
    for (const reading of readings) {
      expect(calculatorParse("9".repeat(10000), "decimal", 64, reading)).toEqual({
        ok: false,
        error: "range",
      });
      expect(calculatorParse("f".repeat(10000), "hex", 64, reading)).toEqual({
        ok: false,
        error: "range",
      });
      expect(calculatorParse(`${"0".repeat(10000)}1`, "decimal", 64, reading)).toEqual({
        ok: true,
        pattern: "1",
      });
    }
  });
});

describe("programmer calculator arithmetic", () => {
  it("checks all 512 four-bit add/subtract operand pairs in both readings", () => {
    let pairs = 0;
    for (const op of ["add", "subtract"] as const) {
      for (let a = 0; a < 16; a++) {
        for (let b = 0; b < 16; b++) {
          const expected = (op === "add" ? a + b : a - b) & 15;
          for (const reading of readings) {
            const left = reading === "signed" && a >= 8 ? a - 16 : a;
            const right = reading === "signed" && b >= 8 ? b - 16 : b;
            expect(calculatorCompute(String(a), op, String(b), 4, reading)).toEqual({
              pattern: String(expected),
              full: String(op === "add" ? left + right : left - right),
              left: String(left),
              right: String(right),
            });
          }
          pairs++;
        }
      }
    }
    expect(pairs).toBe(512);
  });

  it.each([32, 64] as const)("keeps exact full results at %i-bit extrema", (width) => {
    const mask = (1n << BigInt(width)) - 1n;
    const signBit = 1n << BigInt(width - 1);
    const values = [0n, 1n, signBit - 1n, signBit, mask];
    for (const a of values) {
      for (const b of values) {
        for (const op of ["add", "subtract"] as const) {
          const unsignedFull = op === "add" ? a + b : a - b;
          for (const reading of readings) {
            const left = reading === "signed" ? BigInt.asIntN(width, a) : a;
            const right = reading === "signed" ? BigInt.asIntN(width, b) : b;
            expect(calculatorCompute(a.toString(), op, b.toString(), width, reading)).toEqual({
              pattern: BigInt.asUintN(width, unsignedFull).toString(),
              full: (op === "add" ? left + right : left - right).toString(),
              left: left.toString(),
              right: right.toString(),
            });
          }
        }
      }
    }
  });

  it.each(widths)("shifts raw unsigned patterns by every valid count at %i bits", (width) => {
    const patterns =
      width === 4
        ? Array.from({ length: 16 }, (_, i) => BigInt(i))
        : [0n, 1n, 3n, calculatorMask(width)];
    for (const pattern of patterns) {
      for (let count = 0; count < width; count++) {
        const full = pattern * 2n ** BigInt(count);
        for (const reading of readings) {
          expect(
            calculatorCompute(pattern.toString(), "shift-left", String(count), width, reading),
          ).toEqual({
            pattern: BigInt.asUintN(width, full).toString(),
            full: full.toString(),
            left: pattern.toString(),
            right: String(count),
          });
        }
      }
    }
    for (const count of [String(width), String(width + 1), "1000000000000000000000000"]) {
      expect(() => calculatorCompute("1", "shift-left", count, width, "unsigned")).toThrow(
        RangeError,
      );
    }
    expect(() => calculatorCompute("1", "shift-left", "-1", width, "unsigned")).toThrow(TypeError);
  });

  it("rejects malformed and overflowing internal patterns instead of truncating", () => {
    for (const text of ["", "-1", "0xff", "1_000", "1.0", " 1 "]) {
      expect(() => calculatorCompute(text, "add", "0", 64, "unsigned")).toThrow(TypeError);
      expect(() => calculatorCompute("0", "add", text, 64, "unsigned")).toThrow(TypeError);
    }
    for (const text of ["18446744073709551616", "9".repeat(10000)]) {
      expect(() => calculatorCompute(text, "add", "0", 64, "unsigned")).toThrow(RangeError);
      expect(() => calculatorCompute("0", "subtract", text, 64, "signed")).toThrow(RangeError);
    }
  });
});

describe("programmer calculator 32-bit halves", () => {
  it.each([
    ["0", "0", "0"],
    ["4294967295", "65535", "65535"],
    ["2147483648", "32768", "0"],
    ["305419896", "4660", "22136"],
    ["262153", "4", "9"],
  ])("splits %s into unsigned halves", (pattern, upper, lower) => {
    expect(calculatorHalves(pattern)).toEqual({ upper, lower });
    expect(calculatorSetHalf(calculatorSetHalf("0", "upper", upper), "lower", lower)).toBe(pattern);
  });

  it("preserves the other half through boundary and single-bit replacements", () => {
    const halves = [0n, 1n, 0x7fffn, 0x8000n, 0xffffn];
    for (let bit = 0; bit < 16; bit++) halves.push(1n << BigInt(bit));
    for (const upper of halves) {
      for (const lower of halves) {
        const original = ((upper << 16n) | lower).toString();
        for (const replacement of [0n, 0x8000n, 0xffffn]) {
          expect(
            calculatorHalves(calculatorSetHalf(original, "upper", replacement.toString())),
          ).toEqual({
            upper: replacement.toString(),
            lower: lower.toString(),
          });
          expect(
            calculatorHalves(calculatorSetHalf(original, "lower", replacement.toString())),
          ).toEqual({
            upper: upper.toString(),
            lower: replacement.toString(),
          });
        }
      }
    }
  });

  it("enforces the 32-bit pattern and 16-bit replacement bounds", () => {
    for (const pattern of ["4294967296", "18446744073709551615"]) {
      expect(() => calculatorHalves(pattern)).toThrow(RangeError);
      expect(() => calculatorSetHalf(pattern, "lower", "0")).toThrow(RangeError);
    }
    for (const value of ["65536", "9".repeat(10000)]) {
      expect(() => calculatorSetHalf("0", "upper", value)).toThrow(RangeError);
    }
    for (const value of ["-1", "1.5", "0xffff", ""]) {
      expect(() => calculatorSetHalf("0", "upper", value)).toThrow(TypeError);
    }
  });
});

it("rejects unsupported runtime enum arguments", () => {
  expect(() => calculatorMask(16 as CalculatorWidth)).toThrow(RangeError);
  expect(() => calculatorReading(0n, 4, "other" as CalculatorReading)).toThrow(TypeError);
  expect(() =>
    calculatorCompute("0", "multiply" as CalculatorOperation, "0", 4, "unsigned"),
  ).toThrow(TypeError);
  expect(() => calculatorSetHalf("0", "other" as "upper", "0")).toThrow(TypeError);
});
