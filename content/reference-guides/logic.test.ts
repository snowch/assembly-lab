// Copyright © 2026 Christopher Snow

import { describe, expect, it } from "vitest";
import { assemble, run } from "@al/machine";
import { INSTRUCTION_QUICK_REFERENCE } from "../instruction-quick-reference";
import { LOGIC_GUIDES } from "./logic";
import type { ExplainedReferenceExample } from "./types";

function execute(example: ExplainedReferenceExample) {
  const source = [
    ".text",
    ".global reference_example",
    "reference_example:",
    "mov x28, x30",
    example.setup ?? "",
    ".Lfocus:",
    example.instruction,
    example.continuation ?? "",
    ".Lafter:",
    "mov x30, x28",
    "ret",
    example.data ?? "",
  ].join("\n");
  const built = assemble(source);
  expect(built.errors).toEqual([]);
  if (!built.program) throw new Error("Example did not assemble");
  const result = run(built.program, { entry: "reference_example" });
  expect(result.stop.kind).toBe("returned");
  return result;
}

const example = (mnemonic: string, form: string) => {
  const found = LOGIC_GUIDES[mnemonic]?.find((item) => item.id === form)?.examples[0];
  if (!found) throw new Error(`Missing ${mnemonic} ${form}`);
  return found;
};

describe("explained logical, shift, field and extension forms", () => {
  it("retains every original syntax form and executes all its examples independently", () => {
    for (const [mnemonic, guides] of Object.entries(LOGIC_GUIDES)) {
      const original = INSTRUCTION_QUICK_REFERENCE.find((item) => item.mnemonic === mnemonic);
      expect(original).toBeDefined();
      const syntax = guides.flatMap((guide) => guide.syntax);
      for (const form of original!.forms) expect(syntax, mnemonic).toContain(form);
      for (const guide of guides) {
        expect(guide.examples.length).toBeGreaterThan(0);
        for (const item of guide.examples) execute(item);
        for (const mistake of guide.mistakes ?? []) {
          expect(assemble(mistake.source).errors[0]?.key, mistake.source).toBe(mistake.errorKey);
        }
      }
    }
  });

  it("shows the source-preserving differences between logical operations", () => {
    const values = {
      and: 0x18n,
      ands: 0x18n,
      orr: 0x7en,
      eor: 0x66n,
      bic: 0x42n,
      bics: 0x42n,
      orn: 0xffffffdbn,
      eon: 0xffffff99n,
      mvn: 0xffffffa5n,
    };
    for (const [name, expected] of Object.entries(values)) {
      const result = execute(example(name, "register"));
      expect(result.final.x[8], name).toBe(expected);
      expect(result.final.x[9]).toBe(0x5an);
      expect(result.final.x[10]).toBe(0x3cn);
    }
    const tested = execute(example("tst", "register"));
    expect(tested.final.x[8]).toBe(0xfn);
    expect(tested.final.flags).toEqual({ n: false, z: false, c: false, v: false });
  });

  it("distinguishes immediate bounds from a register amount's low-bit selection", () => {
    for (const name of ["lsl", "lsr", "asr", "ror"]) {
      const immediate = execute(example(name, "immediate"));
      const variable = execute(example(name, "register"));
      expect(variable.final.x[8], name).toBe(immediate.final.x[8]);
      expect(variable.final.x[10]).toBe(34n);
      const boundary = LOGIC_GUIDES[name]![0]!.examples[1]!;
      execute(boundary);
      expect(assemble(`${name} w8, w9, #32`).errors[0]?.key).toBe("immediate.range");
    }
    expect(BigInt.asIntN(32, execute(example("asr", "immediate")).final.x[8]!)).toBe(-9n);
    expect(execute(example("lsr", "immediate")).final.x[8]).toBe(9n);
    expect(execute(example("ror", "immediate")).final.x[8]).toBe(0x40000001n);
  });

  it("shows extract versus insert, sign extension and retained destination bits", () => {
    const values = {
      ubfx: 0xdn,
      sbfx: 0xfffffffdn,
      ubfiz: 0x60n,
      sbfiz: 0xffffffd0n,
      bfi: 0x6an,
      bfxil: 0x5dn,
    };
    for (const [name, expected] of Object.entries(values)) {
      expect(execute(example(name, "field")).final.x[8], name).toBe(expected);
    }
  });

  it("distinguishes a 32-bit signed result from a full 64-bit sign extension", () => {
    const narrow = execute(example("sxtb", "w-result"));
    const wide = execute(example("sxtb", "x-result"));
    expect(narrow.final.x[8]).toBe(0xfffffff5n);
    expect(wide.final.x[8]).toBe(0xfffffffffffffff5n);
    for (const name of ["uxtb", "uxth"]) {
      expect(execute(example(name, "x-spelling")).final.x[8]).toBe(
        execute(example(name, "w-result")).final.x[8],
      );
    }
  });
});
