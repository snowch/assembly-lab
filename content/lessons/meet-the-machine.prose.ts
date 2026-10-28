// Copyright © 2026 Christopher Snow

// Synthesis prose and retained hints/tasks/notes. Drafted separately from checked facts;
// canonical copy: docs/notes/module-0/prose.md. The prose test holds both directions.

import { SYNTHESIS_COPY } from "./fundamentals.prose";

export const PROSE = {
  question: SYNTHESIS_COPY.question,
  // Two notes under the listing, each shut until the learner opens it.
  compilerNote: {
    summary: "Which compiler made these instructions?",
    body:
      "Compiler Explorer, an online compiler service, ran GCC version 16.1.0 for 64-bit Arm Linux to make these instructions. It used the optimisation setting `-O1`, which asks GCC to make the code shorter and faster.\n\n" +
      "To use the same settings locally, save the C shown above as `trip.c`. With GCC 16.1.0 for 64-bit Arm Linux installed as `aarch64-linux-gnu-gcc`, the equivalent command is:\n\n" +
      "```sh\naarch64-linux-gnu-gcc \\\n  -g \\\n  -o trip.s \\\n  -fno-verbose-asm \\\n  -S \\\n  -fdiagnostics-color=always \\\n  -O1 \\\n  trip.c\n```\n\n" +
      "Each backslash continues the command on the next line. This command includes every option Compiler Explorer used. The local filenames `trip.c` and `trip.s` replace the service's temporary paths `/app/example.c` and `/app/output.s`.\n\n" +
      "`-S` produces assembly text, and `-o trip.s` names the output file. `-g` includes the C line references shown in the compiler details. `-fno-verbose-asm` suppresses extra assembly comments. `-fdiagnostics-color=always` colours compiler messages; it does not change the instructions.\n\n" +
      "The assembly file also contains compiler and debugging information that this page filters out.\n\n" +
      "With `-O0`, which means no optimisation, the same GCC makes twenty instructions from this C. The course uses `-O1` because its listings are short enough to follow.",
  },
  lineNote: {
    summary: "How are C statements matched to instructions?",
    body:
      "The course pairs instructions with the C operations they perform. Here, `sub w0, w0, w3` does the subtraction on line 5. The `ret` instruction returns from the function, as line 6 requires.\n\n" +
      "The arithmetic has already calculated the result. `ret` returns control to the code that called the function; it does not calculate or move the result.\n\n" +
      "GCC's original line references are kept in the compiler details. GCC 16.1 at `-O1` records both instructions against line 7, the closing brace. These references help debugging tools locate C code. They do not always identify the statement an instruction carries out.",
  },

  motivation: SYNTHESIS_COPY.motivation,

  prediction:
    "`trip_distance` adds three trip distances, called legs, then subtracts a detour. Its `int` arguments arrive in registers:\n\n- `leg1` arrives in `w0`.\n- `leg2` arrives in `w1`.\n- `leg3` arrives in `w2`.\n- `detour` arrives in `w3`.\n\nGCC 16.1.0 at `-O1`, an optimisation setting, made the four instructions below for 64-bit Arm. Follow the C variable `total` through the calculation: the instructions update `w0`, then `ret` returns with the result already there.",

  investigation:
    "Run `trip_distance(120, 85, 42, 15)` with Next. The C statement and instruction that just ran are highlighted together; ▸ marks the next instruction. An outlined register was written by the last instruction. Back undoes a step; Reset starts again.\n\nOn a narrow screen, swipe sideways within the listing to see the C and instructions. Show the bits changes the register display to 32-bit patterns.",
  // Shown by the stepper once the run has ended.
  investigationEnd:
    "`ret` returns to the code that called this function. The function's result is whatever `w0` holds at that moment.",

  construction:
    "A second function, `fuel_used`, should return the litres used on a trip. That is the fuel at the start minus the fuel at the end. Its C was written the wrong way round: `return at_end - at_start;`. GCC turned it into `sub w0, w1, w0` and `ret`.\n\n" +
    "The two arguments arrive in registers:\n\n- `at_start` arrives in `w0`.\n- `at_end` arrives in `w1`.\n\n" +
    "In a real project you would correct the C and compile it again; here you fix the instructions directly, to practise reading and changing assembly.",
  // Under the card of a failed "Fix the subtraction" test, only when the learner's result is the
  // reversed subtraction.
  fixReversedFeedback:
    "Your function subtracts the two values in the wrong order. `sub` writes its first operand. It subtracts its third operand from its second. Which value should come second?",
  fixTask:
    "Change the instructions so the function returns `at_start` minus `at_end`. Three calls test it. You can type the instructions, or tap a line to change it.",
  fixHints: [
    "`sub` writes its first operand as its second operand minus its third.",
    "In the code you start with, the registers are right. Their order is not.",
    "`sub w0, w2, w3` puts `w2` minus `w3` into `w0`.",
    "The result must still go into `w0`. The second operand must be `at_start`, which is in `w0`.",
    "The whole answer is `sub w0, w0, w1`, then `ret`.",
  ] as const,

  failureExperiment:
    "The processor keeps a program's instructions and values outside its registers, in a place called **memory**. In this example, `fuel_used`'s instructions come straight after `trip_distance`'s in memory.\n\nThe experiment's figure uses GCC's output from correct C, so `fuel_used` is `sub w0, w0, w1`, then `ret`. Its switch deletes `ret` from `trip_distance`, then runs `trip_distance(120, 85, 42, 15)` again.",
  // Shown immediately before the question: this prediction is a discovery experiment about
  // behaviour the learner has not yet seen, so they are invited to guess rather than recall.
  failureInvitation:
    "**This is a new situation.** Make your best prediction, even if you're unsure. You'll see what the processor does after you choose.",
  failureQuestion: "**With `ret` deleted, what does `w0` hold when the run ends?**",
  failureExplain:
    "The processor does not stop just because it reaches the next function. Without `ret`, it carries on with the instructions that follow. In this example, the two functions sit one after the other in memory. So the next instruction is `fuel_used`'s `sub w0, w0, w1`. The `sub` makes `w0` 232 minus 85, which is 147. Then `fuel_used`'s `ret` returns.",
  // For a wrong choice, by the option's value. The right option has none.
  failureFeedback: {
    "232":
      "Does the processor stop at the last instruction of `trip_distance` when `ret` is gone? Find out what is in memory straight after that instruction.",
    error:
      "Look at what is in memory straight after `trip_distance`'s last instruction. Is there an instruction there for the processor to run?",
    "0": "Read each instruction that runs, including any that come after `trip_distance`. Does any of them write 0 into `w0`?",
  },

  explanation:
    "A function name does not make the processor stop. In this example, execution advances through instructions in memory until `ret` returns to the caller. Removing that return lets the next function's instructions run with the values left in the registers.",
  generalisation:
    "The compiler chooses the registers and instructions. GCC 16.1 at `-O1` keeps this function's values in registers and produces four instructions. At `-O0`, which means no optimisation, it produces twenty instructions, storing variables in memory and reading them back for arithmetic. Compare listings with the compiler version and settings in mind.",
  challenge:
    "The car's odometer records the total distance it has travelled. The car needs a service when that reading reaches `service_at`. The `odometer` argument is the reading recorded before the current trip began. It does not include `trip_so_far`.\n\n`km_to_service` returns the kilometres left before the service, after allowing for the current trip and a planned trip. It also keeps 50 km spare. Its arguments are `service_at`, `odometer`, `trip_so_far` and `planned`, in `w0` to `w3`.\n\nGCC made the five instructions shown below. The `#50` in the last `sub` is the number 50 written inside the instruction.",
  traceTask: "Without running the call `km_to_service(30000, 28750, 140, 390)`, give two values.",
  traceHints: [
    "Each `sub` writes only its first operand.",
    "Do not change a register just because an instruction reads it. A register no instruction writes keeps its initial value.",
    "After `sub w0, w0, w1` alone, `w0` is 30000 minus 28750, which is 1250.",
    "`w1` arrives holding 28750, and no instruction writes `w1`.",
    "`w0` is 670 and `w1` is 28750.",
  ] as const,
  traceFeedbackW1:
    "A `sub` writes its first operand only, so ask which instruction, if any, writes `w1`.",
  traceFeedbackW0: "Take each `sub` in turn, and write down `w0` after each one.",

  reflection:
    "Trace the whole path: incoming arguments, each instruction's writes, and the return. A correct calculation is not enough if execution continues beyond the intended function.",

  modelVsReality: "",
} as const;
