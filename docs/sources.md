# Sources

What every technical claim in the course rests on, and the licences of what the site ships. A
claim is checked against the source named here for its kind, and the lesson's module note
records which section of which issue it was checked against. Memory is not a source.

## The instruction set

| Source | Used for | Reached from the build containers |
| --- | --- | --- |
| Arm, *Arm Architecture Reference Manual for A-profile architecture* (DDI 0487), the current issue at developer.arm.com | every claim about an A64 or A32 instruction: what it does, its flags, its operands, which constants it accepts, what happens at the edges (division by zero, shifts by the width) | **no**, at checkpoint 1: developer.arm.com is outside the container's network allowlist |
| Arm, *Procedure Call Standard for the Arm 64-bit Architecture* (AAPCS64), release 2025Q4, `ARM-software/abi-aa` on GitHub | which registers carry arguments and results, which a function must preserve, the stack's alignment, how narrow arguments are extended | yes, through raw.githubusercontent.com |
| Arm, *Procedure Call Standard for the Arm Architecture* (AAPCS32), same repository | the optional chapter on 32-bit ARM | yes, as above |
| the GNU assembler manual, "AArch64 Dependent Features" (sourceware.org) | the syntax the course's assembler accepts, which is the syntax GCC prints | **no**, at checkpoint 1 |
| QEMU's user-mode emulation (`qemu-aarch64`), Ubuntu's `qemu-user` package | the differential test: what a program actually does on an emulated CPU | the package is installable; qemu.org's documentation is not reachable |

## The compiler

| Source | Used for |
| --- | --- |
| GCC, through Compiler Explorer's API (`https://godbolt.org/api/`) | every listing a lesson shows or describes, recorded in the repository with the compiler's id, version and flags (`docs/notes/checkpoint-1/listings.md` is the first) |
| Compiler Explorer's `docs/API.md` and `docs/Privacy.md`, `compiler-explorer/compiler-explorer` on GitHub, read 16 October 2026 | the panel's rules in `CLAUDE.md`: the API is offered for compiling to assembly, may gain rate limits or authentication later, and its cross-origin headers allow a page on another origin to call it (`access-control-allow-origin: *`, checked by a preflight request on 16 October 2026); submitted source is stored temporarily and appears hashed in analytics logs |
| Compiler Explorer's licence (BSD 2-Clause) | none needed for calling the hosted API; recorded in case the course ever self-hosts it |

## C

| Source | Used for |
| --- | --- |
| ISO/IEC 9899:2024 (C23), through its public drafts on open-std.org (WG14) | what C defines, leaves to the implementation, or leaves undefined: signed overflow, conversions to a narrower signed type, `INT_MIN / -1`, `<stdckdint.h>` |
| GCC's manual, for `-fwrapv`, `-ftrapv`, `-fsanitize=`, `-W` options | the lessons' advice on catching errors |
| GCC's manual, "C Implementation-Defined Behavior", Integers (`gcc/doc/implement-c.texi`, read through the `gcc-mirror/gcc` repository on GitHub, 17 October 2026) | Module 3's shifts: signed `>>` of a negative value acts by sign extension in GCC; C99 and later leave some signed `<<` undefined, and GCC, as an extension, does not treat them as undefined |

open-std.org and gcc.gnu.org were not reachable from the build containers at checkpoint 1, nor on 17 October 2026; GitHub's raw files were.

During the Module 5 work later on 17 October 2026, open-std.org was reachable. The review used
[C23 draft N3096](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n3096.pdf), dated 1 April 2023:
6.2.5 paragraph 11 for unsigned arithmetic, and 6.8.5 through 6.8.5.3 for repetition,
the permission to assume termination, and the order of `while`, `do` and `for` operations.
`docs/notes/module-5/listings.md` records the application of those clauses to the lessons.

Module 6 also checks the integer conversions in N3096 section 6.3.1.3, including the
implementation-defined result or signal for an out-of-range conversion to a signed type.
The AAPCS64 2025Q4 sections on fundamental data types, byte order and C/C++ language mappings
support the selected target's sizes and LP64 data model. The course uses little-endian memory;
AAPCS64 also describes big-endian operation. The exact compiler choices and executable checks
are recorded in `docs/notes/module-6/listings.md` and `docs/notes/module-6/facts/runs.md`.

## What the site ships, and its licences

| What | Licence |
| --- | --- |
| Source Sans 3, Archivo, JetBrains Mono, through `@fontsource-variable` | SIL Open Font License 1.1 |
| React | MIT |
| three Material Icons (`info`, `expand_more`, `lock`), drawn as CSS masks | Apache License 2.0 (Google) |
| the learning platform's packages (`platform/`) | the author's own |

The scaffold's build records the exact packages; a licence check like metadata-systems' joins
`scripts/check.sh` when the first lesson adds a runtime dependency.

## Native execution and debugging (Module 12)

The assembly-only boot path uses [the checked boot brief](notes/module-12/boot-facts.md),
including executed startup facts, QEMU direct ELF loading and qualified firmware/BIOS/UEFI
comparisons. The [earlier source brief](notes/module-12/sources-brief.md) retains GNU manuals,
AAPCS64, PL011 references and sources for the optional Linux comparison. [Native verification](../scripts/native/README.md) distinguishes executable
checks from source claims. The reference output and exact observed tool versions are in
`content/lessons/module-12.evidence.json`; this is emulation evidence, not physical hardware
measurement. The ordinary arithmetic examples retain the simulator differential checks.

## Raspberry Pi 5 (Module 13)

The [Pi 5 source and validation brief](notes/module-13/facts.md) records the selected firmware,
boot configuration, debug connector and UART sources. The course ships its own assembly
program and an explicit raw-image configuration, not Raspberry Pi firmware binaries.
Build/layout checks are separate from physical verification on the selected Pi 5 board.

## Independent practice (Where next)

The optional [Where next source record](notes/where-next/facts.md) checks the AArch64 Playground
README and actual import/step/run/check behaviour at phone and desktop widths. The course's
plain-assembly starter is checked separately against its model and GNU/QEMU. The external
runtime is another emulator with its own supported instructions, library emulation and limits;
these checks do not establish hardware boot support or general emulator equivalence. Linking
the project does not include its implementation in Assembly Lab.
