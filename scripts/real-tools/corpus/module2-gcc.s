// Module 2: GCC 16.1.0 -O1 (carm64g1610), docs/notes/module-2/listings.md, unchanged.
elapsed:
  sub w0, w0, w1
  ret
tick_wrapped:
  cmp w0, w1
  cset w0, cc
  ret
sum_carried:
  add w1, w0, w1
  cmp w1, w0
  cset w0, cc
  ret
add_overflows:
  cmn w0, w1
  cset w0, vs
  ret
sub_overflows:
  subs w0, w0, w1
  cset w0, vs
  ret
negate:
  neg w0, w0
  ret
