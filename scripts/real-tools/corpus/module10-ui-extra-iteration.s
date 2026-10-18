// Copyright © 2026 Christopher Snow
accumulated_charge:
    movz w8, #0
    mov w2, w8
    movz w8, #0
    mov w3, w8
.Lcourse0:
    mov w8, w3
    mov w9, w0
    cmp w8, w9
    cset w8, ls
    cbz w8, .Lcourse1
    mov w8, w2
    mov w9, w1
    add w8, w8, w9
    mov w2, w8
    mov w8, w3
    movz w9, #1
    add w8, w8, w9
    mov w3, w8
    b .Lcourse0
.Lcourse1:
    mov w8, w2
    mov w0, w8
    ret
