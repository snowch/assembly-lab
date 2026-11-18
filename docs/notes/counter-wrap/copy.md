# Counter wrap copy draft

Copyright © 2026 Christopher Snow

Separate drafting pass from the parent's checked-fact brief. Canonical runtime copy is
`packages/views/src/strings.counter-wrap.ts`, exported as `COUNTER_WRAP_STRINGS`.
The matching RISC-V draft uses the same keys with numeric placeholders.

## Purpose and scope

Help a learner explain why a fixed-width unsigned counter wraps and why subtraction at
the same width can measure a short interval across that wrap. Prerequisites are the
existing lesson's arithmetic, small binary numbers and flags. This is a mathematical
four-bit miniature; it does not portray a physical four-bit Arm register or the flags
from executing the same decimal inputs in a wider register.

The model supplies every displayed number: width, actual register width, initial and
stored readings, tick count, full sum and binary pattern, retained pattern, carry out,
elapsed result and full-turn size. Runtime copy does not calculate the lesson's answers.

## Display order and wording

1. `title`, `modelNote` and `instruction` identify the model, then the actual action.
2. `startingLabel`, `counterLabel` and `ticksLabel` distinguish the initial reading,
   current stored bits and ticks advanced. Show `initialNote` initially; do not show a
   completed addition or a carry value before the first tick.
3. `advance` is the primary control. `reset` restores this miniature's initial state.
   Neither control resets the lesson's CPU, prediction or saved work.
4. After a tick, `additionLabel`, `fullSumLabel`, `carryLabel` and `retainedLabel` name
   the previous increment separately from the current state. Keep `carryExplanation`
   visible so the learner knows what the extra bit means.
5. Show `wrapExplanation` when a tick has a carry out. Its arguments come from that
   addition. Do not call a later non-wrapping increment unsigned wrap.
6. At the final bounded tick, show `elapsedTitle`, `elapsedExplanation`,
   `elapsedAssumption`, `turnLimit` and `limitNote`. The explanation uses the original
   reading and current reading, not the inputs to the last increment.
7. Keep `architectureNote` visible beside the model. Render its backtick-marked
   instruction names as code using `withCode`.

Use `caption` as the enclosing lesson figure's description of the interactive task.
It is distinct from `title`, the component's heading. The caption does not supply
the model's initial or final values.

`initialStatus` and `stepStatus` are concise status announcements; they need not be
additional visible paragraphs beside values the figure already labels.

## String function signatures

| Key | Model arguments, in order |
| --- | --- |
| `modelNote` | `width`, `realWidth` |
| `initialStatus` | `stored` |
| `stepStatus` | `ticks`, `stored`, `fullSum`, `carryOut` |
| `limitNote` | `maximumTicks` |
| `wrapExplanation` | `fullSum`, `fullPattern`, `pattern`, `stored` |
| `elapsedExplanation` | `start`, `stored`, `width`, `elapsed` |
| `elapsedAssumption` | `range` |

## Accuracy boundaries

Insert after the existing prediction gate. Do not reveal the original prediction answer
in a caption or initial miniature state. The compact model precedes optional carry-column
detail; it does not replace the actual-width counter ring.

The separate carry out is the arithmetic reason the retained low bits differ from the
full sum. Avoid saying a bit fell out and caused a reset. Wrapping is not a reset
instruction. Unsigned carry and signed overflow are different tests. `adds` updates C
at its instruction width; `add` preserves the flags. Do not reuse this addition carry
as the `subs` no-borrow flag for the elapsed subtraction.

The elapsed interpretation assumes a normally advancing counter and fewer than a full
turn of ticks. The subtraction cannot reveal additional full turns or establish that
the counter was never reset externally.

This drafting pass checks wording against the facts and style brief. Parent integration
must still receive independent technical and learner review, model checks and actual
UI verification. No claim of measured learning effectiveness is made.

## Canonical wording

Placeholder values come from the model. These sentences are the draft reviewed by the integration pass.

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

### `counterLabel`

Stored counter bits

### `startingLabel`

Earlier reading

### `ticksLabel`

Ticks since the earlier reading

### `additionLabel`

Last tick's addition

### `fullSumLabel`

Full sum

### `carryLabel`

Carry out

### `retainedLabel`

Bits stored

### `initialNote`

No tick has advanced yet. There is no completed addition to show.

### `initialStatus`

Starting reading: {stored}. No ticks have passed.

### `stepStatus`

Ticks passed: {ticks}. Stored reading: {stored}. Last tick's full sum: {fullSum}. Carry out: {carryOut}.

### `limitNote`

This example ends after {maximumTicks} ticks. Choose Reset to try it again.

### `carryExplanation`

Carry out is the bit beyond the counter's width. It is separate from the bits stored in the counter.

### `wrapExplanation`

The full sum is {fullSum}, or {fullPattern} in binary. The counter stores only the low bits: {pattern}, read as {stored}. This is unsigned wrap.

### `elapsedTitle`

Count the ticks across the wrap

### `elapsedExplanation`

The earlier reading is {start}; the later reading is {stored}. Subtract the earlier reading from the later one and keep the low {width} bits. The result is {elapsed}, matching the ticks you advanced.

### `elapsedAssumption`

This measures elapsed ticks only if the counter advances normally and fewer than {range} ticks pass between readings.

### `turnLimit`

The two readings alone cannot tell you how many complete turns the counter made.

### `architectureNote`

Unsigned wrap differs from signed overflow V. Arm `adds` updates C for its actual register width; `add` leaves the flags unchanged.


## Integration correction

The existing investigation now names “The ring below” rather than “The figure”, because the four-bit miniature precedes the ring. Its canonical Module 2 prose record and rendered prose module were updated together.
