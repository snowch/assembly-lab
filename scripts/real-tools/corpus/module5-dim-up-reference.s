// Copyright © 2026 Christopher Snow
// Module 5: see docs/notes/module-5/listings.md for provenance.
dim_up_reference:
cmp w1, w2
b.cs done
again:
lsr w0, w0, #1
add w1, w1, #1
cmp w1, w2
b.cc again
done:
ret
