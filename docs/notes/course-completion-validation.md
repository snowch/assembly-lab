# Course completion validation

The completion adds 11 lessons: two each in Modules 7–11 and one in optional A.
The course now has 24 lessons. The new lessons retain draft status for author
feedback. They include original recorded compiler examples, construction and
answer exercises, canonical prose and independent reviews.

## Checks run on 18 October 2026

- `npm run check`: formatting, copyright, unchanged platform copy and strict
  TypeScript passed. All 2,628 unit and integration tests in 131 files passed.
  The production build passed. The complete browser suite passed 1,001 tests,
  with 23 intentional viewport-specific skips. The command exited successfully
  with “All checks passed.”
- `AL_TOOLS=/tmp/course-tools npm run check:real-tools`: 191 programs, 2,256 calls
  and 284,666 instruction states compared with zero differences. All 39,675
  instruction lines across 15 files were checked; 184 were outside the supported
  subset and there were zero assembler acceptance disagreements. See the
  [tool versions and scope](course-real-tools-validation.md).
- Independent final page checks passed for [Modules 0 and 7–9](course-final-page-check-7-9.md)
  and [Modules 10–11 and optional A](course-final-page-check-10-a.md), on phone and
  desktop in light and dark themes. The final metadata follow-up confirmed that
  static listings do not claim to be stepped simulations.
- The [independent final code review](course-final-code-review.md) resolved its
  findings, including execution-limit diagnostics and useful C failure feedback.
  The [decision record](course-completion-fixes.md) connects the reader findings
  to the corrections and records the checked limits.
- `git diff --cached --check` passed. No platform source file was changed.

The two final model-note wording changes passed their 20 focused canonical-prose
checks. The final static-listing metadata changes passed formatting and strict
TypeScript; the production build and independent browser check include them.
The full browser run found three diagnostic links below the minimum phone touch
target height. A phone-only prose-link rule gives them 44-pixel targets; eight
independent page/theme/viewport checks and all nine Module 11 phone tests passed
after that correction. The subsequent complete run above includes the fix.

## Limits of the evidence

The real-tools check covers the recorded executable A64 corpus and instruction
acceptance lines. It is not a proof for all programs. Optional A's A32 examples are
retained compiler output, with executable A64 counterparts; there is no A32
simulator. The C compiler intentionally accepts the subset recorded in
[checkpoint 5](checkpoint-5.md), and the optional Compiler Explorer comparison is
not needed to complete a lesson.

Vite reports a bundle-size warning: the main JavaScript bundle is about 1.47 MB
before gzip (433 kB compressed). The build succeeds; code splitting remains a
possible performance improvement rather than a claim made by these checks.
