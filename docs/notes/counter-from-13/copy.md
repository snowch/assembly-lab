# Counter from thirteen: instruction draft

Copyright © 2026 Christopher Snow

Separate drafting pass from `brief.md`, the current counter-wrap strings and `docs/style.md`. The inherited available model was used. This draft changes only the instruction; it does not certify the implementation or learner understanding.

## Proposed replacement

Choose Advance one tick until Bits stored shows 0000. Watch Carry out on that transition. The example pauses at zero.

```ts
instruction:
  "Choose Advance one tick until Bits stored shows 0000. Watch Carry out on that transition. The example pauses at zero.",
```

## Checked facts and scope

The checked brief specifies the four-bit path 13 → 14 → 15 → 0. The final stored pattern is `0000`, and the carry out is 1 on that transition. The implementation must stop there with that result visible. The same readings supply the following worked subtraction, whose retained result represents three elapsed ticks under its existing bound.

The current labels are `Advance one tick`, `Bits stored` and `Carry out`; the instruction uses those exact names. The existing introduction already explains that a tick adds one, so the replacement does not repeat that mechanism or prescribe a fixed number of presses. The model-driven starting label supplies 13; no new fixed starting-value sentence is needed.

## Closing passes and verification boundary

Sentence pass: the first sentence gives a concrete action and visible stopping condition, the second identifies the output to inspect, and the third describes automatic behaviour. Each sentence is short and uses existing terms.

Idea pass: the learner encounters ordinary increments before the zero transition and can inspect its carry without advancing past it. The instruction names the binary pattern actually shown, rather than relying on a decimal readout that is not present in the completed result. The following pane remains responsible for explaining elapsed subtraction.

No source file was edited. Browser operation, arithmetic/native checks and independent learner/technical reviews remain with implementation. These facts and the drafting judgement do not establish novice learning effectiveness.

## Superseded instruction

The user subsequently requested compact +1 / −1 controls and decimal beneath the stored bits, without addition equations in the wrap pane. Current instructions and labels are drafted in `compact-copy.md` and synchronised with the named canonical runtime record. The three-tick path and matching subtraction remain as described above.
