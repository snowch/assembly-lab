// Copyright © 2026 Christopher Snow
// Module 5: see docs/notes/module-5/listings.md for provenance.
dim_down:
  cbz w1, .L2
.L3:
  lsr w0, w0, 1
  subs w1, w1, #1
  bne .L3
.L2:
  ret
