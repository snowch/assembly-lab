// Module 4: GCC 16.1.0 -O1 (carm64g1610), docs/notes/module-4/listings.md, unchanged. `beep` is a stub that only lets maybe_beep run to its end; it is not GCC's.
steeper_s:
  cmp w1, w0
  csel w0, w1, w0, ge
  ret
steeper_u:
  cmp w1, w0
  csel w0, w1, w0, cs
  ret
fuel_low:
  cmp w0, w1
  cset w0, cc
  ret
downhill:
  lsr w0, w0, 31
  ret
service_due:
  ubfx x0, x0, 1, 1
  ret
warning_light:
  cmp w0, w1
  cset w0, cc
  ret
describe:
  cmp w0, 10
  bgt .L9
  cmn w0, #10
  mov w0, -2
  csel w0, w0, wzr, lt
.L7:
  ret
.L9:
  mov w0, 2
  b .L7
maybe_beep:
  cbz w0, .L17
  ret
.L17:
  stp x29, x30, [sp, -16]!
  mov x29, sp
  bl beep
  ldp x29, x30, [sp], 16
  ret
beep:
  ret
