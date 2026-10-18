// Copyright © 2026 Christopher Snow
safe_increment:
mov w1, 2147483647
cmp w0, w1
beq .L1
add w0, w0, 1
.L1:
ret
