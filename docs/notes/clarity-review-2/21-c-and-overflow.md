# Fresh clarity review: C overflow and machine results

Copyright © 2026 Christopher Snow

Reviewed 18 October 2026 against the immutable preview based on `5cb518c`, with the
approved Module 0 simulator sentence applied. Scope: lesson `c-and-overflow`, index
21, Module 11. No lesson source was changed.

## Result

No new unclear-English finding or unexplained prerequisite was confirmed. The
chapter keeps its central distinction clear: C's guarantees constrain compiler
output, while the processor executes the resulting instructions. The source
reading was completed before consulting the [earlier review](../english-review/21-c-and-overflow.md),
which also had no retained chapter finding. No earlier issue needs an additional
occurrence recorded here.

## Coverage

Read `CLAUDE.md`, both passes in `docs/style.md` and the [review brief](brief.md).
Reviewed the whole [prose](../../../content/lessons/c-and-overflow.prose.ts),
[labels](../../../content/lessons/c-and-overflow.labels.ts), lesson mounting and
challenge configuration, and the displayed records in `c-boundaries.listings.ts`.
The reading included objectives, all ten sections, captions, both predictions and
explanations, both tasks, all ten hints, test labels, optional notes, reflection
and simulator qualifications. It was a clarity review, not a new technical audit
of every C claim or compiler record.

Used Chromium at `http://127.0.0.1:4253/assembly-lab/#/lesson/c-and-overflow`, with
1280 × 900 and 375 × 900 viewports in light and dark themes. In all four combinations:

- Opened every details panel and read the complete rendered text.
- Submitted every option for both predictions, covering matching and mismatching feedback.
- Advanced both unlocked steppers through every instruction to their returns.
- Ran both starting challenges, inspected failed-case feedback, and opened all five hints in each.
- Entered the supplied reference artifacts only to inspect passed feedback and the gated listing; both exercises reported all six tests passed.
- Inspected screenshots of the introductory text, arithmetic-bound explanation, steppers and final challenge.

The document width matched the viewport in each combination. The arithmetic
inequalities remained readable on the phone. This did not exercise arbitrary
editor inputs or every possible assembler diagnostic.

Temporary browser evidence: `/tmp/clarity2-21.mjs`,
`/tmp/clarity2-21-reading.mjs`, and `/tmp/clarity2-21-*` text dumps and screenshots.
They include disclosed exercise material and are not reproduced in this report.

## Prior knowledge and wording checks

Only the front-page prerequisites and earlier lessons were credited. Signed
readings, overflow flags, comparisons, branches and register-return conventions
have already been taught. Earlier Module 10 lessons explain the limited local
compiler and the distinction between source requirements and generated
instructions. In particular, `from-c-to-instructions.prose.ts:52` says, “The C
source specifies the result for each defined input, not one mandatory instruction
sequence.”

The current chapter explains each additional concept where needed:

- `c-and-overflow.prose.ts:9` identifies the compiler, target and C language setting.
- Line 11 introduces the signed bounds, `<limits.h>`, `#include`, and undefined behaviour.
- Line 18 explains the scope of `-fwrapv` and limits its guarantee.
- Line 38 defines saturation and explains why the additional compiler settings preserve a branch.
- Line 41 explains what a text parser does and how digit accumulation can overflow before negation.

“Compare two compiler contracts” is made concrete immediately by “an extra
compiler guarantee”. “Its corresponding branch” follows the separate positive-
and negative-operand cases. Neither requires the reader to supply an unstated
mechanism. The two “Common mistake” hints identify the premature calculation, and
both “Smaller example” hints provide an actual input and consequence; they do not
show the mismatch between heading and content recorded elsewhere as M6.
