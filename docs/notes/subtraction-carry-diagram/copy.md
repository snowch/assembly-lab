# Subtraction carry diagram: independent copy draft

Copyright © 2026 Christopher Snow

Separate drafting pass from `brief.md`, the existing lesson/copy and `docs/style.md`. Only this engineering note and the external draft JSON are written by this pass. The checked inputs and all displayed quantities come from the model; no production component or negation assessment is changed.

## Copy for integration

The `diagram` object supplies the worked four-bit view. `lessonCarry` replaces the unexplained large-number paragraph with a short reminder and directs the learner to the existing real-width adder. Instruction captions remain assembly-only: no invented C association.

```json
{
  "diagram": {
    "title": "See the width boundary",
    "scope": "Four-bit view of the same {a} minus {b} calculation. The Arm instruction uses 32 bits.",
    "inversionTitle": "The original and inverted input",
    "originalB": "Original b",
    "invertedB": "Inverted b",
    "allOnes": "All ones",
    "inversionWhy": "Each original bit and its inverted bit add to 1. Together they make {maximum}, the largest four-bit value. So inverting b gives {maximum} − b.",
    "additionTitle": "Add the first input and carry in",
    "inputA": "First input a",
    "carryIn": "Carry in",
    "fullSum": "Full sum",
    "carryOut": "Carry out of four bits",
    "storedBits": "Four bits kept",
    "unsigned": "Unsigned reading",
    "bits": "Bits",
    "decimal": "Unsigned decimal",
    "sumWhy": "The carry in adds 1 to {maximum} − {b}. Because {maximum} + 1 is {range}, the full sum is {a} + {range} − {b}.",
    "carryPlace": "Place value: {range}",
    "storedReading": "Unsigned reading: {result}",
    "fullSumReading": "Full sum: {sum} = {carryValue} from carry + {result} kept",
    "wideTitle": "Return to the original example at 32 bits",
    "wideWhy": "The original calculation is {a} − {b}. At 32 bits, all ones is {wideMaximum}. Adding the carry in of 1 gives {wideRange}, the value of the first place beyond 32 bits. The full sum is {a} + {wideRange} − {b}; keep only the low 32 bits.",
    "rule": "`subs` sets the carry flag C from the real 32-bit carry out. If `a` is at least `b`, the sum reaches that extra place: C = 1, no unsigned borrow. Otherwise C = 0: borrow needed."
  },
  "lessonCarry": {
    "intro": "We’ve already seen how subtraction can be calculated as addition. First locate the carry in and carry out in the four-bit view. Then follow the same inputs at 32 bits.",
    "caption": "The addition behind subs w0, w0, w1, with w0 = 8 and w1 = 3 before execution.",
    "guidance": "Find the carry out and stored result in the 32-bit calculation. How do they match the unsigned comparison 8 >= 3?"
  }
}
```

## Teaching route and qualifications

1. The reminder preserves the connection to prior subtraction-as-addition teaching. The new diagram explains this width boundary rather than repeating the whole earlier lesson.
2. The original and inverted second input appear as aligned bit rows. Their unsigned sum is all ones, so the inverted input is the maximum minus the original input.
3. The second panel keeps the first input and carry-in visible. Its explanation explicitly adds the carry-in one to maximum minus the second input. Maximum plus one is the next position's value, explaining the unsigned-range constant in the full sum.
4. Carry out and retained bits are framed separately. The outside column's **place value** remains the range even when its carry bit is zero. The labelled full-sum equation uses the separate model-derived **carry contribution**, which is carry out multiplied by that place value. It therefore relates the two displayed outputs without confusing place value with a non-zero contribution.
5. The bridge uses the same operand values at 32 bits. It names the all-ones maximum, explicitly adds the carry-in one to obtain the next place, substitutes that range into the full-sum expression and says that only the low 32 bits are kept.
6. The rule identifies C as the carry from the real 32-bit calculation. The four-bit view is not a new Arm processor or an actual four-bit architectural flag. Its carry location and the real register-width carry are distinguished locally.

The existing operand comparison and real adder remain useful after the diagram: learners identify carry out and the retained result for the same inputs. No fresh quiz, subtraction controls or saved state are introduced. Existing gates must still withhold this explanation when their adder is locked. No later negation answers appear here.

## Parent-requested refinements

`fullSumReading` explicitly separates the contribution from carry and the retained reading in a labelled equation. `{carryValue}` must be computed from carry out times the range; it must not reuse `{range}` when carry out is zero. `wideWhy` explicitly shows the same full-sum expression at the real width and states the low-32-bit retention rule.

## Closing passes and evidence

Sentence pass: short labels identify input, inverse, all-ones maximum, carry in, carry out, full sum and retained bits. Decimal labels say unsigned. The two carry locations are not described as the same stored bit. The copy distinguishes the largest value from the weight of the next position.

Idea pass: the bit pairs explain maximum minus b; the carry-in explains maximum plus one; the real-width bridge explains the large constants before the existing adder uses them. The content stays focused on that missing join, without another counter story, negation example or full subtraction lesson.

This pass relies on the supplied model-checked facts and does not claim a separate browser or native execution check. The parent's model/native tests and independent learner/technical reviews remain required. Tests and agent review establish content/functional evidence, not novice learning effectiveness.
