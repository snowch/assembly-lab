// Copyright © 2026 Christopher Snow
.text
lit_count:
 cbz w0, .Ldone
 stp x29, x30, [sp, #-16]!
 mov x29, sp
 lsr w0, w0, #1
 bl lit_count
 add w0, w0, #1
 ldp x29, x30, [sp], #16
.Ldone:
 ret
