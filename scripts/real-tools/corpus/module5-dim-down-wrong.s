// Copyright © 2026 Christopher Snow
// Module 5: see docs/notes/module-5/listings.md for provenance.
dim_down_wrong:
.Lloop:
  lsr w0, w0, 1
  subs w1, w1, #1
  cmp w1, #0
  bcs .Lloop
  ret
