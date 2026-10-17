// Copyright © 2026 Christopher Snow
// Module 5: see docs/notes/module-5/listings.md for provenance.
dim_until_dark_reference:
cbz w1, done
again:
cbz w0, done
lsr w0, w0, #1
subs w1, w1, #1
b.ne again
done:
ret
