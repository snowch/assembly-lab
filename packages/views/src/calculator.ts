// Copyright © 2026 Christopher Snow

export type Calculation =
  { value: string } | { error: "empty" | "invalid" | "zeroDivision" | "fraction" | "large" };

/** Exact whole-number scratch arithmetic. No JavaScript evaluation or exercise state. */
export function calculate(source: string): Calculation {
  if (!source.trim()) return { error: "empty" };
  // Bound tokens, nesting and BigInt work before parsing untrusted input.
  if (source.length > 200) return { error: "large" };
  const input = source.replaceAll("−", "-").replaceAll("×", "*").replaceAll("÷", "/");
  const tokens = input.match(/\d[\d,]*|[()+*/-]|[^\s]/g) ?? [];
  let index = 0;
  const fail = (error: Exclude<Calculation, { value: string }>["error"]): never => {
    throw error;
  };
  const atom = (): bigint => {
    const token = tokens[index++];
    if (token === "+") return atom();
    if (token === "-") return -atom();
    if (token === "(") {
      const value = sum();
      if (tokens[index++] !== ")") fail("invalid");
      return value;
    }
    if (!token || !/^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(token)) return fail("invalid");
    return BigInt(token.replaceAll(",", ""));
  };
  const product = (): bigint => {
    let value = atom();
    while (tokens[index] === "*" || tokens[index] === "/") {
      const op = tokens[index++];
      const right = atom();
      if (op === "*") value *= right;
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
      value = op === "+" ? value + right : value - right;
    }
    return value;
  };
  try {
    const value = sum();
    if (index !== tokens.length) return { error: "invalid" };
    return { value: value.toString() };
  } catch (error) {
    if (error === "zeroDivision" || error === "fraction") return { error };
    return { error: "invalid" };
  }
}
