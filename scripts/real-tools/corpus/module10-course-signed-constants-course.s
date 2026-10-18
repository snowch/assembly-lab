// Copyright © 2026 Christopher Snow
course_signed_constants:
    movz w8, #1
    movz w9, #8
    sub w8, w8, w9
    movz w9, #2
    sdiv w8, w8, w9
    movz w9, #1
    movz w10, #8
    sub w9, w9, w10
    movz w10, #2
    sdiv w17, w9, w10
    msub w9, w17, w10, w9
    add w8, w8, w9
    mov w0, w8
    ret
