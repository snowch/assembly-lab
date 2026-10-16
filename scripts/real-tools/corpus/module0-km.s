// Module 0: GCC 16.1.0 -O1 (carm64g1610), docs/notes/module-0/listings.md (m0c.c), unchanged: the
// five instructions of km_to_service, and the mistaken fuel_used the construction challenge fixes.
km_to_service:
  sub w0, w0, w1
  sub w0, w0, w2
  sub w0, w0, w3
  sub w0, w0, #50
  ret
fuel_used:
  sub w0, w1, w0
  ret
