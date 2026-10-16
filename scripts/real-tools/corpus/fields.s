	.text
	.global run
run:
	adrp x27, pairs
	add x27, x27, :lo12:pairs
	mov x28, x0
.Lnext_run:
	ldp x2, x3, [x27], 16
	ubfx x4, x2, 0, 1
	sbfx x4, x2, 0, 1
	ubfiz x4, x2, 0, 1
	sbfiz x4, x2, 0, 1
	mov x6, x3
	bfi x6, x2, 0, 1
	mov x7, x3
	bfxil x7, x2, 0, 1
	ubfx x4, x2, 0, 8
	sbfx x4, x2, 0, 8
	ubfiz x4, x2, 0, 8
	sbfiz x4, x2, 0, 8
	mov x6, x3
	bfi x6, x2, 0, 8
	mov x7, x3
	bfxil x7, x2, 0, 8
	ubfx x4, x2, 4, 4
	sbfx x4, x2, 4, 4
	ubfiz x4, x2, 4, 4
	sbfiz x4, x2, 4, 4
	mov x6, x3
	bfi x6, x2, 4, 4
	mov x7, x3
	bfxil x7, x2, 4, 4
	ubfx x4, x2, 8, 16
	sbfx x4, x2, 8, 16
	ubfiz x4, x2, 8, 16
	sbfiz x4, x2, 8, 16
	mov x6, x3
	bfi x6, x2, 8, 16
	mov x7, x3
	bfxil x7, x2, 8, 16
	ubfx x4, x2, 0, 32
	sbfx x4, x2, 0, 32
	ubfiz x4, x2, 0, 32
	sbfiz x4, x2, 0, 32
	mov x6, x3
	bfi x6, x2, 0, 32
	mov x7, x3
	bfxil x7, x2, 0, 32
	ubfx x4, x2, 16, 16
	sbfx x4, x2, 16, 16
	ubfiz x4, x2, 16, 16
	sbfiz x4, x2, 16, 16
	mov x6, x3
	bfi x6, x2, 16, 16
	mov x7, x3
	bfxil x7, x2, 16, 16
	ubfx x4, x2, 31, 1
	sbfx x4, x2, 31, 1
	ubfiz x4, x2, 31, 1
	sbfiz x4, x2, 31, 1
	mov x6, x3
	bfi x6, x2, 31, 1
	mov x7, x3
	bfxil x7, x2, 31, 1
	ubfx x4, x2, 32, 32
	sbfx x4, x2, 32, 32
	ubfiz x4, x2, 32, 32
	sbfiz x4, x2, 32, 32
	mov x6, x3
	bfi x6, x2, 32, 32
	mov x7, x3
	bfxil x7, x2, 32, 32
	ubfx x4, x2, 63, 1
	sbfx x4, x2, 63, 1
	ubfiz x4, x2, 63, 1
	sbfiz x4, x2, 63, 1
	mov x6, x3
	bfi x6, x2, 63, 1
	mov x7, x3
	bfxil x7, x2, 63, 1
	ubfx x4, x2, 1, 62
	sbfx x4, x2, 1, 62
	ubfiz x4, x2, 1, 62
	sbfiz x4, x2, 1, 62
	mov x6, x3
	bfi x6, x2, 1, 62
	mov x7, x3
	bfxil x7, x2, 1, 62
	ubfx x4, x2, 0, 64
	sbfx x4, x2, 0, 64
	ubfiz x4, x2, 0, 64
	sbfiz x4, x2, 0, 64
	mov x6, x3
	bfi x6, x2, 0, 64
	mov x7, x3
	bfxil x7, x2, 0, 64
	ubfx x4, x2, 20, 40
	sbfx x4, x2, 20, 40
	ubfiz x4, x2, 20, 40
	sbfiz x4, x2, 20, 40
	mov x6, x3
	bfi x6, x2, 20, 40
	mov x7, x3
	bfxil x7, x2, 20, 40
	ubfx x4, x2, 3, 29
	sbfx x4, x2, 3, 29
	ubfiz x4, x2, 3, 29
	sbfiz x4, x2, 3, 29
	mov x6, x3
	bfi x6, x2, 3, 29
	mov x7, x3
	bfxil x7, x2, 3, 29
	ubfx w5, w2, 0, 1
	sbfx w5, w2, 0, 1
	ubfiz w5, w2, 0, 1
	sbfiz w5, w2, 0, 1
	mov x8, x3
	bfi w8, w2, 0, 1
	mov x9, x3
	bfxil w9, w2, 0, 1
	ubfx w5, w2, 0, 8
	sbfx w5, w2, 0, 8
	ubfiz w5, w2, 0, 8
	sbfiz w5, w2, 0, 8
	mov x8, x3
	bfi w8, w2, 0, 8
	mov x9, x3
	bfxil w9, w2, 0, 8
	ubfx w5, w2, 4, 4
	sbfx w5, w2, 4, 4
	ubfiz w5, w2, 4, 4
	sbfiz w5, w2, 4, 4
	mov x8, x3
	bfi w8, w2, 4, 4
	mov x9, x3
	bfxil w9, w2, 4, 4
	ubfx w5, w2, 8, 16
	sbfx w5, w2, 8, 16
	ubfiz w5, w2, 8, 16
	sbfiz w5, w2, 8, 16
	mov x8, x3
	bfi w8, w2, 8, 16
	mov x9, x3
	bfxil w9, w2, 8, 16
	ubfx w5, w2, 0, 32
	sbfx w5, w2, 0, 32
	ubfiz w5, w2, 0, 32
	sbfiz w5, w2, 0, 32
	mov x8, x3
	bfi w8, w2, 0, 32
	mov x9, x3
	bfxil w9, w2, 0, 32
	ubfx w5, w2, 16, 16
	sbfx w5, w2, 16, 16
	ubfiz w5, w2, 16, 16
	sbfiz w5, w2, 16, 16
	mov x8, x3
	bfi w8, w2, 16, 16
	mov x9, x3
	bfxil w9, w2, 16, 16
	ubfx w5, w2, 31, 1
	sbfx w5, w2, 31, 1
	ubfiz w5, w2, 31, 1
	sbfiz w5, w2, 31, 1
	mov x8, x3
	bfi w8, w2, 31, 1
	mov x9, x3
	bfxil w9, w2, 31, 1
	ubfx w5, w2, 1, 30
	sbfx w5, w2, 1, 30
	ubfiz w5, w2, 1, 30
	sbfiz w5, w2, 1, 30
	mov x8, x3
	bfi w8, w2, 1, 30
	mov x9, x3
	bfxil w9, w2, 1, 30
	ubfx w5, w2, 12, 20
	sbfx w5, w2, 12, 20
	ubfiz w5, w2, 12, 20
	sbfiz w5, w2, 12, 20
	mov x8, x3
	bfi w8, w2, 12, 20
	mov x9, x3
	bfxil w9, w2, 12, 20
	uxtb w10, w2
	uxth w10, w2
	sxtb w10, w2
	sxth w10, w2
	sxtb x10, w2
	sxth x10, w2
	sxtw x10, w2
	uxtb x10, w2
	uxth x10, w2
	sub x28, x28, 1
	cbnz x28, .Lnext_run
	ret
	.data
	.balign 8
pairs:
	.quad 0x0, 0x7fffffff
	.quad 0x0, 0x80000000
	.quad 0x0, 0x80000001
	.quad 0x0, 0xfffffffe
	.quad 0x0, 0xffffffff
	.quad 0x0, 0x100000000
	.quad 0x0, 0x7fffffffffffffff
	.quad 0x0, 0x8000000000000000
	.quad 0x0, 0x8000000000000001
	.quad 0x0, 0xfffffffffffffffe
	.quad 0x1, 0x7fffffff
	.quad 0x1, 0x80000000
	.quad 0x1, 0x80000001
	.quad 0x1, 0xfffffffe
	.quad 0x1, 0xffffffff
	.quad 0x1, 0x100000000
	.quad 0x1, 0x7fffffffffffffff
	.quad 0x1, 0x8000000000000000
	.quad 0x1, 0x8000000000000001
	.quad 0x1, 0xfffffffffffffffe
	.quad 0x2, 0x7fffffff
	.quad 0x2, 0x80000000
	.quad 0x2, 0x80000001
	.quad 0x2, 0xfffffffe
	.quad 0x2, 0xffffffff
	.quad 0x2, 0x100000000
	.quad 0x2, 0x7fffffffffffffff
	.quad 0x2, 0x8000000000000000
	.quad 0x2, 0x8000000000000001
	.quad 0x2, 0xfffffffffffffffe
	.quad 0x7f, 0x7fffffff
	.quad 0x7f, 0x80000000
	.quad 0x7f, 0x80000001
	.quad 0x7f, 0xfffffffe
	.quad 0x7f, 0xffffffff
	.quad 0x7f, 0x100000000
	.quad 0x7f, 0x7fffffffffffffff
	.quad 0x7f, 0x8000000000000000
	.quad 0x7f, 0x8000000000000001
	.quad 0x7f, 0xfffffffffffffffe
	.quad 0x80, 0x7fffffff
	.quad 0x80, 0x80000000
	.quad 0x80, 0x80000001
	.quad 0x80, 0xfffffffe
	.quad 0x80, 0xffffffff
	.quad 0x80, 0x100000000
	.quad 0x80, 0x7fffffffffffffff
	.quad 0x80, 0x8000000000000000
	.quad 0x80, 0x8000000000000001
	.quad 0x80, 0xfffffffffffffffe
	.quad 0xff, 0x7fffffff
	.quad 0xff, 0x80000000
	.quad 0xff, 0x80000001
	.quad 0xff, 0xfffffffe
	.quad 0xff, 0xffffffff
	.quad 0xff, 0x100000000
	.quad 0xff, 0x7fffffffffffffff
	.quad 0xff, 0x8000000000000000
	.quad 0xff, 0x8000000000000001
	.quad 0xff, 0xfffffffffffffffe
	.quad 0x7fff, 0x7fffffff
	.quad 0x7fff, 0x80000000
	.quad 0x7fff, 0x80000001
	.quad 0x7fff, 0xfffffffe
	.quad 0x7fff, 0xffffffff
	.quad 0x7fff, 0x100000000
	.quad 0x7fff, 0x7fffffffffffffff
	.quad 0x7fff, 0x8000000000000000
	.quad 0x7fff, 0x8000000000000001
	.quad 0x7fff, 0xfffffffffffffffe
	.quad 0x8000, 0x7fffffff
	.quad 0x8000, 0x80000000
	.quad 0x8000, 0x80000001
	.quad 0x8000, 0xfffffffe
	.quad 0x8000, 0xffffffff
	.quad 0x8000, 0x100000000
	.quad 0x8000, 0x7fffffffffffffff
	.quad 0x8000, 0x8000000000000000
	.quad 0x8000, 0x8000000000000001
	.quad 0x8000, 0xfffffffffffffffe
	.quad 0xffff, 0x7fffffff
	.quad 0xffff, 0x80000000
	.quad 0xffff, 0x80000001
	.quad 0xffff, 0xfffffffe
	.quad 0xffff, 0xffffffff
	.quad 0xffff, 0x100000000
	.quad 0xffff, 0x7fffffffffffffff
	.quad 0xffff, 0x8000000000000000
	.quad 0xffff, 0x8000000000000001
	.quad 0xffff, 0xfffffffffffffffe
	.quad 0x7ffffffe, 0x7fffffff
	.quad 0x7ffffffe, 0x80000000
	.quad 0x7ffffffe, 0x80000001
	.quad 0x7ffffffe, 0xfffffffe
	.quad 0x7ffffffe, 0xffffffff
	.quad 0x7ffffffe, 0x100000000
	.quad 0x7ffffffe, 0x7fffffffffffffff
	.quad 0x7ffffffe, 0x8000000000000000
	.quad 0x7ffffffe, 0x8000000000000001
	.quad 0x7ffffffe, 0xfffffffffffffffe
	.quad 0x7fffffff, 0x7fffffff
	.quad 0x7fffffff, 0x80000000
	.quad 0x7fffffff, 0x80000001
	.quad 0x7fffffff, 0xfffffffe
	.quad 0x7fffffff, 0xffffffff
	.quad 0x7fffffff, 0x100000000
	.quad 0x7fffffff, 0x7fffffffffffffff
	.quad 0x7fffffff, 0x8000000000000000
	.quad 0x7fffffff, 0x8000000000000001
	.quad 0x7fffffff, 0xfffffffffffffffe
	.quad 0x80000000, 0x7fffffff
	.quad 0x80000000, 0x80000000
	.quad 0x80000000, 0x80000001
	.quad 0x80000000, 0xfffffffe
	.quad 0x80000000, 0xffffffff
	.quad 0x80000000, 0x100000000
	.quad 0x80000000, 0x7fffffffffffffff
	.quad 0x80000000, 0x8000000000000000
	.quad 0x80000000, 0x8000000000000001
	.quad 0x80000000, 0xfffffffffffffffe
