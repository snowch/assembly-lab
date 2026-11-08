# Checked feedback copy

Separate drafting: GPT-6.1 Sol Medium, early/shared and branch/A32 passes. Accuracy edits retain the model/interpretation distinction, avoid referring to hidden instruction listings, and preserve existing answer withholding. The five original module prose records are synchronised with their changed exports.

## Shared view strings

```ts
  fits: {
    selected: (value: string, accepted: boolean) =>
      accepted
        ? `The assembler accepts \`mov w0, ${value}\` as one instruction.`
        : `The assembler rejects \`mov w0, ${value}\` as one instruction.`,
    halves: (hex: string, upper: string, lower: string) =>
      `Its 32-bit pattern is \`${hex}\`: upper half \`${upper}\`, lower half \`${lower}\`.`,
    guaranteed: "All its set bits lie in one half, so the one-half rule guarantees it fits.",
    notGuaranteed:
      "Both halves contain set bits. The one-half rule does not decide whether it fits.",
    one: (accepted: string) =>
      `Of these candidates, only \`mov w0, ${accepted}\` is accepted as one instruction.`,
    none: "The assembler rejects every candidate.",
    several: (accepted: string) =>
      `The assembler accepts these candidates as one instruction each: ${accepted}.`,
  },

  readings: {
    bitsRead: (value: string) =>
      `Your bits have a signed reading of ${value}, and that is not the number asked for.`,
    notThis: (field: string, reading: "unsigned" | "signed") =>
      reading === "unsigned"
        ? `Your answer for ‘${field}’ does not match the unsigned reading. Add the positive weights of the set bits, including the top bit.`
        : `Your answer for ‘${field}’ does not match the signed reading. Give the top bit its negative weight and add the positive weights of the other set bits.`,
    registerWrong: (name: string) =>
      `${name} does not hold that number once all the instructions have run. Trace the last instruction that writes this register and check which bits it keeps or replaces.`,
  },

  grader: {
    nothingWritten: "Write at least one instruction first.",
    // `fields` is the fields' names as a list ("a", "a and b", "a, b and c"), `count` how many.
    unanswered: (fields: string, count: number) =>
      count === 1
        ? `Nothing is graded until ${fields} has a whole number.`
        : `Nothing is graded until each of ${fields} has a whole number.`,
    /** Between the last two names in a list. */
    and: "and",
    // Says "in decimal", because `0x5` is a whole number and is refused.
    notWhole: (field: string) =>
      `The answer for ${field} must be a whole number written in decimal.`,
    noProgram: "This challenge has no program to run.",
    // The failure card's sentence for a wrong field that has no sentence of its own. It names
    // the field and never the value. Without it the card prints its labels with nothing under them.
    fieldNotRight: (field: string) => `Your answer for ‘${field}’ is not right.`,
    registerAtReturnWrong: (field: string, register: string) =>
      `Your answer for ‘${field}’ does not match ${register} at the moment the field asks about. Trace the last write to this register before that moment. Later instructions that do not write it leave its value unchanged.`,
    instructionAtEntryWrong: (field: string) =>
      `Your answer for ‘${field}’ is not right. Check which operation the question asks the instruction to perform.`,
  },
```

## Arithmetic feedback

```ts
  grader: {
    /** A flag that is 0 for the number the learner gave. */
    flagClear: (flag: string) => `${flag} is 0 for the number you gave.`,
    operandRange: (maxExclusive: string) =>
      `Use a positive whole number less than ${maxExclusive}. Your answer is outside this range, so the flag calculation was not run.`,
    notSmallest: "A smaller number also makes V 1.",
    /** The sentence for a wrong flag when the case gives none of its own. It names no flag. */
    flagWrong:
      "At least one flag you gave is wrong. Find the last instruction that writes the flags and work out the flags from that operation.",
    /** The same for a wrong register value. It names no value. */
    valueWrong:
      "That answer is not right. Trace the result through the instructions to the return, including any later write to the same register.",
    /** In place of the list of fields, when every unanswered field is a choice. */
    chooseFirst: "Choose 0 or 1 for every flag first.",
    /** What is said for a wrong flag, when a case asks for it (`given.feedback` is "rule"). */
    flagRuleLine: (flag: string, rule: string) => `${flag}: ${rule}`, // DRAFT
    flagRule: {
      n: "N is the top bit of the 32-bit result.", // DRAFT
      z: "Z is 1 only when all 32 result bits are 0.", // DRAFT
      c: "C is the carry out of the top bit. Check whether a carry leaves bit 31.", // DRAFT
      v: "Compare the carry into the top bit with the carry out of it.", // DRAFT
    },
  },
```

## Branch feedback

```ts
  grader: {
    cannotRun: "The grader could not run this challenge.",
    conditionObservation: (field: string, n: number, z: number, c: number, v: number) =>
      `${field}: \`cmp w0, w1\` leaves N=${n}, Z=${z}, C=${c}, V=${v}.`,
    conditionAction: (condition: string, rule: string) =>
      `Apply the rule for \`${condition}\`: ${rule}. Check whether those flags satisfy it.`,
    countDirection: (field: string, submitted: string, lower: boolean) =>
      `${field}: your count of ${submitted} is too ${lower ? "low" : "high"}.`,
    countAction:
      "Count executed instructions, including each branch and `ret`. Do not count labels.",
    returnAction: (field: string) =>
      `${field}: follow the instructions that ran and find the last write to \`w0\` before \`ret\`.`,
  },
```

## Recorded-value feedback

```ts
// Copyright © 2026 Christopher Snow

// Separately drafted copy for exercises that inspect recorded compiler output.
export const RECORDED_STRINGS = {
  accepted: "The course A64 assembler accepts this line.",
  rejected: "The course A64 assembler rejects this line.",
  token: (value: string) => `The recorded listing contains ${value}.`,
  result: (value: string) => `The A64 simulator returns ${value}.`,
  wrong: "Check the specified listing or run, then try this field again.",
  numberRequired: "Enter a whole number in decimal, or in hexadecimal beginning with `0x`.",
} as const;
```
