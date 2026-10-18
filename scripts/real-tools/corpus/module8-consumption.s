// Copyright © 2026 Christopher Snow
consumption:
  cbz w1, zero
  mov w2, #100
  umull x0, w0, w2
  mov w1, w1
  udiv x0, x0, x1
  ret
zero:
  mov x0, #0
  ret
