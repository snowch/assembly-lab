# Four-bit arithmetic simplification: independent technical review

7 November 2026. Reviewer: separate GPT-6.1 (`gpt-6.1-sol`) agent at Extra High
(`xhigh`) effort, with no inherited authoring conversation. The reviewer did not
write or edit product copy, implementation or tests. No commits were made.

## Scope and source pass

Read the actual lesson and prerequisite sources before the author's brief:
`CLAUDE.md`, `docs/authoring.md`, `docs/style.md`, `docs/sources.md`, the lesson's
structure/prose, the preceding readings sequence, Module 0's addition lesson,
the four-bit arithmetic/complement/column models, simulator addition and flag
handling, grader, answer editor, solution gate and focused model/figure/lesson
tests. Re-read the final prose and canonical `draft.md` after its last revision.

The final lesson retains the worked addition, width boundary, worked subtraction
and fresh practice. Its closing 32-bit ADD activity, objective and ALU term are
removed. The practice schema, grader, answer editor and solution-gate code have
no diff. The remaining carry-flag term still has a local definition.

No unresolved technical finding was found in the final source.

## Arithmetic checked independently

An ad hoc Vite SSR script loaded the real arithmetic and machine modules without
building or modifying them. For all eight triples of operand bits and incoming
carry, it constructed operands whose bit 1 had the requested triple. It compared
the recorded total, kept bit and outgoing carry against `a + b + incoming`,
`total % 2` and `floor(total / 2)`.

| A | B | Incoming | Total | Kept | Carry left |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 1 | 1 | 0 |
| 0 | 1 | 0 | 1 | 1 | 0 |
| 0 | 1 | 1 | 2 | 0 | 1 |
| 1 | 0 | 0 | 1 | 1 | 0 |
| 1 | 0 | 1 | 2 | 0 | 1 |
| 1 | 1 | 0 | 2 | 0 | 1 |
| 1 | 1 | 1 | 3 | 1 | 1 |

All passed. In particular, the worked 3 + 3 run has two operand ones plus an
incoming one at bit 1: binary `11` splits into kept 1 and carry 1. The new
sentence about twice the weight is local to that column: its carry enters bit 2.

Also checked 15 + 1 (`10000`, low four `0000`), 15 + 15 (maximum inputs),
the worked 3 − 5 inversion/add-one/result sequence, and the 0 − 8 signed-boundary
case. The existing focused tests independently compare all 256 pairs against
modulo arithmetic for addition and subtraction, and pin the model's signed and
unsigned readings, carries and invalid-input boundaries.

`npx vitest run packages/views/src/four-bit-arithmetic.test.ts` exited 0:
2 files, 9 tests passed. This filter also selects the matching `.test.tsx` figure
file. This is a focused result, not a full-suite result.

## Width and flag separation

`fourBitAddition` reads columns 0–3 from a real 32-bit ADD trace; it does not
change the machine's width. The corresponding subtraction selects the low four
bits of a real 32-bit SUB result. The displayed opposite and extra carry explain
arithmetic modulo 16, rather than a four-bit Arm instruction.

The initial local qualification says, “These four-bit miniatures are not Arm
registers.” The width text says, “For an Arm register, `adds` records the carry
beyond its width in C” and separately says ordinary `add` preserves flags.

Executable separation checks passed:

- 32-bit ADD of 15 and 1 retains 16 and preserves preset NZCV.
- 32-bit ADDS of 15 and 1 retains 16 with C = 0.
- 32-bit ADDS of `0xffffffff` and 1 retains 0 with C = 1.

Thus the miniature's carry beyond bit 3 is not presented as a 32-bit C value.
The retained architecture statement agrees with the repository's Arm source
record and the executable flag-setting path in `packages/machine/src/run.ts`.

## Accepted and rejected findings

- **Accepted, corrected:** Bit Lab's paragraph previously promised a 32-bit ADD
  demonstration on the removed activity. Its final paragraph and canonical
  `docs/notes/adder-architecture-copy.md` now point to Module 0, lesson 1,
  “One addition”. In Assembly Lab, `fundamentals.ts` supplies `one-addition`,
  module 0 and first lesson order; `fundamentals.labels.ts` supplies the title;
  `meet-the-machine.primitives.ts` supplies its `add w2, w0, w1` program; and
  `docs/notes/fundamentals/prose.md` records the same input/destination teaching.
  Two unused Bit Lab prototype link fields and their canonical snapshot were
  also removed. Bit Lab's hardware activities were not changed.
- **Rejected:** treating a carry in a column as an automatic update to C. The
  visible width qualification and the executable checks above distinguish the
  arithmetic from a flag-setting instruction.
- **Rejected:** treating the displayed four retained places as the actual Arm
  register width. The local prose states the miniature's scope, while the model
  retains its 32-bit registers. The new bridge correctly sends the learner to
  subtraction with 32 places.
- **Rejected:** requiring a different kept bit when both operand bits and the
  incoming carry are 1. The independent truth table and the model agree on
  kept 1, carry 1.

## Built-page check

Checked the coordinator's final build at
`http://localhost:4511/assembly-lab/#/lesson/four-bit-arithmetic` after the other
reviewer released the browser. All browser contexts were closed afterwards.

The independent Playwright spot checks passed in all four profiles:

| Viewport | Actual theme | Body background | Document width |
| --- | --- | --- | --- |
| 375 × 812 | light | `rgb(243, 246, 245)` | 375 |
| 375 × 812 | dark | `rgb(16, 22, 21)` | 375 |
| 1280 × 900 | light | `rgb(243, 246, 245)` | 1280 |
| 1280 × 900 | dark | `rgb(16, 22, 21)` | 1280 |

Confirmed each profile's actual `html[data-theme]`, computed foreground and
background colours, and screenshot appearance, rather than relying on the
requested preference alone. Inspected all eight saved bit-1 and width screenshots.

- Initial inputs were `0011` and `0011`, result `????`, incoming carries `???0`;
  no unsigned answer was drawn.
- The first reveal kept 0 at bit 0. The second displayed all three input ones,
  binary `11`, kept 1 at bit 1 and carry 1 entering bit 2. The arrow visibly
  reached the carry cell in the column on the left.
- Completion displayed `0110`, unsigned 6, final carry 0 outside the four
  columns, and an unavailable Next column action.
- Reset restored the initial unknown outputs and incoming carries, removed the
  carry path and unsigned reading, and made Next column available again.
- The separate width example showed its extra 1 outside retained `0000`, its
  complete `10000` sum and its local Arm flag qualification.
- Only one carry walkthrough remained. The removed 32-bit activity and heading
  were absent. The fresh practice's solved note remained closed.

At bit 1 and completion, measured path start and end errors were 0 pixels in
every profile. No profile had document-level horizontal overflow or a page error.
Artifacts: `/workspace/scratch/four-bit-simplification-technical/`, including
`browser-results.json` and the eight screenshots.

The first ad hoc browser probe exited 1 because the reviewer queried `data-mode`
on the outer platform figure; that attribute belongs to its arithmetic child.
The corrected probe targeted the child and passed on the same unchanged build.
This was a diagnostic selector error, not a product defect or a discarded
failing product check.

## Limits

No dependencies were installed and no build, broad test suite, native/QEMU run,
deployment or commit was performed by this reviewer. The live Arm reference URL
returned its documentation app shell without the instruction body, so this review
does not claim a fresh read of that body. No C-language or compiler behaviour was
changed. Cross-course changes were reviewed in source, not on a built Bit Lab
page. Browser checks covered the practice's fresh closed gate, not a separate
repeat of its completion/persistence matrix; the unchanged schema, grader,
editor and gate were read in source. Full-suite results belong to the
coordinator's separate validation record. Automated checks and agent review do
not establish that a beginner has learned the mechanism.
