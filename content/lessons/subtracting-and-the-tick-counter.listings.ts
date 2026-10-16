// Copyright © 2026 Christopher Snow

// The programs lesson 2 of Module 2 shows or describes. `elapsed`, `sub_overflows` and `negate` are
// compiler listings, copied from docs/notes/module-2/listings.md (ARM64 GCC 16.1.0, -O1, fetched from
// Compiler Explorer on 16 October 2026); subtracting-and-the-tick-counter.facts.test.ts holds each
// copy to that file. The others are assembly the lesson wrote itself, which has no C beside it; the
// same test holds each to the differential test's corpus, which runs it under QEMU.
//
// The recorded file puts every function on a line of its own, after a copyright line and an
// `#include`. The lesson shows a function's own line as the C, so the line GCC records for each of
// its instructions is line 1.

/** `elapsed`: one subtraction, right across the wrap. */
export const ELAPSED = {
  c: "unsigned elapsed(unsigned now, unsigned then) { return now - then; }",
  listing: ["elapsed:", "  sub w0, w0, w1 C1", "  ret C1"].join("\n"),
} as const;

/** `sub_overflows`: GCC's `__builtin_sub_overflow` on two `int`s. The lesson describes it in words. */
export const SUB_OVERFLOWS = {
  c: "bool sub_overflows(int a, int b) { int r; return __builtin_sub_overflow(a, b, &r); }",
  listing: ["sub_overflows:", "  subs w0, w0, w1 C1", "  cset w0, vs C1", "  ret C1"].join("\n"),
} as const;

/** `negate`: `neg`, the instruction the failure experiment sets the flags with. */
export const NEGATE = {
  c: "int negate(int x) { return -x; }",
  listing: ["negate:", "  neg w0, w0 C1", "  ret C1"].join("\n"),
} as const;

/** The same two readings through `subs`, which sets the flags: the ring's borrow and the last challenge. */
export const ELAPSED_SUBS = {
  c: "",
  listing: ["elapsed_subs:", "  subs w0, w0, w1", "  ret"].join("\n"),
} as const;

/** The failure experiment: `negs` on `0x80000000`. */
export const NEGATE_FLAGS = {
  c: "",
  listing: ["negate_flags:", "  negs w0, w0", "  ret"].join("\n"),
} as const;

/** The construction challenge starts from a function that returns `now` unchanged. */
export const ELAPSED_STARTING_TEXT = "ret";

/** The construction challenge's reference: the recorded `elapsed`. */
export const ELAPSED_FIXED_TEXT = ["sub w0, w0, w1", "ret"].join("\n");
