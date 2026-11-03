# Reading the bits: learning-design brief

2 November 2026. Planning only. The live lesson and current prototypes are unchanged.
This brief replaces the interface-first direction for the next mock; it does not replace
historical implementation records. Use the [local learning-design skill](../../../.agents/skills/learning-design/SKILL.md).

## Outcome and scope

Given an unfamiliar fixed-width bit pattern and labelled positional weights, the learner
can calculate its unsigned and two’s complement signed readings and explain why changing
the reading leaves the bits unchanged. They can apply the same rule at 32 bits.

The essential distinction is the weight of the highest position: positive in unsigned,
negative in two’s complement. Every lower position keeps its positive weight. A clear bit
contributes zero in either reading. Bit 31 has no exceptional rule in unsigned reading.

Defer inversion-plus-one, negation instructions, overflow flags, C conversions, signed
division and sign extension as an operation. Appendix B can develop representation and
negation afterwards. Do not make an appendix visit necessary for this outcome.

## Preparation and sources

- Binary digits and positional notation are course prerequisites. Reading hexadecimal
  reinforces set/clear and bit positions. Briefly anchor the weights in a visible example;
  do not require learners to recall large powers of two from memory.
- Fundamentals introduces registers, `w0` and its 32-bit view. A four-bit teaching pattern
  must be labelled as a small representation example, not an Arm register or instruction.
- The learner needs ordinary addition and subtraction with negative numbers. Check this
  in the formative session; do not mistake arithmetic difficulty for a representation error.
- Technical sources: [C23 representation source record](../twos-complement/brief.md),
  N3096 section 6.2.6.2; [32-bit model](../../../packages/views/src/readings.ts),
  `readingsOfPattern`, `worths` and `bitWeightsOfPattern`;
  [four-bit model](../../../packages/views/src/complement.ts), `fourBitReadings`.
  The latter already derives its readings from simulated register states and is checked
  across all four-bit patterns in `complement.test.ts`.
- Recheck model-derived examples for any prototype. Keep expected answers in author notes
  or tests, and render assessment feedback only after submission.

Preparation locations, checked in source:

| Preparation | Location and extent |
| --- | --- |
| Read a small binary number | `apps/course/src/strings.ts`, Before you start: explicitly required, with a Bit Lab refresher; no local mastery check |
| Set/clear; bit positions and hexadecimal | `content/lessons/pacing-1-4.ts`, `one-pattern-three-readings`: selects the definitions in `READ.investigation` and the hexadecimal bit editor; defined and available for exploration, independent success not established |
| Registers and the 32-bit `w` view | `content/lessons/fundamentals.prose.ts`, One addition: defined with a width diagram and practised through register arithmetic; no prior signed-weight practice |
| Arithmetic with negative values | Before you start requires basic arithmetic, but does not explicitly establish negative-number addition; check this assumption in the session and provide local support if needed |

## Hypotheses to test

| Possible difficulty | Evidence to seek | Design response to try |
| --- | --- | --- |
| Reading selection is mistaken for changing stored bits | Learner says switching to signed rewrites a bit | Keep one pattern fixed while showing two labelled weight rows |
| Highest bit is treated as a minus sign applied to the lower bits | Learner negates the lower-bits total | Show the negative highest contribution being added to positive lower contributions |
| Signed interpretation is never encountered | Learner skips a tab and cannot attempt the task | Put a complete signed worked example on the essential route |
| Large arithmetic obscures the rule | Learner explains the rule but loses track of long sums | Try four positions first, then provide 32-bit weights and permit a calculator |
| A clear bit loses its weight | Learner says clearing changes a position’s weight | Keep weights stable while showing zero contribution |
| Four-bit teaching is generalised incorrectly | Learner treats bit 3 as the sign position in `w0` | Explicitly move the highest position from bit 3 to bit 31 in the bridge |

These are design hypotheses, not observations from a novice study. The user's reports
establish confusion and dissatisfaction with the current presentation, not a diagnosis
of every learner's difficulty.

## Proposed essential route

Use a few coherent sections. The stages below are design responsibilities, not mandatory
headings. Keep a worked example visible so it can be revisited.

1. **Read one small pattern unsigned.** Label the four positions and their weights. Work
   through `0011`, including the zero contributions. Set its highest bit to form `1011`:
   it follows the same positive-weight rule as the others. Show both states and their sums
   on the required route; an optional toggle can repeat the change.
2. **Read that same pattern signed.** Explain why a representation for negative values is
   needed. Keep `1011` fixed and change only the highest weight from positive to negative.
   Name two’s complement beside that rule. Show the full short sum. Include the original
   `0011` as a clear-highest-bit comparison: its two readings agree. Essential explanation
   and worked results are visible without finding a tab or repeatedly toggling a bit.
3. **Practise with support.** Ask the learner to calculate both readings of fresh `1001`
   using displayed weights and explain the highest bit's contribution. Give feedback on
   the selected rule as well as the arithmetic. Keep this task separate from the worked
   example. Do not show its computed totals before submission.
4. **Connect to `w0`.** Explicitly identify the small pattern's width and the real 32-bit
   register view. The highest position is now bit 31; the same weight rule applies. Show
   both weights with grouped decimal digits. Work a highest-bit-only case, including its
   zero lower contribution. Keep widening distinct from changing an existing pattern's
   signedness; do not imply that zero-padding preserves a negative signed value.
5. **Apply independently.** Present a separate 32-bit pattern with only bits 31 and 1 set.
   Supply positional weights, allow a calculator, and ask for both readings and an
   explanation. Ask whether reading the pattern as signed changes any stored bit and why.
   Then ask what clearing bit 31 would change, distinguishing its unchanged positional
   weight from its now-zero contribution. Show feedback after the attempt.
   Free exploration and the appendix follow this task; they extend the explanation.

Keep the first comparison in one compact diagram with aligned bit and weight rows. Use
before/after states only where the pattern changes. These five stages do not justify five
full register grids or five toolbars. The first prototype should show the essential route
before adding optional inspection controls.

Four bits are a candidate, not a settled improvement. The extra bridge may outweigh the
smaller arithmetic. Test whether learners can explain the 32-bit case without being taught
the rule again. If the bridge repeatedly fails, revise the representation before polishing
the controls. Reconcile the overlap with Appendix B when drafting; avoid repeating its full
worked lesson or negation material here.

## Assessment and feedback criteria

- Success requires applying the weights to fresh patterns and explaining unchanged bits.
  A correct multiple-choice answer alone is insufficient evidence.
- Distinguish a summation slip from treating the highest bit as a separate minus sign,
  assuming all signed weights are negative, or using bit 3 as the highest position at 32 bits.
- Check both a set and clear highest bit, and a lower bit's positive contribution.
- The independent task must preserve its own starting state. Resetting exploration must
  not change the task, recorded response or feedback.
- Earlier examples may teach the rule openly. They must not contain the exact fresh task's
  worked totals. Feedback may show those totals after submission.
- Review the rest of the current lesson's exercises before implementation. Replace duplicate
  checks when this assessment covers their outcome; retain distinct applications. Do not
  silently add another set of questions to an already long page.

Exercise disposition for the next draft: replace `two-readings-each` with the independent
task above. Its current highest-bit-only case becomes worked material in the bridge and
cannot also count as fresh evidence. Preserve `make-minus-three` as a distinct construction
task, subject to whole-page length review; do not reveal its 32-bit solution in the worked
examples. Remove the current explorer's which-reading-changes prediction when the new
assessment replaces it. Combine explanation prompts with the task rather than adding
repetitive follow-up sections. This changes the assessment plan, not the current code.

## Assessment of the current guided mock

Source reviewed: `/workspace/scratch/readings-guided-mock/template.html` and `mock.js`.
This is a design review; no new browser or novice session was conducted for this brief.

Keep: visible signed explanation, independent prediction state, explicit set/clear action,
model-derived results, and optional exploration after required teaching.

Reconsider: four full 32-bit displays across unsigned, signed, comparison and prediction;
large values at the first signed example; the one-bit selector before a worked multi-bit
sum; and the prediction that only asks which reading changes when bit 0 is set. That question
can be answered while still misunderstanding the signed highest bit. The displays are visible,
but their presence does not establish that the learner connects the representations.

The fixed comparison uses a different pattern from the initial signed panel. Its caption
explains this, but the learner must still track that change. A single worked pattern should
carry the first comparison. Independent task inputs should change only at a clearly labelled
task boundary.

## Formative session and decision

Invite a beginner with the stated preparation. Ask them to use the prototype and explain
what they think each view means. Do not prompt them to click Signed or tell them the rule.
Observe whether the required route itself provides that support. Note where they seek help.

Observe and record the first in-page attempt at each fresh task before feedback appears.
The interactive must not compute the task's answer for them before submission. They may
use supplied weights and a calculator. Record their explanation, first answer, arithmetic
slips, hints requested and response after help separately. Ask what they think changed
when the interpretation changed. Do not count prompted success as independence.

If conducting an additional post-use probe, reserve an equivalent unseen pattern and check
it against the model first. A repeated in-page question after feedback is a retry, not fresh
evidence. Record it as such. Do not infer independent transfer from recalling its answer.

Record each criterion as demonstrated, not demonstrated, or not observed. In a small
formative session, any persistent core misconception is a reason to revise and retest;
it is not a pass-rate estimate for the course. If four-bit success does not transfer to
32 bits, revisit the bridge. If only arithmetic fails, revisit numeric support first.

Next deliverable: one prototype built from this brief, with separate prose drafting and
independent learner/technical review. Verify mobile/desktop, both themes, keyboard and
all task states. No novice validation has occurred yet. Lack of a participant does not
block authorised prototype work, but must remain explicit in its evidence record.

## Planning review record

The managing session drafted these engineering documents. Separate agents reviewed them:
[learner review](learner-review.md) (requested GPT-6.1 sol, High) and
[technical review](technical-review.md) (requested GPT-6.1 sol, Extra High).
Their findings led to explicit conceptual prompts, source-specific prerequisite locations,
replacement of duplicated assessments, and a distinction between first attempts and retries.
Both reviews found the revised brief ready for prototyping, with no open blocking planning
finding. This is not evidence that beginners have learned from the proposed sequence.

The technical review ran the existing readings, complement and lesson facts tests:
3 files, 49 tests passed. It also checked proposed cases through the existing model.
Local Markdown links and `git diff --check` passed. No app code changed; no full application
suite, deployment or new browser validation was performed for this documentation work.
