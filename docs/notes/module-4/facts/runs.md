# Module 4 facts: every number from running the course's own model

Model: `packages/machine` (`assemble`, `run`), run with `node --experimental-strip-types`.
Scripts: `lib.ts`, `facts.ts` in this directory. Listings are read from `docs/notes/module-4/listings.md`
(second code fence, C-line columns stripped) and assembled unchanged. For `maybe_beep` a stub `beep: ret`
is appended (not GCC's; it only lets the recorded function run). Arguments are 32-bit patterns (`w` registers).
NZCV = N, Z, C, V in that order, as the flags after the instruction named.

## 1. The recorded listing assembles unchanged

errors: 0; instructions in the whole listing (with the stub's 1): 32
Static instruction counts (lines that are instructions, not labels):
- steeper_s: 3
- steeper_u: 3
- fuel_low: 3
- downhill: 2
- warning_light: 3
- describe: 8
- maybe_beep: 7  (of which the first two are the cbz and ret; the rest, from .L17, is the call to beep)

## 2. steeper_s and steeper_u (recorded listing)

### steeper_s(0xffffffff, 1)
int reading: -1 and 1
```
call: steeper_s(0xffffffff, 0x1)   [args as 32-bit patterns]
w0=1 (0x1, signed 1), instructions run=3, stop=returned
  1. cmp     w1, w0  | flags after 0000
  2. csel    w0, w1, w0, ge  | flags after 0000
  3. ret  | flags after 0000 [branch TAKEN -> 0x440000]
```
### steeper_u(0xffffffff, 1)
unsigned reading: 4294967295 and 1
```
call: steeper_u(0xffffffff, 0x1)   [args as 32-bit patterns]
w0=4294967295 (0xffffffff, signed -1), instructions run=3, stop=returned
  1. cmp     w1, w0  | flags after 0000
  2. csel    w0, w1, w0, cs  | flags after 0000
  3. ret  | flags after 0000 [branch TAKEN -> 0x440000]
```
### steeper_s(3, 7)
```
call: steeper_s(0x3, 0x7)   [args as 32-bit patterns]
w0=7 (0x7, signed 7), instructions run=3, stop=returned
  1. cmp     w1, w0  | flags after 0010
  2. csel    w0, w1, w0, ge  | flags after 0010
  3. ret  | flags after 0010 [branch TAKEN -> 0x440000]
```
### steeper_u(3, 7)
```
call: steeper_u(0x3, 0x7)   [args as 32-bit patterns]
w0=7 (0x7, signed 7), instructions run=3, stop=returned
  1. cmp     w1, w0  | flags after 0010
  2. csel    w0, w1, w0, cs  | flags after 0010
  3. ret  | flags after 0010 [branch TAKEN -> 0x440000]
```
### steeper_s(7, 3)
```
call: steeper_s(0x7, 0x3)   [args as 32-bit patterns]
w0=7 (0x7, signed 7), instructions run=3, stop=returned
  1. cmp     w1, w0  | flags after 1000
  2. csel    w0, w1, w0, ge  | flags after 1000
  3. ret  | flags after 1000 [branch TAKEN -> 0x440000]
```
### steeper_u(7, 3)
```
call: steeper_u(0x7, 0x3)   [args as 32-bit patterns]
w0=7 (0x7, signed 7), instructions run=3, stop=returned
  1. cmp     w1, w0  | flags after 1000
  2. csel    w0, w1, w0, cs  | flags after 1000
  3. ret  | flags after 1000 [branch TAKEN -> 0x440000]
```
### steeper_s(5, 5)
```
call: steeper_s(0x5, 0x5)   [args as 32-bit patterns]
w0=5 (0x5, signed 5), instructions run=3, stop=returned
  1. cmp     w1, w0  | flags after 0110
  2. csel    w0, w1, w0, ge  | flags after 0110
  3. ret  | flags after 0110 [branch TAKEN -> 0x440000]
```
### steeper_s(0x80000000, 1)
int reading: -2147483648 and 1
```
call: steeper_s(0x80000000, 0x1)   [args as 32-bit patterns]
w0=1 (0x1, signed 1), instructions run=3, stop=returned
  1. cmp     w1, w0  | flags after 1001
  2. csel    w0, w1, w0, ge  | flags after 1001
  3. ret  | flags after 1001 [branch TAKEN -> 0x440000]
```
### steeper_u(0x80000000, 1)
```
call: steeper_u(0x80000000, 0x1)   [args as 32-bit patterns]
w0=2147483648 (0x80000000, signed -2147483648), instructions run=3, stop=returned
  1. cmp     w1, w0  | flags after 1001
  2. csel    w0, w1, w0, cs  | flags after 1001
  3. ret  | flags after 1001 [branch TAKEN -> 0x440000]
```
### steeper_s(-3, -8)
```
call: steeper_s(0xfffffffd, 0xfffffff8)   [args as 32-bit patterns]
w0=4294967293 (0xfffffffd, signed -3), instructions run=3, stop=returned
  1. cmp     w1, w0  | flags after 1000
  2. csel    w0, w1, w0, ge  | flags after 1000
  3. ret  | flags after 1000 [branch TAKEN -> 0x440000]
```
### steeper_u(-3, -8) i.e. 0xfffffffd, 0xfffffff8
```
call: steeper_u(0xfffffffd, 0xfffffff8)   [args as 32-bit patterns]
w0=4294967293 (0xfffffffd, signed -3), instructions run=3, stop=returned
  1. cmp     w1, w0  | flags after 1000
  2. csel    w0, w1, w0, cs  | flags after 1000
  3. ret  | flags after 1000 [branch TAKEN -> 0x440000]
```

## 3. fuel_low, warning_light, downhill (recorded listing)

### fuel_low(5, 8)
```
call: fuel_low(0x5, 0x8)   [args as 32-bit patterns]
w0=1 (0x1, signed 1), instructions run=3, stop=returned
  1. cmp     w0, w1  | flags after 1000
  2. cset    w0, cc  | flags after 1000
  3. ret  | flags after 1000 [branch TAKEN -> 0x440000]
```
### fuel_low(8, 8)
```
call: fuel_low(0x8, 0x8)   [args as 32-bit patterns]
w0=0 (0x0, signed 0), instructions run=3, stop=returned
  1. cmp     w0, w1  | flags after 0110
  2. cset    w0, cc  | flags after 0110
  3. ret  | flags after 0110 [branch TAKEN -> 0x440000]
```
### fuel_low(9, 8)
```
call: fuel_low(0x9, 0x8)   [args as 32-bit patterns]
w0=0 (0x0, signed 0), instructions run=3, stop=returned
  1. cmp     w0, w1  | flags after 0010
  2. cset    w0, cc  | flags after 0010
  3. ret  | flags after 0010 [branch TAKEN -> 0x440000]
```
### fuel_low(0, 8)
```
call: fuel_low(0x0, 0x8)   [args as 32-bit patterns]
w0=1 (0x1, signed 1), instructions run=3, stop=returned
  1. cmp     w0, w1  | flags after 1000
  2. cset    w0, cc  | flags after 1000
  3. ret  | flags after 1000 [branch TAKEN -> 0x440000]
```
### fuel_low(0x80000000, 8)
```
call: fuel_low(0x80000000, 0x8)   [args as 32-bit patterns]
w0=0 (0x0, signed 0), instructions run=3, stop=returned
  1. cmp     w0, w1  | flags after 0011
  2. cset    w0, cc  | flags after 0011
  3. ret  | flags after 0011 [branch TAKEN -> 0x440000]
```
### warning_light(5, 8)
```
call: warning_light(0x5, 0x8)   [args as 32-bit patterns]
w0=1 (0x1, signed 1), instructions run=3, stop=returned
  1. cmp     w0, w1  | flags after 1000
  2. cset    w0, cc  | flags after 1000
  3. ret  | flags after 1000 [branch TAKEN -> 0x440000]
```
### warning_light(8, 8)
```
call: warning_light(0x8, 0x8)   [args as 32-bit patterns]
w0=0 (0x0, signed 0), instructions run=3, stop=returned
  1. cmp     w0, w1  | flags after 0110
  2. cset    w0, cc  | flags after 0110
  3. ret  | flags after 0110 [branch TAKEN -> 0x440000]
```
### downhill(-3)
```
call: downhill(0xfffffffd)   [args as 32-bit patterns]
w0=1 (0x1, signed 1), instructions run=2, stop=returned
  1. lsr     w0, w0, 31  | flags after 0000
  2. ret  | flags after 0000 [branch TAKEN -> 0x440000]
```
### downhill(4)
```
call: downhill(0x4)   [args as 32-bit patterns]
w0=0 (0x0, signed 0), instructions run=2, stop=returned
  1. lsr     w0, w0, 31  | flags after 0000
  2. ret  | flags after 0000 [branch TAKEN -> 0x440000]
```
### downhill(0)
```
call: downhill(0x0)   [args as 32-bit patterns]
w0=0 (0x0, signed 0), instructions run=2, stop=returned
  1. lsr     w0, w0, 31  | flags after 0000
  2. ret  | flags after 0000 [branch TAKEN -> 0x440000]
```
### downhill(0x80000000)
```
call: downhill(0x80000000)   [args as 32-bit patterns]
w0=1 (0x1, signed 1), instructions run=2, stop=returned
  1. lsr     w0, w0, 31  | flags after 0000
  2. ret  | flags after 0000 [branch TAKEN -> 0x440000]
```
### downhill(0x7fffffff)
```
call: downhill(0x7fffffff)   [args as 32-bit patterns]
w0=0 (0x0, signed 0), instructions run=2, stop=returned
  1. lsr     w0, w0, 31  | flags after 0000
  2. ret  | flags after 0000 [branch TAKEN -> 0x440000]
```

## 4. describe (recorded listing)

### describe(15)
```
call: describe(0xf)   [args as 32-bit patterns]
w0=2 (0x2, signed 2), instructions run=5, stop=returned
  1. cmp     w0, 10  | flags after 0010
  2. bgt     .L9  | flags after 0010 [branch TAKEN -> 0x400058]
  3. mov     w0, 2  | flags after 0010
  4. b       .L7  | flags after 0010 [branch TAKEN -> 0x400054]
  5. ret  | flags after 0010 [branch TAKEN -> 0x440000]
```
### describe(11)
```
call: describe(0xb)   [args as 32-bit patterns]
w0=2 (0x2, signed 2), instructions run=5, stop=returned
  1. cmp     w0, 10  | flags after 0010
  2. bgt     .L9  | flags after 0010 [branch TAKEN -> 0x400058]
  3. mov     w0, 2  | flags after 0010
  4. b       .L7  | flags after 0010 [branch TAKEN -> 0x400054]
  5. ret  | flags after 0010 [branch TAKEN -> 0x440000]
```
### describe(10)
```
call: describe(0xa)   [args as 32-bit patterns]
w0=0 (0x0, signed 0), instructions run=6, stop=returned
  1. cmp     w0, 10  | flags after 0110
  2. bgt     .L9  | flags after 0110 [branch not taken -> 0x400058]
  3. cmn     w0, #10  | flags after 0000
  4. mov     w0, -2  | flags after 0000
  5. csel    w0, w0, wzr, lt  | flags after 0000
  6. ret  | flags after 0000 [branch TAKEN -> 0x440000]
```
### describe(0)
```
call: describe(0x0)   [args as 32-bit patterns]
w0=0 (0x0, signed 0), instructions run=6, stop=returned
  1. cmp     w0, 10  | flags after 1000
  2. bgt     .L9  | flags after 1000 [branch not taken -> 0x400058]
  3. cmn     w0, #10  | flags after 0000
  4. mov     w0, -2  | flags after 0000
  5. csel    w0, w0, wzr, lt  | flags after 0000
  6. ret  | flags after 0000 [branch TAKEN -> 0x440000]
```
### describe(-10)
```
call: describe(0xfffffff6)   [args as 32-bit patterns]
w0=0 (0x0, signed 0), instructions run=6, stop=returned
  1. cmp     w0, 10  | flags after 1010
  2. bgt     .L9  | flags after 1010 [branch not taken -> 0x400058]
  3. cmn     w0, #10  | flags after 0110
  4. mov     w0, -2  | flags after 0110
  5. csel    w0, w0, wzr, lt  | flags after 0110
  6. ret  | flags after 0110 [branch TAKEN -> 0x440000]
```
### describe(-11)
```
call: describe(0xfffffff5)   [args as 32-bit patterns]
w0=4294967294 (0xfffffffe, signed -2), instructions run=6, stop=returned
  1. cmp     w0, 10  | flags after 1010
  2. bgt     .L9  | flags after 1010 [branch not taken -> 0x400058]
  3. cmn     w0, #10  | flags after 1000
  4. mov     w0, -2  | flags after 1000
  5. csel    w0, w0, wzr, lt  | flags after 1000
  6. ret  | flags after 1000 [branch TAKEN -> 0x440000]
```
### describe(-15)
```
call: describe(0xfffffff1)   [args as 32-bit patterns]
w0=4294967294 (0xfffffffe, signed -2), instructions run=6, stop=returned
  1. cmp     w0, 10  | flags after 1010
  2. bgt     .L9  | flags after 1010 [branch not taken -> 0x400058]
  3. cmn     w0, #10  | flags after 1000
  4. mov     w0, -2  | flags after 1000
  5. csel    w0, w0, wzr, lt  | flags after 1000
  6. ret  | flags after 1000 [branch TAKEN -> 0x440000]
```
### describe(0x7fffffff)
```
call: describe(0x7fffffff)   [args as 32-bit patterns]
w0=2 (0x2, signed 2), instructions run=5, stop=returned
  1. cmp     w0, 10  | flags after 0010
  2. bgt     .L9  | flags after 0010 [branch TAKEN -> 0x400058]
  3. mov     w0, 2  | flags after 0010
  4. b       .L7  | flags after 0010 [branch TAKEN -> 0x400054]
  5. ret  | flags after 0010 [branch TAKEN -> 0x440000]
```
### describe(0x80000000)
```
call: describe(0x80000000)   [args as 32-bit patterns]
w0=4294967294 (0xfffffffe, signed -2), instructions run=6, stop=returned
  1. cmp     w0, 10  | flags after 0011
  2. bgt     .L9  | flags after 0011 [branch not taken -> 0x400058]
  3. cmn     w0, #10  | flags after 1000
  4. mov     w0, -2  | flags after 1000
  5. csel    w0, w0, wzr, lt  | flags after 1000
  6. ret  | flags after 1000 [branch TAKEN -> 0x440000]
```

## 5. maybe_beep (recorded listing + stub beep)

### maybe_beep(5)
```
call: maybe_beep(0x5)   [args as 32-bit patterns]
w0=5 (0x5, signed 5), instructions run=2, stop=returned
  1. cbz     w0, .L17  | flags after 0000 [branch not taken -> 0x400068]
  2. ret  | flags after 0000 [branch TAKEN -> 0x440000]
```
### maybe_beep(0) (first step only; the rest includes the stub)
```
  1. cbz     w0, .L17  | flags after 0000 [branch TAKEN -> 0x400068]
  2. stp     x29, x30, [sp, -16]!  | flags after 0000
address of .L17: 0x400068
total instructions run incl. stub beep's ret: 7; stop=returned
```

## 6. cmp keeps only the flags of subs; cmn only those of adds

- cmp w0, w1 with w0=0x5, w1=0x8: NZCV 1000; subs gives 1000; cmp wrote registers: none
- cmp w0, w1 with w0=0x8, w1=0x8: NZCV 0110; subs gives 0110; cmp wrote registers: none
- cmp w0, w1 with w0=0x9, w1=0x8: NZCV 0010; subs gives 0010; cmp wrote registers: none
- cmp w0, w1 with w0=0xffffffff, w1=0x1: NZCV 1010; subs gives 1010; cmp wrote registers: none
- cmp w0, w1 with w0=0x1, w1=0xffffffff: NZCV 0000; subs gives 0000; cmp wrote registers: none
- cmp w0, w1 with w0=0x80000000, w1=0x1: NZCV 0011; subs gives 0011; cmp wrote registers: none
- cmp w0, w1 with w0=0x7fffffff, w1=0xffffffff: NZCV 1001; subs gives 1001; cmp wrote registers: none
- cmp w0, w1 with w0=0xfffffffb, w1=0x2: NZCV 1010; subs gives 1010; cmp wrote registers: none
- cmp w0, w1 with w0=0x0, w1=0x0: NZCV 0110; subs gives 0110; cmp wrote registers: none
flags of cmp equal flags of subs on all pairs: true
- cmn w0, w1 with w0=0x5, w1=0x8: NZCV 0000; adds gives 0000
- cmn w0, w1 with w0=0x8, w1=0x8: NZCV 0000; adds gives 0000
- cmn w0, w1 with w0=0x9, w1=0x8: NZCV 0000; adds gives 0000
- cmn w0, w1 with w0=0xffffffff, w1=0x1: NZCV 0110; adds gives 0110
- cmn w0, w1 with w0=0x1, w1=0xffffffff: NZCV 0110; adds gives 0110
- cmn w0, w1 with w0=0x80000000, w1=0x1: NZCV 1000; adds gives 1000
- cmn w0, w1 with w0=0x7fffffff, w1=0xffffffff: NZCV 0010; adds gives 0010
- cmn w0, w1 with w0=0xfffffffb, w1=0x2: NZCV 1000; adds gives 1000
- cmn w0, w1 with w0=0x0, w1=0x0: NZCV 0100; adds gives 0100
flags of cmn equal flags of adds on all pairs: true

cmn w0, #10 versus cmp w0, -10 (the assembler's own rewrite is [gas] per docs/machine.md; checked here that the model accepts both and that the flags agree):
- w0=-15: cmn w0, #10 -> 1000; cmp w0, -10 -> 1000
- w0=-11: cmn w0, #10 -> 1000; cmp w0, -10 -> 1000
- w0=-10: cmn w0, #10 -> 0110; cmp w0, -10 -> 0110
- w0=-9: cmn w0, #10 -> 0010; cmp w0, -10 -> 0010
- w0=0: cmn w0, #10 -> 0000; cmp w0, -10 -> 0000
- w0=10: cmn w0, #10 -> 0000; cmp w0, -10 -> 0000
- w0=2147483647: cmn w0, #10 -> 1001; cmp w0, -10 -> 1001
- w0=-2147483648: cmn w0, #10 -> 1000; cmp w0, -10 -> 1000
the trace text of "cmp w0, -10" is: "cmp w0, -10"

## 7. The conditions: truth over all sixteen flag settings, and which flags each one reads

Definitions on the left are the Arm condition table as stated in the brief (from the Arm ARM's condition-code table; the manual was not reachable, see report); the model column is `cset w0, <cond>` run with those flags.

- eq: model agrees with the table on all 16 settings: true; flags the model's result depends on: Z; true for NZCV in {0100, 0101, 0110, 0111, 1100, 1101, 1110, 1111}
- ne: model agrees with the table on all 16 settings: true; flags the model's result depends on: Z; true for NZCV in {0000, 0001, 0010, 0011, 1000, 1001, 1010, 1011}
- cs: model agrees with the table on all 16 settings: true; flags the model's result depends on: C; true for NZCV in {0010, 0011, 0110, 0111, 1010, 1011, 1110, 1111}
- hs: model agrees with the table on all 16 settings: true; flags the model's result depends on: C; true for NZCV in {0010, 0011, 0110, 0111, 1010, 1011, 1110, 1111}
- cc: model agrees with the table on all 16 settings: true; flags the model's result depends on: C; true for NZCV in {0000, 0001, 0100, 0101, 1000, 1001, 1100, 1101}
- lo: model agrees with the table on all 16 settings: true; flags the model's result depends on: C; true for NZCV in {0000, 0001, 0100, 0101, 1000, 1001, 1100, 1101}
- mi: model agrees with the table on all 16 settings: true; flags the model's result depends on: N; true for NZCV in {1000, 1001, 1010, 1011, 1100, 1101, 1110, 1111}
- pl: model agrees with the table on all 16 settings: true; flags the model's result depends on: N; true for NZCV in {0000, 0001, 0010, 0011, 0100, 0101, 0110, 0111}
- vs: model agrees with the table on all 16 settings: true; flags the model's result depends on: V; true for NZCV in {0001, 0011, 0101, 0111, 1001, 1011, 1101, 1111}
- vc: model agrees with the table on all 16 settings: true; flags the model's result depends on: V; true for NZCV in {0000, 0010, 0100, 0110, 1000, 1010, 1100, 1110}
- hi: model agrees with the table on all 16 settings: true; flags the model's result depends on: ZC; true for NZCV in {0010, 0011, 1010, 1011}
- ls: model agrees with the table on all 16 settings: true; flags the model's result depends on: ZC; true for NZCV in {0000, 0001, 0100, 0101, 0110, 0111, 1000, 1001, 1100, 1101, 1110, 1111}
- ge: model agrees with the table on all 16 settings: true; flags the model's result depends on: NV; true for NZCV in {0000, 0010, 0100, 0110, 1001, 1011, 1101, 1111}
- lt: model agrees with the table on all 16 settings: true; flags the model's result depends on: NV; true for NZCV in {0001, 0011, 0101, 0111, 1000, 1010, 1100, 1110}
- gt: model agrees with the table on all 16 settings: true; flags the model's result depends on: NZV; true for NZCV in {0000, 0010, 1001, 1011}
- le: model agrees with the table on all 16 settings: true; flags the model's result depends on: NZV; true for NZCV in {0001, 0011, 0100, 0101, 0110, 0111, 1000, 1010, 1100, 1101, 1110, 1111}

## 8. Why ge reads V as well as N

### cmp w0, w1 with w0=0x80000000 (-2147483648), w1=1, then cset lt / cset ge
```
call: f(0x80000000, 0x1)   [args as 32-bit patterns]
w0=2147483648 (0x80000000, signed -2147483648), instructions run=6, stop=returned
  1. cmp w0, w1  | flags after 0011
  2. cset w2, lt  | flags after 0011
  3. cset w3, ge  | flags after 0011
  4. cset w4, cc  | flags after 0011
  5. cset w5, mi  | flags after 0011
  6. ret  | flags after 0011 [branch TAKEN -> 0x440000]
```
x2 (lt)=1, x3 (ge)=0, x4 (cc)=0, x5 (mi)=0
### cmp w0, w1 with w0=0x7fffffff, w1=0xffffffff (-1)
```
call: f(0x7fffffff, 0xffffffff)   [args as 32-bit patterns]
w0=2147483647 (0x7fffffff, signed 2147483647), instructions run=6, stop=returned
  1. cmp w0, w1  | flags after 1001
  2. cset w2, lt  | flags after 1001
  3. cset w3, ge  | flags after 1001
  4. cset w4, cc  | flags after 1001
  5. cset w5, cs  | flags after 1001
  6. ret  | flags after 1001 [branch TAKEN -> 0x440000]
```
x2 (lt)=0, x3 (ge)=1, x4 (cc)=1, x5 (cs)=0

## 9. At equality: which conditions hold after cmp of equal values

cmp w0, w1 with 8 and 8: NZCV 0110
eq,ne,ge,gt,le,lt,cs,hi,ls,cc = 1,0,1,0,1,0,1,0,1,0

## 10. tst and ands (architecture only: no recorded listing in this module uses them)

- tst w0, 2 with w0=0x2a: NZCV 0000; registers written: 0
- tst w0, 2 with w0=0x28: NZCV 0100; registers written: 0
- tst w0, 128 with w0=0x2a: NZCV 0100; registers written: 0
- ands w1, w0, 2 with w0=0x2a: x1=2, NZCV 0000
- ands w1, w0, 0x80000000 with w0=0xf0000000: x1=0x80000000, NZCV 1000  (N from result, C and V cleared)
- and (no s) leaves flags: start NZCV 1111, after and: 1111

## 11. cbz, cbnz, tbz, tbnz (own programs, not GCC's; no recorded listing here uses cbnz/tbz/tbnz)

### tbz example: service(0x2a)
```
call: service(0x2a)   [args as 32-bit patterns]
w0=1 (0x1, signed 1), instructions run=3, stop=returned
  1. tbz w0, 1, .Lno  | flags after 0000 [branch not taken -> 0x40000c]
  2. mov w0, 1  | flags after 0000
  3. ret  | flags after 0000 [branch TAKEN -> 0x440000]
```
### tbz example: service(0x28)
```
call: service(0x28)   [args as 32-bit patterns]
w0=0 (0x0, signed 0), instructions run=3, stop=returned
  1. tbz w0, 1, .Lno  | flags after 0000 [branch TAKEN -> 0x40000c]
  2. mov w0, 0  | flags after 0000
  3. ret  | flags after 0000 [branch TAKEN -> 0x440000]
```
### cbnz example: nz(7)
```
call: nz(0x7)   [args as 32-bit patterns]
w0=1 (0x1, signed 1), instructions run=3, stop=returned
  1. cbnz w0, .Lyes  | flags after 0000 [branch TAKEN -> 0x400020]
  2. mov w0, 1  | flags after 0000
  3. ret  | flags after 0000 [branch TAKEN -> 0x440000]
```
### cbnz example: nz(0)
```
call: nz(0x0)   [args as 32-bit patterns]
w0=0 (0x0, signed 0), instructions run=3, stop=returned
  1. cbnz w0, .Lyes  | flags after 0000 [branch not taken -> 0x400020]
  2. mov w0, 0  | flags after 0000
  3. ret  | flags after 0000 [branch TAKEN -> 0x440000]
```
cbz does not change the flags: start flags 0000, after cbz 0000
cbz with flags 1111 at start: after cbz 1111

## 12. Lesson 1 failure experiment: steeper_u with its condition changed from cs to ge

### steeper_u with ge on (0xffffffff, 1)
```
call: steeper_u_ge(0xffffffff, 0x1)   [args as 32-bit patterns]
w0=1 (0x1, signed 1), instructions run=3, stop=returned
  1. cmp w1, w0  | flags after 0000
  2. csel w0, w1, w0, ge  | flags after 0000
  3. ret  | flags after 0000 [branch TAKEN -> 0x440000]
```
### steeper_u with ge on (3, 7)
```
call: steeper_u_ge(0x3, 0x7)   [args as 32-bit patterns]
w0=7 (0x7, signed 7), instructions run=3, stop=returned
  1. cmp w1, w0  | flags after 0010
  2. csel w0, w1, w0, ge  | flags after 0010
  3. ret  | flags after 0010 [branch TAKEN -> 0x440000]
```
### steeper_s with cs on (0xffffffff, 1)
```
call: steeper_s_cs(0xffffffff, 0x1)   [args as 32-bit patterns]
w0=4294967295 (0xffffffff, signed -1), instructions run=3, stop=returned
  1. cmp w1, w0  | flags after 0000
  2. csel w0, w1, w0, cs  | flags after 0000
  3. ret  | flags after 0000 [branch TAKEN -> 0x440000]
```

## 13. Lesson 1 construction: less_fuel(a, b), the smaller of two unsigned values (gate: cmp, csel, ret)

#### reference (lo)  -- assembles under gate {cmp, csel, ret}: true
```
less_fuel:
 cmp w0, w1
 csel w0, w0, w1, lo
 ret
```
- less_fuel(0x3, 0x7) expect 0x3 got 0x3 (pass), instructions run 3, cmp NZCV 1000
- less_fuel(0x7, 0x3) expect 0x3 got 0x3 (pass), instructions run 3, cmp NZCV 0010
- less_fuel(0x5, 0x5) expect 0x5 got 0x5 (pass), instructions run 3, cmp NZCV 0110
- less_fuel(0x80000000, 0x1) expect 0x1 got 0x1 (pass), instructions run 3, cmp NZCV 0011
- less_fuel(0x1, 0x80000000) expect 0x1 got 0x1 (pass), instructions run 3, cmp NZCV 1001
#### wrong: signed lt  -- assembles under gate {cmp, csel, ret}: true
```
less_fuel:
 cmp w0, w1
 csel w0, w0, w1, lt
 ret
```
- less_fuel(0x3, 0x7) expect 0x3 got 0x3 (pass), instructions run 3, cmp NZCV 1000
- less_fuel(0x7, 0x3) expect 0x3 got 0x3 (pass), instructions run 3, cmp NZCV 0010
- less_fuel(0x5, 0x5) expect 0x5 got 0x5 (pass), instructions run 3, cmp NZCV 0110
- less_fuel(0x80000000, 0x1) expect 0x1 got 0x80000000 (FAIL), instructions run 3, cmp NZCV 0011
- less_fuel(0x1, 0x80000000) expect 0x1 got 0x80000000 (FAIL), instructions run 3, cmp NZCV 1001
#### wrong: hi (returns the larger)  -- assembles under gate {cmp, csel, ret}: true
```
less_fuel:
 cmp w0, w1
 csel w0, w0, w1, hi
 ret
```
- less_fuel(0x3, 0x7) expect 0x3 got 0x7 (FAIL), instructions run 3, cmp NZCV 1000
- less_fuel(0x7, 0x3) expect 0x3 got 0x7 (FAIL), instructions run 3, cmp NZCV 0010
- less_fuel(0x5, 0x5) expect 0x5 got 0x5 (pass), instructions run 3, cmp NZCV 0110
- less_fuel(0x80000000, 0x1) expect 0x1 got 0x80000000 (FAIL), instructions run 3, cmp NZCV 0011
- less_fuel(0x1, 0x80000000) expect 0x1 got 0x80000000 (FAIL), instructions run 3, cmp NZCV 1001
#### starting point (just ret)  -- assembles under gate {cmp, csel, ret}: true
```
less_fuel:
 ret
```
- less_fuel(0x3, 0x7) expect 0x3 got 0x3 (pass), instructions run 1, cmp NZCV n/a
- less_fuel(0x7, 0x3) expect 0x3 got 0x7 (FAIL), instructions run 1, cmp NZCV n/a
- less_fuel(0x5, 0x5) expect 0x5 got 0x5 (pass), instructions run 1, cmp NZCV n/a
- less_fuel(0x80000000, 0x1) expect 0x1 got 0x80000000 (FAIL), instructions run 1, cmp NZCV n/a
- less_fuel(0x1, 0x80000000) expect 0x1 got 0x1 (pass), instructions run 1, cmp NZCV n/a
a program using cset under the gate: errors 1 (gate.notYet)
cmp w0, w1 reads (w0 - w1): csel w0, w0, w1, lo gives w0 when w0 is lower (unsigned), else w1.

## 14. Lesson 1 challenge: which of ge, cs, lt, cc hold after cmp w0, w1

- w0=0xfffffffb (signed -5, unsigned 4294967291), w1=0x2 (signed 2, unsigned 2): cmp NZCV 1010; ge=0 cs=1 lt=1 cc=0
- w0=0x2 (signed 2, unsigned 2), w1=0xfffffffb (signed -5, unsigned 4294967291): cmp NZCV 0000; ge=1 cs=0 lt=0 cc=1
- w0=0x7fffffff (signed 2147483647, unsigned 2147483647), w1=0xffffffff (signed -1, unsigned 4294967295): cmp NZCV 1001; ge=1 cs=0 lt=0 cc=1

## 15. Lesson 2 failure-experiment candidates

describe with the line 'b .L7' deleted assembles: true
```
describe(15) without b .L7: w0=2, steps=5, stop={"kind":"returned"}
  1. cmp     w0, 10  | flags after 0010
  2. bgt     .L9  | flags after 0010 [branch TAKEN -> 0x400058]
  3. mov     w0, 2  | flags after 0010
  4. cbz     w0, .L17  | flags after 0010 [branch not taken -> 0x400064]
  5. ret  | flags after 0010 [branch TAKEN -> 0x440000]
```
### describe with bge in place of bgt, g=11
```
call: describe(0xb)   [args as 32-bit patterns]
w0=2 (0x2, signed 2), instructions run=5, stop=returned
  1. cmp     w0, 10  | flags after 0010
  2. bge     .L9  | flags after 0010 [branch TAKEN -> 0x400058]
  3. mov     w0, 2  | flags after 0010
  4. b       .L7  | flags after 0010 [branch TAKEN -> 0x400054]
  5. ret  | flags after 0010 [branch TAKEN -> 0x440000]
```
### describe with bge in place of bgt, g=10
```
call: describe(0xa)   [args as 32-bit patterns]
w0=2 (0x2, signed 2), instructions run=5, stop=returned
  1. cmp     w0, 10  | flags after 0110
  2. bge     .L9  | flags after 0110 [branch TAKEN -> 0x400058]
  3. mov     w0, 2  | flags after 0110
  4. b       .L7  | flags after 0110 [branch TAKEN -> 0x400054]
  5. ret  | flags after 0110 [branch TAKEN -> 0x440000]
```
### describe with bge in place of bgt, g=9
```
call: describe(0x9)   [args as 32-bit patterns]
w0=0 (0x0, signed 0), instructions run=6, stop=returned
  1. cmp     w0, 10  | flags after 1000
  2. bge     .L9  | flags after 1000 [branch not taken -> 0x400058]
  3. cmn     w0, #10  | flags after 0000
  4. mov     w0, -2  | flags after 0000
  5. csel    w0, w0, wzr, lt  | flags after 0000
  6. ret  | flags after 0000 [branch TAKEN -> 0x440000]
```
### describe with bhi in place of bgt, g=15
```
call: describe(0xf)   [args as 32-bit patterns]
w0=2 (0x2, signed 2), instructions run=5, stop=returned
  1. cmp     w0, 10  | flags after 0010
  2. bhi     .L9  | flags after 0010 [branch TAKEN -> 0x400058]
  3. mov     w0, 2  | flags after 0010
  4. b       .L7  | flags after 0010 [branch TAKEN -> 0x400054]
  5. ret  | flags after 0010 [branch TAKEN -> 0x440000]
```
### describe with bhi in place of bgt, g=-15
```
call: describe(0xfffffff1)   [args as 32-bit patterns]
w0=2 (0x2, signed 2), instructions run=5, stop=returned
  1. cmp     w0, 10  | flags after 1010
  2. bhi     .L9  | flags after 1010 [branch TAKEN -> 0x400058]
  3. mov     w0, 2  | flags after 1010
  4. b       .L7  | flags after 1010 [branch TAKEN -> 0x400054]
  5. ret  | flags after 1010 [branch TAKEN -> 0x440000]
```

## 16. Lesson 2 construction: fuel_warning(litres, reserve) (gate: cmp, b.cond, cbz, b, mov, ret)

Tests: fuel_warning(0x0, 0xa) = 2; fuel_warning(0x9, 0xa) = 1; fuel_warning(0xa, 0xa) = 0; fuel_warning(0xc8, 0xa) = 0; fuel_warning(0x80000000, 0xa) = 0
#### reference A (cbz, cmp, b.lo; no b) -- assembles under the gate: true
```
fuel_warning:
  cbz w0, .Lempty
  cmp w0, w1
  b.lo .Llow
  mov w0, 0
  ret
.Llow:
  mov w0, 1
  ret
.Lempty:
  mov w0, 2
  ret
```
- fuel_warning(0x0, 0xa) expect 2 got 2 (pass); instructions run 3; no cmp run; stop=returned
- fuel_warning(0x9, 0xa) expect 1 got 1 (pass); instructions run 5; cmp NZCV 1000; stop=returned
- fuel_warning(0xa, 0xa) expect 0 got 0 (pass); instructions run 5; cmp NZCV 0110; stop=returned
- fuel_warning(0xc8, 0xa) expect 0 got 0 (pass); instructions run 5; cmp NZCV 0010; stop=returned
- fuel_warning(0x80000000, 0xa) expect 0 got 0 (pass); instructions run 5; cmp NZCV 0011; stop=returned
  => 0 failing of 5
#### reference B (cbz, cmp, b.cs, uses b) -- assembles under the gate: true
```
fuel_warning:
  cbz w0, .Lempty
  cmp w0, w1
  b.cs .Lok
  mov w0, 1
  b .Ldone
.Lok:
  mov w0, 0
  b .Ldone
.Lempty:
  mov w0, 2
.Ldone:
  ret
```
- fuel_warning(0x0, 0xa) expect 2 got 2 (pass); instructions run 3; no cmp run; stop=returned
- fuel_warning(0x9, 0xa) expect 1 got 1 (pass); instructions run 6; cmp NZCV 1000; stop=returned
- fuel_warning(0xa, 0xa) expect 0 got 0 (pass); instructions run 6; cmp NZCV 0110; stop=returned
- fuel_warning(0xc8, 0xa) expect 0 got 0 (pass); instructions run 6; cmp NZCV 0010; stop=returned
- fuel_warning(0x80000000, 0xa) expect 0 got 0 (pass); instructions run 6; cmp NZCV 0011; stop=returned
  => 0 failing of 5
#### reference A spelled blo (GCC spelling) -- assembles under the gate: true
```
fuel_warning:
  cbz w0, .Lempty
  cmp w0, w1
  blo .Llow
  mov w0, 0
  ret
.Llow:
  mov w0, 1
  ret
.Lempty:
  mov w0, 2
  ret
```
- fuel_warning(0x0, 0xa) expect 2 got 2 (pass); instructions run 3; no cmp run; stop=returned
- fuel_warning(0x9, 0xa) expect 1 got 1 (pass); instructions run 5; cmp NZCV 1000; stop=returned
- fuel_warning(0xa, 0xa) expect 0 got 0 (pass); instructions run 5; cmp NZCV 0110; stop=returned
- fuel_warning(0xc8, 0xa) expect 0 got 0 (pass); instructions run 5; cmp NZCV 0010; stop=returned
- fuel_warning(0x80000000, 0xa) expect 0 got 0 (pass); instructions run 5; cmp NZCV 0011; stop=returned
  => 0 failing of 5
#### WRONG: signed condition b.lt -- assembles under the gate: true
```
fuel_warning:
  cbz w0, .Lempty
  cmp w0, w1
  b.lt .Llow
  mov w0, 0
  ret
.Llow:
  mov w0, 1
  ret
.Lempty:
  mov w0, 2
  ret
```
- fuel_warning(0x0, 0xa) expect 2 got 2 (pass); instructions run 3; no cmp run; stop=returned
- fuel_warning(0x9, 0xa) expect 1 got 1 (pass); instructions run 5; cmp NZCV 1000; stop=returned
- fuel_warning(0xa, 0xa) expect 0 got 0 (pass); instructions run 5; cmp NZCV 0110; stop=returned
- fuel_warning(0xc8, 0xa) expect 0 got 0 (pass); instructions run 5; cmp NZCV 0010; stop=returned
- fuel_warning(0x80000000, 0xa) expect 0 got 1 (FAIL); instructions run 5; cmp NZCV 0011; stop=returned
  => 1 failing of 5
#### WRONG: b.ls (at-or-below) -- assembles under the gate: true
```
fuel_warning:
  cbz w0, .Lempty
  cmp w0, w1
  b.ls .Llow
  mov w0, 0
  ret
.Llow:
  mov w0, 1
  ret
.Lempty:
  mov w0, 2
  ret
```
- fuel_warning(0x0, 0xa) expect 2 got 2 (pass); instructions run 3; no cmp run; stop=returned
- fuel_warning(0x9, 0xa) expect 1 got 1 (pass); instructions run 5; cmp NZCV 1000; stop=returned
- fuel_warning(0xa, 0xa) expect 0 got 1 (FAIL); instructions run 5; cmp NZCV 0110; stop=returned
- fuel_warning(0xc8, 0xa) expect 0 got 0 (pass); instructions run 5; cmp NZCV 0010; stop=returned
- fuel_warning(0x80000000, 0xa) expect 0 got 0 (pass); instructions run 5; cmp NZCV 0011; stop=returned
  => 1 failing of 5
#### WRONG: cmp tested before cbz -- assembles under the gate: true
```
fuel_warning:
  cmp w0, w1
  b.lo .Llow
  cbz w0, .Lempty
  mov w0, 0
  ret
.Llow:
  mov w0, 1
  ret
.Lempty:
  mov w0, 2
  ret
```
- fuel_warning(0x0, 0xa) expect 2 got 1 (FAIL); instructions run 4; cmp NZCV 1000; stop=returned
- fuel_warning(0x9, 0xa) expect 1 got 1 (pass); instructions run 4; cmp NZCV 1000; stop=returned
- fuel_warning(0xa, 0xa) expect 0 got 0 (pass); instructions run 5; cmp NZCV 0110; stop=returned
- fuel_warning(0xc8, 0xa) expect 0 got 0 (pass); instructions run 5; cmp NZCV 0010; stop=returned
- fuel_warning(0x80000000, 0xa) expect 0 got 0 (pass); instructions run 5; cmp NZCV 0011; stop=returned
  => 1 failing of 5
#### starting point (mov w0, 0; ret) -- assembles under the gate: true
```
fuel_warning:
  mov w0, 0
  ret
```
- fuel_warning(0x0, 0xa) expect 2 got 0 (FAIL); instructions run 2; no cmp run; stop=returned
- fuel_warning(0x9, 0xa) expect 1 got 0 (FAIL); instructions run 2; no cmp run; stop=returned
- fuel_warning(0xa, 0xa) expect 0 got 0 (pass); instructions run 2; no cmp run; stop=returned
- fuel_warning(0xc8, 0xa) expect 0 got 0 (pass); instructions run 2; no cmp run; stop=returned
- fuel_warning(0x80000000, 0xa) expect 0 got 0 (pass); instructions run 2; no cmp run; stop=returned
  => 2 failing of 5
- under the gate, "cset w0, lo": errors gate.notYet
- under the gate, "tbz w0, 3, .Lx": errors gate.notYet
- under the gate, "csel w0, w0, w1, lo": errors gate.notYet
- under the gate, "bl fuel_warning": errors gate.notYet
- blo under gate accepted: true
- 'b' alone under gate (ref B) accepted: true

## 17. Lesson 2 challenge candidates: describe, instructions run

- describe(11) = 2; instructions run 5; bgt taken; cmp NZCV 0010
- describe(-11) = -2; instructions run 6; bgt not taken; cmp NZCV 1010
- describe(10) = 0; instructions run 6; bgt not taken; cmp NZCV 0110
- describe(-10) = 0; instructions run 6; bgt not taken; cmp NZCV 1010
- describe(12) = 2; instructions run 5; bgt taken; cmp NZCV 0010
- describe(-12) = -2; instructions run 6; bgt not taken; cmp NZCV 1010

## 18. Additions (second script, facts2.ts)

### L1 failure experiment: steeper_u with ge, (0x80000000, 1)
```
call: steeper_u_ge(0x80000000, 0x1)
w0=1 (0x1, signed 1), instructions run=3, stop=returned
  1. cmp w1, w0  | flags after 1001
  2. csel w0, w1, w0, ge  | flags after 1001
  3. ret  | flags after 1001 [branch TAKEN -> 0x440000]
```
### steeper_u as recorded, (0x80000000, 1)
```
call: steeper_u(0x80000000, 0x1)
w0=2147483648 (0x80000000, signed -2147483648), instructions run=3, stop=returned
  1. cmp     w1, w0  | flags after 1001
  2. csel    w0, w1, w0, cs  | flags after 1001
  3. ret  | flags after 1001 [branch TAKEN -> 0x440000]
```
### L1 failure experiment alt: steeper_u with ge, (0xffffffff, 2)
```
call: steeper_u_ge(0xffffffff, 0x2)
w0=2 (0x2, signed 2), instructions run=3, stop=returned
  1. cmp w1, w0  | flags after 0000
  2. csel w0, w1, w0, ge  | flags after 0000
  3. ret  | flags after 0000 [branch TAKEN -> 0x440000]
```
### describe assembled alone: addresses
```
0x400000  cmp     w0, 10
0x400004  bgt     .L9
0x400008  cmn     w0, #10
0x40000c  mov     w0, -2
0x400010  csel    w0, w0, wzr, lt
0x400014  ret
0x400018  mov     w0, 2
0x40001c  b       .L7
symbols: describe=0x400000, .L7=0x400014, .L9=0x400018
```
### describe alone, g=15
```
call: describe(0xf)
w0=2 (0x2, signed 2), instructions run=5, stop=returned
  1. cmp     w0, 10  | flags after 0010
  2. bgt     .L9  | flags after 0010 [branch TAKEN -> 0x400018]
  3. mov     w0, 2  | flags after 0010
  4. b       .L7  | flags after 0010 [branch TAKEN -> 0x400014]
  5. ret  | flags after 0010 [branch TAKEN -> 0x440000]
```
### describe alone, g=10
```
call: describe(0xa)
w0=0 (0x0, signed 0), instructions run=6, stop=returned
  1. cmp     w0, 10  | flags after 0110
  2. bgt     .L9  | flags after 0110 [branch not taken -> 0x400018]
  3. cmn     w0, #10  | flags after 0000
  4. mov     w0, -2  | flags after 0000
  5. csel    w0, w0, wzr, lt  | flags after 0000
  6. ret  | flags after 0000 [branch TAKEN -> 0x440000]
```
csel w0, w1, wzr, eq with Z=0, w1=99: w0=0 ; with Z=1: 99
flags after cmp 1000; after mov 1000
cmp 4,4 NZCV 0110: cset eq=1 cset ne=0 csel eq picks w0=4
### cmp w0, 10 with w0 = 10
```
call: f(0xa)
w0=10 (0xa, signed 10), instructions run=2, stop=returned
  1. cmp w0, 10  | flags after 0110
  2. ret  | flags after 0110 [branch TAKEN -> 0x440000]
```

## 19. After cmp a, b, which conditions hold: checked against C's own comparisons on 17 x 17 pairs of 32-bit patterns

condition results checked: 2890; mismatches: 0. Meaning: after cmp a, b: eq a=b; ne a!=b; hs/cs unsigned a>=b; lo/cc unsigned a<b; hi unsigned a>b; ls unsigned a<=b; ge/lt/gt/le the signed relations.
in every one of the 16 flag settings exactly one of each pair holds (eq/ne, hs/lo, hi/ls, ge/lt, gt/le): true

## 20. Final reference solutions, written with GCC's names for the unsigned conditions (cc, cs)

#### less_fuel reference (cc) -- assembles under the gate: true
```
less_fuel:
  cmp w0, w1
  csel w0, w0, w1, cc
  ret
```
- less_fuel(0x3, 0x7) expect 0x3 got 0x3 (pass); instructions run 3; cmp NZCV 1000
- less_fuel(0x7, 0x3) expect 0x3 got 0x3 (pass); instructions run 3; cmp NZCV 0010
- less_fuel(0x5, 0x5) expect 0x5 got 0x5 (pass); instructions run 3; cmp NZCV 0110
- less_fuel(0x80000000, 0x1) expect 0x1 got 0x1 (pass); instructions run 3; cmp NZCV 0011
- less_fuel(0x1, 0x80000000) expect 0x1 got 0x1 (pass); instructions run 3; cmp NZCV 1001
  => 0 failing of 5
#### less_fuel WRONG (lt, signed) -- assembles under the gate: true
```
less_fuel:
  cmp w0, w1
  csel w0, w0, w1, lt
  ret
```
- less_fuel(0x3, 0x7) expect 0x3 got 0x3 (pass); instructions run 3; cmp NZCV 1000
- less_fuel(0x7, 0x3) expect 0x3 got 0x3 (pass); instructions run 3; cmp NZCV 0010
- less_fuel(0x5, 0x5) expect 0x5 got 0x5 (pass); instructions run 3; cmp NZCV 0110
- less_fuel(0x80000000, 0x1) expect 0x1 got 0x80000000 (FAIL); instructions run 3; cmp NZCV 0011
- less_fuel(0x1, 0x80000000) expect 0x1 got 0x80000000 (FAIL); instructions run 3; cmp NZCV 1001
  => 2 failing of 5
#### less_fuel reference with lo spelling -- assembles under the gate: true
```
less_fuel:
  cmp w0, w1
  csel w0, w0, w1, lo
  ret
```
- less_fuel(0x3, 0x7) expect 0x3 got 0x3 (pass); instructions run 3; cmp NZCV 1000
- less_fuel(0x7, 0x3) expect 0x3 got 0x3 (pass); instructions run 3; cmp NZCV 0010
- less_fuel(0x5, 0x5) expect 0x5 got 0x5 (pass); instructions run 3; cmp NZCV 0110
- less_fuel(0x80000000, 0x1) expect 0x1 got 0x1 (pass); instructions run 3; cmp NZCV 0011
- less_fuel(0x1, 0x80000000) expect 0x1 got 0x1 (pass); instructions run 3; cmp NZCV 1001
  => 0 failing of 5
#### fuel_warning reference A (b.cc) -- assembles under the gate: true
```
fuel_warning:
  cbz w0, .Lempty
  cmp w0, w1
  b.cc .Llow
  mov w0, 0
  ret
.Llow:
  mov w0, 1
  ret
.Lempty:
  mov w0, 2
  ret
```
- fuel_warning(0x0, 0xa) expect 0x2 got 0x2 (pass); instructions run 3
- fuel_warning(0x9, 0xa) expect 0x1 got 0x1 (pass); instructions run 5; cmp NZCV 1000
- fuel_warning(0xa, 0xa) expect 0x0 got 0x0 (pass); instructions run 5; cmp NZCV 0110
- fuel_warning(0xc8, 0xa) expect 0x0 got 0x0 (pass); instructions run 5; cmp NZCV 0010
- fuel_warning(0x80000000, 0xa) expect 0x0 got 0x0 (pass); instructions run 5; cmp NZCV 0011
  => 0 failing of 5
#### fuel_warning WRONG signed (b.lt) -- assembles under the gate: true
```
fuel_warning:
  cbz w0, .Lempty
  cmp w0, w1
  b.lt .Llow
  mov w0, 0
  ret
.Llow:
  mov w0, 1
  ret
.Lempty:
  mov w0, 2
  ret
```
- fuel_warning(0x0, 0xa) expect 0x2 got 0x2 (pass); instructions run 3
- fuel_warning(0x9, 0xa) expect 0x1 got 0x1 (pass); instructions run 5; cmp NZCV 1000
- fuel_warning(0xa, 0xa) expect 0x0 got 0x0 (pass); instructions run 5; cmp NZCV 0110
- fuel_warning(0xc8, 0xa) expect 0x0 got 0x0 (pass); instructions run 5; cmp NZCV 0010
- fuel_warning(0x80000000, 0xa) expect 0x0 got 0x1 (FAIL); instructions run 5; cmp NZCV 0011
  => 1 failing of 5
#### fuel_warning reference B (b.cs, with b) -- assembles under the gate: true
```
fuel_warning:
  cbz w0, .Lempty
  cmp w0, w1
  b.cs .Lok
  mov w0, 1
  b .Ldone
.Lok:
  mov w0, 0
  b .Ldone
.Lempty:
  mov w0, 2
.Ldone:
  ret
```
- fuel_warning(0x0, 0xa) expect 0x2 got 0x2 (pass); instructions run 3
- fuel_warning(0x9, 0xa) expect 0x1 got 0x1 (pass); instructions run 6; cmp NZCV 1000
- fuel_warning(0xa, 0xa) expect 0x0 got 0x0 (pass); instructions run 6; cmp NZCV 0110
- fuel_warning(0xc8, 0xa) expect 0x0 got 0x0 (pass); instructions run 6; cmp NZCV 0010
- fuel_warning(0x80000000, 0xa) expect 0x0 got 0x0 (pass); instructions run 6; cmp NZCV 0011
  => 0 failing of 5
#### fuel_warning reference C (cmp w1, w0 / b.hi: reserve higher than litres) -- assembles under the gate: true
```
fuel_warning:
  cbz w0, .Lempty
  cmp w1, w0
  b.hi .Llow
  mov w0, 0
  ret
.Llow:
  mov w0, 1
  ret
.Lempty:
  mov w0, 2
  ret
```
- fuel_warning(0x0, 0xa) expect 0x2 got 0x2 (pass); instructions run 3
- fuel_warning(0x9, 0xa) expect 0x1 got 0x1 (pass); instructions run 5; cmp NZCV 0010
- fuel_warning(0xa, 0xa) expect 0x0 got 0x0 (pass); instructions run 5; cmp NZCV 0110
- fuel_warning(0xc8, 0xa) expect 0x0 got 0x0 (pass); instructions run 5; cmp NZCV 1000
- fuel_warning(0x80000000, 0xa) expect 0x0 got 0x0 (pass); instructions run 5; cmp NZCV 1001
  => 0 failing of 5
