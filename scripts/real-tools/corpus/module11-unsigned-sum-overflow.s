// Copyright © 2026 Christopher Snow
unsigned_sum_overflow:
add w1, w0, w1
cmp w1, w0
cset w0, cc
ret
