// Copyright © 2026 Christopher Snow

/** Labels for independent, computed examples in the instruction reference. */
export const REFERENCE_EXAMPLE_STRINGS = {
  before: "Before",
  instruction: "Instruction",
  after: "After this instruction",
  effect: "Effect",
  example: "Worked example",
  examples: "Worked examples",
  moreExamples: "More worked examples",
  completeExample: "Complete example program",
  completeExampleNote:
    "The program includes the code that prepares and finishes the example. Its highlighted instruction is the one shown above. Your editor stays unchanged.",
  branchTaken: "Branch taken",
  branchNotTaken: "Branch not taken",
  signed: "Signed decimal",
  unsigned: "Unsigned decimal",
  hex: "Hexadecimal",
  memoryLabel: (symbol: string, bytes: number) =>
    `Contents at ${symbol} (${bytes} ${bytes === 1 ? "byte" : "bytes"})`,
  addressLabel: (symbol: string) => `Address of ${symbol}`,
  advancedForms: "Advanced forms",
  advancedRules: "Additional operand rules",
  commonMistakes: "Common mistakes",
  rejected: "Rejected",
  valid: "Accepted",
  preparedNote:
    "Each example starts from its own prepared values. Your code in the editor stays unchanged.",
  contextTitle: "Help for the assembler error",
  registerCapacityNote: (mnemonic: string) =>
    `An immediate is a number written directly in the instruction. ${mnemonic.toUpperCase()} can encode only certain immediate values, even when a value fits in a register.`,
  matchingRule: "Relevant rule",
  ruleForError: (message: string) => `The assembler reported: ${message}`,
} as const;
