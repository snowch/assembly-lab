# Recursive calls and separate frames

Module 9, second lesson; registry index 18 (nineteenth lesson). Independent reader of all ten sections, with entry requirements and registry lessons 0–17 only. Reviewed built commit f1fdf35 at `/assembly-lab/#/lesson/recursive-calls`.

## Prerequisites and novelty

Earlier lessons supply unsigned shifts, branches including zero/nonzero tests, memory addressing, preserved registers, `bl`/`ret`, link register, stack pointer, frame pointer, pair stores/loads and alignment. In particular, “Calls, returns and the stack” explicitly explains saving incoming `x19` before reusing `w19`, and restoring all 64 bits. Its worked stack has the same 32-byte layout. These are reuse here, not simultaneous new mechanisms.

New mechanisms are self-calls, the base case, progress towards that case, separate simultaneous invocations of the same function, and pending work resumed in reverse call order. The opening defines recursion and base case before the first task. The first prediction asks for a returned sum after an unsigned halving sequence; it does not require writing recursion or inventing a frame layout. Motivation explains what each call preserves before the attempt. This is a reasonable synthesis of familiar machine operations with one new control-flow idea. No confirmed untaught prerequisite was found. Compiler settings are repeated from the preceding lesson, which explains the extra no-inline setting.

## Confirmed finding

**Medium: byte-expanded recursive frames separate the operation controls from the saved values the investigation asks the learner to follow.** The investigation says “Use Back to inspect how the calls built the stack, or Next to follow the remaining instructions and returns” and “Each frame holds the values for a different invocation.” After checking the first prediction, its preset position is 22. `packages/views/src/interactives/StackStepper.tsx` renders the whole paired listing, controls, slider, status, five register summaries, return target, then every byte of each active frame. Every saved eight-byte register appears as a labelled value plus eight individually addressed byte cells, including full zero bytes and unused space.

Fresh phone measurement (375×900, light): the investigation figure is 4334 px high. Relative to its top, Next/Back start at 603 px; the four frame cards start at 1340, 2069, 2797 and 3526 px and are about 680–712 px high. Thus the learner inspecting the fourth invocation cannot see even the first frame or stepping controls. On desktop the same figure is 3036 px high; controls start at 580 px and the fourth card at 2512 px. This is tracking cost, not a claim that four calls are inherently too many. The saved `x19` values, current register and resumed instruction must be connected across several screens while the task is about call identity and preservation. Actual dark contexts produce the same structure and readable colours.

Reproduce: fresh page → select/check any first prediction → inspect “Inspect the stack when the recursive calls are all active.” Phone screenshot `recursive-calls-375-light-deep.png` shows the byte-expanded cards; corresponding dark/desktop files are under `/tmp/course-load-review/`. Measurements are in `recursive-calls-measure.cjs` (execution output recorded in this review's tool history).

Smallest direction: retain the computed frame identities and saved register values, but give this lesson a compact simultaneous view of the active frames; move individually addressed bytes behind a per-frame disclosure. Keep the instruction/status and controls available beside that compact stack while stepping. Byte-level detail remains useful in the preceding stack-layout lesson; recursion's main task is comparing invocations and resuming work.

## Treatments to keep

- Opening prose gives the plain mechanism and base case before naming the task. Halving an unsigned brightness reuses a practised operation and gives visible progress.
- The prediction is checked before either normal stack figure opens. An incorrect prediction still unlocks exploration; this supports investigation rather than requiring prior mastery.
- The deepest-point preset deliberately removes the need to discover that moment through dozens of steps. “This figure starts at the deepest point” accurately names its state. Separate “Call 1” etc. identities and labelled saved registers support the central distinction.
- The construction task narrows the first code attempt to the base-case branch while retaining supplied saves/restores. The later count task deliberately changes which value must survive. This is appropriate progression, not excessive novelty.
- The failure changes only the progress operation and explicitly bounds the recording. The explanation distinguishes the recording limit from recursion terminating and from real finite stack space.
- “Restoring sp releases a frame's space. It does not erase the bytes” prevents a misleading memory model.

## Recommendations versus unsupported suspicions

No high-severity teaching-sequence issue confirmed. A smaller starting brightness could shorten a trace, but the preset already provides the important state; reducing the example is less effective than compacting the redundant byte display. The opening whole-function listing is long enough to require contained horizontal scrolling on a phone, but it uses familiar instructions and is followed by explicit preservation prose. Its existence, prediction-first order, number of figures and page length are not evidence of overload. The generalisation teaches the counting rule before the final task; that is legitimate preparation, not premature disclosure of a challenge solution.

## Coverage and limits

Read all ten rendered sections and ordinary disclosures, canonical lesson data/prose, recorded program, preceding lesson's relevant definitions, `StackStepper.tsx` and `stack.ts`. Fresh Chromium contexts at 375×900 and 1280×900 in light/dark; actual body backgrounds verified as rgb(243,246,245) and rgb(16,22,21), with page scroll widths matching viewports. Initial full-page captures; checked first prediction with a deliberately incorrect choice; normal stepper advanced ten steps; deepest preset inspected, Next/Back and Reset exercised; failed-progress prediction checked and its trace moved to position 32; initial branch-repair starter tested to inspect feedback; recorded-function and reflection Answer disclosures opened. Initial and representative call/deep/failure screenshots exist for all four combinations, with browser logs and scripts prefixed `recursive-calls-`.

Challenge implementations/hints were read only as necessary to understand their scope; no solution edits or completed challenge answers were submitted. Final challenge execution, all intermediate trace positions, editor Tap mode, exhaustive feedback/hints, keyboard/screen-reader behaviour and external compiler calls were not tested. No application edits or rebuilds.
