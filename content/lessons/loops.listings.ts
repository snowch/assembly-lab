// Copyright © 2026 Christopher Snow

// GCC 16.1.0 -O1 listings recorded with raw responses and source maps in
// docs/notes/module-5/compiler/. C tags are relative to the displayed function:
// the submitted copyright comment is omitted, so each raw source line is reduced by one.

export const DIM_UP = {
  c: "unsigned dim_up(\n    unsigned brightness, unsigned start,\n    unsigned end)\n{\n    for (unsigned tick = start;\n         tick < end;\n         tick++)\n        brightness >>= 1;\n    return brightness;\n}",
  listing:
    "dim_up:\n  cmp w1, w2 C6\n  bcs .L2 C6\n.L3:\n  lsr w0, w0, 1 C8\n  add w1, w1, 1 C7\n  cmp w2, w1 C6\n  bne .L3 C6\n.L2:\n  ret C10",
} as const;

export const DIM_DOWN = {
  c: "unsigned dim_down(\n    unsigned brightness, unsigned ticks)\n{\n    while (ticks != 0) {\n        brightness >>= 1;\n        ticks--;\n    }\n    return brightness;\n}",
  listing:
    "dim_down:\n  cbz w1, .L2 C4\n.L3:\n  lsr w0, w0, 1 C5\n  subs w1, w1, #1 C4\n  bne .L3 C4\n.L2:\n  ret C9",
} as const;

export const DIM_DO = {
  c: "unsigned dim_do(\n    unsigned brightness, unsigned ticks)\n{\n    do {\n        brightness >>= 1;\n        ticks--;\n    } while (ticks != 0);\n    return brightness;\n}",
  listing: "dim_do:\n.L2:\n  lsr w0, w0, 1 C5\n  subs w1, w1, #1 C7\n  bne .L2 C7\n  ret C9",
} as const;

export const DIM_WRONG_GCC = {
  c: "unsigned dim_wrong(\n    unsigned brightness, unsigned ticks)\n{\n    while (ticks >= 0) {\n        brightness >>= 1;\n        ticks--;\n    }\n    return brightness;\n}",
  listing: "dim_wrong:\n.L2:\n  b .L2 C4",
} as const;

// The following programs are course-authored assembly, not compiler output.
// In the broken loop, cmp replaces the flags from subs; every unsigned value is >= 0.
export const DIM_DOWN_WRONG = {
  c: "",
  listing: [
    "dim_down_wrong:",
    ".Lloop:",
    "  lsr w0, w0, 1",
    "  subs w1, w1, #1",
    "  cmp w1, #0",
    "  bcs .Lloop",
    "  ret",
  ].join("\n"),
} as const;

export const DIM_UP_STARTING_TEXT = "ret";
export const DIM_UP_TEXT = [
  "cmp w1, w2",
  "b.cs done",
  "again:",
  "lsr w0, w0, #1",
  "add w1, w1, #1",
  "cmp w1, w2",
  "b.cc again",
  "done:",
  "ret",
].join("\n");

export const DIM_DOWN_STARTING_TEXT = "ret";
export const DIM_DOWN_TEXT = [
  "cbz w1, done",
  "again:",
  "lsr w0, w0, #1",
  "subs w1, w1, #1",
  "b.ne again",
  "done:",
  "ret",
].join("\n");

export const DIM_UNTIL_DARK_STARTING_TEXT = "ret";
// Return the brightness after at most ticks shifts. Once it is zero, later shifts cannot
// change the result, so stop early. This bounds even ticks == UINT_MAX to 32 body visits.
export const DIM_UNTIL_DARK_TEXT = [
  "cbz w1, done",
  "again:",
  "cbz w0, done",
  "lsr w0, w0, #1",
  "subs w1, w1, #1",
  "b.ne again",
  "done:",
  "ret",
].join("\n");

// A course-authored change to DIM_UP: the backward equality condition is reversed.
export const DIM_UP_BEQ = {
  c: DIM_UP.c,
  listing: DIM_UP.listing.replace("bne .L3", "beq .L3"),
} as const;
