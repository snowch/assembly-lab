// Copyright © 2026 Christopher Snow
course_not:
    mov w8, w0
    cmp w8, #0
    cset w8, eq
    mov w0, w8
    ret
