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

Final committed-source checks, independent reviews, merge and publication results are recorded in the implementation PR. Historical interrupted or stale-artifact checks must not be counted as a passing full final suite.
