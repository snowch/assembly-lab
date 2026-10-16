	.text
	.global f
f:
	adrp x1, buf
	add x1, x1, :lo12:buf
	ldr x2, [x1, 1]
	ldr x3, [x1, 3]
	ldr w4, [x1, 2]
	ldrh w5, [x1, 7]
	ldrsh x6, [x1, 9]
	ldrsw x7, [x1, 5]
	str x2, [x1, 17]
	str w3, [x1, 26]
	strh w4, [x1, 31]
	add x20, x1, 1
	ldp x8, x9, [x20]
	mov x10, 0x430000
	ldr x11, [x10, -8]
	str x11, [x10, -16]
	ldrb w12, [x10, -1]
	ret
	.data
buf:	.byte 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40
