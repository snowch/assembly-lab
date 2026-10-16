// Module 0's failure experiment: m0b.c's listing with the ret of trip_distance deleted, so the run
// goes on into fuel_used (docs/notes/module-0-plan.md).
trip_distance:
  add w0, w0, w1
  add w0, w0, w2
  sub w0, w0, w3
fuel_used:
  sub w0, w0, w1
  ret
