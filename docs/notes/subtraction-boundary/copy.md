<!-- Copyright © 2026 Christopher Snow -->

# Carry boundary pane: separate copy draft

Drafted from `brief.md`, the existing subtraction bridge and lesson strings, and `docs/style.md`. This pass supplies copy only. The parent implements and independently verifies the rendered pane.

## Copy for integration

The four rows are separate calculations, with the second input, its inverse and carry in held constant. Their subtraction expressions, full sums, outgoing carries, retained bits and unsigned readings come from the checked model. The rows remain visible together.

```json
{
  "title": "Each subtraction, worked in binary",
  "setup": "Only `a` changes in these independent {width}-bit teaching views. With fixed `b = {b}`, inverted `b` is `{inverted}`. Each stack adds `a`, inverted `b` and `{carryIn}` for one subtraction. All readings are unsigned.",
  "inputA": "a",
  "invertedB": "Inverted b",
  "addOne": "Add {carryIn}",
  "carryOut": "Carry out",
  "keptBits": "Kept bits",
  "unsigned": "Unsigned",
  "reasonTitle": "Why carry out changes",
  "topColumn": "Look at the highest kept column, worth {topPlace}. Add its input bits and the carry arriving from the columns on its right. The add-one row supplies the initial carry at the lowest column.",
  "belowColumn": "For `{belowA} − {b}`, `{belowTopA} + {belowTopB} + {belowTopCarryIn} = {belowTopBinary}`. The total fits in the highest kept column, so carry out is `{belowTopCarryOut}`.",
  "equalColumn": "For `{equalA} − {b}`, `{equalTopA} + {equalTopB} + {equalTopCarryIn} = {equalTopBinary}` in binary. Keep the right digit, `{equalTopKept}`; the left digit, `{equalTopCarryOut}`, is carry out.",
  "takeaway": "For unsigned inputs:\n\n- **`a >= b` → carry out {equalTopCarryOut}:** no borrow needed.\n- **`a < b` → carry out {belowTopCarryOut}:** borrow needed.\n\nEquality gives carry out {equalTopCarryOut} even though the kept result is zero.\n\nThe real {realWidth}-bit `subs` updates carry flag C from its own carry out. Plain `sub` preserves C."
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

## Full-working follow-up, 26 November 2026

The reader reported calculating the examples by hand before the rule made sense, then approved four complete vertical workings. The current canonical block above replaces the earlier comparison-table copy; those earlier presentation notes are historical. A separate drafting pass supplied the working-first heading, independent teaching-view setup, three addend labels and post-working column explanation. Mathematical values come from the existing traces and their top-column records. Optional relation labels were omitted because the complete expressions and later rule provide the comparison. No result is a new executed instruction. The responsive implementation has one representation with two narrow-container columns or four wide-container columns, with unsigned decimals beneath the retained bits. The original8−3 and real-width contexts remain separate and unchanged.


## Explicit comparison follow-up, 26 November 2026

The reader found the local generalisation too implicit after the four-working redesign. A separate pass supplied two bold unsigned comparison rules with their model-derived carry values, explicit equality, and the real-width subs carry-flag qualification. The following32-bit pane already retained the rule; this correction restores its local emphasis without another pane or control. See emphasis-brief.md for the checked facts and verification scope.
