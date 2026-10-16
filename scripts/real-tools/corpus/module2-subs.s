// Module 2, lesson 2 (content/lessons/subtracting-and-the-tick-counter.listings.ts): the assembly the
// lesson wrote itself, unchanged. `elapsed_subs` is the same subtraction with the flags set (the
// ring's borrow, the last challenge); `negate_flags` is the failure experiment; `elapsed_start` is
// where the construction challenge starts and `elapsed_fixed` its reference.
elapsed_subs:
  subs w0, w0, w1
  ret
negate_flags:
  negs w0, w0
  ret
elapsed_start:
  ret
elapsed_fixed:
  sub w0, w0, w1
  ret
