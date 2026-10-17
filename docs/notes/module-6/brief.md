# Module 6 drafting brief

Use the checked facts and actual compiler listings in this directory, with the lesson sequence
in `../module-6-plan.md`. Follow `docs/style.md` and `docs/authoring.md`. Draft learner prose
separately from implementation; keep labels, hints, feedback and optional notes in that pass.

The author wants clear, plain English that explains what a register holds. Explain each new
piece of notation at first use. A pointer is an address; loading through it copies the bytes
at that address. A store changes memory. Neither operation should be described merely as
replacing one variable with another.

The learner should be able to explain and use these distinctions:

- An address, the byte at that address, and a multi-byte value beginning there.
- The order of bytes in memory and the order of bits in a written hexadecimal number.
- The address register's width and the number of bytes transferred by an instruction.
- The bytes a narrow store changes and the neighbouring bytes it leaves alone.
- The bits copied from memory, the bits added by extension, and the upper half cleared by a
  write through a `w` register name.
- A signed or unsigned reading, the C declaration that requests it, and the load the recorded
  compiler selects. The memory bytes themselves carry no signedness label.

Keep target-specific sizes and compiler choices scoped. Do not imply all C implementations
have 64-bit pointers or eight-bit bytes, or that plain `char` is always signed. The examples
use valid objects; an assembler accepting an address does not establish that a C access is valid.

Use small examples beside the mechanism. Predictions must remain unanswered until commitment.
Only show figure captions that describe what the implemented figure actually displays. Closed
notes can cover related widths and instruction forms, but the exercises must not depend on
an explanation the learner has not encountered.
