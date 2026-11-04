# Carry-path validation

- Type checking passed; all 179 unit-test files and 3,172 tests passed. The production build passed.
- The initial focused browser run passed both phone cases and failed two desktop cases for wide paragraph containers. The first correction fixed the current-column paragraph; two subsequent focused runs still found the status paragraph too wide because the general figure selector overrode its local rule.
- The final correction gives the local status-width rule sufficient specificity. The focused browser run then passed all four desktop/phone and light/dark cases, including model-derived numerical values, exact source/target arrow contact, the arrowhead reference, a complete final shaft, keyboard use, reset, answer gates, persistence and clearing.
- Independent learner and technical reviews are recorded in review.md. No novice study or screen-reader application test is claimed.
- A full local check passed formatting, copyright, platform consistency, types, all unit tests and the build. Its browser run was interrupted after the final CSS correction rather than reported as a full pass. GitHub runs the complete check, real-tools comparison and native checks against the final PR commit; the PR check records are the authoritative full-suite result for that commit.
