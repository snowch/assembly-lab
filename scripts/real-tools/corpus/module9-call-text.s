// Copyright © 2026 Christopher Snow
.text
report_once:
 stp x29, x30, [sp, #-16]!
 mov x29, sp
 bl half_distance
 add w0, w0, #1
 ldp x29, x30, [sp], #16
 ret
half_distance:
 lsr w0, w0, #1
 ret
