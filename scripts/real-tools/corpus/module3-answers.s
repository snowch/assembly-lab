// Module 3: the programs the answers challenges' graders run (never shown to the reader).
after_orr:
  orr w0, w0, 1
  ret
after_and:
  and w0, w0, -9
  ret
the_gear:
  ubfx x0, x0, 4, 3
  ret
asr_by_2:
  asr w0, w0, 2
  ret
lsr_by_2:
  lsr w0, w0, 2
  ret
div_by_4:
  mov w1, 4
  sdiv w0, w0, w1
  ret
