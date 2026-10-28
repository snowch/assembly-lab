# Independent learner review: scannable exercise prompts

Reviewer: GPT-6.1, High. Separate reader; no product edits. Read AGENTS.md, CLAUDE.md,
docs/authoring.md and docs/style.md before inspecting the lesson source. The initial source
pass preceded any account of the draft's reasoning.

## Scope and learner assumptions

This review concerns scanning exercise instructions: distinguish the supplied state, the
operations to trace or implement, the required outputs and the local constraints. It does not
reopen the teaching sequence or audit all earlier technical claims. The reader has the front
page prerequisites and each lesson's predecessors, as the course requires.

Source inspection found no extra prerequisite introduced by changing prose into lists. Register
names, argument arrival, instruction order, flags, memory addresses and return values must keep
the meanings established in each lesson. A list must not imply that sequential instructions
run independently, or that a fresh exercise continues a worked example's state.

## Initial findings and review directions

- Low severity, scan density: fundamentals source originally says, for example, “Before
  `sub w1, w0, w1` runs, `w0` holds 18 and `w1` holds 5.” This makes the learner find the two
  initial facts inside the sentence containing the operation. Separate the initial facts from
  the operation and the requested after-state. The analogous addition, constant-addition,
  function, instruction-sequence and returning-to-caller prompts need the same check.
- Low severity, scan density: `loading-widths` originally says “Put the distance in `w0`, the
  sign-extended gradient in `w1`, the fuel level in `w2`, and the pulse count in `w3`.” Four
  requested register outputs merit a parallel list, even though the record's input fields
  already have their own list. Keep the address-preservation guidance local.
- Review risk: `returning-to-caller` asks about two different moments, immediately after `ret`
  and after the caller's addition. Bullets must retain those moments explicitly.
- Review risk: `instructions-in-sequence` uses the state left by its first operation;
  `masks` trace operations each start afresh. List formatting must preserve that distinction.
- Scope judgement: short, single-action prompts need no list solely for visual consistency.
  More lists are useful only when they expose several supplied facts or requested results.

These are directions, not replacement prose. No challenge answer is included in this record.

## Final source review

The final candidate changes 52 string properties in 25 prose files, rendered in 28 lessons.
I read the changed starting-state, prediction, reflection and task text, including the operations,
requested moments and constraints around each list. I also read the unchanged short-task cases
in the other six lessons: One pattern, three readings; Constants and widths; Recursive calls;
C and overflow; Raspberry Pi 5; Raspberry Pi boot. Their single-input or ordered-workflow
structure does not require a list conversion.

The final prose keeps inputs separate from the work requested. Lists carry independent facts;
ordered operations remain connected in prose. The sensor-record task distinguishes its input
field list from its requested output list. No extra section headings were added, no fresh
computed answers were introduced, and no new mechanism or prerequisite requires an additional
worked-example bridge for this formatting change.

Two low-severity referent findings were raised independently and corrected:

- Debug native instructions: “Return their sum minus twice the correction” followed a list
  containing three distances and a correction. The candidate now explicitly names “the sum of
  the three distances”. Source and the final rendered contract confirm the intended operands.
- Checked arithmetic: “Store the low 32 bits of their sum there” followed distance, adjustment
  and a result-slot address. The candidate now names the sum of distance and adjustment and
  the result slot. Source and the final rendered contract confirm both operands and destination.

The initial scan-density findings are resolved in the final rendered prompts. The sequence
exercise still says to run its two instructions “in that order”; the masks trace still says to
start each instruction separately; returning-to-caller still names both requested moments.
No open learner finding remains in this change. This conclusion is limited to the prompt
formatting and its immediate context, not a new review of the full teaching sequence.

## Browser review

Reviewed the final production build served at `http://localhost:4399/assembly-lab/` in
headless Chromium. The managing session supplied and froze that build; I did not build it.
The review used desktop 1280 × 900 and phone 375 × 812, each in light and dark themes.

Full changed-list coverage:

- Opened all 28 affected lesson routes in all four combinations: 112 page visits.
- Matched all 57 list groups occurring in the 52 changed string properties on each pass:
  228 exact rendered-list checks. This includes pre-existing neighbouring lists inside modified
  reflection/task properties as well as the new lists.
- Confirmed real `ul`/`li` elements, rendered inline code, source-matching item order and text,
  no list or document horizontal overflow, and no browser page exceptions.
- Confirmed actual `html[data-theme]` and computed body backgrounds: light
  `rgb(243, 246, 245)`; dark `rgb(16, 22, 21)`.
- Captured every matched list and visually inspected all 228 captures, arranged in ten sheets.
  Bullets remain distinct, hanging wraps are readable and code is legible in both themes.

Focused interaction coverage, repeated at both widths in both themes:

- Subtraction and reuse and Instructions in sequence: blank answer fields initially; wrong
  answers do not complete the exercise; one hint reveals one rung; correct work passes;
  reloading restores checked work and the hint; Clear work removes both; a further reload
  keeps the cleared state. Prompt text remains identical through those states.
- Loading widths (`read_sensors`) and Checked arithmetic (`checked_trip`): wrong instructions
  fail; correct instructions pass; hint, reload/regrade, Clear work and cleared reload behave
  as above. Prompt text remains identical. Full task captures were visually inspected for all
  four combinations, including the separate memory-field and output-register lists.
- Returning to the caller: initial state, stepping through the function's return, restoring that
  state on reload, executing the caller's next instruction, Back and Start again. Its complete
  task was visually inspected at all four combinations; both requested result moments remain
  distinct from starting inputs and execution order.
- Masks field-plan prediction and Loading widths signed-gradient prediction: results are absent
  before commitment, including after selecting an option; commitment reveals the outcome;
  reload preserves it; removing saved lesson work restores the unopened prediction. The signed
  load's dependent stepper remains locked until commitment, steps afterwards and relocks after
  saved work is removed. All eight viewport/theme gate checks passed.

The full changed-list matrix and the focused interaction scripts completed successfully.
Screenshots and machine-readable observations were kept under
`/tmp/scannable-review-browser/` for this session. The other affected activities were inspected
in their initial rendered state; their complete interaction lifecycles were not replayed by
this reviewer. The six unchanged lessons above were source-only for this review. Native tools,
physical hardware, live compiler calls and assistive-technology navigation were not exercised.
No build or full test suite was run by this reviewer; suite results belong to the integration
record. The unrelated untracked Pi source brief was not edited.
