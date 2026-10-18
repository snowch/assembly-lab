// Copyright © 2026 Christopher Snow
.text
half_distance:
lsr     w0, w0, 1
ret
trip_report:
stp     x29, x30, [sp, -32]!
mov     x29, sp
str     x19, [sp, 16]
mov     w19, w1
bl      half_distance
add     w0, w0, w19
ldr     x19, [sp, 16]
ldp     x29, x30, [sp], 32
ret
