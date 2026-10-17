// Copyright © 2026 Christopher Snow
read_sensors_reference:
ldrsb w1, [x0, #4]
ldrb w2, [x0, #5]
ldrh w3, [x0, #6]
ldr w0, [x0]
ret
.data
sensor:
.byte 120,86,52,18,249,254,255,255,170,187,204,221,0,0,0,0
