# Reader 04: Subtracting, and the tick counter

Module 2; course position 4 (zero based), fifth lesson. Snapshot reviewed against the shared built preview, without app edits or rebuilds.

## Overall assessment

No high-severity overload or missing prerequisite confirmed. The first prediction asks the learner to apply familiar 32-bit subtraction to a newly explained counter wrap; it does not require the subtraction implementation or all four flags at once. The investigation is the busiest part, but its small worked example and reuse of the preceding lesson's adder substantially contain the novelty. One low-severity phone presentation finding survives this pass. Sequencing suggestions below are recommendations, not confirmed failures.

## Prior knowledge and new mechanisms

Read the front-page entry requirements and only the four preceding lessons in `/tmp/course-load-review/lessons.json`.

- Entry: small C functions with `int`, `unsigned`, arguments and `return`; basic arithmetic.
- Meet the machine: `sub`, operand order, arguments in `w0`/`w1`, result in `w0`, `ret`, paired C/listing, stepping, assembly editing, tests and hints.
- Same bits, two readings: 32-bit unsigned and signed readings and their ranges, top bit, hexadecimal; subtraction's retained bits can represent a negative signed number and a large unsigned one.
- Constants and widths: low 32 bits, `w` versus `x`, remainder after division, compiler optimisation notation and compiler/assembler roles.
- Adding, and the four flags: `add`/`adds`, retained result bits, binary column addition and carries, N/Z/C/V, signed overflow, persisted flags; the familiar adder controls.

Genuinely new here: ticks and wrap; elapsed distance on a circular counter and the less-than-one-full-turn condition; `subs`; borrow and the meaning of C as *no borrow*; turning over the second operand's bits plus carry-in 1; `neg`/`negs` and the signed minimum case. “Modulo” is defined locally rather than silently required. No further unexplained prerequisite confirmed. The data's empty prerequisite array does not mean the reader can skip the earlier course.

## Confirmed finding

### Low: phone adder compresses the very rows being compared

Location: investigation, the two subtraction diagrams; `packages/views/src/interactives/AdderFigure.tsx` (`Cells`, `Marks`, `Calc`, `Final`), `packages/views/src/arith.css:277`–296. Exact on-screen labels include “Carry into each column”, “w1 with each bit changed”, “Answer, w0”, and “Column 31”.

Reproduction: fresh context at 375px, either actual theme; commit the first prediction, inspect the first adder in its initially completed state, then Reset and Next group of four. The grid fits the page without horizontal overflow, but 33 columns, with the original and changed second operand as separate rows, compress the bit glyphs into very narrow cells. At this width the four-bit-group style uses 0.6875rem glyphs. The detailed calculation and controls fall below the grid. The completed phone figure is about 1,224px tall, so its top result/C interpretation and bottom controls are not visible together in a 900px viewport.

Competing tasks: compare the supplied second operand to its changed bits; track the selected column and its carry; reconnect that local work with the top-bit summary and borrow interpretation. This is a local inspection obstacle, not evidence that 32 bits or four flags are intrinsically too much. The readable “Column” calculation mitigates it, and desktop layout places that calculation beside the grid.

Smallest direction: preserve the complete 32-bit overview and result summary, but give the selected four-bit group a readable local enlargement on phones, or allow a contained larger grid with a persistent selected-column calculation. Avoid adding a further permanently expanded explanation. Keep the current Reset/group controls.

Evidence: `/tmp/course-load-review/subtracting-and-the-tick-counter-375-light-carry.png`, `...-375-dark-columns.png`, with desktop comparison `...-1280-dark-carry.png`.

## Sequence and attention recommendations (not confirmed defects)

1. Keep the order prediction → ring/strip → four-bit arithmetic → real 32-bit subtraction → writing. The sentence “The example uses four bits only, to show the method. The real instruction uses 32.” (`subtracting-and-the-tick-counter.prose.ts:34`) is the right bridge. Do not replace it with an unexplained full-size bit display or split every opcode into another lesson.
2. Consider a brief optional no-borrow/borrow classification attempt between the two worked adders and the construction exercise. Both adders open completed (`subtracting-and-the-tick-counter.ts:109,124`), explicitly introduced as “final states of two subtractions”. That makes them worked examples, not accidentally pre-solved learner attempts. A small classification attempt could strengthen the new interpretation of C without adding another large figure. Current evidence does not establish that one is required.
3. Consider placing “Why the low bits are enough” directly before “Negating 0x80000000”. Currently the learner switches from unsigned elapsed-time construction to signed negation, then back to the counter's arithmetic proof. This creates a conceptual switch, but the negation section explains its new instructions and applies already practised signed range/V knowledge. Treat the move as a coherence improvement, not a high-severity novelty finding.

## Treatments worth keeping

- The ring includes an enlarged strip because the two readings otherwise occupy effectively the same point. Labels distinguish `then`, the wrap, `now`, both stretches and total. On the phone these remain legible; the graphic carries the distance reasoning instead of leaving it in prose.
- The counter-running and full-turn assumptions appear before the first prediction and return near generalisation. The lesson does not quietly claim that readings reveal multiple turns.
- `subs` reuses the preceding addition mechanism. The original second operand and its changed bits are both visible; carry-in 1 is labelled. The completed diagrams emphasise the result and C interpretation before optional column exploration.
- The first prediction's listing, inputs, question and choices have one purpose. The ring and arithmetic remain gated until commitment. No explanation panel or next-instruction destination task competes with that prediction.
- Worked examples, construction editor and test feedback are visibly separate. Construction uses familiar editing and testing rather than demanding an unfamiliar control scheme. Its further arithmetic diagram is gated on passing the learner's work.
- Negation uses a separate prediction, then a gated stepper; it does not mix its signed-boundary question into the elapsed-time editor.

## Browser coverage and limits

Used fresh Playwright contexts at 375×900 and 1280×900 with light and dark system preferences. Verified rendered body backgrounds: light `rgb(243, 246, 245)`, dark `rgb(16, 22, 21)`; page overflow was zero in all four contexts. Artifacts use the assigned lesson prefix.

In all four contexts exercised: initial uncommitted page and gates; first prediction commitment with nonmatching choice and feedback; unlocked ring; both completed subtraction diagrams visible in full-page captures; first adder Reset and Next group of four; second prediction commitment; one `negs` step; unchanged construction starter Run tests and first hint. Screenshots cover initial, committed, ring, carry and partial-column states. Inspected phone light completed adder/ring, phone dark partial columns, and desktop dark completed adder directly as images; all four complete pages were captured and their rendered states exercised.

Read all ten sections, labels, program records, relevant `CounterRing`, `AdderFigure`, `RunPrediction`, `StepperFigure`, and challenge runner implementation. Read the post-pass diagram/gate and reflection disclosure in source. Did not solve challenges, unlock the post-pass adder, exhaust hints, submit the final challenge, or test reload/restoration and every column. Did not open the final reflection answer in the browser. No external compiler calls. No technical claim of hardware agreement was independently rerun.
