// Copyright © 2026 Christopher Snow

// Separate drafting pass from docs/notes/calculator-carries/brief.md and the addition model.
export const CALCULATOR_CARRIES = {
  showCarries: "Show carries",
  carryIn: "Carry in",
  help: "For ordinary addition, each Carry in joins A and B in the same bit column. Bit 0 starts with carry 0.",
  signBit: (width: number) => `The sign bit is the highest retained bit, bit ${width - 1}.`,
  intoSign: (bit: number) => `Carry into sign bit ${bit}`,
  carryOut: "Carry out (outside the retained word)",
  cLabel: "C · unsigned carry",
  vLabel: "V · signed overflow",
  overflowHelp:
    "Signed overflow means the exact signed sum is outside the signed range for the selected width.",
  cEquation: (out: number) => `C = carry out = ${out}`,
  vEquation: (into: number, out: number, v: number) => `V = ${into} XOR ${out} = ${v}`,
  xorHelp: "XOR gives 1 when its two inputs differ and 0 when they match.",
  matching: "The carries match: no signed overflow.",
  different: "The carries differ: signed overflow.",
  unknown: "Choose Calculate to inspect this addition’s carries.",
  rowDescription: (bits: string, width: number) =>
    `Carry into bits ${width - 1} to 0: ${bits}. Bit 0 starts with carry 0.`,
} as const;
