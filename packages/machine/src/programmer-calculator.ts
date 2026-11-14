// Copyright © 2026 Christopher Snow

// Adapted from Christopher Snow's snowch/programmer-calculator, index.html,
// efa1584bd6deb69b2e287aae579739c4a73bf052: mask, clamp, toSigned and compute.
// See docs/notes/lesson-programmer-calculator/source.md for the import boundary.
// This is a mathematical bit-pattern tool, independent of Arm/C execution.

export type CalculatorWidth = 4 | 32 | 64;
export type CalculatorReading = "unsigned" | "signed";
export type CalculatorFormat = "decimal" | "hex";
export type CalculatorEntryFormat = CalculatorFormat | "binary";
export type CalculatorEntryParseResult = CalculatorParseResult | { ok: false; error: "binary" };
export type CalculatorOperation = "add" | "subtract" | "shift-left";
export type CalculatorParseResult =
  { ok: true; pattern: string } | { ok: false; error: "empty" | "decimal" | "hex" | "range" };

function checkWidth(width: CalculatorWidth): void {
  if (width !== 4 && width !== 32 && width !== 64) throw new RangeError("width");
}

function checkReading(reading: CalculatorReading): void {
  if (reading !== "unsigned" && reading !== "signed") throw new TypeError("reading");
}

/** The unsigned pattern with every bit set at this width. */
export function calculatorMask(width: CalculatorWidth): bigint {
  checkWidth(width);
  return (1n << BigInt(width)) - 1n;
}

/** Retain the low bits, including for a negative mathematical value. */
export function calculatorPattern(value: bigint, width: CalculatorWidth): bigint {
  const mask = calculatorMask(width);
  // Upstream clamp, with width passed explicitly rather than read from UI state.
  return ((value % (mask + 1n)) + mask + 1n) & mask;
}

/** Read the retained pattern without changing its bits. */
export function calculatorReading(
  pattern: bigint,
  width: CalculatorWidth,
  reading: CalculatorReading,
): bigint {
  checkReading(reading);
  const value = calculatorPattern(pattern, width);
  const signBit = 1n << BigInt(width - 1);
  // Upstream toSigned; normalisation also makes this safe for arbitrary BigInts.
  return reading === "signed" && (value & signBit) !== 0n
    ? value - (calculatorMask(width) + 1n)
    : value;
}

/** Parse entry text exactly; unlike arithmetic, entry never discards upper bits. */
export function calculatorParse(
  text: string,
  format: CalculatorFormat,
  width: CalculatorWidth,
  reading: CalculatorReading,
): CalculatorParseResult {
  const mask = calculatorMask(width);
  checkReading(reading);
  if (format !== "decimal" && format !== "hex") throw new TypeError("format");
  const input = text.replace(/[\s,_]/g, "");
  if (input === "") return { ok: false, error: "empty" };
  if (format === "hex") {
    const digits = input.replace(/^0x/i, "");
    if (!/^[\da-f]+$/i.test(digits)) return { ok: false, error: "hex" };
    const significant = digits.replace(/^0+/, "") || "0";
    // Bound the conversion before BigInt sees potentially very long user input.
    if (significant.length > width / 4) return { ok: false, error: "range" };
    return { ok: true, pattern: BigInt(`0x${significant}`).toString() };
  }
  if (!/^-?\d+$/.test(input)) return { ok: false, error: "decimal" };
  const negative = input.startsWith("-");
  if (negative && reading === "unsigned") return { ok: false, error: "range" };
  const significant = input.replace(/^-?0*/, "") || "0";
  if (significant.length > mask.toString().length) return { ok: false, error: "range" };
  const value = BigInt(`${negative ? "-" : ""}${significant}`);
  const signBit = 1n << BigInt(width - 1);
  const minimum = reading === "signed" ? -signBit : 0n;
  const maximum = reading === "signed" ? signBit - 1n : mask;
  if (value < minimum || value > maximum) return { ok: false, error: "range" };
  return { ok: true, pattern: calculatorPattern(value, width).toString() };
}

/** Prefix-based entry: unprefixed digits stay decimal; patterns never infer a signed width. */
export function calculatorEntryFormat(text: string): CalculatorEntryFormat {
  const input = text.replace(/[\s,_]/g, "");
  return /^0x/i.test(input) ? "hex" : /^0b/i.test(input) ? "binary" : "decimal";
}

export function calculatorParseEntry(
  text: string,
  width: CalculatorWidth,
  reading: CalculatorReading,
): CalculatorEntryParseResult {
  const format = calculatorEntryFormat(text);
  if (format !== "binary") return calculatorParse(text, format, width, reading);
  calculatorMask(width);
  checkReading(reading);
  const digits = text.replace(/[\s,_]/g, "").slice(2);
  if (!/^[01]+$/.test(digits)) return { ok: false, error: "binary" };
  const significant = digits.replace(/^0+/, "") || "0";
  // Accept redundant leading zeros, but bound conversion before constructing a BigInt.
  if (significant.length > width) return { ok: false, error: "range" };
  return { ok: true, pattern: BigInt(`0b${significant}`).toString() };
}

/** Internal interchange uses unsigned decimal strings, not entry notation. */
function boundedDecimal(text: string, maximum: bigint): bigint {
  if (!/^\d+$/.test(text)) throw new TypeError("pattern");
  const significant = text.replace(/^0+/, "") || "0";
  if (significant.length > maximum.toString().length) throw new RangeError("pattern");
  const value = BigInt(significant);
  if (value > maximum) throw new RangeError("pattern");
  return value;
}

export function calculatorCompute(
  leftPattern: string,
  op: CalculatorOperation,
  rightPattern: string,
  width: CalculatorWidth,
  reading: CalculatorReading,
): { pattern: string; full: string; left: string; right: string } {
  const mask = calculatorMask(width);
  checkReading(reading);
  const rawLeft = boundedDecimal(leftPattern, mask);
  let left: bigint;
  let right: bigint;
  let full: bigint;
  // The selected subset of upstream compute, with the full result retained too.
  switch (op) {
    case "add":
    case "subtract":
      left = calculatorReading(rawLeft, width, reading);
      right = calculatorReading(boundedDecimal(rightPattern, mask), width, reading);
      full = op === "add" ? left + right : left - right;
      break;
    case "shift-left":
      left = rawLeft;
      right = boundedDecimal(rightPattern, BigInt(width - 1));
      full = left << right;
      break;
    default:
      throw new TypeError("operation");
  }
  return {
    pattern: calculatorPattern(full, width).toString(),
    full: full.toString(),
    left: left.toString(),
    right: right.toString(),
  };
}

/** Carry into each column of an ordinary addition, independent of its decimal reading. */
export function calculatorAdditionCarries(
  leftPattern: string,
  rightPattern: string,
  width: CalculatorWidth,
): { carries: string; intoSign: 0 | 1; out: 0 | 1; c: 0 | 1; v: 0 | 1 } {
  const result = calculatorCompute(leftPattern, "add", rightPattern, width, "unsigned");
  const sum = BigInt(result.full);
  // The same carry identity used by the simulator's addWithCarry, with initial carry zero.
  const carries = (BigInt(leftPattern) ^ BigInt(rightPattern) ^ sum) & calculatorMask(width);
  const intoSign = Number((carries >> BigInt(width - 1)) & 1n) as 0 | 1;
  const out = Number((sum >> BigInt(width)) & 1n) as 0 | 1;
  return { carries: carries.toString(), intoSign, out, c: out, v: intoSign === out ? 0 : 1 };
}

/** The two unsigned 16-bit halves of a validated 32-bit pattern. */
export function calculatorHalves(pattern: string): { upper: string; lower: string } {
  const value = boundedDecimal(pattern, calculatorMask(32));
  return { upper: (value >> 16n).toString(), lower: (value & 0xffffn).toString() };
}

/** Replace one 16-bit half, preserving every bit in the other half. */
export function calculatorSetHalf(pattern: string, half: "upper" | "lower", value: string): string {
  const original = boundedDecimal(pattern, calculatorMask(32));
  const replacement = boundedDecimal(value, 0xffffn);
  if (half === "upper") return ((original & 0xffffn) | (replacement << 16n)).toString();
  if (half === "lower") return ((original & 0xffff0000n) | replacement).toString();
  throw new TypeError("half");
}
