// Module 4, branches: three other solutions to fuel_warning(litres, reserve) that pass its five tests: the empty case last in the file with b.lo for b.cc (_c), the compare first and then cbz (_d), and the compare the other way round with b.hi and a shared ret (_e). Each puts the check for 0 first; the labels are the learner's own.
fuel_warning_c:
  cbz w0, .Lempty_c
  cmp w0, w1
  b.lo .Llow_c
  mov w0, 0
  ret
.Lempty_c:
  mov w0, 2
  ret
.Llow_c:
  mov w0, 1
  ret
fuel_warning_d:
  cmp w0, w1
  cbz w0, .Lzero_d
  b.cs .Lenough_d
  mov w0, 1
  ret
.Lenough_d:
  mov w0, 0
  ret
.Lzero_d:
  mov w0, 2
  ret
fuel_warning_e:
  cbz w0, .Lnone_e
  cmp w1, w0
  b.hi .Lshort_e
  mov w0, 0
  b .Lend_e
.Lshort_e:
  mov w0, 1
  b .Lend_e
.Lnone_e:
  mov w0, 2
.Lend_e:
  ret
