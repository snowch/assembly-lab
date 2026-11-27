# Visible header labels

Copyright © 2026 Christopher Snow.

## Checked brief

The learner can recognise the theme and offline controls without knowing the sun, moon or cloud symbols. The theme action still names its destination. Offline opens the existing App status modal; it does not start a download. Native verified/update state still determines the badge. System settings, Calculator and Reference stay available. Lesson content, saved-state keys and execution tools retain their behaviour. A separate restart-readiness correction found during verification is recorded in the [restart readiness review](restart-readiness-race.md).

Use the visible labels Theme and Offline beside their local Material icons. Keep the 24px icon, an 8px gap and readable label within one target at least 48px tall. Targets grow to fit their labels; the header wraps at narrow widths. Labels must remain visible at every width. At widths up to 600px, the four utility buttons use two equal columns while preserving DOM and keyboard order. Status badges attach to the cloud icon and must not cover the label.

## Learning and design review

The two labels name optional tools and require no additional assembly knowledge. The destination-specific theme action remains available to assistive technology and in the tooltip. The offline action retains its full accessible name and current native-state description; the short visible label does not claim a download is ready. Both sentence-level clarity and whole-flow checks preserve the distinction between opening settings and saving course files.

The managing session independently reviewed the final source and the final 390px light and 1440px dark captures. The review approved the balanced phone rows, compact wide header, aligned icons and readable labels; the native System preference path and state-derived badges remain intact. Functional browser checks cover direct and System themes, keyboard focus, modal behaviour, actual verified/update badges and preserved subject tools. These checks do not claim learning effectiveness or physical-device testing.

The canonical [Course contents rule](https://github.com/snowch/cuda-python-lab/blob/main/docs/course-design-guide.md) also guides future navigation adoption: one contents/progress/breadcrumb block, chapter or module accordions and separate current/completed states. Arm navigation is outside this header-label change; its existing outline is not claimed as newly migrated.

The first independent phone review found Theme alone on a final row at 390px. The scoped two-column utility layout corrects that imbalance, keeps the existing tool order and retains the earlier compactness bounds. Header tests check both tool rows, label visibility and icon/text geometry at 320px and 390px. The real verified-copy and prepared-update fixtures also check that badges do not cover the visible Offline label.

## Verification

The initial focused selection passed all 38 desktop/phone cases before the phone-row refinement (1.9 minutes). The final focused selection passed the same 38 cases after the balanced phone layout and additional label/geometry/badge checks (3.0 minutes). Both selections cover header System/direct-theme behaviour, keyboard and modal focus, calculator/reference overlays, compactness, real verified/prepared offline badges and their separation from the visible label.

Author measurements and screenshots cover 320px, 390px, 820px and 1440px in both themes: no page overflow, 16px labels and 48px Theme/Offline targets. The header stays 181px tall at 320px/390px and 92px tall at 820px/1440px. At phone widths, each utility row contains two equal-width controls. The first author capture attempt ran after the old preview server had exited; its connection-refused result is retained separately and is not passing evidence.

The required full `npm run check` passed formatting, copyright, platform integrity, strict types, all 226 unit files (4,059 tests; 270.40 seconds) and the production build (13.91 seconds), then was interrupted by an environment reconnection during the browser stage. The preserved log is `/workspace/arm-header-labels-full-check-interrupted.log`; no successful exit of that command is claimed.

The interruption inventory reconciles all test identities from Playwright’s JSON listing against completed log events: 1,439 completed results (1,409 passed, 17 skipped, 13 failed) and 141 uncompleted phone cases. Recovery reran 18 phone files, including both whole in-flight offline files: 166 cases, with 25 intentional repeats. Recovery passed 165 cases with one expected skip (5.7 minutes). Together these runs cover all 1,580 original test identities. Before corrections, their latest unique outcomes were 1,550 passed, 18 skipped and 12 failed; the exact accounting is in `/workspace/arm-header-labels-aggregate-accounting.json`.

Twelve original failures came from a newly added limits-and-experiments file still acting on the old visible theme selector. The managing session independently approved the exact setup patch: use the existing real header-action helper at three setup points and scope the unchanged persisted-theme assertion to `.theme-settings select`. Lesson values, geometry, predictions, restoration, reset and timeout assertions remain unchanged.

The thirteenth failure exposed the [restart-readiness race](restart-readiness-race.md). Its unchanged original scenario passed in recovery, and the observed race was still corrected. The managing session separately approved the exact application guard and deterministic held-status fixtures. Before rebuilding, all six new regression cases failed against the old bundle as intended: eviction/removal displayed the wrong reason and waiting-worker replacement did not produce the required immediate refusal. The negative log/JSON/traces remain separate from corrected-build results.

Independent final source and portable browser review passed at 320px, 390px, 820px and 1440px in both themes: visible labels, 24px icon/8px gap, readable labels, 48px minimum targets, no overflow, native modal/backdrop, Escape/focus return and theme persistence. Evidence is `/workspace/arm-header-labels-independent-portable.log`. The exact application/fixture race patches also received independent technical review.

Final affected-part verification follows `CLAUDE.md`’s rule for later edits:

- Full unit/model stage after the restart guard: 226 files and 4,059 tests pass (176.64 seconds). The later readiness-display correction is rechecked by all 12 app-course unit files, 74 tests (14.09 seconds). Unchanged model checks are not claimed as rerun after that display-only edit.
- Whole-repository formatting, copyright/platform integrity and strict TypeScript pass on final source. The final production build passes (11.69 seconds).
- The first positive held-status run passed four cases and failed the two C recovery markers. Trace review established the real stale Restart/ready UI during C preparation. The UI correction and changed-index/request regression received independent review; the helper, completion bound and final marker assertion remain intact.
- The final six deterministic held-status cases pass (41.9 seconds): exact refusal reason, current release retained, no activation, real delayed-transfer readiness and successful actual recovery/restart.
- The final 134-case desktop/phone affected set records 133 passed and one failed (9.0 minutes). All six new cases, 12 corrected theme cases and 38 header/subject-control cases pass. The failure is an existing direct-worker exact-B scenario whose unchanged ACTIVATE_UPDATE RPC timed out at 25 seconds. No B navigation or activation completion was observed in that trace; the identical phone case passed.
- The unchanged desktop direct-worker case then passes three serial isolated runs with traces (29.0 seconds total). Its timeout and assertions are unchanged. The timeout did not reproduce; no worker or protocol edit was made for it. The original failed affected run remains a failed run.

Final per-identity reconciliation covers 1,586 unique cases: the original 1,580 plus six new regressions. Latest recorded outcomes are 1,568 passed and 18 expected project skips, with no remaining failed identity. This combines the interrupted inventory, recovered tail and affected reruns; it is not a claim that one full command completed green. Exact accounting is `/workspace/arm-header-labels-final-accounting.json`.

The managing session independently reviewed the final phone and desktop mid-transfer screenshots: actual Updating offline copy, byte progress and Cancel, shaded backdrop, and no Restart or downloaded-ready promise. Exact header accessibility assertions cover the hidden status description. Final screenshots are retained under `/workspace/arm-header-labels-race-final-positive-evidence/`.
