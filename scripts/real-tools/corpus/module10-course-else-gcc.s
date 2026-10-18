// Copyright © 2026 Christopher Snow
course_else:
sub     w3, w1, w0
sub     w2, w0, w1
lsl     w2, w2, 1
cmp     w0, w1
csel    w0, w2, w3, cs
ret
