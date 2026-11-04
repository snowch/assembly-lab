// Copyright © 2026 Christopher Snow

export type Calculation =
  | { value: string }
  | { error: "empty" | "invalid" | "zeroDivision" | "fraction" | "negativePower" | "large" };

const MAX_POWER = 4096n;
const MAX_MAGNITUDE = (1n << 16384n) - 1n;

/** Exact whole-number scratch arithmetic. No JavaScript evaluation or exercise state. */
export function calculate(source: string): Calculation {
  if (!source.trim()) return { error: "empty" };
  // Bound tokens, nesting and BigInt work before parsing untrusted input.
  if (source.length > 200) return { error: "large" };
  const input = source.replaceAll("−", "-").replaceAll("×", "*").replaceAll("÷", "/");
  const tokens = input.match(/\d[\d,]*|[()+*/^\-]|[^\s]/g) ?? [];
  let index = 0;
  const fail = (error: Exclude<Calculation, { value: string }>["error"]): never => {
    throw error;
  };
  const bounded = (value: bigint): bigint => {
    if (value > MAX_MAGNITUDE || value < -MAX_MAGNITUDE) fail("large");
    return value;
  };
  const raise = (base: bigint, exponent: bigint): bigint => {
    if (exponent < 0n) fail("negativePower");
    if (exponent > MAX_POWER) fail("large");
    // Check each multiplication instead of allocating a potentially huge power first.
    // As for BigInt exponentiation, a zero exponent gives 1, including 0^0.
    let result = 1n;
    while (exponent > 0n) {
      if (exponent % 2n === 1n) result = bounded(result * base);
      exponent /= 2n;
      if (exponent > 0n) base = bounded(base * base);
    }
    return result;
  };
  const atom = (): bigint => {
    const token = tokens[index++];
    if (token === "(") {
      const value = sum();
      if (tokens[index++] !== ")") fail("invalid");
      return value;
    }
    if (!token || !/^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(token)) return fail("invalid");
    return BigInt(token.replaceAll(",", ""));
  };
  // Powers bind more tightly than signs and associate right: -2^2 = -(2^2),
  // while 2^3^2 = 2^(3^2). Parentheses can explicitly choose another grouping.
  const power = (): bigint => {
    const base = atom();
    if (tokens[index] !== "^") return base;
    index++;
    return raise(base, unary());
  };
  const unary = (): bigint => {
    if (tokens[index] === "+") {
      index++;
      return unary();
    }
    if (tokens[index] === "-") {
      index++;
      return -unary();
    }
    return power();
  };
  const product = (): bigint => {
    let value = unary();
    while (tokens[index] === "*" || tokens[index] === "/") {
      const op = tokens[index++];
      const right = unary();
      if (op === "*") value = bounded(value * right);
      else {
        if (right === 0n) fail("zeroDivision");
        if (value % right !== 0n) fail("fraction");
        value /= right;
      }
    }
    return value;
  };
  const sum = (): bigint => {
    let value = product();
    while (tokens[index] === "+" || tokens[index] === "-") {
      const op = tokens[index++];
      const right = product();
      value = bounded(op === "+" ? value + right : value - right);
    }
    return value;
  };
  try {
    const value = sum();
    if (index !== tokens.length) return { error: "invalid" };
    return { value: value.toString() };
  } catch (error) {
    if (
      error === "zeroDivision" ||
      error === "fraction" ||
      error === "negativePower" ||
      error === "large"
    )
      return { error };
    return { error: "invalid" };
  }
}
