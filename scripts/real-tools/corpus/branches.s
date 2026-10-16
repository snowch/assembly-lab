	.text
	.global count
// x0 = n; returns the number of times the loop ran, with cbz/cbnz in w and x.
count:
	mov x1, 0
	cbz x0, .Ldone
.Lloop:
	add x1, x1, 1
	sub x0, x0, 1
	cbnz x0, .Lloop
.Ldone:
	mov x0, x1
	cbz w0, .Lzero
	cbnz w0, .Lnonzero
.Lzero:
	mov x0, 100
.Lnonzero:
	ret

	.global bits
// x0 = value; sets bits of the result for each tested bit of x0.
bits:
	mov x1, 0
	tbz x0, 0, .L0
	orr x1, x1, 1
.L0:
	tbnz x0, 1, .L1
	orr x1, x1, 2
.L1:
	tbz w0, 7, .L2
	orr x1, x1, 4
.L2:
	tbnz w0, 31, .L3
	orr x1, x1, 8
.L3:
	tbz x0, 32, .L4
	orr x1, x1, 16
.L4:
	tbnz x0, 63, .L5
	orr x1, x1, 32
.L5:
	tbz x0, 33, .L6
	orr x1, x1, 64
.L6:
	tbnz x0, 62, .L7
	orr x1, x1, 128
.L7:
	mov x0, x1
	ret

	.global indirect
// x0 = selector; calls one of two functions through blr and returns through ret with a register.
indirect:
	mov x9, x30
	adr x10, .Lfa
	adr x11, .Lfb
	cmp x0, 0
	csel x12, x10, x11, eq
	blr x12
	add x0, x0, 1
	mov x30, x9
	ret x30
.Lfa:
	mov x0, 10
	ret
.Lfb:
	mov x0, 20
	ret

	.global jump
// x0 = selector; br through a computed address.
jump:
	adr x1, .Lt0
	add x1, x1, x0, lsl 3
	br x1
.Lt0:
	mov x0, 111
	ret
	mov x0, 222
	ret
	mov x0, 333
	ret
	mov x0, 444
	ret

	.global backwards
backwards:
	mov x1, 0
	b .Lentry
.Lbody:
	add x1, x1, x0
	sub x0, x0, 1
.Lentry:
	cmp x0, 0
	b.gt .Lbody
	mov x0, x1
	ret
