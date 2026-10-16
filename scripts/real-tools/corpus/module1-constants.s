// Module 1, constants-and-widths: GCC 16.1.0 -O1 (carm64g1610), docs/notes/module-1/listings.md (service_interval, odometer_limit, no_reading, all_ones and no_reading_long), unchanged.
service_interval:
  mov w0, 30000
  ret
odometer_limit:
  mov w0, 16960
  movk w0, 0xf, lsl 16
  ret
no_reading:
  mov w0, -1
  ret
all_ones:
  mov w0, -1
  ret
no_reading_long:
  mov x0, -1
  ret
