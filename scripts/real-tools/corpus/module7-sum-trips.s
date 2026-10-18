// Copyright © 2026 Christopher Snow
sum_trips:
mov x2, x0
cbz w1, .L4
add x3, x0, w1, uxtw 2
mov w0, 0
.L3:
ldr w1, [x2], 4
add w0, w0, w1
cmp x2, x3
bne .L3
.L1:
ret
.L4:
mov w0, w1
b .L1

.data
sensor:
.byte 12, 0, 0, 0, 25, 0, 0, 0, 7, 0, 0, 0, 40, 0, 0, 0, 255, 255, 255, 255, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 255, 255, 0, 0, 0, 128
