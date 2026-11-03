# Reading the bits: independent technical review

2 November 2026. Planning review only. This reviewer did not write the skill,
brief or authoring-guide addition and made no changes to them or production code.
The managing session reports the requested review configuration as
`gpt-6.1-sol`, `xhigh`, with no inherited conversation. This records the request,
not an independently verified backend identity.

## Decision

Proceed to the next prototype. The positional-weight account is technically
consistent with the executable model. The proposed four-bit example has a stated
limit and a necessary, explicit bridge to the 32-bit `w0` view. Its educational
advantage is still a hypothesis. No blocking technical error was found.

Keep the revised task prompts, exercise disposition and evidence limits. The final
formative protocol now separates first attempts, unseen probes and retries. All
planning findings below are resolved or recorded as limitations. No browser or
novice validation is implied by this review.

## Material and checks

Read in source: `CLAUDE.md`, `AGENTS.md`, `docs/authoring.md`, `docs/style.md`,
the local learning-design skill, the final revised learning-design brief,
`docs/notes/twos-complement/brief.md`, `docs/sources.md`, the front-page prerequisite
strings, Fundamentals prose, the readings lesson's prose and structure, its pacing
selection and facts tests, `readings.ts`, `complement.ts`, and their tests. Read the
current guided mock's `template.html` and `mock.js` from
`/workspace/scratch/readings-guided-mock`.

The authoring guide's two added relative links resolve to the local skill and
brief. The guide describes the sequence as a hypothesis and keeps agent review
separate from evidence of learning. The skill expressly adds no approval gate and
does not require a participant before authorised prototype work can continue.

Executed from the repository root:

```text
npm test -- packages/views/src/readings.test.ts packages/views/src/complement.test.ts content/lessons/one-pattern-three-readings.facts.test.ts
```

Result: exit 0; 3 test files passed; 49 tests passed. This was a focused run,
not the full suite. No failures or skips were reported in this run. The Vitest
output identified version 4.1.12.

Also loaded the existing modules with Vite's server-side module loader and ran the
brief's worked and fresh patterns through `fourBitReadings` and
`readingsOfPattern`. Checked the fresh task with bit 31 cleared and checked wider
patterns containing bit 3. These were model examples, not additional persisted
tests. Fresh assessment totals are intentionally omitted from this review.

No built page was inspected. Phone/desktop rendering, actual light/dark themes,
keyboard and assistive-technology behaviour, state restoration, feedback timing,
and visual answer leakage remain untested here. No new GNU/QEMU differential run
was performed. The C23 source record was read; its cited temporary extraction,
`/tmp/twos-n3096.txt`, is absent in this environment, and the primary PDF was not
independently reopened in this review.

## Model and width evidence

- `readingsOfPattern` assembles and runs a `mov`/`movk` program, then reads the
  resulting `w0` state. Merely selecting a reading does not execute another
  instruction or mutate that pattern. `worths` computes positional weights;
  `bitWeightsOfPattern` separately retains position, bit value, weight and
  contribution. Their sums are checked against the model readings. The 32-bit
  tests cover corners and a deterministic spread, not all possible patterns.
- `fourBitReadings` is a representation helper backed by 32-bit model states,
  not a four-bit Arm machine. It zero-pads for the unsigned reading and repeats
  the highest bit for the equivalent signed reading. These are separate model
  states. Its tests exhaust all sixteen four-bit patterns and check both weight
  rows and their contribution sums. The brief's claim of exhaustive four-bit
  coverage is supported.
- The worked `0011` has matching readings. Setting its top position produces
  `1011`; the unsigned weight row is `8, 4, 2, 1`, and the signed row is
  `−8, 4, 2, 1`. The model gives 11 unsigned and −5 signed. Clear positions
  contribute zero while retaining their weights. The proposed signed example
  therefore exposes the incorrect rule that negates the lower-bit total.
- The four-to-32-bit bridge is mathematically sound if presented as a new width,
  with the highest position moving from bit 3 to bit 31. It is not a conversion
  of the original negative pattern. Zero-padding `1011` to 32 bits gives a
  positive signed reading; preserving its negative signed value would require
  the separate extension mechanism that the brief deliberately defers. There
  is no need to expose the helper's internal extension procedure to teach the
  proposed weight rule.
- The 32-bit highest-only case has positive unsigned and negative signed top
  weights of equal magnitude. The proposed fresh case exercises the positive
  contribution of a lower bit, and clearing bit 31 makes the two readings agree.
  All these checks agree with the model. The bridge must continue to call `w0`
  a 32-bit view of the real register, as the revised brief does.

The repository's C23 source record supports the named two's-complement
representation. Neither the brief nor this review should turn that into a claim
that C signed arithmetic always wraps, that four bits is a C integer type here,
or that an Arm instruction is being executed when the learner changes a reading.
The current brief makes none of those claims.

## Findings and disposition

### T1. Medium, resolved in the final brief: keep the formative task unseen

Location: brief, Proposed essential route stage 5 and Formative session and
decision. The earlier draft said: “Afterwards, ask them to attempt the fresh tasks”.

The route already includes a required independent task with post-submission
feedback. If the later session task reuses that same input after feedback, the
result is a repeated attempt. It cannot supply fresh evidence of transfer. This
is a protocol ambiguity, not a demonstrated learner failure.

Correction verified in source: the final protocol says to record the first
in-page attempt before feedback and to reserve an equivalent unseen,
model-checked pattern for any additional post-use probe. It explicitly calls
repeated questions after feedback retries and excludes them from fresh evidence.
This resolves the planning issue. No production implementation was needed for
this correction.

### T2. Resolved in the revised brief: worked material must not remain a fresh test

The bridge works the highest-bit-only 32-bit pattern. The current
`two-readings-each` challenge includes exactly that pattern. Keeping its current
description of three “new patterns” would overstate the resulting assessment.

The final revision explicitly replaces `two-readings-each` with the new
independent task and says the bridge case cannot also count as fresh evidence.
This resolves the planning issue. The distinct `make-minus-three` construction
is retained subject to length review and its 32-bit solution remains protected.
Implementation will still need independent verification of the resulting
challenge and hint states.

### T3. Resolved in the revised brief: elicit the non-arithmetic distinctions

The initial task sketch asked for both readings and an explanation. The final
revision explicitly asks whether selecting signed changes a stored bit and asks
the learner to distinguish the highest position's weight from its contribution
after clearing it. These prompts now match the stated outcome and misconception
criteria. Correct totals alone are not treated as sufficient evidence.

### T4. Low: retain the preparation ledger and distinguish requirement from practice

The added source table correctly locates small binary reading in the front-page
prerequisites, set/clear and hexadecimal definitions in the pacing-selected
lesson, and the 32-bit `w` view in Fundamentals. The front page requires “basic
arithmetic”; it does not specifically verify negative-number addition. The brief
now records that assumption and plans local support if needed. No stronger
prerequisite mastery claim is warranted from source inspection alone.

## Sceptical checks and rejected concerns

- Reject a claim that the miniature violates the real-machine rule: it uses
  existing model-backed helpers and is explicitly labelled as a representation
  example. Its width still needs to be visible in the prototype.
- Reject a requirement to teach inversion-plus-one or sign extension before
  applying signed positional weights. Neither mechanism is required by this
  outcome; silently widening a negative pattern would be a separate error.
- Reject treating the mock's signed/comparison inputs as an unlabelled
  inconsistency. `mock.js` uses fixed lower bits for the clear/set pair and the
  comparison names its set-highest-bit state. The brief's request for a single
  worked comparison is a design hypothesis, not proof that the existing caption
  is technically false.
- Retain the brief's criticism of the existing bit-0 prediction. The prompt
  can be answered correctly with the mistaken rule that a set highest bit negates
  the lower-bit total: setting bit 0 would still change both readings under that
  wrong rule. The revised independent task asks for actual readings and reasoning
  and removes this redundant prediction.
- No evidence overstatement was found in the skill, the revised brief or the
  authoring-guide addition. They explicitly distinguish model checks, agent
  reviews, browser inspection and formative observations. They do not claim that
  a smaller example is proven better or that a small session establishes broad
  effectiveness.

The next prototype should preserve those limits, pin any new learner-facing
numbers, and receive a review of its actual rendering and task states. The
four-to-32-bit transfer and the total page length remain empirical design
questions.
