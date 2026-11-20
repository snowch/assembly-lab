// Copyright © 2026 Christopher Snow

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { assemble, subsetMnemonics } from "@al/machine";
import { INSTRUCTION_QUICK_REFERENCE } from "../instruction-quick-reference";
import { INSTRUCTION_FORM_GUIDES } from "./index";
import { computeReferenceExample } from "./model";
import {
  EXPLAINED_GUIDE_FAMILIES,
  explainedReferenceCorpus,
} from "../../scripts/real-tools/generate-explained-reference";

const forms = Object.entries(INSTRUCTION_FORM_GUIDES).flatMap(([mnemonic, entries]) =>
  entries.map((form) => ({ mnemonic, form })),
);

describe("explained reference form coverage", () => {
  it("covers the browser subset and every previously documented syntax form", () => {
    expect(Object.keys(INSTRUCTION_FORM_GUIDES).sort()).toEqual(subsetMnemonics().sort());
    for (const entry of INSTRUCTION_QUICK_REFERENCE) {
      const documented =
        INSTRUCTION_FORM_GUIDES[entry.mnemonic]?.flatMap((form) => form.syntax) ?? [];
      for (const syntax of entry.forms)
        expect(documented, `${entry.mnemonic}: ${syntax}`).toContain(syntax);
    }
  });
  it("keeps all actual programs and watched memory in the checked GNU/QEMU corpus", () => {
    const corpus = explainedReferenceCorpus(EXPLAINED_GUIDE_FAMILIES);
    expect(
      readFileSync(
        new URL("../../scripts/real-tools/corpus/explained-reference-examples.s", import.meta.url),
        "utf8",
      ),
    ).toBe(corpus.source);
    expect(
      JSON.parse(
        readFileSync(
          new URL(
            "../../scripts/real-tools/corpus/explained-reference-examples.json",
            import.meta.url,
          ),
          "utf8",
        ),
      ),
    ).toEqual(corpus.spec);
    expect(
      readFileSync(
        new URL("../../scripts/real-tools/lines/explained-reference-mistakes.s", import.meta.url),
        "utf8",
      ),
    ).toBe(corpus.mistakesSource);
    expect(corpus.spec.calls.length).toBe(
      forms.reduce((count, { form }) => count + form.examples.length, 0),
    );
  });
  for (const { mnemonic, form } of forms) {
    it(`${mnemonic}/${form.id}: has a computed independent example for its declared form`, () => {
      expect(form.title).not.toBe("");
      expect(form.rules.length).toBeGreaterThan(0);
      expect(form.syntax.length).toBeGreaterThan(0);
      expect(form.examples.length).toBeGreaterThan(0);
      for (const example of form.examples) {
        const computed = computeReferenceExample(example);
        expect(computed.instruction).toBe(example.instruction);
        expect(computed.rows.length, example.id).toBeGreaterThan(0);
        expect(example.explanation, example.id).not.toBe("");
      }
      for (const mistake of form.mistakes ?? []) {
        const errors = assemble(mistake.source).errors;
        expect(
          errors.map((error) => error.key),
          mistake.source,
        ).toContain(mistake.errorKey);
        expect(mistake.explanation).not.toBe("");
      }
    });
  }
});
