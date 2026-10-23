// Copyright © 2026 Christopher Snow

// Module 0's prose: the paragraphs, hints, tasks and notes of the lesson, as drafted by Haiku from
// checked facts and kept word for word from docs/notes/module-0/prose.md. meet-the-machine.prose.test.ts
// holds every string here to that file, so a change of wording is made there first.

export const PROSE = {
  question:
    "A trip computer adds distances and subtracts a detour. How does the processor perform one of those operations? Start with one addition. You will combine operations into a complete function afterwards.",
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
    "A **register** is a small store inside the processor that holds one value. The names `w0`, `w1` and `w2` refer to three registers. Each name here selects 32 bits; Module 1 shows the rest of each register.\n\nAn **instruction** tells the processor to perform an operation. Assembly language writes instructions with names such as `add`. The parts after the name are its **operands**.\n\nFor `add` and `sub`, the first operand names the register written. The second and third supply the input values. Run the first addition, then try the next activities. Each activity replaces the previous one, so you can focus on its operation.",
  primitiveCaption: "Practise one operation at a time before following a complete function.",
  primitiveStages: [
    {
      title: "Add into a different register",
      prose:
        "`add w2, w0, w1` reads `w0` and `w1`, adds their values, and writes the sum into `w2`. Run it to see the result.",
    },
    {
      title: "Choose a different destination",
      prose:
        "This addition uses different inputs and writes a different register. Predict its result before running it. The first operand still names the destination.",
    },
    {
      title: "Read a register, then replace its value",
      prose:
        "The same register can supply an input and receive the result. The instruction reads the old values before writing. Predict the new value in `w0`.",
    },
    {
      title: "Subtract in operand order",
      prose:
        "`sub` subtracts the third operand from the second, then writes the first operand. Predict the value this instruction writes.",
    },
    {
      title: "Run two instructions in order",
      prose:
        "The marker ▸ shows the instruction that runs next. Run each instruction in turn. The second uses the state left by the first. The activity stops after these two instructions.",
    },
  ],

  prediction:
    "Now combine those operations. The trip computer logs three distances, called legs, with a private detour removed. The C function `trip_distance` adds the three legs and subtracts the detour.\n\nGCC, a C compiler, translated this function into four instructions for a 64-bit Arm processor. Its assembly output is called a **listing**. The complete C and its related instructions appear together below.\n\nFor the functions here, integer arguments arrive in registers in order: the first in `w0`, the second in `w1`, and so on. They leave their result in `w0`. The instruction `ret` returns to the code that called the function; it does not calculate or move the result. The line ending in a colon names the function.\n\nThe C names a variable, `total`. The instructions name registers. Use the operand rule you practised to decide where the first value of `total` goes.",
  argsSay: "The first instruction is `add w0, w0, w1`.",
  argsQuestion:
    "It adds two register values and stores the result. Where will the C variable `total` be kept?",
  argsExplain:
    "The `add` instruction overwrites `w0` with the sum. The C variable `total` does not need a separate register.",
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
    "The stepper figure runs `trip_distance(120, 85, 42, 15)`. Each register is shown as a decimal number. Press Show the bits to see all four registers as 32-bit patterns. The `w` in `w0` says this instruction works on those 32 bits. A register is wider than that. Module 1 shows the rest of each register.\n\n" +
    "The marker ▸ shows which instruction runs next. The processor tracks that position in its **program counter**, a special register. Ordinary instructions do not name it the way they name `w0`.\n\n" +
    "Press Next to run one instruction. The status names what ran and what runs next. The outlined register was written by the last instruction. Apply the operand rule you practised to follow each result. Back undoes a step; Reset starts again.",
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
