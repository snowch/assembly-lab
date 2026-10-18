// Copyright © 2026 Christopher Snow

// The programs lesson 1 of Module 4 shows or runs. `steeper_s` and `steeper_u` are compiler
// listings, copied from docs/notes/module-4/listings.md (ARM64 GCC 16.1.0, -O1, fetched from
// Compiler Explorer on 16 October 2026); compare-and-choose.facts.test.ts holds each copy to that
// file. The others are assembly the lesson wrote itself, which has no C beside it: the failure
// experiment's `steeper_u` with another condition, the instruction the last challenge asks about,
// and the challenges' starting points and references. The same test holds each to the differential
// test's corpus, which runs it under QEMU.
//
// The recorded file puts every function on a line of its own, after a copyright line and an
// `#include`. The lesson shows a function's own line as the C, so the line GCC records for each of
// its instructions is line 1.

/** `steeper_s`: the larger of two `int`s. */
export const STEEPER_S = {
  c: "int steeper_s(int a, int b) { return a > b ? a : b; }",
  listing: ["steeper_s:", "  cmp w1, w0 C1", "  csel w0, w1, w0, ge C1", "  ret C1"].join("\n"),
  sourceLines: [[1], [1], [1]],
} as const;

/** `steeper_u`: the same C with `unsigned`. */
export const STEEPER_U = {
  c: "unsigned steeper_u(unsigned a, unsigned b) { return a > b ? a : b; }",
  listing: ["steeper_u:", "  cmp w1, w0 C1", "  csel w0, w1, w0, cs C1", "  ret C1"].join("\n"),
  sourceLines: [[1], [1], [1]],
} as const;

/** The C of both functions beside the instructions of the first, as the first figure draws them. */
export const STEEPER_BOTH = {
  c: [STEEPER_S.c, STEEPER_U.c].join("\n"),
  listing: STEEPER_S.listing,
  sourceLines: STEEPER_S.sourceLines,
} as const;

/**
 * `steeper_u` with its last item changed from `cs` to `ge`: the failure experiment. No compiler made
 * it, but the lesson shows it under the name of the function it was changed from, beside that
 * function's C, as the changed function.
 */
export const STEEPER_U_GE = {
  c: STEEPER_U.c,
  listing: ["steeper_u:", "  cmp w1, w0 C1", "  csel w0, w1, w0, ge C1", "  ret C1"].join("\n"),
  sourceLines: STEEPER_U.sourceLines,
} as const;

/** The two patterns every figure of the first part runs: `0xffffffff` and 1. */
export const ARGS = [0xffffffff, 1] as const;

/** The failure experiment's patterns: `0x80000000` and 1. */
export const SMALLEST_AND_ONE = [0x80000000, 1] as const;

/** The compare the last challenge is about, drawn above the fields. */
export const HOLDS_PROGRAM = {
  c: "",
  listing: "cmp w0, w1",
} as const;

/** The construction challenge starts from a function that returns `a` unchanged. */
export const LESS_FUEL_STARTING_TEXT = "ret";

/** The construction challenge's reference: the smaller of two `unsigned` values. */
export const LESS_FUEL_TEXT = ["cmp w0, w1", "csel w0, w0, w1, cc", "ret"].join("\n");

/** The same function with the signed condition: it passes three of five tests. */
export const LESS_FUEL_SIGNED_TEXT = ["cmp w0, w1", "csel w0, w0, w1, lt", "ret"].join("\n");
