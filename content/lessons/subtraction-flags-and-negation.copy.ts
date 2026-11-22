// Copyright © 2026 Christopher Snow

// Separate drafting record: docs/notes/subtraction-flags-focus/copy.md.
export const SUBTRACTION_FOCUS_COPY = {
  title: "Subtraction flags and negation",
  objectives: [
    "Explain why C after subs means no unsigned borrow.",
    "Predict retained 32-bit negation results and C/V.",
    "Distinguish flags updated by negs from flags preserved by neg.",
  ],
  recapTitle: "Same result, different flag effects",
  recap:
    "`subs` keeps the same result bits as `sub` and also updates N, Z, C and V. Plain `sub` preserves the existing flags.\n\nSubtraction needs an unsigned borrow when the first input is smaller than the second. Why does C become 1 when no borrow is needed?",
  carryTitle: "Why carry means no borrow",
  carry:
    "For 32-bit unsigned inputs `a` and `b`, invert every bit of `b`. Add that value to `a`, with a carry in of 1.\n\nThe inverted input is `4294967295 - b`, so the full sum is `a + 4294967296 - b`. The result keeps the low 32 bits. A carry leaves the top exactly when the full sum is at least 4294967296.\n\n- If `a` is at least `b`, the sum reaches that limit. C is 1, and no unsigned borrow is needed.\n- If `a` is less than `b`, the sum stays below that limit. C is 0, and an unsigned borrow is needed.",
  carryCaption: "The addition behind subs w0, w0, w1, with w0 = 8 and w1 = 3 before execution.",
  carryGuidance:
    "The calculation starts with 8 and 3. Find the carry out and stored result. How do they match the unsigned comparison `8 >= 3`?",
  negationTitle: "Negation is zero minus a value",
  negation:
    "`neg w0, w0` calculates `0 - w0` and keeps the low 32 result bits. It preserves the existing flags. `negs w0, w0` gives the same result and also updates N, Z, C and V.\n\nAfter `negs`, C is 1 only when the input is zero: only then does `0 - input` need no unsigned borrow. N reads the stored result’s top bit. Z is 1 when all stored result bits are zero. V is 1 when the exact signed negation does not fit.\n\nThe prepared input is 5. Press **Next** once to run `negs`, then inspect `w0` and the four flags. The stored result has signed reading −5; its unsigned reading is 4294967291. The signed result fits, even though the unsigned subtraction needs a borrow.",
  negationCaption:
    "negs w0, w0 starts with w0 = 5. After one step, inspect the result and N, Z, C and V.",
  minimum:
    "For `negs w0, w0`, the prepared input is `0x80000000`, the smallest signed 32-bit value, −2147483648. Choose the result bits you expect, then check your prediction.",
  exerciseTitle: "Negation results and flags",
  exerciseTask:
    "Each group starts an independent run of `negs w0, w0` from its displayed input. Enter the retained `w0` result as an unsigned decimal number. Choose 0 or 1 for C and V.",
  exerciseIntro:
    "Only the smallest signed 32-bit input overflows when negated. Apply the same instruction to two fresh input patterns. Treat each group as an independent run.",
  exerciseCaption: "Supply the result and two flags for each independent negs run.",
  zeroGroup: "Zero input: w0 = 0",
  nearGroup: "Input next to the signed minimum: w0 = 0x80000001 (signed reading −2147483647)",
  resultField: "w0 after negs (unsigned decimal)",
  cField: "Carry flag C",
  vField: "Signed-overflow flag V",
  feedback: {
    result: "`negs` keeps the low 32 bits of zero minus the input. Read those bits as unsigned.",
    c: "For `negs`, C is 1 only when the input is zero. Otherwise the unsigned subtraction needs a borrow.",
    v: "V reports signed overflow, not an unsigned borrow. Only the smallest signed 32-bit input overflows when negated.",
  },
  hints: [
    "`negs` calculates zero minus the input and keeps the low 32 result bits. Work out the result before its flags.",
    "For C, read the input as unsigned. C is 1 only when zero is at least that input.",
    "V is 1 only for the signed-minimum input you traced. Compare each supplied input with that pattern.",
    "`0x80000001` is one above the signed minimum. Its signed negation fits the positive range. Zero stays zero.",
    "For input 0: result 0, C 1, V 0. For input 0x80000001: result 2147483647, C 0, V 0.",
  ],
  reflectionTitle: "Which instruction wrote V?",
  reflection:
    "For `negs`, C is 1 only for zero input; V is 1 only for the signed minimum.\n\nPlain `neg` preserves the flags: their bits keep their previous values. They still describe the latest instruction that updated them.\n\nBefore `neg w0, w0`, `w0` is 3 and V is 1. The instruction stores the pattern for −3, which fits the signed range. What is V afterwards? Explain why.",
  reflectionSummary: "Compare your reasoning",
  reflectionAnswer:
    "V remains 1. Plain `neg` does not update V; its value is retained from the earlier instruction that wrote it. Use `negs` if you want new flags for this negation.",
  originality: {
    textbookExample: "A standalone negate-instruction example followed by a table of status flags.",
    howThisDiffers:
      "Derives no-borrow from the actual 32-bit carry record, reuses the course’s gated signed-limit prediction, and tests zero and adjacent-boundary inputs independently. Closes by tracing preserved V through plain negation.",
  },
} as const;
