// Copyright © 2026 Christopher Snow
course_bit_mix:
    mov w8, w0
    mov w9, w1
    and w8, w8, w9
    mov w9, w0
    mov w10, w1
    eor w9, w9, w10
    orr w8, w8, w9
    mov w9, w0
    mvn w9, w9
    add w8, w8, w9
    mov w0, w8
    ret
