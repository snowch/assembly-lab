// Copyright © 2026 Christopher Snow
course_for_assignment:
cbz     w0, .L1
mov     w2, 0
.L3:
add     w2, w2, 1
cmp     w0, w2
bne     .L3
mul     w0, w1, w2
.L1:
ret
