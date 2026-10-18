// Copyright © 2026 Christopher Snow
.text
lit_count:
 cbz w0, .Ldone
 stp x29, x30, [sp, #-16]!
 mov x29, sp
 lsr w0, w0, #1
 bl lit_count
 add w0, w0, #1
 ldp x29, x30, [sp], #16
.Ldone:
 ret

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
 bl lit_count
 ldr x19, [sp, #16]
 ldp x29, x30, [sp], #32
 ret
