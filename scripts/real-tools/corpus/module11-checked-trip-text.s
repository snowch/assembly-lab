// Copyright © 2026 Christopher Snow
checked_trip_text:
adds w0, w0, w1
str w0, [x2]
cset w0, vs
ret
.data
result:
.byte 170,187,204,221,17,34,51,68
