// Copyright © 2026 Christopher Snow
.text
.global main
main:
    stp x29, x30, [sp, #-16]!
    mov x29, sp
    mov w0, #120
    mov w1, #85
    mov w2, #42
    mov w3, #15
    bl trip_distance
    ldp x29, x30, [sp], #16
    ret

trip_distance:
    add w0, w0, w1
    add w0, w0, w2
    sub w0, w0, w3
    ret
