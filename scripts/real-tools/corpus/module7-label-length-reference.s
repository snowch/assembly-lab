// Copyright © 2026 Christopher Snow
label_length_reference:
mov x3, x0
mov x0, #0
cbz x1, done
loop:
ldrb w2, [x3, x0]
cbz w2, done
add x0, x0, #1
cmp x0, x1
b.ne loop
done:
ret

.data
sensor:
.byte 65, 45, 66, 45, 67, 0, 88, 0, 0, 88, 65, 66, 67, 65, 0, 66, 67, 65, 0, 45, 45, 45, 45, 0, 48, 45, 48, 0
