// Copyright © 2026 Christopher Snow

import { describe, expect, it } from "vitest";
import { calculatorEntryFormat, calculatorParseEntry, type CalculatorReading } from "./index.ts";

describe("prefix-based calculator entry", () => {
  it.each([
    ["1010", "decimal", "1010"],
    ["0x7ffffffe", "hex", "2147483646"],
    ["0XFFFF FFFF", "hex", "4294967295"],
    ["0b1010", "binary", "10"],
    ["0B1111_0000,1010 0101", "binary", "61605"],
    ["0x00000000FFFFFFFF", "hex", "4294967295"],
    ["0b0000000000000000000000000000000011111111111111111111111111111111", "binary", "4294967295"],
    [" 2,147_483 647 ", "decimal", "2147483647"],
  ] as const)("detects %s from its prefix without a selector", (text, format, pattern) => {
    expect(calculatorEntryFormat(text)).toBe(format);
    expect(calculatorParseEntry(text, 32, "unsigned")).toEqual({ ok: true, pattern });
  });

  it("zero-fills short patterns at the selected width, without inferring a negative sign", () => {
    for (const reading of ["signed", "unsigned"] as const) {
      for (const text of ["0xFFFFFFFF", "0b" + "1".repeat(32)]) {
        expect(calculatorParseEntry(text, 64, reading)).toEqual({
          ok: true,
          pattern: "4294967295",
        });
        expect(calculatorParseEntry(text, 32, reading)).toEqual({
          ok: true,
          pattern: "4294967295",
        });
      }
      for (const text of ["0xFFFFFFFFFFFFFFFF", "0b" + "1".repeat(64)])
        expect(calculatorParseEntry(text, 32, reading)).toEqual({ ok: false, error: "range" });
    }
    expect(calculatorParseEntry("1".repeat(32), 64, "unsigned")).toEqual({
      ok: false,
      error: "range",
    });
    expect(calculatorParseEntry("-1", 64, "signed")).toEqual({
      ok: true,
      pattern: "18446744073709551615",
    });
    expect(calculatorParseEntry("-1", 64, "unsigned")).toEqual({ ok: false, error: "range" });
  });

  it("checks significant bits, exact wide values and decimal reading limits independently", () => {
    for (const width of [32, 64] as const) {
      for (const reading of ["unsigned", "signed"] as const) {
        const mask = 2n ** BigInt(width) - 1n;
        for (const value of [
          0n,
          1n,
          2147483647n,
          2147483648n,
          4294967295n,
          4294967296n,
          9007199254740993n,
          9223372036854775808n,
          18446744073709551615n,
          18446744073709551616n,
        ]) {
          for (const [prefix, radix] of [
            ["0x", 16],
            ["0b", 2],
          ] as const) {
            const expected =
              value <= mask
                ? { ok: true, pattern: value.toString() }
                : { ok: false, error: "range" };
            expect(calculatorParseEntry(prefix + value.toString(radix), width, reading)).toEqual(
              expected,
            );
            expect(
              calculatorParseEntry(prefix + "0".repeat(80) + value.toString(radix), width, reading),
            ).toEqual(expected);
          }
        }
        const min = reading === "signed" ? -(2n ** BigInt(width - 1)) : 0n;
        const max = reading === "signed" ? 2n ** BigInt(width - 1) - 1n : mask;
        for (const value of [min, max])
          expect(calculatorParseEntry(value.toString(), width, reading)).toEqual({
            ok: true,
            pattern: BigInt.asUintN(width, value).toString(),
          });
        for (const value of [min - 1n, max + 1n])
          expect(calculatorParseEntry(value.toString(), width, reading)).toEqual({
            ok: false,
            error: "range",
          });
      }
    }
  });

  it.each([
    ["", "empty"],
    [" , _ ", "empty"],
    ["0x", "hex"],
    ["0xG", "hex"],
    ["0x-1", "hex"],
    ["0b", "binary"],
    ["0b2", "binary"],
    ["0b102", "binary"],
    ["0b-1", "binary"],
    ["FFFF", "decimal"],
    ["-0x1", "decimal"],
    ["+1", "decimal"],
    ["0o10", "decimal"],
    ["1e3", "decimal"],
    ["1.5", "decimal"],
  ] as const)("rejects malformed entry %s", (text, error) => {
    for (const reading of ["unsigned", "signed"] as CalculatorReading[])
      expect(calculatorParseEntry(text, 64, reading)).toEqual({ ok: false, error });
  });

  it("bounds conversion for very long pasted patterns while accepting redundant leading zeros", () => {
    for (const reading of ["unsigned", "signed"] as const) {
      expect(calculatorParseEntry("0b" + "1".repeat(10000), 64, reading)).toEqual({
        ok: false,
        error: "range",
      });
      expect(calculatorParseEntry("0x" + "F".repeat(10000), 64, reading)).toEqual({
        ok: false,
        error: "range",
      });
      expect(calculatorParseEntry("0b" + "0".repeat(10000) + "1", 32, reading)).toEqual({
        ok: true,
        pattern: "1",
      });
    }
  });
});
