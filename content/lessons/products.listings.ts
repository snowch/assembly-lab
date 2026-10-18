// Copyright © 2026 Christopher Snow

// Compiler records: docs/notes/module-8/compiler, GCC 16.1.0 -O1.
// C line tags omit the submitted copyright line. Empty C marks course-authored assembly.

export const SCALE_PULSES = {
  sourceLines: [[3], [3]],
  c: "unsigned scale_pulses(unsigned pulses, unsigned scale)\n{\n    return pulses * scale;\n}",
  listing: "scale_pulses:\n  mul w0, w0, w1 C4\n  ret C4",
} as const;

export const QUOTIENT_UNSIGNED = {
  sourceLines: [[3], [3]],
  c: "unsigned quotient_unsigned(unsigned total, unsigned count)\n{\n    return total / count;\n}",
  listing: "quotient_unsigned:\n  udiv w0, w0, w1 C4\n  ret C4",
} as const;

export const QUOTIENT_SIGNED = {
  sourceLines: [[3], [3]],
  c: "int quotient_signed(int total, int count)\n{\n    return total / count;\n}",
  listing: "quotient_signed:\n  sdiv w0, w0, w1 C4\n  ret C4",
} as const;

export const SCALED_TOTAL = {
  sourceLines: [[3], [3]],
  c: "unsigned scaled_total(unsigned pulses, unsigned scale, unsigned total)\n{\n    return total + pulses * scale;\n}",
  listing: "scaled_total:\n  madd w0, w0, w1, w2 C4\n  ret C4",
} as const;

export const REMAINDER_SIGNED = {
  sourceLines: [[3], [3], [3]],
  c: "int remainder_signed(int total, int count)\n{\n    return total % count;\n}",
  listing: "remainder_signed:\n  sdiv w2, w0, w1 C3\n  msub w0, w2, w1, w0 C4\n  ret C4",
} as const;

export const WIDE_SIGNED = {
  sourceLines: [[3], [3]],
  c: "long wide_signed(int adjustment, int scale)\n{\n    return (long)adjustment * scale;\n}",
  listing: "wide_signed:\n  smull x0, w1, w0 C4\n  ret C4",
} as const;

export const WIDE_UNSIGNED = {
  sourceLines: [[3], [3]],
  c: "unsigned long wide_unsigned(unsigned pulses, unsigned scale)\n{\n    return (unsigned long)pulses * scale;\n}",
  listing: "wide_unsigned:\n  umull x0, w1, w0 C4\n  ret C4",
} as const;

export const GROUPS_OF_TEN = {
  sourceLines: [[3], [3], [3], [3], [3]],
  c: "unsigned groups_of_ten(unsigned pulses)\n{\n    return pulses / 10;\n}",
  listing:
    "groups_of_ten:\n  mov w1, 52429 C3\n  movk w1, 0xcccc, lsl 16 C3\n  umull x0, w0, w1 C3\n  lsr x0, x0, 35 C4\n  ret C4",
} as const;

export const PRODUCT_HALVES = {
  c: "",
  listing: "product_halves:\n  mul x2, x0, x1\n  umulh x3, x0, x1\n  smulh x4, x0, x1\n  ret",
} as const;

export const WIDE_TOO_LATE = {
  c: "",
  listing: "wide_too_late:\n  mul w0, w0, w1\n  ret",
} as const;

export const SUBTRACT_PRODUCT = {
  c: "",
  listing: "subtract_product:\n  msub w0, w1, w2, w0\n  ret",
} as const;

export const WRONG_REMAINDER = {
  c: "",
  listing: "wrong_remainder:\n  udiv w2, w0, w1\n  msub w0, w2, w1, w0\n  ret",
} as const;

export const DIVIDE_EDGES = {
  c: "",
  listing: "divide_edges:\n  sdiv w2, w0, w1\n  udiv w3, w0, w1\n  ret",
} as const;

export const CONSUMPTION = {
  c: "",
  listing:
    "consumption:\n  cbz w1, zero\n  mov w2, #100\n  umull x0, w0, w2\n  mov w1, w1\n  udiv x0, x0, x1\n  ret\nzero:\n  mov x0, #0\n  ret",
} as const;

export const SCALED_TOTAL_TEXT = "madd w0, w0, w1, w2\nret";
export const WIDE_PRODUCT_TEXT = "umull x0, w0, w1\nret";
export const REMAINDER_TEXT = "sdiv w2, w0, w1\nmsub w0, w2, w1, w0\nret";
export const CONSUMPTION_TEXT = CONSUMPTION.listing;
