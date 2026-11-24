<!-- Copyright © 2026 Christopher Snow -->

# Carry boundary pane: separate copy draft

Drafted from `brief.md`, the existing subtraction bridge and lesson strings, and `docs/style.md`. This pass supplies copy only. The parent implements and independently verifies the rendered pane.

## Copy for integration

The three rows are separate calculations, with the second input, its inverse and carry in held constant. Their subtraction expressions, full sums, outgoing carries, retained bits and unsigned readings come from the checked model. The rows remain visible together.

```json
{
  "title": "When does carry out become 1?",
  "setup": "Only `a` changes in these independent four-bit views. Each uses `b = {b}`, inverted `b = {inverted}` and carry in `{carryIn}`. All readings are unsigned.",
  "calculation": "Subtract",
  "fullSum": "Full sum",
  "carryOut": "Carry out",
  "keptBits": "Four bits kept",
  "unsigned": "Unsigned",
  "less": "Below b",
  "equal": "Equal to b",
  "greater": "Above b",
  "takeaway": "Equality reaches the extra place, worth {range}: carry out is 1 even though the kept result is zero. The real 32-bit `subs` uses the same no-borrow boundary for C."
}
```

## Teaching and presentation checks

The approved heading asks a question answered by all three visible rows. Each row's relationship label describes its first input relative to the fixed second input `b`; its adjacent subtraction expression identifies both operands. The equality label does not depend on colour.

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
