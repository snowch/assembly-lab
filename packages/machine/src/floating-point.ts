// Copyright © 2026 Christopher Snow

/** Exact IEEE 754 binary32/binary64 arithmetic with round-to-nearest, ties-to-even.
 * This numeric model does not simulate Arm registers, FPCR, exceptions or NaN payload rules.
 * JavaScript numbers are used only for small indices and the labelled short display.
 */
export type FpWidth = 32 | 64;
export type FpKind = "zero" | "subnormal" | "normal" | "infinity" | "nan";
export type FpOperation = "add" | "multiply";
export type FpDirection = "up" | "down";
export type FpParseResult =
  { ok: true; bits: bigint } | { ok: false; error: "empty" | "syntax" | "limit" };
export type FpInt32Result =
  { ok: true; value: number } | { ok: false; error: "non-finite" | "range" };
export interface FpDecoded {
  width: FpWidth;
  bits: bigint;
  hex: string;
  binary: string;
  kind: FpKind;
  negative: boolean;
  exponentField: number;
  fractionField: bigint;
  bias: number;
  /** Unbiased exponent; subnormals use 1 - bias, zero and special values use null. */
  exponent: number | null;
  /** Full terminating decimal, never a shortest-display approximation. */
  exact: string;
  /** Short decimal rendering of the stored value; not necessarily its exact decimal value. */
  display: string;
}

export const FP_INPUT_LIMIT = 4096;
const DECIMAL_EXPONENT_LIMIT = 10000;

function format(width: FpWidth) {
  if (width !== 32 && width !== 64) throw new RangeError("floating-point width");
  const fractionBits = width === 32 ? 23 : 52;
  const exponentBits = width === 32 ? 8 : 11;
  const bias = width === 32 ? 127 : 1023;
  const sign = 1n << BigInt(width - 1);
  const fractionMask = (1n << BigInt(fractionBits)) - 1n;
  const maxExponent = (1 << exponentBits) - 1;
  const infinity = BigInt(maxExponent) << BigInt(fractionBits);
  return { fractionBits, exponentBits, bias, sign, fractionMask, maxExponent, infinity };
}

function checked(bits: bigint, width: FpWidth) {
  const f = format(width);
  if (typeof bits !== "bigint") throw new TypeError("floating-point bits");
  if (bits < 0n || bits >= 1n << BigInt(width)) throw new RangeError("floating-point bits");
  return f;
}

function parts(bits: bigint, width: FpWidth) {
  const f = checked(bits, width);
  const negative = (bits & f.sign) !== 0n;
  const fractionField = bits & f.fractionMask;
  const exponentField = Number((bits >> BigInt(f.fractionBits)) & BigInt(f.maxExponent));
  const kind: FpKind =
    exponentField === f.maxExponent
      ? fractionField === 0n
        ? "infinity"
        : "nan"
      : exponentField === 0
        ? fractionField === 0n
          ? "zero"
          : "subnormal"
        : "normal";
  const exponent =
    kind === "normal" ? exponentField - f.bias : kind === "subnormal" ? 1 - f.bias : null;
  const significand =
    exponentField === 0 ? fractionField : (1n << BigInt(f.fractionBits)) | fractionField;
  return { ...f, negative, fractionField, exponentField, kind, exponent, significand };
}

/** Positive finite magnitude as an exact integer divided by a power of two. */
function rational(bits: bigint, width: FpWidth) {
  const p = parts(bits, width);
  if (p.kind === "infinity" || p.kind === "nan") throw new RangeError("non-finite rational");
  const shift = (p.exponent ?? 1 - p.bias) - p.fractionBits;
  return {
    numerator: shift >= 0 ? p.significand << BigInt(shift) : p.significand,
    denominator: shift >= 0 ? 1n : 1n << BigInt(-shift),
    negative: p.negative,
  };
}

function exactDecimal(numerator: bigint, denominator: bigint, negative: boolean): string {
  const prefix = negative ? "-" : "";
  if (numerator === 0n) return `${prefix}0`;
  // Denominators come only from binary formats, so this always terminates.
  while (denominator > 1n && (numerator & 1n) === 0n) {
    numerator >>= 1n;
    denominator >>= 1n;
  }
  if (denominator === 1n) return prefix + numerator.toString();
  const places = denominator.toString(2).length - 1;
  const digits = (numerator * 5n ** BigInt(places)).toString().padStart(places + 1, "0");
  return `${prefix}${digits.slice(0, -places)}.${digits.slice(-places)}`;
}

function shortDisplay(bits: bigint, width: FpWidth): string {
  const data = new DataView(new ArrayBuffer(8));
  let number: number;
  if (width === 32) {
    data.setUint32(0, Number(bits), false);
    number = data.getFloat32(0, false);
  } else {
    data.setBigUint64(0, bits, false);
    number = data.getFloat64(0, false);
  }
  return Object.is(number, -0) ? "-0" : String(number);
}

export function fpDecode(bits: bigint, width: FpWidth): FpDecoded {
  const p = parts(bits, width);
  let exact: string;
  if (p.kind === "nan") exact = "NaN";
  else if (p.kind === "infinity") exact = `${p.negative ? "-" : ""}Infinity`;
  else {
    const r = rational(bits, width);
    exact = exactDecimal(r.numerator, r.denominator, r.negative);
  }
  return {
    width,
    bits,
    hex: `0x${bits.toString(16).padStart(width / 4, "0")}`,
    binary: bits.toString(2).padStart(width, "0"),
    kind: p.kind,
    negative: p.negative,
    exponentField: p.exponentField,
    fractionField: p.fractionField,
    bias: p.bias,
    exponent: p.exponent,
    exact,
    display: shortDisplay(bits, width),
  };
}

/** Round an exact nonnegative rational once, directly to the selected binary format. */
function roundRational(
  numerator: bigint,
  denominator: bigint,
  negative: boolean,
  width: FpWidth,
): bigint {
  const f = format(width);
  const sign = negative ? f.sign : 0n;
  if (numerator === 0n) return sign;
  let exponent = numerator.toString(2).length - denominator.toString(2).length;
  if (
    exponent >= 0
      ? numerator < denominator << BigInt(exponent)
      : numerator << BigInt(-exponent) < denominator
  )
    exponent--;
  if (exponent > f.bias) return sign | f.infinity;
  const scale = Math.max(exponent, 1 - f.bias) - f.fractionBits;
  const scaledNumerator = scale >= 0 ? numerator : numerator << BigInt(-scale);
  const scaledDenominator = scale >= 0 ? denominator << BigInt(scale) : denominator;
  let significand = scaledNumerator / scaledDenominator;
  const remainder = scaledNumerator % scaledDenominator;
  if (
    2n * remainder > scaledDenominator ||
    (2n * remainder === scaledDenominator && (significand & 1n) !== 0n)
  )
    significand++;
  const implicit = 1n << BigInt(f.fractionBits);
  if (significand < implicit) return sign | significand;
  if (significand === implicit << 1n) {
    significand >>= 1n;
    exponent++;
  }
  if (exponent > f.bias) return sign | f.infinity;
  return (
    sign |
    (BigInt(Math.max(exponent, 1 - f.bias) + f.bias) << BigInt(f.fractionBits)) |
    (significand - implicit)
  );
}

export function fpParse(text: string, width: FpWidth): FpParseResult {
  const f = format(width);
  if (text.length > FP_INPUT_LIMIT) return { ok: false, error: "limit" };
  const input = text.trim();
  if (!input) return { ok: false, error: "empty" };
  const special = /^([+-]?)(inf(?:inity)?|nan)$/i.exec(input);
  if (special) {
    const sign = special[1] === "-" ? f.sign : 0n;
    return {
      ok: true,
      bits:
        sign |
        f.infinity |
        (special[2]?.toLowerCase() === "nan" ? 1n << BigInt(f.fractionBits - 1) : 0n),
    };
  }
  const match = /^([+-]?)(?:(\d+)(?:\.(\d*))?|\.(\d+))(?:[eE]([+-]?\d+))?$/.exec(input);
  if (!match) return { ok: false, error: "syntax" };
  const exponentText = match[5] ?? "0";
  // Check before Number/BigInt conversion; exponent digits must not cause unbounded powers.
  const exponentDigits = exponentText.replace(/^[+-]?0*/, "");
  if (exponentDigits.length > 5) return { ok: false, error: "limit" };
  const decimalExponent = Number(exponentText);
  if (Math.abs(decimalExponent) > DECIMAL_EXPONENT_LIMIT) return { ok: false, error: "limit" };
  const fraction = match[3] ?? match[4] ?? "";
  const digits = `${match[2] ?? ""}${fraction}`;
  const numerator = BigInt(digits);
  const power = decimalExponent - fraction.length;
  return {
    ok: true,
    bits: roundRational(
      power >= 0 ? numerator * 10n ** BigInt(power) : numerator,
      power >= 0 ? 1n : 10n ** BigInt(-power),
      match[1] === "-",
      width,
    ),
  };
}

/** Adjacent representable value in numerical order. NaN patterns are preserved. */
export function fpNext(bits: bigint, width: FpWidth, direction: FpDirection): bigint {
  const p = parts(bits, width);
  if (direction !== "up" && direction !== "down") throw new TypeError("floating-point direction");
  if (p.kind === "nan") return bits;
  if (p.kind === "zero") return direction === "up" ? 1n : p.sign | 1n;
  if (p.kind === "infinity" && p.negative === (direction === "down")) return bits;
  return (direction === "up") !== p.negative ? bits + 1n : bits - 1n;
}

/** One IEEE-style operation; does not model exception flags or target NaN propagation. */
export function fpOperate(op: FpOperation, a: bigint, b: bigint, width: FpWidth): bigint {
  const left = parts(a, width);
  const right = parts(b, width);
  if (op !== "add" && op !== "multiply") throw new TypeError("floating-point operation");
  const nan = left.infinity | (1n << BigInt(left.fractionBits - 1));
  if (left.kind === "nan" || right.kind === "nan") return nan;
  if (op === "multiply") {
    const negative = left.negative !== right.negative;
    if (
      (left.kind === "infinity" && right.kind === "zero") ||
      (right.kind === "infinity" && left.kind === "zero")
    )
      return nan;
    if (left.kind === "infinity" || right.kind === "infinity")
      return (negative ? left.sign : 0n) | left.infinity;
    const l = rational(a, width);
    const r = rational(b, width);
    return roundRational(l.numerator * r.numerator, l.denominator * r.denominator, negative, width);
  }
  if (left.kind === "infinity" && right.kind === "infinity" && left.negative !== right.negative)
    return nan;
  if (left.kind === "infinity") return a;
  if (right.kind === "infinity") return b;
  const l = rational(a, width);
  const r = rational(b, width);
  const sum =
    (l.negative ? -l.numerator : l.numerator) * r.denominator +
    (r.negative ? -r.numerator : r.numerator) * l.denominator;
  return roundRational(
    sum < 0n ? -sum : sum,
    l.denominator * r.denominator,
    sum === 0n ? l.negative && r.negative : sum < 0n,
    width,
  );
}

export function fpFromInt32(value: number | bigint, width: FpWidth): bigint {
  format(width);
  if (typeof value !== "number" && typeof value !== "bigint") throw new TypeError("signed int32");
  if (typeof value === "number" && !Number.isInteger(value)) throw new RangeError("signed int32");
  const integer = BigInt(value);
  if (integer < -2147483648n || integer > 2147483647n) throw new RangeError("signed int32");
  return roundRational(integer < 0n ? -integer : integer, 1n, integer < 0n, width);
}

/** C-style truncation with a finite, in-range guard; never emulates an invalid C cast. */
export function fpToInt32(bits: bigint, width: FpWidth): FpInt32Result {
  const p = parts(bits, width);
  if (p.kind === "nan" || p.kind === "infinity") return { ok: false, error: "non-finite" };
  const r = rational(bits, width);
  const magnitude = r.numerator / r.denominator;
  const integer = r.negative ? -magnitude : magnitude;
  if (integer < -2147483648n || integer > 2147483647n) return { ok: false, error: "range" };
  return { ok: true, value: Number(integer) };
}
