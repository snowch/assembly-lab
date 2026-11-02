# Compact readings: independent technical and sceptic review

Reviewed 2 November 2026 by a separate Codex reviewer with the managing session's inherited model and effort, without an override. I did not draft or edit product code. The review began with the actual page, repository rules, authoring guidance, sources, implementation and diff; I formed the technical assessment before receiving the learner findings. Incidental search excerpts from author notes were not used as evidence for the verdict.

## Current verdict

No blocking technical finding remains in build 4. Supplementary browser failures identified two further product defects after the first reviewed build; both were corrected and independently verified, as recorded in the follow-up below. The executable model, signed/unsigned interpretation, weight/contribution distinction and prediction grading are correct. The accepted layout, teaching-route, preset and marker/sign corrections were independently verified in the rebuilt production page.

## Sources and computation

Read `AGENTS.md`, `CLAUDE.md`, `docs/authoring.md`, `docs/style.md`, `docs/visual-language.md`, `docs/sources.md`, the changed lesson/source/canonical strings, `RegisterReader`, `TeachingReadings`, `BitToggles`, `readings`, `trace`, the handoff implementation and focused tests.

C23 draft N3096 6.2.6.2p1/p2/p6, independently read in the existing primary-text extraction `/tmp/bitweights-n3096.txt`, supports positive unsigned positional weights, identical lower signed weights, the negative top weight and the term two's complement. The UI's “Here, C's int uses this signed reading” stays within the course's selected target. No new claim about signed C overflow or execution of an Arm instruction is introduced by the bit-setting activity.

`readingsOfPattern` assembles and executes the model's `mov`/`movk`/`ret`, then reads the low 32 register bits through unsigned and signed interpretations. `topBitTable` computes the top-only, lower-bits-only and whole patterns independently through that reader. `bitWeightsOfPattern` retains the positional weight when a bit is clear and returns zero contribution. Focused tests compare summed contributions with model results across boundary patterns and 300 deterministic additional patterns.

The new prediction constructs its fixed before/after patterns, computes both readings through `readingsOfPattern`, and compares those results to derive the correct choice. Its displayed numerics are taken from these computed records, not copied from feedback prose. I checked every offered choice and the revealed before/after cells independently in the browser. This note omits exercise answers.

## Accepted findings and sceptic decisions

| Finding | Severity | Evidence and smallest correction | Status |
| --- | --- | --- | --- |
| Numeric cells can overlap despite no page overflow | Medium | At 320 px, Compare with all 32 bits set produced 21 px overflow in the unsigned total cell and 2 px in long contribution cells. The screenshot shows adjacent contribution values meeting without a gap. Measure text/cells and the all-ones boundary, not just outer panels or the top-bit-only pattern. Keep each complete value inside its own cell. | Corrected and independently verified: all measured numeric-cell overflow is now 0 px, including all-ones Compare. |
| Learner M1: missing onward route from Unsigned to Signed/Compare | Medium | Initial guidance says “Choose Bit 31 only to inspect the top bit on its own.” The signed definition is available only after selecting Signed, while the next construction requires that interpretation. The modes are visible; the missing element is an explicit preparation route. Add local onward guidance. | Corrected and independently verified in the final build. |
| Learner M1: prediction appears before preparation | Medium | The first-preview Start prediction entry precedes the bit grid and asks about both readings while Signed has not been defined in that view. Put the still-visible entry after exploration and guide learners through Signed/Compare first. No completion gate is needed. | Corrected and independently verified in the final build. |
| Learner M2: top-bit preset silently changes reading | Low | “Bit 31 only” changes both bits and reading, while “Bit 0 only” and “Clear bits” preserve the reading. Preserve the current reading for the preset; retain Reset as the explicit return to Unsigned. This is an interaction inconsistency rather than incorrect arithmetic, so I rank it below the teaching-route findings. | Corrected and independently verified in the final build. |
| Missing top-bit marker and unsigned weight sign | Low | The first implementation removed the established top-bit label/shape and rendered positive selected weights without an explicit plus sign. The managing session had independently requested their restoration. Existing browser assertions exposed these discrepancies; those assertions should remain meaningful. | Corrected and independently verified in the final build. |

The baseline all-ones screenshot is `/tmp/compact-technical-review/baseline-320-light-allones.png`; structured measurements and state checks are in `/tmp/compact-technical-review/baseline-results.json`. Actual backgrounds were light `rgb(243, 246, 245)` and dark `rgb(16, 22, 21)`.

## Rejected concerns and bounded observations

- **Clear top bit has zero weight:** rejected. Both source and browser retain its signed positional weight while showing contribution zero. Clearing bits changes contributions, not weights.
- **Pending prediction exposes an answer through another explorer panel:** rejected. The inspector, guidance, totals, optional full sum, after table and feedback are absent from the pending figure, and bit buttons are genuinely disabled. Switching a reading or Return to exploring exits prediction before restoring the explorer. Starting again removes the previous reveal.
- **Cancellation must restore a separate pre-prediction custom pattern:** rejected as an unsupported contract. The visible control promises “Return to exploring”; it returns to the fixed starting pattern while pending and the result pattern after commitment. The page does not promise restoration of a separate earlier pattern.
- **Set/clear is unexplained prerequisite jargon:** rejected. The preceding Reading hexadecimal lesson includes “A bit that is 1 is set, and a bit that is 0 is clear”, with the corresponding actions defined. The current page defines weight and top bit locally. Signed reading/two's complement are local to Signed, subject to the accepted onward-route finding.
- **The stale browser expectations should simply be weakened:** rejected. The plus sign and marker assertions represented visible intended behaviour, which the managing session confirmed and restored in source.
- The baseline review harness initially expected the exercise hex entry without its `0x` prefix. The UI correctly displays `0x00000000`; this was a harness error, corrected before the final rerun. It is not a product finding.
- The remaining test description “the worked all-ones example” was stale after changing the explorer's initial pattern. Its assertion remains useful boundary coverage; I reported this as a low test-name cleanup, not a learner-facing defect. A subsequent source edit has changed that description.

## Browser coverage and test record

The managing session owns `http://localhost:4185/assembly-lab/`; I neither built the product nor started/stopped its preview. My independent Chromium script exercised 320, 390 and 1280 CSS-pixel viewports in both actual rendered themes. It covered initial state; focus selecting an inspector bit without changing the pattern; bit presets; signed/compare switches; a clear top bit; clear/reset; all-ones arithmetic and full sums; every prediction choice; pending/committed mode exits; cancel/restart/reset; scratch/challenge independence; ordinary reload; and the earlier hexadecimal reader's controls and original independent starting pattern. No page or console errors occurred in that pass.

The initial independent browser command exited 1: numeric-cell containment failed at 320 in both themes; the separately identified hex-prefix harness assertion also failed at each width. Other semantic checks passed. A later passing rerun will not change this original result. The script and complete log are `/tmp/compact-technical-review/check.cjs` and `baseline.log`; screenshots use the same directory.

Focused command:

```sh
npm test -- packages/views/src/interactives/RegisterReader.teaching.test.tsx packages/views/src/update-handoff.test.tsx packages/views/src/readings.test.ts content/lessons/one-pattern-three-readings.facts.test.ts content/lessons/one-pattern-three-readings.prose.test.ts content/lessons/twos-complement.prose.test.ts content/lessons/twos-complement.test.tsx
```

Exit 0: 7 files, 73 tests passed, no skips. Log: `/tmp/compact-technical-review/unit.log`. This includes actual `prepareViewHandoff`/Strict Mode restoration of reading, selected bit and bits, plus pending and committed prediction states. It also checks canonical record parity. This is a focused run, not a full-suite result.

The source/pacing records consistently change the independent explorer start to the model-derived bit-0 pattern; the earlier hexadecimal reader continues to start from the original subtraction. The optional scratch reader retains its separate zero start, legacy controls and disclosure. Canonical records inspected include `docs/notes/module-1/prose.md`, `docs/notes/course-pacing-implementation/copy.md`, `docs/notes/twos-complement-appendix/prose.md` and the new `docs/notes/compact-readings/prose.md`. Historical briefs are not treated as current rendered copy.

## Remaining limits

I did not run a build, full repository check, GNU/QEMU differential suite, real-device/Safari/Firefox pass or a service-worker deployment restart. Unit tests cover the actual handoff capture/restart path; the separately described browser-seeded restoration checks the built consumer and is not a live release update. The managing session owns full-suite/build/deployment results; this review reports its focused commands separately.


## First rebuilt-page verification

The managing session rebuilt the supplied preview. I verified assets `index-BCGYCntZ.js` and `index-CVXTeCC1.css` at the same 4185 URL. The independent final browser command exited 0 across 320, 375, 390 and 1280 px in both themes: 8 contexts and 72 grouped state checks passed with no page/console errors. The baseline exit 1 remains recorded above.

All modes preserve the pattern. Both named bit presets now preserve the reading; Clear bits does likewise. Reset restores the independent bit-0 pattern, Unsigned and the bit-0 inspector. Top-only, clear-top and all-ones computations remain model-consistent. Every bit number stays visible, the top-bit label/shape points at bit 31, and selected positive weights/contributions carry an explicit plus sign. I checked local “Choose Signed” guidance after inspecting bit 31, onward Compare guidance in Signed, preparation beside the later prediction entry, and the entry's position below the explorer totals.

At all four widths and both themes, the document and reader had 0 px horizontal overflow, every measured numeric cell had 0 px overflow, numeric readings were at least 14 px and bit targets were 44 px tall. Checks included the top-only pattern in Unsigned/Signed/Compare, all-ones Compare with its long unsigned total, and prediction result tables for every choice. I visually inspected final screenshots at phone and desktop widths in both themes, including the narrow top-only, all-ones and committed-result states. At 320 px, Chromium's accessibility snapshot still contains the table, row/column headers and their corresponding cells after the narrow-layout reflow.

Pending prediction continues to remove every result path, including an already-open full sum. All three choices produce model-derived feedback and cells. Cancel, reading switches, reset, restarting and exploring the committed result leave no stale reveal. Scratch/challenge answers remain independent, and the preceding hexadecimal activity retains eight digit groups, hexadecimal entry and its original independent pattern. Ordinary reload resets transient exploration rather than consuming old prediction work.

Final script/evidence:

- `/tmp/compact-technical-review/check.cjs`, `final.log`, `final-results.json` and `final-{width}-{theme}-{state}.png`: final browser matrix, exit 0.
- `/tmp/compact-technical-review/handoff.cjs`, `final-handoff.log` and `final-handoff.json`: 6 passing built restoration cases at 320/dark and 1280/light. I seeded correctly scoped one-shot session snapshots using the actual built figure props, then reloaded. Signed selected-bit state, pending prediction and committed prediction each restored correctly; a second ordinary reload returned to the initial state, and pending restore still concealed results. This tests the built restoration consumer; the unit tests separately exercise actual snapshot capture.
- The same focused unit command above was rerun after the final source corrections: exit 0, 7 files / 75 tests passed, no skips. Log: `/tmp/compact-technical-review/final-unit.log`.
- `git diff --check`: exit 0. Changed canonical records remain synchronised; focused parity tests include the added onward/prediction guidance strings. The stale all-ones test description has been corrected.

The main browser harness now accepts `BASE_URL` (default `http://localhost:4185/assembly-lab/`) and optional `EXPECTED_COMMIT`. The latter checks the footer's visible short commit or full commit link so the managing session can reuse it after deployment. These options do not imply that a deployed-site check has already run.


## Supplementary follow-up: pointer movement and appendix target

The managing session's focused browser rerun `/tmp/compact-browser-rerun.log` exited 1 with 126 passed and 4 failed. Three phone failures identify the appendix link's 23 px target. The desktop all-ones test finds a clear bit 30 after its click sequence. These results supersede the earlier no-blocker verdict until their corrections are verified below; the earlier independent matrix had built all ones from Compare and did not exercise the failing fresh-Unsigned focus transition.

**Accepted, medium: focus changes move a bit target during its pointer interaction.** In the previous build, focusing bit 30 removed the conditional onward paragraph above the grid. An independent 320 px reproduction of Bit 31 only → Clear bits → click Bit 30 moved the target upward by 63.78 px, selected inspector bit 30 and left that bit clear. The same result appeared in both themes at 320 and 375 px. The original desktop trace shows the missing bit despite the requested click. This is a product interaction defect, not a reason to add test sleeps or weaken the all-ones assertion. The smallest correction moves the conditional onward text into the inspector below the grid, retaining both focus inspection and onward guidance.

**Accepted, medium: appendix link is too short for the course's phone target requirement.** Independently measured height was 23.25 px. The source correction gives the scoped link flex alignment and a 44 px minimum height. The correction does not change the link destination or optional status.

**Rejected: this rerun proves a full-sum overflow or arithmetic error.** The listed phone failures come from the appendix target check. The desktop result agrees with the actual pattern with bit 30 clear; the arithmetic model is correct. The previous independently established numeric-cell containment defect remains a separate, already-corrected finding.

Evidence: `/tmp/compact-technical-review/missed-bit30-trace.zip`, `missed-bit30-context.md`, `before-focus.json` and `before-focus.log`. The reproduction captured four old-build contexts and then exited 1 on a page wait while the managing session replaced build assets; no completed old-build claim is made for its remaining contexts.

I reviewed the managing session's added `bit-weights.spec.ts` regression. It starts from top-only, ends its mode sweep in Compare, sets every lower bit with a per-click pressed-state assertion, pins the all-ones unsigned reading and checks every numeric cell for overflow with a 1 px rounding allowance. This would detect the earlier 21 px cell overflow even when the outer panel fits. It complements the existing fresh-Unsigned all-ones test rather than replacing it. The updated `RegisterReader` comment accurately describes the selected-bit inspector and compact totals; its obsolete strip/alignment description is gone.


### Build 4 correction verification

The managing session rebuilt the preview with assets `index-hAYaE-Vi.js` and `index-DODedTFD.css`. My expanded independent harness exited 0: all 8 contexts (320/375/390/1280 px × actual light/dark) and 80 grouped state checks passed. Results are in `/tmp/compact-technical-review/build4.log` and `build4-results.json`; corresponding screenshots use `build4-` prefixes.

In every context, the formerly failing bit-31-to-bit-30 focus transition moved the target by **0 px**, and its pointer click set bit 30. A fresh cleared Unsigned sequence then set all 32 bits, checking each pressed state immediately after the interaction; phones used actual taps and desktop used pointer clicks. The conditional Signed direction remains visible in the selected-bit inspector below the grid. The appendix link measured **44 px** tall everywhere. Both accepted supplementary findings are closed.

All earlier model, weight/contribution, preset/reset, prediction concealment/reveal, mode/cancel/restart, scratch/challenge and hexadecimal-isolation checks also passed against build 4. All measured document, reader and numeric-cell overflow remained **0 px**. The separate built restoration consumer rerun exited 0 with all 6 cases passing again: `/tmp/compact-technical-review/build4-handoff.log` and `build4-handoff.json`.

No additional 75-test unit rerun was performed after these local corrections; the managing session reports its targeted post-fix component/handoff/canonical tests and 18 browser regression cases passed. Its full repository check is separate and was still running when this review note was completed. The 126-pass/4-fail focused browser command above retains its original exit status.
