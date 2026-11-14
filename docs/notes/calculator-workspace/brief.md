<!-- Copyright © 2026 Christopher Snow -->

# A focused header calculator workspace

The user requested a calculator revamp after reviewing its long dialog: horizontally aligned bits, visible operation inputs/result, separate Calculate and Edit bits views, and an optional half editor. They explicitly requested merge when complete and restoration of the GitHub star link. A separate navigation fix is already pinned and undergoing CI; work here uses an isolated checkout until that fix merges.

Outcome: enter two values, perform a bounded-width operation, compare both input patterns with retained output at identical bit positions, and inspect/edit a single pattern without mistaking the tool for instruction execution. Earlier course lessons teach binary/hex, signed readings and widths; the standalone header still needs local labels for interpretation and truncation.

Use the existing calculator model for parsing, readings, normalization, halves, add/subtract and left shift. Do not add another arithmetic implementation or claim CPU flags/instruction execution. Retain decimal/hex entry, width 32/64, signed/unsigned reading, exact-versus-retained distinction, clearing/resetting, shifts and 32-bit-half editing. Existing contextual lesson calculators and their exercises remain on the old component; the header receives its own focused workspace.

Calculate view: load A explicitly from the existing Value to enter/Apply controls, choose operation and B (or decimal shift amount), then Calculate. A is preserved; Use result as A explicitly supports chaining. The immutable result snapshot records both patterns, width, reading and operation. Shared horizontal scrolling aligns A/B/Result, with bit indices, nibble grouping, local keyboard scroll and high/low-bit shortcuts. A shift amount is not drawn as a second bit-pattern operand. Untaken calculations show unknown result cells rather than a stale output. Changing an operand/operation/width/reading invalidates an existing result; pending input for A stays distinct until Apply.

Edit bits view: edit A in the existing wrapped-grid visual language, with keyboard access and visible reading/weight inspection. Half editing is an optional disclosure at 32 bits. It must not sit between operation inputs and their result. Reading changes preserve patterns; narrowing keeps low bits; widening fills upper zeros, including in Signed mode.

Preserve close/reopen and route-transition work plus coordinated update handoff. The new state reuses the prior header handoff key and migrates prior pattern, pending entry, operand, width/reading, half/shift drafts and last exact result. Do not silently drop pending work. Scratch state must remain separate from lesson artifacts/answers.

Restore a plain Star on GitHub anchor using the existing repository constant and approved labels. Reuse existing star styles; check 320px header fit with status, calculator, theme and brand. Do not send a star API request or invent a count. Keep the static no-JavaScript header consistent if it previously has the same omission.

Likely difficulties are hypotheses: a destructive calculation hides the first operand; independently wrapped bit rows obscure alignment; an always-visible half editor separates inputs from operations. Observe freshness and reading labels, and compare explicit source/result rows. Successful interaction alone is not evidence of learning. No novice study is available.

Separate copy and independent learner/interface+technical review are required under repository guidance. Check both modes, input errors, result invalidation, chain action,32/64-bit bounds and precision, both readings, shift semantics, unknown result, nibble alignment/shared scrolling, keyboard/focus,320/375/834/1280 light/dark, closed state, route changes and old/new handoff. Meaningful tests must use independent expected results and preserve existing lesson-calculator coverage. Full checks run after commit so the revision footer and test source remain pinned.

## Focused implementation checks

The new component/model tests, legacy calculator tests and static-page tests pass together: 43 tests. This includes a real coordinated snapshot from the prior header component into the new workspace, then a second new-to-new snapshot with a computed result and unfinished entry. The production build passes. Typecheck after adding these tests first rejected Playwright-style `exact` options in Testing Library role queries; the unsupported options were removed (Testing Library already matches these string names exactly). The strict rerun passed before the final commit.

All 12 focused header browser checks pass: desktop/phone projects, both themes, a 320/375/834/1280 layout matrix, 64-bit operand/result alignment, overflow confinement, shared keyboard scrolling and close/reopen position, editor keyboard targets, half editing, result freshness/errors, route isolation, modal focus/resize, normal keyboard star navigation and static no-JavaScript link. No star API/count is added.

Harness history: the first expanded browser run timed out at an exact-label lookup of a wrapping Operation select after the calculation itself succeeded. That run was interrupted after one failure. The corrected role/name locator and actual existing full-result label were verified in the 12-check rerun; no product semantics were changed to satisfy those assertions. Root and independent review both found initial/reopened scroll position was measured before the dialog became visible. The component now waits for a nonzero width before restoring the scroll position; the focused rerun confirms it.

These are focused results, not a full-suite result or a novice study. Final independent review and full checks are recorded separately.

Independent review also identified a local-prerequisite regression: the prior global tool explained Signed/Unsigned and hex beside its readouts. The new Value A readouts now reuse those approved short definitions visibly; result readouts do not repeat them. The final independent layout/readout recheck covers that correction.
