# Independent learner review: 04 Subtracting, and the tick counter

Scope: this lesson only. Read CLAUDE.md, docs/style.md, docs/authoring.md, front-page Before you start, and prose/labels of all four earlier lessons in content/lessons/index.ts. No prior review notes consulted. Read this lesson's complete prose, labels, questions, options, hints, feedback, model note, structure and relevant shared strings/components.

Browser: actual built site at http://localhost:4290/assembly-lab/#/lesson/subtracting-and-the-tick-counter. Chromium at 375×900 and 1280×900, light and dark, each with a fresh browser context. Inspected prediction before and after a wrong commitment; unlocked ring and both subtraction figures; expanded adder time-model note; Reset/Next column; negation prediction and first instruction of its stepper; all five hints of both challenges; construction's initial failing Run tests; optional details opened. Successful construction completion and its gated follow-up were reviewed in source, not unlocked in browser. No exhaustive input testing.

## Findings

### 1. Medium: the adder's step explanation describes a different operation from its controls

Exact text: “Each step runs one instruction in the simulator. Between steps, the simulated processor stays as the last instruction left it.” The same figure offers “Next column” and “Next group of four”.

Sources: packages/views/src/strings.ts:10; packages/views/src/strings.arith.ts:37; content/lessons/subtracting-and-the-tick-counter.ts:95 (adder with timeModel STEPS), also the other adder instances.

Setup: commit the elapsed prediction, open the Stepped badge above the first subtraction figure, then Reset and Next column. Reproduced at all four viewport/theme combinations. The learner advances through the arithmetic columns of one subtraction, while the attached explanation says each step runs an instruction. The lesson's final note correctly says the drawing shows arithmetic, not the circuit, but that distant qualification does not resolve what this local Next column does. This blurs the exact unit of execution the recent changes were intended to clarify.

Direction: give the adder a local explanation appropriate to arithmetic columns, and reserve the one-instruction-per-step explanation for instruction steppers. Distinguish simulator execution from exploration of the already-computed addition. Check other non-instruction figures sharing this note.

Evidence screenshots: /tmp/course-clarity-audit/04-375-light-adder.png and /tmp/course-clarity-audit/04-1280-dark-adder.png; equivalent screenshots exist for the other two combinations.

### 2. Low: the ring instructions are separated from the ring by the complete subtraction explanation

Exact text: “The figure draws them that way. The counter counts forward, clockwise.” Then: “So the strip under the ring enlarges the stretch round the wrap.” Much later in the same uninterrupted prose block: “The two figures below show the final states of two subtractions, each of which can be stepped column by column.”

Sources: content/lessons/subtracting-and-the-tick-counter.prose.ts:27, :28, :45; structure at content/lessons/subtracting-and-the-tick-counter.ts:79 renders the complete prose block, then the ring, then the two adders.

Setup: read Investigation after committing the prediction. At phone width the ring begins approximately 1571 CSS px after the first ring paragraph ends; desktop about 986 px. These measured gaps include the remaining ring introduction and the subsequent explanation. The learner is asked to follow positions on a ring they cannot yet see, then switches to bit complementation, a four-bit worked example and borrow rules before finally seeing it. The final sentence announcing two subtraction figures is followed immediately by a ring rather than either subtraction diagram.

Direction: place the ring directly with its explanation, then introduce the adder diagrams with their own explanation. Keep all prediction gates and avoid placing construction answers into earlier figures. This is a placement improvement, not a request to shorten the technical explanation.

## Assumed knowledge

No additional unsupported prerequisite found in the lesson's prose or C examples. The front page permits unsigned arguments and return. Earlier lessons explain assembly operands/registers, GCC and -O1, hexadecimal, signed and unsigned readings, 32-bit truncation, carries and all four flags. This lesson introduces tick/wrap in the opening, subs before its figures, borrow before its use, neg/negs before the negation prediction, and modulo in the same sentence that uses it. QEMU and architecture are explained in the preceding addition lesson. The adder's ambiguity above concerns local UI meaning rather than an absent mathematical prerequisite.

## Other observations

The elapsed setup explicitly limits the time gap and excludes resets, so the counter question has a well-defined setting. The negation question identifies the instruction and asks what the register holds afterwards. The closing challenge labels its result and C-after-subs fields precisely. No further substantive findings forced.
