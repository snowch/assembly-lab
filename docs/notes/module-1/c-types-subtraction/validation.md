# Validation record

Copyright © 2026 Christopher Snow

- Actual Compiler Explorer requests/responses recorded for ARM64 GCC 16.1.0 with `-O1 -g`; facts tests compare the displayed source, original debug associations and instructions to those records.
- GNU/QEMU differential test: `module1-c-types`, both page calls, six instruction states, zero differences. The first attempt exited 2 because the tools were missing; an unprivileged local tool installation enabled the successful rerun.
- UI component validation after the source-position correction: 49 focused tests passed, covering existing comparison/rendering behaviour and the new prediction, call, reset and restored-state gates. Typecheck passed.
- Initial full Vitest run: 180 files passed, two failed; 3187 tests passed, two failed. The run began during authoring and captured the old published vocabulary expectation and an intermediate canonical copy snapshot. Both expectations were checked against the intended final teaching sequence and corrected/synchronised. The final targeted rerun and exact check are recorded separately below; this does not turn the original run into a pass.
- Final targeted rerun: 26 tests passed across the updated vocabulary and recording/facts tests. Final canonical-prose rerun: one test passed. The exact `npm run check` was launched against the final implementation; full-suite results and CI status are reported separately from focused checks.
- Independent browser evidence and finding closure are recorded in `review.md` and `sceptic.md`. They cover phone/desktop, rendered light/dark themes, prediction and execution gates, contained listing scroll, reset and reload. A new source-relocation scroll jump was corrected and rechecked. No claim of novice learning validation or physical assistive-technology testing is made.
