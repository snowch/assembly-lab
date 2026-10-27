# Two-argument function validation

Copyright © 2026 Christopher Snow

## Scope and review

The existing Tiny function lesson now includes a second, always-visible worked example in its
construction section. Its recorded add_ints listing has two int arguments and a single addition,
then a return. The original increment figure, challenge and persisted IDs remain unchanged.
The shared view derives caller inputs and current registers from the model; only w0 becomes
result ready/result. w1 remains labelled as an argument, with no ABI preservation promise.

Checked source/compiler/model facts and the native differential record:
[compiler and ABI brief](../module-0/two-arguments/README.md). Separate draft/canonical records:
[Fundamentals prose](prose.md) and [shared figure prose](primitive-prose.md).
Independent whole-lesson reports:
[learner review](two-arguments-learner-review.md) and
[technical review](two-arguments-technical-review.md). They cover the original and new function
in initial, ADD-ready, returned, reloaded and reset states at 375/1280 in actual light/dark themes.

## Completed automated checks

- Full local unit/integration run: **154 files, 2,926 tests passed**, 207.06 seconds;
  `/tmp/two-args-units.log`.
- Focused content/view/source-association run: **6 files, 140 tests passed**, 9.45 seconds;
  `/tmp/two-args-focused.log`.
- Actual GNU/QEMU differential: **1 program, 8 calls, 24 states, zero differences**;
  `/tmp/two-args-native.log`. Independent technical reviewer repeated the differential check.
- Production build passed, 15.30 seconds (`/tmp/two-args-build.log`). Existing bundle-size warning
  remains separate from success.
- Whole-repository formatting passed. Strict types passed after the test-only correction below;
  copyright, platform-copy integrity and whitespace checks passed.
- Focused production-browser run: **103 passed, 1 intentional skip**, 5.0 minutes;
  `/tmp/two-args-browser.log`. Includes the whole Fundamentals suite, new two-argument states,
  shell/navigation and course-wide compiler-disclosure checks at both widths/themes.
- Shared canonical-prose test rerun after the type-only correction: **1 passed**, 1.10 seconds;
  `/tmp/two-args-prose-rerun.log`.

No physical Arm processor was used. The instruction comparison uses actual GNU output under
QEMU user mode; the browser states come from the course model.

## Earlier attempts, retained separately

The first new listing-facts harness finished with 2 passes and 8 failures because it used a
nonexistent trace accessor and the wrong parsed-label representation. Both were corrected in
the tests; compiler output and product instructions were unchanged. The subsequent listing
facts run passed all 10 tests. The source brief retains this history.

The first complete strict-type command failed in the new prose-record test: its explicit
`value is string` predicate widened a literal-string union illegally. Replacing that filter
with an equivalent narrowing flatMap corrected the test types without changing any assertion
or product behaviour. The following strict-type and focused prose runs passed. The original
failed command remains distinct from those reruns.
