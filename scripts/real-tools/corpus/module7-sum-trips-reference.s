// Copyright © 2026 Christopher Snow
sum_trips_reference:
mov x2, x0
mov w0, #0
cbz w1, done
loop:
ldr w3, [x2], #4
add w0, w0, w3
subs w1, w1, #1
b.ne loop
done:
ret

.data
sensor:
.byte 12, 0, 0, 0, 25, 0, 0, 0, 7, 0, 0, 0, 40, 0, 0, 0, 255, 255, 255, 255, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 255, 255, 0, 0, 0, 128
