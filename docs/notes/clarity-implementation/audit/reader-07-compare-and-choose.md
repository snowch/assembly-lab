# Fresh learner review: 07 compare-and-choose

Read-only review, 18 October 2026. No previous review notes consulted. Read CLAUDE.md, docs/style.md, docs/authoring.md; used front-page Before you start and earlier lesson content as prerequisites. Read the full lesson prose, labels, tasks, hints, feedback, notes, recorded examples and relevant shared interaction strings.

## Actual browser coverage

Built page: http://localhost:4290/assembly-lab/#/lesson/compare-and-choose. Chromium at 375 × 900 and 1280 × 900, light and dark, with fresh page storage. In all four configurations checked the listing-change prediction, submitted a deliberately wrong choice, and inspected the resulting comparison and condition table. Viewed screenshots spanning all four width/theme combinations. No document horizontal overflow in those configurations.

Additionally at phone/light: submitted the failure-experiment prediction, read its revealed feedback, ran the first instruction of its stepper, expanded the warning_light/tst/ands note and first construction hint. Did not solve construction or closing challenge, replay all stepper states, or expand every hint in every configuration. Hidden hints/feedback were reviewed in source.

Evidence: /tmp/course-clarity-audit/07-{375,1280}-{light,dark}.txt and 07-extra.txt; screenshots 07-diff-{375,1280}-{light,dark}.png, 07-conditions-{375,1280}-{light,dark}.png, 07-failure-feedback.png and 07-step.png.

## Candidates

### 1. Low: prediction cards still offer a stepping explanation

Exact visible label: “STEPPED”, alongside “A prediction about what GCC changes in steeper_s to make steeper_u.” The associated disclosure reads “Each step runs one instruction in the simulator. Between steps, the simulated processor stays as the last instruction left it.”

Locations: content/lessons/compare-and-choose.ts:101–104 (listing-change prediction) and :171–174 (failure prediction); shared note packages/views/src/strings.ts:10–13. The actual DOM shows a time-model-toggle above each question; neither prediction card has Next/Back controls. Its action is Check your prediction.

Setup: initial prediction state, all four configurations; actual DOM inspected for the closed disclosure's contents. The revealed page remains labelled Stepped after submission.

Learner effect: repeats the placement problem in the user's recent screenshot: a reader is told how individual steps work while being asked to select an answer and run a whole comparison/program. It makes the control's purpose less apparent and puts the stepping guidance before the relevant interactive.

Correction direction: apply the existing Prediction-role treatment to these prediction kinds; keep the step explanation with actual steppers or the lesson's simulator note. Preserve simulator-based prediction checking.

### 2. Low: failure feedback changes between two runs without marking the transition immediately

Exact phrases in adjacent paragraphs: “So `w0` gets `w1`” and “So `w0` keeps `0x80000000`”. The preceding paragraph describes the modified function's run. The second phrase discusses the original function, but that change of run is only made explicit in the following paragraph.

Location: content/lessons/compare-and-choose.prose.ts:87–90, particularly :89. State: after checking the failure-experiment prediction. Verified visible on phone/light.

Learner effect: a learner tracking register state can momentarily read these as successive actions and wonder how the destination both received another register's value and retained its earlier value. The eventual explanation is correct; the join is unclear at the point where it changes which program is being described.

Correction direction: mark the original-versus-modified comparison before the second register-state claim, and make clear that both runs start with the same inputs. This is wording clarification, not a requested semantic change.

## Assumed knowledge

No additional unsupported prerequisite candidate found. Register operands and argument/result registers are introduced in meet-the-machine (prose:54 and surrounding investigation). Signed/unsigned readings and hexadecimal are explicitly taught in one-pattern-three-readings (prose:26–28). Flags are defined in adding-and-the-flags (prose:14, :27 onward); architecture and QEMU are explained in its model note (:108). Borrow and the subtraction meaning of C are explained in subtracting-and-the-tick-counter (:43). Mask/AND and warning-word bit numbering come from masks (:15 onward); logical right shifts from shifts (:35 onward). This lesson explains conditional-expression syntax in the opening question, cmp in Motivation, condition/csel in Investigation, and bool/cset in Generalisation. The compiler setting points back to meet-the-machine's compiler note (:16–22).

## Clear aspects retained

The closing condition question specifies both starting registers and “After cmp”, so its execution point is unambiguous. The condition-table introduction explicitly announces the reversed compare operand order. The comparison panel separates Compare, Condition and Select and labels the destination's resulting value. The source relationship is visible in paired listings without altering instruction order. No additional candidate is forced for stylistic preference or repetition alone.
