	.text
	.global readall
readall:
	adrp x1, v8
	ldr x2, [x1, :lo12:v8]
	adrp x3, v4
	ldr w4, [x3, :lo12:v4]
	adrp x5, v1
	add x5, x5, :lo12:v1
	ldrb w6, [x5]
	ldrb w7, [x5, 1]
	adrp x8, table
	add x8, x8, :lo12:table
	ldr w9, [x8, 8]
	ldrsw x10, [x8, 12]
	ldrh w11, [x8, 4]
	adr x12, readall
	adr x13, .Lhere
.Lhere:
	adr x14, readall_end
	adrp x15, readall
	adrp x16, readall_end
	adrp x17, v8
	add x17, x17, :lo12:v8
	sub x18, x17, x1
	adrp x19, ro
	add x19, x19, :lo12:ro
	ldr x20, [x19]
	ldrb w21, [x19, 8]
	adrp x22, bss
	add x22, x22, :lo12:bss
	ldr x23, [x22]
	movz x24, 0x4455, lsl 16
	movk x24, 0x6677
	str x24, [x22, 8]
	adrp x25, v8
	str x24, [x25, :lo12:v8]
	str w24, [x25, :lo12:v4]
	strb w24, [x25, :lo12:v1]
	strh w24, [x25, :lo12:v8]
	ldr x26, [x25, :lo12:v8]
readall_end:
	ret

	.data
	.balign 8
v8:	.quad 0x1122334455667788
v4:	.word 0xa1b2c3d4
v1:	.byte 0x80, 0x7f
	.balign 4
table:	.hword 1, 2, 3, 4, 5, 6
	.word -5
	.section .rodata
	.balign 8
ro:	.quad 0xdeadbeefcafef00d
	.byte 0xfe
	.bss
	.balign 8
bss:	.zero 32
