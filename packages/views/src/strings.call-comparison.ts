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
  readingGroup: "How the returned bits give these values",
  readingIntro: (bits: string, lower: number) =>
    `Read ${bits} using the bit weights you used earlier. The lower 31 bits contribute ${lower} in both readings.`,
  readingTop: (top: number, weight: number) =>
    `The top bit is ${top}. Its weight is −${weight} for a signed reading and +${weight} for an unsigned reading.`,
  readingEquation: (type: string, lower: number, contribution: number, result: number) =>
    `${type}: ${lower} ${contribution < 0 ? "−" : "+"} ${Math.abs(contribution)} = ${result}`,
  unsignedWrap:
    "For this unsigned subtraction, a mathematical result below zero wraps into the unsigned range. That is why the unsigned call can return a large positive value.",
  readingTypes:
    "The compiler knows the C parameter and return types. The register stores the result bits without a type tag. Each function’s return type tells you which reading gives its C return value.",
  readingLink: "Review the bit weights in Signed and unsigned readings.",
  resultGroup: "Returned bits and C values",
} as const;
