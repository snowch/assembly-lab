# Validation record

These entries describe the commands at the state they ran. Later passes do not erase earlier failures. Full final checks are recorded below when complete.

- Initial `npx vitest run apps/course/src/latest-commit.test.tsx apps/course/src/static-page.test.ts`: exit 1, 24 passed / 1 failed. Reconnection after an offline event was incorrectly throttled; reset last-check timing on offline and explicitly set document visibility in the hook test. Focused corrected release/static/worker run: 3 files / 50 tests passed.
- First browser pass: see browser-evidence.md for exact command/result. It found response-body consumption in cache reuse, corrected by cloning before Cache.put and a consuming-body unit harness; assertions tied to the retired always-visible offline banner also needed updating.
- Independent technical review proved two defects with real built releases: Later followed by closing every tab automatically changed the app release; an online-only A controller with a refreshed B document could not save B. The active release pointer and explicit supplied current manifest address these. Sources and focused verification are in technical-review.md and release-contract.md.
- `npm test > /tmp/app-status-all-unit-first.log 2>&1`: exit 0, 145 files / 2,856 tests passed (120.49 s). This preceded completion of view handoff and final migration changes and is not the final full check.
- Worker-focused commands/results and their first-run failures are recorded by their author in release-contract.md; view handoff first failure and corrected 23-test focused pass are in view-handoff.md.
- Browser second pass was stopped while exercising an intermediate build; exact partial results and each failure disposition are in browser-evidence.md. It is not a full pass.

## Final checks

The final focused and independent checks are recorded below. The repository check runs on the committed HEAD; its exact completion status is recorded in the PR.

## Reviewed candidate and final verification handoff

- `npm test > /tmp/app-status-all-unit-final.log 2>&1`: exit 0, 146 files / 2,870 tests passed (150.37 s). Later worker removals/metadata failure cases bring its separately checked suite to 37 tests. Static initial-header focused rerun passed 15 tests. These focused/full results remain separate.
- Candidate nine `f6055ae94a885f04bb7e575afa13c32b6d06865b9dd8364dbeaaf15234771c15`: the full focused browser command passed **58 cases**, both projects, no skips (4.9 min). See browser-evidence.md for exact command and all earlier failures/interrupted runs.
- Independent learner and technical reports have no outstanding blocker in their verified scope. Subsequent tiny progress-reset and newer-published-than-pending recovery conditions are source-approved; their narrow built checker runs on the committed production build before merge.
- Before committing, the reviewed production output is retained as `/tmp/app-status-before-commit-dist`. `npm run check` starts on the committed HEAD, and its build provides the second actual full Vite output with a different embedded commit/build identity. The separate actual-two-builds proof uses these directories without mutating any assets. Its results and complete CI results are recorded in the PR, so obtaining them does not alter HEAD during a browser run.
- Copyright and vendored-platform integrity checks passed. Final formatter/type checks run before commit and again in the repository check.

The source-only review never substitutes for browser evidence. Installed entry paths share the same scope/HTML/manifest, and multi-window browser clients are exercised; an operating-system PWA installation was not manually driven. No claim is made that this update enables external sites or native hardware execution while offline.
