// Copyright © 2026 Christopher Snow
course_while:
.Lcourse0:
    mov w8, w1
    movz w9, #0
    cmp w8, w9
    cset w8, ne
    cbz w8, .Lcourse1
    mov w8, w0
    movz w9, #1
    lsr w8, w8, w9
    mov w0, w8
    mov w8, w1
    movz w9, #1
    sub w8, w8, w9
    mov w1, w8
    b .Lcourse0
.Lcourse1:
    mov w8, w0
    mov w0, w8
    ret
