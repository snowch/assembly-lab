# Compiler listings for Module 3

Fetched 16 October 2026 from Compiler Explorer, ARM64 GCC 16.1.0 (`carm64g1610`), flags `-O1`. Each line ends with the C line GCC's debug record gives it.

```c
// Copyright © 2026 Christopher Snow
#include <stdbool.h>
#define FUEL_LOW (1u << 0)
#define SERVICE_DUE (1u << 1)
#define DOOR_OPEN (1u << 2)
unsigned warn_fuel(unsigned w) { return w | FUEL_LOW; }
unsigned clear_door(unsigned w) { return w & ~DOOR_OPEN; }
bool service_due(unsigned w) { return (w & SERVICE_DUE) != 0; }
unsigned gear_of(unsigned w) { return (w >> 4) & 7; }
unsigned set_gear(unsigned w, unsigned g) { return (w & ~(7u << 4)) | ((g & 7) << 4); }
unsigned toggle_lights(unsigned w) { return w ^ (1u << 3); }
int halve_gradient(int g) { return g >> 1; }
unsigned halve_count(unsigned n) { return n >> 1; }
int div2(int g) { return g / 2; }
unsigned times8(unsigned n) { return n * 8; }
```

```
warn_fuel:                          
        orr     w0, w0, 1             C6
        ret                           C6
clear_door:                         
        and     w0, w0, -5            C7
        ret                           C7
service_due:                        
        ubfx    x0, x0, 1, 1          C8
        ret                           C8
gear_of:                            
        ubfx    x0, x0, 4, 3          C9
        ret                           C9
set_gear:                           
        bfi     w0, w1, 4, 3          C10
        ret                           C10
toggle_lights:                      
        eor     w0, w0, 8             C11
        ret                           C11
halve_gradient:                     
        asr     w0, w0, 1             C12
        ret                           C12
halve_count:                        
        lsr     w0, w0, 1             C13
        ret                           C13
div2:                               
        add     w0, w0, w0, lsr 31    C14
        asr     w0, w0, 1             C14
        ret                           C14
times8:                             
        lsl     w0, w0, 3             C15
        ret                           C15
```
