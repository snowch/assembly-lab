<!-- Copyright © 2026 Christopher Snow -->

# Carry boundary pane: separate copy draft

Drafted from `brief.md`, the existing subtraction bridge and lesson strings, and `docs/style.md`. This pass supplies copy only. The parent implements and independently verifies the rendered pane.

## Copy for integration

The four rows are separate calculations, with the second input, its inverse and carry in held constant. Their subtraction expressions, full sums, outgoing carries, retained bits and unsigned readings come from the checked model. The rows remain visible together.

```json
{
  "title": "When does carry out become 1?",
  "setup": "Only `a` changes in these independent four-bit views. With `b = {b}`, inverted `b` is `{inverted}` and carry in is `{carryIn}`. The adder calculates `a + {inverted} + {carryIn}`. All readings are unsigned.",
  "calculation": "Subtract",
  "fullSum": "Adder sum",
  "carryOut": "Carry out",
  "carryPlace": "{range}’s place",
  "keptBits": "Four bits kept",
  "unsigned": "Unsigned",
  "less": "Below b",
  "equal": "Equal to b",
  "greater": "Above b",
  "takeaway": "Equality already needs that extra place, even though the kept result is zero. The real 32-bit `subs` uses the same no-borrow boundary for C.",
  "increase": "+{increase} in adder sum",
  "placeValues": "Place values",
  "visualCaption": "At {maximum}, all four kept digits are 1: no higher sum fits there. The next sum needs the outside place, worth {range}, giving carry out 1 and four kept zeros."
}
```

## Teaching and presentation checks

The approved heading asks a question answered by all four visible rows. Each row's relationship label describes its first input relative to the fixed second input `b`; its adjacent subtraction expression identifies both operands. The equality label does not depend on colour.

The setup identifies independent calculations, the four-bit teaching width and unsigned readings. Its parameters must come from the model. It preserves the existing worked example before this pane and the unchanged real 32-bit calculation after it.

The takeaway names the equality case directly. Reaching the extra place is enough to produce carry out, although the retained bits read as zero. The local architecture qualification identifies the real 32-bit instruction and connects the comparison boundary to C. It does not call the four-bit carry an architectural Arm flag. The following existing real-width rule continues to state both C outcomes.

Keep carry out in the dashed outside frame and the four retained bits in the solid frame. Show each unsigned decimal reading beneath its bits. This copy introduces no controls, predictions, storage or disclosures. No later assessment answers appear here.

Sentence pass: short labels, fixed-input preparation and explicit unsigned readings. Idea pass: below, equal and above appear together; equality supplies the missing boundary case without repeating inversion or another subtraction lesson.

This drafting pass relies on the brief's checked model facts. It does not claim browser, native execution or novice learning-effectiveness evidence. Final layout checks and independent learner/technical reviews belong to the integrated build.

## Return to the original worked example

The inserted comparison changes the second input to eight. The following real-width pane returns to the original subtraction, so its heading and first sentence must identify that return explicitly. These replacement strings are integrated in the original bridge canonical record.

```json
{
  "wideTitle": "Return to the original example at 32 bits",
  "wideWhy": "The original calculation is {a} − {b}. At 32 bits, all ones is {wideMaximum}. Adding the carry in of 1 gives {wideRange}, the value of the first place beyond 32 bits. The full sum is {a} + {wideRange} − {b}; keep only the low 32 bits."
}
```

## Follow-up mechanism draft, 25 November 2026

The reader requested a second below-boundary case and an explanation of why carry appears. A separate drafting pass supplied the integrated setup, Adder sum label, maximum/next-place mechanism, carry place-value label and shorter takeaway. The two below-boundary rows keep different patterns. Essential arithmetic and width guidance stay visible before the grid; the outgoing bit’s place value sits under its column heading. Model-derived parameters supply every displayed example value. This is copy provenance, not browser or learning-effectiveness evidence.

## Follow-up visual reason

The reader asked to see the reason in the diagram. A separate copy pass supplied a shared place-value label, a connector naming the increase in independent adder sums, and a causal caption about the four kept ones at the maximum. The same four computed rows now align each digit with its weight. The outside16-place remains separate from the kept8/4/2/1 places. This replaces the prose-only mechanism paragraph; it does not add a second worked example, another instruction or a control.
