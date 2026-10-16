# Checkpoints

The reports written for the author at each checkpoint of the course plan (`docs/plan.md`, "The
checkpoints"), kept so the next stage can read what was decided and why.

## Checkpoint 1: the plan and the scaffold

Written on 16 October 2026 by the managing session.

### What exists

- **The course's rules and plan.** `CLAUDE.md` (binding rules, adapted from digital-design's and
  metadata-systems'), `docs/plan.md` (four parts, twelve modules and one optional chapter, the four
  decisions below, the model, the checkpoints), `docs/sources.md`, `docs/authoring.md`, and
  `docs/style.md` (the author's checklist, unchanged, with a preamble drafted by Haiku).
- **The evidence for Decision 1**: `docs/notes/checkpoint-1/listings.md`, the same C compiled for
  A64 and A32 by GCC on Compiler Explorer.
- **The scaffold**, live at <https://snowch.github.io/assembly-lab/>: the platform's packages as a
  checked copy, the course shell with a front page listing the planned modules from data, the
  check script that CI runs, and the deploy to GitHub Pages.

### The decisions for the author

1. **The machine.** Recommended: A64, with 32-bit `w` registers until memory arrives.
2. **The name.** Recommended: *Assembly Lab: From a Line of C to the Bits in a Register.*
3. **A running situation.** Recommended: a car's trip computer.
4. **What is optional.** Recommended: one chapter on 32-bit ARM.

`docs/plan.md` gives the reasons and the alternatives for each.

### The review of the plan

A reader on another model reviewed `docs/plan.md` against compiled listings, QEMU and GNU as runs,
the AAPCS documents and the family's rules, and wrote 22 findings (2 high, 11 medium, 9 low). An
independent sceptic attacked each one: 5 upheld, 11 upheld in part, 4 rejected, 2 already
answered. Both reports are in `docs/notes/checkpoint-1/review/`. Every surviving fix is in the
plan; the two that bear most on the decisions:

- **The divide.** The plan had said Armv7-A has no divide instruction. Divide is an optional
  extension on Armv7-A, which GCC does not assume for the baseline `-march=armv7-a` target, so
  that target's code calls `__aeabi_idiv`. The A32 column and the optional chapter now say so.
  The recommendation for A64 does not rest on it.
- **The calling convention.** Every capstone from Module 0 is a function, so arguments in `w0`,
  `w1`, the result in `w0` and `ret` now arrive in Module 0; Module 9 keeps what a function must
  preserve, and the stack.

The others: a write to `w0` clears the top half of `x0` (now in Module 1); the A64 `int8_t`
listing extends the operand rather than narrowing the result; the notes are written for 32-bit
ARM, which is now one of A64's stated costs; the optional chapter is recorded listings, not a
second model, and the plan prices the alternative; the trip computer's signed quantity is the
road's gradient, not a temperature, which digital-design already uses; hexadecimal is taught in
Module 1; and several smaller corrections to the module tables.

### What the build containers cannot reach

developer.arm.com (Arm's architecture reference manual), open-std.org (the C standard's drafts),
sourceware.org (the GNU assembler's manual), gcc.gnu.org and qemu.org were outside the network
allowlist on 16 October 2026. GitHub, Compiler Explorer and the npm registry were reachable. The
accuracy rules need the first three before Module 0 is written; the author can add them to the
environment's allowlist.
