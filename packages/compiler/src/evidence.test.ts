// Copyright © 2026 Christopher Snow

import { readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { assemble, run } from "@al/machine";
import { compileC, interpretC } from "./index.ts";

const records = new URL("../../../docs/notes/module-10/compiler/", import.meta.url);
const corpus = new URL("../../../scripts/real-tools/corpus/", import.meta.url);
const load = (name: string) => readFileSync(new URL(name, records), "utf8");
const normal = (text: string) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("//"))
    .join("\n");

describe("recorded GCC and course compiler agree on defined C executions", () => {
  it.each(readdirSync(records).filter((file) => file.endsWith(".c")))(
    "%s preserves sources, generated code and tested return values",
    (file) => {
      const name = file.slice(0, -2),
        source = load(file),
        c = compileC(source);
      expect(c.ok).toBe(true);
      if (!c.ok) return;
      const request = JSON.parse(load(`${name}.request.json`));
      const response = JSON.parse(load(`${name}.response.json`)) as {
        code: number;
        asm: { text: string }[];
      };
      const recorded = JSON.parse(load(`${name}.course.json`)) as {
        compiler: string;
        source: string;
        listing: string;
        lineMap: typeof c.lineMap;
        calls: { args: number[]; value: number }[];
      };
      expect(request.source).toBe(source);
      expect(request.options.userArguments).toBe("-O1");
      expect(response.code).toBe(0);
      expect(recorded.source).toBe(source);
      expect(recorded.listing).toBe(c.listing);
      // Recorded source associations stay exact; optional phase labels are AST-derived UI data.
      expect(recorded.lineMap).toEqual(
        c.lineMap.map(({ assemblyLine, cLine }) => ({ assemblyLine, cLine })),
      );
      const gcc = response.asm
        .map((row) => row.text.trim())
        .filter(Boolean)
        .join("\n");
      for (const [kind, listing] of [
        ["course", c.listing],
        ["gcc", gcc],
      ] as const) {
        const basename = `module10-${name.replaceAll("_", "-")}-${kind}`;
        expect(normal(readFileSync(new URL(`${basename}.s`, corpus), "utf8"))).toBe(
          normal(listing),
        );
        const cases = JSON.parse(readFileSync(new URL(`${basename}.json`, corpus), "utf8"));
        expect(cases.entry).toBe(c.name);
        expect(cases.calls).toEqual(
          recorded.calls.map((call) => ({ args: call.args.map((value) => [String(value), 32]) })),
        );
        const assembly = assemble(listing);
        expect(assembly.errors).toEqual([]);
        if (!assembly.program) throw new Error(listing);
        for (const call of recorded.calls) {
          const interpreted = interpretC(c, call.args);
          expect(interpreted.ok).toBe(true);
          if (interpreted.ok) expect(interpreted.value).toBe(call.value);
          const execution = run(assembly.program, {
            entry: 0x400000,
            args: call.args.map((value) => ({ value: BigInt(value), width: 32 })),
            maxSteps: 10000,
          });
          expect(execution.stop.kind).toBe("returned");
          expect(Number(execution.final.x[0])).toBe(call.value);
        }
      }
    },
  );
});
