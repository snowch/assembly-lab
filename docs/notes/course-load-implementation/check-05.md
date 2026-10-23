# Masks and fields: independent learner/checker review

Copyright © 2026 Christopher Snow

23 October 2026. Independent review of Module 3's first lesson. No application edits, build, compiler request or challenge solution submission. Read AGENTS.md/CLAUDE.md, the front-page entry requirements, earlier lesson prose, all ten masks sections, the lesson/challenge definitions and recorded programs, and relevant prediction, mask, bit-operation, field-reading, solution and comparison sources. The learner has completed Modules 0–2 and has no later-course knowledge. This check judges the rendered lesson and implementation; it does not infer effectiveness from the implementation account.

## Accepted review05 changes

- **Medium switching finding resolved:** “The figure combines a word and a mask with the instruction you choose” now leads directly to the bit-operation experiment. “A run of bits that together hold one number is called a field” and the shift/extraction explanation belong to the subsequent field-reading figure. The three operation rules remain available before the experiment and the selected operation repeats its rule locally.
- **Medium-priority construction hypothesis addressed by a bounded preparation:** “Start with a gear that already fits its three bits” gives clear/place/keep subgoals and asks for the replacement word before the general construction. Its post-commit explanation introduces the extra requirement for values larger than the field. “Only its low 3 bits may land in the field” makes the extension explicit in the construction. This is a sensible prototype of the accepted direction, not evidence that novice learning outcomes have improved. It retains an independent assembly synthesis task, graduated hints and the later missing-clear investigation.
- **Low phone column finding resolved:** the experiment defaults to a numbered eight-bit group using large cells. Higher/Lower bit selection changes the displayed byte, while “Show all 32 bits” retains the entire model state. Numeric values and the semantic before/after table remain complete.

## Prerequisites and answer boundaries

No confirmed untaught external prerequisite. Module 0 teaches operands, register reuse, arguments/results, the colon function label, ret, assembly editing and compiler settings. Module 1 teaches hexadecimal, signed/unsigned readings, set/clear, the relationship between w/x register names and upper-half placement. Module 2 teaches carries and bitwise complement in subtraction. Local prose explains warning constants, C bit operators, masks, fields, standalone lsl and ubfx. The x0 qualification explicitly connects extraction to the previously taught 32/64-bit views. New field replacement remains deliberate composition rather than an assumed earlier skill.

The first prediction's explanation and MaskView wait for commitment; the basic experiment and field-reading prose/diagram wait for that same commitment. The preparation prediction's explanation is held until its own commitment. Initial construction exposes requirements, not completed assembly. The learner's stepper opens after a run; the GCC comparison requires a pass. The later broken-clear prediction gates both its execution/comparison views. Source tracing confirms figures use assembled operands and simulator traces: selected columns, changes, fields and results do not come from prose answer strings. The preparation uses the existing register-result measure, so its correct option is derived from executing the recorded program.

## Browser evidence

Checked the final production preview at http://127.0.0.1:4322/assembly-lab/#/lesson/masks in fresh Chromium contexts at 375×900 and 1280×900, both actual light and dark themes. The html theme attribute and rendered body backgrounds confirmed light `rgb(243, 246, 245)` and dark `rgb(16, 22, 21)`. All four contexts had no page error and no page horizontal overflow initially or after the interactions.

In each context checked initial locked figures and absent prediction outcomes; selecting an option without commitment; committing the first prediction; changing the operation/input; navigating across the byte boundary and back; opening/closing full-width inspection; the newly placed field-reading explanation and diagram; initial/committed bounded preparation; the initial construction attempt, first hint, own-code step through return and still-locked post-success comparison; and commitment of the missing-clear prediction. Read all ten rendered sections and checked their sequence against the source. Viewed representative screenshots of phone light/dark low/high columns, preparation and attempt, and desktop light/dark field/experiment states. The active columns are readable, retain complete numeric values and keep the high input bit. Full-width inspection remains available. A deliberately incorrect preparation choice receives the simulator's result only after commitment.

Additional fresh phone restoration check: committed predictions, released experiment/field and failed-attempt stepper survive reload, while the GCC comparison remains locked. The saved attempt can be cleared independently of predictions.

Evidence: `/tmp/check05.cjs`, `/tmp/check05-results.json`, `/tmp/check05-restore.cjs`; screenshots and rendered initial text use `/tmp/check05-{width}-{theme}-`. The first harness run incorrectly attempted Lower bit after it reached bit 0 and timed out on the correctly disabled control. Corrected harness then completed all four contexts; this was a harness error, not a product defect. No full-suite result is claimed here.

## Verdict and limits

No new confirmed learner-facing finding or blocker. The accepted experiment ordering and phone readability fixes are confirmed in the final build. The in-range preparation implements the accepted staged-construction direction while preserving meaningful synthesis. Its impact on learner performance remains unmeasured.

Post-success comparison, successful nontrivial assembly, full hint ladder, every input/bit, invalid-input states and all keyboard/pointer paths were source-reviewed only or not exercised. Browser work intentionally used an initial failing attempt and one hint; no challenge solution or final challenge answers were submitted. No challenge answers appear in this note.
