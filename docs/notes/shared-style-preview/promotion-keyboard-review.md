# Independent review of the compiler-note keyboard test correction

Accepted. This corrects a stale browser expectation without changing the product or weakening note keyboard coverage.

The requested port 4462 was no longer serving. The reviewer served the same immutable v4 candidate from `/workspace/scratch/course-style-production-v4` read-only on port 4463 and measured the real `tiny-function` note after keyboard Enter opened it:

| Width | Command clientWidth | Command scrollWidth | Keyboard path from first summary |
| --- | --- | --- | --- |
| 375px | 281px | 613px | Tab → command `pre`; Tab → second summary |
| 1280px | 636px | 636px | Tab → second summary |

The command has `overflow-x:auto` and no explicit tabindex. Chromium adds its native keyboard stop when it actually scrolls. The old unconditional expectation therefore fails on desktop when the approved reading-column font and available width let the command fit. The phone still exercises the scrolling branch.

Read the exact correction in this detached worktree. It measures `scrollWidth > clientWidth`, sends the first Tab unconditionally, requires the command to receive focus and sends a second Tab only for actual overflow, then always requires the second summary to be focused. All existing Enter/Space, open/closed state, note-content and no-page-overflow assertions remain. The conditional does not skip checking the next focus destination or manufacture focus.

Ran the exact corrected test from this worktree with `AL_PORT=4464 npx playwright test tests/educational/meet-the-machine.spec.ts --grep 'opens a note from the keyboard' --output /tmp/promotion-keyboard-focused-results`. Exit 0: **2 passed**, desktop 1280px and phone 375px, no skips/retries. The independent server used a copied production `dist` from stable `adfdc4b95589ffcc226c1ea863e3146b8a8237a4`; its build ID was `3aa04a99c039388c8d4f087197f79598a4e377278c2204b2ab2eafbda70b0538`, with `release.json` SHA-256 `ec1043e01f246051fd8cbcf9e23cfc9ebf6a65920731287f025f8cd21bda4a89`. The product source is unchanged from the reviewed promotion.

Only this report was authored by the reviewer in the detached worktree. Main-worktree source/tests and its ongoing full check were untouched. Its original stale-expectation failure remains a failed original result; this passing focused correction does not reclassify it or replace the required corrected full check.

Final-test follow-up: the parent then added `await document.fonts.ready` before measuring overflow. This is appropriate: it ensures the native Tab-stop decision and measured width use the loaded font. Reviewed that exact final diff and reran the same focused command with output `/tmp/promotion-keyboard-focused-fonts-results`. Exit 0: **2 passed** again, desktop and phone, no skips/retries. This is separate evidence after the added wait; the earlier two-pass run is not substituted for it. The accepted verdict applies to this final test version.

## Additional test scope: Module A disclosures

Accepted the selector correction from page-global `details summary` to `.lesson details > summary, .app-status > summary`. A DOM audit of all four Module A routes at 375/1280px found the excluded set was exactly the responsive “On this page” summary: visible on phone, intentionally hidden on desktop. No teaching or status disclosure was excluded. The constants route legitimately has no teaching disclosures. Parent/child details remain in DOM order. Sibling-loop source review found the other explicit summary loops scoped to their teaching figure. The shared responsive outline is separately covered by the course-wide layout tests.

Ran every affected local-recorded-comparison case with `AL_PORT=4464 npx playwright test tests/educational/module-a.spec.ts --grep 'local recorded comparison' --output /tmp/promotion-module-a-scope-results`. The exact revised test retains heading/challenge/prediction content checks, `designProblems`, `figureOverflow` and page-error assertions. **Exit 1: 14 passed, 2 failed**, no skips. All eight desktop cases passed; phone `a32-conditions` failed in both themes on a real 26px control, rather than on the hidden navigation summary. Thus the corrected selector preserves meaningful regression detection.

The test used the detached tree's then-current copied/rebuilt `dist`, reporting commit `9493edd479d37a5bf098b3ffe1acc51046d28cc3` and build ID `b43154b463deb70404706c4c284e3014a9de733c2d4d8893bf153cc4245644aa`. The parent had rebuilt it during its superseded check; product source fingerprints remained identical to the reviewed promotion. It was not the earlier adfd metadata build. Main-worktree files and its check were not modified by this review.

Confirmed product finding, phone touch-target severity: the summary “Recorded limit function for this exercise” is `.al-recorded-reference > summary`, with measured height 26.39px, min-height 0 and padding 0. Its 16px text is legible, but the control fails the unchanged 40px phone requirement. The shared renderer has three reference-title uses across `a32-conditions` and `a32-division-helper`; the latter labels wrap enough on phones to pass the threshold incidentally. Fix the shared summary hit area and verify all three in both themes and open/closed states. No source change was made by the reviewer. Product-fix verification is pending; this is not a selector-test acceptance failure.

The optional DOM-audit helper initially assumed every route had teaching details; that assumption failed on `a32-constants`. The corrected helper retained exact excluded-set/status assertions and passed all eight route/width states. An earlier helper connection attempt occurred after Playwright had stopped its temporary server and was refused; the subsequent audit used an independently running read-only server. Neither helper attempt is counted as a successful command or a product defect.

### Shared disclosure control: accepted-fix closure

Accepted and independently verified the six-line shared `.al-recorded-reference > summary` rule in `packages/views/src/bits.css`: border-box sizing, 44px minimum height, 0.5rem block padding and pointer cursor. It retains native list-item display and the disclosure marker; no control, model or grading implementation changes. Reviewed CSS SHA-256 `b10079c56efcb5252e93a1a333d411b172262012b8bcaf5740269d0bb34192f8`.

The rebuilt candidate reports prior commit `9493edd479d37a5bf098b3ffe1acc51046d28cc3` plus this uncommitted CSS correction. Its build ID is `03219a17806df9703b64fee1b3225134a1fcd0b43a8aab4823fe704c6c4d90ae`; `release.json` SHA-256 is `3935b71b97c37fef327511986d21f4e43e4216ad7ce0a15bd7d4583c7cae7afa`. The metadata commit alone is not its complete source identity.

Reran the exact 16 affected tests using own `AL_PORT=4464`, the same Module A command and output `/tmp/promotion-module-a-summary-fixed-results`. **Exit 0: 16 passed**, no skips/retries: all four lessons, light/dark, desktop/phone. Existing content, prediction, `designProblems`, `figureOverflow` and error assertions remain unchanged. The preceding 14-pass/2-fail command remains a failed result, not retroactively a pass.

A separate real-browser check covered both published reference controls at 375/1280px in light/dark: eight control/width/theme states. Closed and open hit areas measured 44–68.78px high. Each control accepted focus, Enter opened it, Space closed it while retaining focus, and pointer clicks reopened/closed it. Native marker styles changed from `disclosure-closed` to `disclosure-open`, with `display:list-item` retained. The recorded paired content became visible, control bounds stayed inside the viewport and the page did not overflow horizontally. Phone/light and desktop/dark screenshots were visually inspected for the formerly undersized limit-reference control; its marker and text remain clear.

Scope correction to the earlier sibling note: the canonical source has three `referenceTitle` uses, but only two are published. `pacing-10-a.ts` explicitly removes `a32-marker-reference` from the published division-helper lesson. The actual browser routes therefore contain one limit reference and one division reference, both covered above. The shared rule also applies to the third canonical use, but this review does not claim a browser check of a control absent from published routes. A first helper assertion expected two references on the published division route and failed; after checking the pacing filter, the corrected helper retained all height/focus/open/marker/containment assertions and passed the eight real states.

The selector correction and shared touch-target fix are independently closed with no remaining finding in this scope. This focused evidence does not replace the required final committed-source full check. The reviewer edited neither product nor tests; only this report was appended in the detached worktree.
