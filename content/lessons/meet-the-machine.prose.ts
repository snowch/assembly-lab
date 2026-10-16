// Copyright © 2026 Christopher Snow

// Module 0's prose: the paragraphs, hints, tasks and notes of the lesson, as drafted by Haiku from
// checked facts and kept word for word from docs/notes/module-0/prose.md. meet-the-machine.prose.test.ts
// holds every string here to that file, so a change of wording is made there first.

export const PROSE = {
  question:
    "The trip computer keeps a work log of distances driven. For one trip, the distance in the log is the three legs added together, minus a private detour. The log must not include that detour.\n\n" +
    "The C function `trip_distance` computes that distance in three statements. The figure below shows it. GCC, a C compiler, version 16.1, set to `-O1`, turned it into four instructions for a 64-bit Arm processor. The course uses `-O1` so the code stays short enough to follow: at `-O0`, with no optimisation, GCC makes 20 instructions for this C, keeping every value in memory. At `-O1` the values stay inside the processor, and four instructions do the work, one for each step of the arithmetic and one to return. They are shown beside the C. The question is what the processor does, instruction by instruction, when this function runs.",

  motivation:
    "The C is a description. The compiler translates it, and the instructions are what the processor runs. When a program does something its C does not seem to say, the difference shows in the instructions. Every later module reads instructions like these. This function has only four, which is few enough to follow one at a time.",

  prediction:
    "A **register** is a small store inside the processor that holds one value. `w0`, `w1`, `w2` and `w3` are four of them.\n\n" +
    "The C names a variable, `total`. The instructions name no variable at all. They name `w0`, `w1`, `w2` and `w3`. The four arguments arrive in order: `leg1` in `w0`, `leg2` in `w1`, `leg3` in `w2` and `detour` in `w3`. Before you step through, commit to an answer.",
  predictionQuestion: "**Where does the processor keep `total`?**",
  predictionExplain:
    "The first instruction, `add w0, w0, w1`, writes its result into `w0`. So `total` lives in `w0`, and the value of `leg1` is gone once it runs.",

  investigation:
    "The figure runs `trip_distance(120, 85, 42, 15)` on the simulator in the page. These registers are used here at 32 bits, the size of an `int`. Module 1 shows the rest of each register. The figure draws each one as bits and as a decimal number.\n\n" +
    "The marker shows which instruction runs next. The processor keeps that position in a register of its own, the **program counter**. Press Next to run one instruction. The C line GCC recorded for each instruction is lit as it runs.\n\n" +
    "An instruction's parts after its name are its **operands**. In `add w0, w0, w1`, the first operand is where the result goes, and the other two are what it is made from. After that instruction runs, `w0` holds 205, which is 120 plus 85. `w1` still holds 85. After the second instruction `w0` holds 247; after the third, 232. `ret` ends the function. Its result is whatever `w0` holds then: 232.",
  questionAfter:
    "Line 7 beside `sub w0, w0, w3` is not a mistake. The figure shows the line GCC recorded for each instruction, unchanged. GCC records `sub w0, w0, w3` and `ret` against line 7, the closing brace. That one `sub` does the work of two lines: line 5, `total = total - detour;`, and line 6, `return total;`. It subtracts straight into `w0`, where the result leaves the function. So no instruction is left for `return total;`. If GCC is set to `-O0`, with no optimisation, it records its subtraction against line 5. The record of lines is there to help you find your way from an instruction back to the C. When the compiler merges lines, the line it records can move.",

  construction:
    "A second function, `fuel_used`, should return the litres used on a trip. That is the fuel at the start minus the fuel at the end. Its C was written the wrong way round: `return at_end - at_start;`. GCC turned it into `sub w0, w1, w0` and `ret`.\n\n" +
    "`at_start` arrives in `w0`, and `at_end` in `w1`.",
  fixTask:
    "Change the instructions so the function returns `at_start` minus `at_end`. Three calls test it. You can type the instructions, or tap a line to change it.",
  fixHints: [
    "`sub` writes its first operand as its second operand minus its third.",
    "The registers are right. Their order is not.",
    "`sub w0, w2, w3` puts `w2` minus `w3` into `w0`.",
    "The result must still go into `w0`. The second operand must be `at_start`, which is in `w0`.",
    "The whole answer is `sub w0, w0, w1`, then `ret`.",
  ] as const,

  failureExperiment:
    "The processor keeps a program's instructions and values outside its registers, in a place called **memory**. In memory, `fuel_used`'s instructions come straight after `trip_distance`'s. The figure uses GCC's output from correct C, so `fuel_used` is `sub w0, w0, w1`, then `ret`. The figure has a switch. It deletes `ret` from `trip_distance`, then runs `trip_distance(120, 85, 42, 15)` again.",
  failureQuestion: "**With `ret` deleted, what does `w0` hold when the run ends?**",
  failureExplain:
    "With no `ret`, the processor runs the next instruction in memory, which is `fuel_used`'s `sub w0, w0, w1`. That makes `w0` 232 minus 85, which is 147. Then `fuel_used`'s `ret` ends the run. Nothing marks where a function ends except `ret`.",

  explanation:
    "A program is a list of instructions, kept one after another. The program counter says which one runs next. After most instructions, it moves on to the next one in the list.\n\n" +
    "Each instruction here reads registers and writes one register. These instructions work only with the values in registers. The names `leg1` and `total` are not in the instructions.\n\n" +
    "A function's arguments arrive in `w0`, `w1` and onwards, and its result leaves in `w0`. `ret` ends the function and goes back to the code that called it. The written form of instructions, one per line, is **assembly language**. A compiler's instructions, written one per line, are its **listing**; GCC's listing is written in assembly language.",

  generalisation:
    "Every function in this course works this way. Longer functions have more instructions. Later modules add instructions that choose which instruction runs next, and instructions that read and write memory.\n\n" +
    "The compiler chooses the registers and the instructions. With the setting `-O0`, GCC makes twenty instructions from the same C, and they keep every variable in memory, outside the registers. So a listing belongs to one compiler at one setting.",

  challenge:
    "The car needs a service when its odometer reaches a set reading. The odometer reading does not yet include the trip so far. `km_to_service` returns the kilometres left before the service, after the trip so far and a planned trip. It keeps 50 km spare. Its four arguments are `service_at`, `odometer`, `trip_so_far` and `planned`, in `w0` to `w3`. GCC made five instructions from it, shown in the challenge below. The `#50` in the last `sub` is the number 50 written inside the instruction.",
  traceTask: "Without running the call `km_to_service(30000, 28750, 140, 390)`, give two values.",
  traceHints: [
    "Each `sub` writes only its first operand.",
    "A register no instruction writes keeps the value it arrived with.",
    "After `sub w0, w0, w1` alone, `w0` is 30000 minus 28750, which is 1250.",
    "`w1` arrives holding 28750, and no instruction writes `w1`.",
    "`w0` is 670 and `w1` is 28750.",
  ] as const,
  traceFeedbackW1:
    "A `sub` writes its first operand only, so ask which instruction, if any, writes `w1`.",
  traceFeedbackW0: "Take each `sub` in turn, and write down `w0` after each one.",

  reflection:
    "- Which register held `total`, and what happened to `leg1`?\n" +
    "- If the function needed `leg1` again after the first instruction, what would the compiler have had to do?\n" +
    "- Why did deleting `ret` change the result?\n" +
    "- What do the instructions know about the names `leg1` and `total`?",

  modelVsReality:
    "The simulator runs one instruction per step. A real processor works on many instructions at once, and it may run them out of order. It still guarantees the same results as running them one at a time. That guarantee is all this lesson relies on.",
} as const;
