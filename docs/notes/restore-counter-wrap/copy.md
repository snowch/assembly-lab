# Counter-wrap copy

Copyright © 2026 Christopher Snow

Separate drafting pass from `brief.md`, the existing elapsed-ticks lesson and the repository's style and authoring guides. The inherited model was used; the suggested GPT-6.1 model name was not available. This record is a draft, not an independent learner review or evidence of learning effectiveness.

## Visible route

Use a separate pane headed **How a counter wraps** before **Subtracting with addition**. The first pane starts at the counter's earlier reading. Two presses advance that one counter, first to its largest four-bit reading and then to zero. Each result shows the completed addition. The final addition remains visible until Reset, beside the carry/stored-bit split. The next pane uses the same earlier and later readings to calculate their elapsed interval.

No additional elapsed-result table, signed-overflow explanation or Last tick heading is needed. The equation identifies which addition ran. The current stored result and the short trail carry the visible state.

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
    "Choose Advance one tick twice. Each press adds one to the stored count. Watch Carry out and Bits stored when the count reaches zero.",
  advance: "Advance one tick",
  reset: "Reset",
  initialLabel: "Starting reading",
  initialNote: "No tick has advanced yet, so no addition is shown.",
  carryLabel: "Carry out",
  retainedLabel: "Bits stored",
  trailLabel: "Counter readings in counting order",
  noCarry: (width: number) =>
    `The full sum fits in ${width} bits, so the carry out is 0.`,
  wrapped: (width: number) =>
    `The carry out is outside the ${width} stored positions. The counter keeps only the low ${width} bits, so its reading becomes zero. This is a wrap.`,
  architectureNote:
    "The carry shown belongs to this four-bit example. Arm `adds` records carry out for its actual register width; `add` leaves C unchanged.",
  next: (earlier: number, later: number) =>
    `The next pane uses the earlier reading \`${earlier}\` and the later reading \`${later}\` to calculate elapsed ticks.`,
  initialStatus: (stored: number) =>
    `Starting counter reading: ${stored}. No ticks have advanced.`,
  stepStatus: (ticks: number, stored: number, carry: number) =>
    `Ticks advanced: ${ticks}. Stored reading: ${stored}. Carry out: ${carry}.`,
} as const;
```

The full decimal equation and binary addition operands come directly from the model, without an extra heading or Full sum label. Starting reading accompanies the initial binary/decimal value only. Once an addition runs, Bits stored names the result; do not repeat it in a separate current-reading table. Carry out and Bits stored labels must precede their values in reading order. Keep the two completed steps in the trail; do not build a second history table.

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

Idea pass: storing only four positions explains why an ordinary addition changes the counter from its largest value to zero. The two-press route demonstrates that wrap; subtraction then uses the same pair of readings for a different operation. The real-width prediction and written exercise supply independent application. Initial/restored/reset states, touch reflow and the actual render still need implementation and independent browser review.

## Accepted implementation edits and review correction

Accuracy editing qualified the carry-width note by naming `adds` and distinguishing `add`, which leaves C unchanged. Independent review found that the variable-height result moved the focused Advance button below the viewport. Controls now follow the instructions and precede that result. The calculation, trail and same-readings join follow the controls. This keeps the two presses in a stable location without scripted scrolling or a large empty height. Independent final-build confirmation is recorded in the review files.
