// Module 4, branches: the second reference for fuel_warning, with b.cs and two b instructions to one ret.
fuel_warning:
  cbz w0, .Lempty
  cmp w0, w1
  b.cs .Lok
  mov w0, 1
  b .Ldone
.Lok:
  mov w0, 0
  b .Ldone
.Lempty:
  mov w0, 2
.Ldone:
  ret
