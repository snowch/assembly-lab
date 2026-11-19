# Independent learner review: restored counter wrap

Copyright © 2026 Christopher Snow

Reviewer: a separate agent using the inherited available model. I did not draft or implement the page. I formed the initial assessment from the built lesson and earlier built lessons without reading the author's new brief/copy record.

## Scope and learner preparation

Reviewed the actual built `#/lesson/subtracting-and-the-tick-counter` page, served at port 4458. Read CLAUDE.md, the authoring guide and style checklist. The front page requires small C functions with conditions, loops and arrays, basic arithmetic and binary place values. Browser inspection of earlier lessons established these prerequisites:

- One addition defines registers, instructions, operands and matching w/x widths.
- A tiny function defines GCC as the compiler that translated the C, an assembly listing, arguments, the caller and ret.
- Arithmetic with four bits defines a carry, demonstrates the four-kept-bit boundary and the inversion/add-one/add mechanism, and supplies a fresh subtraction exercise.
- Addition and its flags defines a flag and distinguishes add from adds and C from signed overflow.
- Which instruction wrote the flags explains that add/sub leave existing flags unchanged.

I found no additional untaught prerequisite required by the restored pane. It defines the counter and tick locally, demonstrates wrap before composition with elapsed subtraction, and qualifies its four-bit width. The actual-width C note relies on material already taught, rather than introducing flag semantics here.

## Findings

### Medium: the next required control moves partly offscreen after the first press

Location: How a counter wraps, `Advance one tick` below the variable-height calculation.

Evidence from real keyboard interaction with a focused button and unchanged scroll position:

| Viewport | Initial button top | After first press | After second press |
| --- | ---: | ---: | ---: |
| 1280 × 900 | 773.9 | 889.4 | 915.8 |
| 375 × 812 | 637.0 | 778.9 | 831.7 |
| 390 × 900 | 725.8 | 867.7 | 920.5 |

The button is 44 pixels high. Both actual themes produced these measurements. Its first press expands the calculation above it, leaving the next required control partly below the viewport. The completed state moves the focused button fully below the viewport. DOM focus remains on the control, so a focus-only automated check does not catch this visible progression problem.

Direction: keep the controls before the changing calculation, or use another measured layout that retains their visible position without scripted scrolling or a large blank reservation. The parent accepted the finding and will provide a rebuilt version for independent verification.

No other substantive learner-facing finding was established in the initial pass. In particular, I did not treat the small worked subtraction as leakage of the different 32-bit prediction's answer.

## Checks performed on the first build

Used real Chromium at 1280 × 900, 375 × 812 and 390 × 900, each in light and dark themes. Verified actual computed background/foreground colours changed with the theme selection; inspected screenshots of initial and wrapped states. The carry and retained bits have separate labels and outlines; no page-level horizontal overflow or page errors occurred in any of the six combinations.

In all six combinations I followed the named controls using Enter and Space, inspected both completed additions, reached the wrapped result, checked that the ring remained gated, submitted the original prediction, and ran a valid learner-written function through its tests. Reload restored wrap progress, prediction and edited source. Reset returned only this wrap example to its starting state; the committed prediction, open ring and edited source remained. These operations completed functionally even though the control-position finding above remained.

The visible route is discoverable in the on-page navigation: How a counter wraps → Subtracting with addition → Elapsed across the wrap → Counting forward across the wrap → Writing elapsed yourself. The starting, completed and zero-result states identify what the counter stores. The next-pane join names the earlier/later readings, and the subtraction pane remains readable without requiring completion of the wrap controls.

The increment/carry mechanism is defined and demonstrated here, and is already practised as binary arithmetic in Module 1. The new context composes that mechanism with elapsed subtraction through a small complete worked example. The larger-width prediction and written function supply independent application. A still smaller counter would save little and break continuity with the existing four-bit preparation; retaining this miniature avoids that extra translation. This is a design judgement, not measured evidence of learning.

## Final independent verification

The parent moved Advance/Reset immediately after the instructions and before the changing result. I independently reran the complete six-combination browser procedure against the rebuilt page, including keyboard activation, both additions, gated ring, submitted prediction, a valid edited function, reload and wrap-only Reset.

The focused button now remains fully inside the viewport, with unchanged scroll position and zero measured movement after either press:

| Viewport | Initial / first / second button top | Button height |
| --- | --- | ---: |
| 1280 × 900 | 660.125 / 660.125 / 660.125 | 44 |
| 375 × 812 | 523.266 / 523.266 / 523.266 | 44 |
| 390 × 900 | 612.047 / 612.047 / 612.047 | 44 |

Both actual themes produced these measurements. I inspected the rebuilt screenshots; the carry/stored-bit split remains readable and separately labelled. All six combinations retained the saved edited source and committed prediction when Reset was used, and had no page errors or horizontal overflow. The accepted medium finding is resolved in the final built page. The earlier measurements remain above as the first-build failure evidence; they are not replaced by the successful recheck.

No additional substantive learner-facing issue was established in this final pass. Functional completion and this review support proceeding; they do not establish novice understanding.

## Limits

This is one page's independent learner-perspective review, not a novice participant study. I did not test a screen reader, browser zoom, alternate fonts, other browser engines or physical touch hardware. Full-suite results and GNU/QEMU accuracy verification belong to the managing session/technical review and are not claimed by this record. No challenge solution is reproduced here.
