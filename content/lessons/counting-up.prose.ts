// Copyright © 2026 Christopher Snow

// Lesson 1 of Module 5. Kept word for word in docs/notes/module-5/prose.md.
export const PROSE = {
  question:
    "The trip computer dims its dashboard after each idle tick. In this example, each tick halves an unsigned brightness setting and drops any remainder. This is a chosen dimming rule, not a description of display hardware.\n\n" +
    "`dim_up` applies that rule for each tick from `start` up to, but not including, `end`. `brightness >>= 1` means `brightness = brightness >> 1`. The C below repeats that operation with a `for` loop.\n\n" +
    "**How can a fixed set of instructions repeat the dimming operation a different number of times for different inputs?**",
  questionNoteSummary: "Which compiler?",
  questionNote: "GCC 16.1 with `-O1`, as in Module 0.",
  motivation:
    "A **loop** repeats part of a program while a condition holds. The repeated part is its **body**. Each execution of that body is one **iteration**. Here, the body halves `brightness`.\n\n" +
    "The `for` first sets `tick` to `start`. It tests `tick < end` before running the body. After the body, `tick++` adds 1 to `tick`. It repeats the test before each later iteration. If the first test is false, the body never runs.\n\n" +
    "These endpoints use ordinary unsigned ordering. They do not describe elapsed time across a counter wrap: if `start` is at or above `end`, there is no dimming to do.",
  prediction:
    "The stepper runs `dim_up(128, 2, 5)` on GCC's listing. Count only the instructions that execute, including `ret`.\n\nThese counts measure executed instructions, not elapsed time. A **trace** records the instructions that ran. The simulator limits its length; reaching that limit does not establish whether the function would eventually return.",
  predictionQuestion: "**How many instructions run before the function returns?**",
  predictionExplain:
    "The run executes 15 instructions. The first `cmp` and `bcs` run once. Then the four instructions under `.L3` run three times, as `tick` advances from 2 to 5. Finally, `ret` runs.\n\n" +
    "The brightness changes from 128 to 64, then 32, then 16. Each `lsr` writes the next brightness back to `w0`.",
  investigation:
    "`brightness` arrives in `w0`, `start` in `w1` and `end` in `w2`. `w1` then holds the changing value of `tick`.\n\n" +
    "The first `cmp` compares `start` with `end`. `bcs .L2` goes straight to `ret` when `start` is at or above `end`, using the unsigned condition `cs`. This first test prevents an unwanted iteration.\n\n" +
    "When `start` is below `end`, execution reaches `.L3`. `lsr` halves the brightness in `w0`. `add` advances the tick in `w1`. `cmp` then tests whether the tick has reached `end`.\n\n" +
    "`bne .L3` goes backwards to the same `lsr` when the tick and `end` are unequal. That branch runs the body again. When they are equal, the branch is not taken and `ret` follows.\n\n" +
    "Choose different endpoints in the figure. Its bar counts executions of the dimming operation. The stepper counts every instruction, including the tests and branches.",
  construction:
    "Build the same dimming function from instructions you already know. The first test matters as much as the branch that repeats the body.",
  writeTask:
    "Write `dim_up(brightness, start, end)`. All arguments are unsigned. For each tick from `start` up to, but not including, `end`, halve the brightness and drop any remainder. Return the final brightness. If `start` is at or above `end`, return the original brightness.\n\n" +
    "`brightness` arrives in `w0`, `start` in `w1`, and `end` in `w2`. Return the result in `w0`. Use `cmp`, branches, `lsr`, `add` and `ret`.\n\n" +
    "The tests include equal and descending endpoints, and an interval that ends at the largest unsigned value.",
  writeHints: [
    "Decide whether any work is needed before the first shift.",
    "A signed comparison can put large unsigned endpoints in the wrong order. Forgetting equality also runs the body when no ticks were requested.",
    "In the first iteration of `dim_up(128, 2, 5)`, the shift changes brightness from 128 to 64. The increment changes the tick from 2 to 3.",
    "Put a label before the shift. After advancing the tick, test whether another iteration is needed and branch back to that label.",
    "Use `cmp w1, w2` and `b.cs done` before `again:`. Under `again:`, put `lsr w0, w0, #1`, `add w1, w1, #1`, `cmp w1, w2` and `b.cc again`. Under `done:`, put `ret`.",
  ] as const,
  failureExperiment:
    "The program below has its backward branch changed from `bne .L3` to `beq .L3`. The other instructions are unchanged. Predict its result for `dim_up(128, 2, 5)`.",
  failureQuestion: "**What brightness does the changed function return?**",
  failureExplain:
    "The changed function returns 64 after one iteration and seven instructions. The first shift changes the brightness from 128 to 64. The increment changes the tick from 2 to 3.\n\n" +
    "The tick is not yet equal to `end`, which is 5. The new `beq` is therefore not taken, and execution reaches `ret`. The original `bne` would have repeated the body.",
  explanation:
    "GCC uses different comparisons at the beginning and end of this loop. The first asks whether `start` is at or above `end`. The later comparison asks only whether `tick` equals `end`.\n\n" +
    "Once the first test admits the run, `tick` starts below `end` and increases by 1. It must reach `end`; it cannot skip over it. That is why testing for inequality is enough at the bottom of this loop.\n\n" +
    "The last increment changes `end - 1` to `end`. Even when `end` is the largest unsigned value, the increment does not wrap. The loop stops before another increment could do so.\n\n" +
    "The order of the operands in the final `cmp` does not change whether they are equal. It would matter for a condition that asks which value is larger.",
  generalisation:
    "A branch can go to an earlier instruction just as it can go to a later one. Returning to an earlier instruction lets a small listing do repeated work.\n\n" +
    "To understand a loop, first check whether it tests before the first iteration. Find the instructions that do the work and the change that lets the loop stop. Then follow the branch that decides whether to repeat.",
  finalTask:
    "For GCC's original `dim_up` listing, give the returned brightness and the number of instructions that run for each call: `dim_up(128, 7, 7)`, `dim_up(128, 7, 8)` and `dim_up(128, 7, 9)`. Enter decimal numbers.\n\n" +
    "Count every executed instruction, including `ret`. Do not count labels.",
  finalHints: [
    "Work out how many times the body runs for each pair of endpoints.",
    "Skipping the body does not mean skipping every instruction. The initial `cmp` and `bcs` still run.",
    "For the equal endpoints in `dim_up(128, 7, 7)`, follow the initial `cmp` and `bcs` straight to `ret`. There is no iteration to count.",
    "Every call also runs `ret`. Add those instructions to the instructions from the iterations.",
    "The results and instruction counts are 128 and 3; 64 and 7; 32 and 11.",
  ] as const,
  finalFeedback:
    "Follow the initial test first. Count each instruction that runs, including every branch and `ret`.",
  reflection:
    "- A loop repeats its body. Each execution of the body is one iteration.\n- A branch to an earlier instruction can repeat the same work.\n- A test before the body can skip all iterations.\n- The count of iterations differs from the count of instructions.",
  modelVsReality: "",
  originalityNote: {
    textbookExample: "Adding consecutive integers or computing a factorial with a counting loop.",
    howThisDiffers:
      "A dashboard brightness setting is halved for an interval of idle ticks. The learner follows repeated shifts and handles empty, descending and boundary intervals.",
  },
} as const;
