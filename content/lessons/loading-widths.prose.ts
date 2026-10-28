// Copyright © 2026 Christopher Snow

// Module 6, lesson 2. Kept word for word in docs/notes/module-6/prose.md.
export const PROSE = {
  question:
    "A fuel-level reading and a road-gradient reading each occupy one byte. Fuel level is unsigned. Gradient is signed, so a downhill reading can be negative. **How does a load preserve that difference when the register is wider than the stored value?**\n\n" +
    "The C types make the intended interpretation explicit: `unsigned char` for fuel and `signed char` for gradient. Both occupy one byte on this target. We do not rely on whether plain `char` is signed.",
  questionNoteSummary: "The compiler and C types",
  questionNote:
    "These listings use GCC 16.1 with `-O1` for little-endian AArch64 Linux. As in the previous lesson, `char` is 8 bits, `short` 16, `int` 32, and `long` and pointers 64.\n\n" +
    "The return type can be wider than the value in memory. Returning an `unsigned char` as `unsigned`, or a `signed char` as `int`, preserves that value.",
  motivation:
    "`ldrb w0, [x0]` reads one byte. It puts that byte in the low 8 bits of `w0` and fills the remaining bits with zeros. This is **zero extension**: adding zero bits above the original value.\n\n" +
    "`ldrsb w0, [x0]` also reads one byte. It fills the remaining bits of `w0` with copies of the byte's highest bit, its sign bit. This is **sign extension**. A non-negative byte gets zeros above it; a negative byte gets ones. The wider signed value stays the same.\n\n" +
    "Both instructions write a `w` register, so both clear the upper 32 bits of the corresponding `x` register. Extending a byte into `w0` and clearing the upper half of `x0` are separate parts of the instruction's effect.",
  prediction:
    "The byte at the address in `x0` is `f9`. Its highest bit is 1. GCC uses `ldrsb w0, [x0]` to return this gradient as an `int`.",
  predictionQuestion: "**What hexadecimal value does `w0` hold after the load?**",
  predictionExplain:
    "`w0` holds `0xfffffff9`, which represents −7 as a signed 32-bit value. The load copies the byte `f9` and fills the next 24 bits with ones. An unsigned `ldrb` of the same byte would produce `0x000000f9`, or 249.\n\n" +
    "The full `x0` register holds `0x00000000fffffff9`. Its upper 32 bits are zero because the instruction wrote `w0`. That 64-bit pattern does not represent −7 as a signed 64-bit value.",
  investigation:
    "Choose a load in the comparison, then press Next. Switch between `ldrb w0` and `ldrsb w0` to compare the same byte at the same step. Both copy the stored bits into the low end of `w0`. Above those bits, `ldrb` adds zeros and `ldrsb` copies the sign bit. Neither instruction changes memory.\n\n" +
    "The same distinction applies to two-byte values. `ldrh` reads two bytes and zero-extends them. `ldrsh` reads two bytes and sign-extends them. In these listings, `unsigned short` selects `ldrh` and signed `short` selects `ldrsh`.\n\n" +
    "The destination also matters. `ldrsb x0, [x0]` sign-extends its byte through all 64 bits. `ldrsw x0, [x0]` reads four bytes and sign-extends that 32-bit value to 64 bits. GCC uses the latter when returning a stored `int` as a `long` on this target.\n\n" +
    "Use the comparison to separate three regions: the bits read from memory, the bits added by extension, and any upper bits cleared by a write through a `w` register name.",
  construction:
    "A gradient correction must treat the stored byte as signed before adding. Otherwise, a negative reading becomes a large positive input to the addition.",
  writeTask:
    "Write `adjust_gradient`. `x0` holds the address of a signed one-byte gradient. `w1` holds a signed 32-bit correction. Load the gradient, add the correction, and return the signed 32-bit result in `w0`. Leave memory unchanged.\n\n" +
    "All test results fit in a signed 32-bit value. The tests include positive and negative gradients and corrections.",
  writeHints: [
    "The byte is signed, so its sign must survive the load.",
    "Zero-extending a negative gradient turns it into a positive value. Use the byte load that copies the sign bit into the added bits.",
    "The byte `f9` represents −7. A signed byte load into `w2` preserves −7 while leaving the correction in `w1` available for the addition.",
    "Add the values in `w2` and `w1`, putting the result in `w0`, then return.",
    "Under `adjust_gradient:`, write `ldrsb w2, [x0]`, `add w0, w2, w1` and `ret`.",
  ] as const,
  failureExperiment:
    "The changed program uses `ldrb` where `ldrsb` was needed. Memory contains `f9`, and the correction in `w1` is 10. The addition is unchanged.",
  failureQuestion: "**What hexadecimal result does the changed program return in `w0`?**",
  failureExplain:
    "The changed program returns `0x00000103`, or 259. `ldrb` zero-extends `f9` to 249, then the addition adds 10. The signed load would have produced −7, giving a result of 3.\n\n" +
    "The error happens at the load. The addition cannot recover the byte's intended signed interpretation after zero extension has changed its value.",
  explanation:
    "Extension can also work on bits already in a register. `sxtb w0, w0` takes the low byte and sign-extends it to 32 bits. `uxtb w0, w0` takes the low byte and zero-extends it to 32 bits. Neither instruction reads memory.\n\n" +
    "A C **cast** requests a conversion: `(signed char)value` converts `value` to `signed char`. In the recorded GCC listing, that cast becomes `sxtb`. For `(unsigned char)value`, this GCC version uses `and` with 255, which keeps the low byte. The separate `uxtb` example is course-written assembly with the same effect on the register.",
  explanationNoteSummary: "When a signed cast is out of range",
  explanationNote:
    "The course cites C draft N3096. Its rule for conversion to a signed integer type leaves an out-of-range result to the implementation, or allows an implementation-defined signal. A signal is a notification that can interrupt the program's normal execution. The C implementation must document its choice.\n\n" +
    "The recorded GCC listing shows this compiler's choice. Do not treat that choice as a guarantee for every C implementation.\n\n" +
    "Conversion to an unsigned integer type follows the unsigned range's wrapping rule. The unsigned-byte cast keeps a result in the range 0 to 255.",
  generalisation:
    "Choose extension from the source value's interpretation and the width you need next. `sxtw x0, w0` sign-extends a 32-bit value to 64 bits. It can turn a signed `int` result into the matching `long` value on this target.\n\nAn instruction can combine extension with arithmetic. In `add x0, x0, w1, sxtw`, the processor sign-extends `w1` to 64 bits before adding it to `x0`. It does not change `w1`. The recorded C function uses this form to add an `int` adjustment to a `long` total.\n\nFor a record containing several fields, choose the right load for each field. `[x0, #4]` means memory four bytes after the address in `x0`. The number after `#` is a byte offset; it does not change `x0`.\n\nThe next exercise supplies a sensor record with a chosen byte layout. Its bytes are already in memory; no hardware sensor is connected. A compiler may lay out a C record differently.",
  finalTask:
    "Read the trip computer's eight-byte sensor record. `x0` holds its starting address. The record contains these fields:\n\n" +
    "- Bytes 0 to 3: an unsigned 32-bit distance.\n- Byte 4: a signed 8-bit gradient.\n- Byte 5: an unsigned 8-bit fuel level.\n- Bytes 6 to 7: an unsigned 16-bit pulse count.\n\n" +
    "Put the distance in `w0`, the sign-extended gradient in `w1`, the fuel level in `w2`, and the pulse count in `w3`. Leave every memory byte unchanged. Then return.\n\n" +
    "This exercise checks all four registers. Only `w0` is the ordinary C return-value register. Plan the order of your loads so that the starting address remains available until the last memory access.",
  finalHints: [
    "Choose each load from the field's width and whether it is signed.",
    "Using one load width or one extension rule for every field can read neighbouring bytes or misread a negative gradient. Check each field separately.",
    "Consider just the gradient: it occupies byte 4 and is signed. Its load must use offset 4 and copy the byte's sign bit into the added bits.",
    "Loading the distance into `w0` also overwrites `x0`. Load the other fields first, or preserve the starting address in another register.",
    "Under `read_sensors:`, use `ldrsb w1, [x0, #4]`, `ldrb w2, [x0, #5]`, `ldrh w3, [x0, #6]`, `ldr w0, [x0]` and `ret`.",
  ] as const,
  reflection:
    "- A memory byte has bits, but no signed or unsigned label.\n- Zero extension fills added bits with zeros.\n- Sign extension copies the source's sign bit into the added bits.\n- A write through a `w` register name still clears the upper half of the `x` register.\n- A record can need different load widths for different fields.",
  modelVsReality: "",
  originalityNote: {
    textbookExample: "Loading the same byte as a signed and unsigned integer in isolation.",
    howThisDiffers:
      "A gradient correction makes the consequence of the load choice visible. The final trip-computer record combines four field widths and interpretations while requiring the learner to preserve its address.",
  },
} as const;
