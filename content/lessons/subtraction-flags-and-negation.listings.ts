// Copyright © 2026 Christopher Snow

/** Authored assembly for the carry/no-borrow demonstration; not compiler output. */
export const SUBTRACT_FLAGS = {
  c: "",
  listing: ["subtract_flags:", "  subs w0, w0, w1", "  ret"].join("\n"),
} as const;

/** Checked setup for the reflection's prior flags; this helper is not learner-authored code. */
export const PRESERVED_NEGATION = {
  c: "",
  listing: ["negate_preserved_flags:", "  negs w1, w1", "  neg w0, w0", "  ret"].join("\n"),
} as const;

export const NEGATION_INPUTS = [0, 0x80000001] as const;
