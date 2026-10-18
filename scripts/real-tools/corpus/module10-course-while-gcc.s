// Copyright © 2026 Christopher Snow
course_while:
cbz     w1, .L2
.L3:
lsr     w0, w0, 1
subs    w1, w1, #1
bne     .L3
.L2:
ret
