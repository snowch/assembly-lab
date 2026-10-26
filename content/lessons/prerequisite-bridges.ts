// Copyright © 2026 Christopher Snow

// Course-written examples; GNU/QEMU corpus: prerequisite-bridges.{s,json}.
export const REGISTER_OR = {
  c: "",
  listing: "join_warnings:\n  orr w0, w0, w1\n  ret",
} as const;

// Return the helper's result unchanged, without yet keeping another input across the call.
// This is not claimed compiler output: a compiler may choose a tail call for equivalent C.
export const SMALL_CALL = {
  c: "",
  listing:
    "relay_distance:\n  stp x29, x30, [sp, #-16]!\n  mov x29, sp\n  bl half_distance\n  ldp x29, x30, [sp], #16\n  ret\nhalf_distance:\n  lsr w0, w0, #1\n  ret",
} as const;
