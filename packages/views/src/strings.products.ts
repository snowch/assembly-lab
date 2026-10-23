// Copyright © 2026 Christopher Snow

// Separately drafted figure copy; canonical text in docs/notes/module-8/prose.md.
export const PRODUCT_STRINGS = {
  unsignedProduct: "Product with unsigned inputs",
  signedProduct: "Product with signed inputs",
  highHalf: "High half: bits 64 to 127",
  lowHalf: "Low half: bits 0 to 63",
  inputs: "Input bit patterns",
  completed:
    "Completed products. This diagram shows the end of the run; Next and Reset in the stepper above do not change it.",
  diagram: "The two halves of each product",
  divisionDiagram: "The dividend divided into whole groups and a remainder",
  dividend: "Dividend",
  quotient: "Quotient",
  remainder: "Remainder",
  groupedPart: "Whole groups",
} as const;
