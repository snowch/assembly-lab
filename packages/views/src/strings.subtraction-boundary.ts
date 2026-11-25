// Copyright © 2026 Christopher Snow

// Separate draft: docs/notes/subtraction-boundary/copy.md.
export const SUBTRACTION_BOUNDARY_STRINGS = {
  title: "When does carry out become 1?",
  setup:
    "Only `a` changes in these independent four-bit views. With `b = {b}`, inverted `b` is `{inverted}` and carry in is `{carryIn}`. The adder calculates `a + {inverted} + {carryIn}`. All readings are unsigned.",
  calculation: "Subtract",
  fullSum: "Adder sum",
  carryOut: "Carry out",
  carryPlace: "{range}’s place",
  keptBits: "Four bits kept",
  unsigned: "Unsigned",
  less: "Below b",
  equal: "Equal to b",
  greater: "Above b",
  takeaway:
    "Equality already needs that extra place, even though the kept result is zero. The real 32-bit `subs` uses the same no-borrow boundary for C.",
  increase: "+{increase} in adder sum",
  placeValues: "Place values",
  visualCaption:
    "At {maximum}, all four kept digits are 1: no higher sum fits there. The next sum needs the outside place, worth {range}, giving carry out 1 and four kept zeros.",
} as const;
