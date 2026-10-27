// Copyright © 2026 Christopher Snow

// Course-written arithmetic snippets. The figure exposes only the arithmetic prefix; ret is
// the execution wrapper, not an operation the learner needs for this first activity.
import { INCREMENT_INT } from "./meet-the-machine.listings";
import { ADD_INTS } from "./two-argument-function.listings";

export const PRIMITIVE_PROGRAMS = [
  {
    kind: "operation",
    entry: "primitive_add",
    instructions: ["add w2, w0, w1"],
    args: [12, 7, 0],
    registers: [0, 1, 2],
  },
  {
    kind: "function",
    entry: "increment_int",
    instructions: ["add w0, w0, 1", "ret"],
    args: [7],
    registers: [0],
  },
  {
    kind: "operation",
    entry: "primitive_transfer",
    instructions: ["add w1, w0, w2"],
    args: [14, 0, 5],
    registers: [0, 1, 2],
  },
  {
    kind: "operation",
    entry: "primitive_reuse",
    instructions: ["add w0, w0, w1"],
    args: [9, 4],
    registers: [0, 1],
  },
  {
    kind: "operation",
    entry: "primitive_sub",
    instructions: ["sub w1, w0, w1"],
    args: [20, 6],
    registers: [0, 1],
  },
  {
    kind: "operation",
    entry: "primitive_sequence",
    instructions: ["add w2, w0, w1", "sub w2, w2, w1"],
    args: [8, 3, 0],
    registers: [0, 1, 2],
  },
  {
    kind: "operation",
    entry: "primitive_constant",
    instructions: ["add w2, w0, 1"],
    args: [7, 0, 0],
    registers: [0, 2],
  },
  {
    kind: "operation",
    entry: "primitive_constant_reuse",
    instructions: ["add w0, w0, 1"],
    args: [7],
    registers: [0],
  },
  {
    kind: "operation",
    entry: "primitive_constant_practice",
    instructions: ["add w1, w0, 3"],
    args: [10, 0],
    registers: [0, 1],
  },
  {
    kind: "function",
    entry: "add_ints",
    instructions: ["add w0, w0, w1", "ret"],
    args: [7, 5],
    registers: [0, 1],
  },
] as const;

export function primitiveProgram(item: (typeof PRIMITIVE_PROGRAMS)[number]) {
  if (item.kind === "function") return item.entry === "add_ints" ? ADD_INTS : INCREMENT_INT;
  return { c: "", listing: [item.entry + ":", ...item.instructions, "ret"].join("\n") };
}
