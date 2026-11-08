# Independent learner and UX review

Reviewed the working-tree diff on 7 November 2026. I did not draft or edit the
implementation and read the actual diff before any author rationale. Read
`AGENTS.md`, `CLAUDE.md` and `docs/style.md`, then the comparison lesson and its
prerequisites. This report covers the changed comparison, action and count wording.

## Verdict

No learner-facing finding in the reviewed change. No correction requested.

“Both listings have the same machine instructions” compares the two listings
clearly. It does not suggest that every instruction within one listing is the
same instruction. The two named C functions, their different parameter and return
types, and their paired instruction listings remain distinguishable.

Before the first action, “The simulator runs each function independently from the
same starting arguments” explains the two calls. “Their matching returned bits
appear once, with a separate C reading for each return type” explains why one bit
display leads to two values. After running, “Returned w0 bits shared by both calls”
works with the separate named return cards and the statement “Both calls returned
the same bits in w0.” I could explain the two executions and the shared display
without inferring that one function consumed the other function’s result.

“Run comparison” and “Reset comparison” describe the visible activity and match
the directions. The initial disabled Run control, the enabled control after
commitment, the returned results and Reset control, and the restored states were
consistent. Reset clears the returned display while preserving the checked
instruction comparison. The surviving feedback remains true in that state.

The changed wording introduces no additional numerical prediction answer.
Instruction-summary feedback stays gated by commitment; numerical returns and
worked readings stay gated by running the comparison. The advance statement about
matching bits does not identify the instruction sequence or reveal a numerical
return.

“Tests passed: … of …” makes the passed count and total clear for both single-test
and multi-test challenges. It avoids singular/plural ambiguity without changing
what a failed test means. The local singular argument and instruction branches are
also grammatical.

## Prerequisites and assumed knowledge

The review assumes the front page’s C prerequisites and every earlier published
lesson, with no later lesson required. Earlier `tiny-function` defines a listing,
caller and argument, explains GCC and its optimisation setting, and connects
arguments and results to registers. The earlier sequence and synthesis lessons
teach execution and returns. Module 1’s preceding readings and four-bit arithmetic
teach signed and unsigned readings, bit weights, fixed widths and subtraction.

This page locally states that `unsigned` means `unsigned int`, gives the target
width and explains the comparison controls before they are used. “Independent” and
“shared” are ordinary descriptions supported by the local explanation. I found no
new unexplained assumed knowledge introduced by the changed wording.

## Browser checks

Used Chromium through Playwright against the built preview at
`http://localhost:4513/assembly-lab/`. Confirmed the new visible strings before
judging them. Ran every combination of 375 × 900 and 1280 × 900, light and dark.
Checked the actual `data-theme` value and visually inspected rendered screenshots
in both themes and widths.

- `arithmetic-on-register-bits`: initial, committed with a wrong prediction,
  returned, reloaded returned, reset, and reloaded reset. Checked the instruction
  summary, button availability, one returned-bit display and the return readings.
- `building-constants`, `build-1000000`: initial, failed single test, passed single
  test, restored pass, and Clear work. The feedback used the new count wording.
- `meet-the-machine`, `trace-the-call`: partial pass, full pass and restored full
  pass for its actual two-test challenge.
- `branches`, instruction-count prediction: initial outcome hidden, committed
  plural feedback and restored feedback.

Both scratch browser scripts exited successfully. There were no skips or failed
assertions. The comparison/challenge script captured no page errors. Page scroll
width equalled viewport width in its checked states. Screenshots and scratch
scripts are under `/tmp/wording-review-shots/` and `/tmp/learner-*-review*`; these
are session evidence, not committed course material.

## Source-only checks and limits

Read the singular argument caption, the singular instruction-count branch and
their new focused test cases in source. No published lesson currently mounts
`arg-registers`, and the one-instruction count is a component fixture, so those
singular branches were not claimed as built-page browser checks. Read the generic
comparison fallback and differing-listing wording in source; the published lesson
exercises matching machine instructions. Checked the corresponding canonical copy
record against the changed action wording.

This review did not run the repository’s full suite, GNU/QEMU checks, screen-reader
software, or all course challenges. It does not claim those results. The browser
work checks this change’s learner states and representative real count feedback.
