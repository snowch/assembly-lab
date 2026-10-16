// Module 4, compare-and-choose, the failure experiment: the recorded steeper_u with its last item changed from cs to ge.
steeper_u:
  cmp w1, w0
  csel w0, w1, w0, ge
  ret
