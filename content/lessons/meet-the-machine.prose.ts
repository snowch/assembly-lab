// Copyright © 2026 Christopher Snow

// Module 0's prose: the paragraphs, hints, tasks and notes of the lesson, as drafted by Haiku from
// checked facts and kept word for word from docs/notes/module-0/prose.md. meet-the-machine.prose.test.ts
// holds every string here to that file, so a change of wording is made there first.

export const PROSE = {
  question:
    "The trip computer logs each trip's distance. Each trip has three parts, called legs. Their distances include a private detour. To leave that detour out of the log, the computer adds the three distances and subtracts the detour.\n\n" +
    "The C function `trip_distance` does this with three arithmetic statements and a return statement. GCC, a C compiler, translated that function into four instructions for a 64-bit Arm processor. Each **instruction** tells the processor to perform an operation. The figure pairs the instructions with the related C statements.\n\n" +
    "The instructions are written in **assembly language**, which uses names such as `add` for operations. The compiler's output shown this way is called a **listing**. You will follow its four instructions one at a time, to see what the processor does.",
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

  motivation:
    "The compiler translates C into instructions that the processor runs. Following those instructions shows each step of the calculation and where the processor keeps each result. This function has four instructions, so you can follow them one at a time. You will read instructions like these throughout the course.",

  prediction:
    "A **register** is a small store inside the processor that holds one value. `w0`, `w1`, `w2` and `w3` are four of them.\n\n" +
    "The C names a variable, `total`. The instructions name no variable at all. They name `w0`, `w1`, `w2` and `w3`. The four arguments arrive in order: `leg1` in `w0`, `leg2` in `w1`, `leg3` in `w2` and `detour` in `w3`. The first instruction performs the addition in `int total = leg1 + leg2;`. Predict where the processor keeps that result.",
  predictionQuestion: "**After the first instruction runs, where is the value of `total` kept?**",
  predictionExplain:
    "Before the first instruction, `w0` holds `leg1`. The first instruction, `add w0, w0, w1`, replaces that value with `leg1 + leg2`, the first value of `total`. In this function, the next two arithmetic instructions update `w0` again as `total` changes.",
  // For a wrong choice, by the option's value. The right option has none.
  predictionFeedback: {
    "new-place":
      "The instructions name only registers, never variables. Look at the first instruction, `add w0, w0, w1`. Which register does it write to, and what does that register hold before it runs?",
    "not-kept":
      "Look at line 6 of the C, `return total;`. What does the function still need when it reaches that line, and where must the processor keep it?",
    w3: "`w3` holds `detour`. The third instruction, `sub w0, w0, w3`, still needs it. What happens to a value when another value is written into the same register?",
  },

  investigation:
    "The simulator is a JavaScript program that loads with this page and runs in your browser. It imitates the processor, one instruction at a time. The instructions are GCC's real output. Only the running is imitated. The course calls the simulator its model of the processor.\n\n" +
    "The figure runs `trip_distance(120, 85, 42, 15)`. Each register is shown as a decimal number. Press Show the bits to see all four registers as 32-bit patterns. The `w` in `w0` names those 32 bits. Module 1 shows the rest of each register.\n\n" +
    "The marker shows which instruction runs next. The processor tracks that position in its **program counter**, a special register. Ordinary instructions do not name it the way they name `w0`.\n\n" +
    "An instruction's parts after its name are its **operands**. In `add w0, w0, w1`, the first operand is where the result goes. The other two are the values it adds.\n\n" +
    "Press Next to run one instruction. The figure then shows what that instruction read, what it wrote, and which registers it left alone. Press Back to undo a step.\n\n" +
    "At each step, look for two things: which register the instruction writes, and which registers it leaves alone.",
  // Shown by the stepper once the run has ended.
  investigationEnd:
    "`ret` returns to the code that called this function. The function's result is whatever `w0` holds at that moment.",

  construction:
    "A second function, `fuel_used`, should return the litres used on a trip. That is the fuel at the start minus the fuel at the end. Its C was written the wrong way round: `return at_end - at_start;`. GCC turned it into `sub w0, w1, w0` and `ret`.\n\n" +
    "`at_start` arrives in `w0`, and `at_end` in `w1`.\n\n" +
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
    "The processor keeps a program's instructions and values outside its registers, in a place called **memory**. In this example, `fuel_used`'s instructions come straight after `trip_distance`'s in memory.\n\nThe figure uses GCC's output from correct C, so `fuel_used` is `sub w0, w0, w1`, then `ret`. The figure has a switch. It deletes `ret` from `trip_distance`, then runs `trip_distance(120, 85, 42, 15)` again.",
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
    "The instructions are kept one after another in memory. The program counter tracks which one runs next. After most instructions, it moves on to the next one. `ret`, and the instructions of later modules, can send it to a different instruction.\n\n" +
    "So far, `add` and `sub` read registers and write one register. The names `leg1` and `total` are not in the instructions.\n\n" +
    "For the functions in this lesson, the `int` arguments arrive in order in `w0`, `w1` and so on. Each function leaves its `int` result in `w0`. `ret` returns to the code that called the function.",

  generalisation:
    "Later modules add instructions that change which instruction runs next, and instructions that read and write memory. You will follow their effects in the same way.\n\n" +
    "The compiler chooses the registers and the instructions. `-O0` and `-O1` are two of GCC's optimisation settings. You choose a setting when you compile the C.\n\nAt `-O0`, which means no optimisation, GCC 16.1 makes twenty instructions from `trip_distance`. It stores the variables in memory, loads their values into registers for arithmetic, and stores the results back in memory. At `-O1`, the setting used here, GCC produces four instructions and keeps this function's values in registers. The compiler version and settings matter when you compare listings.",

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
    "- `add` and `sub` read values from registers and write their result to a register.\n" +
    "- The processor runs instructions, not C variable names. A register does not keep the name of the C variable whose value it holds.\n" +
    "- Instructions run one after another unless an instruction changes that.\n" +
    "- `ret` returns to the code that called the function.\n\n" +
    "Before `sub w1, w2, w1` runs, `w1` holds 5 and `w2` holds 9. Which register changes, and what do `w1` and `w2` hold afterwards?",
  // The section's closed note, titled by `LABELS.details.reflection`.
  reflectionAnswer: "`w1` changes. It becomes 9 minus 5, which is 4. `w2` still holds 9.",

  modelVsReality:
    "The simulator runs one instruction per step. A real processor works on many instructions at once, and it may run them out of order. It still guarantees the same results as running them one at a time. That guarantee is all this lesson relies on.",
} as const;
