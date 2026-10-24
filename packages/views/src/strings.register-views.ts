// Copyright © 2026 Christopher Snow

// Drafted separately from the checked register-name/width facts for the opening schematic.
export const REGISTER_VIEW_STRINGS = {
  description: (name: string, width: number, lowName: string, lowWidth: number) =>
    `${name} names one ${width}-bit register. ${lowName} names its lower ${lowWidth} bits.`,
  width: (bits: number) => `${bits} bits`,
  upper: (bits: number) => `Upper ${bits} bits`,
  lower: (bits: number) => `Lower ${bits} bits`,
} as const;
