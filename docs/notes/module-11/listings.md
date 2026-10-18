# Module 11 recorded listings

Compiler Explorer compiler `carm64g1610`, GCC 16.1.0, retrieved 17 October 2026. The exact source, request, response and source-line map are retained in `compiler/`.

## CAN_INCREMENT

Flags: `-O1 -std=c23`

```c
int can_increment(int distance)
{
    return distance + 1 > distance;
}
```

```asm
can_increment:
mov w0, 1 C4
ret C4
```

## CAN_INCREMENT_WRAP

Flags: `-O1 -std=c23 -fwrapv`

```c
int can_increment(int distance)
{
    return distance + 1 > distance;
}
```

```asm
can_increment:
mov w1, 2147483647 C3
cmp w0, w1 C3
cset w0, ne C4
ret C4
```

## INCREMENT_LIMIT

Flags: `-O1 -std=c23`

```c
#include <limits.h>
int increment_limit(int distance)
{
    return distance == INT_MAX;
}
```

```asm
increment_limit:
mov w1, 2147483647 C4
cmp w0, w1 C4
cset w0, eq C5
ret C5
```

## SAFE_INCREMENT_BRANCH

Flags: `-O1 -std=c23 -fno-if-conversion -fno-if-conversion2`

```c
#include <limits.h>
int safe_increment(int distance)
{
    if (distance == INT_MAX)
        return distance;
    return distance + 1;
}
```

```asm
safe_increment:
mov w1, 2147483647 C4
cmp w0, w1 C4
beq .L1 C4
add w0, w0, 1 C6
.L1:
ret C7
```

## NARROW_FUEL

Flags: `-O1 -std=c23`

```c
unsigned narrow_fuel(unsigned fuel)
{
    return (unsigned char)fuel;
}
```

```asm
narrow_fuel:
and w0, w0, 255 C4
ret C4
```

## NARROW_GRADIENT

Flags: `-O1 -std=c23`

```c
int narrow_gradient(int gradient)
{
    return (signed char)gradient;
}
```

```asm
narrow_gradient:
sxtb w0, w0 C4
ret C4
```

## FUEL_FITS

Flags: `-O1 -std=c23`

```c
unsigned fuel_fits(unsigned fuel)
{
    return fuel <= 255;
}
```

```asm
fuel_fits:
cmp w0, 255 C3
cset w0, ls C4
ret C4
```

## CHECKED_TRIP

Flags: `-O1 -std=c23`

```c
#include <stdckdint.h>
_Bool checked_trip(int distance, int adjustment, int *result)
{
    return ckd_add(result, distance, adjustment);
}
```

```asm
checked_trip:
adds w0, w0, w1 C4
str w0, [x2] C4
cset w0, vs C5
ret C5
```

## NEGATE_GRADIENT

Flags: `-O1 -std=c23`

```c
int negate_gradient(int gradient)
{
    return -gradient;
}
```

```asm
negate_gradient:
neg w0, w0 C4
ret C4
```

## UNSIGNED_SUM_OVERFLOW

Flags: `-O1 -std=c23`

```c
unsigned unsigned_sum_overflow(unsigned distance, unsigned leg)
{
    return distance + leg < distance;
}
```

```asm
unsigned_sum_overflow:
add w1, w0, w1 C3
cmp w1, w0 C3
cset w0, cc C4
ret C4
```

## UNSIGNED_SUB_WRAP

Flags: `-O1 -std=c23`

```c
unsigned unsigned_sub_wrap(unsigned now, unsigned then)
{
    return now - then > now;
}
```

```asm
unsigned_sub_wrap:
cmp w1, w0 C3
cset w0, hi C4
ret C4
```

## PROMOTED_GRADIENT

Flags: `-O1 -std=c23`

```c
int promoted_gradient(signed char gradient)
{
    return gradient + 1;
}
```

```asm
promoted_gradient:
sxtb w0, w0 C2
add w0, w0, 1 C4
ret C4
```

## MIXED_LIMIT

Flags: `-O1 -std=c23`

```c
int mixed_limit(int gradient, unsigned limit)
{
    return gradient < limit;
}
```

```asm
mixed_limit:
cmp w0, w1 C3
cset w0, cc C4
ret C4
```

## Diagnostic-only records

`sanitize_trip` records `-O1 -std=c23 -fsanitize=undefined`. GCC inserts a signed overflow branch and a call to `__ubsan_handle_add_overflow`. The external runtime, address relocations and data directives are outside this simulator. No complete sanitizer program is shown or claimed executable here. The lesson describes the recorded compiler check, with a link to the raw evidence.

`format_trip` records `-O1 -std=c23 -Wall -Wextra -Wformat=2 -Wformat-signedness`. Its recorded diagnostic identifies `%d` as requiring `int` while the argument is `unsigned int`. No `printf` assembly is shown, and the simulator does not emulate formatted output.

`safe_increment` at plain `-O1 -std=c23` uses `cinc`, outside the taught subset. The lesson does not show that listing. `safe_increment_branch` disables both if-conversion passes explicitly so the displayed version uses previously taught instructions. This is a deliberate compiler-setting comparison, not a claim that plain `-O1` emits a branch.
