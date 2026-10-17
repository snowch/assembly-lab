// Module 1, constants-and-widths, the improvement pass: programs no compiler made. `worked` is the halves figure's worked example (mov w0, 3, then movk w0, 2, lsl 16); `five` is the closing question (x5 all ones, then mov w5, 7); `movk_first` and `three_steps` are two other solutions of Build 1000000 that the solution stepper has to step correctly.
worked:
  mov w0, 3
  movk w0, 2, lsl 16
  ret
five:
  mov x5, -1
  mov w5, 7
  ret
movk_first:
  movk w0, 16960
  movk w0, 15, lsl 16
  ret
three_steps:
  mov w0, 1
  movk w0, 15, lsl 16
  movk w0, 16960
  ret
