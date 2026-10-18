// Copyright © 2026 Christopher Snow
safe_increment_text:
mov w1, #2147483647
cmp w0, w1
b.eq done
add w0, w0, #1
done:
ret
