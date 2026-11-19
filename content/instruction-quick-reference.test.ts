// Copyright © 2026 Christopher Snow

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { assemble, subsetMnemonics } from "@al/machine";
import {
  INSTRUCTION_QUICK_REFERENCE as entries,
  QUICK_REFERENCE_NOTATION,
} from "./instruction-quick-reference";

describe("browser instruction quick reference", () => {
  it("keeps every displayed snippet in the GNU/QEMU execution corpus", () => {
    const corpus = readFileSync(
      new URL("../scripts/real-tools/corpus/quick-reference-examples.s", import.meta.url),
      "utf8",
    );
    const cases = readFileSync(
      new URL("../scripts/real-tools/corpus/quick-reference-examples.json", import.meta.url),
      "utf8",
    );
    const snippets = [
      ...corpus.matchAll(/\/\/ Displayed snippet\n([\s\S]*?)\n\/\/ End displayed snippet/g),
    ].map((match) => match[1]!.replace(/\.Lqr_\d+_(near|next)/g, ".L$1"));
    expect(snippets).toEqual(entries.flatMap((entry) => entry.examples));
    expect(JSON.parse(cases).calls).toHaveLength(snippets.length);
  });
  it("covers the actual browser subset once without relying on lesson answers", () => {
    expect(entries.map((entry) => entry.mnemonic).sort()).toEqual(subsetMnemonics().sort());
    expect(new Set(entries.map((entry) => entry.mnemonic)).size).toBe(entries.length);
    expect(QUICK_REFERENCE_NOTATION.join(" ")).toContain("x31 and w31 are not register names");
    for (const entry of entries) {
      expect(entry.summary, entry.mnemonic).not.toBe("");
      expect(entry.forms.length, entry.mnemonic).toBeGreaterThan(0);
      expect(entry.rules.length, entry.mnemonic).toBeGreaterThan(0);
      expect(entry.flags, entry.mnemonic).not.toBe("");
      expect(entry.examples.length, entry.mnemonic).toBeGreaterThan(0);
      for (const reference of entry.references)
        expect(new URL(reference.url).protocol).toBe("https:");
    }
  });
  for (const entry of entries) {
    it(`${entry.mnemonic}: every displayed example assembles`, () => {
      for (const source of entry.examples) expect(assemble(source).errors, source).toEqual([]);
    });
  }
  it("checks the useful add/sub immediate boundaries and the reported invalid immediate", () => {
    for (const mnemonic of ["add", "adds", "sub", "subs"]) {
      for (const immediate of ["0", "4095", "4096", "16773120", "-4095", "-16773120"]) {
        expect(assemble(`${mnemonic} w8, w9, #${immediate}`).errors).toEqual([]);
      }
      for (const immediate of ["4097", "16777216", "4294966296"]) {
        expect(assemble(`${mnemonic} w8, w9, #${immediate}`).errors[0]?.key).toBe(
          "immediate.addsub",
        );
      }
      expect(assemble(`${mnemonic} x8, x9, #4095, lsl #12`).errors).toEqual([]);
      expect(assemble(`${mnemonic} x8, x9, #4096, lsl #12`).errors[0]?.key).toBe(
        "immediate.addsub",
      );
    }
  });
  it("checks width, zero-register and stack-pointer distinctions", () => {
    for (const source of [
      "add x8, x9, w10, sxtw #4",
      "add sp, sp, #16",
      "adds xzr, sp, #16",
      "and sp, x9, #0xff",
      "sxtw x8, w9",
      "ldrb w8, [sp]",
    ]) {
      expect(assemble(source).errors, source).toEqual([]);
    }
    for (const source of [
      "add w8, x9, w10",
      "add xzr, x9, #16",
      "adds sp, x9, #16",
      "and x8, sp, #0xff",
      "sxtw w8, w9",
      "ldrb x8, [sp]",
    ]) {
      expect(assemble(source).errors.length, source).toBeGreaterThan(0);
    }
  });
  it("checks shift, field, memory and branch limits stated in entries", () => {
    for (const source of [
      "lsl w8, w9, #31",
      "ubfx x8, x9, #63, #1",
      "ldr x8, [x9, #32760]",
      "ldur x8, [x9, #-256]",
      "ldp x8, x10, [x9, #504]",
      "tbz x8, #63, 4",
    ]) {
      expect(assemble(source).errors, source).toEqual([]);
    }
    for (const source of [
      "lsl w8, w9, #32",
      "ubfx x8, x9, #63, #2",
      "ldr x8, [x9, #32768]",
      "ldur x8, [x9, #-257]",
      "ldp x8, x10, [x9, #512]",
      "tbz w8, #32, 4",
    ]) {
      expect(assemble(source).errors.length, source).toBeGreaterThan(0);
    }
  });
});
