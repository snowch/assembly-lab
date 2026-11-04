# Arithmetic with four bits: canonical draft

Drafted by a separate agent from the checked brief and preceding signed/unsigned lesson. No build or browser verification was performed in this drafting pass.

## Lesson copy

Arithmetic with four bits

Add bit patterns one column at a time.

Subtract by inverting the second input, adding one, then adding that opposite to the first input.

Keep the available bits when an extra carry appears.

Adding columns

These four-bit miniatures are not Arm registers. Unsigned weights are 8, 4, 2, 1; signed weights are −8, 4, 2, 1. The signed range is −8 to 7.

Add `0011` (3) and `0001` (1). Start at the right with carry 0. Add both bits and the incoming **carry**, a bit passed left from the previous column. Binary `1 + 1 = 10`: keep 0, carry 1. For `1 + 1 + 1 = 11`: keep 1, carry 1.

Press Next column to reveal each calculation. Revealing a column does not execute another instruction.

Add 0011 and 0001, starting at the right.



Keeping four places

Unsigned 15 + 1 needs a fifth place.

The boundary separates the four result bits from the extra carry.

Keep the low four bits, `0000`. Discard the extra carry.

Subtracting by addition

Subtract 5 by adding its opposite. **Invert** every bit: change 0 to 1 and 1 to 0. Then add one.

The original plus its inverted pattern gives `1111`. Adding one makes `10000`, whose low four bits are zero. That is why inverting and adding one constructs a pattern that cancels the original.

Construct the opposite of 0101, then add it to 0011 to calculate 3 − 5.

The opposite reads as −5 signed. Adding it gives `1110`: −8 + 4 + 2 = −2. These signed values fit. The top bit has a weight, not a separate minus sign.

Try 6 − 3

Start with `0110` and subtract `0011`. Enter the opposite of the second input, then the retained result. Use four binary digits in each box. Decide what to do with an extra leftmost carry.

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

The next page applies this rule with 32 places. Its `sub` instruction performs the subtraction as one instruction.

The same rule now uses 32 places. The `sub` instruction performs the subtraction as one instruction.

The four-bit lesson built subtraction by inverting the second input, adding one and adding that opposite to the first input. The same rule applies here with 32 available bits.

A standalone two's-complement conversion followed by an unexplained subtraction rule.

A revealed column calculation leads to a visible width boundary, then a cancellation argument and a fresh subtraction. This prepares the existing fuel example without working its result in advance.

## Figure labels and status messages

Bit ${index}

Not revealed

Four-bit addition columns

Incoming carry

First input

Second input

Result

Extra carry

Next column

Reset

No columns revealed. Start at the right.

Bit ${work.bit}: ${work.a} + ${work.b} + incoming carry ${work.carryIn} = ${work.total} in decimal. Kept ${work.kept}; carried ${work.carryOut} left.

All four columns are revealed.

Low four bits

Outside four places

Unsigned reading

Signed reading

Original bits

Inverted bits

Add one

Opposite pattern

Add the opposite

Construct the opposite of the second input

Add the opposite to the first input

${result.pattern}: ${result.unsigned} unsigned, ${result.signed} signed.

The full sum is ${fullPattern}. Keep ${pattern} within four places.

These four places show the calculation; they are not an Arm register.

## Drafting check

Read both closing style passes. Column carrying, its initial zero and control guidance precede the first figure; inversion and the extra one precede subtraction. The worked example and width example are distinct from the fresh exercise. Full fresh-exercise patterns appear only in the fifth hint and post-grade explanation. Numbers and examples come from the checked brief. Independent learner and technical review remain with the managing agent.
