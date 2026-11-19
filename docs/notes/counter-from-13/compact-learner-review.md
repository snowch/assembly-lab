# Independent learner review: compact counter controls

Copyright © 2026 Christopher Snow

A separate agent reviewed the final built lesson without authoring its copy, component, styles or tests. The inherited available model was used. I formed the assessment from the actual page and its earlier preparation, rather than the author's explanation of the change. I did not edit application/test files or run a build.

## Prerequisites and learning route

Inspected the front page's Before you start panel: small C functions with conditions, loops and arrays, basic arithmetic and binary place values. In the actual earlier Arithmetic with four bits lesson, carry and retaining four positions are defined, a complete boundary example is demonstrated, inversion/add-one/addition is explained and a fresh subtraction is practised. The earlier Addition and its flags lesson distinguishes bit patterns from readings, defines a flag and separates four-bit teaching views from 32-bit instructions. Which instruction wrote the flags explains preservation and the distinction between add and adds.

The current pane defines counter and tick, identifies its four stored bits and gives the larger register width. Its instruction names the compact controls and actual zero pattern: “Use +1 until Bits stored shows 0000. The example pauses there. Use −1 to revisit the previous tick.” The label “Carry from +1” keeps the carry attached to the viewed forward increment when −1 revisits an earlier frame. This does not require a new subtraction/borrow explanation or suggest that the physical counter runs backwards.

The pattern and its decimal reading now occupy the same group, while the carry remains outside that group. At zero, the retained-bit explanation still states why the reading wraps, despite the removal of the two addition equations. The miniature mechanism is defined and demonstrated in earlier arithmetic preparation; this activity demonstrates and permits replay of its counter use. The following separate pane retains the inversion/add-one/add-later worked subtraction, bound and explicit 32-bit bridge. The original larger prediction and written function provide independent application. Starting at thirteen gives two ordinary increments before the boundary without requiring a long sequence of clicks.

No new untaught prerequisite, substantive wording gap or misleading state relationship was established within this review. These observations concern the opportunity to learn; they do not establish novice understanding.

## Actual browser checks

Used Chromium against the built lesson on port 4488 at 1280 × 900 and 375 × 812, each in actual light/dark themes. Checked root background tokens `#f7faf8` and `#101b1a`; inspected initial viewports and all four final wrapped-state screenshots.

All four combinations passed:

- Initial stored pattern 1101 and decimal 13, with an explained missing-result dash for carry. The lower-bound −1 control is unavailable; attempting to activate it leaves the starting frame unchanged.
- Three keyboard +1 activations produce patterns 1110, 1111 and 0000, decimal readings 14, 15 and zero, and carries 0, 0 and 1. The upper-bound +1 control pauses at zero; further activation leaves that frame unchanged.
- The decimal reading is below the stored-bit box in every initial, advanced, rewound, restored and reset state. Its horizontal centre differs from the stored-bit box's centre by less than one pixel. The carry's box remains to the left and outside the stored bits.
- There is no decimal sum or binary addition equation in the wrap pane. The separate subtraction retains its three worked rows, result 0011 / three elapsed ticks, the shorter-than-a-turn qualification and width bridge.
- Keyboard −1 revisits all preceding frames and stops at thirteen. Replaying +1 through the boundary restores the wrapped result and carry. The instruction and carry label describe these controls as forward/revisit navigation.
- Both controls retain focus when their boundary is reached. The +1 button stays fully inside the viewport and at a stable vertical position through all forward and backward frames, with unchanged page scroll:

| Viewport | Actual themes | +1 button top | Height |
| --- | --- | ---: | ---: |
| 1280 × 900 | light, dark | 736.125 px | 44 px |
| 375 × 812 | light, dark | 431.875 px | 44 px |

- Two saved ticks reload at fifteen with the count still two on render; the final tick remains available. This checks the prior numeric-progress shape without an automatic migration write.
- The larger ring remains gated while the counter is explored. Committing its original prediction opens it normally. A valid edited function passes its tests. Revisit/replay, reload and the counter's Reset preserve the edited source, successful verdict and committed prediction; Reset affects only this counter.
- No page errors or page-level horizontal overflow occurred.

## Findings and inspection setup

No application correction is requested from this independent learner review.

The first review-script run failed a later control-coordinate comparison after an element screenshot had deliberately scrolled the page to capture the whole figure. The measured delta was 266 pixels. This was a harness ordering problem, not evidence that the control moved during activation. I moved element-screenshot capture after the position measurements and reran the complete four-context procedure. Every combination then passed; the original failed command is not counted as a pass.

An initial preparation-reading script also read two SPA routes before their headings had rendered, so those reads captured the front page. Repeated those two inspections with explicit destination-heading waits and read the actual preparation lessons. The corrected reads, rather than the premature text, support the prerequisite assessment above.

## Limits

This was an independent learner-perspective browser review, not a novice participant study. I did not run the whole suite or native comparison, use a screen reader, test another browser engine, zoom/alternate fonts or physical touch hardware. Those checks are not claimed here. Native accuracy and complete-suite/publication results belong to the separate technical/managing records. No result in this record proves learning effectiveness.
