// Module 4, branches, the failure experiment: the recorded describe with bgt .L9 changed to bge .L9.
describe:
  cmp w0, 10
  bge .L9
  cmn w0, #10
  mov w0, -2
  csel w0, w0, wzr, lt
.L7:
  ret
.L9:
  mov w0, 2
  b .L7
