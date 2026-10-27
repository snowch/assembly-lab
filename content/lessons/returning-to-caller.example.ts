// Copyright © 2026 Christopher Snow

// Course-written caller around the existing recorded increment_int instructions.
// The activity shows only the three instructions after the call has entered increment_int.
// Setup and cleanup still run in the same model trace and in the GNU/QEMU comparison.
export const RETURNING_PROGRAM = {
  c: "",
  listing: [
    "caller:",
    "  stp x29, x30, [sp, #-16]!",
    "  bl increment_int",
    "caller_continues:",
    "  add w1, w0, w0",
    "  ldp x29, x30, [sp], #16",
    "  ret",
    "increment_int:",
    "  add w0, w0, 1",
    "  ret",
  ].join("\n"),
} as const;

export const RETURNING_CALL = { entry: "caller", args: [7, 0] } as const;
export const RETURNING_START_STEP = 2;
export const RETURNING_END_STEP = 5;
export const RETURNING_CALLER_LABEL = "caller_continues";
