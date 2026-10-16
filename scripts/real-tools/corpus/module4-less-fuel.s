// Module 4, compare-and-choose: less_fuel(a, b), the smaller of two unsigned values. The reference, the same with lo (the other spelling of cc), the signed lt that fails two of the five tests, hi that returns the larger, and the starting point.
less_fuel:
  cmp w0, w1
  csel w0, w0, w1, cc
  ret
less_fuel_lo:
  cmp w0, w1
  csel w0, w0, w1, lo
  ret
less_fuel_signed:
  cmp w0, w1
  csel w0, w0, w1, lt
  ret
less_fuel_hi:
  cmp w0, w1
  csel w0, w0, w1, hi
  ret
less_fuel_start:
  ret
