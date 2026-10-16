// GCC 16.1.0 -O1 (carm64g1610), from the A64 listing first in docs/notes/checkpoint-1/listings.md, unchanged.
inc8:
  sxtb w0, w0
  add w0, w0, 1
  ret
big:
  mov w0, 257
  ret
wrapped:
  cmp w0, w1
  cset w0, cc
  ret
load_s:
  ldrsb w0, [x0]
  ret
load_u:
  ldrb w0, [x0]
  ret
max_s:
  cmp w1, w0
  csel w0, w1, w0, ge
  ret
max_u:
  cmp w1, w0
  csel w0, w1, w0, cs
  ret
clear:
  cbz w1, .L8
  mov x2, x0
  add x0, x0, w1, uxtw
.L10:
  strb wzr, [x2], 1
  cmp x2, x0
  bne .L10
.L8:
  ret
div10:
  mov w1, 26215
  movk w1, 0x6666, lsl 16
  smull x1, w0, w1
  asr x1, x1, 34
  sub w0, w1, w0, asr 31
  ret
check:
  mov w0, 1
  ret

// Data for the calls; the listing above is as recorded.
	.data
	.balign 16
buf:	.byte 0x80, 0x7f, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
arr:	.word 1, -2, 3, 0x7fffffff, 5, 6
