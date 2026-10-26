// Copyright © 2026 Christopher Snow
.text
.global join_warnings
join_warnings:
  orr w0, w0, w1
  ret
.global relay_distance
relay_distance:
  stp x29, x30, [sp, #-16]!
  mov x29, sp
  bl half_distance
  ldp x29, x30, [sp], #16
  ret
half_distance:
  lsr w0, w0, #1
  ret
