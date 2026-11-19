# Counter-wrap copy

Copyright © 2026 Christopher Snow

Separate drafting pass from `brief.md`, the existing elapsed-ticks lesson and the repository's style and authoring guides. The inherited model was used; the suggested GPT-6.1 model name was not available. This record is a draft, not an independent learner review or evidence of learning effectiveness.

## Visible route

Use a separate pane headed **How a counter wraps** before **Subtracting with addition**. The first pane starts at the counter's earlier reading. Three presses advance that one counter from 13 through 14 and 15 to zero. Each view shows the carry and stored reading from the computed forward tick. The wrapped reading and carry remain visible until the learner revisits a previous tick or chooses Reset. The next pane uses the same earlier and later readings to calculate their elapsed interval.

No additional elapsed-result table, signed-overflow explanation or Last tick heading is needed. The carry label identifies the viewed forward increment. The current stored result and the short trail carry the visible state.

## Proposed strings

```ts
// Copyright © 2026 Christopher Snow

// Canonical drafting record: docs/notes/restore-counter-wrap/copy.md.
export const COUNTER_WRAP_STRINGS = {
  title: "How a counter wraps",
  caption: "Count forward, then inspect the stored bits.",
  intro: (width: number, realWidth: number) =>
    `A counter stores a count. Each tick adds one. This teaching counter keeps only ${width} bits; the program later uses ${realWidth}-bit registers.`,
  instruction:
    "Use +1 until Bits stored shows 0000. The example pauses there. Use −1 to revisit the previous tick.",
  previous: "−1",
  previousLabel: "−1, revisit the previous tick",
  advance: "+1",
  advanceLabel: "+1, advance one tick",
  reset: "Reset",
  initialNote: "The dash means no +1 tick is shown at the starting reading.",
  carryLabel: "Carry from +1",
  decimalLabel: "Decimal reading",
  pendingCarry: "—",
  retainedLabel: "Bits stored",
  trailLabel: "Counter readings in counting order",
  wrapped: (width: number) =>
    `The carry out is outside the ${width} stored positions. The counter keeps only the low ${width} bits, so its reading becomes zero. This is a wrap.`,
  architectureNote:
    "The carry shown belongs to this four-bit example. Arm `adds` records carry out for its actual register width; `add` leaves C unchanged.",
  next: (earlier: number, later: number) =>
    `The next pane uses the earlier reading \`${earlier}\` and the later reading \`${later}\` to calculate elapsed ticks.`,
  initialStatus: (stored: number) => `Starting reading: ${stored}. No +1 tick is shown.`,
  stepStatus: (ticks: number, stored: number, carry: number) =>
    `Viewing tick ${ticks}. Stored reading: ${stored}. Carry from +1: ${carry}.`,
} as const;
```

Bits stored labels the pattern in every state, with its decimal reading directly underneath. Carry from +1 remains outside that group; the missing-result mark before the first tick is explained locally. +1 advances to the next computed forward tick and −1 revisits its previous state, bounded at the starting reading. The three completed ticks stay in the trail. The wrap pane omits both the decimal and binary addition equations; the separate subtraction pane retains its worked rows.

The word wrap is defined beside the state that demonstrates it. The heading names the mechanism before the learner acts. The carry explanation refers to four stored positions, while the architecture note prevents treating the small-model carry as the 32-bit instruction’s C flag. If the implementation shows the note in all states, retain its local four-bit context and keep it visible.

## Minimal subtraction-pane join

Replace only the existing `intro` value in `COUNTER_SUBTRACTION_STRINGS` with:

```ts
intro: (width: number, now: number, then: number) =>
  `Use the same ${width}-bit counter. Its earlier reading is \`${then}\` and its later reading is \`${now}\`. Calculate later minus earlier.`,
```

This removes the repeated definition and increment mechanism, which the preceding pane now explains and demonstrates. Keep the visible four-bit inputs, inversion rule, completed arithmetic, interval bound, single-`sub` instruction note and bridge to the independent 32-bit example. The subtraction example must remain readable without completing the wrap controls; the supplied earlier/later readings do that.

## Closing checks on this draft

Sentence pass: short concrete statements; named controls match the brief; each statement explains setup, action, automatic behaviour or result. No implementation helper names, additional flag rules or generic Last tick labels are introduced. The model supplies all displayed numeric operands and results.

Idea pass: storing only four positions explains why an ordinary addition changes the counter from its largest value to zero. The three-press route demonstrates that wrap; subtraction then uses the same pair of readings for a different operation. The real-width prediction and written exercise supply independent application. Initial/restored/reset states, touch reflow and the actual render still need implementation and independent browser review.

## Accepted implementation edits and review correction

Accuracy editing qualified the carry-width note by naming `adds` and distinguishing `add`, which leaves C unchanged. Independent review found that the variable-height result moved the focused Advance button below the viewport. Controls now follow the instructions and precede that result. The stored readings, trail and same-readings join follow the controls. This keeps the controls in a stable location without scripted scrolling or a large empty height. Independent final-build confirmation is recorded in the review files.

## Start at thirteen

The user requested the 13 → 14 → 15 → 0 path. The current instruction above comes from the separate drafting pass in `../counter-from-13/copy.md`. The same shared model supplies the following subtraction’s earlier reading 13, later reading zero, retained result three and four-reading timeline. Earlier review measurements in this record describe the prior two-tick version; current independent verification is recorded in the new notes.

## Compact display revision

The user requested +1 / −1 controls, decimal directly beneath the stored bits and no addition equations in this pane. Current labels/instructions above come from `../counter-from-13/compact-copy.md`. The carry label identifies the viewed +1 step when −1 revisits earlier frames, avoiding an extra subtraction/borrow topic. The old layout/review records remain historical; final-current checks are recorded under `../counter-from-13/`.
