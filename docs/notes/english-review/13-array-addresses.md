<!-- Copyright © 2026 Christopher Snow -->

# English review: Array addresses and moving pointers

Scope: Module 7, lesson 1, `array-addresses`. Review only; no course edits. Read against `CLAUDE.md` and both closing passes in `docs/style.md`, using the front-page prerequisites and earlier lessons only.

## Findings

No substantive English clarity findings. The page supplies the steps needed to turn an element index into a byte address, distinguishes pointer updates from the loaded value, and states both zero-count and memory-bound requirements. No cosmetic changes are proposed.

## Prerequisites checked

Read the front-page “Before you start” (`apps/course/src/strings.ts:24`) and preceding lesson prose, including details, in course order: Meet the machine; One pattern, three readings; Constants and widths; Adding and the flags; Subtracting and the tick counter; Masks; Shifts; Compare and choose; Branches; Counting up; Counting down; Memory and addresses; Loading widths.

The front page explicitly permits arrays indexed with `a[i]`, basic C functions and loops. It does not assume pointers. Earlier teaching supplies:

- GCC, listings and `-O1`: `meet-the-machine.prose.ts`, question and compiler note.
- Register widths, overlapping `w`/`x` views, and optional `#`: `constants-and-widths.prose.ts`, construction and failure experiment.
- Wrapping and “modulo 2³²”: `subtracting-and-the-tick-counter.prose.ts`, question and generalisation.
- Left shifts and shifts within another instruction's operand: `shifts.prose.ts`, motivation, investigation and generalisation.
- Comparisons, labels, conditional branches and `cbz`: Compare and choose and Branches.
- Countdown loops, `--`, zero-count checks, and branches using subtraction's flags: `counting-down.prose.ts`, question, motivation and investigation.
- Bytes, addresses, pointers, dereferencing, `const`, little-endian order, target sizes, loads and stores: `memory-and-addresses.prose.ts`, question through investigation.
- Zero extension and an arithmetic operand with an extension: `loading-widths.prose.ts:13` and `:52–56`.

The current lesson itself defines array, element and index (`array-addresses.prose.ts:6`), explains the scaled addressing operand (`:12`), pre-index and post-index (`:18`), pointer arithmetic, `*trips++`, `+=` and `uxtw` (`:36`), and the permitted stopping position immediately after an array (`:38`). No unsupported prerequisite was identified. The distinction between a readable simulated address and a valid C access is stated explicitly in the compiler note and model note; no later lesson was used to fill it in.

## Coverage and browser evidence

Read all ten sections, objectives, captions, C and assembly listings, both predictions and explanations, both closed notes, both challenge tasks, all five hints for each challenge, test labels and failed-test feedback, memory and register labels, stepping controls and status text, and both simulator notes. Sources include `array-addresses.prose.ts`, `array-addresses.labels.ts`, `array-addresses.ts`, `arrays.listings.ts`, shared view strings, memory strings and runtime strings. The reference instructions were inspected only to understand the learner-facing final hints; this note reproduces no exercise answers.

Used the existing built site at `http://localhost:4220/assembly-lab/#/lesson/array-addresses` in Chromium at 1280 × 900 and 375 × 900, with light and dark colour schemes. In each configuration, opened details, submitted both predictions, revealed all ten hints, ran both starting challenge programs to expose failed-test feedback, and stepped all six memory figures through their complete runs. Read the resulting text, including transfer explanations and returned statuses. No horizontal overflow occurred, and no width- or theme-dependent English ambiguity was found.

Temporary reviewer-owned evidence: `/tmp/english13.mjs`, `/tmp/english13-{1280,375}-{light,dark}.txt` and matching full-page `.png` screenshots. No build or full test suite was run.
