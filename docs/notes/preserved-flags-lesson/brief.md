# Narrow the second flags lesson

## Checked source and teaching decision

The published `flags-and-overflow` page is the second part of adding-and-the-flags. The preceding custom lesson now teaches N/Z, unsigned C, signed V, the carry inequality mechanism and six graded applications. The second page's smallest-overflow exercise and six-rule recap revisit that material.

Its distinct outcome is identifying which executed instruction last wrote the flags. Preserve the existing SUM_FLAGS prediction and gated stepper: `adds w3, w2, w2` writes flags, `add w0, w0, w1` writes a new result and leaves the earlier flags intact. The inputs and compiled listing remain unchanged and already have GNU/QEMU/model checks. This is a fresh composed case relative to the preceding lesson; the previous lesson supplies bit/range knowledge and the add/adds distinction. Do not add another arithmetic assessment.

Keep three sections: introduction, prediction/walkthrough, and a short explanation of flag lifetime. Remove the repeated overflow challenge and recap from both canonical source and published pacing. Retain the stable URL and lesson position so saved links work. Course completion must no longer require the removed challenge. Update source-copy records and the tests of actual published obligations; do not weaken other lessons' gates.

Copy: only the new lesson title and explanation heading require separate drafting. Existing reminder/intro and the first paragraph of generalisation already state the new mechanism accurately. Update explicit cross-references to the renamed lesson where they occur.

Independent review must inspect source/UI before this brief, compare both adjacent lessons, and verify the prediction still gates the stepper and the latter shows preserved flags. Phone/desktop light/dark, stable navigation and lesson completion are in scope. No novice-learning or assistive-technology claim is made.

## Implemented sequence and validation

Separate copy draft selected “Which instruction wrote the flags?” and “Writing and preserving flags”. The stable route contains introduction, the original new two-instruction prediction/stepper, and the short flag-lifetime explanation. No replacement arithmetic quiz or recap was added. The previous lesson supplies the complete addition-flag practice.

Canonical lesson/prose records no longer contain the removed challenge/recap. Published obligation checks remain strict without an exception. Cross-references about C/V now point to Addition and its flags. All 105 targeted source/prose/pacing/state tests passed; browser checks and independent review follow.

Independent review found one surviving test dependency on the removed smallest-overflow activity. The generic out-of-range feedback regression now uses a local schema-validated fixture, preserving all three range/error assertions without restoring the learner exercise. The reviewer independently rechecked the correction: 17 tests passed; the original run's 3 failures and 14 passes remain recorded separately in review.md. The eight-context learner/technical review has no open blocker.
