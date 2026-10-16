	.text
	.global f
f:
	mov x2, 0
	mov w2, 0
	mov x3, 1
	mov w3, 1
	mov x4, 255
	mov w4, 255
	mov x5, 65535
	mov w5, 65535
	mov x6, 65536
	mov w6, 65536
	mov x7, 0x10000
	mov w7, 0x10000
	mov x8, 0xffff0000
	mov w8, 0xffff0000
	mov w9, 0x00ff00ff
	mov w10, 0xff00ff00
	mov x11, 0xffffffff
	mov w11, 0xffffffff
	mov x12, -1
	mov w12, -1
	mov x13, -2
	mov w13, -2
	mov x14, -65536
	mov w14, -65536
	mov x15, -65537
	mov w15, -65537
	mov x16, 0x80000000
	mov w16, 0x80000000
	mov x17, 0x7fffffff
	mov w17, 0x7fffffff
	mov x18, 0xffff00000000
	mov x19, 0xffff0000ffff
	mov x20, 0xffffffff00000000
	mov x21, 0x5555555555555555
	mov x2, 0xfffffffffffffffe
	mov x3, 0x1234000000000000
	mov x4, 0xffffffffffff1234
	mov x5, 0x0000ffff0000ffff
	mov x6, 0x0f0f0f0f0f0f0f0f
	mov x7, 0xfffffffffffffffd
	mov x8, 0x3fffffff
	mov w8, 0x3fffffff
	mov x9, 0x1ffff
	mov w9, 0x1ffff
	mov x0, 0
	movk x0, 0x1234
	movk x0, 0x5678, lsl 16
	movk x0, 0x9abc, lsl 32
	movk x0, 0xdef0, lsl 48
	movz x1, 0xffff, lsl 48
	movk x1, 0, lsl 16
	movn x2, 0x1234, lsl 32
	movk x2, 0xffff
	movn w3, 0xffff
	movn w3, 0, lsl 16
	movz w4, 0xffff, lsl 16
	movk w4, 0x1234
	movz x5, 7, lsl 16
	movz x5, 7, lsl 32
	movn x6, 7, lsl 48
	movk x6, 0x8000, lsl 48
	mov x7, x6
	mov w8, w6
	mov x9, xzr
	mov w9, wzr
	mov x10, sp
	mov w11, wsp
	mov x12, sp
	mov sp, x12
	mov x13, x12
	mov x29, x30
	ret
