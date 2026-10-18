// Copyright © 2026 Christopher Snow
cap_charge:
    mov w8, w0
    mov w9, w1
    mul w8, w8, w9
    mov w3, w8
    mov w8, w3
    mov w9, w2
    cmp w8, w9
    cset w8, hi
    cbz w8, .Lcourse0
    mov w8, w2
    mov w3, w8
    b .Lcourse1
.Lcourse0:
.Lcourse1:
    mov w8, w3
    mov w0, w8
    ret
