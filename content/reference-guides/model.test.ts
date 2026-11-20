// Copyright © 2026 Christopher Snow

import { describe, expect, it } from "vitest";
import { assemble } from "@al/machine";
import { buildReferenceExample, computeReferenceExample } from "./model";
import type { ExplainedReferenceExample } from "./types";

const arithmetic: ExplainedReferenceExample = {
  id: "model-add",
  setup: "mov w9, #8\nmov w10, #3",
  instruction: "add w8, w9, w10",
  watch: [
    { kind: "register", name: "w9" },
    { kind: "register", name: "w10" },
    { kind: "register", name: "w8" },
    { kind: "flags" },
  ],
  explanation: "Fixture for computed input and result states.",
};

describe("independently prepared reference examples", () => {
  it("captures the actual input and result moment around one instruction", () => {
    expect(computeReferenceExample(arithmetic).rows).toEqual([
      { kind: "register", label: "w9", before: "8", after: "8", reading: "unsigned" },
      { kind: "register", label: "w10", before: "3", after: "3", reading: "unsigned" },
      { kind: "register", label: "w8", before: "0", after: "11", reading: "unsigned" },
      { kind: "flags", label: "N Z C V", before: "N=0 Z=0 C=0 V=0", after: "N=0 Z=0 C=0 V=0" },
    ]);
  });

  it("formats signed, full-width and zero-register readings without number rounding", () => {
    const value = computeReferenceExample({
      ...arithmetic,
      id: "model-width",
      setup: "mov x8, #-1",
      instruction: "mov w8, #3",
      watch: [
        { kind: "register", name: "x8" },
        { kind: "register", name: "w8", reading: "signed" },
        { kind: "register", name: "x8", reading: "hex" },
        { kind: "register", name: "wzr" },
      ],
    });
    expect(value.rows.map(({ before, after }) => [before, after])).toEqual([
      ["18446744073709551615", "3"],
      ["-1", "3"],
      ["0xFFFFFFFFFFFFFFFF", "0x3"],
      ["0", "0"],
    ]);
  });

  it("reconstructs memory at the focus, without confusing later writes with its result", () => {
    const value = computeReferenceExample({
      ...arithmetic,
      id: "model-store",
      setup: "adr x9, .Ldata\nmov w8, #7",
      instruction: "str w8, [x9]",
      continuation: "str wzr, [x9]",
      data: ".data\n.balign 8\n.Ldata:\n.word 3",
      watch: [{ kind: "memory", symbol: ".Ldata", bytes: 4 }],
    });
    expect(value.rows).toEqual([
      {
        kind: "memory",
        label: ".Ldata",
        symbol: ".Ldata",
        bytes: 4,
        before: "3",
        after: "7",
        reading: "unsigned",
      },
    ]);
  });

  it("shows a branch's actual next address and its data target address", () => {
    const value = computeReferenceExample({
      ...arithmetic,
      id: "model-branch",
      setup: "",
      instruction: "b .Ltarget",
      continuation: "nop\n.Ltarget:\nnop",
      data: ".data\n.Ldata:\n.quad 0",
      watch: [{ kind: "pc" }, { kind: "address", symbol: ".Ldata" }],
    });
    expect(value.branch?.taken).toBe(true);
    expect(value.branch?.target).toMatch(/^\.Ltarget \(0x[0-9A-F]+\)$/);
    expect(value.rows[0]?.after).toBe(value.branch?.target);
    expect(value.rows[1]?.before).toBe(value.rows[1]?.after);
    expect(value.rows[1]?.before).toMatch(/^0x[0-9A-F]+$/);
  });

  it("namespaces local labels so separately displayed examples coexist in the native corpus", () => {
    const fixture = { ...arithmetic, setup: "adr x9, .Ldata", data: ".data\n.Ldata:\n.quad 3" };
    const first = buildReferenceExample(fixture, "first_example");
    const second = buildReferenceExample(fixture, "second_example");
    expect(assemble(`${first.source}\n${second.source}`).errors).toEqual([]);
    expect(first.source).toContain(".Lfirst_example_data");
    expect(second.source).toContain(".Lsecond_example_data");
  });

  it("fails explicitly for malformed, non-returning or multi-instruction examples", () => {
    expect(() => computeReferenceExample({ ...arithmetic, instruction: "madeup w8" })).toThrow(
      /does not assemble/,
    );
    expect(() => computeReferenceExample({ ...arithmetic, instruction: "b .Lfocus" })).toThrow(
      /stopped with/,
    );
    expect(() =>
      computeReferenceExample({ ...arithmetic, instruction: "add w8, w9, w10\nsub w8, w9, w10" }),
    ).toThrow(/exactly one instruction/);
    expect(() => buildReferenceExample({ ...arithmetic, instruction: "mov x28, x9" })).toThrow(
      /reserved/,
    );
    expect(() =>
      computeReferenceExample({ ...arithmetic, watch: [{ kind: "register", name: "w31" }] }),
    ).toThrow(/Unknown reference register/);
  });
});
