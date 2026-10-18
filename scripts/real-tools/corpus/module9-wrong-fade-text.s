// Copyright © 2026 Christopher Snow
.text
fade_sum:
stp     x29, x30, [sp, -32]!
mov     x29, sp
str     x19, [sp, 16]
mov     w19, w0
cbnz    w0, .L4
.L2:
mov     w0, w19
ldr     x19, [sp, 16]
ldp     x29, x30, [sp], 32
ret
.L4:
mov w0, w0
bl      fade_sum
add     w19, w19, w0
b       .L2
