// Copyright © 2026 Christopher Snow
can_increment:
mov w1, 2147483647
cmp w0, w1
cset w0, ne
ret
