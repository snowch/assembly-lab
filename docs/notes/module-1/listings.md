# Compiler listings for Module 1

Fetched 16 October 2026 from Compiler Explorer, ARM64 GCC 16.1.0 (`carm64g1610`), flags `-O1`. Each line ends with the C line GCC's debug record gives it. The lessons copy these listings and a facts test holds the copies to this file.

```c
// Copyright © 2026 Christopher Snow
int service_interval(void) { return 30000; }
int odometer_limit(void) { return 1000000; }
int no_reading(void) { return -1; }
unsigned all_ones(void) { return 4294967295u; }
long no_reading_long(void) { return -1; }
unsigned long widen(unsigned km) { return km; }
long widen_signed(int change) { return change; }
int fuel_used_wrong(int at_start, int at_end) { return at_end - at_start; }
unsigned fuel_used_wrong_u(unsigned at_start, unsigned at_end) { return at_end - at_start; }
```

```
service_interval:                   
        mov     w0, 30000             C2
        ret                           C2
odometer_limit:                     
        mov     w0, 16960             C3
        movk    w0, 0xf, lsl 16       C3
        ret                           C3
no_reading:                         
        mov     w0, -1                C4
        ret                           C4
all_ones:                           
        mov     w0, -1                C5
        ret                           C5
no_reading_long:                    
        mov     x0, -1                C6
        ret                           C6
widen:                              
        uxtw    x0, w0                C7
        ret                           C7
widen_signed:                       
        sxtw    x0, w0                C8
        ret                           C8
fuel_used_wrong:                    
        sub     w0, w1, w0            C9
        ret                           C9
fuel_used_wrong_u:                  
        sub     w0, w1, w0            C10
        ret                           C10
```
