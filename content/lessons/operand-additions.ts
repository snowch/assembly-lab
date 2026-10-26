// Copyright © 2026 Christopher Snow

// Course-written single-operation examples, checked against GNU as and QEMU in
// scripts/real-tools/corpus/operand-additions.{s,json}. The figure stops before the wrapper ret.
export const SHIFTED_REGISTER_ADD = {
  c: "",
  listing: "add_scaled_register:\n  add w2, w0, w1, lsl #1\n  ret",
} as const;

export const SHIFTED_IMMEDIATE_ADD = {
  c: "",
  listing: "add_scaled_constant:\n  add w2, w0, #1, lsl #12\n  ret",
} as const;
