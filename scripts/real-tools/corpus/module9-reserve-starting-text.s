// Copyright © 2026 Christopher Snow
.text
trip_report:
 stp x29, x30, [sp, #-16]!
 mov x29, sp
 bl half_distance
 add w0, w0, w1
 ldp x29, x30, [sp], #16
 ret
half_distance:
 lsr w0, w0, #1
 mov w1, #0
 ret
