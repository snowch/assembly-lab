// Module 1, one-pattern-three-readings: fuel_used_wrong (GCC 16.1.0 -O1, docs/notes/module-1/listings.md) with `add w0, w0, 12` before its ret, the program the lesson's prediction runs.
fuel_used_wrong:
  sub w0, w1, w0
  add w0, w0, 12
  ret
