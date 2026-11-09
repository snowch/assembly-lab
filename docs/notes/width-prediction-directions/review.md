# Width prediction directions review

## Editorial change

A separate GPT-6.1 Sol Medium draft supplied a direct two-instruction sequence and named the prediction control. The managing editor added “to 1” to make “sets all 64 bits” explicit, matching the existing model facts. Both closing style passes were applied to the affected lesson: the wording now gives the sequence, the moment to predict and the action that opens the display. The canonical prose record matches the rendered source.

No instruction, prediction option, computed answer, gate, caption, figure or prior explanation changed. Existing facts and gate coverage verify the behaviour; no test was added to mirror the sentence.

## Independent reviews

Separate GPT-6.1 Sol High learner and Extra High technical/sceptic reviewers read the affected whole lesson and earlier preparation. Both accepted the wording with no in-scope findings. Both inspected the final production build at 375×812 and 1280×800 in actual light/dark themes, confirmed by computed body colours.

Initial and selected-but-unsubmitted predictions keep the display locked. A submitted wrong prediction opens it; the learner reviewer also checked a separate correct submission. Next, both moves, return, Reset and reload agree with the model and existing state labels. Reset/reload preserve the checked prediction and return the transient trace to its start. No page overflow or page errors appeared; the learner review also recorded no console errors. The managing editor inspected representative opening/gate screenshots.

Rejected concerns: the measured end-of-run value matches the named post-second-instruction moment because the remaining return does not write that register. Supplying the first move's stipulated starting condition is required setup, not the requested second-move result. The control requires a submitted prediction, not a correct answer.

Separately recorded baseline observation: the later recap already states the general register-write rule and can be read by scrolling ahead. This predates this change. This correction preserves the local prediction gate; it does not claim a whole-page spoiler-proof sequence. A potential recap-gating review is outside this opening-direction request.

Evidence: /tmp/width-directions-reader.md and /tmp/width-directions-technical.md, their matrix JSON and Chromium screenshots. Prerequisites and unchanged content were primarily read in source. No full assistive-technology, physical-device or human novice study is claimed.

## Checks

- Full local unit suite: 188 files / 3,261 tests passed. Formatting, copyright, platform-copy integrity, TypeScript and production build passed.
- Independent focused facts/listing/canonical check: 4 files / 70 tests passed (overlaps full-suite coverage).
- The first full local check invocation was deliberately stopped with exit 130 during its browser phase after the above stages passed. It is not recorded as a full check pass; the required complete suite runs in PR CI.
- Independent native differential attempt exited 2 because aarch64-linux-gnu-as is unavailable locally. No fresh local GNU/QEMU pass is claimed; required real-tools CI supplies that evidence.
- Existing focused browser cases and required CI/release outcomes are recorded in the PR after completion.

Review harness setup first encountered an unavailable preview port and ambiguous/missing selectors. Correcting the preview startup and harness selectors completed both four-context reviews without app changes. Failed setup attempts are not application test passes.

## Final revision: explain the benefit of shifted ADD

The user's next observation concerns the same lesson. A second separate GPT-6.1 Sol Medium draft supplied the purpose: add a larger constant in one instruction without first loading it into another register. The managing editor names add in the sentence and places it before the existing mechanism and range. Canonical prose matches. No executable program or control changed.

Both independent reviewers rechecked the final production build at phone/desktop sizes in actual light/dark themes. The learner review confirmed that prior Adding a constant already establishes the unshifted range, while the new essential paragraph gives the purpose before Run. The technical review read Arm's immediate ADD encoding/operation and checked its direct constant operand, permitted shift and range against the model and native corpus. It rejected a potential unsupported claim that a plain larger-immediate spelling cannot assemble: GNU as and the model can infer the shift, and the lesson makes no such rejection claim.

All four contexts passed initial, Run, Start again and restored reload states; the opening prediction stayed locked independently of the ADD activity and still unlocks when an incorrect prediction is submitted. No overflow or browser errors were observed. The managing editor inspected the new purpose in the phone build. Earlier evidence and the separately scoped recap observation remain distinct.

Final local validation: production build, TypeScript, edited-source formatting and diff whitespace passed. Five focused files / 72 tests passed, followed by the actual operand-additions facts file / 4 tests; an initially specified nonexistent test filename was ignored by Vitest, so these are the actual executed counts. Independent facts/canonical rerun: 2 files / 12 tests passed (overlaps). Existing shifted-ADD browser tests: 4 passed, no skips, both sizes/themes including restore/reset. The initial directions-only browser run passed 22 cases; it predates this purpose paragraph and is not represented as final whole-lesson coverage. The full 188-file / 3,261-test local result also predates this added paragraph. Required full final-head CI and release verification are recorded in PR #114, with superseded-head evidence kept separate.

Final independent reports append revision sections to /tmp/width-directions-reader.md and /tmp/width-directions-technical.md. Their earlier limitations remain, with unchanged challenge grading, keyboard/screen-reader and physical-device coverage not repeated. Final revision browser/source checks are bounded agent reviews, not human learning validation.
