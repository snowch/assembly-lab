# Programmer calculator: separate copy draft

This is the canonical copy record for the optional calculator integrated into five course lessons.
The exact exported strings and function templates are reproduced below. Runtime values supplied to
function templates come from the calculator. The component renders plain text, without JSX in copy.

## Brief and provenance

Drafted in a separate agent from `brief.md`, `CLAUDE.md` and both closing passes in `docs/style.md`.
The previously reviewed prototype copy is `/workspace/scratch/progressive-calculator/copy.json`.
The prototype's five stages map to `hexadecimal`, `readings`, `arithmetic`, `halves` and `widths`.
Reused the worked examples, task structure and feedback where the brief retained the same facts.
Removed preview navigation, mock context and navigation-persistence promises. Added local control
labels, validation, action feedback and dynamic range and bit-contribution templates for the course UI.
This prose is course copy, not borrowed upstream calculator documentation.

The widths example now starts at 0x0000 0001 0000 000B (4,294,967,307). The distinct task starts at
0x0000 0002 0000 0009 (8,589,934,601). Narrowing that task to 32 bits and widening to 64 leaves 9.
These values replace the prototype's example and task to avoid the course's graded values.
The brief supplies the numeric facts; a direct BigInt arithmetic sanity check confirms both hex
conversions, the narrowed task, the halves and the signed task reading. Core and UI tests must pin
these values before release. This record does not claim browser review or independent review.

The calculator remains optional scratch work. Its guide is tool practice, and course assessment
stays outside the tool. Four-bit arithmetic is explicitly a miniature. The width qualification
applies to calculator resizing; no instruction behaviour, C guarantees or flags are promised.
No ordinary reload-persistence promise is made.

## Review corrections

The follow-up draft names the arithmetic preset's fixed unsigned decimal reading and adds
`decimalReading(reading)` so the component can label that view without adding signed-reading
vocabulary to the hexadecimal preset. Range feedback now covers either Apply or Calculate.
The halves qualification explains that the shift amount counts bit positions, that shifting moves
the whole 32-bit pattern, and that these controls do not execute instructions. The widths worked
example now shows both complete width changes with B, keeping the fresh task's 9 distinct.
The existing “Shift amount in bits” label is retained.

After formatting the source, direct BigInt assertions confirmed the worked 64→32→64 conversion
ends at B, the separate task ends at 9, and the four-bit arithmetic task retains 1001. This focused
numeric check adds no browser-review claim. The exact copy below includes these corrections.

## Exact copy and function templates

Keep this block synchronised with the exported source, including later review corrections.

```ts
// Copyright © 2026 Christopher Snow

// Separate draft and canonical copy: docs/notes/lesson-programmer-calculator/copy.md.
export const PROGRAMMER_CALCULATOR = {
  title: "Programmer calculator",
  help: "Use your own values as scratch work. These controls change numbers and bits; they do not run instructions.",
  full: "Open full calculator",
  newTab: "Opens in a new tab",
  decimal: "Decimal",
  hex: "Hexadecimal",
  pattern: "Bit pattern",
  entry: "Value to enter",
  format: "Entry format",
  apply: "Apply",
  reset: "Reset calculator",
  clear: "Clear bits",
  reading: "Reading",
  signed: "Signed",
  unsigned: "Unsigned",
  width: "Width",
  operation: "Operation",
  add: "Add",
  subtract: "Subtract",
  second: "Second value",
  calculate: "Calculate",
  fullResult: "Full mathematical result",
  retained: "Retained bits",
  halfTitle: "Edit a 16-bit half",
  upper: "Upper 16 bits",
  lower: "Lower 16 bits",
  halfValue: "Half value in decimal",
  replaceHalf: "Half to replace",
  applyHalf: "Apply half",
  shiftLeft: "Shift left",
  shiftAmount: "Shift amount in bits",
  guideTitle: "Try a short task",
  worked: "Worked example",
  turn: "Your turn",
  loadTask: "Load task",
  returnToCalculator: "Go to calculator",
  check: "Check answer",
  resetGuide: "Reset guide",
  decimalReading: (reading: string) => `Decimal (${reading})`,
  widthValue: (n: number) => `${n} bits`,
  bit: (i: number) => `Bit ${i}`,
  bitRange: (n: number) => `Bits ${n - 1} to 0`,
  decimalRange: (min: string, max: string) =>
    `Enter a whole decimal number from ${min} to ${max}. Spaces, commas and underscores may separate digits.`,
  patternRange: (width: number) =>
    `Enter hexadecimal that fits ${width} bits. You can include 0x and separate digits with spaces, commas or underscores.`,
  inspector: (position: number, value: 0 | 1, contribution: string, weight: string) =>
    `Bit ${position} is ${value}. Its weight is ${weight}, so it contributes ${contribution} to the decimal reading.`,
  halfSum: (upper: string, lower: string, total: string) =>
    `${upper} × 65,536 + ${lower} = ${total}`,
  messages: {
    applied: "Value applied.",
    reset: "Calculator reset to its starting values.",
    cleared: "All bits cleared.",
    reading: "Reading changed. The bits stay the same.",
    resizeNarrow: "Width reduced. The calculator kept the low bits and discarded the upper bits.",
    resizeWide: "Width increased. The calculator filled the new upper bits with zeros.",
    taskLoaded: "Task values loaded in the calculator. Your answer fields are unchanged.",
    guideReset: "Guide answers and feedback cleared. The calculator is unchanged.",
    calculated: "Calculation complete. Compare the full result with the retained bits.",
    halfApplied: "Half replaced. The other half is unchanged.",
    shifted: "Pattern shifted left. Bits moved beyond the current width were discarded.",
  },
  errors: {
    empty: "Enter a value.",
    decimal: "Enter a whole decimal number within the range shown.",
    hex: "Enter hexadecimal that fits the current width. You can include 0x.",
    range: "The value is outside the range shown. Enter a value within that range.",
    half: "Enter a whole decimal number from 0 to 65,535 for this 16-bit half.",
    shift: "Enter a whole shift amount from 0 to one less than the current width.",
  },
  presets: {
    hexadecimal: {
      intro:
        "Switch a bit, or enter decimal or hexadecimal and choose Apply. Both readings show the same pattern.",
      qualifier: "This calculator uses 32 bits. Each hex digit represents four bits.",
      worked: "The starting value is 13 in decimal, D in hex. Its lowest four bits are 1101.",
      task: "Load decimal 21. Type its hex value below; 0x is optional.",
      labels: ["Hex value"],
      success: "Correct. Decimal 21 is hex 15.",
      retry: "Load task, then read the hexadecimal value in the calculator. Type that value below.",
    },
    readings: {
      intro: "Choose Signed or Unsigned to change the decimal reading. Every bit stays in place.",
      qualifier:
        "This calculator uses 32 bits. Decimal entry follows the selected reading; hexadecimal entry sets the bit pattern.",
      worked: "The starting pattern is 0xFFFF FFFF. Unsigned reads 4,294,967,295; Signed reads −1.",
      task: "For 0xFFFF FFFE, type its unsigned and signed decimal readings.",
      labels: ["Unsigned decimal reading", "Signed decimal reading"],
      success:
        "Both readings are correct: unsigned 4,294,967,294 and signed −2 describe the same bits.",
      retry:
        "Load task. Keep the bits unchanged and switch the reading to inspect each decimal value.",
    },
    arithmetic: {
      intro:
        "Choose Add or Subtract, enter a second value, then Calculate. The result keeps four bits.",
      qualifier:
        "This four-bit miniature uses an unsigned decimal reading. It is not an Arm register. Compare the full mathematical result with the retained bits.",
      worked: "Start at 3, add 1 and choose Calculate. Compare the result with the four bits.",
      task: "Work out 6 + 3. Type the four result bits below.",
      labels: ["Four result bits"],
      success: "Correct. The four result bits are 1001, which read as unsigned 9.",
      retry: "Load task, then choose Calculate. Type the four retained result bits below.",
    },
    halves: {
      intro:
        "Choose a half, enter its decimal value, then Apply half. The other half keeps its bits.",
      qualifier:
        "This calculator uses 32 bits and an unsigned reading. The shift amount counts bit positions. Shift left moves the whole 32-bit pattern and discards bits moved beyond its width. These controls do not execute instructions.",
      worked: "The starting pattern is 0x0002 0003. Its value is 2 × 65,536 + 3 = 131,075.",
      task: "For 0x0004 0009, enter the unsigned decimal value of each 16-bit half.",
      labels: ["Upper half in decimal", "Lower half in decimal"],
      success:
        "The upper half is 4 and the lower half is 9. Each four-digit hex group identifies one half.",
      retry:
        "Read the first four hex digits as the upper half and the last four as the lower half.",
    },
    widths: {
      intro: "Narrowing keeps the low bits. Widening fills the new upper bits with zeros.",
      qualifier:
        "Resizing this calculator does not execute a register write or extend a signed value.",
      worked:
        "Start with 0x0000 0001 0000 000B at 64 bits. Choose 32 bits to keep 0x0000 000B. Choose 64 bits to add upper zeros: 0x0000 0000 0000 000B.",
      task: "Load 0x0000 0002 0000 0009 at 64 bits. Narrow to 32 bits, then widen to 64 bits. Type the final hex pattern.",
      labels: ["Final hex pattern"],
      success:
        "Correct. The final pattern is 0x0000 0000 0000 0009. Narrowing discarded the upper bits; widening added zeros.",
      retry:
        "Follow both width changes in order. Widening adds zeros; it does not restore the discarded upper bits.",
    },
  },
} as const;
```
