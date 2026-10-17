// Copyright © 2026 Christopher Snow
// Module 5: see docs/notes/module-5/listings.md for provenance.
dim_up:
  cmp w1, w2
  bcs .L2
.L3:
  lsr w0, w0, 1
  add w1, w1, 1
  cmp w2, w1
  bne .L3
.L2:
  ret
