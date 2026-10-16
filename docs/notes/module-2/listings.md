# Compiler listings for Module 2

Fetched 16 October 2026 from Compiler Explorer, ARM64 GCC 16.1.0 (`carm64g1610`), flags `-O1`. Each line ends with the C line GCC's debug record gives it.

```c
// Copyright © 2026 Christopher Snow
#include <stdbool.h>
unsigned elapsed(unsigned now, unsigned then) { return now - then; }
bool tick_wrapped(unsigned now, unsigned then) { return now < then; }
bool sum_carried(unsigned a, unsigned b) { return a + b < a; }
bool add_overflows(int a, int b) { int r; return __builtin_add_overflow(a, b, &r); }
bool sub_overflows(int a, int b) { int r; return __builtin_sub_overflow(a, b, &r); }
int negate(int x) { return -x; }
```

```
elapsed:                            
        sub     w0, w0, w1            C3
        ret                           C3
tick_wrapped:                       
        cmp     w0, w1                C4
        cset    w0, cc                C4
        ret                           C4
sum_carried:                        
        add     w1, w0, w1            C5
        cmp     w1, w0                C5
        cset    w0, cc                C5
        ret                           C5
add_overflows:                      
        cmn     w0, w1                C6
        cset    w0, vs                C6
        ret                           C6
sub_overflows:                      
        subs    w0, w0, w1            C7
        cset    w0, vs                C7
        ret                           C7
negate:                             
        neg     w0, w0                C8
        ret                           C8
```
