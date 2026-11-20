// Copyright © 2026 Christopher Snow

import { describe, expect, it } from "vitest";
import { computeReferenceExample } from "./model";
import { MEMORY_GUIDES } from "./memory";

function computed(mnemonic: string, exampleId: string) {
  const example = MEMORY_GUIDES[mnemonic]
    ?.flatMap((form) => form.examples)
    .find((item) => item.id === exampleId);
  if (!example) throw new Error(`Missing memory example ${exampleId}`);
  return computeReferenceExample(example);
}

describe("memory reference observations", () => {
  it("shows a load's addressed data and signed destination independently", () => {
    const example = computed("ldrsb", "ldrsb-base");
    expect(example.rows.find((row) => row.label === "x8")).toMatchObject({
      before: "0",
      after: "-19",
      reading: "signed",
    });
    expect(example.rows.find((row) => row.kind === "memory")).toMatchObject({
      before: "-19",
      after: "-19",
    });
    const base = example.rows.find((row) => row.label === "x9")!;
    expect(base.after).toBe(base.before);
  });

  it("distinguishes fixed offsets from pre-access and post-access base updates", () => {
    const offset = computed("str", "str-offset-positive");
    const pre = computed("str", "str-pre-index");
    const post = computed("str", "str-post-index");
    for (const example of [offset, pre, post]) {
      expect(example.rows.find((row) => row.kind === "memory")).toMatchObject({
        before: "67",
        after: "53",
      });
      expect(example.rows.find((row) => row.label === "x8")).toMatchObject({
        before: "53",
        after: "53",
      });
    }
    const offsetBase = offset.rows.find((row) => row.label === "x9")!;
    const preBase = pre.rows.find((row) => row.label === "x9")!;
    const postBase = post.rows.find((row) => row.label === "x9")!;
    expect(offsetBase.after).toBe(offsetBase.before);
    expect(BigInt(preBase.after) - BigInt(preBase.before)).toBe(8n);
    expect(BigInt(postBase.after) - BigInt(postBase.before)).toBe(8n);
    expect(postBase.before).toBe(preBase.after);
  });

  it("shows byte and halfword stores truncate the copied value, not the input register", () => {
    for (const [name, input] of [
      ["strb", "309"],
      ["strh", "65589"],
    ] as const) {
      const example = computed(name, `${name}-base`);
      expect(example.rows.find((row) => row.label === "w8")).toMatchObject({
        before: input,
        after: input,
      });
      expect(example.rows.find((row) => row.kind === "memory")).toMatchObject({
        before: "67",
        after: "53",
      });
    }
  });

  it.each([
    { instruction: "ldr x9, [x9]", afterX9: "45", afterX10: "8" },
    { instruction: "ldr w9, [x9]", afterX9: "45", afterX10: "8" },
    { instruction: "ldr x9, [x9, #8]", afterX9: "67", afterX10: "8" },
    { instruction: "ldr x9, [x9, x10]", afterX9: "67", afterX10: "8" },
    { instruction: "ldr x10, [x9, x10]", afterX9: "4259840", afterX10: "67" },
    { instruction: "ldp x9, x10, [x9]", afterX9: "45", afterX10: "67" },
    { instruction: "ldp x9, x10, [x9, #8]", afterX9: "67", afterX10: "89" },
  ])(
    "separates address writeback from a load destination: $instruction",
    ({ instruction, afterX9, afterX10 }) => {
      const example = computeReferenceExample({
        id: "test-load-overlap",
        setup: "adr x9, .Ldata\nmov x10, #8",
        instruction,
        data: ".data\n.balign 16\n.Ldata:\n.quad 45, 67, 89, 103",
        watch: [
          { kind: "register", name: "x9" },
          { kind: "register", name: "x10" },
          { kind: "memory", symbol: ".Ldata", bytes: 8 },
        ],
        explanation: "Test-only load overlap, not a displayed reference example.",
      });
      expect(example.rows.find((row) => row.label === "x9")?.after).toBe(afterX9);
      expect(example.rows.find((row) => row.label === "x10")?.after).toBe(afterX10);
      expect(example.rows.find((row) => row.kind === "memory")).toMatchObject({
        before: "45",
        after: "45",
      });
    },
  );

  it("shows both adjacent pair values before moving the base past them", () => {
    const example = computed("ldp", "ldp-post-index");
    expect(example.rows.find((row) => row.label === "x8")).toMatchObject({
      before: "0",
      after: "67",
    });
    expect(example.rows.find((row) => row.label === "x10")).toMatchObject({
      before: "0",
      after: "89",
    });
    const base = example.rows.find((row) => row.label === "x9")!;
    expect(BigInt(base.after) - BigInt(base.before)).toBe(16n);
    expect(example.rows.filter((row) => row.kind === "memory").map((row) => row.after)).toEqual([
      "67",
      "89",
    ]);
  });
});
