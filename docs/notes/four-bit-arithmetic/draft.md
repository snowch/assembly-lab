# Arithmetic with four bits: canonical draft

Drafted by a separate agent from the checked brief and preceding signed/unsigned lesson. No build or browser verification was performed in this drafting pass.

## Lesson copy

Arithmetic with four bits

Add bit patterns one column at a time.

Subtract by inverting the second input, adding one, then adding that opposite to the first input.

Keep the available bits when an extra carry appears.

Trace a 32-bit add from its input registers to its destination and inspect one column.

Adding columns

These four-bit miniatures are not Arm registers.

- Unsigned weights are 8, 4, 2, 1.
- Signed weights are −8, 4, 2, 1.
- The signed range is −8 to 7.

Add `0011` (3) and `0011` (3). A **carry** is a bit passed left from the previous column.

1. Start at the right with carry 0.
2. Add both bits and the incoming carry.
3. Keep the rightmost bit of the sum. Pass the carry to the next column on the left, then repeat.

For example:

- Binary `1 + 1 = 10`: keep 0, carry 1.
- Binary `1 + 1 + 1 = 11`: keep 1, carry 1.

Press Next column to reveal each calculation. Revealing a column does not execute another instruction.

Add 0011 and 0011, starting at the right.



Keeping four places

Unsigned 15 + 1 needs a fifth place.

The boundary separates the four result bits from the extra carry.

For an Arm register, `adds` records the carry beyond its width in C, a one-bit **carry flag**. Ordinary `add` leaves the flags unchanged. [Adding and the flags](#/lesson/adding-and-the-flags) in Module 2 explains how to use these flags.

Subtracting by addition

> To subtract the second input from the first:
>
> 1. **Invert** every bit of the second input: change 0 to 1 and 1 to 0.
> 2. **Add one** to the inverted pattern to construct the opposite pattern.
> 3. **Add** that opposite pattern to the first input.
>
> Keep four result bits after each addition. Discard any extra carry to their left.

For `0011` (3) minus `0101` (5), construct the opposite of `0101`, then add it to `0011`.

The second input plus its inverted pattern gives `1111`. Adding one makes `10000`, whose low four bits are zero. That is why inverting and adding one constructs a pattern that cancels the original.

Construct the opposite of 0101, then add it to 0011 to calculate 3 − 5.

The opposite reads as −5 signed. Adding it gives `1110`: −8 + 4 + 2 = −2. These signed values fit. The top bit has a weight, not a separate minus sign.

Try 6 − 3

Start with `0110` and subtract `0011`. Enter one binary digit in each box.

1. Enter the opposite of the second input.
2. Enter the retained result.
3. Decide what to do with an extra leftmost carry.

A fresh subtraction with four available places.

Opposite of 0011

Retained result of 0110 minus 0011

What happens to an extra leftmost carry?

Discard it outside the four result bits

Keep it as a fifth result bit

Use it as a separate minus sign

Construct the opposite of the second input before adding it to the first.

Inverting alone misses a step. After changing every bit, add one within four places.

For the worked subtraction, `0101` becomes `1010`, then `1011`. Use the same steps on the new second input.

Add from the right and include each incoming carry. The boundary still allows only four result bits.

Invert `0011` to get `1100`, then add one to get `1101`. Add `0110` and `1101` to get `10011`. Retain `0011` and discard the extra carry.

Check the opposite pattern: invert every bit of the second input, then add one.

Check the addition of the first input and the correct opposite of the second input. Include incoming carries and keep four result bits.

The result has four places. An extra carry belongs outside those places; it does not supply a minus sign.

The opposite of `0011` is `1101`. Adding `0110` gives `10011`. Keeping the low four bits gives `0011`, read as 3. Discard the extra carry.

The arithmetic now uses 32 places. Follow one `add` instruction from its input registers to its destination.

An add instruction uses the ALU

An arithmetic logic unit (ALU) performs arithmetic and logic operations. This instruction selects addition.

`add w2, w0, w1` reads the 32-bit values in w0 and w1, adds them and writes the low 32 result bits to w2. Decimal values here use the unsigned reading.

Run the instruction, then select a column to inspect its inputs, result bit and carry. Selecting a column changes the view without executing another instruction.

One 32-bit add, from the input registers through the ALU to the destination.

The next page applies subtraction with 32 places. Its `sub` instruction performs the subtraction as one instruction.

The same rule now uses 32 places. The `sub` instruction performs the subtraction as one instruction.

The four-bit lesson built subtraction by inverting the second input, adding one and adding that opposite to the first input. The same rule applies here with 32 available bits.

A standalone two's-complement conversion followed by an unexplained subtraction rule.

A revealed column calculation leads to a visible width boundary, then a cancellation argument and a fresh subtraction. This prepares the existing fuel example without working its result in advance.

## Figure labels and status messages

The approved carry-path mock supplies the addition figure's labels. Only the first addition has the full column walkthrough; width and subtraction retain compact computed summaries. The following source record preserves the literal strings and dynamic templates together.

```ts
// Copyright © 2026 Christopher Snow

// Draft and canonical record: docs/notes/four-bit-arithmetic/.
export const FOUR_BIT_STRINGS = {
  bit: (index: number) => `Bit ${index}`,
  unrevealed: "Not revealed",
  columnsLabel: "Four-bit addition columns",
  carryRow: "Incoming carry",
  firstRow: "First input",
  carryNotes: "Carry notes (optional, not graded)",
  carryNote: (bit: number) => `Carry note for bit ${bit} (optional, not graded)`,
  answerBit: (label: string, bit: number) => `${label}, bit ${bit}`,
  bitEntryError: "Use only 0 or 1. A pasted pattern must fit the four boxes.",
  savedBitEntry: (value: string) => `Saved entry: ${value}. Enter bits in the boxes to replace it.`,
  plusSign: "+",
  secondRow: "Second input",
  resultRow: "Result",
  extraRow: "Extra carry",
  nextColumn: "Next column",
  reset: "Reset",
  start: "No columns revealed. Start at the right.",
  starting: "Starting inputs",
  inputA: "A",
  inputB: "B",
  carryIn: "Carry in",
  carry: "Carry",
  kept: "Kept",
  carryOut: "Carry out",
  next: "Next",
  revealed: "Revealed",
  widthSum: "Full binary sum with the extra carry outside four retained places",
  progress: (done: number, count: number) => `${done} of ${count} revealed`,
  current: (bit: number, revealed: boolean) =>
    revealed ? `Just revealed · bit ${bit}` : `Next to reveal · bit ${bit}`,
  columnLabel: (bit: number, revealed: boolean, next: boolean) =>
    `Bit ${bit}${revealed ? ", just revealed" : ""}${next ? ", next to reveal" : ""}`,
  cell: (label: string, value: string | number, destination?: string) =>
    `${label}: ${value === "?" ? "not revealed" : value}${destination === "carry" ? ", received carry" : destination === "kept" ? ", kept in this column" : ""}`,
  finalCarry: (carry: number) => `Final carry out ${carry}. No next column.`,
  binaryEquation: (
    work: { a: number; b: number; carryIn: number; total: number; carryOut: number; kept: number },
    revealed: boolean,
  ) =>
    revealed
      ? `Binary column sum: ${work.a} plus ${work.b} plus incoming carry ${work.carryIn} equals ${work.total.toString(2).padStart(2, "0")} in binary. Carry ${work.carryOut}; kept bit ${work.kept}.`
      : `Next column inputs: ${work.a} plus ${work.b} plus incoming carry ${work.carryIn}. Both outputs are not revealed.`,
  column: (work: { bit: number; kept: number; carryOut: number }) =>
    `Bit ${work.bit}: keep ${work.kept} in this column; carry ${work.carryOut} goes into bit ${work.bit + 1}.`,
  complete: (pattern: string, carry: number) =>
    `All columns revealed: result ${pattern}. Final carry out ${carry}; there is no next column.`,
  done: "All four columns are revealed.",
  retained: "Low four bits",
  outside: "Outside four places",
  unsigned: "Unsigned reading",
  signed: "Signed reading",
  original: "Original bits",
  inverted: "Inverted bits",
  plusOne: "Add one",
  opposite: "Opposite pattern",
  addOpposite: "Add the opposite",
  negationLabel: "Construct the opposite of the second input",
  additionLabel: "Add the opposite to the first input",
  summary: (result: { pattern: string; unsigned: number; signed: number }) =>
    `${result.pattern}: ${result.unsigned} unsigned, ${result.signed} signed.`,
  wrapSummary: (fullPattern: string, pattern: string) =>
    `The full sum is ${fullPattern}. Keep ${pattern} within four places.`,
  widthsNote: "These four places show the calculation; they are not an Arm register.",
} as const;
```

## Drafting check

Read both closing style passes. Column carrying, its initial zero and control guidance precede the first figure; inversion and the extra one precede subtraction. The worked example and width example are distinct from the fresh exercise. Full fresh-exercise patterns appear only in the fifth hint and post-grade explanation. Numbers and examples come from the checked brief. Independent learner and technical review remain with the managing agent.
