// Copyright © 2026 Christopher Snow
course_division:
    mov w8, w1
    movz w9, #0
    cmp w8, w9
    cset w8, eq
    cbz w8, .Lcourse0
    movz w8, #0
    mov w0, w8
    ret
    b .Lcourse1
.Lcourse0:
.Lcourse1:
    mov w8, w0
    mov w9, w1
    udiv w8, w8, w9
    mov w9, w0
    mov w10, w1
    udiv w17, w9, w10
    msub w9, w17, w10, w9
    add w8, w8, w9
    mov w0, w8
    ret
