	.arch armv8-a
	.file "layout.c"
	.text
	.align 2
	.p2align 3
	.global f
	.type f, %function
f:
	.cfi_startproc
	adrp x1, bytes
	add x1, x1, :lo12:bytes
	ldrb w0, [x1, 3]
	b .Laligned
	.balign 32
.Laligned:
	add w0, w0, 1
	.p2align 4
	add w0, w0, 2
	.align 3
	add w0, w0, 3
	adrp x2, words
	add x2, x2, :lo12:words
	ldr w3, [x2]
	ldr x4, [x2, 8]
	ldrsh x5, [x2, 18]
	adrp x6, text
	add x6, x6, :lo12:text
	ldrb w7, [x6, 1]
	ldrb w8, [x6, 5]
	adrp x9, ptr
	ldr x10, [x9, :lo12:ptr]
	ldr x11, [x10]
	ret
	.cfi_endproc
	.size f, .-f
	.data
	.balign 8
bytes:
	.byte 1, 2, 3, 0xff, -1, 'A'
	.hword 0x1234, -2
	.2byte 7
	.balign 4
words:
	.word 0xdeadbeef, 0x80000000
	.4byte 5
	.balign 8
	.quad 0x0123456789abcdef
	.8byte -1
	.hword 0x8001
	.zero 5
	.skip 3, 0x7e
	.balign 16
text:
	.ascii "ab\n\t\"\\"
	.asciz "cd"
	.string "ef", "g"
	.byte 0x41
	.balign 8
ptr:
	.quad words
	.quad text
	.quad bytes+2
	.word words
	.align 4, 0xaa
tail:
	.byte 9
	.section .rodata
	.balign 8
ro:
	.quad 0x1122334455667788
	.asciz "read only"
	.section .rodata.str1.8,"aMS",@progbits,1
	.balign 8
.LC0:
	.string "merged"
	.bss
	.balign 16
zeros:
	.zero 24
	.section .note.GNU-stack,"",@progbits
