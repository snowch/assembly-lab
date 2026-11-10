// Copyright © 2026 Christopher Snow

export const PROSE = {
  question:
    "Arm has a register bank for floating-point arithmetic, separate from the general registers. The 32-bit view `s0` and 64-bit view `d0` access the same entry, `v0`, in that bank. They are not views of `w0` or `x0`. The number 0 selects an entry within each bank; it does not join the banks.\n\nFor the selected AArch64 target, C `float` uses binary32 and C `double` uses binary64. C does not require those sizes on every implementation. In these simple functions, floating-point arguments arrive in `s0` and `s1`, or `d0` and `d1`; the result returns in `s0` or `d0`.",
  experiment:
    "The C function adds a detour to a route distance. The recorded `fadd s0, s0, s1` reads two binary32 operands and writes a binary32 result. The `d` form selects binary64 operands and result. As in the integer instructions, the first operand names the destination.\n\nSelect the multiplication case to see `fmul` compute a fuel cost from its two operands. These operations calculate a numeric result, then round to the destination format when the exact result does not fit.\n\nEach case loads a fixed set of recorded inputs. Reveal its recorded result to compare the output bits with the input bits. The C and assembly are recorded GCC output; the result was checked with QEMU, a program that emulates an Arm processor. This is recorded evidence, not an Arm process running in your browser. The browser CPU used in earlier lessons does not implement these floating-point instructions.",
  after:
    "The recordings use round to nearest, ties to even, with subnormal values enabled. They show these particular functions and inputs under the recorded tool settings. They do not model the floating-point control or exception registers.\n\nThe mnemonic chooses arithmetic; the operand names choose its width and register bank. A bit pattern alone does not say whether it is an integer or a floating-point number.",
  exercise:
    "Use the format-width rule on a fresh addition. The question compares two independent calls, each starting with the same inputs. Predict which format can preserve the exact sum, then check the model’s feedback.",
} as const;
