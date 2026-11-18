# Archived counter miniature copy

This record describes the removed elapsed-page prototype. The current learning route is in [the elapsed learning-design brief](../elapsed-learning-design/brief.md). The earlier four-bit arithmetic lesson retains the addition-width demonstration.

# Counter-wrap copy record

Copyright © 2026 Christopher Snow

Separate drafting pass from the checked-fact brief, updated from the user-approved simplified preview. Runtime copy lives in `packages/views/src/strings.counter-wrap.ts` as `COUNTER_WRAP_STRINGS`.

## Purpose and scope

Show why a fixed-width unsigned counter stores only the low result bits, then connect that mechanism to measuring a short interval across a wrap. The learner has met small binary numbers, unsigned and signed readings, arithmetic and Arm flags. The four-bit miniature is a mathematical teaching model beside the actual 32-bit lesson; it does not depict four-bit Arm registers or flags produced at that width.

## Simplification and rendering contract

The user found the separate stored-bit readout and tick metric redundant. Remove those readouts and the repeated full-sum cards. The full addition, separate carry and retained bits now form the main visual. Keep one compact sequence of counter readings with its tick count. That sequence explains elapsed ticks; it is not another result panel.

Production starts at zero ticks. Show `initialNote(start)` until a tick completes; do not invent a completed addition or a carry value at the start. The review preview was opened at the wrap only to show the proposed layout. It does not change the production starting state.

After a tick, show the full addition with `carryLabel` and `retainedLabel`. Keep `carryExplanation(width)` visible beside it. Use `wrapExplanation` only when that completed addition has a carry out. A later increment without a carry is not itself a wrapping increment.

`traceLabel` identifies the sequence. `timelineTicks(ticks)` uses the singular only for one tick; zero uses the plural. Both the trace and the count come from the same model state.

`advance` increments the miniature; `reset` restores only its starting state. Preserve the existing prediction gate, saved tick key, CPU state, editor drafts and other learner work. Show `limitNote` by the controls when the bounded example ends so the learner can see why Advance is unavailable and how to restart.

At the final tick, keep `elapsedTitle`, `elapsedExplanation`, `elapsedAssumption` and `turnLimit` visible. The elapsed subtraction uses the original and current readings. “Ticks shown in the sequence” describes both a restored state and a sequence the learner advanced directly.

Keep `architectureNote` visible and render its backtick-marked instruction names as code. Use `initialStatus` and `stepStatus` as announcements, not additional visible result paragraphs. The enclosing `caption` describes the task without revealing a native prediction answer.

## Function signatures

| Key | Model arguments, in order |
| --- | --- |
| `modelNote` | `width`, `realWidth` |
| `timelineTicks` | `ticks` |
| `initialNote` | `start` |
| `initialStatus` | `stored` |
| `stepStatus` | `ticks`, `stored`, `fullSum`, `carryOut` |
| `limitNote` | `maximumTicks` |
| `carryExplanation` | `width` |
| `elapsedExplanation` | `start`, `stored`, `width`, `elapsed` |
| `elapsedAssumption` | `range` |

## Accuracy boundaries

Every displayed reading, bit pattern, sum, carry and count comes from the existing arithmetic model. The miniature stays behind the original prediction gate and does not replace the actual-width counter ring. Do not say a lost bit causes a reset. Unsigned wrap and signed overflow are different conditions. `adds` updates C at its actual instruction width; `add` preserves the flags. The addition carry is not the `subs` no-borrow flag.

Measuring elapsed ticks requires a normally advancing counter and fewer than a complete turn between readings. Two readings cannot reveal additional complete turns or establish that no external reset happened.

The existing investigation names “The ring below” because this miniature precedes it; that wording remains in the canonical Module 2 record. Independent learner and technical review and browser checks belong to integration. Passing functional checks does not establish learning effectiveness.

## Canonical wording

Placeholders receive model values. For `timelineTicks`, choose the singular template only when `ticks` is one.

### `title`

See a counter wrap

### `caption`

Advance a four-bit counter to see which bits of each full sum it stores.

### `modelNote`

This is a {width}-bit teaching model. The lesson uses {realWidth}-bit registers.

### `instruction`

Choose Advance one tick. Each tick adds one. Watch which bits the counter stores.

### `advance`

Advance one tick

### `reset`

Reset

### `traceLabel`

Counter readings

### `timelineTicks`

{ticks} tick / {ticks} ticks

### `carryLabel`

Carry out

### `retainedLabel`

Bits stored

### `initialNote`

Starting reading: {start}. Choose Advance one tick to add one.

### `initialStatus`

Starting reading: {stored}. No ticks have passed.

### `stepStatus`

Ticks passed: {ticks}. Stored reading: {stored}. Full sum: {fullSum}. Carry out: {carryOut}.

### `limitNote`

This example ends after {maximumTicks} ticks. Choose Reset to try it again.

### `carryExplanation`

Carry out is the bit beyond the counter’s width. The counter stores only the low {width} bits.

### `wrapExplanation`

This is unsigned wrap.

### `elapsedTitle`

Count the ticks across the wrap

### `elapsedExplanation`

The earlier reading is {start}; the later reading is {stored}. Subtract the earlier reading from the later one and keep the low {width} bits. The result is {elapsed}, matching the ticks shown in the sequence.

### `elapsedAssumption`

This measures elapsed ticks only if the counter advances normally and fewer than {range} ticks pass between readings.

### `turnLimit`

The two readings alone cannot tell you how many complete turns the counter made.

### `architectureNote`

Unsigned wrap differs from signed overflow V. Arm `adds` updates C for its actual register width; `add` leaves the flags unchanged.
