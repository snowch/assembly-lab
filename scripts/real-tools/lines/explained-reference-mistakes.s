// each line alone
// Copyright © 2026 Christopher Snow
// Generated from the rejected operand examples in the form reference.
add w8, x9, w10
add w8, w9, #4097
add w8, w9, #4294966296
add w8, w9, w10, lsl #32
add x8, x9, w10
adds w8, x9, w10
adds w8, w9, #4097
adds w8, w9, #4294966296
adds w8, w9, w10, lsl #32
adds x8, x9, w10
adr w8, 0
adrp w8, 0
and w8, w9, x10
and w8, w9, #0
and w8, w9, w10, lsl #32
ands w8, w9, x10
ands w8, w9, #0
ands w8, w9, w10, lsl #32
asr w8, w9, #32
asr w8, w9, x10
b 3
b.eq 3
bfi w8, w9, #31, #2
bfxil w8, w9, #31, #2
bic w8, w9, x10
bic w8, w9, #0
bic w8, w9, w10, lsl #32
bics w8, w9, x10
bics w8, w9, w10, lsl #32
bl 3
blr w9
br w9
cbnz sp, 4
cbz sp, 4
cinc w8, w9, al
cmn w9, x10
cmn w9, #4097
cmn w9, w10, lsl #32
cmn x9, w10
cmp w9, x10
cmp w9, #4097
cmp w9, w10, lsl #32
cmp x9, w10
cneg w8, w9, al
csel w8, w9, x10, ne
cset w8, al
csetm w8, al
csinc w8, w9, x10, ne
csinv w8, w9, x10, ne
csneg w8, w9, x10, ne
eon w8, w9, x10
eon w8, w9, w10, lsl #32
eor w8, w9, x10
eor w8, w9, #0
eor w8, w9, w10, lsl #32
ldp x8, w10, [x9]
ldp x8, x10, [x9, #4]
ldp x8, x10, [x9, #512]!
ldp x8, x10, [x9, #8], #16
ldr x8, [w9]
ldr x8, [x9, #32768]
ldr x8, [x9, #256]!
ldr x8, [x9, #8], #8
ldr x8, [x9, w10]
ldrb w8, [w9]
ldrb w8, [x9, #4096]
ldrb w8, [x9, #256]!
ldrb w8, [x9, #8], #8
ldrb w8, [x9, w10]
ldrh w8, [w9]
ldrh w8, [x9, #8192]
ldrh w8, [x9, #256]!
ldrh w8, [x9, #8], #8
ldrh w8, [x9, w10]
ldrsb x8, [w9]
ldrsb x8, [x9, #4096]
ldrsb x8, [x9, #256]!
ldrsb x8, [x9, #8], #8
ldrsb x8, [x9, w10]
ldrsh x8, [w9]
ldrsh x8, [x9, #8192]
ldrsh x8, [x9, #256]!
ldrsh x8, [x9, #8], #8
ldrsh x8, [x9, w10]
ldrsw x8, [w9]
ldrsw x8, [x9, #16384]
ldrsw x8, [x9, #256]!
ldrsw x8, [x9, #8], #8
ldrsw x8, [x9, w10]
ldur x8, [w9]
ldur x8, [x9, #256]
lsl w8, w9, #32
lsl w8, w9, x10
lsr w8, w9, #32
lsr w8, w9, x10
madd w8, w9, w10, x11
mneg w8, w9, #3
mov w8, x9
mov w8, #0x12345
movk x8, #65536
movk x8, #1, lsl #8
movn x8, #65536
movn x8, #1, lsl #8
movz x8, #65536
movz x8, #1, lsl #8
msub w8, w9, w10, x11
mul w8, w9, #3
mvn w8, x9
mvn w8, w9, lsl #32
neg w8, #3
neg w8, w9, ror #1
negs w8, #3
negs w8, w9, ror #1
nop w8
orn w8, w9, x10
orn w8, w9, w10, lsl #32
orr w8, w9, x10
orr w8, w9, #0
orr w8, w9, w10, lsl #32
ret w30
ret sp
ror w8, w9, #32
ror w8, w9, x10
sbfiz w8, w9, #31, #2
sbfx w8, w9, #31, #2
sdiv w8, w9, #6
smaddl w8, w9, w10, x11
smulh w8, w9, w10
smull w8, w9, w10
stp x8, w10, [x9]
stp x8, x10, [x9, #4]
stp x8, x10, [x9, #512]!
stp x8, x10, [x9, #8], #16
str x8, [w9]
str x8, [x9, #32768]
str x8, [x9, #256]!
str x8, [x9, #8], #8
str x8, [x9, w10]
strb w8, [w9]
strb w8, [x9, #4096]
strb w8, [x9, #256]!
strb w8, [x9, #8], #8
strb w8, [x9, w10]
strh w8, [w9]
strh w8, [x9, #8192]
strh w8, [x9, #256]!
strh w8, [x9, #8], #8
strh w8, [x9, w10]
stur x8, [w9]
stur x8, [x9, #256]
sub w8, x9, w10
sub w8, w9, #4097
sub w8, w9, #4294966296
sub w8, w9, w10, lsl #32
sub x8, x9, w10
subs w8, x9, w10
subs w8, w9, #4097
subs w8, w9, #4294966296
subs w8, w9, w10, lsl #32
subs x8, x9, w10
sxtb w8, x9
sxth w8, x9
sxtw w8, w9
tbnz w8, #32, 4
tbz w8, #32, 4
tst w9, x10
tst w9, #0
tst w9, w10, lsl #32
ubfiz w8, w9, #31, #2
ubfx w8, w9, #31, #2
udiv w8, w9, #6
umaddl w8, w9, w10, x11
umulh w8, w9, w10
umull w8, w9, w10
uxtb w8, x9
uxth w8, x9
