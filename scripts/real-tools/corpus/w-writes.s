	.text
	.global wzero
// x0 = a value with its top half set, x1 = another
wzero:
	mov w2, w0
	add w3, w0, w1
	sub w4, w0, w1
	orr w5, w0, w1
	mov w6, 7
	mov x7, x0
	movk w7, 1
	mov x8, x0
	movk w8, 0xffff, lsl 16
	mov x9, x0
	movz w9, 3
	mov x10, x0
	movn w10, 4
	mul w11, w0, w1
	sxtw x12, w0
	neg w13, w0
	lsl w14, w0, 4
	mov x15, x0
	csel w15, w0, w1, eq
	csel w16, w0, w1, ne
	cset w17, ne
	mov x18, x0
	cmp w18, 0
	uxtb w19, w0
	ubfx w20, w0, 8, 8
	mvn w21, w0
	mov x22, x0
	add w22, w22, 0
	ret
