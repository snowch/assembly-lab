// Copyright © 2026 Christopher Snow

// Separate draft adapted from the approved compact mock; canonical copy is recorded in
// docs/notes/compact-calculator/copy.md. Arithmetic values come from the calculator model.
import type { CalculatorOperation, CalculatorReading } from "@al/machine";

type ResultContext = {
  width: number;
  reading: CalculatorReading;
  exact: string;
  operation: CalculatorOperation;
};

export const COMPACT_CALCULATOR = {
  notationHint: "Decimal · 0x for hex · 0b for binary.",
  inspection: "Inspect bits and carries",
  help: "Entry & width help",
  reading: "Decimal reading & entry",
  editBits: "Edit A bits",
  finishEditing: "Finish editing A",
  halfDisclosure: "Edit a 16-bit half of A",
  showFlags: "Show arithmetic flags",
  resultContext: (width: number, reading: CalculatorReading) =>
    `${width} bits · ${reading === "signed" ? "Signed" : "Unsigned"}`,
  exactLabel: (operation: CalculatorOperation, reading: CalculatorReading) => {
    if (operation === "shift-left") return "Full shifted pattern (unsigned)";
    const kind = operation === "subtract" ? "difference" : "sum";
    return `Exact ${reading === "signed" ? "signed" : "unsigned"} ${kind}`;
  },
  rangeStatus: ({ width, reading, exact, operation }: ResultContext) => {
    const value = BigInt(exact);
    const signed = reading === "signed" && operation !== "shift-left";
    const minimum = signed ? -(1n << BigInt(width - 1)) : 0n;
    const maximum = (1n << BigInt(signed ? width - 1 : width)) - 1n;
    const fits = value >= minimum && value <= maximum;
    if (operation === "shift-left")
      return fits
        ? `The full shifted pattern fits ${width} bits.`
        : `The full shifted pattern needs more than ${width} bits. The result retains the low ${width} bits.`;
    const kind = operation === "subtract" ? "difference" : "sum";
    const label = reading === "signed" ? "signed" : "unsigned";
    return fits
      ? `The exact ${label} ${kind} fits the ${width}-bit range.`
      : `The exact ${label} ${kind} is outside the ${width}-bit range. The result retains the low ${width} bits.`;
  },
  nLabel: "N · top bit",
  zLabel: "Z · zero",
  cAddLabel: "C · carry out",
  cSubLabel: "C · no borrow",
  vLabel: "V · signed overflow",
  flagsHelp:
    "No instruction runs. N copies the retained top bit; Z is 1 when all retained bits are 0. V is 1 when the exact signed sum or difference is outside its range.",
  subtractionHelp:
    "For subtraction, C is 1 when unsigned A is at least unsigned B: no borrow. Otherwise C is 0.",
  widthChanged: (width: number, narrowed: boolean, hadInvalidEntry = false) => {
    const change = narrowed
      ? "Valid patterns kept their low bits; upper bits were discarded."
      : "Valid patterns gained upper zeros.";
    return `Width changed to ${width} bits. ${change}${hadInvalidEntry ? " Previously invalid entries were kept unchanged." : ""}`;
  },
  inputChanged: "Values changed. Choose Calculate for a new result.",
  retainedUsed: "Retained result copied to A. Choose Calculate for the next result.",
  emptyResult: "Choose Calculate to see the result.",
  helpIntro:
    "Spaces, commas and underscores may separate digits. Prefixes ignore case. These controls change numbers and bits; they do not run instructions.",
  widthHelp:
    "Short hex and binary patterns get upper zeros, even with Signed selected. Oversized entries are rejected without changing Width or discarding bits. Width buttons keep low bits when narrowing and add upper zeros when widening. Previously invalid entries stay unchanged.",
  readingHelp:
    "Changing Signed or Unsigned preserves the bits and shows the sum or difference under that reading. Shift left always shifts the unsigned bit pattern.",
  visibleBits: (high: number, low: number, width: number) =>
    `Visible bits ${high}–${low} of ${width - 1}–0`,
  signBit: (width: number) =>
    `Outlined column: sign bit ${width - 1}. Every row uses the same bit positions.`,
  inspectorEditHelp: "Choose an A bit to switch it. Editing A clears the previous result.",
  readingChanged: "Reading changed. The bits stay the same.",
} as const;
