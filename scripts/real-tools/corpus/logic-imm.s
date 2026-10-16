	.text
	.global run
run:
	adrp x9, pairs
	add x9, x9, :lo12:pairs
	mov x10, x0
.Lnext_run:
	ldp x2, x3, [x9], 16
	and x4, x2, 0xff
	and x4, x2, 0xffff
	and x4, x2, 0xffffffff
	and x4, x2, 0xfffffffe
	and x4, x2, 0x5555555555555555
	and x4, x2, 0xaaaaaaaaaaaaaaaa
	and x4, x2, 0x0f0f0f0f0f0f0f0f
	and x4, x2, 0xff00ff00ff00ff00
	and x4, x2, 0x8000000000000000
	and x4, x2, 0x7fffffffffffffff
	and x4, x2, 0xfffffffffffffffe
	and x4, x2, 0xffffffff00000000
	and x4, x2, 0x3
	and x4, x2, 0x1
	and x4, x2, 0xfffffffffffffffd
	and x4, x2, 0x00000000ffff0000
	and x4, x2, 0x1fffffffe
	and w5, w2, 0xff
	and w5, w2, 0xffff
	and w5, w2, 0xfffffffe
	and w5, w2, 0x55555555
	and w5, w2, 0xaaaaaaaa
	and w5, w2, 0x0f0f0f0f
	and w5, w2, 0xff00ff00
	and w5, w2, 0x80000000
	and w5, w2, 0x7fffffff
	and w5, w2, 0x1
	and w5, w2, 0x3
	and w5, w2, 0xfffffffd
	and w5, w2, 0xffff0000
	and w5, w2, -2
	and w5, w2, 0x7ffffffe
	orr x4, x2, 0xff
	orr x4, x2, 0xffff
	orr x4, x2, 0xffffffff
	orr x4, x2, 0xfffffffe
	orr x4, x2, 0x5555555555555555
	orr x4, x2, 0xaaaaaaaaaaaaaaaa
	orr x4, x2, 0x0f0f0f0f0f0f0f0f
	orr x4, x2, 0xff00ff00ff00ff00
	orr x4, x2, 0x8000000000000000
	orr x4, x2, 0x7fffffffffffffff
	orr x4, x2, 0xfffffffffffffffe
	orr x4, x2, 0xffffffff00000000
	orr x4, x2, 0x3
	orr x4, x2, 0x1
	orr x4, x2, 0xfffffffffffffffd
	orr x4, x2, 0x00000000ffff0000
	orr x4, x2, 0x1fffffffe
	orr w5, w2, 0xff
	orr w5, w2, 0xffff
	orr w5, w2, 0xfffffffe
	orr w5, w2, 0x55555555
	orr w5, w2, 0xaaaaaaaa
	orr w5, w2, 0x0f0f0f0f
	orr w5, w2, 0xff00ff00
	orr w5, w2, 0x80000000
	orr w5, w2, 0x7fffffff
	orr w5, w2, 0x1
	orr w5, w2, 0x3
	orr w5, w2, 0xfffffffd
	orr w5, w2, 0xffff0000
	orr w5, w2, -2
	orr w5, w2, 0x7ffffffe
	eor x4, x2, 0xff
	eor x4, x2, 0xffff
	eor x4, x2, 0xffffffff
	eor x4, x2, 0xfffffffe
	eor x4, x2, 0x5555555555555555
	eor x4, x2, 0xaaaaaaaaaaaaaaaa
	eor x4, x2, 0x0f0f0f0f0f0f0f0f
	eor x4, x2, 0xff00ff00ff00ff00
	eor x4, x2, 0x8000000000000000
	eor x4, x2, 0x7fffffffffffffff
	eor x4, x2, 0xfffffffffffffffe
	eor x4, x2, 0xffffffff00000000
	eor x4, x2, 0x3
	eor x4, x2, 0x1
	eor x4, x2, 0xfffffffffffffffd
	eor x4, x2, 0x00000000ffff0000
	eor x4, x2, 0x1fffffffe
	eor w5, w2, 0xff
	eor w5, w2, 0xffff
	eor w5, w2, 0xfffffffe
	eor w5, w2, 0x55555555
	eor w5, w2, 0xaaaaaaaa
	eor w5, w2, 0x0f0f0f0f
	eor w5, w2, 0xff00ff00
	eor w5, w2, 0x80000000
	eor w5, w2, 0x7fffffff
	eor w5, w2, 0x1
	eor w5, w2, 0x3
	eor w5, w2, 0xfffffffd
	eor w5, w2, 0xffff0000
	eor w5, w2, -2
	eor w5, w2, 0x7ffffffe
	ands x4, x2, 0xff
	ands x4, x2, 0xffff
	ands x4, x2, 0xffffffff
	ands x4, x2, 0xfffffffe
	ands x4, x2, 0x5555555555555555
	ands x4, x2, 0xaaaaaaaaaaaaaaaa
	ands x4, x2, 0x0f0f0f0f0f0f0f0f
	ands x4, x2, 0xff00ff00ff00ff00
	ands x4, x2, 0x8000000000000000
	ands x4, x2, 0x7fffffffffffffff
	ands x4, x2, 0xfffffffffffffffe
	ands x4, x2, 0xffffffff00000000
	ands x4, x2, 0x3
	ands x4, x2, 0x1
	ands x4, x2, 0xfffffffffffffffd
	ands x4, x2, 0x00000000ffff0000
	ands x4, x2, 0x1fffffffe
	ands w5, w2, 0xff
	ands w5, w2, 0xffff
	ands w5, w2, 0xfffffffe
	ands w5, w2, 0x55555555
	ands w5, w2, 0xaaaaaaaa
	ands w5, w2, 0x0f0f0f0f
	ands w5, w2, 0xff00ff00
	ands w5, w2, 0x80000000
	ands w5, w2, 0x7fffffff
	ands w5, w2, 0x1
	ands w5, w2, 0x3
	ands w5, w2, 0xfffffffd
	ands w5, w2, 0xffff0000
	ands w5, w2, -2
	ands w5, w2, 0x7ffffffe
	tst x2, 0xff
	bic x6, x2, 0xff
	tst x2, 0xffff
	bic x6, x2, 0xffff
	tst x2, 0xffffffff
	bic x6, x2, 0xffffffff
	tst x2, 0xfffffffe
	bic x6, x2, 0xfffffffe
	tst x2, 0x5555555555555555
	bic x6, x2, 0x5555555555555555
	tst x2, 0xaaaaaaaaaaaaaaaa
	bic x6, x2, 0xaaaaaaaaaaaaaaaa
	tst w2, 0xff
	bic w7, w2, 0xff
	tst w2, 0xffff
	bic w7, w2, 0xffff
	tst w2, 0xfffffffe
	bic w7, w2, 0xfffffffe
	tst w2, 0x55555555
	bic w7, w2, 0x55555555
	tst w2, 0xaaaaaaaa
	bic w7, w2, 0xaaaaaaaa
	tst w2, 0x0f0f0f0f
	bic w7, w2, 0x0f0f0f0f
	mov x13, sp
	and sp, x2, 0xfffffffffffffff0
	mov x8, sp
	mov sp, x13
	mov x14, x3
	sub x10, x10, 1
	cbnz x10, .Lnext_run
	ret
	.data
	.balign 8
pairs:
	.quad 0x0, 0x0
	.quad 0x1, 0x0
	.quad 0x2, 0x0
	.quad 0x7f, 0x0
	.quad 0x80, 0x0
	.quad 0xff, 0x0
	.quad 0x7fff, 0x0
	.quad 0x8000, 0x0
	.quad 0xffff, 0x0
	.quad 0x7ffffffe, 0x0
	.quad 0x7fffffff, 0x0
	.quad 0x80000000, 0x0
	.quad 0x80000001, 0x0
	.quad 0xfffffffe, 0x0
	.quad 0xffffffff, 0x0
	.quad 0x100000000, 0x0
	.quad 0x7fffffffffffffff, 0x0
	.quad 0x8000000000000000, 0x0
	.quad 0x8000000000000001, 0x0
	.quad 0xfffffffffffffffe, 0x0
	.quad 0xffffffffffffffff, 0x0
	.quad 0x5555555555555555, 0x0
	.quad 0xaaaaaaaaaaaaaaaa, 0x0
	.quad 0x123456789abcdef0, 0x0
	.quad 0xfedcba9876543210, 0x0
