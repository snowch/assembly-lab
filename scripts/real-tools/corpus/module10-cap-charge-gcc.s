// Copyright © 2026 Christopher Snow
cap_charge:
mul     w0, w0, w1
cmp     w0, w2
csel    w0, w0, w2, ls
ret
