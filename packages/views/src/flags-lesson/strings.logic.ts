// Copyright © 2026 Christopher Snow

// Separately drafted learner copy. Selected-example values come from the model.
export const LOGIC_COPY = {
  summary: "Optional: follow the bits to the flags",
  title: "Flag logic for this addition",
  limitation:
    "This simplified four-bit model shows the addition above. The Arm instruction keeps 32 result bits. The drawing explains the flag rules, not an Arm processor’s physical circuit. A processor may calculate carries differently.",
  legend: "A: first input · B: second input · R: stored result",
  adder:
    "FA means full adder. Each block adds two input bits and an incoming carry, producing a result bit and an outgoing carry.",
  carryDirection:
    "Carry passes to the next higher bit. The lowest bit starts with no incoming carry.",
  nRule: "N copies the top bit of R.",
  zRule: "Z is set only when every bit of R is zero.",
  cRule: "For this addition, C copies the carry out of the top bit.",
  vRule: "V is set when the carries into and out of the top bit differ.",
  xorDefinition:
    "XOR means exclusive OR. Its output is 1 when its inputs differ and 0 when they match.",
  norDefinition:
    "NOR means NOT OR. Its output is 1 only when all its inputs are 0, so it checks whether R is zero.",
  xorWhyTitle: "Why does XOR detect signed overflow?",
  xorWhy:
    "When both input sign bits match but the stored result’s sign bit differs, the signed sum did not fit.",
  xorWhyPositive:
    "For non-negative inputs, both top bits are 0. A carry into the top bit makes the result negative; no carry leaves.",
  xorWhyNegative:
    "For negative inputs, both top bits are 1. Without an incoming carry, the result becomes non-negative and a carry leaves.",
  xorWhyConclusion:
    "Both overflow cases have unequal top carries. Matching carries mean the signed sum fits. Opposite-sign inputs cannot cause signed overflow.",
  bitLabLink: "Explore the circuit in Bit Lab",
  carryLink: "Revisit Arithmetic with four bits",
  diagramDescription:
    "Addition logic for the selected example. A: {a}. B: {b}. Stored result R: {result}. Carries from the lowest bit upwards: {carries}. Carry into the top bit: {carryIn}. Carry out of the top bit: {carryOut}. Flags: N {n}, Z {z}, C {c}, V {v}.",
  signalOne: "1 · set",
  signalZero: "0 · clear",
  scrollCue: "Scroll sideways to see the full diagram.",
  regionLabel: "Flag logic diagram",
} as const;
