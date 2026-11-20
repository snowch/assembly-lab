// Copyright © 2026 Christopher Snow

import { describe, expect, it } from "vitest";
import { assemble, run, stateAfter } from "@al/machine";
import { CONTROL_GUIDES } from "./control";
import { INSTRUCTION_QUICK_REFERENCE } from "../instruction-quick-reference";
import type { ExplainedReferenceExample } from "./types";

const programFor = (example: ExplainedReferenceExample) =>
  `.text\n.global reference_example\nreference_example:\nmov x28, x30\n${example.setup ?? ""}\n.Lfocus:\n${example.instruction}\n${example.continuation ?? ""}\n.Lafter:\nmov x30, x28\nret\n${example.data ?? ""}`;

const examples = Object.values(CONTROL_GUIDES).flatMap((forms) =>
  forms.flatMap((form) => form.examples),
);

const snapshot = (id: string) => {
  const example = examples.find((item) => item.id === id)!;
  const { program, errors } = assemble(programFor(example));
  expect(errors).toEqual([]);
  const result = run(program!, { entry: "reference_example", maxSteps: 100 });
  const step = result.steps.findIndex(
    (item) => item.address === program!.symbols[".Lfocus"]!.address,
  );
  return {
    program: program!,
    result,
    step,
    before: stateAfter(result, step - 1),
    after: stateAfter(result, step),
  };
};

describe("explained control and product forms", () => {
  it("covers each declared syntax for all 31 owned instruction names", () => {
    expect(Object.keys(CONTROL_GUIDES)).toHaveLength(31);
    for (const [mnemonic, forms] of Object.entries(CONTROL_GUIDES)) {
      const original = INSTRUCTION_QUICK_REFERENCE.find((entry) => entry.mnemonic === mnemonic)!;
      const syntax = forms.flatMap((form) => form.syntax);
      for (const form of original.forms) expect(syntax, `${mnemonic}: ${form}`).toContain(form);
      expect(new Set(forms.map((form) => form.id)).size).toBe(forms.length);
    }
  });
  for (const [mnemonic, forms] of Object.entries(CONTROL_GUIDES)) {
    for (const form of forms) {
      for (const example of form.examples) {
        it(`${example.id}: prepares and executes one observed instruction, then returns`, () => {
          const { result, step } = snapshot(example.id);
          expect(result.stop).toEqual({ kind: "returned" });
          expect(step).toBeGreaterThanOrEqual(0);
          expect(result.steps[step]!.text).toBe(example.instruction);
          expect(example.watch.length).toBeGreaterThan(0);
        });
      }
      for (const mistake of form.mistakes ?? []) {
        it(`${mnemonic}/${form.id}: rejects ${mistake.source} with its stated error`, () => {
          const result = assemble(mistake.source);
          expect(result.program).toBeNull();
          expect(result.errors[0]?.key).toBe(mistake.errorKey);
        });
      }
    }
  }
  it("shows both conditional-select paths without changing the comparison flags", () => {
    const yes = snapshot("csel-condition-holds");
    const no = snapshot("csel-condition-fails");
    expect(yes.after.x[8]).toBe(yes.before.x[9]);
    expect(no.after.x[8]).toBe(no.before.x[10]);
    expect(yes.after.flags).toEqual(yes.before.flags);
    expect(no.after.flags).toEqual(no.before.flags);
  });
  it("distinguishes signed and unsigned high products of the same bits", () => {
    expect(BigInt.asIntN(64, snapshot("smulh-high-half").after.x[8]!)).toBe(-1n);
    expect(snapshot("umulh-high-half").after.x[8]).toBe(1n);
  });
  it("shows a taken branch skipping the intervening instruction and a failed test falling through", () => {
    const yes = snapshot("b-cond-taken");
    const no = snapshot("b-cond-not-taken");
    expect(yes.after.pc).toBe(yes.program.symbols[".Ltarget"]!.address);
    expect(no.after.pc).toBe(no.before.pc + 4);
    expect(yes.after.flags).toEqual(yes.before.flags);
    expect(no.after.flags).toEqual(no.before.flags);
  });
  it("saves the resume address for calls and reads the prepared address for both return forms", () => {
    const call = snapshot("bl-label");
    expect(call.after.x[30]).toBe(BigInt(call.before.pc + 4));
    expect(call.after.pc).toBe(call.program.symbols[".Ltarget"]!.address);
    for (const id of ["ret-default", "ret-register"]) {
      const example = snapshot(id);
      expect(example.after.pc).toBe(example.program.symbols[".Lafter"]!.address);
    }
  });
});
