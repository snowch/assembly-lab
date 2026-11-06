// Copyright © 2026 Christopher Snow

// Drafted separately from the interaction implementation from its checked-facts brief.
export const CALL_COMPARISON_STRINGS = {
  sourceHeading: "Inspect the functions",
  predictionHeading: "Predict the instructions",
  callHeading: "Call and compare",
  startingInputs: (argsText: string) =>
    `Starting arguments for each independent call: ${argsText}.`,
  callBoth: "Call both functions",
  resetCalls: "Reset calls",
  sharedReturnedBits: "Final w0 bits from both calls",
  returnedBits: (functionName: string) => `Final w0 bits when ${functionName} returns`,
  sameBits: "Both calls returned the same bits in w0.",
  differentBits: "The calls returned different bits in w0.",
  signedType: "int (signed)",
  unsignedType: "unsigned int",
  distanceValue: (value: string) => `${value} km`,
  signedMeaning: (overrun: string) => `${overrun} km beyond the plan.`,
  signedRange: "This result fits int, so this call has no signed overflow.",
  unsignedMeaning:
    "C defines this wrap. This value does not express the trip overrun. It can be valid in another calculation.",
  lowerBits: "Lower 31 bits",
  topBitValue: "Top bit",
  topBitWeight: "Top-bit weight",
  topBitContribution: "Top-bit contribution",
  total: "Returned value",
  bitWeights: "Add the lower 31 bits’ contribution to the top bit’s contribution.",
  topWeightDiffers: "Only the top-bit weight changes sign.",
  readingGroup: "How the returned bits give these values",
  noArithmeticError:
    "These functions return the bits without checking for a trip overrun. There is no automatic overrun warning.",
  readingTypes:
    "The register has no type tag. Here, C parameter types set the subtraction rules; the return type sets the returned value’s reading.",
  readingLink: "Signed and unsigned readings",
  resultGroup: "Returned bits and C values",
} as const;
