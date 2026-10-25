// Copyright © 2026 Christopher Snow
// Course-written first arithmetic activities; ret wraps each inspected prefix.
primitive_add:
add w2, w0, w1
ret
primitive_transfer:
add w1, w0, w2
ret
primitive_reuse:
add w0, w0, w1
ret
primitive_sub:
sub w1, w0, w1
ret
primitive_sequence:
add w2, w0, w1
sub w2, w2, w1
ret
primitive_constant:
add w2, w0, 1
ret
primitive_constant_reuse:
add w0, w0, 1
ret
primitive_constant_practice:
add w1, w0, 3
ret
