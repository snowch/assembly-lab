<!-- Copyright © 2026 Christopher Snow -->

# English review: Memory and addresses

Scope: Module 6, lesson 1 (`memory-and-addresses`), review only. No course text changed. Severity: medium means a plausible misunderstanding of a teaching instruction; low means a local comprehension obstacle that does not prevent the exercises.

## Findings

1. **Medium: the hint headings misdescribe the text beneath them.** Source: `content/lessons/memory-and-addresses.prose.ts:34–35`, with headings from `platform/lesson-runtime/src/strings.ts:122`. Exact rendered pairing: **“COMMON MISTAKE” / “Use the value in w1 as the source and the address in x0 as the destination.”** The imperative describes the correct action, but its heading presents it as a mistake. The next pairing, **“SMALLER EXAMPLE” / “Put the address register inside square brackets.”**, supplies a syntax instruction rather than an example. The final exercise similarly places “Load four bytes from the address in x0.” (`:59`) under “COMMON MISTAKE”. A learner consulting hints because they are unsure may read the recommended operation as the operation to avoid. Direction: make each hint perform the function its heading promises, or use headings that accurately describe these hints. This is a semantic mismatch, not a request for more elaborate hints.

2. **Low: the reality note assumes an unexplained C term and an unspecified condition.** Source: `content/lessons/memory-and-addresses.prose.ts:71`. Exact quote: **“Real programs must also have permission to access memory, and C requires a valid object of a suitable type.”** “Object” has a specialised C meaning that is neither in the prerequisite panel nor explained in the earlier lessons. “Valid” and “suitable” do not tell this learner what makes the memory acceptable for the pointer access just introduced. The sentence names a restriction without providing enough meaning to understand it. Direction: explain the relevant meaning of object and what the type must be suitable for, at the level needed to interpret this note. A full treatment of C memory rules is unnecessary.

## Prerequisite verification

Read `CLAUDE.md`, `docs/style.md`, the front-page prerequisite panel (`apps/course/src/strings.ts`), and earlier lesson prose through `counting-down`, following the lesson order in `content/lessons/index.ts`. The panel explicitly excludes prior pointer knowledge and assumes only small C functions with integer arguments/returns, conditions, loops and array indexing.

Checked rather than flagged:

- GCC and `-O1`: `meet-the-machine.prose.ts:10,16–18` introduces the compiler and setting.
- `ret` and arguments/results in registers: `meet-the-machine.prose.ts:56,93`.
- Hexadecimal, `0x`, bit significance and set/clear: `one-pattern-three-readings.prose.ts:24–33`.
- The 64-bit register and its `w` view, clearing the upper bits: `constants-and-widths.prose.ts`, reinforced explicitly in this lesson's motivation.
- `long`: `constants-and-widths.prose.ts:72` introduces it as an integer type.
- Memory: introduced as storage outside registers in `meet-the-machine.prose.ts:77`; bytes, addresses, pointers, dereference, `const`, load/store, brackets, endianness and halfword are explained locally here.
- Labels and their colons: earlier branches lesson; the hints' use of function labels is not a new syntax assumption.

Outstanding assumed knowledge is the specialised C “object”/validity condition in finding 2. No later lesson was used to dismiss a prerequisite concern.

## Coverage and browser evidence

Read the complete lesson source: `.prose.ts`, `.labels.ts`, `.ts`, and the relevant displayed listings in `memory.listings.ts`; also memory figure strings in `packages/views/src/strings.memory.ts`, memory-specific feedback in `strings.memory-runtime.ts`, and runtime hint headings.

Used the already-built site at `http://localhost:4220/assembly-lab/#/lesson/memory-and-addresses` with Chromium at **1280 × 900** and **375 × 900**, each in **light and dark** themes. Opened all details; checked both predictions; revealed all five hints for each of the two exercises; ran starting-code failures and successful tests; stepped each available memory figure through its instructions. Read initial, failed and completed rendered text for the prose, labels, C/instruction listings, predictions/explanations, both exercise tasks, all ten hints, test feedback, reflection answer and both simulator notes. No build or full test suite run.

Temporary evidence (not committed): `/tmp/english11.mjs`; `/tmp/english11-initial-{width}-{theme}.txt`, `/tmp/english11-failed-{width}-{theme}.txt`, `/tmp/english11-{width}-{theme}.txt`; full-page screenshots `/tmp/english11-{width}-{theme}.png` and inspected upper-page crops `/tmp/english11-top-{width}-{theme}.png`, for both widths and themes. The wording findings are the same in all four configurations. Full-page captures preserve the opened hints and notes. No challenge solutions are recorded in this review.
