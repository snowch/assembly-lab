// Copyright © 2026 Christopher Snow

import { describe, expect, it } from "vitest";
import { assemble, run } from "@al/machine";
import { compileC, interpretC, type CompiledC } from "./index.ts";

function compiled(source: string): CompiledC {
  const result = compileC(source);
  if (!result.ok) throw new Error(JSON.stringify(result.errors));
  return result;
}
function compare(source: string, args: number[], expected?: number): void {
  const c = compiled(source),
    evaluated = interpretC(c, args);
  expect(evaluated.ok).toBe(true);
  if (!evaluated.ok) return;
  if (expected !== undefined) expect(evaluated.value).toBe(expected);
  const assembly = assemble(c.listing);
  expect(assembly.errors).toEqual([]);
  if (!assembly.program) throw new Error(c.listing);
  const execution = run(assembly.program, {
    entry: 0x400000,
    args: args.map((value) => ({ value: BigInt(value), width: 32 })),
    maxSteps: 10000,
  });
  expect(execution.stop.kind).toBe("returned");
  expect(Number(execution.final.x[0])).toBe(evaluated.value);
}
describe("C expressions agree with the independently executed instruction stream", () => {
  it.each(["+", "-", "*", "/", "%", "&", "|", "^", "==", "!=", "<", "<=", ">", ">="])(
    "unsigned %s at boundaries and generated inputs",
    (op) => {
      const c = `unsigned compute(unsigned a, unsigned b) { return a ${op} b; }`;
      const values = [0, 1, 2, 65535, 65536, 0x7fffffff, 0x80000000, 0xfffffffe, 0xffffffff];
      for (const a of values)
        for (const b of values) if (b || (op !== "/" && op !== "%")) compare(c, [a, b]);
      let seed = 0xc0ffee;
      for (let i = 0; i < 24; i++) {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        const a = seed;
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        compare(c, [a, seed || 1]);
      }
    },
  );
  it.each([0, 1, 15, 16, 31])("shifts by %i", (shift) => {
    for (const value of [0, 1, 0x80000000, 0xffffffff])
      for (const op of ["<<", ">>"])
        compare(`unsigned f(unsigned a, unsigned b) { return a ${op} b; }`, [value, shift]);
  });
  it("honours all precedence levels and left associativity", () => {
    compare("unsigned f(void) { return 2 + 3 * 4; }", [], 14);
    compare("unsigned f(void) { return 20 / 2 / 2; }", [], 5);
    compare("unsigned f(void) { return 3 & 1 == 1; }", [], 1);
    compare("unsigned f(void) { return 1 | 2 ^ 3 & 1; }", [], 3);
    compare("unsigned f(void) { return 1 + 2 << 2; }", [], 12);
    compare("unsigned f(void) { return (1 - 2) < 0; }", [], 1);
    compare("unsigned f(void) { return (1u - 2) < 0; }", [], 0);
    compare("unsigned f(void) { return (1 - 8) / 2; }", [], 4294967293);
    compare("unsigned f(void) { return (1 - 8) % 2; }", [], 4294967295);
    compare("unsigned f(void) { return ~0; }", [], 0xffffffff);
    compare("unsigned f(void) { return ~0u > 1; }", [], 1);
    compare("unsigned f(unsigned a) { return !a + !!a; }", [19], 1);
  });
  it("materialises large values and keeps inputs alive until the expression is complete", () => {
    compare(
      "unsigned f(unsigned a, unsigned b, unsigned c, unsigned d) { return (a + b) * (a + c) - (d % (a + 1)); }",
      [7, 11, 13, 17],
      359,
    );
    for (const value of [65535, 65536, 0x12345678, 0xffffffff])
      compare(`unsigned f(void) { return ${value}u; }`, [], value);
  });
});
describe("statements and scope", () => {
  it.each([0, 1, 4, 7])("executes for and while, including zero entries %i", (count) => {
    compare(
      "unsigned f(unsigned n) { unsigned total = 0; for (unsigned i = 0; i < n; i++) { total = total + i; } while (n != 0) { total = total + 2; n--; } return total; }",
      [count],
      (count * (count - 1)) / 2 + count * 2,
    );
  });
  it("handles block shadowing, dangling else, early returns and parameter assignment", () => {
    const source =
      "unsigned f(unsigned a) { unsigned b = 7; { unsigned b = a + 1; a = b; } if (a > 4) if (a > 9) return 30; else return 20; return b; }";
    compare(source, [0], 7);
    compare(source, [5], 20);
    compare(source, [11], 30);
    compare("unsigned f(unsigned a) { if (a) { return 1; } else { return 2; } }", [0], 2);
  });
  it("supports initialized locals and assignment-form for loops", () =>
    compare(
      "unsigned int f(unsigned int n) { unsigned i = 0; unsigned result = 0; for (i = 0; i < n; i = i + 1) result = result + 3; return result; }",
      [4],
      12,
    ));
  it("maps each emitted line to its actual C source line deterministically", () => {
    const source = "unsigned f(unsigned a) {\n unsigned b = a + 7;\n return b;\n}";
    const c = compiled(source);
    expect(compileC(source)).toEqual(c);
    expect(c.lineMap).toHaveLength(c.listing.split("\n").length);
    const add = c.listing.split("\n").findIndex((line) => line.includes("add "));
    expect(c.lineMap[add]?.cLine).toBe(2);
    expect(c.lineMap.at(-1)?.cLine).toBe(3);
  });
  it("counts source lines through both comment forms", () => {
    const result = compileC("// title\n/* one\n two */\nunsigned f(void) {\n return missing;\n}");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors[0]).toEqual({ line: 5, column: 9, code: "unknown-name" });
  });
});
describe("unsupported C and bounded execution", () => {
  it.each(["\n", "\r\n"])("rejects C line splicing before comment recognition (%j)", (newline) => {
    const source = `unsigned f(void) { // continued comment\\${newline}return 5;${newline}return 7;${newline}}`;
    const result = compileC(source);
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.errors[0]).toEqual({ line: 1, column: 40, code: "unsupported-token" });
    expect(compileC(`unsigned f(void) { return 1\\${newline}+2; }`).ok).toBe(false);
    expect(compileC(`unsigned f(void) { /* ignored\\${newline} */ return 1; }`).ok).toBe(false);
  });
  it("rejects JavaScript-only Unicode whitespace and handles C physical line endings", () => {
    for (const whitespace of ["\u00a0", "\u2003", "\ufeff"])
      expect(compileC(`unsigned${whitespace}f(void) { return 1; }`).ok).toBe(false);
    for (const newline of ["\n", "\r\n", "\r"])
      compare(
        `unsigned f(void) { // comment${newline}return 5;${newline}return 7;${newline}}`,
        [],
        5,
      );
  });
  it.each([
    ["unsigned f(void) { return 4294967296u; }", "literal-range"],
    ["unsigned f(void) { return 2147483648; }", "literal-type"],
    ["unsigned f(void) { return 017; }", "literal-type"],
    ["unsigned f(void) { unsigned a = a; return a; }", "unknown-name"],
    ["unsigned f(unsigned a) { unsigned a = 2; return a; }", "duplicate-name"],
    ["unsigned f(void) { { unsigned a = 2; } return a; }", "unknown-name"],
    ["unsigned f(void) { for (unsigned i = 0; i < 2; i++) {} return i; }", "unknown-name"],
    [
      "unsigned f(unsigned a, unsigned b, unsigned c, unsigned d, unsigned e) { return a; }",
      "parameter-limit",
    ],
    [
      "unsigned f(void) { unsigned a = 0; unsigned b = 0; unsigned c = 0; unsigned d = 0; unsigned e = 0; unsigned f = 0; unsigned g = 0; unsigned h = 0; unsigned i = 0; return a; }",
      "variable-limit",
    ],
    ["unsigned f(unsigned a) { if (a) return 1; }", "missing-return"],
    ["unsigned f(void) { return g(); }", "unknown-name"],
    ["unsigned f(void) { return 1.5; }", "unsupported-token"],
    ["unsigned f(void) { return 1; } /*", "unclosed-comment"],
  ])("rejects %s", (source, code) => {
    const result = compileC(source!);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors[0]?.code).toBe(code);
  });
  it.each([
    "int f(void) { return 1; }",
    "unsigned f(void) { unsigned a; return a; }",
    "unsigned f(void) { return 1; } unsigned g(void) { return 2; }",
    "unsigned f(unsigned a) { if(a) unsigned b = 2; return a; }",
    "unsigned f(unsigned *a) { return *a; }",
  ])("rejects unsupported construct %s", (source) => expect(compileC(source).ok).toBe(false));
  it.each([
    ["return a / b;", [1, 0], "division-zero"],
    ["return a % b;", [1, 0], "division-zero"],
    ["return 2147483647 + 1;", [0, 0], "signed-overflow"],
    ["return 65536 * 65536;", [0, 0], "signed-overflow"],
    ["return ((~2147483647) / (~0));", [0, 0], "signed-overflow"],
    ["return a << b;", [1, 32], "shift-range"],
    ["return (~0) >> 1;", [0, 0], "signed-shift"],
    ["return 1 << 31;", [0, 0], "signed-overflow"],
    ["while (a != 0) { a = a; } return a;", [1, 0], "step-limit"],
  ] as const)("refuses undefined or unbounded execution %s", (body, args, code) => {
    const result = interpretC(compiled(`unsigned f(unsigned a, unsigned b) { ${body} }`), args, {
      maxSteps: 100,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe(code);
  });
  it("accepts branches which avoid undefined expressions", () =>
    compare(
      "unsigned f(unsigned a, unsigned b) { if (b == 0) return 0; return a / b; }",
      [1, 0],
      0,
    ));
  it("rejects bad argument counts and values", () => {
    const c = compiled("unsigned f(unsigned a) { return a; }");
    for (const args of [[], [1, 2], [-1], [0x100000000], [NaN], [1.5]])
      expect(interpretC(c, args).ok).toBe(false);
  });
  it("bounds source, tokens, nesting, and temporary register pressure", () => {
    expect(compileC(" ".repeat(12001)).ok).toBe(false);
    expect(compileC("unsigned f(void) {" + "return 1;".repeat(700) + "}").ok).toBe(false);
    expect(
      compileC("unsigned f(void) { return " + "(".repeat(50) + "1" + ")".repeat(50) + "; }").ok,
    ).toBe(false);
    expect(
      compileC("unsigned f(void) { return " + "1 + (".repeat(11) + "1" + ")".repeat(11) + "; }").ok,
    ).toBe(false);
  });
});
