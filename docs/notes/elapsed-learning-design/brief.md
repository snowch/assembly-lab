# Measuring elapsed ticks: learning-design brief

Copyright © 2026 Christopher Snow

## Request and evidence

Apply `.agents/skills/learning-design/SKILL.md` to the published `subtracting-and-the-tick-counter` route. The author reports that a sum appears after a page framed around subtraction, with no clear flow. This is direct author feedback, not an observation of a novice learning unaided.

Inspected in source: the paced lesson, original lesson and canonical prose, the ring and four-bit model, existing construction tests and reflection, and the preceding published lesson order. Independent reviewer is inspecting the built route at localhost4395 in addition to source. Earlier component-only browser checks establish arithmetic/control behaviour; they do not resolve this sequence issue.

## Observable outcome

Given two unsigned readings of a normally advancing 32-bit counter, construct `elapsed(now, then)` using fixed-width subtraction, including cases that cross zero. Explain why the result measures forward ticks only when less than one full turn has elapsed.

The central route needs subtraction, the counter's fixed width, forward distance and the less-than-one-turn assumption. Re-teaching carry propagation, signed overflow and the hardware adder is unnecessary for this outcome. The adjacent published lesson already addresses subtraction flags and negation; the existing reflection also asks about C, so moving that material needs an explicit decision rather than silently leaving an unsupported question.

## Preparation checked

- Module 0, Subtraction and reuse: `sub` and destination/input roles are practised.
- Module 1, Signed and unsigned readings: the same pattern's readings are defined and practised.
- Module 1, Arithmetic with four bits: addition carries and retained-width wrap are demonstrated; four-bit subtraction is practised.
- Module 1, Arithmetic on register bits: unsigned wrapping and real 32-bit subtraction are connected.
- Module 2, Addition and its flags / Which instruction wrote the flags?: flags and flag-preserving arithmetic have prior preparation.
- The current page introduces borrow. Familiarity with arithmetic does not establish that the learner can connect two counter readings to elapsed time.

## Current route and attention costs

The page opens with `elapsed(now, then)` and an actual 32-bit `sub` example. Investigation starts with `subs`/NZCV/borrow, describes a 32-bit ring, inserts a separate four-bit addition with different inputs, and then shows the original ring. The miniature's elapsed-subtraction connection appears only after three optional presses. A bridge needed for the construction task must not depend on discovering and finishing that optional example.

The learner must change operation, width and inputs while remembering the original prediction, then translate back. A smaller example is not automatically a simpler route when it introduces this translation cost. The existing ring already carries the original readings and a model-derived distance across zero.

## Misconceptions and evidence to seek

These are hypotheses for subsequent novice observation, except the author's reported transition confusion.

| Possible wrong rule | Evidence that could distinguish it |
| --- | --- |
| Later reading must be larger | A fresh wrapped pair is explained as a positive forward interval. |
| Reverse operands when `now` is smaller | One implementation passes both ordinary and wrapped calls without reversing subtraction. |
| Any subtraction of these readings gives elapsed time | Learner identifies width, reading and normal-advance/less-than-one-turn assumptions. |
| C records the number of wraps | Learner distinguishes a no-borrow condition from unobservable complete turns. |
| The four-bit increment is the function being written | Learner points to the original 32-bit `sub` and uses the same input roles in the construction. |

## Candidate routes before selecting controls

A. Keep the miniature and add an explicit increment-versus-measurement bridge. This still changes width and inputs, duplicates earlier preparation and risks making an optional sequence essential.

B. Remove the miniature from the elapsed route; keep addition/carry teaching with addition. Use the original readings throughout the ring and a visible fixed-width subtraction explanation before construction. This requires less new material and no new widget. Decide separately how to handle the existing C question and flag output.

C. Rebuild the whole page around a four-bit worked example before the real case. This would require another assessment and bridge, expanding the lesson despite existing earlier preparation.

Provisional direction is B, subject to the independent flow review and technical check. The RISC-V addition-wrap page can keep the approved simplified addition diagram; its elapsed-time route should be inspected for the same interruption.

## Success evidence and remaining gap

Retain the existing fresh construction cases, including ordinary and wrapped inputs, and verify that the starter still fails and reference still passes. Use the fresh reflection to ask for the forward interval and applicable limit without presenting its worked answer early. Read the visible route with all optional details closed and check that it supplies the reason for using the same-width subtraction.

After a prototype, obtain independent learner and technical reviews and run the original example and fresh applications in the actual built interface on phone/desktop and light/dark. Keep gates, saved drafts and completion marks. Invite a person meeting the prerequisites to use the page without coaching and explain a fresh case; record first attempts and help separately. No such novice session is available in this work, so no learner-validation or effectiveness claim will be made.

## Decision after independent flow review

Adopt candidate B. Remove the increment miniature from both elapsed routes, retain the original same-width ring in Arm, and add a model-valued low-bit explanation inside its prediction gate. The earlier Arm four-bit width figure already supplies the addition/carry mechanism. Keep the simplified RISC-V diagram on the addition-wrap lesson.

Defer borrow and interpretation of C to Subtraction flags and negation; use that lesson as the published vocabulary home. Keep the original combined reflection there. The elapsed reflection retains its fresh readings but asks for elapsed reasoning and the timing bound. Preserve all graded programs/cases and accepted written-challenge instructions so saved valid code remains valid. Because the elapsed editor already accepts `subs`, its task will briefly define that optional same-result variant without teaching C/borrow there. This compatibility qualification does not add a second displayed execution or another objective.

Use the existing CounterRing with `purpose: elapsed`: the same arithmetic model and prediction gate, no C row, and a short model-valued explanation after the ring. Default arithmetic rendering keeps its existing C output and tests. No new control or alternative width is required.
