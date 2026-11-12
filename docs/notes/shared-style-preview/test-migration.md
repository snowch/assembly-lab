# Production layout test migration

The approved appearance is now the ordinary course layout. The comparison controls, build flag and saved appearance preference are therefore no longer the interaction under test.

`tests/educational/course-layout.spec.ts` adds 28 production cases across the existing desktop and phone projects. Its route batches make 480 lesson visits: every current lesson at 375, 834 and 1280 pixels, in light and dark. They check real section targets, keyboard selection of the first and last entries, retained hash routes, focused content below the header, closed mobile disclosures, active navigation and page containment. A stale preview preference and query must not restore the old appearance or comparison toolbar. Separate cases check the clamped page bottom, compact header and skip link, plus entered work, grading, hints, notes and calculator scratch through outline navigation. Reload retains the existing saved-work rules and resets independent calculator scratch.

Two navigation checks in `flags-lesson.spec.ts` formerly selected the original flags sidebar or a content shortcut. They now use the visible shared outline and retain their current-entry assertion. All mathematical results, prediction gates, registered challenges, hint ordering and state assertions remain. The system-theme body-colour expectation changes to the approved shared dark background, `#101b1a`, after removal of obsolete flags-only background rules; local flag-reading colour assertions remain unchanged.

## Results

- Immutable `course-style-production-v2`, served under `/assembly-lab/` on an isolated test port: **54 passed, no skips or failures**, in 4.3 minutes. This combines all 28 new cases and all 26 existing flags cases. TypeScript, formatting and diff-whitespace checks also passed.
- Immutable `course-style-production-v4`, after the shared-header/status-text/completion-measure corrections: **18 affected cases passed, no skips or failures**, in 1.9 minutes. These cover keyboard and stale-preference navigation, work preservation, the clamped bottom, skip/header behaviour and flags navigation/system-theme behaviour in both projects. The earlier 54-case result remains separate.

Logs and temporary configurations are in `/workspace/scratch/production-layout-tests*` and `/workspace/scratch/production-layout-v4*`. Playwright stopped each owned server after completion. These are precommit candidate-build checks, not a passing full repository check or a verification of the final published deployment. The managing session runs the complete check on stable committed source and independent reviewers assess the implementation separately.
