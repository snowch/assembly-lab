# Arithmetic with four bits: implementation and verification

## Implementation

Published a named Module 1 lesson after Signed and unsigned readings and before Arithmetic on
register bits. Three model-derived figures show column addition, the four-place boundary, and
inversion plus one followed by addition. A separate fresh exercise checks the opposite pattern,
retained result and width rule. The grader recomputes answers from inputs. Worked examples do
not expose that exercise's answer; the final hint and passing feedback do.

The next fuel page explicitly applies the rule at 32 bits. The later subtraction-flags page
keeps its 32-bit calculation, zero-input case and carry/no-borrow explanation, while replacing
its duplicate four-bit example with a short bridge. Added the underlying ADD/SUB calls to the
GNU/QEMU corpus. The course's machine register width is unchanged.

Drafting: GPT-6.1 Sol Medium. Figure engineering: GPT-6.1 Sol High. Independent learner review:
GPT-6.1 Sol High. Independent technical review: GPT-6.1 Sol Extra High. Reviews assess clarity,
correctness and usability; no novice study has established learning effectiveness.

## Focused checks

- Initial focused unit command: exit 1, 78 passed / 2 failed. The term gate rejected an internal
  mode named `wrap` and ordinary form word `field`; a new jsdom test also used a non-file URL.
  Changed the mode to `width`, the form word to `box`, and the test's filesystem path.
- Focused content and Module 2 canonical-copy rerun: exit 0, 35 passed.
- Figure helper/component checks: all 7 passed before the additional corpus-coverage test.
  Helpers exhaust all 256 four-bit input pairs for ADD and SUB, checking model state against
  independent modulo arithmetic and each column's recurrence.
- Initial browser command: exit 1, four tests failed because the checker treated the bridge's
  visible `sub` code as a leaked answer. Corrected the selector to the gated explanation.
- Second browser command: exit 1, four tests failed because the checker omitted the existing
  Discard work confirmation. Corrected the test to complete the actual clear-work flow.

Focused reruns, independent browser review and full-suite results are recorded separately below.
- Third browser command: exit 1, 2 desktop passes / 2 phone failures. The design checker found
  a zero-font-size arrow text node beneath a CSS replacement. Replaced that technique with
  an explicit decorative glyph rotated on phones; the label remains upright. No test tolerance
  was loosened. Independent final-build review and the full browser suite cover the correction.
- TypeScript check passed after adding lesson, grader, tests and corpus coverage.
- Final focused browser command on the corrected build: exit 0, all 4 tests passed
  (desktop/phone × light/dark). Covers course-plan discovery, previous/next navigation,
  keyboard column reveal, completion/reset, width and negation results, blank/wrong/correct
  exercise, gated explanation, persistence, clear confirmation and design checks.

## Independent final-build reviews

Both reviewers completed phone (375px) and desktop (1280px) checks in actual light and dark
rendered themes. Neither found an outstanding teaching or technical blocker. They verified the
final connector markup, four-column reveal/reset, boundary and negation figures, the fresh
exercise and saved-work behaviour. See the separate learner and technical reports for exact
scope, limitations and initial checker failures.

## Full-suite first run

`npm run check` exited 1 after unit tests: 177 files passed, 2 files failed; 3,169 tests
passed, 2 failed (3,171 total). Both failures were timeouts in existing tests:
`AssemblyEditor.calls.test.tsx` (20-second local test limit) and
`option-order.test.tsx` (30-second suite limit). No assertion mismatch was reported.
Formatting, copyright, platform-integrity and types passed. Build/browser stages were not
reached. Rerun with bounded worker concurrency below; no timeout or assertion is relaxed.

The two timed-out files passed unchanged with `VITEST_MAX_WORKERS=1`: exit 0, all 156 tests
passed in 68.78 seconds. The full check is rerun with that same worker limit to avoid local
CPU contention. This changes concurrency only, not the test coverage, assertions or timeouts.

## Full-suite bounded-worker rerun

`VITEST_MAX_WORKERS=1 npm run check`: static checks, TypeScript, all 179 unit/integration
files (3,171 tests), and the production build passed. The build has the same JavaScript and CSS
assets inspected by both independent reviewers. Full browser-suite result follows.

During the full browser run, the new lesson's four desktop/phone and light/dark tests passed.
The existing phone `change-loop-boundary: edited C runs with instruction and source highlights
from the model` test reached its 60-second overall timeout while tracing the loop (line 116).
Its desktop counterpart passed. The rest of the full run continues; final browser counts,
any focused rerun, and remote CI results will be recorded in the pull request before merge.
