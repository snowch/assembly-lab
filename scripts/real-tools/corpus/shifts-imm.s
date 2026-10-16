	.text
	.global run
run:
	adrp x9, pairs
	add x9, x9, :lo12:pairs
	mov x10, x0
.Lnext_run:
	ldp x2, x3, [x9], 16
	lsl x4, x2, 0
	lsr x4, x2, 0
	asr x4, x2, 0
	ror x4, x2, 0
	lsl x4, x2, 1
	lsr x4, x2, 1
	asr x4, x2, 1
	ror x4, x2, 1
	lsl x4, x2, 2
	lsr x4, x2, 2
	asr x4, x2, 2
	ror x4, x2, 2
	lsl x4, x2, 3
	lsr x4, x2, 3
	asr x4, x2, 3
	ror x4, x2, 3
	lsl x4, x2, 7
	lsr x4, x2, 7
	asr x4, x2, 7
	ror x4, x2, 7
	lsl x4, x2, 8
	lsr x4, x2, 8
	asr x4, x2, 8
	ror x4, x2, 8
	lsl x4, x2, 15
	lsr x4, x2, 15
	asr x4, x2, 15
	ror x4, x2, 15
	lsl x4, x2, 16
	lsr x4, x2, 16
	asr x4, x2, 16
	ror x4, x2, 16
	lsl x4, x2, 17
	lsr x4, x2, 17
	asr x4, x2, 17
	ror x4, x2, 17
	lsl x4, x2, 31
	lsr x4, x2, 31
	asr x4, x2, 31
	ror x4, x2, 31
	lsl x4, x2, 32
	lsr x4, x2, 32
	asr x4, x2, 32
	ror x4, x2, 32
	lsl x4, x2, 33
	lsr x4, x2, 33
	asr x4, x2, 33
	ror x4, x2, 33
	lsl x4, x2, 47
	lsr x4, x2, 47
	asr x4, x2, 47
	ror x4, x2, 47
	lsl x4, x2, 48
	lsr x4, x2, 48
	asr x4, x2, 48
	ror x4, x2, 48
	lsl x4, x2, 62
	lsr x4, x2, 62
	asr x4, x2, 62
	ror x4, x2, 62
	lsl x4, x2, 63
	lsr x4, x2, 63
	asr x4, x2, 63
	ror x4, x2, 63
	lsl w5, w2, 0
	lsr w5, w2, 0
	asr w5, w2, 0
	ror w5, w2, 0
	lsl w5, w2, 1
	lsr w5, w2, 1
	asr w5, w2, 1
	ror w5, w2, 1
	lsl w5, w2, 2
	lsr w5, w2, 2
	asr w5, w2, 2
	ror w5, w2, 2
	lsl w5, w2, 3
	lsr w5, w2, 3
	asr w5, w2, 3
	ror w5, w2, 3
	lsl w5, w2, 7
	lsr w5, w2, 7
	asr w5, w2, 7
	ror w5, w2, 7
	lsl w5, w2, 8
	lsr w5, w2, 8
	asr w5, w2, 8
	ror w5, w2, 8
	lsl w5, w2, 15
	lsr w5, w2, 15
	asr w5, w2, 15
	ror w5, w2, 15
	lsl w5, w2, 16
	lsr w5, w2, 16
	asr w5, w2, 16
	ror w5, w2, 16
	lsl w5, w2, 17
	lsr w5, w2, 17
	asr w5, w2, 17
	ror w5, w2, 17
	lsl w5, w2, 30
	lsr w5, w2, 30
	asr w5, w2, 30
	ror w5, w2, 30
	lsl w5, w2, 31
	lsr w5, w2, 31
	asr w5, w2, 31
	ror w5, w2, 31
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
