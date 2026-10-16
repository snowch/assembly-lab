	.text
	.global run
run:
	adrp x9, pairs
	add x9, x9, :lo12:pairs
	mov x10, x0
.Lnext_run:
	ldp x2, x3, [x9], 16
	add x4, x2, x3, lsl 0
	add x4, x2, x3, lsl 1
	add x4, x2, x3, lsl 17
	add x4, x2, x3, lsl 63
	add x4, x2, x3, lsr 1
	add x4, x2, x3, lsr 63
	add x4, x2, x3, asr 1
	add x4, x2, x3, asr 63
	add x4, x2, x3, asr 32
	add w5, w2, w3, lsl 0
	add w5, w2, w3, lsl 5
	add w5, w2, w3, lsl 31
	add w5, w2, w3, lsr 1
	add w5, w2, w3, lsr 31
	add w5, w2, w3, asr 1
	add w5, w2, w3, asr 31
	add x6, x2, w3, uxtb 0
	add x6, x2, w3, uxtb 1
	add x6, x2, w3, uxtb 2
	add x6, x2, w3, uxtb 4
	add x6, x2, w3, uxth 0
	add x6, x2, w3, uxth 1
	add x6, x2, w3, uxth 2
	add x6, x2, w3, uxth 4
	add x6, x2, w3, uxtw 0
	add x6, x2, w3, uxtw 1
	add x6, x2, w3, uxtw 2
	add x6, x2, w3, uxtw 4
	add x6, x2, w3, sxtb 0
	add x6, x2, w3, sxtb 1
	add x6, x2, w3, sxtb 2
	add x6, x2, w3, sxtb 4
	add x6, x2, w3, sxth 0
	add x6, x2, w3, sxth 1
	add x6, x2, w3, sxth 2
	add x6, x2, w3, sxth 4
	add x6, x2, w3, sxtw 0
	add x6, x2, w3, sxtw 1
	add x6, x2, w3, sxtw 2
	add x6, x2, w3, sxtw 4
	add x7, x2, x3, uxtx 0
	add x7, x2, x3, uxtx 3
	add x7, x2, x3, uxtx 4
	add x7, x2, x3, sxtx 0
	add x7, x2, x3, sxtx 3
	add x7, x2, x3, sxtx 4
	add w8, w2, w3, uxtb 0
	add w8, w2, w3, uxtb 1
	add w8, w2, w3, uxtb 4
	add w8, w2, w3, uxth 0
	add w8, w2, w3, uxth 1
	add w8, w2, w3, uxth 4
	add w8, w2, w3, uxtw 0
	add w8, w2, w3, uxtw 1
	add w8, w2, w3, uxtw 4
	add w8, w2, w3, sxtb 0
	add w8, w2, w3, sxtb 1
	add w8, w2, w3, sxtb 4
	add w8, w2, w3, sxth 0
	add w8, w2, w3, sxth 1
	add w8, w2, w3, sxth 4
	add w8, w2, w3, sxtw 0
	add w8, w2, w3, sxtw 1
	add w8, w2, w3, sxtw 4
	add w8, w2, w3, uxtx 0
	add w8, w2, w3, uxtx 1
	add w8, w2, w3, uxtx 4
	add w8, w2, w3, sxtx 0
	add w8, w2, w3, sxtx 1
	add w8, w2, w3, sxtx 4
	sub x4, x2, x3, lsl 0
	sub x4, x2, x3, lsl 1
	sub x4, x2, x3, lsl 17
	sub x4, x2, x3, lsl 63
	sub x4, x2, x3, lsr 1
	sub x4, x2, x3, lsr 63
	sub x4, x2, x3, asr 1
	sub x4, x2, x3, asr 63
	sub x4, x2, x3, asr 32
	sub w5, w2, w3, lsl 0
	sub w5, w2, w3, lsl 5
	sub w5, w2, w3, lsl 31
	sub w5, w2, w3, lsr 1
	sub w5, w2, w3, lsr 31
	sub w5, w2, w3, asr 1
	sub w5, w2, w3, asr 31
	sub x6, x2, w3, uxtb 0
	sub x6, x2, w3, uxtb 1
	sub x6, x2, w3, uxtb 2
	sub x6, x2, w3, uxtb 4
	sub x6, x2, w3, uxth 0
	sub x6, x2, w3, uxth 1
	sub x6, x2, w3, uxth 2
	sub x6, x2, w3, uxth 4
	sub x6, x2, w3, uxtw 0
	sub x6, x2, w3, uxtw 1
	sub x6, x2, w3, uxtw 2
	sub x6, x2, w3, uxtw 4
	sub x6, x2, w3, sxtb 0
	sub x6, x2, w3, sxtb 1
	sub x6, x2, w3, sxtb 2
	sub x6, x2, w3, sxtb 4
	sub x6, x2, w3, sxth 0
	sub x6, x2, w3, sxth 1
	sub x6, x2, w3, sxth 2
	sub x6, x2, w3, sxth 4
	sub x6, x2, w3, sxtw 0
	sub x6, x2, w3, sxtw 1
	sub x6, x2, w3, sxtw 2
	sub x6, x2, w3, sxtw 4
	sub x7, x2, x3, uxtx 0
	sub x7, x2, x3, uxtx 3
	sub x7, x2, x3, uxtx 4
	sub x7, x2, x3, sxtx 0
	sub x7, x2, x3, sxtx 3
	sub x7, x2, x3, sxtx 4
	sub w8, w2, w3, uxtb 0
	sub w8, w2, w3, uxtb 1
	sub w8, w2, w3, uxtb 4
	sub w8, w2, w3, uxth 0
	sub w8, w2, w3, uxth 1
	sub w8, w2, w3, uxth 4
	sub w8, w2, w3, uxtw 0
	sub w8, w2, w3, uxtw 1
	sub w8, w2, w3, uxtw 4
	sub w8, w2, w3, sxtb 0
	sub w8, w2, w3, sxtb 1
	sub w8, w2, w3, sxtb 4
	sub w8, w2, w3, sxth 0
	sub w8, w2, w3, sxth 1
	sub w8, w2, w3, sxth 4
	sub w8, w2, w3, sxtw 0
	sub w8, w2, w3, sxtw 1
	sub w8, w2, w3, sxtw 4
	sub w8, w2, w3, uxtx 0
	sub w8, w2, w3, uxtx 1
	sub w8, w2, w3, uxtx 4
	sub w8, w2, w3, sxtx 0
	sub w8, w2, w3, sxtx 1
	sub w8, w2, w3, sxtx 4
	adds x4, x2, x3, lsl 0
	adds x4, x2, x3, lsl 1
	adds x4, x2, x3, lsl 17
	adds x4, x2, x3, lsl 63
	adds x4, x2, x3, lsr 1
	adds x4, x2, x3, lsr 63
	adds x4, x2, x3, asr 1
	adds x4, x2, x3, asr 63
	adds x4, x2, x3, asr 32
	adds w5, w2, w3, lsl 0
	adds w5, w2, w3, lsl 5
	adds w5, w2, w3, lsl 31
	adds w5, w2, w3, lsr 1
	adds w5, w2, w3, lsr 31
	adds w5, w2, w3, asr 1
	adds w5, w2, w3, asr 31
	adds x6, x2, w3, uxtb 0
	adds x6, x2, w3, uxtb 1
	adds x6, x2, w3, uxtb 2
	adds x6, x2, w3, uxtb 4
	adds x6, x2, w3, uxth 0
	adds x6, x2, w3, uxth 1
	adds x6, x2, w3, uxth 2
	adds x6, x2, w3, uxth 4
	adds x6, x2, w3, uxtw 0
	adds x6, x2, w3, uxtw 1
	adds x6, x2, w3, uxtw 2
	adds x6, x2, w3, uxtw 4
	adds x6, x2, w3, sxtb 0
	adds x6, x2, w3, sxtb 1
	adds x6, x2, w3, sxtb 2
	adds x6, x2, w3, sxtb 4
	adds x6, x2, w3, sxth 0
	adds x6, x2, w3, sxth 1
	adds x6, x2, w3, sxth 2
	adds x6, x2, w3, sxth 4
	adds x6, x2, w3, sxtw 0
	adds x6, x2, w3, sxtw 1
	adds x6, x2, w3, sxtw 2
	adds x6, x2, w3, sxtw 4
	adds x7, x2, x3, uxtx 0
	adds x7, x2, x3, uxtx 3
	adds x7, x2, x3, uxtx 4
	adds x7, x2, x3, sxtx 0
	adds x7, x2, x3, sxtx 3
	adds x7, x2, x3, sxtx 4
	adds w8, w2, w3, uxtb 0
	adds w8, w2, w3, uxtb 1
	adds w8, w2, w3, uxtb 4
	adds w8, w2, w3, uxth 0
	adds w8, w2, w3, uxth 1
	adds w8, w2, w3, uxth 4
	adds w8, w2, w3, uxtw 0
	adds w8, w2, w3, uxtw 1
	adds w8, w2, w3, uxtw 4
	adds w8, w2, w3, sxtb 0
	adds w8, w2, w3, sxtb 1
	adds w8, w2, w3, sxtb 4
	adds w8, w2, w3, sxth 0
	adds w8, w2, w3, sxth 1
	adds w8, w2, w3, sxth 4
	adds w8, w2, w3, sxtw 0
	adds w8, w2, w3, sxtw 1
	adds w8, w2, w3, sxtw 4
	adds w8, w2, w3, uxtx 0
	adds w8, w2, w3, uxtx 1
	adds w8, w2, w3, uxtx 4
	adds w8, w2, w3, sxtx 0
	adds w8, w2, w3, sxtx 1
	adds w8, w2, w3, sxtx 4
	subs x4, x2, x3, lsl 0
	subs x4, x2, x3, lsl 1
	subs x4, x2, x3, lsl 17
	subs x4, x2, x3, lsl 63
	subs x4, x2, x3, lsr 1
	subs x4, x2, x3, lsr 63
	subs x4, x2, x3, asr 1
	subs x4, x2, x3, asr 63
	subs x4, x2, x3, asr 32
	subs w5, w2, w3, lsl 0
	subs w5, w2, w3, lsl 5
	subs w5, w2, w3, lsl 31
	subs w5, w2, w3, lsr 1
	subs w5, w2, w3, lsr 31
	subs w5, w2, w3, asr 1
	subs w5, w2, w3, asr 31
	subs x6, x2, w3, uxtb 0
	subs x6, x2, w3, uxtb 1
	subs x6, x2, w3, uxtb 2
	subs x6, x2, w3, uxtb 4
	subs x6, x2, w3, uxth 0
	subs x6, x2, w3, uxth 1
	subs x6, x2, w3, uxth 2
	subs x6, x2, w3, uxth 4
	subs x6, x2, w3, uxtw 0
	subs x6, x2, w3, uxtw 1
	subs x6, x2, w3, uxtw 2
	subs x6, x2, w3, uxtw 4
	subs x6, x2, w3, sxtb 0
	subs x6, x2, w3, sxtb 1
	subs x6, x2, w3, sxtb 2
	subs x6, x2, w3, sxtb 4
	subs x6, x2, w3, sxth 0
	subs x6, x2, w3, sxth 1
	subs x6, x2, w3, sxth 2
	subs x6, x2, w3, sxth 4
	subs x6, x2, w3, sxtw 0
	subs x6, x2, w3, sxtw 1
	subs x6, x2, w3, sxtw 2
	subs x6, x2, w3, sxtw 4
	subs x7, x2, x3, uxtx 0
	subs x7, x2, x3, uxtx 3
	subs x7, x2, x3, uxtx 4
	subs x7, x2, x3, sxtx 0
	subs x7, x2, x3, sxtx 3
	subs x7, x2, x3, sxtx 4
	subs w8, w2, w3, uxtb 0
	subs w8, w2, w3, uxtb 1
	subs w8, w2, w3, uxtb 4
	subs w8, w2, w3, uxth 0
	subs w8, w2, w3, uxth 1
	subs w8, w2, w3, uxth 4
	subs w8, w2, w3, uxtw 0
	subs w8, w2, w3, uxtw 1
	subs w8, w2, w3, uxtw 4
	subs w8, w2, w3, sxtb 0
	subs w8, w2, w3, sxtb 1
	subs w8, w2, w3, sxtb 4
	subs w8, w2, w3, sxth 0
	subs w8, w2, w3, sxth 1
	subs w8, w2, w3, sxth 4
	subs w8, w2, w3, sxtw 0
	subs w8, w2, w3, sxtw 1
	subs w8, w2, w3, sxtw 4
	subs w8, w2, w3, uxtx 0
	subs w8, w2, w3, uxtx 1
	subs w8, w2, w3, uxtx 4
	subs w8, w2, w3, sxtx 0
	subs w8, w2, w3, sxtx 1
	subs w8, w2, w3, sxtx 4
	cmp x2, w3, uxtb 2
	cmn x2, w3, uxtb
	cmp w2, w3, uxtb 1
	cmn w2, w3, uxtb 3
	cmp x2, w3, uxth 2
	cmn x2, w3, uxth
	cmp w2, w3, uxth 1
	cmn w2, w3, uxth 3
	cmp x2, w3, uxtw 2
	cmn x2, w3, uxtw
	cmp w2, w3, uxtw 1
	cmn w2, w3, uxtw 3
	cmp x2, w3, sxtb 2
	cmn x2, w3, sxtb
	cmp w2, w3, sxtb 1
	cmn w2, w3, sxtb 3
	cmp x2, w3, sxth 2
	cmn x2, w3, sxth
	cmp w2, w3, sxth 1
	cmn w2, w3, sxth 3
	cmp x2, w3, sxtw 2
	cmn x2, w3, sxtw
	cmp w2, w3, sxtw 1
	cmn w2, w3, sxtw 3
	mov x14, sp
	add x13, sp, x3
	add x13, sp, x3, lsl 3
	add x13, sp, w3, uxtw 2
	add x13, sp, w3, sxtw 2
	sub x13, sp, x3
	add x13, sp, 16
	sub x13, sp, 4095
	add x13, sp, 4096
	adds x13, sp, x3
	subs x13, sp, w3, sxtb
	cmp sp, x3
	cmp sp, 1
	cmn sp, w3, uxtw 1
	add sp, sp, x3, lsl 4
	mov x12, sp
	mov sp, x14
	sub sp, sp, w3, uxtb 3
	mov x11, sp
	mov sp, x14
	add w13, wsp, w3
	add wsp, wsp, w3, uxtw 2
	mov w11, wsp
	mov sp, x14
	add sp, sp, 32
	sub sp, sp, 32
	add sp, sp, 4096
	sub sp, sp, 4096
	mov x15, sp
	mov sp, x14
	sub x10, x10, 1
	cbnz x10, .Lnext_run
	ret
	.data
	.balign 8
pairs:
	.quad 0x0, 0x0
	.quad 0x0, 0x1
	.quad 0x0, 0x5
	.quad 0x0, 0x7f
	.quad 0x0, 0x80
	.quad 0x0, 0xfff
	.quad 0x0, 0x1fff
	.quad 0x0, 0x80000000
	.quad 0x0, 0xffffffff
	.quad 0x0, 0xfffffffffffffff0
	.quad 0x1, 0x0
	.quad 0x1, 0x1
	.quad 0x1, 0x5
	.quad 0x1, 0x7f
	.quad 0x1, 0x80
	.quad 0x1, 0xfff
	.quad 0x1, 0x1fff
	.quad 0x1, 0x80000000
	.quad 0x1, 0xffffffff
	.quad 0x1, 0xfffffffffffffff0
	.quad 0x2, 0x0
	.quad 0x2, 0x1
	.quad 0x2, 0x5
	.quad 0x2, 0x7f
	.quad 0x2, 0x80
	.quad 0x2, 0xfff
	.quad 0x2, 0x1fff
	.quad 0x2, 0x80000000
	.quad 0x2, 0xffffffff
	.quad 0x2, 0xfffffffffffffff0
	.quad 0x7f, 0x0
	.quad 0x7f, 0x1
	.quad 0x7f, 0x5
	.quad 0x7f, 0x7f
	.quad 0x7f, 0x80
	.quad 0x7f, 0xfff
	.quad 0x7f, 0x1fff
	.quad 0x7f, 0x80000000
	.quad 0x7f, 0xffffffff
	.quad 0x7f, 0xfffffffffffffff0
	.quad 0x80, 0x0
	.quad 0x80, 0x1
	.quad 0x80, 0x5
	.quad 0x80, 0x7f
	.quad 0x80, 0x80
	.quad 0x80, 0xfff
	.quad 0x80, 0x1fff
	.quad 0x80, 0x80000000
	.quad 0x80, 0xffffffff
	.quad 0x80, 0xfffffffffffffff0
	.quad 0xff, 0x0
	.quad 0xff, 0x1
	.quad 0xff, 0x5
	.quad 0xff, 0x7f
	.quad 0xff, 0x80
	.quad 0xff, 0xfff
	.quad 0xff, 0x1fff
	.quad 0xff, 0x80000000
	.quad 0xff, 0xffffffff
	.quad 0xff, 0xfffffffffffffff0
	.quad 0x7fff, 0x0
	.quad 0x7fff, 0x1
	.quad 0x7fff, 0x5
	.quad 0x7fff, 0x7f
	.quad 0x7fff, 0x80
	.quad 0x7fff, 0xfff
	.quad 0x7fff, 0x1fff
	.quad 0x7fff, 0x80000000
	.quad 0x7fff, 0xffffffff
	.quad 0x7fff, 0xfffffffffffffff0
	.quad 0x8000, 0x0
	.quad 0x8000, 0x1
	.quad 0x8000, 0x5
	.quad 0x8000, 0x7f
	.quad 0x8000, 0x80
	.quad 0x8000, 0xfff
	.quad 0x8000, 0x1fff
	.quad 0x8000, 0x80000000
	.quad 0x8000, 0xffffffff
	.quad 0x8000, 0xfffffffffffffff0
	.quad 0xffffffff, 0x0
	.quad 0xffffffff, 0x1
	.quad 0xffffffff, 0x5
	.quad 0xffffffff, 0x7f
	.quad 0xffffffff, 0x80
	.quad 0xffffffff, 0xfff
	.quad 0xffffffff, 0x1fff
	.quad 0xffffffff, 0x80000000
	.quad 0xffffffff, 0xffffffff
	.quad 0xffffffff, 0xfffffffffffffff0
	.quad 0x100000000, 0x0
	.quad 0x100000000, 0x1
	.quad 0x100000000, 0x5
	.quad 0x100000000, 0x7f
	.quad 0x100000000, 0x80
	.quad 0x100000000, 0xfff
	.quad 0x100000000, 0x1fff
	.quad 0x100000000, 0x80000000
	.quad 0x100000000, 0xffffffff
	.quad 0x100000000, 0xfffffffffffffff0
	.quad 0x7fffffffffffffff, 0x0
	.quad 0x7fffffffffffffff, 0x1
	.quad 0x7fffffffffffffff, 0x5
	.quad 0x7fffffffffffffff, 0x7f
	.quad 0x7fffffffffffffff, 0x80
	.quad 0x7fffffffffffffff, 0xfff
	.quad 0x7fffffffffffffff, 0x1fff
	.quad 0x7fffffffffffffff, 0x80000000
	.quad 0x7fffffffffffffff, 0xffffffff
	.quad 0x7fffffffffffffff, 0xfffffffffffffff0
	.quad 0x8000000000000000, 0x0
	.quad 0x8000000000000000, 0x1
	.quad 0x8000000000000000, 0x5
	.quad 0x8000000000000000, 0x7f
	.quad 0x8000000000000000, 0x80
	.quad 0x8000000000000000, 0xfff
	.quad 0x8000000000000000, 0x1fff
	.quad 0x8000000000000000, 0x80000000
	.quad 0x8000000000000000, 0xffffffff
	.quad 0x8000000000000000, 0xfffffffffffffff0
	.quad 0x8000000000000001, 0x0
	.quad 0x8000000000000001, 0x1
	.quad 0x8000000000000001, 0x5
	.quad 0x8000000000000001, 0x7f
	.quad 0x8000000000000001, 0x80
	.quad 0x8000000000000001, 0xfff
	.quad 0x8000000000000001, 0x1fff
	.quad 0x8000000000000001, 0x80000000
	.quad 0x8000000000000001, 0xffffffff
	.quad 0x8000000000000001, 0xfffffffffffffff0
	.quad 0xfffffffffffffffe, 0x0
	.quad 0xfffffffffffffffe, 0x1
	.quad 0xfffffffffffffffe, 0x5
	.quad 0xfffffffffffffffe, 0x7f
	.quad 0xfffffffffffffffe, 0x80
	.quad 0xfffffffffffffffe, 0xfff
	.quad 0xfffffffffffffffe, 0x1fff
	.quad 0xfffffffffffffffe, 0x80000000
	.quad 0xfffffffffffffffe, 0xffffffff
	.quad 0xfffffffffffffffe, 0xfffffffffffffff0
	.quad 0xffffffffffffffff, 0x0
	.quad 0xffffffffffffffff, 0x1
	.quad 0xffffffffffffffff, 0x5
	.quad 0xffffffffffffffff, 0x7f
	.quad 0xffffffffffffffff, 0x80
	.quad 0xffffffffffffffff, 0xfff
	.quad 0xffffffffffffffff, 0x1fff
	.quad 0xffffffffffffffff, 0x80000000
	.quad 0xffffffffffffffff, 0xffffffff
	.quad 0xffffffffffffffff, 0xfffffffffffffff0
	.quad 0x5555555555555555, 0x0
	.quad 0x5555555555555555, 0x1
	.quad 0x5555555555555555, 0x5
	.quad 0x5555555555555555, 0x7f
	.quad 0x5555555555555555, 0x80
	.quad 0x5555555555555555, 0xfff
	.quad 0x5555555555555555, 0x1fff
	.quad 0x5555555555555555, 0x80000000
	.quad 0x5555555555555555, 0xffffffff
	.quad 0x5555555555555555, 0xfffffffffffffff0
