// Module 4, compare-and-choose: tst, ands and and on the warning word, cmp and cmn with no result, and one compare followed by a cset for every condition the lesson's figure shows (into w2 and on).
tst_service:
  tst w0, 2
  ret
ands_service:
  ands w1, w0, 2
  ret
and_service:
  and w1, w0, 2
  ret
ands_top:
  ands w1, w0, 0x80000000
  ret
cmp_const:
  cmp w0, 10
  ret
cmn_const:
  cmn w0, #10
  ret
cmp_cmn:
  cmp w0, w1
  cmn w0, w1
  ret
every_condition:
  cmp w0, w1
  cset w2, eq
  cset w3, ne
  cset w4, cs
  cset w5, cc
  cset w6, hi
  cset w7, ls
  cset w8, ge
  cset w9, lt
  cset w10, gt
  cset w11, le
  cset w12, vs
  ret
