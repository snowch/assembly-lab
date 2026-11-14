// Copyright © 2026 Christopher Snow

// Separate drafting pass: carry_copy; example values are supplied by flagsModel.
export const CARRY_PROOF_COPY = {
  title: "Why unequal carries mean signed overflow",
  label: "Why the carry rule works",
  lead: "The sign bit is the leftmost retained bit, bit 3 in these four-bit examples. Its column adds both input sign bits and the incoming carry.",
  rule: "V = 1 when the carry into the sign bit differs from the carry out.",
  summary:
    "Signed overflow can make a positive sum appear negative in the stored result, or a negative sum appear non-negative.",
  tabsLabel: "Choose a direction of signed overflow",
  positiveTab: "Too positive",
  negativeTab: "Too negative",
  positiveTitle: "Two non-negative inputs",
  positiveWhy:
    "Both inputs are non-negative, so both sign bits are 0. The incoming carry makes the stored sign bit 1, with no carry out. Two non-negative numbers cannot have a negative sum. The stored result has the wrong sign because the exact sum does not fit.",
  negativeTitle: "Two negative inputs",
  negativeWhy:
    "Both inputs are negative, so both sign bits are 1. With no incoming carry, their column produces a stored sign bit of 0 and a carry out of 1. Two negative numbers cannot have a non-negative sum. Again, the stored result has the wrong sign because the exact sum does not fit.",
  exactSum: "Exact signed sum",
  firstInput: "First input",
  secondInput: "Second input",
  stored: "Stored result",
  incoming: "Carry in",
  outgoing: "Carry out",
  column: "Sign-bit column, in binary",
  kept: "Stored sign bit",
  retained: "Stored result: {bits}, read as {signed}.",
  verdict: "Carry in {carryIn} differs from carry out {carryOut}: V = {v}.",
  matchingTitle: "Why matching carries mean the sum fits",
  matching:
    "When the input sign bits match, matching carries preserve that sign and the signed sum fits. When the inputs have opposite signs, their exact sum lies between them, so it fits. Their carries into and out of the sign bit match too.",
  opposite:
    "With opposite input signs, the sign-bit column adds 1 plus the incoming carry. Its outgoing carry therefore equals its incoming carry.",
  checkTitle: "Check the reason on a fresh addition",
  checkPrompt:
    "Compare the two carries. What is V? Explain what that tells you about the signed sum.",
  reveal: "Check your reasoning",
  feedback:
    "The carries match, so V = {v}. A carry out alone does not mean signed overflow. The exact signed sum, {signedSum}, fits the four-bit signed range.",
  next: "Next: why checking the right flag matters",
  rangeNext: "Next: why the carry rule works",
} as const;
