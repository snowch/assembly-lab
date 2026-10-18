# English review: Conversions and checked arithmetic

Copyright © 2026 Christopher Snow

Review only, 18 October 2026. Module 11, lesson 2 (`checked-arithmetic`). No course text changed.

## Finding

### 1. Low: “recovery” leaves the sanitizer's behaviour unclear

- Exact quote: “GCC normally allows recovery after many reports; `-fno-sanitize-recover=undefined` makes a detected problem terminate the run.”
- Location: `content/lessons/checked-arithmetic.prose.ts:41`, “Warnings and run-time checks”.
- Effect: “Recovery” can mean that the tool corrects the invalid operation or restores a valid program state. The learner has just learnt that undefined behaviour has no promised result, so the word needs a concrete account of what execution does after the report. The second clause suggests a contrast but does not state whether any correction happens.
- Direction: Explain recovery in terms of continuing execution after a diagnostic; make clear whether the sanitizer repairs the underlying error. No new technical term is needed.
- Earlier-definition check: No earlier lesson defines sanitizer recovery. `loading-widths.prose.ts:44` uses “recover” about a lost signed interpretation, a different meaning. The preceding `c-and-overflow` lesson explains undefined behaviour but does not explain continuing after sanitizer reports.

## Prerequisites and checks against earlier teaching

Read `CLAUDE.md`, `docs/style.md`, the front-page “Before you start”, the course order in `content/lessons/index.ts`, and the relevant earlier explanations before judging assumed knowledge. The learner's starting C knowledge covers arguments, returns, conditions, loops and indexed arrays; pointers and the standard library are not prerequisites.

The lesson relies on these previously taught concepts: signed and unsigned readings and limits; register width and `w` writes clearing upper `x` bits; carry versus signed overflow; conditions and boolean results; little-endian bytes, pointers and width-specific stores; narrowing casts and sign extension; compiler recordings and optimisation settings; and undefined signed arithmetic overflow. Relevant earlier evidence:

- `one-pattern-three-readings.prose.ts`: the signed and unsigned ranges and different readings of the same pattern.
- `subtracting-and-the-tick-counter.prose.ts:83`: modulo means the remainder after division.
- `compare-and-choose.prose.ts:97–110`: unsigned conditions, `vs`, comparisons returning 0 or 1, and the C boolean type.
- `memory-and-addresses.prose.ts`: pointers as addresses, target type widths, stores and little-endian ordering.
- `loading-widths.prose.ts:47–52`: casts, `sxtb`, unsigned-byte wrapping, implementation-defined signed conversion, and what a signal means.
- `meet-the-machine.prose.ts:16–18`: GCC and `-O1`.
- `c-and-overflow.prose.ts:9–11`: C23 selection, N3096, headers, `INT_MAX`, and undefined behaviour.

Integer promotion, `printf` and its format codes, checked addition, `_Bool` and sanitizer flags receive local explanations. Apart from the recovery point above, no additional unexplained prerequisite is reported. In particular, “implementation-defined signal”, casts and compiler settings are not new unexplained jargon here.

## Coverage and browser evidence

Source coverage: all ten sections in `checked-arithmetic.ts`, all learner prose in `checked-arithmetic.prose.ts`, all titles, objectives, captions, comparison labels, options and test labels in `checked-arithmetic.labels.ts`; both prediction explanations; both challenge tasks and all five hints for each; all expandable notes, reflection answer and model-versus-reality note. Shared figure/editor/prediction/grader wording was checked in `packages/views/src/strings.ts` and the course runtime strings. The listing-pair C and assembly and the unlocked investigation/failure figures were read in the browser.

Built page: `http://localhost:4220/assembly-lab/#/lesson/checked-arithmetic`. Playwright opened it at 1280 × 900 and 375 × 900 with both light and dark colour schemes. In every combination, expanded all details, checked both predictions, unlocked their figures, opened all ten hints, and ran both challenges with the initial program to inspect failure feedback and test labels. The prediction states include a mismatch and a match. All rendered text was captured and the four interactive full-page screenshots were visually inspected. No width/theme-specific English finding.

Evidence (temporary, not repository artifacts): `/tmp/english22-1280-light-interactive.txt`, `/tmp/english22-1280-dark-interactive.txt`, `/tmp/english22-375-light-interactive.txt`, `/tmp/english22-375-dark-interactive.txt`, with corresponding `.png` files. Scripts: `/tmp/english22.cjs` and `/tmp/english22-interact.cjs`. No rebuild or full suite run. This review does not reproduce challenge solutions.
