// Copyright © 2026 Christopher Snow
course_division:
cbz     w1, .L3
udiv    w2, w0, w1
msub    w1, w2, w1, w0
add     w0, w2, w1
.L1:
ret
.L3:
mov     w0, w1
b       .L1
