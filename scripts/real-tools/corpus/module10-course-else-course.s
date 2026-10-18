// Copyright © 2026 Christopher Snow
course_else:
    mov w8, w0
    mov w9, w1
    cmp w8, w9
    cset w8, cc
    cbz w8, .Lcourse0
    mov w8, w1
    mov w9, w0
    sub w8, w8, w9
    mov w0, w8
    ret
    b .Lcourse1
.Lcourse0:
    mov w8, w0
    mov w9, w1
    sub w8, w8, w9
    movz w9, #1
    lsl w8, w8, w9
    mov w0, w8
    ret
.Lcourse1:
