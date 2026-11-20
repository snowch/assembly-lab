# Independent learner and browser review

Copyright © 2026 Christopher Snow

The reviewer did not write the implementation or its copy. The review judged the built pages from the stated programmer prerequisites, rather than treating the author's rationale or passing product tests as evidence. No implementation files were edited. This is an agent/interface review, not a novice learning study.

## Scope and evidence

Inspected the required forward route with the optional disclosure closed, then the independent borrowing experiment. Browser checks covered both courses at 320, 390 and 1440 pixels in light and dark themes: twelve contexts. Additional preservation checks covered both courses at 390px in both themes. The final RISC-V wording correction, “the lesson program uses 64-bit registers”, was rechecked in those 390px contexts and at 320px in both themes. The latter 320px checks repeated the required and optional routes, their controls and layout. No whole test suite was run for this review.

Screenshots, actual text, measured positions and raw JSON are under `/workspace/work/counter-zero-review/learner/`, outside the repository. `results.json` contains the twelve-context route checks; `preservation.json` contains the four preservation and old-state checks; `final-copy-320.json` contains the final narrow-screen RISC-V rechecks. The initially captured owned artifact subdirectory was moved there; unrelated artifacts were not changed.

Actual rendered body colours were checked. Arm used light background `rgb(247, 250, 248)` and dark `rgb(16, 27, 26)`. RISC-V used light `rgb(245, 249, 248)` and dark `rgb(16, 30, 28)`. Screenshots also show the corresponding foreground and control treatments.

## Required route without borrowing

Fresh forward panes showed `0000`, unsigned decimal zero and a dash under Carry out. Only +1 and Reset were available in that pane. The optional minus control was not visible or keyboard-reachable while its disclosure was closed. The visible main body did not require Borrow needed, ALU terminology or subtraction flag rules.

The directions are concrete and possible: “Press +1 to add a tick. Keep pressing until the stored reading returns to zero. Watch Carry out at the wrap.” After sixteen presses the stored bits returned to zero with carry one. One more press showed one with carry zero. The counter remained operable rather than stopping at the boundary. Reset returned it to zero and the initial dash.

The extra carry is visibly separate from the four stored positions. The retained bits and their unsigned decimal reading remain grouped. The caption and instruction-width qualification distinguish the small teaching counter from the Arm or RISC-V program. The fixed subtraction example and later prediction remain available without opening the borrow disclosure; the former explicitly supplies its own readings rather than borrowing an arbitrary explorer state.

## Optional experiment

The disclosure is labelled “Optional: subtract one and inspect the borrow”. Keyboard Enter opened it. Its own counter began at zero with a dash under Borrow needed, independently of the forward pane's current reading.

The first decrement produced `1111`, unsigned decimal fifteen and borrow one. Its visible explanation says: “Subtraction must borrow one group of 16 from the next position. Taking one leaves 15 in 4 bits.” This gives the meaning of the borrow beside the result, using the learner's existing binary place-value knowledge. The introductory paragraph defines decrement and ALU locally and makes clear that the operation does not reverse time or undo an earlier operation. These terms do not burden the required forward route.

Repeated decrements continued through a complete turn. Resetting this counter did not reset the forward counter; resetting the forward counter did not change the borrow result. Closing and reopening the disclosure preserved both readings. Reload restored their independently saved states while leaving the optional disclosure closed by default.

Arm's no-borrow C convention is confined to the optional experiment, where it is relevant. RISC-V correctly identifies its marker as belonging to the teaching model rather than a processor flag. Neither pane presents the unsigned stored reading as a negative number or as signed overflow.

## Touch, keyboard and preservation

In all twelve route contexts, each action button remained below its pane's numeric display and feedback. Every measured control was 44px tall. Compared with each pane's own initial document-coordinate baseline, the largest measured action-button movement was zero pixels across the ordinary, wrap and complete-turn states. The final 320px RISC-V copy checks also measured zero movement. No horizontal page overflow or page error occurred.

Enter activated the forward control; Enter opened the native disclosure and activated the decrement control. Focus remained on the operated decrement button. The optional route could be closed and revisited without altering either counter's state. Visible labels, numbers and code remained readable in the checked phone and desktop renders.

Separate 390px checks seeded editable code and a prediction. Counter actions and each Reset preserved saved code and the on-page prediction in both courses. Reload preserved code in both and Arm's committed prediction. This review does not claim that merely typed RISC-V predictions become durable across reload; that is outside this counter change. No live native program was run or paused by this reviewer, so preservation of native execution state belongs to the separate implementation checks rather than this review.

Old downward histories were also restored in each course and theme. The forward pane preserved their stored reading but showed a dash, not a subtraction borrow relabelled as addition carry. The next actual +1 press produced its own correct carry. This keeps saved work while maintaining the new pane's operation-specific meaning.

## Findings and assumptions

No open learner or browser finding remains in the checked final build. The required route now teaches one operation and one boundary marker. Borrowing is available as a separate, independently operated experiment rather than a second requirement for measuring elapsed ticks.

The assumed knowledge is the stated ability to read simple C, perform ordinary addition/subtraction and read small binary place values. A full gate-level borrow chain is not taught here and is not needed for this route. The optional note names and defines ALU and decrement before using them. No additional prerequisite was found that blocks the checked activity.

These checks establish that the route, state, wording and interface agree. They do not establish that novice readers will infer the intended mechanism. A learner study should still ask readers to explain a fresh forward boundary crossing before opening the optional subtraction experiment. No screen-reader user study was conducted; keyboard behaviour was checked as described above.
