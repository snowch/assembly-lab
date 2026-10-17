# Module 6 plan: Loads, stores and widths

The author requested Module 6 after the reviewed Module 5 draft. The course continues with
the A64 machine, recorded GCC examples and trip computer described in the main plan.

## Lessons and prerequisites

1. **Memory and addresses** (`memory-and-addresses`) introduces bytes with numbered addresses,
   a pointer as an address, loads, stores and little-endian order. The learner follows a distance
   reading from four memory bytes into a register, stores a replacement, and copies it to a
   second location. Narrow stores show why writing too many bytes changes a neighbouring field.
2. **Loading different widths** (`loading-widths`) compares an unsigned fuel byte with a signed
   road-gradient byte. Zero extension and sign extension make their different register values
   visible. The learner adjusts a signed reading, then reads a sensor record containing fields
   of different widths into selected registers.

The learner knows registers, the relationship between `w` and `x`, hexadecimal, signed and
unsigned readings, arithmetic, masks, shifts, flags and loops. Memory and pointers are new.
Explain `unsigned *p`, `*p`, square brackets in assembly and byte offsets before using them.
Module 7 will build on this basic pointer explanation to teach arrays and pointer arithmetic.
The sensor record has an explicit byte layout; no C structure-layout knowledge is assumed.

## Instructions

- The first lesson introduces `ldr`, `str`, `strb` and `strh`. A `w` load/store transfers four
  bytes and an `x` load/store transfers eight. The narrow stores take the low byte or two bytes.
- The second introduces `ldrb`, `ldrsb`, `ldrh`, `ldrsh`, `ldrsw`, `sxtb`, `uxtb` and `sxtw`.
  It also explains the extended-register form of the already taught `add`.
- Byte and halfword signed loads into `w` extend to 32 bits; the write still clears the upper
  half of `x`. Signed loads into `x` and `ldrsw` extend to 64 bits. Figures must show this distinction.

Use the recorded compiler's instruction spelling. GCC's unsigned-byte cast uses `and`; an
equivalent `uxtb` example is labelled course-authored assembly, not compiler output.

## Evidence and model support

Actual GCC 16.1.0 AArch64 output at `-O1`, raw requests and responses, and original C are
recorded under `module-6/compiler/`. `module-6/listings.md` and the facts tests connect claims
to this evidence. Target sizes and byte order describe the selected AArch64 Linux target,
not every C implementation. Signedness is explicit for byte quantities.

The machine already implements these instructions and memory traces. Extend the view and
grader interfaces to supply typed register arguments and a separate byte fixture. Retain
exact 64-bit values as strings or big integers rather than rounding through JavaScript numbers.
The fixture occupies the simulator's existing data region; it is not part of the editable
program. Check the whole fixture after stores so an over-wide write cannot pass unnoticed.

A new memory stepper draws addressed bytes, highlights the bytes actually read or written,
and shows their correspondence with register bits. An extension view distinguishes loaded
bits, filled bits and the upper half cleared by a `w` write. These views are computed from
the trace and use the same prediction gates as earlier lessons.

Every shown program and challenge reference goes into the GNU as/QEMU differential corpus,
including changed instructions used in failure experiments. The comparison includes memory
bytes as well as registers and flags. The lesson note explains the model's limited memory map
and distinguishes instruction behaviour from C rules about valid objects and pointers.

## Exercises and originality

The first lesson's exercises store a distance value and copy it between two locations. Cases
include zero, high bits and distinct neighbouring bytes. The second lesson adjusts a signed
gradient and reads a sensor record: distance at offset 0, gradient at 4, fuel at 5 and a
two-byte pulse count at 6. The record exercise inspects four registers; only `w0` is the usual
C return value. Reading through `x0` must finish before a write to `w0` replaces that address.

This develops the course's existing trip computer rather than reproducing a generic string
copy, textbook memory diagram or temperature-conversion example. The byte layout and exercise
cases are course-authored. Addresses identify bytes; the data stored at an address is a
separate value. Make that distinction explicit throughout the prose and figures.

## Drafting and review

Use separate checked-evidence, prose-drafting and implementation passes. Independent learner
reviews cover each complete lesson on desktop and phone, in both themes. A technical reviewer
checks instruction semantics, C qualifications, figures, exact wide values and graders.
Challenge findings against the sources, fix supported findings and check the rendered fixes.
Record accepted and rejected findings and final validation under `module-6/review.md`.
