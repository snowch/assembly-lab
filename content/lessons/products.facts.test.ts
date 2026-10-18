// Copyright © 2026 Christopher Snow
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { assemble, run } from "@al/machine";
import * as R from "./products.listings";
const plain = (s: string) => s.replace(/ C\d+$/gm, "");
const norm = (s: string) =>
  plain(s)
    .split("\n")
    .map((l) => l.trim().replace(/\s+/g, " "))
    .filter((l) => l && !l.startsWith("//"))
    .join("\n");
const records: [string, { c: string; listing: string }][] = Object.entries(R).flatMap(
  ([name, value]) => (typeof value === "string" ? [] : [[name, value]]),
);
const load = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");
function execute(
  program: { listing: string },
  args: readonly (number | string)[],
  width: 32 | 64 = 32,
) {
  const built = assemble(plain(program.listing));
  if (!built.program) throw Error(JSON.stringify(built.errors));
  const result = run(built.program, {
    entry: 0x400000,
    flags: { n: true, z: false, c: true, v: true },
    args: args.map((value) => ({ value: BigInt(value), width })),
  });
  expect(result.stop.kind).toBe("returned");
  return result;
}
describe("Module 8 recorded compiler and differential programs", () => {
  it.each(records)("%s has exactly the shown program in the QEMU corpus", (name, record) => {
    const path = `../../scripts/real-tools/corpus/module8-${name.toLowerCase().replaceAll("_", "-")}`;
    expect(norm(load(path + ".s"))).toBe(norm(record.listing));
    const fixture = JSON.parse(load(path + ".json"));
    expect(fixture.calls.length).toBeGreaterThan(1);
  });
  it.each(records.filter(([, r]) => r.c !== ""))(
    "%s matches GCC 16.1 -O1 source and line mapping",
    (name, record) => {
      const path = `../../docs/notes/module-8/compiler/${name.toLowerCase()}`;
      const source = load(path + ".c"),
        request = JSON.parse(load(path + ".request.json")),
        response = JSON.parse(load(path + ".response.json")) as {
          code: number;
          asm: { text: string; source?: { line: number } | null }[];
        };
      expect(request.source).toBe(source);
      expect(request.options.userArguments).toBe("-O1");
      expect(source.split("\n").slice(1).join("\n").trim()).toBe(record.c);
      expect(response.code).toBe(0);
      expect(
        record.listing
          .split("\n")
          .map((l) => l.trim())
          .join("\n"),
      ).toBe(
        response.asm
          .map(
            (row) =>
              row.text.trim().replace(/\s+/g, " ") + (row.source ? ` C${row.source.line - 1}` : ""),
          )
          .join("\n"),
      );
    },
  );
});
describe("Module 8 product widths and readings", () => {
  it("drops upper32 before a later wide read", () => {
    expect(execute(R.SCALE_PULSES, [2147483648, 2]).final.x[0]).toBe(0n);
    expect(execute(R.WIDE_UNSIGNED, [2147483648, 2]).final.x[0]).toBe(4294967296n);
    expect(execute(R.WIDE_TOO_LATE, [4294967295, 2]).final.x[0]).toBe(4294967294n);
    expect(execute(R.WIDE_UNSIGNED, [4294967295, 2]).final.x[0]).toBe(8589934590n);
    expect(execute(R.WIDE_UNSIGNED, [4294967295, 4294967295]).final.x[0]).toBe(
      18446744065119617025n,
    );
    expect(execute(R.WIDE_SIGNED, [-1, 2]).final.x[0]).toBe(18446744073709551614n);
  });
  it("pins multiply-add and fourth-operand-minus-product", () => {
    expect(execute(R.SCALED_TOTAL, [7, 6, 10]).final.x[0]).toBe(52n);
    expect(execute(R.SUBTRACT_PRODUCT, [100, 7, 6]).final.x[0]).toBe(58n);
  });
  it.each([
    ["18446744073709551615", "2"],
    ["9223372036854775808", "2"],
    ["18446744073709551615", "18446744073709551615"],
    ["0", "9223372036854775808"],
  ])("low64 agrees for either reading of %s times %s; high64 can differ", (a, b) => {
    const r = execute(R.PRODUCT_HALVES, [a, b], 64);
    const unsigned = BigInt(a) * BigInt(b),
      signed = BigInt.asIntN(64, BigInt(a)) * BigInt.asIntN(64, BigInt(b));
    expect(r.final.x[2]).toBe(BigInt.asUintN(64, unsigned));
    expect(r.final.x[2]).toBe(BigInt.asUintN(64, signed));
    expect(r.final.x[3]).toBe(BigInt.asUintN(64, unsigned >> 64n));
    expect(r.final.x[4]).toBe(BigInt.asUintN(64, signed >> 64n));
  });
});
describe("Module 8 quotient and remainder", () => {
  it.each([
    [-17, 5, -3, -2],
    [17, -5, -3, 2],
    [-17, -5, 3, -2],
    [17, 5, 3, 2],
    [-2147483648, 7, -306783378, -2],
  ])("%i / %i truncates toward zero", (n, d, q, r) => {
    const result = execute(R.REMAINDER_SIGNED, [n, d]);
    expect(BigInt.asIntN(32, result.final.x[2]!)).toBe(BigInt(q));
    expect(BigInt.asIntN(32, result.final.x[0]!)).toBe(BigInt(r));
    expect(n).toBe(q * d + r);
  });
  it("changing only the divide reading changes the remainder", () => {
    expect(execute(R.WRONG_REMAINDER, [-17, 5]).final.x[0]).toBe(4n);
  });
  it("pins A64 edge results independently of C semantics", () => {
    expect(execute(R.DIVIDE_EDGES, [17, 0]).final.x.slice(2, 4)).toEqual([0n, 0n]);
    expect(execute(R.DIVIDE_EDGES, [-2147483648, -1]).final.x.slice(2, 4)).toEqual([
      2147483648n,
      0n,
    ]);
  });
  it.each([0, 1, 9, 10, 11, 12345, 2147483648, 4294967295])(
    "recorded constant division handles %i",
    (n) => {
      expect(execute(R.GROUPS_OF_TEN, [n]).final.x[0]).toBe(BigInt(n) / 10n);
    },
  );
  it("widens before multiplying consumption and handles zero distance", () => {
    expect(execute(R.CONSUMPTION, [4294967295, 1]).final.x[0]).toBe(429496729500n);
    expect(execute(R.CONSUMPTION, [4294967295, 100]).final.x[0]).toBe(4294967295n);
    expect(execute(R.CONSUMPTION, [600, 1000]).final.x[0]).toBe(60n);
    expect(execute(R.CONSUMPTION, [600, 0]).final.x[0]).toBe(0n);
    expect(execute(R.CONSUMPTION, [1, 3]).final.x[0]).toBe(33n);
  });
  it.each(records)("%s leaves NZCV unchanged", (_, record) => {
    const r = execute(record, [17, 5, 10]);
    expect(r.final.flags).toEqual(r.initial.flags);
  });
});
