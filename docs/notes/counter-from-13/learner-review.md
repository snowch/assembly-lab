# Independent learner review: count from thirteen

Copyright © 2026 Christopher Snow

Reviewed by a separate agent using the inherited model, without drafting or implementing the change. Formed the assessment from the actual built lesson and earlier preparation before consulting the new author's brief. No application or test files were edited and no build was run by this reviewer.

## Preparation and essential route

The front page requires small C functions with conditions, loops and arrays, basic arithmetic and binary place values. I inspected that prerequisite panel in the browser and the earlier built Arithmetic with four bits, Addition and its flags, and Which instruction wrote the flags lessons. They prepare retained low bits, carry, inversion/add-one/addition and the difference between flag-setting instructions and unchanged flags.

The current page defines the counter and tick before the activity, shows its four-bit width and distinguishes that miniature carry from actual-width C. Its instruction names Advance one tick and the Bits stored / Carry out labels, identifies the visible zero pattern and states that the example pauses there. The mechanism is already defined and demonstrated in earlier arithmetic preparation; this counter context demonstrates its use over three ticks. The following pane explicitly supplies the same earlier/later readings, defines its inversion rule locally and demonstrates the retained subtraction result. The real-width prediction and written function provide separate application after the explicit width bridge.

I found no new untaught prerequisite or substantive wording, sequence or state defect in this scope. In particular, the new three-tick example does not reveal the different 32-bit prediction's result before commitment. Starting at thirteen supplies two ordinary additions before the wrap without requiring a long sequence of clicks. This is an assessment of the opportunity to learn, not evidence that a novice has learned it.

## Actual browser checks

Used Chromium against the built lesson on port 4488, with independent contexts at 1280 × 900 and 375 × 812, each in light and dark themes. Checked the actual root background token, respectively `#f7faf8` and `#101b1a`; viewed wrapped-state screenshots from all four combinations.

All four combinations passed:

- Initial reading is 1101 (13), with no completed addition/carry shown.
- Enter, Space and Enter advance through 14, 15 and zero. The full sums and stored bit patterns match each completed increment; carries are 0, 0 and 1. The final carry remains outside the separately outlined four stored zero bits.
- Advance remains focused and stops at zero; a fourth keyboard activation does not advance the counter. The visible trail reads 13 → 14 → 15 → 0, and the next-pane join names earlier 13 and later zero.
- The subtraction shows 1101 → 0010, then 0010 + 1 = 0011, then 0000 + 0011 = 0011. Its stated three-tick result matches the forward path and retains the shorter-than-a-turn qualification and real-width bridge.
- The original ring stays gated while the small counter is operated. Committing the original prediction opens the ring normally.
- Typed and checked a valid edited function, reloaded, then used the counter's Reset. The saved edited source, successful verdict and committed prediction remained; only the counter returned to thirteen.
- Restored an existing two-tick saved count. It resumes at fifteen under the updated starting value, remains advanceable and reaches zero after the remaining tick. The edited function remains intact.
- No page errors or page-level horizontal overflow occurred.

The controls remain fully inside the viewport and stationary through initial and all three completed increments:

| Viewport | Actual themes | Initial / first / second / third Advance top | Height |
| --- | --- | --- | ---: |
| 1280 × 900 | light, dark | 736.125 / 736.125 / 736.125 / 736.125 px | 44 px |
| 375 × 812 | light, dark | 431.875 / 431.875 / 431.875 / 431.875 px | 44 px |

Page scroll and keyboard focus also remain unchanged during those increments. Results remain available at the paused state and can be read with ordinary page scrolling; no timed animation is required to encounter the carry.

## Findings and limits

No correction was requested from this independent learner review. All browser combinations above completed; no failed or skipped combination is counted as a pass. The review script completed successfully on its first run.

This was a built-page learner-perspective review, not a novice participant study. I did not run the whole test suite, native comparisons, a screen reader, browser zoom/alternate fonts, physical touch hardware or another browser engine. Native accuracy and complete-suite results belong in the separate technical/managing records. No conclusion about learning effectiveness follows from these functional checks.
