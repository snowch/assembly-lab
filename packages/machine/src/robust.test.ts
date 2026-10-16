// Copyright © 2026 Christopher Snow

// A learner can type anything. The assembler answers with errors and never throws, and a program
// that assembles runs to a stop (returned, a fault or the step limit) and never throws.

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { assemble } from "./assemble.ts";
import { run } from "./run.ts";

const lines = readFileSync(
  new URL("../../../scripts/real-tools/lines/loadstore.txt", import.meta.url),
  "utf8",
)
  .split("\n")
  .concat(
    readFileSync(
      new URL("../../../scripts/real-tools/lines/move.txt", import.meta.url),
      "utf8",
    ).split("\n"),
    readFileSync(
      new URL("../../../scripts/real-tools/lines/addsub.txt", import.meta.url),
      "utf8",
    ).split("\n"),
    readFileSync(
      new URL("../../../scripts/real-tools/lines/directives.txt", import.meta.url),
      "utf8",
    ).split("\n"),
  )
  .filter((l) => l.trim() !== "" && !l.startsWith("//"));

/** A small deterministic generator, so a failure can be reproduced. */
function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

describe("garbage in", () => {
  it("mutated lines never make the assembler throw", () => {
    const next = rng(12345);
    const alphabet = " ,[]!#:.+-*/()xXwWsp0123456789abcdefghijklmnopqrstuvwxyz\"\\;'\t";
    let assembled = 0;
    for (let i = 0; i < 6000; i++) {
      let line = lines[Math.floor(next() * lines.length)] as string;
      const edits = 1 + Math.floor(next() * 3);
      for (let k = 0; k < edits; k++) {
        const at = Math.floor(next() * (line.length + 1));
        const kind = next();
        if (kind < 0.4) line = line.slice(0, at) + line.slice(at + 1);
        else if (kind < 0.8) {
          line =
            line.slice(0, at) + alphabet[Math.floor(next() * alphabet.length)] + line.slice(at);
        } else line = line.slice(0, at) + line.slice(Math.min(line.length, at + 3));
      }
      const result = assemble(`f:\n  ${line}\n  ret\n.data\nd: .quad 0\n`);
      if (result.program) {
        assembled++;
        const r = run(result.program, { entry: "f", maxSteps: 50 });
        expect(["returned", "fault", "limit"]).toContain(r.stop.kind);
      } else {
        expect(result.errors.length).toBeGreaterThan(0);
        for (const e of result.errors) {
          expect(e.line).toBeGreaterThanOrEqual(1);
          expect(e.column).toBeGreaterThanOrEqual(1);
        }
      }
    }
    // Some of the mutations are still programs.
    expect(assembled).toBeGreaterThan(100);
  });

  it("odd sources", () => {
    for (const src of [
      "",
      "\n\n\n",
      "\r\nf:\r\n  ret\r\n",
      "f:",
      ":",
      "f: g: h:",
      "/* never closed",
      '.ascii "never closed',
      ".byte 1,,2",
      "  \t  ",
      "f:\n  ret ; ; ;",
      "\u00e9: ret",
      "f:\n  mov x0, '",
      "f:\n  mov x0, 'ab'",
      "f:\n  ldr x0, [",
      "f:\n  ldr x0, ]",
      "f:\n  add x0, x1, (",
      "f:\n  b " + "(".repeat(500),
      "f:\n  mov x0, " + "1+".repeat(2000) + "1",
      ".zero 100000000000",
      ".section",
    ]) {
      const r = assemble(src);
      expect(r.program === null || r.errors.length === 0).toBe(true);
    }
  });

  it("running a program that assembled but does something wild", () => {
    const wild = [
      "f:\n  mov x1, -1\n  ldr x0, [x1]\n  ret",
      "f:\n  mov x30, 5\n  ret",
      "f:\n  br xzr",
      "f:\n  sub sp, sp, 1\n  mov sp, x0\n  ldr x0, [sp]\n  ret",
      "f:\n  adrp x0, f\n  str x0, [x0]\n  ret",
      "f:\n  b f",
      "f:\n  bl f",
      "f:\n  ldr x0, [sp, 4088]\n  ret",
    ];
    for (const src of wild) {
      const { program } = assemble(src);
      expect(program, src).not.toBeNull();
      if (!program) continue;
      const r = run(program, { entry: "f", maxSteps: 200 });
      expect(["returned", "fault", "limit"]).toContain(r.stop.kind);
    }
  });

  it("a call to a label that is not there says so", () => {
    const { program } = assemble("f:\n  ret");
    expect(() => run(program!, { entry: "g" })).toThrow(/no label g/);
  });
});
