// Copyright © 2026 Christopher Snow

// Separate drafting pass from checked model facts; canonical record: docs/notes/four-bit-arithmetic/architecture-copy.md
// Literal {name} placeholders are replaced with values from the displayed model state.
export const ADD_ARCHITECTURE_STRINGS = {
  shared: {
    bit: "Bit {bit}",
    selectedColumn: "Inspect bit",
    inputA: "A",
    inputB: "B",
    adderB: "B at the adder",
    carryIn: "Carry in",
    carryOut: "Carry out",
    kept: "Kept bit",
    pattern: "Pattern",
    unsignedResult: "Unsigned result",
    equation: "{a} + {b} + {carryIn} = {total}, written {binaryTotal} in binary.",
    firstXor: "First XOR",
    operandAnd: "Operand AND",
    carryAnd: "Carry AND",
    resultXor: "Result XOR",
    carryOr: "Carry OR",
    gateXor: "{left} XOR {right} = {result}",
    gateAnd: "{left} AND {right} = {result}",
    gateOr: "{left} OR {right} = {result}",
    initialCarry: "Initial carry in",
    carryFrom: "Carry in from bit {previousBit}",
    carryTo: "Carry out to bit {nextBit}",
    carryBeyondWord: "Carry out beyond the {width}-bit word",
  },
  assembly: {
    title: "An add instruction uses the ALU",
    intro:
      "An arithmetic logic unit (ALU) performs arithmetic and logic operations. This instruction selects addition.\n\n`add w2, w0, w1` reads the 32-bit values in w0 and w1, adds them and writes the low 32 result bits to w2. Decimal values here use the unsigned reading.\n\nRun the instruction, then select a column to inspect its inputs, result bit and carry. Selecting a column changes the view without executing another instruction.",
    inputHeading: "Starting inputs",
    inputGuide:
      "Use decimal or 0x hexadecimal without commas. Each input must be a whole number from {min} to {max}.",
    rangeError:
      "Enter a whole number from {min} to {max}, using decimal or 0x hexadecimal without commas.",
    useInputs: "Use inputs",
    instruction: "Instruction",
    runAdd: "Run ADD",
    back: "Back",
    reset: "Reset",
    registersBefore: "Registers before the instruction",
    registersNow: "Registers after ADD",
    ready: "Before ADD. Run the instruction to see its result.",
    ran: "{instruction} wrote {value} to {destination}. The input registers keep their values.",
    detailLocked: "Run ADD to inspect a column of its calculation.",
    flowRead: "Read input registers",
    flowAlu: "ALU: addition",
    flowWrite: "Destination register",
    lowBitsLabel: "Low four bits · bits 3 to 0",
    readUnchanged: "Read; value unchanged",
    writePending: "Not yet written",
    written: "Written by ADD",
    detailHeading: "Inside bit {bit} of the addition",
    detailNote:
      "The detail shows bits 3 to 0 of the same 32-bit addition. Carries can continue into positions beyond it.",
    flagsNote:
      "Some instructions record facts in condition flags. Plain `add` leaves those flags unchanged; its internal carries still take part in the sum.",
    scope:
      "This view stops after the shown ADD. Its connections describe the instruction’s effect, without modelling electrical timing or physical processor layout.",
    resetNote: "Back shows the state before ADD. Reset restores the starting inputs.",
    lessonLinkLabel: "Bit Lab, lesson 3: Follow a carry through an adder",
    lessonLinkHref: "https://snowch.github.io/bit-lab/#/lesson/adder",
  },
} as const;
