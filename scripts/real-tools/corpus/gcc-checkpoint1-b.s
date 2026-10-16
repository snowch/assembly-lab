// GCC 16.1.0 -O1 (carm64g1610), from the A64 listing second in docs/notes/checkpoint-1/listings.md, unchanged.
add_i:
  add w0, w0, w1
  ret
add_l:
  add x0, x0, w1, sxtw
  ret
sdiv0:
  sdiv w0, w0, w1
  ret
elapsed:
  sub w0, w0, w1
  ret
sum:
  cmp w1, 0
  ble .L8
  mov x2, x0
  add x3, x0, w1, sxtw 2
  mov w0, 0
.L7:
  ldr w1, [x2], 4
  add w0, w0, w1
  cmp x2, x3
  bne .L7
.L5:
  ret
.L8:
  mov w0, 0
  b .L5

// Data for the calls; the listing above is as recorded.
	.data
	.balign 16
buf:	.byte 0x80, 0x7f, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
arr:	.word 1, -2, 3, 0x7fffffff, 5, 6
