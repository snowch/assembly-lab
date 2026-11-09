# Appendix C: C integer types and register widths

Optional reference: compare the widths and readings in three recorded C return values.

## Objectives

- Explain why the recorded long example uses x0 while the int and unsigned examples use w0.
- Explain how the int and unsigned examples return the same bits with different readings.

This optional reference follows [Constants and widths](#/lesson/constants-and-widths). It uses the w and x names from that lesson and the [signed and unsigned readings](#/lesson/same-bits-two-readings) taught earlier.

The listings are recorded output from ARM64 GCC 16.1.0 with the setting `-O1`, fetched from Compiler Explorer on 16 October 2026.

## long uses 64 bits on this target

On the selected target for these GCC listings, C’s `int` is 32 bits and `long` is 64 bits. These sizes are not the same on every C system.

The function below returns −1 as a `long`.

```c
long no_reading_long(void) { return -1; }
```

```asm
no_reading_long:
        mov     x0, -1                C6
        ret                           C6
```

A long return value, with its recorded instructions.

GCC uses `mov x0, -1` here. The `x` name selects all 64 bits, and the instruction sets them all to 1. The `int` example below uses the `w` name to write 32 bits.

## int and unsigned return the same bits here

`unsigned` on its own means `unsigned int`. On this target, `int` and `unsigned int` are both 32 bits. Their signed and unsigned readings differ.

First, the function returning −1 as an `int`:

```c
int no_reading(void) { return -1; }
```

```asm
no_reading:
        mov     w0, -1                C4
        ret                           C4
```

An int return value, with its recorded instructions.

`mov w0, -1` sets all 32 bits of w0 to 1. Read as signed, those bits mean −1. Writing w0 also clears the upper 32 bits of x0.

The next function returns `4294967295u`. The `u` suffix marks an unsigned integer constant. For this value on this target, the constant’s type is `unsigned int`.

```c
unsigned all_ones(void) { return 4294967295u; }
```

```asm
all_ones:
        mov     w0, -1                C5
        ret                           C5
```

An unsigned return value, with its recorded instructions.

GCC emits the same `mov w0, -1` and `ret` for both functions. Read as unsigned, the 32 set bits mean 4294967295. The register holds the same bits; the C return type says which reading the program means.

A register stores bits without a C type tag. In these recorded examples, the width distinguishes `long` from `int`; the reading distinguishes `int` from `unsigned`. These instruction choices belong to this compiler and these functions.

[Return to Constants and widths](#/lesson/constants-and-widths).

[Revisit signed and unsigned readings](#/lesson/same-bits-two-readings).

## Optional sentence for the M1 L7 recap

For an optional comparison of C return types and these register widths, see [C integer types and register widths](#/lesson/c-integer-types).


## Separate follow-up draft for the accepted phone discoverability finding

On a narrow screen, swipe sideways within each listing to see the C and its assembly instructions.
