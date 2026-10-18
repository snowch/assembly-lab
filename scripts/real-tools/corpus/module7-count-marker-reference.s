// Copyright © 2026 Christopher Snow
count_marker_reference:
mov x2, x0
mov w0, #0
loop:
ldrb w3, [x2], #1
cbz w3, done
cmp w3, w1
b.ne next
add w0, w0, #1
next:
b loop
done:
ret

.data
sensor:
.byte 65, 45, 66, 45, 67, 0, 88, 0, 0, 88, 65, 66, 67, 65, 0, 66, 67, 65, 0, 45, 45, 45, 45, 0, 48, 45, 48, 0
