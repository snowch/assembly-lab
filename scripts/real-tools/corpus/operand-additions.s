// Copyright © 2026 Christopher Snow
.text
.global add_scaled_register
add_scaled_register:
  add w2, w0, w1, lsl #1
  ret
.global add_scaled_constant
add_scaled_constant:
  add w2, w0, #1, lsl #12
  ret
