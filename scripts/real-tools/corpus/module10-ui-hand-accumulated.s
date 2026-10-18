// Copyright © 2026 Christopher Snow
hand_accumulated:
mov w2, w0
mov w0, #0
cbz w2, done
loop:
add w0, w0, w1
subs w2, w2, #1
b.ne loop
done:
ret
