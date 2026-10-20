# Module 0: the lesson's words, as drafted

Drafted by Haiku from the fact brief in `docs/notes/module-0/brief.md`, a part at a time; checked for facts by the managing session, which sent parts 6 and 8 back once (a word used in two senses, and a missing fact) and changed one sentence of part 7 to keep it true once memory is introduced. The lesson's `.prose.ts` and `.labels.ts` files take their words from here.

After the lesson's first review (16 October 2026) six parts were redrafted by Haiku from the review's surviving findings and checked for facts: the definition of a register moved before the first prediction, the closed note on the closing brace moved beside the first figure, the sentence that gave away the construction challenge's method was removed, and *listing*, `#50` and the odometer were explained.

After the author's second read (17 October 2026) thirteen texts were drafted by Haiku from a fact brief and checked for facts, and they replace or join the words below: section 1 (and the two closed notes beside its listing), the wrong-answer sentences of the prediction in section 3, section 4's paragraphs and its sentence for the end of the run, a sentence before the construction challenge and the feedback for the reversed subtraction in section 5, section 6's first paragraph, its wrong-answer sentences and its explanation, section 7's first paragraph, and section 10, which is now the list of what the lesson taught, a question and a closed answer. The lesson's `.prose.ts` and `.labels.ts` take these from this file too.

On 17 October 2026, a separate Codex drafting agent revised the prose from checked findings, followed by independent learner and technical review. See [the review record](./clarity-review.md).

## 0. Objectives

- Step through a compiled function one instruction at a time, and say what each instruction changed.
- Say which registers hold the arguments and results of this lesson's functions.
- Fix a compiled function so that it returns the right value.
- Say what `ret` does, and what happens without it.

## 1. What does the processor do?

The trip computer logs each trip's distance. Each trip has three parts, called legs. Their distances include a private detour. To leave that detour out of the log, the computer adds the three distances and subtracts the detour.

The C function `trip_distance` does this with three arithmetic statements and a return statement. GCC, a C compiler, translated that function into four instructions for a 64-bit Arm processor. Each **instruction** tells the processor to perform an operation. The figure pairs the instructions with the related C statements.

The instructions are written in **assembly language**, which uses names such as `add` for operations. The compiler's output shown this way is called a **listing**. You will follow its four instructions one at a time, to see what the processor does.

*The four instructions GCC made from trip_distance, paired with their related C statements. The line ending in a colon, trip_distance:, is the function's name.*

*Closed note under the listing, shut until the learner opens it.*

**Which compiler made these instructions?**

Compiler Explorer, an online compiler service, ran GCC version 16.1.0 for 64-bit Arm Linux to make these instructions. It used the optimisation setting `-O1`, which asks GCC to make the code shorter and faster.

To use the same settings locally, save the C shown above as `trip.c`. With GCC 16.1.0 for 64-bit Arm Linux installed as `aarch64-linux-gnu-gcc`, the equivalent command is:

```sh
aarch64-linux-gnu-gcc \
  -g \
  -o trip.s \
  -fno-verbose-asm \
  -S \
  -fdiagnostics-color=always \
  -O1 \
  trip.c
```

Each backslash continues the command on the next line. This command includes every option Compiler Explorer used. The local filenames `trip.c` and `trip.s` replace the service's temporary paths `/app/example.c` and `/app/output.s`.

`-S` produces assembly text, and `-o trip.s` names the output file. `-g` includes the C line references shown in the compiler details. `-fno-verbose-asm` suppresses extra assembly comments. `-fdiagnostics-color=always` colours compiler messages; it does not change the instructions.

The assembly file also contains compiler and debugging information that this page filters out.

With `-O0`, which means no optimisation, the same GCC makes twenty instructions from this C. The course uses `-O1` because its listings are short enough to follow.

*Closed note under the listing, shut until the learner opens it.*

**How are C statements matched to instructions?**

The course pairs instructions with the C operations they perform. Here, `sub w0, w0, w3` does the subtraction on line 5. The `ret` instruction returns from the function, as line 6 requires.

The arithmetic has already calculated the result. `ret` returns control to the code that called the function; it does not calculate or move the result.

GCC's original line references are kept in the compiler details. GCC 16.1 at `-O1` records both instructions against line 7, the closing brace. These references help debugging tools locate C code. They do not always identify the statement an instruction carries out.

## 2. Why the instructions matter

The compiler translates C into instructions that the processor runs. Following those instructions shows each step of the calculation and where the processor keeps each result. This function has four instructions, so you can follow them one at a time. You will read instructions like these throughout the course.

## 3. Where a variable is kept

A **register** is a small store inside the processor that holds one value. `w0`, `w1`, `w2` and `w3` are four of them.

The C names a variable, `total`. The instructions name no variable at all. They name `w0`, `w1`, `w2` and `w3`. The function receives four arguments. The processor places these values in registers before the first instruction runs.

*The four C parameters and the registers they arrive in; the first instruction follows.*

The first instruction is `add w0, w0, w1`. It adds two register values and stores the result. Where will the C variable `total` be kept?

*A prediction about where total is kept after the first instruction runs.*

*Shown once the prediction has been checked:* The `add` instruction overwrites `w0` with the sum. The C variable `total` does not need a separate register.

**After the first instruction runs, where is the value of `total` kept?**

- In `w0`, which now holds `leg1 + leg2`.
- In a new place of its own.
- It does not keep it until the function returns.
- In `w3`, in place of `detour`.

*Shown after the answer is checked.*

Before the first instruction, `w0` holds `leg1`. The first instruction, `add w0, w0, w1`, replaces that value with `leg1 + leg2`, the first value of `total`. In this function, the next two arithmetic instructions update `w0` again as `total` changes.

*Feedback for the option "In a new place of its own.":* The instructions name only registers, never variables. Look at the first instruction, `add w0, w0, w1`. Which register does it write to, and what does that register hold before it runs?

*Feedback for the option "It does not keep it until the function returns.":* Look at line 6 of the C, `return total;`. What does the function still need when it reaches that line, and where must the processor keep it?

*Feedback for the option "In `w3`, in place of `detour`.":* `w3` holds `detour`. The third instruction, `sub w0, w0, w3`, still needs it. What happens to a value when another value is written into the same register?

## 4. Stepping through

The simulator is a JavaScript program that loads with this page and runs in your browser. It imitates the processor, one instruction at a time. The instructions are GCC's real output. Only the running is imitated. The course calls the simulator its model of the processor.

The stepper figure runs `trip_distance(120, 85, 42, 15)`. Each register is shown as a decimal number. Press Show the bits to see all four registers as 32-bit patterns. The `w` in `w0` says this instruction works on those 32 bits. A register is wider than that. Module 1 shows the rest of each register.

The marker shows which instruction runs next. The processor tracks that position in its **program counter**, a special register. Ordinary instructions do not name it the way they name `w0`.

An instruction's parts after its name are its **operands**. In `add w0, w0, w1`, the first operand is where the result goes. The other two are the values it adds.

*How add uses its operands.*

*Shown once the prediction has been checked: the operands flow.*

Add

Before you press Next, say which register the next instruction will write. Press Next and the figure says whether you were right, then runs the instruction and shows what it read, what it wrote, and which registers it left alone. Press Back to undo a step.

At each step, look for two things: which register the instruction writes, and which registers it leaves alone.

*`trip_distance(120, 85, 42, 15)`, one instruction at a time. A register with an outline was written by the last instruction. The highlighted C statement and instruction show what just ran; the arrow marks the next instruction.*

*Shown once the run has ended.*

`ret` returns to the code that called this function. The function's result is whatever `w0` holds at that moment.

## 5. Fixing `fuel_used`

A second function, `fuel_used`, should return the litres used on a trip. That is the fuel at the start minus the fuel at the end. Its C was written the wrong way round: `return at_end - at_start;`. GCC turned it into `sub w0, w1, w0` and `ret`.

The two arguments arrive in registers:

- `at_start` arrives in `w0`.
- `at_end` arrives in `w1`.

In a real project you would correct the C and compile it again; here you fix the instructions directly, to practise reading and changing assembly.

**Fix the subtraction**

Change the instructions so the function returns `at_start` minus `at_end`. Three calls test it. You can type the instructions, or tap a line to change it.

1. `sub` writes its first operand as its second operand minus its third.
2. In the code you start with, the registers are right. Their order is not.
3. `sub w0, w2, w3` puts `w2` minus `w3` into `w0`.
4. The result must still go into `w0`. The second operand must be `at_start`, which is in `w0`.
5. The whole answer is `sub w0, w0, w1`, then `ret`.

*Feedback for the reversed subtraction:* Your function subtracts the two values in the wrong order. `sub` writes its first operand. It subtracts its third operand from its second. Which value should come second?

## 6. Removing `ret`

The processor keeps a program's instructions and values outside its registers, in a place called **memory**. In this example, `fuel_used`'s instructions come straight after `trip_distance`'s in memory.

The experiment's figure uses GCC's output from correct C, so `fuel_used` is `sub w0, w0, w1`, then `ret`. Its switch deletes `ret` from `trip_distance`, then runs `trip_distance(120, 85, 42, 15)` again.

**With `ret` deleted, what does `w0` hold when the run ends?**

- 232
- 147
- The run stops with an error
- 0

*Shown after the answer is checked.*

The processor does not stop just because it reaches the next function. Without `ret`, it carries on with the instructions that follow. In this example, the two functions sit one after the other in memory. So the next instruction is `fuel_used`'s `sub w0, w0, w1`. The `sub` makes `w0` 232 minus 85, which is 147. Then `fuel_used`'s `ret` returns.

*Feedback for the option "232":* Does the processor stop at the last instruction of `trip_distance` when `ret` is gone? Find out what is in memory straight after that instruction.

*Feedback for the option "The run stops with an error":* Look at what is in memory straight after `trip_distance`'s last instruction. Is there an instruction there for the processor to run?

*Feedback for the option "0":* Read each instruction that runs, including any that come after `trip_distance`. Does any of them write 0 into `w0`?

## 7. How a program runs

The instructions are kept one after another in memory. The program counter tracks which one runs next. After most instructions, it moves on to the next one. `ret`, and the instructions of later modules, can send it to a different instruction.

So far, `add` and `sub` read registers and write one register. The names `leg1` and `total` are not in the instructions.

For the functions in this lesson, the `int` arguments arrive in order in `w0`, `w1` and so on. Each function leaves its `int` result in `w0`. `ret` returns to the code that called the function.

## 8. Other functions

Later modules add instructions that change which instruction runs next, and instructions that read and write memory. You will follow their effects in the same way.

The compiler chooses the registers and the instructions. `-O0` and `-O1` are two of GCC's optimisation settings. You choose a setting when you compile the C.

At `-O0`, which means no optimisation, GCC 16.1 makes twenty instructions from `trip_distance`. It stores the variables in memory, loads their values into registers for arithmetic, and stores the results back in memory. At `-O1`, the setting used here, GCC produces four instructions and keeps this function's values in registers. The compiler version and settings matter when you compare listings.

## 9. Kilometres to service

The car's odometer records the total distance it has travelled. The car needs a service when that reading reaches `service_at`. The `odometer` argument is the reading recorded before the current trip began. It does not include `trip_so_far`.

`km_to_service` returns the kilometres left before the service, after allowing for the current trip and a planned trip. It also keeps 50 km spare. Its arguments are `service_at`, `odometer`, `trip_so_far` and `planned`, in `w0` to `w3`.

GCC made the five instructions shown below. The `#50` in the last `sub` is the number 50 written inside the instruction.

**Trace the call**

Without running the call `km_to_service(30000, 28750, 140, 390)`, give two values.

- `w0` when the function returns
- `w1` when the function returns

1. Each `sub` writes only its first operand.
2. Do not change a register just because an instruction reads it. A register no instruction writes keeps its initial value.
3. After `sub w0, w0, w1` alone, `w0` is 30000 minus 28750, which is 1250.
4. `w1` arrives holding 28750, and no instruction writes `w1`.
5. `w0` is 670 and `w1` is 28750.

*Feedback for a wrong `w1`:* A `sub` writes its first operand only, so ask which instruction, if any, writes `w1`.

*Feedback for a wrong `w0`:* Take each `sub` in turn, and write down `w0` after each one.

## 10. What you now know

- `add` and `sub` read values from registers and write their result to a register.
- The processor runs instructions, not C variable names. A register does not keep the name of the C variable whose value it holds.
- Instructions run one after another unless an instruction changes that.
- `ret` returns to the code that called the function.

Before `sub w1, w2, w1` runs, `w1` holds 5 and `w2` holds 9. Which register changes, and what do `w1` and `w2` hold afterwards?

*Answer (closed by default)*

`w1` changes. It becomes 9 minus 5, which is 4. `w2` still holds 9.

## 11. The model and the real processor

The simulator runs one instruction per step. A real processor works on many instructions at once, and it may run them out of order. It still guarantees the same results as running them one at a time. That guarantee is all this lesson relies on.
