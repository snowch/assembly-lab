// Copyright © 2026 Christopher Snow
increment_limit:
mov w1, 2147483647
cmp w0, w1
cset w0, eq
ret
