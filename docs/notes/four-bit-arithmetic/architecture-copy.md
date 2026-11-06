# ADD architecture: canonical learner copy

Adapted in a separate drafting pass from the approved architecture mock and its independent learner/technical review. Preview labels, themes and tabs are omitted. The live lesson is the existing **Arithmetic with four bits**, after its subtraction practice. No new lesson or assessment is added.

The section title, prose, caption and transition are recorded in [draft.md](draft.md) and `FOUR_BIT_PROSE.architecture`. Its objective connects the existing four-bit calculation to one real 32-bit ADD. The UI strings below retain the approved mock wording and qualifications. Literal `{name}` templates receive displayed model values. `carryBeyondWord` takes `{width}` so it never silently describes a cropped four-bit view as the whole Arm register.

## Exact UI source

```ts
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
```

## Placement and gates

Keep the existing subtraction practice, its ID and answer gate. Its `bridge` now introduces the 32-bit addition on this page. The architecture section then defines ALU locally before its first use in the figure, and ends with the transition to subtraction on the next page. Render `architecture.before` once; it is the same approved prose as the UI `assembly.intro`.

The initial state is w0 = 3, w1 = 3, w2 = 0 before ADD. Run ADD executes/reveals the actual first instruction state. Back returns before it; Reset restores the starting inputs. Use inputs changes starting data and returns before ADD. The low-four-bit detail is available after ADD. Selecting a bit changes inspection only. The full-width register display remains visible. Input minimum and maximum and every numeric status come from the input contract/model, not independently drafted results.
