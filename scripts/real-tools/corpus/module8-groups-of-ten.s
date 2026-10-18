// Copyright © 2026 Christopher Snow
groups_of_ten:
  mov w1, 52429
  movk w1, 0xcccc, lsl 16
  umull x0, w0, w1
  lsr x0, x0, 35
  ret
