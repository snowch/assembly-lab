// Module 3: GCC 16.1.0 -O1 (carm64g1610), docs/notes/module-3/listings.md, unchanged.
warn_fuel:
  orr w0, w0, 1
  ret
clear_door:
  and w0, w0, -5
  ret
service_due:
  ubfx x0, x0, 1, 1
  ret
gear_of:
  ubfx x0, x0, 4, 3
  ret
set_gear:
  bfi w0, w1, 4, 3
  ret
toggle_lights:
  eor w0, w0, 8
  ret
halve_gradient:
  asr w0, w0, 1
  ret
halve_count:
  lsr w0, w0, 1
  ret
div2:
  add w0, w0, w0, lsr 31
  asr w0, w0, 1
  ret
times8:
  lsl w0, w0, 3
  ret
shr3_int:
  asr w0, w0, 3
  ret
shr3_unsigned:
  lsr w0, w0, 3
  ret
shl3_int:
  lsl w0, w0, 3
  ret
shl3_unsigned:
  lsl w0, w0, 3
  ret
