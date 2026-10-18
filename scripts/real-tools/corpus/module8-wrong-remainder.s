// Copyright © 2026 Christopher Snow
wrong_remainder:
  udiv w2, w0, w1
  msub w0, w2, w1, w0
  ret
