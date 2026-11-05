// Copyright © 2026 Christopher Snow

// Drafted separately from the interaction implementation from its checked-facts brief.
export const CALL_COMPARISON_STRINGS = {
  startingInputs: (argsText: string) =>
    `Starting arguments for each independent call: ${argsText}.`,
  callBoth: "Call both functions",
  resetCalls: "Reset calls",
  returnedBits: (functionName: string) => `Final w0 bits when ${functionName} returns`,
  sameBits: "Both calls returned the same bits in w0.",
  differentBits: "The calls returned different bits in w0.",
  returnValue: (type: string, value: string) => `${type} return value: ${value}`,
  signedType: "int (signed)",
  unsignedType: "unsigned int",
  resultGroup: "Returned bits and C values",
} as const;
