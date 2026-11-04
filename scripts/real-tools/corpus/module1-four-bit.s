// Copyright © 2026 Christopher Snow
// Real 32-bit calculations behind the four-place mathematical views.
// The lesson displays only their low four columns; these are not four-bit Arm registers.
calculate_add:
  add w0, w0, w1
  ret
calculate_sub:
  sub w0, w0, w1
  ret
