// Copyright © 2026 Christopher Snow
trip_charge:
    mov w8, w0
    mov w9, w1
    mul w8, w8, w9
    mov w2, w8
    mov w8, w2
    movz w9, #7
    add w8, w8, w9
    mov w0, w8
    ret
