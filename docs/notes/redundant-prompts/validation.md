# Redundant-prompt cleanup validation

Copyright © 2026 Christopher Snow

All 34 lessons were audited. Seventeen changed: three Fundamentals lessons omit seven
prose-only template blocks; thirteen later lessons omit repeated closing questions and their
duplicate Answer disclosures; Checked arithmetic omits its repeated closing question and
answer paragraph while retaining the distinct formatting/sanitizer detail. Actual figures,
exercise programs, graders, saved-work identities, prediction gates and platform code are unchanged.

The independent reviews in this directory distinguish initial candidates, source adjudication,
final browser coverage and limits. A closed Answer alone was not treated as evidence that a
question adds a fresh application. The later concrete-input, native-tool and hardware-evidence
tasks remain where they have a distinct teaching purpose.

Initial focused validation passed: seven Vitest files, 43 tests (7.51 seconds). The command
selected Fundamentals plus canonical-prose tests for Modules 5–11; Module 7 has no separately
named prose test, so it contributed no file to that focused run. The production build passed
(14.63 seconds), with the existing bundle-size advisory. This build is the review preview.
No initial test failure is omitted from this record.

Existing section-count assertions were updated to seven sections for One addition and
Subtraction and reuse, and five for Instructions in sequence. Their assertions for worked
figures, exercises, navigation and saved work are retained. No test permits empty sections or
removes checks of the grading behaviour.

Full-check, exact-commit CI, merge and deployment results are recorded in the pull request.
Local full-check completion or interruption is reported separately from CI; a focused pass is
not described as a full-suite pass. Browser reviews do not claim physical Raspberry Pi testing.
