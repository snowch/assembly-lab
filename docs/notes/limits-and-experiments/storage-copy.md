<!-- Copyright © 2026 Christopher Snow -->

# Storage-width copy

Separately drafted from the checked brief. The first block is the integrated view copy; the second is the lesson section. Controls describe a computed width projection, not a four-bit Arm instruction. Original addition/subtraction content and stored work remain intact.

```json
{
  "inputLabel": "Full decimal value",
  "inputHelp": "Decimal digits only, from {minimumInput} to {maximumInput}. This is the tool’s input limit.",
  "widthLabel": "Kept width",
  "widthOption": "{width} bits",
  "widthHelp": "Unsigned kept range: {minimumInput}–{keptMaximum}.",
  "predictionLabel": "Prediction (decimal, optional)",
  "predictionPlaceholder": "Your predicted kept value",
  "keep": "Keep low bits",
  "reset": "Reset",
  "fullInputLabel": "Full input in binary",
  "placeValues": "Place values",
  "none": "None",
  "placeLabel": "Place value {weight}, bit {bit}",
  "discardedLabel": "Discarded upper bits",
  "keptLabel": "Kept low bits",
  "removedValueLabel": "Value removed",
  "keptValueLabel": "Kept value",
  "unsignedLabel": "Unsigned decimal",
  "pending": "Choose Keep low bits to reveal the discarded and kept bits.",
  "noDiscardedBits": "All input bits fit within the kept width.",
  "discardedExplanation": "Read discarded bits with their original place values. Together they account for {removedValue} of the full input.",
  "keptExplanation": "Add the place values of the kept 1 bits to read {keptValue}.",
  "groupsEquation": "{fullValue} = {groups} × {groupSize} + {keptValue}",
  "groupsExplanation": "The input contains {groups} full groups of {groupSize}, with {keptValue} left. Keeping the low bits leaves that final part.",
  "wrapExplanation": "A value outside the kept range wraps back into {minimumInput}–{keptMaximum} because its upper bits are discarded.",
  "predictionMatches": "Your prediction matches the kept value, {keptValue}.",
  "predictionDiffers": "You predicted {prediction}; the kept value is {keptValue}. Use the kept bits’ place values to explain the difference.",
  "inputError": "Enter decimal digits for a whole number from {minimumInput} to {maximumInput}. Values outside this tool’s range are rejected.",
  "predictionError": "Enter an unsigned whole decimal number for your prediction, or leave it blank.",
  "resetStatus": "Reset to decimal {defaultInput} and {smallWidth} kept bits. Choose Keep low bits to inspect the result.",
  "modelNote": "A real {realWidth}-bit Arm register view can hold decimal {defaultInput} unchanged. Choosing {smallWidth} or {largeWidth} kept bits deliberately reduces the width for this teaching example."
}
```

```json
{
  "storage": {
    "title": "Keep only the low bits",
    "before": "Keeping low bits discards any higher bits. Read the remaining pattern as unsigned. What will remain at the selected width? You can enter an optional prediction. Choose **Keep low bits** with the controls unchanged, then inspect **Value removed** and **Kept value**.",
    "caption": "One decimal input with its original bit weights and a chosen width to keep.",
    "after": "Set **Kept width** to {smallWidth} bits. Try decimal {inside}, {boundaryMaximum} and {outside} in **Full decimal value**. Predict before each **Keep low bits** run. Which input first exceeds the kept range, and what remains?\n\nThen enter decimal {defaultInput}, keep {largeWidth} bits, predict and run again. How does the wider choice change **Value removed** and **Kept value**?"
  },
  "objective": "Predict and explain what remains when only the low bits are kept."
}
```
