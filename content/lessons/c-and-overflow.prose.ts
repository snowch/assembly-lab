// Copyright © 2026 Christopher Snow

// Kept word for word in docs/notes/module-11/prose.md.
export const PROSE = {
  question:
    "The trip computer wants to know whether a signed distance can increase. The C expression `distance + 1 > distance` appears to ask whether adding one made it larger. **Why does the recorded compiler output return true without performing an addition?**",
  questionNoteSummary: "The compiler and the C rules",
  questionNote:
    "These records use GCC 16.1 for little-endian AArch64 Linux. Unless a figure says otherwise, the settings are `-O1 -std=c23`: the same optimisation level used earlier, with C23 language rules selected.\n\nThe course cites the public C draft N3096. A recorded instruction sequence shows what this compiler produced. The C rules determine which source-program behaviours an implementation must support.",
  motivation:
    "On this target, a signed `int` ranges from −2147483648 to 2147483647. C's `<limits.h>` header provides the names `INT_MIN` and `INT_MAX` for these bounds. `#include <limits.h>` makes those names available to the source.\n\nAdding one to `INT_MAX` overflows signed `int`. C describes this as **undefined behaviour**: the language places no requirements on what the program does in that case. It does not promise a wrapped value, a random value or an error message.\n\nWhenever this signed addition is defined, adding one makes the value larger. GCC can therefore replace the comparison with true. It has no obligation to preserve a particular result for the overflowing input. The processor executes the resulting instructions; it does not know that a C expression was signed.\n\nModule 10’s small compiler checks its own supported language. It is not a general detector of undefined C behaviour.",
  prediction:
    "Now run a separate assembly experiment: `adds w0, w0, #1` with `w0` initially holding 2147483647. This executes A64 directly. It is not an execution of the original C expression.",
  predictionQuestion: "**What bit pattern does the addition leave in `w0`?**",
  predictionExplain:
    "It leaves `0x80000000`, whose signed 32-bit reading is −2147483648. The flags are `N=1, Z=0, C=0, V=1`: the top result bit is set, the result is nonzero, there is no unsigned carry, and signed overflow occurred.\n\nA64 defines those bits and flags. C does not require a compiler to implement an overflowing signed C expression with this instruction sequence.",
  investigation:
    "Compare the two recorded compilations of `can_increment`. The second adds GCC's `-fwrapv` setting, which promises wrapping signed addition, subtraction and multiplication. This is an extra compiler guarantee, not the standard C rule.\n\nWith wrapping required, the compiler must account for the input at the top of the signed range. It can compare the original input with the limit instead of literally adding one. A compiler setting changes the behaviour that must be preserved; it does not necessarily require one particular instruction.\n\n`-fwrapv` does not define every otherwise undefined operation. It does not, for example, make C division by zero valid.",
  construction:
    "Test the input against its limit before calculating a value that might overflow. First write the limit test on its own.",
  writeTask:
    "Write `increment_limit`. A signed distance arrives in `w0`. Return 1 if it equals `INT_MAX`, or 0 otherwise. You may use `w1` as a temporary register. Do not add one to the distance to perform this test.",
  writeHints: [
    "Compare the original distance with the maximum signed value.",
    "Do not increment the distance before testing it. Test the original input against 2147483647.",
    "For input zero, the answer is zero: it does not equal the maximum signed value. The check reports equality, not the incremented distance.",
    "The result must be one only when the inputs are equal, so use `cset` with the equality condition.",
    "Write `mov w1, #2147483647`, `cmp w0, w1`, `cset w0, eq` and `ret`.",
  ],
  failureExperiment:
    "Run the original `can_increment` source compiled with `-fwrapv`, using `INT_MAX` as the distance. The compiler must now preserve the wrapping rule for the signed addition.",
  failureQuestion: "**Does this compiled function return 0 or 1?**",
  failureExplain:
    "It returns 0. Under `-fwrapv`, adding one to the maximum signed value wraps to the minimum signed value, so the comparison is false.\n\nThe recorded instructions obtain that answer by comparing the original input with `INT_MAX`. They do not need an overflowing addition. This is the result of this GCC setting and source, not a promise about every compiler configuration.",
  explanation:
    "For ordinary signed C, check the operands before an addition that might overflow. Testing `a + b` after calculating it is too late if that calculation already has undefined behaviour.\n\nFor a positive `b`, the sum is too large when `a > INT_MAX - b`. For a negative `b`, the sum is too small when `a < INT_MIN - b`. Evaluate each bound subtraction only in its corresponding branch. Those subtractions stay within range there.\n\nThe one-step increment needs only the upper-bound check. If the input equals `INT_MAX`, keep it unchanged. Otherwise, adding one is representable, including for every negative input.",
  generalisation:
    "`safe_increment` follows that rule: return the maximum unchanged, otherwise add one. Its result stops increasing at the maximum, a behaviour called **saturation**. Every signed input has a defined result.\n\nAfter you complete the exercise, you can inspect a recorded branch listing made with `-O1 -std=c23 -fno-if-conversion -fno-if-conversion2`. The extra settings keep this conditional as a branch so you can inspect it. Ordinary `-O1` uses a different instruction outside the course's taught subset.\n\nUse the same order elsewhere: decide whether the operation is allowed, then perform it. Module 5's unsigned loops and Module 8's division examples show other places where a machine result and a source-language rule must be distinguished.",
  generalisationNoteSummary: "The minimum value and text input",
  generalisationNote:
    "The signed range is asymmetric: its minimum has no matching positive `int` value on this target. Negating `INT_MIN` in signed `int` overflows.\n\nA text parser converts written digits into an integer. One approach starts at zero and reads the digits in order. For each digit, it multiplies the current value by ten and adds the digit’s value. If the text begins with a minus sign, it negates the result.\n\nThat approach fails for `-2147483648` when the accumulated value is an `int`. Building positive 2147483648 already exceeds the range, before the final negation. Use a wider type with checks, or check each step while accumulating a negative value. The sign at the end cannot repair earlier undefined arithmetic.",
  finalTask:
    "Write `safe_increment`. A signed distance arrives in `w0`. If it is `INT_MAX`, return it unchanged. Otherwise, return the distance plus one in `w0`.\n\nUse a comparison before the addition to follow the C-safe approach shown above. The tests check the returned values, including both signed limits. They do not prove the safety of an arbitrary C program.",
  finalHints: [
    "There are two paths: return the maximum unchanged, or add one.",
    "Adding before checking can already overflow. Compare the input with 2147483647 first.",
    "For input zero, the limit check allows the addition and the function returns 1. Only the maximum value must skip that addition.",
    "On the other path, add one to `w0`, then return.",
    "Write `mov w1, #2147483647`, `cmp w0, w1`, `b.eq done` and `add w0, w0, #1`. Put `ret` under `done:`.",
  ],
  reflection:
    "- A64 defines instruction results that signed C overflow does not promise.\n- Undefined behaviour gives no required result for the affected C case.\n- A compiler can use the rules for defined inputs to remove a calculation.\n- A documented option such as `-fwrapv` changes some of those rules.\n- Check signed arithmetic bounds before performing the operation.\n\nWhy can the ordinary compilation return true without adding, while the `-fwrapv` compilation needs to distinguish the maximum input?",
  reflectionNoteSummary: "Answer",
  reflectionNote:
    "In standard C, every defined case of this expression makes the comparison true. The overflowing case places no requirements on the result. With `-fwrapv`, that boundary case has a specified wrapped result and must make the comparison false.",
  modelVsReality: "",
  originalityNote: {
    textbookExample: "A signed-overflow puzzle presented as surprising compiler behaviour.",
    howThisDiffers:
      "A trip-distance increment separates a direct A64 experiment from two recorded compiler contracts. The learner first writes a boundary test, then reuses that test to make a defined saturating increment.",
  },
} as const;
