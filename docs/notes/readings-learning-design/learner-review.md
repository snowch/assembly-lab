# Reading the bits: independent learning-design review

2 November 2026. Planning review, before the next prototype. The reviewer did not write
or edit the brief or skill. This is an agent review, not evidence of novice learning.
Review model and effort: inherited from the managing session; no override requested.

## Scope and evidence

Read `CLAUDE.md`, `docs/authoring.md`, `docs/style.md`, the local learning-design skill
and this directory's `brief.md`. Read the guided mock's `template.html` and `mock.js` in
`/workspace/scratch/readings-guided-mock`. Also inspected the current lesson's prose,
labels and structure (`content/lessons/one-pattern-three-readings.*` and its split in
`pacing-1-4.ts`), Fundamentals'
register preparation, Appendix B's prose, the front page's prerequisites, and the
four-bit and 32-bit model functions named by the brief.

Everything was inspected in source. No browser, keyboard, assistive-technology or
participant session was conducted. No model tests were run and no new technical
verification against Arm or C sources was performed. Model implementation inspection
supports the choice of an evidence source; it does not independently validate every
proposed example. The requested separate technical review must cover those facts.

Review focus: the proposed teaching and evidence, not the appearance of the existing
mock. No implementation or lesson changes were made.

## Findings

Severity describes the consequence if the omission is carried into the next prototype.
Medium means a material gap in the evidence or assessment specification. Low means a
planning detail that should be made explicit when drafting. There are no high-severity
findings against the proposed route.

### L1. Elicit the unchanged-bits explanation explicitly

**Medium, addressed in the revised brief.** Brief, “Outcome and scope”, and essential
route step 5. The evidence below describes the initial version reviewed.

The outcome requires learners to “explain why changing the reading leaves the bits
unchanged”. The independent task asks for “both readings and an explanation”, then
asks what *clearing* bit 31 changes. These are different actions. A learner can show
the right sums and describe a data edit without explaining interpretation alone.
The assessment criteria correctly require an unchanged-bits explanation, but the
planned prompt leaves that evidence implicit.

Correction direction: explicitly elicit what changes and what stays fixed when the
same pattern is read in the other way, before asking about clearing a bit. Capture
that response before feedback. Include separate evidence entries for interpretation
and for changing the pattern. This can remain one coherent task; it does not need
another panel or a multiple-choice question.

Verification: the revised step 5 now asks, “Ask whether reading the pattern as signed
changes any stored bit and why”, before the clearing question. This closes the planning
gap. The future rendered prompt and feedback still need verification.

### L2. Reserve an unseen application for the formative session

**Medium, addressed in the revised brief.** Brief, essential route steps 3 and 5;
“Formative session and decision”. The evidence below describes the initial version
reviewed.

The prototype contains fresh tasks with feedback. The session then says, “Afterwards,
ask them to attempt the fresh tasks”. It does not specify whether these are the tasks
already attempted in the prototype or unseen cases. Repeating a task after its feedback
can show correction or recall, but cannot supply a new first attempt at transfer.
The instruction to separate first answers from help is sound; task identity needs the
same separation.

Correction direction: either observe and retain the first in-page attempts as the
application evidence, or reserve an equivalent unseen case for the post-use probe.
Record which case and weights were shown, whether an earlier result was available,
and all help before the response. If the same case is repeated, label it as a retry.
Do not add a test battery merely to obtain more scores.

Verification: the revised session plan now observes “the first in-page attempt at
each fresh task before feedback appears”, reserves an “equivalent unseen pattern”
for any additional post-use probe, and explicitly labels repetition as a retry.
This closes the test-plan ambiguity.

### L3. Make the clear-bit evidence distinguish weight from contribution

**Low, addressed in the revised brief.** Brief, hypothesis “A clear bit loses its
weight”, essential route step 5, and “Assessment and feedback criteria”. The evidence
below describes the initial version reviewed.

The brief plans to keep weights stable and asks what clearing bit 31 changes. That
can test the hypothesis, but a correct new total alone cannot distinguish “the
position has no weight now” from “the position keeps its weight and contributes
zero”. The hypothesis table names the distinction more precisely than the assessment.

Correction direction: make that distinction part of the explanation criterion and
feedback. Record the learner's account of the position's weight and its current
contribution separately. Do not infer the account from a correct total.

Verification: revised step 5 specifies “distinguishing its unchanged positional
weight from its now-zero contribution”. This closes the planning omission; the
prototype should elicit the distinction before teaching it through feedback.

## Outcome, preparation and progression

Keep the outcome: it names an observable calculation and explanation, states that
weights are supplied, and includes the 32-bit application. The deferred topics keep
negation and overflow from becoming competing teaching goals. Supplying weights and
allowing a calculator match the outcome; arithmetic speed is not the target.

The source supports the preparation claims. The front page's `prereqs.numbers`
in `apps/course/src/strings.ts` requires reading a small binary number by place
value. `FUNDAMENTALS_PROSE.addition.registerViews.caption` identifies the matching
`w` name as the low 32 bits of the register. The current reading investigation teaches
hexadecimal and set/clear terminology locally. None of these establishes prior
practice with negative positional weights. The proposed required signed example
therefore has a necessary teaching job. Negative-number arithmetic remains an
explicit prerequisite assumption to check with a participant, as the brief says.

The revised brief adds a source-specific preparation table, including negative
arithmetic as an unestablished assumption. Keep those locations in the drafting handoff
and distinguish:
binary place-value reading is required on entry; register views are introduced
earlier; signed weights are defined, demonstrated and practised here. Define bit
numbering, width, weight and contribution before asking learners to use them. The
brief's “label the four positions” should include their right-to-left numbering,
rather than relying on hexadecimal familiarity to establish it.

The route provides a useful small complete example: more than one lower bit
contributes, some bits contribute zero, and the highest bit is both clear and set.
It then holds the pattern fixed while changing its reading. The supported task
changes the inputs before the bridge moves the highest position to bit 31.
This distinguishes a definition from a demonstration and from practice.

Compared with a highest-bit-only miniature, the proposed small example earns its
extra lower positions: a highest-bit-only case cannot expose the mistaken rule
that the highest bit negates the lower total. The brief then uses a highest-bit-only
32-bit example to isolate the width bridge. Requiring another fully worked 32-bit
multi-bit example now would weaken the opportunity to observe whether that bridge
works. Try the planned independent application first and revise if its first attempts
show that the composition was not prepared.

## Assessment and attention

Keep the new application in place of the guided mock's current prediction. The mock
asks which reading changes when bit 0 is set. Both a correct signed-weight rule and
several wrong rules about the highest bit can predict that effect. Calculating both
readings with a set highest bit and a nonzero lower contribution gives stronger
evidence, especially with an explanation. No assessment answers are reproduced here.

The plan addresses the main attention costs seen in source: several full 32-bit
displays, large sums before a short worked example, and comparisons that initially
show different patterns. Keep one worked pattern available as a reference, stable
weights beside the bits, and independent task state. Essential signed teaching
must remain visible when optional exploration and disclosures are skipped. Four bits
reduce arithmetic while adding a representation bridge; the brief correctly treats
the net benefit as a hypothesis.

The instruction to review existing exercises before implementation is necessary.
The current lesson already asks learners to construct a negative reading, read three
patterns, and answer a reflection. Construction tests the reverse direction and
should not be called a duplicate solely because it uses the same rule. The new
reading assessment overlaps the existing three-pattern challenge. The revised brief
now explicitly replaces that challenge and preserves construction subject to a length
review; this is a suitable disposition. Recheck the whole lesson for answer leakage
and for references to the old sequence after drafting.

## Decision and remaining evidence

Keep the proposed route for the next prototype. L1 and L3 are addressed in the revised
planning document; preserve them in the draft and feedback. L2 is also addressed in
the revised session plan. No planning finding remains open. These were concrete
drafting and test-plan changes, not a request for another
approval stage. The revised instruction to use a compact shared diagram also addresses
the risk that teaching stages become repeated grids. No finding requires replacing the
proposed small example on present evidence.

The revised formative plan separates unprompted attempts, task identities and help,
and avoids claiming a course-wide pass rate. Observe whether
a beginner can transfer the weight rule to 32 bits without being taught it again.
Track arithmetic difficulty separately from the representation explanation. If no
participant is available, continue authorised prototype work and leave novice learning
unobserved in its evidence record.

The next built prototype still needs phone and desktop checks, both rendered themes,
keyboard and state checks, a separate technical review, and any assistive-technology
checks actually performed. Source inspection cannot close those items. No claim of
learner validation follows from this review.
