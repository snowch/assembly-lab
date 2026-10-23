# Check 01: Same bits, two readings

Independent learner/checker review, 2026-10-23. Built site at
`http://localhost:4322/assembly-lab/#/lesson/one-pattern-three-readings`.
No application edits or build were made by this reviewer.

## Verdict and findings

No actionable learner-facing fault found in the checked changes. Severity: none.

The construction now says, “Use the optional scratch register beside this exercise to try a
pattern and inspect its readings. It starts with all bits clear. Changes there do not fill in
your answers below.” The rendered interaction matches those directions. “Try a pattern in the
scratch register” is initially closed. Opening it shows a zero pattern and zero readings;
changing a bit changes its pattern and readings without setting the exercise's bits, filling its
number field, or changing the earlier investigation reader. Clear bits returns the scratch to
zero. Closing and reopening the disclosure retains its local work. Direction: retain this
separation and optional disclosure.

Prediction feedback names the submitted choice and compares it with the observed model result.
The added-instruction stepper has no Next control before commitment and becomes available after
commitment. The comparison likewise withholds its assembly until commitment, then explains
whether the selected claim matches the comparison. Direction: retain the commitment gates and
specific observed-result feedback.

The initial subtraction figure explicitly says “Initially before the subtraction; press Next to
run it.” Its before/after labels follow Next and Reset. The optional scratch does not reveal a
worked challenge solution on arrival; the completion explanation is absent before success.
No challenge answers are recorded in this note.

## Coverage

Read AGENTS.md and CLAUDE.md; all ten lesson sections, objectives, closing model note, challenge
labels and hints in source; the entry prerequisites; Module 0 prose; the lesson data and current
RegisterReader, ListingCompare and readings model source. The entry permits basic C and binary
conversion. Module 0 supplies operand order, argument/result registers, ret, listing conventions,
GCC and the optimisation setting. This lesson introduces hexadecimal and signed/unsigned readings
before its construction. No new unexplained prerequisite was identified in this pass.

Used real headless Chromium on the supplied final server with fresh browser contexts at 375 and
1280 pixels, requesting light and dark through stored preference and checking the rendered
`html[data-theme]` value. At 375 light, 375 dark and 1280 light, exercised initial subtraction,
Next and Reset, wrong prediction commitment, unlocked stepping and reset, investigation clear/bit
and calculation controls, scratch disclosure/bit/clear/reopen, independent exercise entry and
failed grading, comparison commitment, and measured page width. No page errors occurred in those
three complete runs; scrollWidth equalled viewport width.

An initial fourth-context run timed out waiting for the scratch figure. An isolated fresh
1280 dark rerun succeeded: actual dark theme, scratch toggle and original-reader independence,
prediction commitment, comparison commitment and shared-listing disclosure, and no page overflow.
This focused rerun does not erase the original timeout or establish its cause.

Opened “How the instructions relate to C” at both widths. It supplies each complete numbered C
function with its checked instruction associations. On the phone the paired listing remains a
contained horizontal piece. Inspected phone scratch and comparison screenshots, including the
open association disclosure. Screenshots were captured for all four width/theme combinations.

## Limits

This was a focused learner/checker pass, not a full-suite result. Did not run the repository
suite, rebuild, or repeat native differential checks. Successful challenge completion,
persistence across reload, keyboard-only navigation, assistive technology and offline behaviour
were not independently tested. Source reading supports the local-state implementation; no claim
of exhaustive state-space coverage is made. The isolated desktop-dark rerun covered fewer states
than the other three combinations.
