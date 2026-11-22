# Subtraction flags and negation: independent copy draft

Copyright © 2026 Christopher Snow

Drafted separately from the checked facts in `brief.md`, the current published source and `docs/style.md`. This is new canonical copy; the old elapsed-counter provenance is unchanged. Source numbers have been checked by the parent model/native pass; this drafting pass does not claim a separate execution or novice study.

The six sections are recap, carry derivation, ordinary negation, the existing minimum prediction/trace, a fresh grouped exercise, and flag-preservation reflection. Only one carry diagram and one ordinary-negation stepper are proposed. Preserve the existing minimum prediction/stepper IDs and its question, options and gated explanation. Those existing values remain inherited from their current source; the new `minimum` string below changes only the visible introduction.

The exercise uses full-width unsigned-result fields and C/V binary choices in a compact row. Its group labels show signed readings of the supplied patterns, not expected results. Expected values appear only in the gated final hint, model-derived verdicts and the challenge reference; never render reference answers above submission. The per-field feedback strings fit the existing model grader without new grader/UI logic.

```json
{
  "title": "Subtraction flags and negation",
  "objectives": [
    "Explain why C after subs means no unsigned borrow.",
    "Predict retained 32-bit negation results and C/V.",
    "Distinguish flags updated by negs from flags preserved by neg."
  ],
  "recapTitle": "Same result, different flag effects",
  "recap": "`subs` keeps the same result bits as `sub` and also updates N, Z, C and V. Plain `sub` preserves the existing flags.\n\nSubtraction needs an unsigned borrow when the first input is smaller than the second. Why does C become 1 when no borrow is needed?",
  "carryTitle": "Why carry means no borrow",
  "carry": "For 32-bit unsigned inputs `a` and `b`, invert every bit of `b`. Add that value to `a`, with a carry in of 1.\n\nThe inverted input is `4294967295 - b`, so the full sum is `a + 4294967296 - b`. The result keeps the low 32 bits. A carry leaves the top exactly when the full sum is at least 4294967296.\n\n- If `a` is at least `b`, the sum reaches that limit. C is 1, and no unsigned borrow is needed.\n- If `a` is less than `b`, the sum stays below that limit. C is 0, and an unsigned borrow is needed.",
  "carryCaption": "The addition behind subs w0, w0, w1, with w0 = 8 and w1 = 3 before execution.",
  "carryGuidance": "The calculation starts with 8 and 3. Find the carry out and stored result. How do they match the unsigned comparison `8 >= 3`?",
  "negationTitle": "Negation is zero minus a value",
  "negation": "`neg w0, w0` calculates `0 - w0` and keeps the low 32 result bits. It preserves the existing flags. `negs w0, w0` gives the same result and also updates N, Z, C and V.\n\nAfter `negs`, C is 1 only when the input is zero: only then does `0 - input` need no unsigned borrow. N reads the stored result’s top bit. Z is 1 when all stored result bits are zero. V is 1 when the exact signed negation does not fit.\n\nThe prepared input is 5. Press **Next** once to run `negs`, then inspect `w0` and the four flags. The stored result has signed reading −5; its unsigned reading is 4294967291. The signed result fits, even though the unsigned subtraction needs a borrow.",
  "negationCaption": "negs w0, w0 starts with w0 = 5. After one step, inspect the result and N, Z, C and V.",
  "minimum": "For `negs w0, w0`, the prepared input is `0x80000000`, the smallest signed 32-bit value, −2147483648. Choose the result bits you expect, then check your prediction.",
  "exerciseTitle": "Negation results and flags",
  "exerciseTask": "Each group starts an independent run of `negs w0, w0` from its displayed input. Enter the retained `w0` result as an unsigned decimal number. Choose 0 or 1 for C and V.",
  "exerciseIntro": "Only the smallest signed 32-bit input overflows when negated. Apply the same instruction to two fresh input patterns. Treat each group as an independent run.",
  "exerciseCaption": "Supply the result and two flags for each independent negs run.",
  "zeroGroup": "Zero input: w0 = 0",
  "nearGroup": "Input next to the signed minimum: w0 = 0x80000001 (signed reading −2147483647)",
  "resultField": "w0 after negs (unsigned decimal)",
  "cField": "Carry flag C",
  "vField": "Signed-overflow flag V",
  "feedback": {
    "result": "`negs` keeps the low 32 bits of zero minus the input. Read those bits as unsigned.",
    "c": "For `negs`, C is 1 only when the input is zero. Otherwise the unsigned subtraction needs a borrow.",
    "v": "V reports signed overflow, not an unsigned borrow. Only the smallest signed 32-bit input overflows when negated."
  },
  "hints": [
    "`negs` calculates zero minus the input and keeps the low 32 result bits. Work out the result before its flags.",
    "For C, read the input as unsigned. C is 1 only when zero is at least that input.",
    "V is 1 only for the signed-minimum input you traced. Compare each supplied input with that pattern.",
    "`0x80000001` is one above the signed minimum. Its signed negation fits the positive range. Zero stays zero.",
    "For input 0: result 0, C 1, V 0. For input 0x80000001: result 2147483647, C 0, V 0."
  ],
  "reflectionTitle": "Which instruction wrote V?",
  "reflection": "For `negs`, C is 1 only for zero input; V is 1 only for the signed minimum.\n\nPlain `neg` preserves the flags: their bits keep their previous values. They still describe the latest instruction that updated them.\n\nBefore `neg w0, w0`, `w0` is 3 and V is 1. The instruction stores the pattern for −3, which fits the signed range. What is V afterwards? Explain why.",
  "reflectionSummary": "Compare your reasoning",
  "reflectionAnswer": "V remains 1. Plain `neg` does not update V; its value is retained from the earlier instruction that wrote it. Use `negs` if you want new flags for this negation.",
  "originality": {
    "textbookExample": "A standalone negate-instruction example followed by a table of status flags.",
    "howThisDiffers": "Derives no-borrow from the actual 32-bit carry record, reuses the course’s gated signed-limit prediction, and tests zero and adjacent-boundary inputs independently. Closes by tracing preserved V through plain negation."
  }
}
```

## Implementation and review cautions

- `carry.adderInstruction` assumes the adder opens with the completed arithmetic, as the existing component supports. If it opens before any column is revealed, replace “completed” with a direct instruction using its actual reveal controls. Revealing columns is one subtraction calculation, not several executed instructions.
- Ordinary guidance names **Next** once and asks about the state immediately after `negs`. Do not make the learner understand or write an assembly function to complete this investigation.
- The signed reading of the ordinary model result belongs beside the unsigned numerical display. It explains why the large unsigned reading represents the small negative result without requiring another conversion activity.
- The existing minimum result remains behind the unchanged prediction gate. Its unique-overflow rule appears in the exercise introduction, after the worked boundary and before the fresh questions.
- Keep N/Z visible and explained, but do not add redundant N/Z answer fields. The new zero/near-minimum exercise already distinguishes unsigned borrow from signed overflow.
- Keep the existing minimum explanation unchanged as requested, including its explicit “sets V to 1” wording. It is unambiguous because the target value is named; no new rewrite is required.
- The closing question is prose with an answer disclosure, not another interactive. It uses the checked prior-V1, input3, plain-neg case. It tests flag provenance even though the new signed result fits.
- Avoid another general counter/modulo/full-turn section. Those ideas already have their own lesson, and neither fresh exercise input is an elapsed-time problem.

All learner numbers and reference results must remain pinned by the model and GNU/QEMU corpus checks. Independent learner/technical review and built phone/desktop light/dark verification remain required. This draft does not establish learning effectiveness.

Editorial checks: the minimum introduction explicitly names the instruction, and “signed negation” replaces the ambiguous “signed negative”. No underlying fact or example changed.
