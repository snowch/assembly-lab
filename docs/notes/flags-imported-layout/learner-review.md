# Independent learner and interface review

Reviewed the course-owned `adding-and-the-flags` page against the approved v4 prototype, rather than reviewing the standalone mock as a substitute for production. The browser preview is the built course served at port4425. This is an independent expert inspection, not a novice learning study or screen-reader validation.

## Whole-page scope

Visited the opening ADD/ADDS bridge, the four-bit reading reminder, N/Z definitions and tabs, C/V definitions and both signed-overflow directions, all comparison presets, the fresh miniature, the real32-bit prediction and its reading/column investigation, all three graded cases, the gated follow-up, recap, course navigation, completion control and footer. Captured the whole page and individual sections at375,834,1280 CSS pixels in explicit light and dark themes. Also checked System theme with an actual dark browser preference.

Prior knowledge assumed by the page is taught before this lesson: binary/hex notation, two readings of one pattern, the highest bit's signed weight, carrying and retaining a limited number of bits, the four-bit ranges, and the32-bit width of a `w` register name. No additional unexplained prerequisite was found in this route. N/Z/C/V and setting flags are defined locally before their application. Both essential N/Z definitions, both addition-range rules and a complete V example remain visible even when optional tabs/disclosures are skipped.

## Findings, corrections and verification

1. **Medium, production header:** the first phone build wrapped brand, app status and Theme into a176–177px sticky header. It dominated the approved layout and could cover the intended section offset. The header is now a quiet62px phone/68px desktop row. App status remains an accessible44px disclosure; its expanded panel stays within the viewport at all three widths. Theme, front-page navigation and the full status content remain available.
2. **Medium, original typography:** the integration initially imposed15px/1.7 on the whole lesson, whereas the approved source uses a16px/normal base with explicit paragraph line height. A blanket paragraph measure also narrowed the programme-consequence explanation. The imported base and source paragraph widths were restored. At375/834, measured core geometry and typography match the approved prototype. The desktop prose-wrapper interaction is recorded separately below.
3. **Medium, current position:** hiding the old lesson-position block and replacing the prototype header initially removed the visible module/lesson identifier. The hero now includes the generated course position. Cross-lesson links continue to use the shared numbered references.
4. **Medium, System dark theme:** the initial copied media adapter matched `html[data-theme="auto"]`, but the real course removes that attribute in System mode. Dark browser preference therefore gave a dark course shell with a light lesson. The media selectors now match `html:not([data-theme])`. Independently verified the lesson's dark ink token and the compact shell at375/834/1280 with System selected.
5. **Medium, desktop panel width:** runtime section markers exposed the imported panels to the shared704px prose limit. The first scoped override lost by CSS specificity. The corrected `.al-flags-lesson .lesson-step.lesson-section > *` rule restores the approved full panel width. Final built verification is recorded in the follow-up below.
6. **Earlier intermediate build, column view:** Show all initially threw a page error and left the selected column unchanged. The fresh rebuild reaches the highest column and displays its flags, then supports reset. The successful six-context browser run includes this state; the stale-build failure is retained in the session logs rather than reclassified as a passing command.

A minor preservation note was raised separately: the old canonical prose contains a reminder link to the four-bit lesson and an optional Bit Lab ALU link. Their absence does not prevent the approved route's exercises, but retaining quiet reminders would preserve earlier course navigation work without another teaching block. This is separate from the material visual/access corrections above.

## Behaviour verified in the browser

The independent active-state script passed all six width/theme contexts:

- Internal section links scroll within the current lesson without replacing its hash route.
- N/Z, C/V, positive/negative and comparison controls respond; phone preset buttons remain entirely inside their selector with44px targets.
- The fresh miniature checks a complete submission and saves it.
- The initial32-bit result stays gated. A valid wrong prediction opens inspection. Changing the reading preserves the stored result and flags; revealing/resetting arithmetic columns works.
- The three real submissions pass the course's current grading path. Refresh restores checked work. Editing a previously passed flag clears that case's checked feedback and relocks the follow-up; this invalidation survives reload.
- The lesson-completion control operates. Next lesson, front page and return navigation work; the flags host is removed on another route and saved answers/theme survive return.
- A keyboard-focused binary choice has a visible3px containing-label outline in light and dark. No page errors or horizontal page overflow occurred in the successful six-context run.

The review's first pointer script targeted the deliberately hidden native radio rather than its visible label and timed out; it was corrected to click the actual rendered control. A later route assertion ran before React removed the old view; it now waits for the view transition. Those are test-script corrections, not product defects. The original failed logs remain distinct from the successful rerun.

## Evidence and limits

Session artifacts are in `/workspace/scratch/flags-production-review/`: `evidence.json`, `review-current.log`, whole-page and section PNGs, checked investigation/practice PNGs, `geometry.json`, `shell.json` and the captured initial/intermediate logs. `geometry.mjs` compares approved and production computed geometry; `shell.mjs` checks the real course's System theme and app-status panel. Final focused CSS probes are recorded separately from the earlier complete six-context interaction run.

The page retains the imported mock's actual layout, diagram arrangement and panel vocabulary. The generated course title/position, the real shell/status/theme, course hints, previous/next navigation, completion and shared footer are intentional production integration differences. No claim of full pixel identity, assistive-technology conformance or demonstrated novice learning effectiveness follows from these checks.

## Final built verification

Final built assets `index-DIheBtLn.js` / `index-CP-Y8pSY.css` were checked after the specificity correction. The approved/production geometry comparison now has no differences in its sampled layout, main page, comparison card/title, bit cells, arithmetic wrapper, N description, consequence paragraph and recap metrics at375,834,1280. At1280, the comparison card is760px wide at x339 as approved. Fresh whole-page and section captures were regenerated for all six explicit-theme contexts. The separate System-dark probe confirms dark lesson tokens and a contained status panel at all three widths.

No remaining blocking learner/interface finding was identified in this reviewed route. The quiet prerequisite/hardware-link preservation note above remains advisory; it is not evidence that a novice cannot complete this route. Numerical agreement, unit tests, full browser-suite status, publishing and live verification are separate technical/release checks.
