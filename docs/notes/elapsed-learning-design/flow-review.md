# Measuring elapsed ticks: learning-design review

Copyright © 2026 Christopher Snow

## Scope and evidence

Applied `.agents/skills/learning-design/SKILL.md`, `CLAUDE.md`, `docs/authoring.md` and `docs/style.md`. This is an independent whole-lesson review of the prototype on branch `feat/simplify-counter-wrap`, not a review of the counter widget alone. No course files were edited.

Inspected the actual built Arm page at `http://localhost:4395/assembly-lab/#/lesson/subtracting-and-the-tick-counter`: initial state, committed prediction, investigation before operating the miniature, and its wrapping increment. Read the construction and reflection on the page. A separate pass covered desktop and phone, selected and rendered light/dark themes, while deliberately skipping the miniature's optional increments. Read the published pacing transformation, source prose, recorded programs, ring model, earlier four-bit arithmetic lesson and assessment cases. The model check compared the original worked pair, fresh reflection pair, an unwrapped pair and equal readings against the retained-width difference, without publishing assessment answers here.

Also inspected the built RISC-V `elapsed-time` and `addition-wraps` routes at desktop width and read their complete lesson data. This comparison checks placement, not a new native-execution claim. The parent and other reviewers own detailed functional suites, native checks and full access verification. No screen-reader or physical-device testing was performed in this pass.

The user's report of a disjointed sequence is observed author feedback. The predicted effects on a beginner below remain hypotheses. No novice participant was available, and an agent walkthrough does not demonstrate learning effectiveness.

## Main observable outcome

Given earlier and later readings of a normally advancing fixed-width counter, write the elapsed-time subtraction in the correct operand order, apply it to unfamiliar wrapped and unwrapped pairs, and explain why its retained-width result is the forward tick count while fewer than one complete turn has passed.

Deferred topics: internal addition/carry implementation of subtraction, the distinction between individual subtraction flags, signed overflow and negation. Those already have a following named lesson. The page may mention the counter's advance direction to explain elapsed time without teaching a second increment program.

## Preparation and unsupported assumptions

- Basic `sub`, destination/source order and returning a result have earlier course demonstrations and practice.
- `Arithmetic with four bits` defines carries, demonstrates the fixed-width boundary and then demonstrates subtraction by constructing an opposite pattern. Its fresh exercise practises subtraction and disposal of an extra carry. Repeating an increment here is therefore a reminder of a prepared mechanism, not the missing prerequisite for elapsed time.
- The preceding flags lessons establish the existence of flags and that ordinary arithmetic can preserve them. They do not make the meaning of the C flag after `subs` identical to its meaning after `adds`.
- The current introduction defines ticks, wrap, normal counter advance and the less-than-one-turn bound. These are useful local prerequisites and should remain visible.
- The missing bridge is from **fixed-width subtraction already known** to **the forward distance between two stored counter readings**. Merely defining borrow or revisiting an increment does not supply that bridge.

## Findings

### High: the first investigation changes the problem being solved

The visible objective is “use subtraction to measure elapsed ticks across a counter wrap.” The worked program contains `sub` and `ret` on two 32-bit readings. The investigation's first interactive then says “Choose Advance one tick. Each tick adds one” and switches to a separate four-bit counter starting from another reading.

The model-note width qualification is technically correct. It does not explain why the reader has switched operation, inputs and width. The surrounding prose has just introduced the 32-bit ring and says “The ring below draws them that way,” but the first visible figure is the rectangular increment miniature. A beginner must keep both independent examples and two architectural/teaching widths in mind while discovering their relation.

Direction: remove or relocate the increment miniature from the elapsed route. Keep an increment mechanism where addition/wrapping is the stated task. Use the original elapsed readings and counter width throughout this page's worked explanation.

### High: the key connection is outside the essential route

After the prediction is checked, skipping the miniature still leaves the original counter ring available and the writing exercise usable. The visible route explains the two forward stretches, but it does not directly connect the original `sub` result to the retained low 32 bits before asking the learner to write elapsed.

The miniature's elapsed explanation appears only after three optional increments. It uses different four-bit inputs. The existing source's direct real-width explanation is attached to a worked adder now moved to the next published lesson; related wording also occurs in exercise hints. A reader can reach “Writing elapsed yourself” without encountering the essential bridge on the visible path.

Direction: place a concise, visible, same-input explanation immediately after the ring: the subtraction and counter have the same width; keeping that width gives the forward distance shown in the ring, including across zero. Keep the normal-advance and less-than-one-turn conditions attached. If the explanation names the worked result, render it inside the existing prediction gate rather than as unconditional section or interactive-after prose.

### Medium: the inherited heading promises the next lesson's material

The page's investigation heading is “Subtraction as addition, and borrows.” The column-by-column adders are actually in the following published lesson, “Subtraction flags and negation.” The current page primarily needs forward distance and retained width.

Direction: use a goal-aligned investigation heading. Keep adder mechanics under the existing next-lesson route. This is a sequence correction, not a reason to add another teaching-stage heading.

### Medium: flags require another instruction and run on the main elapsed route

The worked C/assembly uses ordinary `sub`. The ring also displays “C after subs” from a separate flag-setting run. The current prose correctly defines the distinction, but makes all four flags and borrow the first investigation topic. The reflection then asks both for elapsed time and a `subs` flag, although the page lists one elapsed-subtraction objective.

Direction: defer C/borrow to the following flags lesson, which already contains the adders and flag assessments. A view-purpose prop on the existing ring can hide its C row and expose the elapsed interpretation without changing its numerical model or prediction gate. Move the existing borrow definition before the next lesson's first use and move its vocabulary home accordingly. Keep the original combined flag reflection in the next lesson; make this page's fresh reflection ask about elapsed time and its reasoning/assumption.

A smaller fallback is to retain C as clearly subsidiary material with explicit separate-`subs` provenance. That would be technically valid, but still spends main-route attention on a result the elapsed implementation does not need. Given the existing next lesson, deferral is the more coherent small revision.

## Options compared

**Keep the increment miniature and add a sentence.** A sentence can distinguish counter advance from measurement. It does not remove the operation/input/width switch or ensure readers encounter the low-bit subtraction connection hidden at the end of optional ticking. Making this a sufficient worked preparation would require a fuller sequence, a clear four-to-32-bit bridge and an announced required endpoint. That adds work to a page whose earlier course already covers the increment mechanism.

**Remove the increment miniature from elapsed and explain the existing ring.** This keeps the original operands, width and observed result together and needs no new widget. The original prediction remains exploratory; its committed result and ring become the worked example. A short gated interpretation provides the missing connection before construction. This is the recommended smallest coherent route.

## Proposed route before choosing additional controls

1. Retain the problem, counter definition and two assumptions.
2. Retain the current wrapped prediction and recorded one-subtraction program.
3. After commitment, show the same-input ring and its enlarged forward path through zero.
4. Explain how the subtraction's retained-width result matches that path. State what the two readings cannot establish about complete turns.
5. Keep the existing writing exercise and its wrapped/unwrapped test obligations.
6. Use the existing fresh reflection readings to ask for the elapsed result and a reason the normally smaller later reading can still describe forward time. Keep C/borrow reasoning with the following flag lesson.

No additional interaction is needed to make this route coherent. Original programs and graded case obligations can remain unchanged. Earlier width/carry preparation remains available in the course. The simplified RISC-V increment figure fits `addition-wraps`; it interrupts `elapsed-time`, whose native before/explanation paragraphs already speak directly about matching subtraction width and counter width.

## Misconceptions and evidence to seek

| Hypothesised wrong rule | Observable distinguishing evidence |
| --- | --- |
| A later reading must be numerically larger | Learner interprets an unfamiliar wrapped pair as a positive forward interval and explains passage through zero |
| A wrapped pair requires reversing operands or a special correction branch | Learner uses the same operand order for wrapped and unwrapped cases, then explains the fixed-width result |
| The latest increment's carry is the elapsed-time result or a count of wraps | Learner separates advancing the counter from subtracting stored readings and does not use carry to recover hidden turns |
| Low result bits always reveal real elapsed time | Learner states the normal-advance and less-than-one-turn assumptions and explains the ambiguity of complete turns |
| Passing copied code proves the mechanism is understood | A fresh explanation of the forward path and assumptions accompanies a fresh calculation; code-test success is recorded separately |

## Decision and formative evidence plan

Keep the same-input ring, current wrapped prediction, independent writing exercise, fresh reflection context and explicit timing bounds. Remove the increment/carry detour from elapsed. Add the visible retained-width bridge, align the investigation heading, and place subtraction flags in their existing following lesson.

The evidence is the inspected operation/input/width discontinuity, the location of the essential explanation behind optional interaction or in a later lesson, and the mismatch between the primary objective and the flag-heavy investigation/reflection. These are review findings rather than measured novice outcomes.

For a future formative session, let a person meeting the stated prerequisites use the revised page without coaching, then try one unfamiliar wrapped pair and one equal-reading/full-turn question. Record first attempts, explanations and any help separately. A small session can reveal missing reasoning or terminology; it cannot establish broad effectiveness. Until then, describe the revised sequence as reviewed and functionally verified, not learner-validated.

## Verification of the revised essential route

Revisited the new production build after `elapsed-flow-build.log` reported a completed build. This verification concerns the actual Arm lesson and its following flags lesson, not the earlier detached mock.

All four real Chromium combinations passed: desktop 1280×900 and phone 390×900, each in selected and rendered light/dark themes. On a fresh lesson, the ring and model-valued explanation remain behind the prediction gate. After committing the named prediction, the same-input ring is visible, the separate increment widget is absent, and the C row is absent. The low-32-bit summary and full-turn equivalence explanation are visible inside that gated figure, before the writing exercise in DOM and reading order. Reached that bridge without opening a hint, optional tab or disclosure and without advancing a separate model. No page errors or horizontal overflow occurred. Inspected the phone ring screenshot and its adjacent explanation.

The investigation heading now names counting forward across the wrap. It describes the same counter, readings and width as the prediction. The original subtraction listing remains the worked code. The fresh reflection now asks for an elapsed result, the forward path and the limiting assumption. The following flags lesson defines borrow and the `subs`/`sub` distinction before its first subtraction-adder example.

The existing accepted instruction set is retained. The current writing task briefly defines `subs` as a same-result variant that also updates flags, and explicitly says that these tests check returned ticks. This is an appropriate local qualification for the unchanged accepted learner code. It does not reintroduce C/borrow as a required intermediate result in the elapsed explanation.

Source checks confirm that the ring's distance still comes from the original recorded subtraction and original call. The new display purpose selects presentation only; it does not change that numerical model, source associations or saved prediction gate. The separate flag-setting run remains internal model data and is not presented as the worked `sub` instruction's visible effect.

The RISC-V generator now mounts the simplified increment figure only in `addition-wraps`; its `elapsed-time` route retains the native 64-bit subtraction explanation and stated interval bounds. Its native program and assessment cases remain unchanged. This placement was checked in source during this follow-up; the parent's independent browser/native suites cover final generated RISC-V pages.

Disposition of earlier findings: the operation/input/width detour, missing essential bridge, inherited heading and premature C/borrow focus are corrected. No further material flow issue was found in this review. The revised route is a supported learning-design hypothesis backed by source and browser inspection. There is still no novice formative session and no claim that successful automated checks establish understanding.

### Final construction-note and primary-reference verification

Independently checked the final small move of the existing `subs` definition from the challenge task to the construction lead-in. The production preview still represented the preceding build, so this check used a separate Vite server on port 4401 to render the current source without rebuilding or disturbing ongoing checks.

At desktop 1280px and phone 390px, the exact same-result/flag-update definition appears in visible construction prose immediately before the exercise. It is absent from the challenge task, so the learner sees the qualification once, before choosing instructions. Its `subs` text is an inline link to the catalogued Arm SUBS shifted-register entry. The footer retains its normal SUBS register-input reference, and the construction prose contains one inline link to that form. No horizontal overflow occurred.

The move preserves the intended flow: elapsed subtraction and its retained-width explanation remain the main route; this short note qualifies a still-accepted instruction variant before use. It does not restore C/borrow as an elapsed-measurement step. No new wording or additional conceptual prerequisite was introduced by moving the existing sentence.

Source comparison also confirmed that the remaining duplicated challenge-task text was exactly identical to the original source contract, or already absent at inspection time. Removing that duplicate key and its task-only override can therefore preserve the same learner-facing task and original challenge object. This structural cleanup requires no new teaching claim; the parent's final checks cover the resulting data and build.

No new material finding. These checks verify placement, link wiring and readable rendering; they do not establish novice understanding or the continued availability/content of the external Arm documentation page.
