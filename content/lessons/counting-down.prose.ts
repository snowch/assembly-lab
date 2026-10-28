// Copyright © 2026 Christopher Snow

// Lesson 2 of Module 5. Kept word for word in docs/notes/module-5/prose.md.
export const PROSE = {
  question:
    "The dashboard's dimming rule is still to halve an unsigned brightness setting at each idle tick, dropping any remainder. This time, the function receives the number of ticks to apply.\n\n" +
    "`dim_down` reduces `ticks` after each dimming operation. The C uses `while (ticks != 0)` to repeat until no ticks remain. `ticks--` subtracts 1 from `ticks`.\n\n" +
    "GCC uses `subs` and `bne` at the bottom of this loop. There is no separate `cmp`. **Where does the branch get its flags?**",
  questionNoteSummary: "Which compiler?",
  questionNote: "GCC 16.1 with `-O1`, as in Module 0.",
  motivation:
    "Counting down makes the stopping value zero. Subtracting already tells the processor whether the result is zero: `subs` writes the result and updates Z. Z is 1 when the result is zero, and 0 otherwise. A later branch can use that flag.\n\n" +
    "The function must also handle a count that starts at zero. No dimming is needed in that case. The first instruction, `cbz w1, .L2`, skips the body and reaches `ret`.",
  prediction: "The figure runs `dim_down(128, 3)` on GCC's listing.",
  predictionQuestion:
    "**How many times does the dimming operation run before the function returns?**",
  predictionExplain:
    "The dimming operation runs three times. The remaining tick count falls from 3 to 2, then 1, then 0. The brightness falls from 128 to 64, then 32, then 16.\n\n" +
    "The final `subs` produces zero, so it sets Z to 1. `bne` is then not taken, and `ret` returns 16.",
  investigation:
    "`brightness` arrives in `w0`, and `ticks` arrives in `w1`. `cbz` checks the initial tick count without reading or changing the flags.\n\n" +
    "Each iteration runs `lsr` to dim the display, then `subs w1, w1, #1` to reduce the count. `bne .L3` reads the flags that `subs` just set. It repeats the body when Z is 0, because ticks remain. When the count reaches zero, Z is 1 and the function returns.\n\n" +
    "Choose a tick count in the figure. A zero count skips the body. The other runs show the brightness changing after each dimming operation.",
  construction:
    "Write a countdown loop that uses the flags from subtraction. Preserve the initial test so a zero count leaves the brightness unchanged.",
  writeTask:
    "Write `dim_down(brightness, ticks)`. Both arguments are unsigned. Halve the brightness once for each tick, dropping any remainder, then return the final brightness. If `ticks` is zero, return the original brightness.\n\n" +
    "- `brightness` arrives in `w0`.\n- `ticks` arrives in `w1`.\n\nReturn the result in `w0`. Use `cbz`, `lsr`, `subs`, branches and `ret`. A separate `cmp` is not available: use the flags from `subs`.",
  writeHints: [
    "Handle a count of zero before running the first shift.",
    "A branch to the instruction after the shift would skip dimming on later iterations. The repeat label must include the shift.",
    "In the first iteration of `dim_down(128, 3)`, the shift changes brightness to 64. Subtracting 1 changes the count from 3 to 2, so Z is 0 and ticks remain.",
    "Use `b.ne` to repeat when the subtraction result is not zero. If no instruction changes the flags in between, the branch reads the flags from `subs`.",
    "Start with `cbz w1, done`. Under `again:`, put `lsr w0, w0, #1`, `subs w1, w1, #1` and `b.ne again`. Under `done:`, put `ret`.",
  ] as const,
  failureExperiment:
    "A `do` loop runs its body before testing the condition. GCC's `dim_do` listing has no initial `cbz`. It starts with the shift, subtracts 1 from the count, then tests whether to repeat.\n\n" +
    "The figure runs `dim_do(128, 0)`. The simulator will stop this trace after 20 instructions if the function has not returned.",
  failureQuestion:
    "**Does the function return within this trace, or does the simulator reach its limit?**",
  failureExplain:
    "The simulator reaches its limit. The first shift halves the brightness even though the count starts at zero. The subtraction then changes the unsigned count from 0 to 4294967295, which is `0xffffffff`. That result is not zero, so `bne` repeats the body.\n\n" +
    "This call is very long, but finite. Repeated subtraction eventually brings the count back to zero. It takes 2³² iterations in total, including the first one.\n\n" +
    "The stepper shows the remaining count in `w1`, alongside the brightness in `w0` and the flags. The trace contains only the first 20 instructions. Its limit is not evidence that a loop runs forever; the count's changes tell us why this one eventually stops.",
  explanation:
    "A `while` loop tests before its first iteration. A `do` loop tests after its first iteration, so its body always runs at least once. That difference matters when the requested count is zero.\n\n" +
    "With a positive count, these two functions perform the same number of dimming operations and return the same brightness. With a zero count, `dim_down` skips the body. `dim_do` runs the body anyway: it shifts the brightness, then subtracts from zero.\n\n" +
    "Unsigned subtraction wraps, as Module 2 showed. It does not produce a negative count that could stop the loop.",
  wrongComparison:
    "The stepper below runs course-written assembly. After subtracting, it compares the remaining unsigned count with zero and repeats on `cs`: higher or same.\n\n" +
    "Every unsigned value is at or above zero. `cmp w1, #0` therefore always sets C to 1, including when `w1` is zero. It overwrites the flags from `subs`, and `bcs` always branches back. This loop never reaches `ret`.\n\n" +
    "The condition proves why this assembly keeps running. A trace that reaches its instruction limit, by itself, would not prove that.",
  generalisation:
    "A different mistake is to use `while (ticks >= 0)` with unsigned `ticks`. Unlike the test in `dim_do`, this condition can never become false. Subtracting from zero wraps to the largest unsigned value, which still passes the test.\n\n" +
    "For `dim_wrong`, GCC 16.1 at `-O1` emits a branch to its own label. That recorded assembly repeats forever. It is not a promise about every C compiler.\n\n" +
    "For a countdown, test whether work remains. An unsigned count cannot become negative.",
  generalisationNoteSummary: "What the C standard permits",
  generalisationNote:
    "C distinguishes an always-true test from a constant expression. `ticks >= 0` reads a variable, so it is not a constant expression, even though unsigned `ticks` makes it always true.\n\n" +
    "C23 draft N3096, section 6.8.5 paragraph 4, lets a compiler assume termination for such a loop if it performs none of the specified observable operations. These include input and output: effects beyond ordinary changes to local variables.\n\n" +
    "`dim_wrong` changes only local variables, so it meets these conditions. For example, a compiler may remove this loop instead of emitting instructions that repeat forever. The recorded GCC listing shows one compiler's choice; the C source does not guarantee that choice.",
  finalTask:
    "Write `dim_until_dark(brightness, ticks)`. Return the same brightness as `dim_down`, but stop as soon as either the count or the brightness is zero. Shifting zero again cannot change the result.\n\n" +
    "Both arguments are unsigned:\n\n- `brightness` arrives in `w0`.\n- `ticks` arrives in `w1`.\n\nReturn the brightness in `w0`. Use `cbz`, `lsr`, `subs`, branches and `ret`.\n\n" +
    "The tests include the largest unsigned tick count. Your function must finish within the simulator's instruction limit, so it must stop when further shifts would do no work.\n\n" +
    "A 32-bit value becomes zero after at most 32 logical right shifts by one place. Each shift moves every remaining bit towards the bottom, and bits that pass the bottom are lost.",
  finalHints: [
    "There are two reasons to stop: no ticks remain, or the brightness is already zero.",
    "Shifting before checking a zero tick count would dim the display when no dimming was requested. Check the count first.",
    "With zero brightness and a nonzero tick count, another shift would still leave zero. A `cbz` on `w0` can return immediately in this case.",
    "After a shift, use `subs` to reduce the count and `b.ne` to repeat. Make the repeat label include the brightness check.",
    "Start with `cbz w1, done`. Under `again:`, put `cbz w0, done`, `lsr w0, w0, #1`, `subs w1, w1, #1` and `b.ne again`. Under `done:`, put `ret`.",
  ] as const,
  finalFeedback:
    "Check both stopping conditions. A zero tick count preserves the brightness; zero brightness needs no further shifts.",
  reflection:
    "- `subs` can change a count and set the flags needed by a branch.\n- A `while` loop can skip its body; a `do` loop runs it at least once.\n- An unsigned value is always at or above zero.\n- Reaching the simulator's instruction limit does not prove that a loop runs forever.\n- A loop can stop early when further work cannot change its result.",
  modelVsReality: "",
  originalityNote: {
    textbookExample: "A factorial countdown or an unsigned loop that prints decreasing integers.",
    howThisDiffers:
      "The dashboard's dimming loop compares a zero-count entry check with a do loop, then uses zero brightness to bound useful work even for the largest unsigned count.",
  },
} as const;
