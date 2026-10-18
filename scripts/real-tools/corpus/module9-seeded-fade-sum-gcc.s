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
lsr     w0, w0, 1
bl      fade_sum
add     w19, w19, w0
b       .L2

seeded_check:
 stp x29, x30, [sp, #-32]!
 str x19, [sp, #16]
 mov x19, #0xdef0
 movk x19, #0x9abc, lsl #16
 movk x19, #0x5678, lsl #32
 movk x19, #0x1234, lsl #48
 mov x29, #0x7788
 movk x29, #0x5566, lsl #16
 movk x29, #0x3344, lsl #32
 movk x29, #0x1122, lsl #48
 bl fade_sum
 ldr x19, [sp, #16]
 ldp x29, x30, [sp], #32
 ret
