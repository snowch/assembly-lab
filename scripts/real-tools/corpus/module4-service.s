// Module 4, branches: the course's own service (tbz), and cbnz and tbnz in the same shape.
service:
  tbz w0, 1, .Lno
  mov w0, 1
  ret
.Lno:
  mov w0, 0
  ret
service_nz:
  tbnz w0, 1, .Lyes
  mov w0, 0
  ret
.Lyes:
  mov w0, 1
  ret
nonzero:
  cbnz w0, .Lnz
  mov w0, 0
  ret
.Lnz:
  mov w0, 1
  ret
