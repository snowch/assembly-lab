// Copyright © 2026 Christopher Snow

// Course-written arithmetic snippets. The figure exposes only the arithmetic prefix; ret is
// the execution wrapper, not an operation the learner needs for this first activity.
export const PRIMITIVE_PROGRAMS = [
  {
    entry: "primitive_add",
    instructions: ["add w2, w0, w1"],
    args: [12, 7, 0],
    registers: [0, 1, 2],
  },
  {
    entry: "primitive_transfer",
    instructions: ["add w1, w0, w2"],
    args: [14, 0, 5],
    registers: [0, 1, 2],
  },
  { entry: "primitive_reuse", instructions: ["add w0, w0, w1"], args: [9, 4], registers: [0, 1] },
  { entry: "primitive_sub", instructions: ["sub w1, w0, w1"], args: [20, 6], registers: [0, 1] },
  {
    entry: "primitive_sequence",
    instructions: ["add w2, w0, w1", "sub w2, w2, w1"],
    args: [8, 3, 0],
    registers: [0, 1, 2],
  },
] as const;

export function primitiveProgram(item: (typeof PRIMITIVE_PROGRAMS)[number]) {
  return { c: "", listing: [item.entry + ":", ...item.instructions, "ret"].join("\n") };
}
