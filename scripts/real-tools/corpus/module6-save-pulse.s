// Copyright © 2026 Christopher Snow
save_pulse:
  strh w1, [x0]
  ret

.data
sensor:
  .byte 120, 86, 52, 18, 254, 128, 52, 242, 0, 127, 128, 255, 255, 255, 255, 255, 0, 0, 0, 0, 0, 0, 0, 128
