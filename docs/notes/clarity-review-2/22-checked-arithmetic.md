# Fresh clarity review: Conversions and checked arithmetic

Copyright © 2026 Christopher Snow

18 October 2026. Lesson 22, `checked-arithmetic`, Module 11. Review only, against
`5cb518c` plus the approved Module 0 simulator sentence. No learner text changed.

## Result and previous-review reconciliation

No distinct new clarity issue. **L18 remains outstanding**, at low severity. The
fresh source and browser reading came before consulting the
[previous reader report](../english-review/22-checked-arithmetic.md) and
[retained list](../english-review/README.md). That comparison identifies the same
issue, rather than a new count.

### L18 — low: sanitizer “recovery” does not say what execution does

- Location: [checked-arithmetic.prose.ts](../../../content/lessons/checked-arithmetic.prose.ts),
  line 41, `generalisationNote`, “Warnings and run-time checks”.
- Exact quote: “GCC normally allows recovery after many reports;
  `-fno-sanitize-recover=undefined` makes a detected problem terminate the run.”
- Learner effect: “Recovery” can suggest that the sanitizer fixes the invalid
  calculation. The contrast with terminating hints that execution continues, but
  does not explain whether the bad operation is repaired. The learner should not
  need to infer this from the option's spelling.
- Direction: State what the program does after the diagnostic and clarify whether
  the sanitizer repairs the error. Keep the existing qualification that checks
  only cover executed paths.
- Earlier-definition check: `loading-widths.prose.ts:50` defines a signal, and
  `c-and-overflow.prose.ts:11` explains undefined behaviour; neither explains
  sanitizer recovery. This lesson defines “sanitizer” locally but not recovery.

The challenge hints here name actual mistakes and provide actual smaller
examples. They do not add occurrences to the existing M6 hint-heading issue.

## Assumed knowledge

The relevant starting knowledge is basic C functions, arguments, conditions,
loops and arrays, plus the earlier lessons. The following dependencies have
prior teaching:

- Modulo and wrapping: `subtracting-and-the-tick-counter.prose.ts:83` explains
  modulo as the remainder after division.
- Signed/unsigned conditions and a boolean return: `compare-and-choose.prose.ts`,
  `explanation` and `generalisation`, introduce the condition rules and 0/1 results.
- Addresses, byte order and store width: `memory-and-addresses.prose.ts`.
- Casts, byte types, sign extension and implementation-defined signals:
  `loading-widths.prose.ts:47–52` explains each, including the meaning of a signal.
- C23 selection, headers, `INT_MAX` and undefined signed overflow:
  `c-and-overflow.prose.ts:9–11`.

This lesson supplies local explanations for integer promotion, mixed signed and
unsigned comparison, checked addition, `_Bool`, `printf`, format strings and
sanitizers. Apart from L18, I found no new assumed knowledge gap. The explanation
separates a stored result from the boolean report, and ties the carry-versus-overflow
distinction to the visible flags and memory.

## Coverage and browser evidence

Read the entire prose and labels files, lesson wiring, both prediction
explanations, both tasks and all ten hints, every test label, expandable notes,
reflection answer and model-versus-reality note. Read the displayed C and
assembly listings and the actual shared feedback reached by the interactions.

Built page: `http://127.0.0.1:4253/assembly-lab/#/lesson/checked-arithmetic`.
Playwright inspected 1280 × 900 and 375 × 900, each in light and dark themes. In
every combination:

- Opened all expandable notes.
- Submitted every offered option for both predictions, including matching and
  mismatching feedback.
- Ran both challenges with their initial program and opened all five hints each.
- Advanced all four available steppers to their end states.
- Captured rendered text and screenshots. Visually inspected the overflow stepper
  and expanded warning note in each width/theme combination.

There was no horizontal page overflow and no additional width/theme-specific
clarity issue in these states. This does not claim to exercise arbitrary edited
programs, passing challenge submissions, external links or every editor control.

Temporary evidence: `/tmp/clarity2-22.mjs`, `/tmp/clarity2-22-notes.mjs`,
`/tmp/clarity2-22-browser.log`, and `/tmp/clarity2-22-{1280,375}-{light,dark}.txt`,
with corresponding `-initial.png`, `-step.png` and `-note.png` screenshots.
