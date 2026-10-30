# Validation record

30 October 2026. Local logs are under `/tmp/twos-*`.

- Initial focused content checks: 7 files, 153 tests passed, 12.77 seconds.
  This preceded the final hexadecimal success-note wording.
- Initial production build passed, 13.23 seconds. Existing Rollup annotation
  and bundle-size warnings remain.
- Initial focused browser command: 104 passed, 3.4 minutes. This used the
  initial build and preceded the final success-note hexadecimal wording.
- Technical review caught literal newlines in the JSON canonical pacing copy.
  Corrected them to escaped `\n\n`; the explicit pacing prose consistency
  test then passed (1 test, 556 milliseconds). The reviewer independently ran
  the original canonical test and observed exit 1 (bad control character),
  then reran the corrected version. The initial focused group had not
  included that file; its pass did not establish canonical JSON validity.
- `npm run check` started on the final product/test source before pushing.
  Formatting, copyright, platform consistency and TypeScript checks passed.
  All 167 unit/integration files passed (3092 tests, 167.04 seconds), followed
  by the final production build (15.96 seconds). Its browser stage was still
  running at this record's commit. The final result, remote CI and deployment
  checks are recorded in the PR.

New semantic check compares 32-bit inversion plus one with simulator NEG and
NEGS for zero, signed limits, representative negative/positive patterns and
every single-bit input. Existing facts tests cover the signed/unsigned bit
weights and all-ones decomposition. Existing browser success-note checks now
also require actual hexadecimal code formatting, while retaining failure,
success, reload and clear behaviour. No assertion or timeout was relaxed.

Independent reviews are recorded alongside this file. Final built wording
must be rechecked after the build run by `npm run check`. GNU/QEMU/native
execution is delegated to existing CI jobs; local browser checks make no
physical-hardware claim. Unrelated pre-existing untracked
`docs/notes/module-12/pi-sources-brief.md` is left untouched.

The root's extra deployment-probe dry run initially failed because it expected
the success-note wrapper to be absent; the renderer retains that wrapper and
omits its content. Corrected the temporary probe to test absence of the worked
answer's code element, matching the product's existing gate tests. This was a
probe-selector error, not a change to the product or its tests. The failed
probe log remains `/tmp/twos-final-browser.log`; the corrected run is separate.
The corrected final-build dry run passed all four phone/desktop and light/dark
combinations, including named representation, formatted worked answer,
reload/clear, fixed-width negation explanation, no page/console errors and
no document overflow. Results: `/tmp/twos-final-browser-rerun.log` and
`/tmp/twos-live/results.json` (replaced by the eventual live run).
