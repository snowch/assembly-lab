# Compiler listings for Module 4

Fetched 16 October 2026 from Compiler Explorer, ARM64 GCC 16.1.0 (`carm64g1610`), flags `-O1`. Each line ends with the C line GCC's debug record gives it.

```c
// Copyright © 2026 Christopher Snow
#include <stdbool.h>
int steeper_s(int a, int b) { return a > b ? a : b; }
unsigned steeper_u(unsigned a, unsigned b) { return a > b ? a : b; }
bool fuel_low(unsigned litres, unsigned reserve) { return litres < reserve; }
bool downhill(int gradient) { return gradient < 0; }
bool service_due(unsigned w) { return (w & 2) != 0; }
int warning_light(unsigned litres, unsigned reserve)
{
    if (litres < reserve)
        return 1;
    return 0;
}
int describe(int gradient)
{
    if (gradient > 10)
        return 2;
    if (gradient < -10)
        return -2;
    return 0;
}
void beep(void);
void maybe_beep(unsigned litres)
{
    if (litres == 0)
        beep();
}
```

```
steeper_s:                          
        cmp     w1, w0                C3
        csel    w0, w1, w0, ge        C3
        ret                           C3
steeper_u:                          
        cmp     w1, w0                C4
        csel    w0, w1, w0, cs        C4
        ret                           C4
fuel_low:                           
        cmp     w0, w1                C5
        cset    w0, cc                C5
        ret                           C5
downhill:                           
        lsr     w0, w0, 31            C6
        ret                           C6
service_due:                        
        ubfx    x0, x0, 1, 1          C7
        ret                           C7
warning_light:                      
        cmp     w0, w1                C10
        cset    w0, cc                C13
        ret                           C13
describe:                           
        cmp     w0, 10                C16
        bgt     .L9                   C16
        cmn     w0, #10               C20
        mov     w0, -2                C20
        csel    w0, w0, wzr, lt       C20
.L7:                                
        ret                           C21
.L9:                                
        mov     w0, 2                 C17
        b       .L7                   C17
maybe_beep:                         
        cbz     w0, .L17              C25
        ret                           C25
.L17:                               
        stp     x29, x30, [sp, -16]!  C24
        mov     x29, sp               C24
        bl      beep                  C26
        ldp     x29, x30, [sp], 16    C27
        ret                           C27
```
