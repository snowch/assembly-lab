# Module 6: Loads, stores and widths (lesson text)

Drafted in a separate Codex session from the checked compiler listings and simulator results on 17 October 2026. The drafting session used its inherited model and effort settings. Sources and compiler records are in `listings.md`; independent review and validation are recorded separately.

This file contains the learner-facing prose, hints and labels word for word. Headings that identify a passage are editorial markers.

# Lesson 1: Memory and addresses

## 0. Objectives

- distinguish an address from the value stored there;
- follow bytes between memory and a register in little-endian order;
- load and store values without changing neighbouring bytes.

## 1. Where does a load find its bytes?

The trip computer keeps a distance reading in memory. To use that reading in a calculation, the processor must copy it into a register. **How does an instruction find the right bytes?**

Memory holds **bytes**. On this machine, a byte contains 8 bits. Each byte has a numbered location called its **address**. Consecutive addresses identify consecutive bytes.

In the C below, `unsigned *distance` declares a **pointer**: `distance` holds the address of an unsigned value. `*distance` reads the value at that address. `const` says this function cannot change the value through this pointer.

*Closed note: The compiler and C sizes*

These listings use GCC 16.1 with `-O1`, as in Module 0. They target AArch64 Linux: the 64-bit Arm instruction set running with the Linux operating system. The target uses little-endian byte order. Here, `char` occupies 8 bits, `short` 16, `int` 32, and `long` and pointers 64. These are this target's choices, not sizes guaranteed by C on every machine.

`unsigned` on its own means `unsigned int`. Adding `unsigned` changes the range of an integer type, not its size on this target.

*End of closed note.*

## 2. Addresses, brackets and byte order

`x0` names all 64 bits of register 0. `w0` names its low 32 bits. They are two views of the same register. Writing `w0` also clears the upper 32 bits of `x0`. The pointer arrives in `x0`, because addresses here use 64 bits.

`ldr w0, [x0]` reads four bytes from memory, starting at the address held in `x0`. It places their bits in `w0`. The brackets mean access memory at that address. They do not mean copy the address into `w0`.

This course uses **little-endian** byte order: the byte at the lowest address supplies the lowest 8 bits of a multi-byte value. The next byte supplies the next 8 bits. A hexadecimal number is written with its highest bits on the left, so its displayed byte order runs the other way.

## 3. Read four bytes as one value

The four bytes starting at the address in `x0` are `78 56 34 12`, in increasing address order. Each pair of digits is one hexadecimal byte.

**What hexadecimal value does `ldr w0, [x0]` put in `w0`?**

*After committing the prediction:*

`w0` becomes `0x12345678`. The byte `78` supplies the lowest 8 bits, followed by `56`, `34` and `12`. The load reads memory without changing those bytes.

Writing `w0` replaces the low half of `x0` and clears its upper half. After the load, register 0 holds the distance reading. It no longer holds the pointer.

Step through the load. The figure marks the bytes it reads and shows where their bits go in the register. The address identifies the first byte; the destination `w0` makes this `ldr` read four bytes.

## 4. Move bits between memory and registers

A **load** copies bits from memory into a register. A **store** copies bits from a register into memory. `str w1, [x0]` writes the four bytes from `w1`, starting at the address in `x0`. It leaves the source register unchanged.

In `save_distance`, `distance` arrives in `x0` and `value` in `w1`. The C assignment `*distance = value` changes the value at the pointer's address. `void` means this function returns no value.

## 5. Save the distance reading

Store a new distance reading without changing the bytes that follow it. The address tells you where to start; the instruction's width tells you where to stop.

### Write save_distance

Write `save_distance`. `x0` holds the address of a four-byte unsigned distance reading. `w1` holds its replacement value. Write that value into the first four bytes and leave the following four bytes unchanged. Then return.

The exercise supplies the memory bytes. Write instructions only; you do not need to declare memory. The function has no return value.

*Hints, in order:*

- You need to change memory, so choose a store.
- A load would read memory instead of updating it. A store needs `w1` as its value source and `[x0]` as its memory destination.
- For the value `0x12345678`, a four-byte store writes `78 56 34 12` in increasing address order. The address register belongs inside square brackets.
- A store from a `w` register writes four bytes. Follow the store with `ret`.
- Under `save_distance:`, write `str w1, [x0]` and then `ret`.

## 6. A store that writes too many bytes

A different field needs only one byte. Its original byte and the three bytes after it are `aa bb cc dd`. `w1` holds `0x12345678`. The program below uses `str w1, [x0]` to update the field.

**Which four bytes will memory contain afterwards, in increasing address order?**

*After committing the prediction:*

Memory contains `78 56 34 12`. `str w1, [x0]` writes all four bytes of `w1`, so it overwrites the three neighbouring bytes as well.

`strb w1, [x0]` writes only the low byte, leaving `78 bb cc dd`. `strh w1, [x0]` writes the low two bytes, leaving `78 56 cc dd`. The letters `b` and `h` select a byte and a halfword. A halfword here contains two bytes.

## 7. Choose how many bytes to write

A narrow store takes only the low bits it needs. `strb` takes 8 bits and `strh` takes 16 bits. Neither instruction changes `w1`, and neither writes beyond its selected bytes.

For GCC's target, `unsigned char` occupies one byte and `unsigned short` occupies two. The recorded C functions store those types with `strb` and `strh`.

The address register and the transferred value can have different widths. `strb w1, [x0]` uses a 64-bit address but writes one byte. `str w1, [x0]` uses a 64-bit address and writes four bytes.

Using an `x` register for the value makes ordinary `ldr` or `str` transfer eight bytes. The next figures load and store an eight-byte value. Follow which memory address supplies each part of the register.

## 8. Keep track of the value and its address

Read a memory instruction in three parts: which register holds the value, which register holds the address, and how many bytes the instruction transfers.

The load and store instructions shown here leave their address register unchanged unless it is also the load's destination. In `ldr w0, [x0]`, the destination overlaps the address register. Keep the address elsewhere if you will need it again.

## 9. Copy a distance reading

### Write copy_distance

Copy a four-byte distance reading to a second location. `x0` holds the source address and `x1` holds the destination address. The destination starts immediately after the source's four bytes.

Leave the source bytes unchanged. Write the copied value into the destination's four bytes, and return that value in `w0`. The exercise supplies both locations.

*Hints, in order:*

- A copy needs a load followed by a store.
- Copying `x0` would copy the address, not the distance stored there. Read the four bytes at that address.
- The bytes `78 56 34 12` load as `0x12345678`. Storing that register value at the destination reproduces the same four bytes.
- Store the loaded value through `x1`. The value must remain in `w0` for the return.
- Under `copy_distance:`, write `ldr w0, [x0]`, `str w0, [x1]` and `ret`.

## 10. What you now know

- An address identifies a byte in memory.
- A load reads memory; a store writes it.
- The transfer width decides how many consecutive bytes are accessed.
- Little-endian order puts the lowest byte of a value at the lowest address.
- `w0` and `x0` name parts of the same register.

Why does `strb w1, [x0]` need an `x` register even though it writes only one byte?

*Closed note: Answer*

`x0` holds the address, which uses 64 bits on this target. The `b` in `strb` chooses the transfer width: one byte from the low end of `w1`.

*End of closed note.*

## Model and reality

The figures use prepared memory bytes at valid addresses. Only the prepared memory regions are available to these examples. They show ordinary memory, not a sensor's hardware interface. Real programs must also have permission to access memory. For these C functions, the pointer must refer to storage for a value of the declared type, such as an `unsigned` distance. A readable address alone is not enough.

The simulator shows little-endian memory and the completed effect of each instruction. It does not model memory access timing or all faults a real processor can report.

## Figure captions and labels

read_distance in C and the instructions GCC made from it.

Predict the value loaded from four consecutive bytes.

Follow the bytes from memory into w0.

Step through save_distance and inspect the bytes it writes.

Write and test a four-byte store.

Predict which bytes the store will change.

A four-byte store from w1.

A one-byte store from w1.

A two-byte store from w1.

Load eight bytes into the full x0 register.

Store eight bytes from the full x1 register.

Load a distance, store a copy and return its value.

0x78563412

0x12345678

0x00000078

0x00410000

78 56 34 12

78 bb cc dd

78 56 cc dd

aa bb cc dd

Store zero; preserve the following bytes

Store one; preserve the following bytes

Store 0x12345678; preserve the following bytes

Store 0xffffffff; preserve the following bytes

Store 0x80000000; preserve the following bytes

Copy 0x12345678 and preserve the source

Copy zero and preserve the source

Copy 0xffffffff and preserve the source

Copy 0x80000000 and preserve the source

Copy 0x89abcdef and preserve the source

## Originality record

Copying an integer between anonymous memory locations.

The trip computer stores and copies a distance reading. A one-byte update exposes neighbouring-field damage, and computed byte diagrams connect store width to the bytes changed.

# Lesson 2: Loading different widths

## 0. Objectives

- explain how a load fills the bits beyond the stored value;
- choose signed and unsigned loads for different field widths;
- read a sensor record while preserving its address.

## 1. How does a small value fill a wider register?

A fuel-level reading and a road-gradient reading each occupy one byte. Fuel level is unsigned. Gradient is signed, so a downhill reading can be negative. **How does a load preserve that difference when the register is wider than the stored value?**

The C types make the intended interpretation explicit: `unsigned char` for fuel and `signed char` for gradient. Both occupy one byte on this target. We do not rely on whether plain `char` is signed.

*Closed note: The compiler and C types*

These listings use GCC 16.1 with `-O1` for little-endian AArch64 Linux. As in the previous lesson, `char` is 8 bits, `short` 16, `int` 32, and `long` and pointers 64.

The return type can be wider than the value in memory. Returning an `unsigned char` as `unsigned`, or a `signed char` as `int`, preserves that value.

*End of closed note.*

## 2. Fill with zeros or copies of the sign bit

`ldrb w0, [x0]` reads one byte. It puts that byte in the low 8 bits of `w0` and fills the remaining bits with zeros. This is **zero extension**: adding zero bits above the original value.

`ldrsb w0, [x0]` also reads one byte. It fills the remaining bits of `w0` with copies of the byte's highest bit, its sign bit. This is **sign extension**. A non-negative byte gets zeros above it; a negative byte gets ones. The wider signed value stays the same.

Both instructions write a `w` register, so both clear the upper 32 bits of the corresponding `x` register. Extending a byte into `w0` and clearing the upper half of `x0` are separate parts of the instruction's effect.

## 3. Load a signed gradient byte

The byte at the address in `x0` is `f9`. Its highest bit is 1. GCC uses `ldrsb w0, [x0]` to return this gradient as an `int`.

**What hexadecimal value does `w0` hold after the load?**

*After committing the prediction:*

`w0` holds `0xfffffff9`, which represents −7 as a signed 32-bit value. The load copies the byte `f9` and fills the next 24 bits with ones. An unsigned `ldrb` of the same byte would produce `0x000000f9`, or 249.

The full `x0` register holds `0x00000000fffffff9`. Its upper 32 bits are zero because the instruction wrote `w0`. That 64-bit pattern does not represent −7 as a signed 64-bit value.

## 4. Compare the width and the extension

Choose a load in the comparison, then press Next. Switch between `ldrb w0` and `ldrsb w0` to compare the same byte at the same step. Both copy the stored bits into the low end of `w0`. Above those bits, `ldrb` adds zeros and `ldrsb` copies the sign bit. Neither instruction changes memory.

The same distinction applies to two-byte values. `ldrh` reads two bytes and zero-extends them. `ldrsh` reads two bytes and sign-extends them. In these listings, `unsigned short` selects `ldrh` and signed `short` selects `ldrsh`.

The destination also matters. `ldrsb x0, [x0]` sign-extends its byte through all 64 bits. `ldrsw x0, [x0]` reads four bytes and sign-extends that 32-bit value to 64 bits. GCC uses the latter when returning a stored `int` as a `long` on this target.

Use the comparison to separate three regions: the bits read from memory, the bits added by extension, and any upper bits cleared by a write through a `w` register name.

## 5. Add a correction to a signed gradient

A gradient correction must treat the stored byte as signed before adding. Otherwise, a negative reading becomes a large positive input to the addition.

### Write adjust_gradient

Write `adjust_gradient`. `x0` holds the address of a signed one-byte gradient. `w1` holds a signed 32-bit correction. Load the gradient, add the correction, and return the signed 32-bit result in `w0`. Leave memory unchanged.

All test results fit in a signed 32-bit value. The tests include positive and negative gradients and corrections.

*Hints, in order:*

- The byte is signed, so its sign must survive the load.
- Zero-extending a negative gradient turns it into a positive value. Use the byte load that copies the sign bit into the added bits.
- The byte `f9` represents −7. A signed byte load into `w2` preserves −7 while leaving the correction in `w1` available for the addition.
- Add the values in `w2` and `w1`, putting the result in `w0`, then return.
- Under `adjust_gradient:`, write `ldrsb w2, [x0]`, `add w0, w2, w1` and `ret`.

## 6. Using an unsigned load for a signed reading

The changed program uses `ldrb` where `ldrsb` was needed. Memory contains `f9`, and the correction in `w1` is 10. The addition is unchanged.

**What hexadecimal result does the changed program return in `w0`?**

*After committing the prediction:*

The changed program returns `0x00000103`, or 259. `ldrb` zero-extends `f9` to 249, then the addition adds 10. The signed load would have produced −7, giving a result of 3.

The error happens at the load. The addition cannot recover the byte's intended signed interpretation after zero extension has changed its value.

## 7. Extend bits already in a register

Extension can also work on bits already in a register. `sxtb w0, w0` takes the low byte and sign-extends it to 32 bits. `uxtb w0, w0` takes the low byte and zero-extends it to 32 bits. Neither instruction reads memory.

A C **cast** requests a conversion: `(signed char)value` converts `value` to `signed char`. In the recorded GCC listing, that cast becomes `sxtb`. For `(unsigned char)value`, this GCC version uses `and` with 255, which keeps the low byte. The separate `uxtb` example is course-written assembly with the same effect on the register.

*Closed note: When a signed cast is out of range*

The course cites C draft N3096. Its rule for conversion to a signed integer type leaves an out-of-range result to the implementation, or allows an implementation-defined signal. A signal is a notification that can interrupt the program's normal execution. The C implementation must document its choice.

The recorded GCC listing shows this compiler's choice. Do not treat that choice as a guarantee for every C implementation.

Conversion to an unsigned integer type follows the unsigned range's wrapping rule. The unsigned-byte cast keeps a result in the range 0 to 255.

*End of closed note.*

## 8. Choose the width needed by the next operation

Choose extension from the source value's interpretation and the width you need next. `sxtw x0, w0` sign-extends a 32-bit value to 64 bits. It can turn a signed `int` result into the matching `long` value on this target.

An instruction can combine extension with arithmetic. In `add x0, x0, w1, sxtw`, the processor sign-extends `w1` to 64 bits before adding it to `x0`. It does not change `w1`. The recorded C function uses this form to add an `int` adjustment to a `long` total.

For a record containing several fields, choose the right load for each field. `[x0, #4]` means memory four bytes after the address in `x0`. The number after `#` is a byte offset; it does not change `x0`.

## 9. Read the sensor record

### Write read_sensors

Read the trip computer's eight-byte sensor record. `x0` holds its starting address. The record contains these fields:

- Bytes 0 to 3: an unsigned 32-bit distance.
- Byte 4: a signed 8-bit gradient.
- Byte 5: an unsigned 8-bit fuel level.
- Bytes 6 to 7: an unsigned 16-bit pulse count.

Put the distance in `w0`, the sign-extended gradient in `w1`, the fuel level in `w2`, and the pulse count in `w3`. Leave every memory byte unchanged. Then return.

This exercise checks all four registers. Only `w0` is the ordinary C return-value register. Plan the order of your loads so that the starting address remains available until the last memory access.

*Hints, in order:*

- Choose each load from the field's width and whether it is signed.
- Using one load width or one extension rule for every field can read neighbouring bytes or misread a negative gradient. Check each field separately.
- Consider just the gradient: it occupies byte 4 and is signed. Its load must use offset 4 and copy the byte's sign bit into the added bits.
- Loading the distance into `w0` also overwrites `x0`. Load the other fields first, or preserve the starting address in another register.
- Under `read_sensors:`, use `ldrsb w1, [x0, #4]`, `ldrb w2, [x0, #5]`, `ldrh w3, [x0, #6]`, `ldr w0, [x0]` and `ret`.

## 10. What you now know

- A memory byte has bits, but no signed or unsigned label.
- Zero extension fills added bits with zeros.
- Sign extension copies the source's sign bit into the added bits.
- A write through a `w` register name still clears the upper half of the `x` register.
- A record can need different load widths for different fields.

Why does `ldrsb w0, [x0]` produce a different full `x0` value from `ldrsb x0, [x0]` for a negative byte?

*Closed note: Answer*

The `w0` form sign-extends only to 32 bits, then clears the upper half of `x0`. The `x0` form sign-extends through all 64 bits. Their low 32 bits agree, but their upper 32 bits differ for a negative byte.

*End of closed note.*

## Model and reality

The diagrams show the simulator copying and extending bits. These operations describe the instruction's result, not the order of internal steps in a processor.

The sensor record has a byte layout defined for this exercise. A compiler may arrange the fields of a C record differently. The exercise supplies the bytes and addresses, so you can study loads without first obtaining storage or communicating with a hardware sensor.

## Figure captions and labels

read_fuel returns an unsigned byte as an unsigned 32-bit value.

Predict the result of a signed byte load into w0.

Read the gradient byte and follow the added bits in w0 and x0.

Read the same byte with zero extension.

Read two bytes with zero extension into w0.

Read two bytes with sign extension into w0.

Read four bytes with sign extension into x0.

Read one byte with sign extension into x0.

Load a signed gradient, add a correction and return the result.

Predict the correction result after changing ldrsb to ldrb.

Follow the unsigned byte load and the addition.

Sign-extend the low byte already held in w0.

GCC uses and to keep the low byte for an unsigned char cast.

Zero-extend the low byte already held in w0.

Sign-extend a 32-bit value into x0.

Sign-extend w1 before adding it to x0.

Read four sensor fields with the required widths and interpretations.

0x000000f9

0x0000fff9

0xfffffff9

0x00000007

0x00000003

0x00000103

0x000000f9

0xfffffff9

Gradient −7, correction 10

Gradient zero, correction zero

Gradient 127, correction 1

Gradient −128, correction zero

Gradient −1, correction 1

Gradient −128, correction 128

Gradient 127, correction −128

Read a record with a negative gradient

Read a record with all fields zero

Read each field at its maximum value

Read fields whose highest stored bit is set

Keep each field separate from its neighbours

## Originality record

Loading the same byte as a signed and unsigned integer in isolation.

A gradient correction makes the consequence of the load choice visible. The final trip-computer record combines four field widths and interpretations while requiring the learner to preserve its address.

## Figure captions and labels

ldrb w0: unsigned byte

ldrsb w0: signed byte

ldrh w0: unsigned halfword

ldrsh w0: signed halfword

ldrsw x0: signed word

ldrsb x0: signed byte

Compare load widths and extension from the same source bytes.

# Memory figure interface

Parameterized messages use example values and placeholders. The figures substitute values from the simulator.

## inspectSource

Inspect C and instructions

## comparison

Instruction to compare

## addressUsed

Address used

## before

Before

## after

After

## memory

Memory bytes

## addresses

Addresses increase from left to right, then continue on the next row.

## byte

Address 0x00410000: byte f9

Address {address}: byte {byte}

## untouchedLegend

Other bytes: not accessed

## registerOrder

Register bits: low → high, left to right.

## showBits

Show byte bits

## hideBits

Hide byte bits

## loaded

Read by this instruction

## stored

Written by this instruction

## storeSource

Copied to memory

## unchanged

Not accessed by this instruction

## registers

Registers

## transfer

Where the instruction copies bits

## sourceBits

Bits 0 to 7

Bits {from} to {to}

## loadedBits

Copied from memory

## copiedBits

Copied from the source register

## zeroFill

Filled with zeros

## signFill

Filled with copies of the sign bit

## clearedUpper

Cleared by writing a w register

## register

Register w0

Register {register}

## noTransfer

This instruction does not load or store memory.

## loadTransfer

ldrb reads 1 byte starting at 0x00410000 into w0.

ldrh reads 2 bytes starting at 0x00410000 into w0.

{instruction} reads {count} bytes starting at {address} into {register}.

## storeTransfer

strb writes 1 byte from w0, starting at 0x00410000.

strh writes 2 bytes from w0, starting at 0x00410000.

{instruction} writes {count} bytes from {register}, starting at {address}.

## memoryOutcome

Memory starting at 0x00410000 contains 78 56 34 12.

Memory starting at {address} contains {bytes}.

## registerOutcome

w0 holds 0xfffffff9.

{register} holds {value}.

## extensionTransfer

sxtb copies low bits from w0 and extends them into w0.

{instruction} copies low bits from {source} and extends them into {destination}.

# Array element groups

## elementAddresses

Each element groups its bytes in address order.

## element

Element 0

Element {index}

# Memory runtime feedback

## fixtureConflict

This exercise supplies the memory bytes. Remove data declarations and section directives from your code, then try again.

# Shared course copy

## Simulator model note

Each step runs one instruction in the simulator. Between steps, the simulated processor stays as the last instruction left it.

## Before you start: C prerequisites

You do not need to know about pointers, structs, `malloc` or the standard library. Module 6 introduces pointers as addresses. You do not need a compiler; the lessons run in your browser.
