// Copyright © 2026 Christopher Snow
copy_distance_reference:
ldr w0, [x0]
str w0, [x1]
ret
.data
sensor:
.byte 120,86,52,18,249,254,255,255,170,187,204,221,0,0,0,0
