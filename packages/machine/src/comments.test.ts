// Copyright © 2026 Christopher Snow

// What the assembler says to a learner who writes a label without its colon, or a comment in
// another assembler's style. GNU as rejects the same lines (scripts/real-tools/lines/comments.txt
// holds them for the differential test); the course's messages say why, and what to write.

import { describe, expect, it } from "vitest";

import { assemble } from "./assemble.ts";
import { message } from "./strings.ts";

const errorsOf = (source: string) =>
  assemble(source).errors.map((e) => ({
    line: e.line,
    column: e.column,
    key: e.key,
    text: message(e.key, e.params),
  }));

describe("a line that is one word the machine does not know", () => {
  it("says to end it with a colon if it is a label", () => {
    expect(errorsOf("f:\n  cmp w0, w1\n  low\n  ret")).toEqual([
      {
        line: 3,
        column: 3,
        key: "notInMachineWord",
        text: "The course's simulator does not have `low`. If it is a label, end it with a colon.",
      },
    ]);
  });

  it("keeps the plain sentence for a word with operands, and for a label with its colon", () => {
    expect(errorsOf("f:\n  fadd d0, d1, d2\n  ret")[0]?.key).toBe("notInMachine");
    expect(errorsOf("f:\n  low:\n  ret")).toEqual([]);
  });

  it("names only the instruction it does not have, not the operands after it", () => {
    expect(errorsOf("f:\n  subtract w0, w0, w1\n  ret")[0]?.text).toBe(
      "The course's simulator does not have `subtract`.",
    );
  });
});

describe("a comment written with # or ;", () => {
  const says = "looks like a comment. A comment starts with `//`.";

  it("is told a comment starts with //, after an instruction with operands or without", () => {
    for (const [source, tail] of [
      ["f:\n  cmp w0, w1 # compare\n  ret", "# compare"],
      ["f:\n  cmp w0, w1 #compare\n  ret", "#compare"],
      ["f:\n  cmp w0, w1 #\n  ret", "#"],
      ["f:\n  ret # done", "# done"],
      ["f:\n  add w0, w0, #1 # one\n  ret", "# one"],
      ["f:\n  cmp w0, w1 ; compare\n  ret", "; compare"],
      ["f:\n  ret ; done", "; done"],
    ] as const) {
      const errors = errorsOf(source);
      expect(errors, source).toHaveLength(1);
      expect(errors[0]?.key, source).toBe("syntax.commentTail");
      expect(errors[0]?.text, source).toBe(`\`${tail}\` ${says}`);
    }
  });

  it("points at the # or the ; itself", () => {
    expect(errorsOf("f:\n  cmp w0, w1 # compare\n  ret")[0]).toMatchObject({ line: 2, column: 14 });
    expect(errorsOf("f:\n  cmp w0, w1 ; compare\n  ret")[0]).toMatchObject({ line: 2, column: 14 });
  });

  it("leaves what is not a comment alone: a number, a comment from the start of a line, //, and a second instruction", () => {
    expect(errorsOf("f:\n  add w0, w0, #1\n  ret")).toEqual([]);
    expect(errorsOf("f:\n  add w0, w0, # 1\n  ret")).toEqual([]);
    expect(errorsOf("f:\n  add w0, w0, w1, lsl #2\n  ret")).toEqual([]);
    // Straight after a mnemonic, `#name` is the first operand: GNU as takes `b #f` as a branch to f.
    expect(errorsOf("f:\n  b #f\n  ret")).toEqual([]);
    expect(errorsOf("f:\n  # a comment\n  ret")).toEqual([]);
    expect(errorsOf("f:\n  cmp w0, w1 // compare\n  ret")).toEqual([]);
    expect(errorsOf("f:\n  mov w0, 1 ; ret")).toEqual([]);
    expect(errorsOf("f:\n  ret;")).toEqual([]);
  });

  it("keeps the missing comma for a number with no comma before it", () => {
    expect(errorsOf("f:\n  add w0, w0 #5\n  ret")[0]?.key).toBe("syntax.missingComma");
  });
});
