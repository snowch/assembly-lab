# English review: The same C on 32-bit Arm

Copyright © 2026 Christopher Snow

Review only, 18 October 2026. Optional A (`same-c-on-a32`), after Modules 0–11. No course text changed.

## Finding

### 1. Low: “baseline Armv7-A” assumes an architecture-feature term

- Exact quote: “A32: GCC 15.2, baseline Armv7-A”.
- Location: `content/lessons/same-c-on-a32.labels.ts:34`, the A32 heading repeated over all three listing pairs.
- Effect: “Baseline” does not tell a learner whether this means an older processor, a compiler default or a particular set of available instructions. That distinction matters when the lesson later explains why this compilation calls a division helper. The compiler note explains what `-march` selects but does not connect “baseline” to the absence of optional features.
- Direction: Explain the label in terms of which processor features this compilation assumes, or use an already explained description in the label.
- Earlier-definition check: No earlier lesson prose uses or defines “baseline”. The local compiler note (`same-c-on-a32.prose.ts:9`) says the setting determines which processor features GCC may assume; the generalisation (`:39`) explains the optional divide extension. Neither explicitly identifies what the label's “baseline” means. This is a minor terminology gap, not an exercise blocker.

## Prerequisites and earlier-definition checks

Read `CLAUDE.md`, `docs/style.md`, the front-page prerequisites (`apps/course/src/strings.ts:24` onward), course order (`content/lessons/index.ts`), and relevant earlier teaching. The front page assumes small C functions using integer arguments, return, conditions, loops and indexed arrays, plus binary arithmetic. Assembly starts from scratch.

This lesson assumes register views and widths; arguments and results in registers; unsigned comparisons, carry and conditions; immediate constants; recorded compiler output and compiler settings; calls, link registers, saved return addresses, stack alignment and leaf functions; and unsigned division with whole-number results. Checks against earlier explanations:

- `meet-the-machine.prose.ts:97` explains GCC version and optimisation settings, including `-O1`.
- `constants-and-widths.prose.ts` explains constant-building and low/high register parts; `from-c-to-instructions.prose.ts:11` uses and explains the 16-bit-immediate constant-building mechanism.
- `compare-and-choose.prose.ts:11–12` explains the C conditional expression; its explanation at `:93–110` defines `cs`, `ls` and unsigned order. The local A32 prose explicitly explains the new condition suffix.
- `division-and-remainders.prose.ts` teaches `udiv`, quotient and divisor, discarded fractional parts, and the distinction between C rules and architecture behaviour.
- `calls-and-returns.prose.ts:6–11` defines caller, callee, calling convention, link register and stack. Its investigation (`:18`) explains register preservation and alignment as an address multiple; its generalisation (`:38`) defines a leaf function.

Execution state, A32 register names, `lr`/`r14`, conditional moves, `movw`/`movt`, the library helper's role, braces, `push`/`pop`, and `pc` receive local explanations. Thumb is identified as another Arm instruction set; no knowledge of its instructions is required. “Mnemonic” is new terminology but immediately tied to “instruction names”, repeated in the task and demonstrated in hints, so it is not a separate finding. Apart from the label above, no unexplained prerequisite affecting comprehension was found.

## Coverage and browser evidence

Read all learner text in `same-c-on-a32.prose.ts`, `same-c-on-a32.labels.ts`, the lesson structure and both challenge definitions in `same-c-on-a32.ts`, and all six recorded C/assembly programs in `a32.listings.ts`. Coverage includes all ten sections, objectives, titles, captions, options, field labels, both expandable compiler/call notes, both prediction questions and explanations, both challenge tasks, all five hints for each challenge, both challenge feedback strings, reflection and model-versus-reality note. Shared listing, stepper, prediction and answer wording was checked in `packages/views/src/strings.ts`, `strings.recorded.ts`, `grader-recorded.ts` and the course runtime strings. The recorded grader uses the lesson's feedback strings for these exercises; its generic retry wording is not substituted for them.

Opened the built page at `http://localhost:4220/assembly-lab/#/lesson/same-c-on-a32` in fresh Playwright contexts at 1280 × 900 and 375 × 900, each with light and dark colour schemes. Expanded every details element; checked a mismatching numerical prediction and a matching assembler prediction; unlocked the investigation; opened all ten hints; submitted empty and then nonmatching filled answers to both exercises; and stepped both A64 figures to return. Read the resulting text and visually inspected all four full-page screenshots. The three listing pairs remain static without simulator-step badges. No width/theme-specific English finding.

Temporary evidence: `/tmp/english23.cjs`, `/tmp/english23-1280-light-interactive.txt`, `/tmp/english23-1280-dark-interactive.txt`, `/tmp/english23-375-light-interactive.txt`, `/tmp/english23-375-dark-interactive.txt`, and corresponding `.png` files. No rebuild or full suite run. This review deliberately omits exercise solutions.
