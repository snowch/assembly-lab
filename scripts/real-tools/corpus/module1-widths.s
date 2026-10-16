// Module 1, constants-and-widths: the two programs no compiler made. `widths` is the figure's run (mov x3, -1 and then mov w3, -1); `four` is the last challenge's four instructions, with the ret the figure leaves out.
widths:
  mov x3, -1
  mov w3, -1
  ret
four:
  mov x1, -1
  mov w1, 5
  mov w2, 16960
  movk w2, 0xf, lsl 16
  ret
