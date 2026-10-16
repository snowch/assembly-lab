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

PENDING: filled in from the reader's and the sceptic's reports.

### What the build containers cannot reach

developer.arm.com (Arm's architecture reference manual), open-std.org (the C standard's drafts),
sourceware.org (the GNU assembler's manual), gcc.gnu.org and qemu.org were outside the network
allowlist on 16 October 2026. GitHub, Compiler Explorer and the npm registry were reachable. The
accuracy rules need the first three before Module 0 is written; the author can add them to the
environment's allowlist.
