# Independent check: Adding, and the four flags

23 October 2026. Checked the supplied final built site at `http://localhost:4322/assembly-lab/#/lesson/adding-and-the-flags`. No application edits or rebuilds. This is one-lesson learner/checker verification, using only the opening and Module 1 as prerequisites.

## Outcome

No blocking or medium-severity finding in the changed treatments. The accepted reference-distance issue is corrected: “For these 32-bit additions” introduces all four unworked flag rules immediately before the first flag exercise. The first hint reinforces the carry distinction without replacing the exercise. Direction: retain this local reference and the three independently grouped cases.

The optional “Enlarge the selected group” preserves the calculation's task focus. It is absent before any column is worked, opens separately from the main grid, names the selected bit range, and shows dots for unrevealed result/carry cells. After one column, only one result cell is shown; grouping advances to four worked columns. Reset returns to zero worked columns, removes the enlargement and reveals no result cells. The original operand rows remain visible and the 32-column grid retains its layout. No early sum or flag answer appeared in these states. Direction: retain the optional enlargement and its partial-reveal boundary.

## Browser evidence

Fresh contexts at 375×900 and 1280×900, each in light and dark system preferences. Verified actual body colours `rgb(243, 246, 245)` and `rgb(16, 22, 21)` respectively. Initial, committed, one-column, grouped, completed, expanded-detail and reset states had zero document horizontal overflow. Measured visible buttons were at least 40px tall. Screenshots and scripts: `/tmp/check03/`; logs `log.txt`, `detail.log`, `wrong.log`.

In all four contexts: the first unchecked prediction locks the adder; an incorrect committed prediction opens it and leaves explanatory feedback. Next column, Next group of four, Show all and Reset work as named. The initial sum has zero revealed cells. Inspected phone-light and desktop-dark expanded screenshots directly; other screenshots were collected and their text/state/geometry checked programmatically. The phone's compact overview remains dense, but the separate readable four-bit view does not compress or replace it.

In all four contexts: the construction with empty fields requests completed choices, its first hint is available, and the follow-up adder stays locked. In an additional phone-dark context, a fully populated incorrect attempt receives flag-specific rule feedback; it does not print a solution table. The first hint says “C is the carry out of the top bit” and asks the learner to compare carries for V. Existing selected inputs remain present.

The flag-persistence prediction and two arithmetic steps were exercised in all four contexts. The additional phone-dark check captured the first and second states explicitly: after `add`, the status says “N, Z, C and V were not updated by add.” Registers and flag values agree with the model, and write outlines remain distinct from changed-flag outlines. The GCC disclosure opens without affecting the main activity.

## Reading and technical checks

Read all ten lesson sections, questions, captions, tasks, hints and disclosures in the lesson source; inspected rendered main-path text and the first hints. Read repository AGENTS/CLAUDE guidance, relevant style/visual-language guidance, earlier-prerequisite prose, recorded lesson listings, `AdderFigure.tsx` and the model's `addWithCarry` implementation. The diagram's operands, carry record, result and flags come from the simulator; the expanded cells reuse the same records and visibility rules. The model sets N from the top result bit, Z from zero, C from carry out and V from differing top carries. The repository source register and arithmetic tests provide the technical-source context; no new external Arm/QEMU run was performed.

Prior knowledge assumed: register operand order, `add`/`sub`/`ret` and stepping from the opening; hexadecimal, top-bit numbering, signed/unsigned readings and their ranges from Module 1; `w`/`x` width from Constants and widths. GCC and `-O1` were explained in the opening. The optional unfamiliar compiler instructions are explicitly deferred and are not needed for the task. No new unexplained required prerequisite found. The ten-section progression moves from a familiar reading prediction to carries, four-rule practice, persistent flags, and signed-overflow synthesis without introducing an extra required control mode.

## Limits

Did not solve either challenge, inspect successful-challenge follow-up arithmetic in the browser, open later hints or the reflection answer in the browser, or exercise keyboard/screen-reader navigation, reload restoration, arbitrary inputs or live GCC calls. Later hint/reflection content was source-only. No suite/build result is claimed. This check is bounded rendered-state verification, not a measured novice-learning outcome.

## Final affected recheck after summary target correction

Rechecked the final production build on port 4322 after the managing session reported `/tmp/learner-build-final-css.log` successful. Fresh 375×900 and 1280×900 contexts in both actual light/dark themes again. The “Enlarge the selected group” summary now measures **44px tall in all four contexts**. It retains native `display: list-item` and `list-style-type: disclosure-closed`; direct inspection of the final phone-light screenshot shows the native open triangle and visible keyboard focus outline. Keyboard Enter opens it, Space closes it, and pointer click reopens it in every context.

After one column, the overview still shows exactly one result cell and the enlarged Answer row still shows three unrevealed dots and that one result cell. The original operand cells remain visible. Expanded detail causes zero document horizontal overflow in all four contexts. Reset returns `data-done` to 0, removes the optional detail entirely, and leaves zero revealed sum cells; document overflow remains zero. Actual body backgrounds again matched the light/dark values recorded above. No regression found in the affected states.

Exact final evidence: `/tmp/check03/final-summary.cjs`, `/tmp/check03/final-summary.log`, and `/tmp/check03/final-{375,1280}-{light,dark}-summary.png`. Direct image inspection covered final phone light; all four contexts received computed-style, keyboard, pointer, state and geometry checks. No other lesson was inspected and no application/build changes were made.
