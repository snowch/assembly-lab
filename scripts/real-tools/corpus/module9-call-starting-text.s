// Copyright © 2026 Christopher Snow
.text
report_once:
 bl half_distance
 add w0, w0, #1
 ret
half_distance:
 lsr w0, w0, #1
 ret
