// Copyright © 2026 Christopher Snow
label_length:
mov x3, x0
cbz x1, .L2
mov x0, 0
.L4:
ldrb w2, [x3, x0]
cbz w2, .L1
add x0, x0, 1
cmp x1, x0
bne .L4
.L2:
mov x0, x1
.L1:
ret

.data
sensor:
.byte 65, 45, 66, 45, 67, 0, 88, 0, 0, 88, 65, 66, 67, 65, 0, 66, 67, 65, 0, 45, 45, 45, 45, 0, 48, 45, 48, 0
