// Copyright © 2026 Christopher Snow
adjust_gradient:
ldrsb w2, [x0]
add w0, w2, w1
ret
.data
sensor:
.byte 120,86,52,18,249,254,255,255,170,187,204,221,0,0,0,0
