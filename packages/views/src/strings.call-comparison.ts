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
  tripOverrun: (signed: number, unsigned: number) =>
    `The int result, ${signed} km, can express that you travelled ${Math.abs(signed)} km beyond the plan. It fits the signed range, so this call has no signed overflow. The unsigned result, ${unsigned} km, does not express that overrun.`,
  unsignedWrap:
    "Unsigned subtraction below zero wraps into its range, as C defines. The large returned number carries no warning that it came from a wrap. In another calculation, the same unsigned value could be a valid distance.",
  noArithmeticError:
    "Neither sub nor ret in these listings reports an arithmetic error. This program returns the bits without checking whether the trip exceeded its plan.",
  readingTypes:
    "The compiler uses the C parameter types to apply the arithmetic rules. The register stores the result bits without a type tag. The return type determines how the caller reads these returned bits; it does not generally determine the type of the subtraction.",
  readingLink: "Signed and unsigned readings",
  resultGroup: "Returned bits and C values",
} as const;
