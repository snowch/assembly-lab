// Copyright © 2026 Christopher Snow
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { assemble, run } from "@al/machine";
import * as L from "./c-boundaries.listings";

const records = {
  CAN_INCREMENT: L.CAN_INCREMENT,
  CAN_INCREMENT_WRAP: L.CAN_INCREMENT_WRAP,
  INCREMENT_LIMIT: L.INCREMENT_LIMIT,
  SAFE_INCREMENT_BRANCH: L.SAFE_INCREMENT_BRANCH,
  NARROW_FUEL: L.NARROW_FUEL,
  NARROW_GRADIENT: L.NARROW_GRADIENT,
  FUEL_FITS: L.FUEL_FITS,
  CHECKED_TRIP: L.CHECKED_TRIP,
  NEGATE_GRADIENT: L.NEGATE_GRADIENT,
  UNSIGNED_SUM_OVERFLOW: L.UNSIGNED_SUM_OVERFLOW,
  UNSIGNED_SUB_WRAP: L.UNSIGNED_SUB_WRAP,
  PROMOTED_GRADIENT: L.PROMOTED_GRADIENT,
  MIXED_LIMIT: L.MIXED_LIMIT,
};
const plain = (s: string) => s.replace(/ C\d+$/gm, "");
const normalize = (s: string) =>
  plain(s)
    .split("\n")
    .map((s) => s.trim().replace(/\s+/g, " "))
    .filter((s) => s && !s.startsWith("//"))
    .join("\n");
function call(listing: string, args: number[]) {
  const a = assemble(plain(listing));
  if (!a.program) throw Error(JSON.stringify(a.errors));
  return run(a.program, {
    entry: 0x400000,
    args: args.map((value) => ({ value: BigInt(value), width: 32 })),
    maxSteps: 100,
  });
}
const result = (listing: string, args: number[]) => Number(call(listing, args).final.x[0]);

describe("Module 11 recorded compiler evidence", () => {
  it.each(Object.entries(records))(
    "%s retains the submitted C, flags and source map",
    (name, p) => {
      const base = `../../docs/notes/module-11/compiler/${name.toLowerCase()}`;
      const read = (suffix: string) =>
        readFileSync(new URL(base + suffix, import.meta.url), "utf8");
      const req = JSON.parse(read(".request.json"));
      const res = JSON.parse(read(".response.json")) as {
        code: number;
        asm: { text: string; source?: { line: number } | null }[];
      };
      expect(req.source).toBe(read(".c"));
      expect(req.options.userArguments).toContain("-O1 -std=c23");
      expect(req.source.split("\n").slice(1).join("\n").trimEnd()).toBe(p.c);
      expect(res.code).toBe(0);
      expect(
        p.listing
          .split("\n")
          .map((s) => s.trim())
          .join("\n"),
      ).toBe(
        res.asm
          .map(
            (r) => r.text.trim().replace(/\s+/g, " ") + (r.source ? ` C${r.source.line - 1}` : ""),
          )
          .join("\n"),
      );
      const fixture = readFileSync(
        new URL(
          `../../scripts/real-tools/corpus/module11-${name.toLowerCase().replaceAll("_", "-")}.s`,
          import.meta.url,
        ),
        "utf8",
      ).split("\n.data")[0]!;
      expect(normalize(fixture)).toBe(normalize(p.listing));
    },
  );
  it("pins the deliberate compiler option differences", () => {
    const flags = (name: string) =>
      JSON.parse(
        readFileSync(
          new URL(`../../docs/notes/module-11/compiler/${name}.request.json`, import.meta.url),
          "utf8",
        ),
      ).options.userArguments;
    expect(flags("can_increment_wrap")).toBe("-O1 -std=c23 -fwrapv");
    expect(flags("safe_increment_branch")).toBe(
      "-O1 -std=c23 -fno-if-conversion -fno-if-conversion2",
    );
    expect(flags("checked_trip")).toBe("-O1 -std=c23");
  });
  it("records UBSan's actual overflow handler and the format warning without simulating either runtime", () => {
    const response = (name: string) =>
      JSON.parse(
        readFileSync(
          new URL(`../../docs/notes/module-11/compiler/${name}.response.json`, import.meta.url),
          "utf8",
        ),
      );
    const sanitizer = response("sanitize_trip");
    expect(sanitizer.code).toBe(0);
    expect(
      sanitizer.asm.some((r: { text: string }) => r.text.includes("__ubsan_handle_add_overflow")),
    ).toBe(true);
    expect(sanitizer.asm.some((r: { text: string }) => r.text.trim().startsWith("bvs"))).toBe(true);
    const diagnostic = response("format_trip")
      .stderr.map((r: { tag?: { text: string } }) => r.tag?.text ?? "")
      .join("\n");
    expect(diagnostic).toContain("expects argument of type 'int'");
    expect(diagnostic).toContain("argument 2 has type 'unsigned int'");
  });
});

describe("C semantics are distinguished from the chosen machine execution", () => {
  it.each([0, 1, 0x7ffffffe, 0x7fffffff, 0x80000000, 0xffffffff])(
    "the two can_increment binaries at input bits %i",
    (value) => {
      expect(result(L.CAN_INCREMENT.listing, [value])).toBe(1);
      expect(result(L.CAN_INCREMENT_WRAP.listing, [value])).toBe(value === 0x7fffffff ? 0 : 1);
      expect(result(L.INCREMENT_LIMIT.listing, [value])).toBe(value === 0x7fffffff ? 1 : 0);
      expect(result(L.SAFE_INCREMENT_BRANCH.listing, [value])).toBe(
        value === 0x7fffffff ? value : (value + 1) >>> 0,
      );
    },
  );
  it("A64 increments INT_MAX to the sign bit with V set; this is not a defined plain C evaluation", () => {
    const r = call(L.MACHINE_INCREMENT.listing, [0x7fffffff]);
    expect(r.stop.kind).toBe("returned");
    expect(r.final.x[0]).toBe(0x80000000n);
    expect(r.final.flags).toEqual({ n: true, z: false, c: false, v: true });
  });
  it.each([
    [0, 0, 0],
    [127, 127, 127],
    [128, 128, 0xffffff80],
    [200, 200, 0xffffffc8],
    [255, 255, 0xffffffff],
    [256, 0, 0],
    [257, 1, 1],
    [0xffffffff, 255, 0xffffffff],
  ])("narrowing %i keeps the low byte then chooses its reading", (input, unsigned, signed) => {
    expect(result(L.NARROW_FUEL.listing, [input])).toBe(unsigned);
    expect(result(L.NARROW_GRADIENT.listing, [input])).toBe(signed);
    expect(result(L.FUEL_FITS.listing, [input])).toBe(input <= 255 ? 1 : 0);
  });
  it("signed char arithmetic is promoted: 127 + 1 is the defined int value 128", () => {
    expect(result(L.PROMOTED_GRADIENT.listing, [127])).toBe(128);
  });
  it("mixed signed and unsigned comparison converts -1 to UINT_MAX", () => {
    expect(result(L.MIXED_LIMIT.listing, [0xffffffff, 1])).toBe(0);
  });
  it("unsigned sum wrap and subtraction borrow remain detectable in C", () => {
    expect(result(L.UNSIGNED_SUM_OVERFLOW.listing, [0xffffffff, 1])).toBe(1);
    expect(result(L.UNSIGNED_SUM_OVERFLOW.listing, [0x7fffffff, 1])).toBe(0);
    expect(result(L.UNSIGNED_SUB_WRAP.listing, [3, 5])).toBe(1);
    expect(result(L.UNSIGNED_SUB_WRAP.listing, [5, 3])).toBe(0);
  });
  it("A64 negation preserves the INT_MIN bit pattern without making C -INT_MIN defined", () => {
    expect(result(L.NEGATE_GRADIENT.listing, [0x80000000])).toBe(0x80000000);
  });
});
