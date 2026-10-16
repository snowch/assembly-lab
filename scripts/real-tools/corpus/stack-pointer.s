	.text
	.global f
f:
	mov x9, sp
	sub sp, sp, 32
	mov x10, sp
	str x0, [sp]
	str x1, [sp, 8]
	stp x2, x3, [sp, 16]
	ldp x4, x5, [sp]
	ldr x6, [sp, 16]
	add x11, sp, 8
	add sp, sp, 16
	mov x12, sp
	str x1, [sp, -8]!
	ldr x13, [sp], 8
	mov x14, sp
	add sp, sp, 16
	cmp sp, x9
	cset w15, eq
	mov x19, sp
	sub x16, x9, x19
	mov x17, sp
	str x0, [sp, -16]!
	ldr x18, [sp]
	add sp, sp, 16
	ret
