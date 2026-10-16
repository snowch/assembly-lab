// Module 4, branches: fuel_warning(litres, reserve), the first reference (cbz, then cmp and b.cc), the starting point, and the same reference with the signed b.lt that fails the test with the top bit set.
fuel_warning:
  cbz w0, .Lempty
  cmp w0, w1
  b.cc .Llow
  mov w0, 0
  ret
.Llow:
  mov w0, 1
  ret
.Lempty:
  mov w0, 2
  ret
fuel_warning_start:
  mov w0, 0
  ret
fuel_warning_signed:
  cbz w0, .Lempty2
  cmp w0, w1
  b.lt .Llow2
  mov w0, 0
  ret
.Llow2:
  mov w0, 1
  ret
.Lempty2:
  mov w0, 2
  ret
