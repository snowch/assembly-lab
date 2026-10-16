	.text
	.global sdiv_x
sdiv_x:
	sdiv x0, x0, x1
	ret
	.global udiv_x
udiv_x:
	udiv x0, x0, x1
	ret
	.global sdiv_w
sdiv_w:
	sdiv w0, w0, w1
	ret
	.global udiv_w
udiv_w:
	udiv w0, w0, w1
	ret
	.global rem_x
// x0 % x1 as GCC computes it: a - (a / b) * b.
rem_x:
	sdiv x2, x0, x1
	msub x0, x2, x1, x0
	ret
