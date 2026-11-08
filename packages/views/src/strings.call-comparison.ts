// Copyright © 2026 Christopher Snow

// Drafted separately from the interaction implementation from its checked-facts brief.
export const CALL_COMPARISON_STRINGS = {
  sourceHeading: "Inspect the functions",
  predictionHeading: "Predict the instructions",
  callHeading: "Run and compare",
  startingInputs: (argsText: string) =>
    `Starting arguments for each independent call: ${argsText}.`,
  callBoth: "Run comparison",
  resetCalls: "Reset comparison",
  sharedReturnedBits: "Returned w0 bits shared by both calls",
  returnedBits: (functionName: string) => `Final w0 bits when ${functionName} returns`,
  sameBits: "Both calls returned the same bits in w0.",
  differentBits: "The calls returned different bits in w0.",
  subtraction: {
    heading: "Subtraction in bits",
    oppositeHeading: "Construct the opposite pattern",
    sumHeading: "Add the opposite pattern",
    calculationNote: (width: number) =>
      `These rows break down a single \`sub\` instruction with ${width} places. Keep the lowest ${width} bits after each addition.`,
    second: (value: string) => `Second input: ${value}`,
    inverted: "Invert every bit",
    plusOne: (value: string) => `Add ${value}`,
    opposite: "Opposite pattern",
    first: (value: string) => `First input: ${value}`,
    result: "Result",
    widthNote: (highBit: number, lowBit: number) =>
      `Bits run from ${highBit} on the left to ${lowBit} on the right.`,
    reminder: "For the smaller example, revisit",
    link: "Arithmetic with four bits",
  },
  readingsHeading: "C return values",
  weightsHeading: "Why the same bits mean different numbers",
  sameWeightsHeading: "How the bits give the returned values",
  contributionHeading: "Contributions to each C value",
  sumsHeading: "Add the contributions",
  returnedReferenceCaption: "The same returned w0 bits, shown again.",
  returnedReferenceTop: "Bit 31 (highest bit)",
  returnedReferenceLower: "Bits 30–0 (lower 31 bits)",
  topBitState: (top: number) =>
    top === 0
      ? "Bit 31 is clear, so its contribution is zero in both readings."
      : "Bit 31 is set, so its contribution equals its weight in each reading.",
  signedType: "int (signed)",
  unsignedType: "unsigned int",
  distanceValue: (value: string) => `${value} km`,
  signedMeaning: (overrun: string) => `${overrun} km beyond the plan.`,
  signedRange: "This negative result fits int.",
  unsignedMeaning:
    "The unsigned subtraction wraps: it keeps the low result bits and reads them as an unsigned value. C defines this behaviour. This value does not express the trip overrun. It can be valid in another calculation.",
  lowerBits: "Lower 31 bits",
  topBitContribution: "Highest bit (bit 31)",
  total: "Returned value",
  bitWeights: "The lower 31 bits have the same positive weights in both readings.",
  topWeightDiffers:
    "Bit 31 has a negative weight for int (signed) and a positive weight for unsigned int.",
  readingGroup: "How the returned bits give these values",
  noArithmeticError:
    "These functions return the bits without checking for a trip overrun. There is no automatic overrun warning.",
  readingTypes:
    "The register has no type tag. Here, C parameter types set the subtraction rules; the return type sets the returned value’s reading.",
  readingLink: "Signed and unsigned readings",
  resultGroup: "Returned bits and C values",
} as const;
