# Compiler listings for Module 0

Fetched 16 October 2026 from Compiler Explorer, ARM64 GCC 16.1.0 (`carm64g1610`), flags `-O1` unless stated. Each line ends with the C line GCC's debug record gives it. The lesson data copies these listings and a facts test holds the copy to this file.

## `m0b.c`

```c
// Copyright © 2026 Christopher Snow
int trip_distance(int leg1, int leg2, int leg3, int detour)
{
    int total = leg1 + leg2;
    total = total + leg3;
    total = total - detour;
    return total;
}

int fuel_used(int at_start, int at_end)
{
    return at_start - at_end;
}
```

```
trip_distance:                      
        add     w0, w0, w1            C4
        add     w0, w0, w2            C5
        sub     w0, w0, w3            C8
        ret                           C8
fuel_used:                          
        sub     w0, w0, w1            C13
        ret                           C13
```

## `m0c.c`

```c
// Copyright © 2026 Christopher Snow
int km_to_service(int service_at, int odometer, int trip_so_far, int planned)
{
    int left = service_at - odometer;
    left = left - trip_so_far;
    left = left - planned;
    return left - 50;
}

int fuel_used(int at_start, int at_end)
{
    return at_end - at_start;
}
```

```
km_to_service:                      
        sub     w0, w0, w1            C4
        sub     w0, w0, w2            C5
        sub     w0, w0, w3            C6
        sub     w0, w0, #50           C8
        ret                           C8
fuel_used:                          
        sub     w0, w1, w0            C13
        ret                           C13
```

## `m0b.c` at `-Og` and with ARM64 GCC 14.2.0 (`carm64g1420`) at `-O1`

Both give the same instructions and the same line record as GCC 16.1.0 at `-O1`: the last subtraction is recorded against the closing brace.

## `m0b.c` at `-O0`

```
trip_distance:                      
        sub     sp, sp, #32           C3
        str     w0, [sp, 12]          C3
        str     w1, [sp, 8]           C3
        str     w2, [sp, 4]           C3
        str     w3, [sp]              C3
        ldr     w1, [sp, 12]          C4
        ldr     w0, [sp, 8]           C4
        add     w0, w1, w0            C4
        str     w0, [sp, 28]          C4
        ldr     w1, [sp, 28]          C5
        ldr     w0, [sp, 4]           C5
        add     w0, w1, w0            C5
        str     w0, [sp, 28]          C5
        ldr     w1, [sp, 28]          C6
        ldr     w0, [sp]              C6
        sub     w0, w1, w0            C6
        str     w0, [sp, 28]          C6
        ldr     w0, [sp, 28]          C7
        add     sp, sp, 32            C8
        ret                           C8
fuel_used:                          
        sub     sp, sp, #16           C11
        str     w0, [sp, 12]          C11
        str     w1, [sp, 8]           C11
        ldr     w1, [sp, 12]          C12
        ldr     w0, [sp, 8]           C12
        sub     w0, w1, w0            C12
        add     sp, sp, 16            C13
        ret                           C13
```
