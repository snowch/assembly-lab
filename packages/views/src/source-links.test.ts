// Copyright © 2026 Christopher Snow

import { describe, expect, it } from "vitest";
import { deleteLine, programLines } from "./listing";
import { traceOf } from "./trace";
import { compileC } from "@al/compiler";
import { recordedC } from "./compilerRun";

const program = {
  c: "unsigned total(unsigned a, unsigned b) {\n  a += b;\n  return a;\n}",
  listing: "total:\nadd w0, w0, w1 C2\nadd w0, w0, #12 C4\nret C4",
  sourceLines: [[2], [], [3]],
};

describe("source associations follow instruction identity", () => {
  it("keeps semantic and compiler references distinct after deleting an instruction", () => {
    const edited = deleteLine(programLines(program), { label: "total", text: "add w0, w0, #12" });
    expect(edited.at(-1)).toMatchObject({ text: "ret", cLine: 4, sourceLines: [3] });
    const trace = traceOf(
      program,
      { entry: "total", args: [2, 3] },
      { label: "total", text: "add w0, w0, #12" },
    );
    expect(trace.lines).toEqual(edited);
    expect(trace.result.final.x[0]).toBe(5n);
  });
  it("rejects positional maps that would silently shift an association", () => {
    expect(() => programLines({ ...program, sourceLines: [[2], [3]] })).toThrow(
      /every instruction/,
    );
  });
  it("uses the local compiler's emitted map after editing the C", () => {
    const source =
      "unsigned sum(unsigned a, unsigned b) {\n unsigned x = a + b;\n return x + 7;\n}";
    const compiled = compileC(source);
    expect(compiled.ok).toBe(true);
    if (!compiled.ok) return;
    const recorded = recordedC(source, compiled);
    const lines = programLines(recorded);
    let instruction = 0;
    compiled.listing.split("\n").forEach((text, index) => {
      if (!text.trim() || text.trim().endsWith(":")) return;
      const emitted = compiled.lineMap.find((entry) => entry.assemblyLine === index + 1);
      const actual = lines.filter((line) => line.kind === "instruction")[instruction++];
      expect(actual?.sourceLines).toEqual(emitted ? [emitted.cLine] : []);
    });
  });
});
