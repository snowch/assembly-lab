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
  programHeaderTitle: "Reading the program header",
  programHeaderIntro:
    "The assembler turns assembly text into machine instructions. Directives give the assembler directions; labels name positions in the program. Neither runs as an instruction.",
  programHeaderLines: [
    {
      source: ".text",
      explanation:
        "Selects the code section, where the assembler places the instructions that follow.",
    },
    {
      source: ".global reference_example",
      explanation:
        "Makes the name reference_example available to other assembled files when the linker joins them. .globl is another spelling of .global.",
    },
    {
      source: "reference_example:",
      explanation:
        "Defines a label at this position. Here it names the first instruction's address. reference_example is a name chosen for this example, not a reserved command.",
    },
  ],
  programHeaderEntry:
    "The reference runner starts this example at reference_example. .global alone does not choose where execution starts or call the code.",
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
