// Copyright © 2026 Christopher Snow

// Separate draft: docs/notes/subtraction-boundary/copy.md.
export const SUBTRACTION_BOUNDARY_STRINGS = {
  title: "When does carry out become 1?",
  setup:
    "Only `a` changes in these independent four-bit views. Each uses `b = {b}`, inverted `b = {inverted}` and carry in `{carryIn}`. All readings are unsigned.",
  calculation: "Subtract",
  fullSum: "Full sum",
  carryOut: "Carry out",
  keptBits: "Four bits kept",
  unsigned: "Unsigned",
  less: "Below b",
  equal: "Equal to b",
  greater: "Above b",
  takeaway:
    "Equality reaches the extra place, worth {range}: carry out is 1 even though the kept result is zero. The real 32-bit `subs` uses the same no-borrow boundary for C.",
} as const;
