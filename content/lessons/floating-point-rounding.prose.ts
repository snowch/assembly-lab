// Copyright © 2026 Christopher Snow

export const PROSE = {
  question:
    "A pump reports 12.35 litres. That decimal is 1235/100, or 247/20. In lowest terms its denominator contains a factor of 5. A finite binary fraction has a power-of-two denominator, so no finite binary fraction equals this decimal.\n\nA format with finitely many bits must choose a nearby value. That choice is rounding. The local calculator below reads the decimal as an exact fraction before rounding it to binary32. It uses round to nearest, ties to even throughout. Other rounding modes exist; they are outside this activity.",
  experiment:
    "Open Exact stored value and compare it with the entered decimal, 12.35. The stored binary32 value is 12.3500003814697265625. A short decimal display can hide their difference: a readable decimal is not necessarily the complete decimal expansion of the stored bits.\n\nNearest rounding chooses the closer of two representable neighbours. If the input is halfway between them, ties to even chooses the neighbour whose last retained binary bit is 0. “Even” describes the retained binary digits, not the last digit of a printed decimal.\n\nKeep binary32 selected. Enter `16777216` and press Apply value. Read Next larger value, then press Add 1 to the stored value. Compare Exact sum before rounding with Stored sum after rounding. Step to next smaller value and Step to next larger value move between representable values; they do not add or subtract one.",
  after:
    "Normal binary32 has 24 significant binary digits: the implied leading 1 and 23 stored fraction bits. With a fixed exponent, adjacent values differ by one step in the last fraction bit. Increasing the power-of-two scale also increases that step.\n\nAt 16777216, which is 2²⁴, the next greater binary32 value is two units away. An increase of one is halfway between neighbours. Binary32 can therefore lose a one-unit increment at this scale. More fraction bits make the steps smaller at the same scale, which is why binary64 can preserve changes that binary32 rounds away. More bits still do not make every decimal fraction exact.",
  exercise:
    "Now apply the spacing rule to a different input. Enter the rounded result. Use the last retained binary bit rather than whether the input is even or odd, then compare your reasoning with the feedback.",
} as const;
