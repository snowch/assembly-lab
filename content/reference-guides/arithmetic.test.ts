// Copyright © 2026 Christopher Snow

import { describe, expect, it } from "vitest";
import { assemble, run, stateAfter } from "@al/machine";
import { INSTRUCTION_QUICK_REFERENCE } from "../instruction-quick-reference";
import { ARITHMETIC_GUIDES } from "./arithmetic";
import type { ExplainedReferenceExample } from "./types";

function program(example: ExplainedReferenceExample): string {
  return `.text\n.global reference_example\nreference_example:\nmov x28, x30\n${example.setup ?? ""}\n.Lfocus:\n${example.instruction}\n${example.continuation ?? ""}\n.Lafter:\nmov x30, x28\nret\n${example.data ?? ""}`;
}

describe("explained arithmetic reference forms", () => {
  for (const [mnemonic, forms] of Object.entries(ARITHMETIC_GUIDES)) {
    it(`${mnemonic}: covers each existing syntax and has executable independent examples`, () => {
      const prior = INSTRUCTION_QUICK_REFERENCE.find((entry) => entry.mnemonic === mnemonic)!;
      const syntax = forms.flatMap((form) => form.syntax);
      for (const original of prior.forms) expect(syntax, original).toContain(original);
      expect(new Set(forms.map((form) => form.id)).size).toBe(forms.length);
      for (const form of forms) {
        expect(form.examples.length).toBeGreaterThan(0);
        for (const example of form.examples) {
          const assembled = assemble(program(example));
          expect(assembled.errors, example.id).toEqual([]);
          const result = run(assembled.program!, { entry: "reference_example", maxSteps: 50 });
          expect(result.stop, example.id).toEqual({ kind: "returned" });
          const focus = assembled.program!.symbols[".Lfocus"]!.address;
          const focused = result.steps.filter((step) => step.address === focus);
          expect(focused, example.id).toHaveLength(1);
          expect(focused[0]!.text, example.id).toBe(example.instruction);
        }
      }
    });
    it(`${mnemonic}: each explained rejection has the stated diagnostic`, () => {
      for (const mistake of forms.flatMap((form) => form.mistakes ?? [])) {
        expect(assemble(mistake.source).errors[0]?.key, mistake.source).toBe(mistake.errorKey);
      }
    });
  }
  it("pins the immediate encoding distinction and arithmetic behaviour", () => {
    for (const name of ["add", "adds", "sub", "subs"]) {
      const immediate = ARITHMETIC_GUIDES[name]!.find((form) => form.id === "immediate")!;
      const implicit = immediate.examples.find((example) =>
        example.id.endsWith("-scaled-immediate"),
      )!;
      const explicit = immediate.examples.find((example) =>
        example.id.endsWith("-explicit-immediate-shift"),
      )!;
      const ends = [implicit, explicit].map((example) => {
        const parsed = assemble(program(example));
        const result = run(parsed.program!, { entry: "reference_example" });
        const focusIndex = result.steps.findIndex(
          (step) => step.address === parsed.program!.symbols[".Lfocus"]!.address,
        );
        return stateAfter(result, focusIndex + 1).x[8];
      });
      expect(ends).toEqual(name.startsWith("sub") ? [4096n, 4096n] : [12288n, 12288n]);
    }
    expect(BigInt.asUintN(32, 4294966296n)).toBe(4294966296n);
    expect(assemble("add w8, w9, #4096").errors).toEqual([]);
    for (const value of [4097, 4294966296]) {
      expect(assemble(`add w8, w9, #${value}`).errors[0]?.key).toBe("immediate.addsub");
    }
  });
});
