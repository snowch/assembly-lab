// Copyright © 2026 Christopher Snow
.text
.global caller
caller:
  stp x29, x30, [sp, #-16]!
  bl increment_int
caller_continues:
  add w1, w0, w0
  ldp x29, x30, [sp], #16
  ret
increment_int:
  add w0, w0, 1
  ret
