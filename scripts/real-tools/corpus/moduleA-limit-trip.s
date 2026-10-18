// Copyright © 2026 Christopher Snow
limit_trip:
cmp w0, w1
csel w0, w0, w1, ls
ret
