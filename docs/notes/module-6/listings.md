# Module 6 compiler evidence

Copyright © 2026 Christopher Snow

Recorded from Compiler Explorer on 17 October 2026. Compiler `carm64g1610` is
AArch64 GCC 16.1.0; every request uses `-O1`. Sources, exact requests and raw responses
are in `compiler/`. Listings retain instruction spelling and source mappings. Displayed
C omits the copyright comment, so each displayed C tag is the response line minus one.
All examples use the little-endian AArch64 Linux LP64 target: char is 8 bits, short
16, int 32, and long and pointers 64. Those sizes are target choices, not universal C rules.
Signed char is explicit; plain char's signedness is not assumed.

The unsigned-byte cast compiles to AND, not UXTB. The separate UXTB comparison is
course-authored assembly. Its result is checked against the compiled version.

## read_distance

```c
unsigned read_distance(const unsigned *distance)
{
    return *distance;
}
```

```asm
read_distance:
  ldr w0, [x0] C4
  ret C4
```

## save_distance

```c
void save_distance(unsigned *distance, unsigned value)
{
    *distance = value;
}
```

```asm
save_distance:
  str w1, [x0] C3
  ret C4
```

## read_fuel

```c
unsigned read_fuel(const unsigned char *fuel)
{
    return *fuel;
}
```

```asm
read_fuel:
  ldrb w0, [x0] C4
  ret C4
```

## read_gradient

```c
int read_gradient(const signed char *gradient)
{
    return *gradient;
}
```

```asm
read_gradient:
  ldrsb w0, [x0] C4
  ret C4
```

## read_pulse

```c
unsigned read_pulse(const unsigned short *pulse)
{
    return *pulse;
}
```

```asm
read_pulse:
  ldrh w0, [x0] C4
  ret C4
```

## read_offset

```c
int read_offset(const short *offset)
{
    return *offset;
}
```

```asm
read_offset:
  ldrsh w0, [x0] C4
  ret C4
```

## read_offset_long

```c
long read_offset_long(const int *offset)
{
    return *offset;
}
```

```asm
read_offset_long:
  ldrsw x0, [x0] C4
  ret C4
```

## read_gradient_long

```c
long read_gradient_long(const signed char *gradient)
{
    return *gradient;
}
```

```asm
read_gradient_long:
  ldrsb x0, [x0] C4
  ret C4
```

## read_long

```c
unsigned long read_long(const unsigned long *total)
{
    return *total;
}
```

```asm
read_long:
  ldr x0, [x0] C4
  ret C4
```

## save_fuel

```c
void save_fuel(unsigned char *fuel, unsigned value)
{
    *fuel = value;
}
```

```asm
save_fuel:
  strb w1, [x0] C3
  ret C4
```

## save_pulse

```c
void save_pulse(unsigned short *pulse, unsigned value)
{
    *pulse = value;
}
```

```asm
save_pulse:
  strh w1, [x0] C3
  ret C4
```

## save_long

```c
void save_long(unsigned long *total, unsigned long value)
{
    *total = value;
}
```

```asm
save_long:
  str x1, [x0] C3
  ret C4
```

## signed_byte

```c
int signed_byte(unsigned value)
{
    return (signed char)value;
}
```

```asm
signed_byte:
  sxtb w0, w0 C4
  ret C4
```

## unsigned_byte

```c
unsigned unsigned_byte(unsigned value)
{
    return (unsigned char)value;
}
```

```asm
unsigned_byte:
  and w0, w0, 255 C4
  ret C4
```

## signed_long

```c
long signed_long(int value)
{
    return value;
}
```

```asm
signed_long:
  sxtw x0, w0 C4
  ret C4
```

## add_adjustment

```c
long add_adjustment(long total, int adjustment)
{
    return total + adjustment;
}
```

```asm
add_adjustment:
  add x0, x0, w1, sxtw C4
  ret C4
```
