# Production promotion validation

The original private-preview results remain in the earlier review/recovery records and PR history. They do not establish a passing production-promotion suite.

## Preliminary production checks

The first focused production run covered shell, App status and calculator tests against the first uncommitted promotion build. It exited with 27 failed, 59 passed and 2 intentional skips. There were three distinct findings:

- Compact-header inheritance reduced the status panel's build identifier to 10.32px. Keep the menu contents at the normal reading size independently of its compact button.
- The completion note's 760px container exceeded the existing reading-measure check at its smaller font size. Bound the note's reading measure.
- The responsive calculator test expected 32 columns in the former wide lesson area. The approved layout gives its main column 760px, fitting 16. Preserve the 4/8/16 breakpoint checks and add a genuinely wide test host for the existing 32-column check, while requiring the normal sidebar layout to show 16 and remain contained.

The source fixes and focused reruns are recorded separately from that failed command. No existing size or reading-measure threshold is weakened. Shared palette/header rules now live in the course layout stylesheet; the flags lesson retains its teaching-specific styles.

The corrected v4 focused rerun exited successfully: 86 passed, 2 intentional skips.
The same uncommitted promotion source passed formatting, copyright, platform integrity,
strict TypeScript and all 3,471 unit/integration tests. The test-migration record gives
the separate 54-pass broad layout/flags run and 18-pass v4 follow-up. These preliminary
results are not substituted for the final stable-commit full check.

The first committed-source full check on `adfdc4b` exposed one further stale keyboard
expectation in the compiler-note test. At 1280px the command now fits: its client and
scroll widths are both 636px, so Chromium tabs directly to the second note summary.
At 375px it still scrolls (281px client width, 613px scroll width), and Chromium gives
the command its own keyboard stop. The correction retains all note-opening, content,
Enter/Space and subsequent summary-focus assertions; it requires the extra command
stop only when the command actually overflows. Independent measurements confirm both
branches. The original run remains separate from the corrected committed-source check.

That same first full run also exposed a page-wide disclosure selector in the optional
A32 layout audit. It tried to click the new mobile outline summary while that outline
was hidden on desktop. Scope this audit to lesson teaching panels and App status,
retaining all original content, containment and legibility checks. The production
outline suite separately exercises the responsive navigation. Superseded local runs
were stopped gracefully and retain their own logs/results rather than being counted
as passing full checks.

After the shared control fix, all 16 affected optional-A32 cases passed independently.
Both published recorded-reference summaries also passed 8 width/theme states for
native markers, pointer/keyboard activation, containment and 44px-or-greater hit areas.

Once the optional-A32 audit reached the teaching panels, its existing size check found
a real phone hit-area defect: the shared recorded-source summary was only 26.39px high
in `a32-conditions`. Canonical source defines two further references in
`a32-division-helper`, but its published pacing omits one. The shared class covers
both published controls and every canonical instance.
Give `.al-recorded-reference > summary` a 44px minimum height and block padding in the
shared view stylesheet, preserving its native disclosure marker and all existing
legibility/containment assertions. The pre-fix affected run exited 1 with 14 passed
and 2 phone/theme failures; that failed result remains separate from the fix checks.

The interrupted `adfdc4b` browser stage reported 529 passed, 6 failed, 14 skipped,
1 interrupted and 940 not run. Its failures were the stale desktop compiler-command
Tab expectation and the page-wide optional-A32 disclosure selector. The superseded
`9493edd` run had passed static checks and 3,471 unit/integration tests, then stopped
with 102 browser tests passed, 1 skipped, 1 interrupted and 1,386 not run. Both full
commands exited 130 after graceful cancellation. Their logs and traces are retained
separately; neither is a passing full run.

The `041831d` broad browser run found a further real geometry defect in hexadecimal
feedback. The new line spacing is 1.65, while the reserved message space still used
1.6em per line. Invalid input moved the action row by 0.75px on desktop. Reserve the
actual line height with `1lh`, or `2lh` for the phone's two-line message. The existing
exact geometry assertions are unchanged. Independent verification passed the exact
test in both projects and an eight-state width/theme/sibling matrix; measurements and
visual checks are in `promotion-feedback-review.md`.

The superseded `041831d` local full check had passed its static checks and all 3,471
unit/integration tests. It was stopped gracefully before the known feedback failure
to run the corrected candidate, exiting 130 with 177 browser tests passed, 1 skipped,
1 interrupted and 1,311 not run. It is not a passing full check. Its separate broad
browser run continues against its immutable original build to uncover any other
findings; the final outcome is recorded in the PR rather than relabelled a pass.

Final committed-source checks, independent reviews, merge and publication results are recorded in the implementation PR. Historical interrupted or stale-artifact checks must not be counted as a passing full final suite.
