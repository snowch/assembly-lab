// Copyright © 2026 Christopher Snow

// Separate drafting pass from docs/notes/calculator-workspace/brief.md and the calculator model.
import { PROGRAMMER_CALCULATOR as S } from "./strings.programmer-calculator";

export const CALCULATOR_WORKSPACE = {
  calculateView: "Calculate",
  editView: "Edit bits",
  viewLabel: "Calculator view",
  a: "A",
  b: "B",
  result: "Result",
  currentA: "Value A",
  loadA: "Load A",
  snapshotHeading: "Calculation",
  operandFormat: "B entry format",
  sharedScrollHint: "Scroll the rows together to compare the same bit positions.",
  highBits: "High bits",
  lowBits: "Low bits",
  bitIndices: "Bit positions",
  unknownResult: "Not calculated",
  calculateHint: "Choose Calculate to see the result.",
  staleResult: "Values changed. Choose Calculate for a new result.",
  useResult: "Use result as A",
  exactResult: S.fullResult,
  fullShiftResult: "Full shift result (unsigned)",
  retainedResult: "Retained result",
  editingA: "Editing A",
  halfDisclosure: S.halfTitle,
  shiftAmountDecimal: "Shift amount (decimal)",
  widthHelp: S.toolWidthHelp,
  modeHelp: S.help,
  previousExactResult: "Previous full result",
  resultDescription: (label: string, width: number, bits: string) =>
    `${label}: ${width}-bit pattern, ${bits}.`,
  messages: {
    resultUsed: "Result loaded as A.",
  },
} as const;
