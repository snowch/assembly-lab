# Optional A: recorded compilations and checked claims

The lesson compares three original trip-computer functions: `limit_trip`,
`service_marker` and `average_trip`. Each has the exact C, request and response in
`compiler/`. The requests were made on 17 October 2026 through Compiler Explorer:

| Target | Compiler ID | Version | Options |
| --- | --- | --- | --- |
| A32 | `carmg1520` | GCC 15.2.0 | `-O1 -marm -march=armv7-a` |
| A64 | `carm64g1610` | GCC 16.1.0 | `-O1` |

The compiler records retain the copyright comment in the C input. The lesson
omits that first line and subtracts one from the recorded source-line mapping.
`a32.facts.test.ts` checks every displayed line and source association against
the raw response, as well as the exact request options and C input.

The A32 output is static evidence. The course does not execute it or compare its
behaviour with an A32 simulator. All three A64 counterparts are present in the
GNU as/QEMU corpus as `moduleA-*.s`, with boundary calls in adjacent JSON files.
The numerical predictions and exercise answers come from the A64 simulator.

## Architecture and calling convention

Checked on 18 October 2026:

- [AAPCS32, 2025Q4](https://github.com/ARM-software/abi-aa/blob/2025Q4/aapcs32/aapcs32.rst),
  sections "Core registers", "Stack constraints at a public interface", and
  "Result Return": the first arguments use `r0` through `r3`; the scalar result
  here uses `r0`; `r14` is `lr`; `r4` is preserved; `SP mod 8 = 0` at a public
  interface. Saving `{r4, lr}` uses eight bytes and maintains that alignment.
- Arm's A32 instruction descriptions, public mirror:
  [MOV immediate](https://mikhailarkhipov.github.io/ARM-doc/A32/mov_i.html),
  [MOV register](https://mikhailarkhipov.github.io/ARM-doc/A32/mov_r.html),
  [MOVT](https://mikhailarkhipov.github.io/ARM-doc/A32/movt.html), and
  [BX](https://mikhailarkhipov.github.io/ARM-doc/A32/bx.html).
  The mirror identifies ISA `v01_31`, pseudocode `v2023-06_rel`, built 4 July 2023.
  MOV immediate encoding A2 (`movw`) zero-extends the 16-bit immediate into the
  32-bit destination. MOVT writes the upper 16 bits and leaves the lower 16 bits
  unchanged. BX branches to the register-supplied address, supporting the
  recorded leaf return through `lr`.
- The same mirror's [shared pseudocode](https://mikhailarkhipov.github.io/ARM-doc/A32/shared_pseudocode.html#impl-shared.ConditionHolds.1),
  `ConditionPassed` and `ConditionHolds`: the conditional move checks its
  condition before copying; CS tests the carry flag. The unsigned subtraction
  comparison has the carry-set meaning taught earlier in the course.
- [GCC 15.2 target definitions](https://github.com/gcc-mirror/gcc/blob/releases/gcc-15.2.0/gcc/config/arm/arm-cpus.in),
  `begin arch armv7-a`: the baseline selects `ARMv7a`; compare the separate
  feature groups `ARMv7a` and `ARMv7ve`. The latter adds `adiv` and `tdiv`,
  identified there as A32 and Thumb division instructions. The recorded
  output confirms the selected compiler's helper-call choice.

The exact compiler output establishes the use of `movcs`, `movw`, and the
`__aeabi_uidiv` library call in these configurations. The lesson limits its
division claim to the selected baseline Armv7-A target and nonzero divisors.
It does not claim that every A32 implementation needs a division helper.

## Exercise contracts

The recorded-token grader derives each instruction/helper answer from the
specified instruction in the recorded listing. It derives the final quotient
by running the A64 counterpart. It never executes A32. The syntax experiment
asks the actual course A64 assembler whether it accepts the selected A32 line;
the result describes this subset assembler, not the complete A64 architecture.

The optional chapter has internal module number 12 and displayed label A. It
contains ten sections, two answer exercises, and five hints for each exercise.
The existing caption for an A64 stepper is reused for the final average stepper.
The separately drafted text and labels are retained in `prose.md`, checked in
both directions by `module-a.prose.test.ts`.

Focused checks on 18 October: 26 facts, grading, rendering, helper and canonical
prose tests passed. GNU as 2.44 and QEMU 10.0.13 checked all three A64 programs:
10 calls, 35 instruction states, zero differences. Command:
`AL_TOOLS=/tmp/course-tools npm run check:real-tools -- --corpus --corpus-dir /tmp/module-a-evidence/corpus`,
with that temporary directory containing the three `moduleA-*` corpus pairs.
Full browser and independent
reviews are recorded separately when completed.
