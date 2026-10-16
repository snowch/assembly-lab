	.text
	.global leaf
leaf:
	add x0, x0, x0, lsl 1
	add x0, x0, 1
	ret

	.global mid
// mid(a) = leaf(a) + leaf(a + 1), with a frame that saves x19, x20.
mid:
	stp x29, x30, [sp, -48]!
	mov x29, sp
	stp x19, x20, [sp, 16]
	mov x19, x0
	bl leaf
	mov x20, x0
	add x0, x19, 1
	bl leaf
	add x0, x0, x20
	ldp x19, x20, [sp, 16]
	ldp x29, x30, [sp], 48
	ret

	.global top
// top(a) = mid(a) * 2 + mid(a - 1)
top:
	stp x29, x30, [sp, -32]!
	mov x29, sp
	str x19, [sp, 16]
	mov x19, x0
	bl mid
	lsl x9, x0, 1
	str x9, [sp, 24]
	sub x0, x19, 1
	bl mid
	ldr x9, [sp, 24]
	add x0, x0, x9
	ldr x19, [sp, 16]
	ldp x29, x30, [sp], 32
	ret

	.global sum
// sum(n) = n + sum(n - 1), recursively.
sum:
	cbz x0, .Lbase
	stp x29, x30, [sp, -32]!
	mov x29, sp
	str x0, [sp, 16]
	sub x0, x0, 1
	bl sum
	ldr x1, [sp, 16]
	add x0, x0, x1
	ldp x29, x30, [sp], 32
.Lbase:
	ret

	.global leafw
// A leaf that uses no frame and a w result.
leafw:
	add w0, w0, w1
	ret
