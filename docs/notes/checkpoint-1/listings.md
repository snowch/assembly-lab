# Compiler Explorer listings for checkpoint 1

Fetched 16 October 2026 from the Compiler Explorer API (godbolt.org) by the managing session.
Compilers: ARM GCC 15.2.0 (`carmg1520`, flags `-O1 -marm -march=armv7-a`) and ARM64 GCC 16.1.0 (`carm64g1610`, flags `-O1`).
Each line ends with the C source line Compiler Explorer attributes it to.

## `src.c`

```c
#include <stdint.h>
int8_t inc8(int8_t x) { return x + 1; }
int big(void) { return 257; }
int wrapped(unsigned a, unsigned b) { unsigned d = a - b; return d > a; }
int load_s(int8_t *p) { return *p; }
unsigned load_u(uint8_t *p) { return *p; }
int max_s(int a, int b) { return a > b ? a : b; }
unsigned max_u(unsigned a, unsigned b) { return a > b ? a : b; }
void clear(uint8_t *a, unsigned n) { for (unsigned i = 0; i < n; i++) a[i] = 0; }
int div10(int x) { return x / 10; }
int check(int x) { if (x + 1 > x) return 1; return 0; }
```

## `src2.c`

```c
#include <stdint.h>
int add_i(int a, int b) { return a + b; }
long add_l(long a, int b) { return a + b; }
int sdiv0(int a, int b) { return a / b; }
unsigned elapsed(unsigned now, unsigned then) { return now - then; }
int sum(const int *a, int n) { int s = 0; for (int i = 0; i < n; i++) s += a[i]; return s; }
```

## Listings from `out`

```
===== A32 armv7-a -O1 carmg1520 -O1 -marm -march=armv7-a
inc8:                             
  add r0, r0, #1                    C2
  sxtb r0, r0                       C2
  bx lr                             C2
big:                              
  movw r0, #257                     C3
  bx lr                             C3
wrapped:                          
  cmp r0, r1                        C4
  movcs r0, #0                      C4
  movcc r0, #1                      C4
  bx lr                             C4
load_s:                           
  ldrsb r0, [r0]                    C5
  bx lr                             C5
load_u:                           
  ldrb r0, [r0] @ zero_extendqisi2  C6
  bx lr                             C6
max_s:                            
  cmp r1, r0                        C7
  movge r0, r1                      C7
  bx lr                             C7
max_u:                            
  cmp r1, r0                        C8
  movcs r0, r1                      C8
  bx lr                             C8
clear:                            
  cmp r1, #0                        C9
  bxeq lr                           C9
  sub r3, r0, #1                    C9
  add r1, r1, r0                    C9
  sub r2, r1, #1                    C9
  mov r1, #0                        C9
.L10:                             
  strb r1, [r3, #1]!                C9
  cmp r3, r2                        C9
  bne .L10                          C9
  bx lr                             C9
div10:                            
  movw r3, #26215                   C10
  movt r3, 26214                    C10
  smull r2, r3, r3, r0              C10
  asr r0, r0, #31                   C10
  rsb r0, r0, r3, asr #2            C10
  bx lr                             C10
check:                            
  mov r0, #1                        C11
  bx lr                             C11
stderr: []
===== A64 -O1 carm64g1610 -O1
inc8:                             
  sxtb w0, w0                       C2
  add w0, w0, 1                     C2
  ret                               C2
big:                              
  mov w0, 257                       C3
  ret                               C3
wrapped:                          
  cmp w0, w1                        C4
  cset w0, cc                       C4
  ret                               C4
load_s:                           
  ldrsb w0, [x0]                    C5
  ret                               C5
load_u:                           
  ldrb w0, [x0]                     C6
  ret                               C6
max_s:                            
  cmp w1, w0                        C7
  csel w0, w1, w0, ge               C7
  ret                               C7
max_u:                            
  cmp w1, w0                        C8
  csel w0, w1, w0, cs               C8
  ret                               C8
clear:                            
  cbz w1, .L8                       C9
  mov x2, x0                        C9
  add x0, x0, w1, uxtw              C9
.L10:                             
  strb wzr, [x2], 1                 C9
  cmp x2, x0                        C9
  bne .L10                          C9
.L8:                              
  ret                               C9
div10:                            
  mov w1, 26215                     C10
  movk w1, 0x6666, lsl 16           C10
  smull x1, w0, w1                  C10
  asr x1, x1, 34                    C10
  sub w0, w1, w0, asr 31            C10
  ret                               C10
check:                            
  mov w0, 1                         C11
  ret                               C11
stderr: []
```

## Listings from `out2`

```
===== A32 armv7-a -O1 carmg1520 -O1 -marm -march=armv7-a
add_i:                            
  add r0, r0, r1                    C2
  bx lr                             C2
add_l:                            
  add r0, r0, r1                    C3
  bx lr                             C3
sdiv0:                            
  push {r4, lr}                     C4
  bl __aeabi_idiv                   C4
  pop {r4, pc}                      C4
elapsed:                          
  sub r0, r0, r1                    C5
  bx lr                             C5
sum:                              
  cmp r1, #0                        C6
  ble .L9                           C6
  mov r3, r0                        C6
  add r1, r0, r1, lsl #2            C6
  mov r0, #0                        C6
.L8:                              
  ldr r2, [r3], #4                  C6
  add r0, r0, r2                    C6
  cmp r3, r1                        C6
  bne .L8                           C6
  bx lr                             C6
.L9:                              
  mov r0, #0                        C6
  bx lr                             C6
stderr: []
===== A64 -O1 carm64g1610 -O1
add_i:                            
  add w0, w0, w1                    C2
  ret                               C2
add_l:                            
  add x0, x0, w1, sxtw              C3
  ret                               C3
sdiv0:                            
  sdiv w0, w0, w1                   C4
  ret                               C4
elapsed:                          
  sub w0, w0, w1                    C5
  ret                               C5
sum:                              
  cmp w1, 0                         C6
  ble .L8                           C6
  mov x2, x0                        C6
  add x3, x0, w1, sxtw 2            C6
  mov w0, 0                         C6
.L7:                              
  ldr w1, [x2], 4                   C6
  add w0, w0, w1                    C6
  cmp x2, x3                        C6
  bne .L7                           C6
.L5:                              
  ret                               C6
.L8:                              
  mov w0, 0                         C6
  b .L5                             C6
stderr: []
```
