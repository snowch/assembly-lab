// Copyright © 2026 Christopher Snow
wrong_terminator:
mov x2, x0
mov w0, #0
loop:
ldrb w3, [x2], #1
add w0, w0, #1
cbnz w3, loop
ret

.data
sensor:
.byte 65, 45, 66, 45, 67, 0, 88, 0, 0, 88, 65, 66, 67, 65, 0, 66, 67, 65, 0, 45, 45, 45, 45, 0, 48, 45, 48, 0
