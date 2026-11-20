# Independent learner and UX review

Copyright © 2026 Christopher Snow

The reviewer did not draft the prose, implement the counter, or write its product tests. The review began with the built pages and the stated prerequisites, without the author's explanation of why the design works. No production files were edited.

## Scope and prerequisites

Reviewed Arm's Measuring elapsed ticks page and RISC-V's Addition wraps page. The learner can read simple C and small binary numbers using place values. This permits reading four binary positions and recognising that the next position has weight sixteen. The review does not assume prior electronics or a hardware subtractor implementation.

The visible copy defines unsigned readings as zero or positive. It distinguishes the four-bit teaching counter from the later 32-bit Arm or 64-bit RISC-V program. The new minus button is explicitly labelled “−1, subtract one”; it is no longer described as replaying a forward tick.

## Browser evidence

Checked both courses at 320, 390 and 1440 pixels in light and dark themes: twelve contexts. Also independently checked the 1280px desktop edge in both courses and themes: four more contexts. Used actual rendered colours rather than relying on the selected preference. At 390px, Arm body backgrounds were `rgb(247, 250, 248)` / `rgb(16, 27, 26)`; RISC-V body backgrounds were `rgb(245, 249, 248)` / `rgb(16, 30, 28)`. Screenshots and measured states are under `.artifacts/bidirectional-learner/`.

In every context:

- Started at the displayed unsigned reading and used +1 to cross the upper boundary. The bits became `0000`, the decimal below them became zero, and Carry out showed one.
- Pressed −1 at zero. The bits became `1111`, the decimal became fifteen, and the marker changed to Borrow needed with value one.
- Completed a full sixteen-step turn in each direction. Both buttons remained usable and returned to the same reading; the recent trace stayed bounded.
- Used Enter and Space and confirmed focus remained on the operated control. Reload restored the miniature; Reset restored its initial reading and dash. Minus also worked from the initial reading.
- Measured each button against its own initial position, in both document and viewport coordinates. The maximum measured movement was zero pixels across initial, ordinary, wrapped and complete-turn states. All three controls were 44px tall. The entire bits/decimal display remained above the controls.
- Found no horizontal page overflow and no page errors.

The 1280px recheck specifically confirms the final feedback layout. The earlier parent-run failure is not converted into a pass by these checks; the parent records its original failure separately. This independent current-build measurement found no movement, including after the longer borrow feedback.

## Mechanism and learning sequence

The directions provide a short, possible route: “Use +1 until the stored reading wraps to zero, then press −1.” The following instruction names the two marker labels the learner should compare, then permits continuing in either direction. There is no artificial stop or need to discover the below-zero case through thirteen initial decrements.

At the backward boundary, the visible feedback says: “Subtraction must borrow one group of 16 from the next position. Taking one leaves 15 in 4 bits.” The preceding zero reading, chosen −1 operation, Borrow needed marker and resulting `1111`/fifteen provide the cause and result together. This addresses the distinction the old rewind interaction could not demonstrate: the displayed fifteen follows a real subtraction at zero, while its marker describes that subtraction. The wording supplies a meaning for borrowing using the next binary place rather than introducing an unexplained hardware gate.

The unsigned interpretation remains explicit, so this does not claim that the stored unsigned reading becomes a negative integer or that this is signed overflow. Arm's note also distinguishes the four-bit marker from instruction-width flag behaviour: `subs` sets C for no borrow. RISC-V correctly identifies the marker as part of the teaching model rather than a processor flag.

The controls are below the result, recent history and feedback. A finger operating them therefore does not cover the newly changed bits or explanation. The reserved feedback space has a teaching job: it prevents the longer boundary explanation from moving the touch target. Its shorter ordinary-state text leaves some space, but the counter's position is stable.

Arm's following subtraction pane explicitly introduces its own worked pair, rather than implying that a free explorer's arbitrary current value supplies the calculation below it. Its fixed timeline and interval bound remain visible. The later predictions remain distinct from this ungated small worked example.

## Preservation checks and limitations

Independently seeded editable code and a prediction in each course at 390px, in both themes. Counter steps, the backward boundary and Reset preserved those on-page values. Reload preserved the saved code in both courses and Arm's committed prediction. The reviewer did not independently run or pause a native program; that execution-state preservation is covered by the parent's and implementation agent's separate automated checks.

Two initial preservation-harness expectations were rejected after checking the existing contract:

- The first harness expected an unchecked/uncommitted Arm selection to persist after reload. `PredictionBox` stores the choice through `onCommit`; the corrected harness used the actual “Check your prediction” control before testing durable preservation. The uncommitted selection had already survived counter actions and Reset.
- The RISC-V harness initially expected a merely typed prediction to persist after reload. A separate control run without touching the counter also cleared that input. Its current durable draft path saves source, while prediction input is preserved in the live workspace. The final review therefore verifies typed-prediction preservation during counter actions and saved-source preservation after reload, without claiming that this counter change adds durable prediction storage.

Neither was a new counter regression. The failed harness runs remain failures; the subsequent, correctly scoped checks passed.

## Findings and remaining evidence

No open learner or touch-layout finding remains in the checked final build. Necessary assumed knowledge is limited to the stated simple arithmetic and binary place-value prerequisites. The widget does not teach a complete gate-level borrow chain; that is beyond the current outcome and is not needed to operate or explain the worked unsigned boundary from these prerequisites.

These are independent source/interface checks, not a study of novice understanding. A learner study should still ask a new reader to explain why zero followed by −1 stores all ones, then predict a fresh boundary crossing without relying on the displayed feedback. No screen-reader user test was conducted; keyboard and visible-state behaviour were checked as described above.
