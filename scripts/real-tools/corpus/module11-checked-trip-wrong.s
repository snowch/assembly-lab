// Copyright © 2026 Christopher Snow
checked_trip_wrong:
adds w0, w0, w1
str w0, [x2]
cset w0, cs
ret
.data
result:
.byte 170,187,204,221,17,34,51,68
