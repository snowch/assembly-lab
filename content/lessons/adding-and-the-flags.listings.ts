// Copyright © 2026 Christopher Snow

// The programs lesson 1 of Module 2 shows. One is a compiler's listing, copied from
// docs/notes/module-2/listings.md (ARM64 GCC 16.1.0, -O1, fetched from Compiler Explorer on 16
// October 2026); adding-and-the-flags.facts.test.ts holds the copy to that file. The others are
// assembly the lesson wrote itself, which has no C beside it; the same test holds each to the
// differential test's corpus, which runs it under QEMU.
//
// The recorded file puts every function on a line of its own, after a copyright line and an
// `#include`. The lesson shows a function's own line as the C, so the line GCC records for each of
// its instructions is line 1.

/** `add_overflows`: GCC's `__builtin_add_overflow` on two `int`s reads V. Shown in a closed note. */
export const ADD_OVERFLOWS = {
  c: "bool add_overflows(int a, int b) { int r; return __builtin_add_overflow(a, b, &r); }",
  listing: ["add_overflows:", "  cmn w0, w1 C1", "  cset w0, vs C1", "  ret C1"].join("\n"),
} as const;

/** One `adds` and a return: the addition the figures draw and the challenges ask about. */
export const PLUS = {
  c: "",
  listing: ["plus:", "  adds w0, w0, w1", "  ret"].join("\n"),
} as const;

/**
 * The failure experiment: an `adds` that leaves all four flags at 0, then `add` where `adds` would
 * have set them, on `0x7fffffff` plus 1.
 */
export const SUM_FLAGS = {
  c: "",
  listing: ["sum_flags:", "  adds w2, w1, w1", "  add w0, w0, w1", "  ret"].join("\n"),
} as const;
