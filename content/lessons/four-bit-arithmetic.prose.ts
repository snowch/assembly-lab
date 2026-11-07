// Copyright © 2026 Christopher Snow

// Draft and checked-fact brief: docs/notes/four-bit-arithmetic/.
export const FOUR_BIT_PROSE = {
  title: "Arithmetic with four bits",
  objectives: [
    "Add bit patterns one column at a time.",
    "Subtract by inverting the second input, adding one, then adding that opposite to the first input.",
    "Keep the available bits when an extra carry appears.",
  ],
  addition: {
    title: "Adding columns",
    before:
      "These four-bit miniatures are not Arm registers.\n\n- Unsigned weights are 8, 4, 2, 1.\n- Signed weights are −8, 4, 2, 1.\n- The signed range is −8 to 7.\n\nAdd `0011` (3) and `0011` (3). A **carry** is a bit passed left from the previous column.\n\n1. Start at the right with carry 0.\n2. Add both bits and the incoming carry.\n3. Keep the rightmost bit of the sum. Pass the carry to the next column on the left, then repeat.\n\nIn the rightmost column, binary `1 + 1 + 0 = 10`: keep 0 and carry 1 left.\n\nAt bit 1, A and B are both 1, and the incoming carry adds a third 1: `1 + 1 + 1 = 11` in binary.\n\n- Keep the right-hand 1 in this column.\n- Carry the left-hand 1 one column left, where its place has twice the weight.\n\nPress Next column to reveal each calculation. Revealing a column does not execute another instruction.",
    caption: "Add 0011 and 0011, starting at the right.",
    after: "",
  },
  width: {
    title: "Keeping four places",
    before: "Unsigned 15 + 1 needs a fifth place.",
    caption: "The boundary separates the four result bits from the extra carry.",
    after:
      "For an Arm register, `adds` records the carry beyond its width in C, a one-bit **carry flag**. Ordinary `add` leaves the flags unchanged. [Adding and the flags](#/lesson/adding-and-the-flags) in Module 2 explains how to use these flags.",
  },
  subtraction: {
    title: "Subtracting by addition",
    before:
      "> To subtract the second input from the first:\n>\n> 1. **Invert** every bit of the second input: change 0 to 1 and 1 to 0.\n> 2. **Add one** to the inverted pattern to construct the opposite pattern.\n> 3. **Add** that opposite pattern to the first input.\n>\n> Keep four result bits after each addition. Discard any extra carry to their left.\n\nFor `0011` (3) minus `0101` (5), construct the opposite of `0101`, then add it to `0011`.\n\nThe second input plus its inverted pattern gives `1111`. Adding one makes `10000`, whose low four bits are zero. That is why inverting and adding one constructs a pattern that cancels the original.",
    caption: "Construct the opposite of 0101, then add it to 0011 to calculate 3 − 5.",
    after:
      "The opposite reads as −5 signed. Adding it gives `1110`: −8 + 4 + 2 = −2. These signed values fit. The top bit has a weight, not a separate minus sign.",
  },
  practice: {
    title: "Try 6 − 3",
    task: "Start with `0110` and subtract `0011`. Enter one binary digit in each box.\n\n1. Enter the opposite of the second input.\n2. Enter the retained result.\n3. Decide what to do with an extra leftmost carry.",
    caption: "A fresh subtraction with four available places.",
    fields: {
      negated: "Opposite of 0011",
      result: "Retained result of 0110 minus 0011",
      carry: "What happens to an extra leftmost carry?",
    },
    options: [
      { value: "discard", label: "Discard it outside the four result bits" },
      { value: "keep", label: "Keep it as a fifth result bit" },
      { value: "sign", label: "Use it as a separate minus sign" },
    ],
    hints: [
      "Construct the opposite of the second input before adding it to the first.",
      "Inverting alone misses a step. After changing every bit, add one within four places.",
      "For the worked subtraction, `0101` becomes `1010`, then `1011`. Use the same steps on the new second input.",
      "Add from the right and include each incoming carry. The boundary still allows only four result bits.",
      "Invert `0011` to get `1100`, then add one to get `1101`. Add `0110` and `1101` to get `10011`. Retain `0011` and discard the extra carry.",
    ],
    feedback: {
      negated: "Check the opposite pattern: invert every bit of the second input, then add one.",
      result:
        "Check the addition of the first input and the correct opposite of the second input. Include incoming carries and keep four result bits.",
      carry:
        "The result has four places. An extra carry belongs outside those places; it does not supply a minus sign.",
    },
    solved:
      "The opposite of `0011` is `1101`. Adding `0110` gives `10011`. Keeping the low four bits gives `0011`, read as 3. Discard the extra carry.",
  },
  bridge:
    "The next page applies subtraction with 32 places. Its `sub` instruction performs the subtraction as one instruction.",
  fuelBridge:
    "The same rule now uses 32 places. The `sub` instruction performs the subtraction as one instruction.",
  laterBridge:
    "The four-bit lesson built subtraction by inverting the second input, adding one and adding that opposite to the first input. The same rule applies here with 32 available bits.",
  originalityNote: {
    textbookExample:
      "A standalone two's-complement conversion followed by an unexplained subtraction rule.",
    howThisDiffers:
      "A revealed column calculation leads to a visible width boundary, then a cancellation argument and a fresh subtraction. This prepares the existing fuel example without working its result in advance.",
  },
} as const;
