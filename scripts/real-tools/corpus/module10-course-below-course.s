// Copyright © 2026 Christopher Snow
course_below:
    mov w8, w0
    mov w9, w1
    cmp w8, w9
    cset w8, cc
    mov w0, w8
    ret
