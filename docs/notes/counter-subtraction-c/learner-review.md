# Independent learner and browser review

Copyright © 2026 Christopher Snow

The reviewer did not write the implementation or its copy. This Arm-only review judged the final built lesson from its visible content and the stated prerequisites. The author's account of why the design works was not used as evidence. No implementation files were edited, no RISC-V changes were reviewed, and no whole test suite was run by this reviewer.

## Browser evidence

Inspected the optional subtraction counter at widths 320, 375 and 1440 pixels, in actual light and dark themes: six contexts. Additional 375px light/dark checks seeded saved code and a committed prediction. Raw states and screenshots are outside the repository at `/workspace/work/counter-c-review/learner/`.

Actual rendered body backgrounds were `rgb(247, 250, 248)` in light and `rgb(16, 27, 26)` in dark, with the corresponding foreground colours checked. The selected preference alone was not treated as proof of theme rendering.

In all six route contexts:

- The subtraction disclosure remained optional and closed initially. The required forward counter retained its +1/Reset route.
- Opening the disclosure with keyboard Enter showed zero, a dash under **C after subs**, and “The dash means no subtraction is shown yet.”
- The first decrement showed `1111`, fifteen unsigned and C zero. The live status also reported C after subs zero; it did not announce the old inverse Borrow needed value.
- The next ordinary decrement showed `1110`, fourteen unsigned and C one. Its dynamic explanation described a subtraction that stayed within the unsigned range, rather than repeating the zero-boundary sentence.
- A full downward turn returned to zero with C one; another decrement crossed the boundary again and showed fifteen with C zero. The control stayed operable and retained keyboard focus.
- Reload restored the saved optional history and its derived C value. Reset restored zero and the dash, without changing the independently stored forward counter.
- Numeric results and their recent-reading trace stayed above the controls. Feedback and the rule bullets stayed below the controls. Each action button was 44px tall, and the maximum measured movement of the decrement control was zero pixels across initial, boundary, ordinary and complete-turn states.
- There was no horizontal page overflow and no page error.

The screenshots and `results.json` record the visible values, accessible status text, geometry and actual themes. They establish the checked interface behaviour; they are not a native-instruction execution comparison.

## Wording and learning route

The visible quantity is directly labelled **C after subs**. The reader no longer has to invert a separately displayed Borrow needed indicator to obtain C.

At the zero boundary, the selected explanation renders as: “Subtracting one from zero goes below the unsigned range. Keeping only 4 result bits gives 1111 (15 unsigned).” The bit pattern is formatted as code. It is followed directly by the four-bit Arm `subs` rule introduction and the two selected C-rule bullets. There is no unrelated note separating the current-state sentence from those rules.

The C-zero bullet says that a borrow is needed because the unsigned subtraction went below zero. The C-one bullet says that no borrow is needed because the subtraction stayed at or above zero. These definitions connect the displayed flag to the operation's mathematical range; they do not describe borrowing an actual hidden physical quantity. The old group-of-sixteen loan wording is absent from the inspected pane.

The width qualification remains visible in the same optional pane: C is calculated for the four-bit model, real `subs` uses 32- or 64-bit registers, and plain `sub` preserves the processor's flags. Together with the four-bit teaching-counter introduction, this avoids claiming that a real Arm processor has a four-bit arithmetic register or that a plain `sub` instruction wrote the shown C value.

The result/trace/control ordering answers the touch concern: a finger operating −1 is below the updated bits, unsigned reading and C value. Moving feedback below the controls also removes the need to reserve a large blank feedback area above them. The main forward route remains separate from this optional subtraction explanation.

## Saved work and review scope

Independent 375px checks in both themes confirmed that counter actions and optional Reset preserved editable code and a committed prediction. Reload restored that code, prediction and the independently saved forward and subtraction states. These checks are recorded in `preservation.json`.

The reviewer did not run or pause a native program. Arithmetic/native conformance and the wider regression suite belong to the parent's separate verification. Screen-reader status text was checked for consistency with the visible C value, but no screen-reader user study was conducted.

## Findings and assumptions

No open learner or browser finding remains in the checked final build. Necessary assumed knowledge is the stated simple C, ordinary arithmetic and small binary place values, together with the earlier addition-flag and subtraction material. ALU is expanded and decrement is defined locally in the optional introduction. No new electronics prerequisite or physical-loan model is required to read this explanation.

This is functional and content-review evidence, not proof of novice understanding. A learner study should still ask readers to explain a fresh decrement's C value and distinguish the unsigned retained result from its mathematical difference. No such novice study was available for this review.
