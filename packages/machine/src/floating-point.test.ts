// Copyright © 2026 Christopher Snow

import { describe, expect, it } from "vitest";
import { FP_NATIVE_CASES } from "../../../content/lessons/floating-point.native.ts";
import {
  FP_INPUT_LIMIT,
  fpDecode,
  fpParse,
  fpNext,
  fpOperate,
  fpFromInt32,
  fpToInt32,
  type FpWidth,
  type FpDirection,
  type FpOperation,
} from "./index.ts";

function parsed(text: string, width: FpWidth): bigint {
  const result = fpParse(text, width);
  if (!result.ok) throw new Error(result.error);
  return result.bits;
}

function hostBits(number: number, width: FpWidth): bigint {
  const data = new DataView(new ArrayBuffer(8));
  if (width === 32) {
    data.setFloat32(0, number, false);
    return BigInt(data.getUint32(0, false));
  }
  data.setFloat64(0, number, false);
  return data.getBigUint64(0, false);
}
function hostNumber(bits: bigint, width: FpWidth): number {
  const data = new DataView(new ArrayBuffer(8));
  if (width === 32) {
    data.setUint32(0, Number(bits), false);
    return data.getFloat32(0, false);
  }
  data.setBigUint64(0, bits, false);
  return data.getFloat64(0, false);
}

// A deterministic set of raw patterns, independent of the decimal parser.
function patterns(width: FpWidth): bigint[] {
  const values: bigint[] = [];
  let seed = 0x127a59e4n;
  const mask = (1n << BigInt(width)) - 1n;
  for (let i = 0; i < 500; i++) {
    seed = (seed * 6364136223846793005n + 1442695040888963407n) & mask;
    values.push(seed);
  }
  return values;
}

describe("floating-point representation and exact decimal", () => {
  it.each([
    [32, 0x41180000n, "9.5", "normal", 3, 0x180000n],
    [32, 0x40a80000n, "5.25", "normal", 2, 0x280000n],
    [32, 0x4145999an, "12.3500003814697265625", "normal", 3, 0x45999an],
    [
      64,
      0x4028b33333333333n,
      "12.3499999999999996447286321199499070644378662109375",
      "normal",
      3,
      0x8b33333333333n,
    ],
    [32, 0n, "0", "zero", null, 0n],
    [32, 0x80000000n, "-0", "zero", null, 0n],
    [
      32,
      0x00800000n,
      "0.000000000000000000000000000000000000011754943508222875079687365372222456778186655567720875215087517062784172594547271728515625",
      "normal",
      -126,
      0n,
    ],
    [32, 0x7f800000n, "Infinity", "infinity", null, 0n],
    [64, 0xfff0000000000000n, "-Infinity", "infinity", null, 0n],
    [32, 0x7fc00001n, "NaN", "nan", null, 0x400001n],
  ] as const)("decodes %i-bit 0x%s", (width, bits, exact, kind, exponent, fractionField) => {
    const result = fpDecode(bits, width);
    expect(result).toMatchObject({ width, bits, exact, kind, exponent, fractionField });
    expect(result.hex).toBe(`0x${bits.toString(16).padStart(width / 4, "0")}`);
    expect(result.binary).toHaveLength(width);
    expect(result.negative).toBe(bits >> BigInt(width - 1) === 1n);
    expect(result.display).toBe(
      Object.is(hostNumber(bits, width), -0) ? "-0" : String(hostNumber(bits, width)),
    );
  });

  it.each([32, 64] as const)(
    "handles every exponent field and boundary fraction at %i bits",
    (width) => {
      const fractionBits = width === 32 ? 23 : 52;
      const maxExponent = width === 32 ? 255 : 2047;
      const fractionMask = (1n << BigInt(fractionBits)) - 1n;
      for (let exponentField = 0; exponentField <= maxExponent; exponentField++) {
        for (const fractionField of [0n, 1n, fractionMask]) {
          const bits = (BigInt(exponentField) << BigInt(fractionBits)) | fractionField;
          const decoded = fpDecode(bits, width);
          expect(decoded.exponentField).toBe(exponentField);
          expect(decoded.fractionField).toBe(fractionField);
          expect(decoded.kind).toBe(
            exponentField === maxExponent
              ? fractionField === 0n
                ? "infinity"
                : "nan"
              : exponentField === 0
                ? fractionField === 0n
                  ? "zero"
                  : "subnormal"
                : "normal",
          );
          if (decoded.kind !== "nan") expect(parsed(decoded.exact, width)).toBe(bits);
        }
      }
    },
  );

  it.each([32, 64] as const)(
    "round-trips random finite patterns through the complete decimal at %i bits",
    (width) => {
      for (const bits of patterns(width)) {
        const decoded = fpDecode(bits, width);
        if (decoded.kind !== "nan") expect(parsed(decoded.exact, width)).toBe(bits);
      }
      const smallest = fpDecode(1n, width);
      expect(smallest.kind).toBe("subnormal");
      expect(smallest.exponent).toBe(width === 32 ? -126 : -1022);
      expect(smallest.exact).toBe(
        width === 32
          ? (5n ** 149n)
              .toString()
              .padStart(150, "0")
              .replace(/^(.*)(.{149})$/, "$1.$2")
          : (5n ** 1074n)
              .toString()
              .padStart(1075, "0")
              .replace(/^(.*)(.{1074})$/, "$1.$2"),
      );
    },
  );
});

describe("direct decimal rounding, nearest with ties to even", () => {
  it.each([
    ["9.5", 32, 0x41180000n],
    ["+.525e1", 32, 0x40a80000n],
    ["12.35", 32, 0x4145999an],
    ["12.35", 64, 0x4028b33333333333n],
    ["16777217", 32, 0x4b800000n],
    ["16777219", 32, 0x4b800002n],
    ["16777217", 64, 0x4170000010000000n],
    ["9007199254740993", 64, 0x4340000000000000n],
    ["9007199254740995", 64, 0x4340000000000002n],
    ["-0", 32, 0x80000000n],
    ["-0e200", 64, 0x8000000000000000n],
    ["1e10000", 64, 0x7ff0000000000000n],
    ["-1e-10000", 64, 0x8000000000000000n],
    ["Infinity", 32, 0x7f800000n],
    ["-inf", 64, 0xfff0000000000000n],
    ["NaN", 32, 0x7fc00000n],
  ] as const)("rounds %s directly to binary%i", (text, width, expected) => {
    expect(parsed(text, width)).toBe(expected);
  });

  it("does not round to binary64 before binary32 (both sides of a halfway value)", () => {
    const aboveEvenTie = "1.0000000596046448";
    const belowOddTie = "1.0000001788139343";
    expect(hostBits(Number(aboveEvenTie), 32)).toBe(0x3f800000n);
    expect(parsed(aboveEvenTie, 32)).toBe(0x3f800001n);
    expect(hostBits(Number(belowOddTie), 32)).toBe(0x3f800002n);
    expect(parsed(belowOddTie, 32)).toBe(0x3f800001n);
    expect(parsed("1.000000059604644775390625", 32)).toBe(0x3f800000n);
    expect(parsed("1.000000178813934326171875", 32)).toBe(0x3f800002n);
  });

  it.each([32, 64] as const)(
    "rounds at underflow, normal/subnormal and overflow boundaries at %i bits",
    (width) => {
      const fractionBits = width === 32 ? 23n : 52n;
      const minPower = width === 32 ? 149 : 1074;
      const halfSmallest = `0.${(5n ** BigInt(minPower + 1)).toString().padStart(minPower + 1, "0")}`;
      expect(parsed(halfSmallest, width)).toBe(0n);
      expect(parsed(`-${halfSmallest}`, width)).toBe(1n << BigInt(width - 1));
      // 3 * half the smallest subnormal is tied between odd 1 and even 2.
      expect(
        parsed(
          `0.${(3n * 5n ** BigInt(minPower + 1)).toString().padStart(minPower + 1, "0")}`,
          width,
        ),
      ).toBe(2n);
      const normal = 1n << fractionBits;
      expect(fpOperate("add", normal - 1n, 1n, width)).toBe(normal);
      const maxFinite = (width === 32 ? 0x7f800000n : 0x7ff0000000000000n) - 1n;
      const maxExact = BigInt(fpDecode(maxFinite, width).exact);
      const halfStep = 1n << BigInt((width === 32 ? 127 : 1023) - Number(fractionBits) - 1);
      expect(parsed(String(maxExact + halfStep - 1n), width)).toBe(maxFinite);
      expect(parsed(String(maxExact + halfStep), width)).toBe(maxFinite + 1n);
    },
  );

  it.each([
    ["", "empty"],
    ["  ", "empty"],
    ["0x41180000", "syntax"],
    ["1_000", "syntax"],
    ["1,5", "syntax"],
    ["1e", "syntax"],
    [".", "syntax"],
    ["--1", "syntax"],
    ["1e10001", "limit"],
    ["1e-10001", "limit"],
    ["1e999999999999", "limit"],
    ["9".repeat(FP_INPUT_LIMIT + 1), "limit"],
  ])("rejects invalid or bounded input %s", (text, error) => {
    expect(fpParse(text, 32)).toEqual({ ok: false, error });
  });
});

describe("adjacent values", () => {
  it.each([32, 64] as const)(
    "walks zeros, subnormals, normals and infinities at %i bits",
    (width) => {
      const sign = 1n << BigInt(width - 1);
      const infinity = width === 32 ? 0x7f800000n : 0x7ff0000000000000n;
      const normal = width === 32 ? 0x00800000n : 0x0010000000000000n;
      for (const zero of [0n, sign]) {
        expect(fpNext(zero, width, "up")).toBe(1n);
        expect(fpNext(zero, width, "down")).toBe(sign | 1n);
      }
      expect(fpNext(1n, width, "down")).toBe(0n);
      expect(fpNext(sign | 1n, width, "up")).toBe(sign);
      expect(fpNext(normal, width, "down")).toBe(normal - 1n);
      expect(fpNext(normal - 1n, width, "up")).toBe(normal);
      expect(fpNext(infinity, width, "up")).toBe(infinity);
      expect(fpNext(infinity, width, "down")).toBe(infinity - 1n);
      expect(fpNext(sign | infinity, width, "down")).toBe(sign | infinity);
      expect(fpNext(sign | infinity, width, "up")).toBe((sign | infinity) - 1n);
      const nan = infinity | 3n;
      expect(fpNext(nan, width, "up")).toBe(nan);
      expect(fpNext(nan, width, "down")).toBe(nan);
      for (const value of ["9.5", "16777216", "-12.35"]) {
        const bits = parsed(value, width);
        expect(fpNext(fpNext(bits, width, "up"), width, "down")).toBe(bits);
      }
    },
  );
});

describe("finite operations and special values", () => {
  it.each([32, 64] as const)(
    "matches independently rounded host arithmetic for deterministic patterns at %i bits",
    (width) => {
      const values = patterns(width);
      for (let i = 0; i < values.length - 1; i++) {
        const a = values[i]!;
        const b = values[i + 1]!;
        for (const op of ["add", "multiply"] as const) {
          const expected = hostBits(
            op === "add"
              ? hostNumber(a, width) + hostNumber(b, width)
              : hostNumber(a, width) * hostNumber(b, width),
            width,
          );
          const actual = fpOperate(op, a, b, width);
          if (Number.isNaN(hostNumber(expected, width)))
            expect(fpDecode(actual, width).kind).toBe("nan");
          else expect(actual).toBe(expected);
        }
      }
    },
  );

  it.each([32, 64] as const)(
    "computes the checked vehicle and precision examples at %i bits",
    (width) => {
      const operation = (op: FpOperation, a: string, b: string) =>
        fpDecode(fpOperate(op, parsed(a, width), parsed(b, width), width), width).exact;
      expect(operation("add", "9.5", "1.25")).toBe("10.75");
      expect(operation("multiply", "12.5", "1.5")).toBe("18.75");
      expect(operation("add", "16777216", "1")).toBe(width === 32 ? "16777216" : "16777217");
      expect(operation("add", "5.25", "-5.25")).toBe("0");
      expect(operation("add", "-0", "-0")).toBe("-0");
      expect(operation("add", "-0", "0")).toBe("0");
      expect(operation("multiply", "-0", "2")).toBe("-0");
      expect(operation("multiply", "-0", "-2")).toBe("0");
      expect(operation("add", "Infinity", "-Infinity")).toBe("NaN");
      expect(operation("multiply", "Infinity", "0")).toBe("NaN");
      expect(operation("multiply", "Infinity", "-2")).toBe("-Infinity");
      expect(operation("add", "2", "-Infinity")).toBe("-Infinity");
    },
  );
});

describe("guarded signed int32 conversions", () => {
  it.each([32, 64] as const)(
    "rounds integers and truncates finite in-range values at %i bits",
    (width) => {
      expect(fpFromInt32(16777217, width)).toBe(
        parsed(width === 32 ? "16777216" : "16777217", width),
      );
      for (const integer of [-2147483648, -16777217, -1, 0, 1, 16777217, 2147483647]) {
        expect(fpFromInt32(integer, width)).toBe(parsed(String(integer), width));
        expect(fpFromInt32(BigInt(integer), width)).toBe(parsed(String(integer), width));
      }
      for (const [text, value] of [
        ["9.75", 9],
        ["-9.75", -9],
        ["-0", 0],
        ["-0.5", 0],
        ["-2147483648", -2147483648],
      ] as const) {
        expect(fpToInt32(parsed(text, width), width)).toEqual({ ok: true, value });
      }
      for (const value of ["NaN", "Infinity", "-Infinity"])
        expect(fpToInt32(parsed(value, width), width)).toEqual({ ok: false, error: "non-finite" });
      for (const value of ["2147483648", "-2147483904", "1e30"])
        expect(fpToInt32(parsed(value, width), width)).toEqual({ ok: false, error: "range" });
    },
  );
  it("checks range after truncation, as the C conversion requires", () => {
    expect(fpToInt32(parsed("2147483647.75", 64), 64)).toEqual({ ok: true, value: 2147483647 });
    expect(fpToInt32(parsed("-2147483648.75", 64), 64)).toEqual({ ok: true, value: -2147483648 });
    expect(fpToInt32(parsed("2147483647", 32), 32)).toEqual({ ok: false, error: "range" });
  });
});

describe("independent agreement with the recorded AArch64 examples", () => {
  it.each(FP_NATIVE_CASES)("checks the inputs and output of $id", (recording) => {
    const [input, second] = recording.inputs;
    if (!input) throw new Error("missing recorded operand");
    const a = BigInt(input.hex);
    const expected = BigInt(recording.result.hex);
    let actual: bigint;
    switch (recording.operation) {
      case "add":
      case "multiply":
        if (!second) throw new Error("missing arithmetic operand");
        actual = fpOperate(recording.operation, a, BigInt(second.hex), input.width);
        break;
      case "int-to-float":
        actual = fpFromInt32(BigInt.asIntN(32, a), recording.result.width);
        break;
      case "float-to-int": {
        const integer = fpToInt32(a, input.width);
        if (!integer.ok) throw new Error(integer.error);
        actual = BigInt.asUintN(32, BigInt(integer.value));
        break;
      }
      case "widen":
        actual = parsed(fpDecode(a, input.width).exact, recording.result.width);
        expect(fpDecode(actual, recording.result.width).exact).toBe(fpDecode(a, input.width).exact);
        break;
      case "copy-bits":
        actual = a;
        expect(fpDecode(a, input.width).exact).toBe("9.5");
        break;
    }
    expect(actual).toBe(expected);
  });
});

it("rejects invalid runtime widths, patterns, enums and integer inputs", () => {
  expect(() => fpParse("1", 16 as FpWidth)).toThrow(RangeError);
  for (const bits of [-1n, 1n << 32n]) expect(() => fpDecode(bits, 32)).toThrow(RangeError);
  expect(() => fpDecode(1 as unknown as bigint, 32)).toThrow(TypeError);
  expect(() => fpNext(0n, 32, "sideways" as FpDirection)).toThrow(TypeError);
  expect(() => fpOperate("divide" as FpOperation, 0n, 0n, 32)).toThrow(TypeError);
  for (const value of [NaN, Infinity, 1.5, 2147483648, -2147483649, 999999999999999999999n])
    expect(() => fpFromInt32(value, 32)).toThrow(RangeError);
});
