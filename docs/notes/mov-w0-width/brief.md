# Specify the width of the move

## Objective and scope

Clarify the reminder and second Build 1000000 hint on Building a constant. The learner should distinguish replacing both 16-bit halves of w0 from movk keeping one of those halves. Keep the existing example, controls, gates and instruction meanings.

## Checked facts

- The example instructions name w0. It selects 32 bits, divided into two 16-bit halves. Source: packages/machine/src/regs.ts, parseRegName; content/lessons/constants-and-widths.prose.ts, construction.
- mov writes the destination width; it does not retain either old half within w0. Source: packages/machine/src/run.ts, register write masking and move execution; packages/machine/src/arith.test.ts and content/lessons/constants-and-widths.facts.test.ts.
- movk with w0 replaces one 16-bit half and keeps the other half within those 32 bits. Its w write also clears x0's upper 32 bits. Source: packages/machine/src/run.ts and arith.test.ts's w movk case. These established semantics are covered by the existing GNU/QEMU differential check; this patch changes no instruction behaviour.
- The next published page, Writing w and x registers, teaches the effect on the upper 32 bits. Do not imply those upper bits are preserved, and do not move that teaching into this short reminder.
- The existing canonical records are docs/notes/course-pacing-implementation/copy.md and docs/notes/module-1/prose.md. Keep them synchronised.

## Draft and review

Use docs/style.md: direct British English, precise register names and widths, no em dashes. The reader has already met the two 16-bit halves in Loading a constant. Draft the reminder's first sentence and the second exercise hint separately; keep the reminder's existing link and the hint ladder order. Do not supply an exercise answer.

Required independent learner and technical reviews cover the actual built page at desktop and phone widths, light and dark. Run the existing prose/model checks and appropriate browser checks; report full CI separately. No new test is needed solely to assert the revised sentence.
