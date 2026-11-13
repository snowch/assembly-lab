# Flags prediction layout repair

The reported tablet screenshot shows the Starting inputs caption touching the dark instruction block, and the signed range wrapping unevenly beside the unsigned range. At 320px the original fixed grid also extends outside its intended card; the page's clipped container masks that internal overflow.

## Correction and scope

The existing instruction treatment now forms a block with a 20px bottom gap. This also corrects its inline-code sibling in the gated practice follow-up. The 32-bit range grid responds to its available content width: stacked at 320/375/834px, paired at 1280px. Each bound is an unbroken number; a very narrow interval can wrap between its bounds. The endpoints, wording, computed arithmetic, storage, grading and reveal gates are unchanged. No platform or shared-outline code is edited.

The range renderer accepts both supported model widths but currently has only a 32-bit call site. Four-bit ranges elsewhere in the lesson are separate markup and are checked as visual siblings. The shared visible outline uses a 120px scroll threshold; the retained flags-specific controller has a separate 160px threshold. Showing the next section before its heading crosses the shared reading threshold is not, by itself, a navigation defect.

## Focused verification

- Parent baseline/candidate browser measurements at 320/375/834/1280px: instruction-to-caption gap changes from 0px to 20px. At 834px the signed range changes from two lines inside half the card to one line in a full-width card. At 320px the endpoints wrap between complete numbers and remain inside the card.
- Strict TypeScript passes, exit 0.
- Built flags suite: 30 passed, exit 0, with desktop/phone projects and both actual themes. The new geometry cases cover all four widths, complete endpoints, expected range values, containment, prediction commitment/reveal/reset and page overflow. Existing grading, persistence, hint, arithmetic-column and gate assertions remain in place. The practice test additionally verifies the gated instruction is a block with a clear gap before its next paragraph.
- Negative control against the preserved baseline build: exit 1, expected failure on the 0px instruction/caption gap versus the 16px minimum; stopped after the first failure, with the next theme case not run. This is not a passing suite result.

## Breakpoint refinement

The first candidate passed those four target widths, but a parent sweep in 10px steps from 780px through 1280px found the DejaVu Sans signed interval wrapping while its cards were paired at 880–950px. This is additional visual evidence of a defect in the first candidate, not a full-suite failure or a pass relabelled after a rerun. The minimum paired-column size was increased from 17rem to 20rem. The geometry test now includes 920px with a DejaVu Sans override and requires each bound to remain on the same line from 375px upward. Against the preserved first candidate, this expanded test fails as expected on the unequal bound positions at 920px (exit 1, stopped after the first failure).

The parent's repeated default/Arial-request/DejaVu breakpoint sweep against the second candidate finds no paired interval split. The final built flags suite passes all 30 cases, exit 0, against the immutable second candidate. Independent revision checks are recorded in the adjacent review addenda. These results are separate from the first candidate's evidence.

The focused candidate was built before committing, so its footer identifies the parent commit rather than the final change. Independent built learner and technical checks are recorded in the adjacent reviews. Final committed-source full-suite results, CI, merge and public verification are recorded in the implementation PR; these focused checks do not stand in for them.
