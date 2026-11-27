# Header theme and offline controls

Copyright © 2026 Christopher Snow.

The current header keeps visible Theme and Offline labels beside these icons; see the [visible-label adoption](header-labels.md). This record preserves the initial icon migration and its verification.

## Checked brief and scope

The shared header rule replaces the visible theme selector and App status label with local Material Symbols Rounded icon buttons. Each button has a 48px target, an action label, a native tooltip and a visible keyboard outline. Calculator and Reference retain their names, order and behaviour. Lessons, routes, editors, simulator state and runtime/offline protocols are unchanged.

The theme action names the destination theme. A moon switches to dark; a sun switches to light. The existing `useTheme` hook still owns the `auto`, `light` and `dark` choices and their storage/update handoff keys. The complete native selector is available under App status → Theme settings. System follows the device preference, including later preference changes; an explicit choice remains explicit.

The offline button opens the existing modal. The cloud icon never starts a download by itself. Its description reports the native version and offline states. A check badge requires a verified current offline copy and no active save. A dot takes precedence when an update is offered/prepared or the saved copy is older. The badge describes course files, not lesson completion. Online freshness alone cannot produce a check.

## Review

Applied the shared UX and learning-design checks before and after the change. The new labels state an action or name a choice. The labels require no new course concepts. The header remains an optional tool row, and the lesson reading sequence and evidence are unchanged. The official cloud SVG uses the same pinned Google revision and Apache licence as the existing sun, moon and check assets; there is no remote icon or font request.

The initial visual pass found that the settings selector inherited the old phone header width limit and clipped the selected option. The final rule bounds that selector within the modal and allows its complete option text to fit. The badge's icon flex basis is explicitly sized to its small surface. Light/dark phone and wide-header captures are in `/workspace/arm-header-icons-evidence/`.

## Verification record

- Strict TypeScript and the production build pass.
- Focused Vitest checks pass: theme update handoff, static/no-script page, existing course icons and colour tokens (4 files, 30 tests).
- Focused browser checks pass before the final selector sizing refinement: direct/system theme behaviour, native status/badges and modal focus, calculator and reference preservation (19 desktop-project tests; the tests themselves exercise phone, tablet and desktop widths).
- The follow-up keyboard test initially pressed Enter on a closed native select, opening its platform popup; Escape then closed that popup. The test now uses Home and Tab to select System and leave the native control before checking modal Escape/focus return. The original failed run is retained separately.
- Final keyboard System selection, per-theme action labels, stored preference, system preference changes, lifecycle restart preservation, unsaved-theme veto and existing selector persistence pass in five selected desktop scenarios. The sixth scenario hit its existing 5-second service-worker-controller bootstrap expectation before the first theme interaction; an isolated rerun with one worker passed unchanged assertions (1 test, 12.1 seconds). The original combined run remains a failed run, with its log retained.
- The final phone-project selection passes all 19 header/status/calculator/reference tests (2.9 minutes), including the corrected settings selector and direct keyboard System choice.
- The separate managing/reviewing session independently checked the final built header and settings at 390px and 1440px in both themes: native toggle/System preference, 48px targets, keyboard/modal focus return, calculator/reference presence, reload/system-dark behaviour and no page exceptions. Evidence: `/workspace/arm-header-independent-review-final.log` and `/workspace/header-icon-evidence/arm-independent-*.png`.
- An initial full gate passed its preflight, unit/integration and build stages and began browser execution, then was deliberately interrupted to correct a newly identified header-description contradiction for a prepared update from an online-only tab. Its log is `/workspace/arm-header-full-check-interrupted.log`; it is not a passing full run. The corrected header reuses the existing complete-and-checked update wording when `preparedVersion` exists, and its real online-only update fixture checks the accessible description, tooltip and update badge. The real online-only update fixture passes the corrected description and restart checks (1 test, 13.7 seconds). The next full command and its later browser-stage continuation are recorded below.

An early focused browser launch overlapped a build and was stopped; its partial result is not final evidence. Browser checks and author review do not establish learning effectiveness or physical-device evaluation.

## Final browser gate and theme setup path

The next full command passed formatting, copyright, platform integrity, strict types, all 224 unit/integration files (4,049 tests) and the build, then encountered four timeouts in long calculator matrices. That command was stopped (exit 143), with log and traces retained at `/workspace/arm-header-full-check-calculator-failures.log` and `/workspace/arm-header-calculator-failure-evidence/`. Its outcome is not replaced by later focused results.

Only the educational setup helper was corrected after that run. Explicit light/dark setup now exercises the primary header action rather than opening App status and triggering extra verification/modal work on every matrix iteration. If the resolved appearance already matches the requested explicit choice, it toggles away and back, checking the action name and actual root theme after each click. This preserves per-tab and denied-storage preference-write checks. System still uses the actual native settings disclosure. Application sources and their built bytes are unchanged by this test-path correction. The managing session independently inspected the final prepared-update description, tooltip and real lifecycle assertion, and approved that pending updates use the existing complete-and-checked wording while check badges still require the verified current copy.

The four failed calculator cases pass isolated with one worker and unchanged assertions/timeouts (4 tests, 1.7 minutes). Whole-repository formatting, copyright/platform checks, strict types and whitespace checks also pass after the helper correction. The complete unfiltered 1,568-case desktop/phone browser stage finished with exit 1: 1,538 passed, 18 skipped and 12 failed (1.1 hours). Its log is `/workspace/arm-header-browser-complete.log`; complete failure artifacts are retained at `/workspace/arm-header-complete-browser-failure-evidence/`. Ten phone layout scans found the new Theme settings disclosure summary was only 28px tall. Two offline compilation scenarios stopped at an ambiguous `getByLabel("Theme")` readback, which matched both the new theme action and the preserved settings selector. There were no other failure causes. These full-run results remain failures; focused reruns are recorded separately.


## Final corrections from the complete inventory

The Theme settings summary now has a scoped 48px minimum height and 10px vertical padding. It retains its native list-item display and disclosure marker. The keyboard/System header scenario additionally checks the real summary target height and list-item display. The offline test now scopes its existing saved-dark assertion to the native settings select; its offline compilation, grading, reopening and saved-work checks are unchanged. No layout tolerance, timeout or content assertion was loosened.

After these two narrow corrections, the final validation passes:

- Whole-repository Prettier, copyright, platform integrity and strict TypeScript checks, plus `git diff --check`.
- `npx vitest run`: 224 files and 4,049 tests pass (207.71 seconds), recorded in `/workspace/arm-header-final-unit.log`.
- `npm run build -w @al/course`: production build passes (10.86 seconds), recorded in `/workspace/arm-header-final-build.log`.
- The complete `header-icons`, `app-status-layout`, `instruction-reference`, `header-calculator` and `module-a` Playwright files on both projects: 68 tests pass (2.9 minutes), recorded in `/workspace/arm-header-final-affected-browser.log`.
- `npx playwright test tests/educational/offline.spec.ts --grep 'offline compilation|App status is reachable'` on both projects: 6 tests pass (23.4 seconds), recorded in `/workspace/arm-header-final-offline-browser.log`. The persisted dark theme, offline compilation, exercise grading and saved work all pass after reopening.

The managing session independently checked the final rebuilt application at 320px, 390px, 820px and 1440px in both themes: header buttons, summary and selector have at least 48px targets; the native summary marker remains visible and Enter toggles the disclosure; modal focus, actual System palette changes and reload persistence pass; Calculator and Reference remain available. Evidence is `/workspace/arm-header-independent-final-geometry.log` and `/workspace/header-icon-evidence/arm-final-settings-*.png`.

All twelve failed cases from the complete inventory are included in the final passing affected-file and offline reruns. The complete-inventory command remains recorded as a failed run; the later passing results do not change its exit status. The only application change after that inventory was the scoped disclosure target sizing. No second full-inventory run is claimed.
