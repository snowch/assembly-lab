// Module 3, lesson 1: the reader's set_gear, the challenge's starting point, and the failure experiment.
set_gear_reference:
  and w1, w1, 7
  lsl w1, w1, 4
  and w0, w0, -113
  orr w0, w0, w1
  ret
set_gear_start:
  ret
set_gear_no_clear:
  and w1, w1, 7
  lsl w1, w1, 4
  orr w0, w0, w1
  ret
