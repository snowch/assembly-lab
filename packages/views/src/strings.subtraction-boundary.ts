// Copyright © 2026 Christopher Snow

// Separate draft: docs/notes/subtraction-boundary/copy.md.
export const SUBTRACTION_BOUNDARY_STRINGS = {
  title: "Each subtraction, worked in binary",
  setup:
    "Only `a` changes in these independent {width}-bit teaching views. With fixed `b = {b}`, inverted `b` is `{inverted}`. Each stack adds `a`, inverted `b` and `{carryIn}` for one subtraction. All readings are unsigned.",
  inputA: "a",
  invertedB: "Inverted b",
  addOne: "Add {carryIn}",
  carryOut: "Carry out",
  keptBits: "Kept bits",
  unsigned: "Unsigned",
  reasonTitle: "Why carry out changes",
  topColumn:
    "Look at the highest kept column, worth {topPlace}. Add its input bits and the carry arriving from the columns on its right. The add-one row supplies the initial carry at the lowest column.",
  belowColumn:
    "For `{belowA} − {b}`, `{belowTopA} + {belowTopB} + {belowTopCarryIn} = {belowTopBinary}`. The total fits in the highest kept column, so carry out is `{belowTopCarryOut}`.",
  equalColumn:
    "For `{equalA} − {b}`, `{equalTopA} + {equalTopB} + {equalTopCarryIn} = {equalTopBinary}` in binary. Keep the right digit, `{equalTopKept}`; the left digit, `{equalTopCarryOut}`, is carry out.",
  takeaway:
    "At equality and above, no unsigned borrow is needed. The real {realWidth}-bit `subs` takes C from its own carry out. Plain `sub` preserves C.",
} as const;
