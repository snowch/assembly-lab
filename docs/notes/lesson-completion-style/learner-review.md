# Independent learner review: completion button styling

Reviewed the brief, implementation diff, `CLAUDE.md` and both closing passes in `docs/style.md`.
The reviewer did not implement this styling. Only this review note is owned by the reviewer.

## Accepted finding, corrected

**Low: the longer undo label changed wrapping near the breakpoint.** At 481 pixels in both
themes, on “Boot and test your Pi”, “Mark lesson complete” and “Next lesson / The same C on
32-bit Arm” fitted on one row. After marking, “Mark lesson incomplete” widened the action
from 206 to 218 pixels; Next moved to a new row. The button became 48 pixels tall instead of
70, and Next moved 60 pixels down. Undo reversed the jump. Focus remained on the button and
nothing overflowed, but the toggle moved the next action. Direction: reserve enough width for
either label so wrapping stays stable. Evidence is preserved in
`/tmp/lesson-completion-style-learner-initial/481-light-middle-initial.png`, the matching
`marked-focus.png`, dark screenshots and `results.json`.

The managing session accepted the finding and reserved a 15-rem action width, with full width
on phones. Independent final-build verification: the action is now 240 pixels wide at 481
pixels, and both labels keep Next on the same separate row. The complete five-width matrix
asserted identical control rectangles before marking, after marking and after undo. All passed.
The finding is closed.

## Independent browser evidence

The final production build completed in 17.73 seconds, recorded in
`/tmp/completion-style-final-build.log`, and was served on port 4411. Independent Chromium
contexts covered 375, 481, 600, 768 and 1280 pixels in actual light/dark themes. The first lesson
(“One addition”), an interior reading-only lesson with longer navigation titles (“Boot and test
your Pi”), and the last lesson (“The same C on 32-bit Arm”) were checked in initial, hover,
marked/focused, marked/hover and undone/focused states: 150 state checks and footer captures.

- The unfinished action now has a prominent filled surface. The marked state uses a pale
  surface and a tick inside the circle. The shape and label distinguish the states as well as
  colour. The approved labels still describe a manual action without implying an exercise result.
- At 375 pixels the action fills the available 343-pixel width and is 48 pixels tall. On shared
  rows at 1280 pixels it stretches to the navigation cards’ 70-pixel height. Intermediate-width
  rows wrap without overlap or horizontal overflow. First and last lessons remain usable with
  a missing Previous or Next link.
- Enter marks and Space undoes. Both actions preserve the same button and visible keyboard
  focus. Exact accessible names remain “Mark lesson complete” and “Mark lesson incomplete”;
  the decorative icon is hidden from assistive technology. Full viewport screenshots confirm
  that the focus outline is visible on all sides. No new heading or term is introduced.
- Settled text/icon contrast in light theme: initial 8.13:1, hover 11.37:1, marked 6.81:1,
  marked hover 9.53:1. Dark theme: 10.49:1, 13.56:1, 7.78:1 and 10.06:1 respectively. Undo
  restores the initial colours. Measurements wait for the existing background transition to
  finish and keep pointer hover separate from keyboard focus.
- No control overlap, page overflow or browser page error was found. The action stays beside
  Next on shared rows and above it when the forward group wraps. Marking and undoing no longer
  change any sampled footer control’s position or size.

Final evidence: `/tmp/lesson-completion-style-learner/results.json`, 150 footer screenshots and
60 full viewport focus screenshots. The reviewer inspected phone and desktop initial/marked,
hover/focus and intermediate wrapping captures in both themes. The first attempt to connect
preceded preview startup and failed with connection refused; it ran no UI checks. The preview
was then started, and both the initial matrix and the final correction matrix completed.

## Limits and verdict

This is a focused visual and interaction review, not a new persistence, grading or full-suite
result. No physical touch-device or screen-reader session was run. The styling introduces no
new assumed assembly knowledge. No lesson answer is included in this review.

Status: ready. The accepted finding is independently verified as corrected. No open learner
finding remains in this styling scope.
