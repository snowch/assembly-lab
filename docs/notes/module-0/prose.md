# Module 0: the lesson's words, as drafted

Drafted by Haiku from the fact brief in `docs/notes/module-0/brief.md`, a part at a time; checked for facts by the managing session, which sent parts 6 and 8 back once (a word used in two senses, and a missing fact) and changed one sentence of part 7 to keep it true once memory is introduced. The lesson's `.prose.ts` and `.labels.ts` files take their words from here.

## 0. Objectives

- Step through a compiled function one instruction at a time, and say what each instruction changed.
- Say where a function's arguments arrive and where its result leaves.
- Fix a compiled function whose instructions use their values in the wrong order.
- Explain why removing `ret` changes what a function returns.

## 1. What does the processor do?

The trip computer keeps a work log of distances driven. For one trip, the distance in the log is the three legs added together, minus a private detour. The log must not include that detour.

The C function `trip_distance` computes that distance in three statements. The figure below shows it. GCC, a C compiler, version 16.1, set to `-O1`, turned it into four instructions for a 64-bit Arm processor. They are shown beside the C. The question is what the processor does, instruction by instruction, when this function runs.

*The C function and the four instructions GCC made from it. Each instruction sits beside the C line GCC recorded for it.*

## 2. Why the instructions matter

The C is a description. The compiler translates it, and the instructions are what the processor runs. When a program does something its C does not seem to say, the difference shows in the instructions. Every later module reads instructions like these. This function has only four, which is few enough to follow one at a time.

## 3. Prediction

The C names a variable, `total`. The instructions name no variable at all. They name `w0`, `w1`, `w2` and `w3`. The four arguments arrive in order: `leg1` in `w0`, `leg2` in `w1`, `leg3` in `w2` and `detour` in `w3`. Before you step through, commit to an answer.

**Where does the processor keep `total`?**

- In `w0`, in place of `leg1`.
- In a new place of its own.
- It does not keep it until the function returns.
- In `w3`, in place of `detour`.

*Shown after the answer is checked.*

The first instruction, `add w0, w0, w1`, writes its result into `w0`. So `total` lives in `w0`, and the value of `leg1` is gone once it runs.

## 4. Stepping through

The figure runs `trip_distance(120, 85, 42, 15)` on the simulator in the page. A **register** is a small store inside the processor that holds one value. Each one here holds 32 bits, drawn as bits and as a decimal number.

The marker shows which instruction runs next. The processor keeps that position in a register of its own, the **program counter**. Press Next to run one instruction. The C line GCC recorded for each instruction is lit as it runs.

An instruction's parts after its name are its **operands**. In `add w0, w0, w1`, the first operand is where the result goes, and the other two are what it is made from. After that instruction runs, `w0` holds 205, which is 120 plus 85. `w1` still holds 85. After the second instruction `w0` holds 247; after the third, 232. `ret` ends the function. Its result is whatever `w0` holds then: 232.

*`trip_distance(120, 85, 42, 15)`, one instruction at a time. A register with an outline has just changed.*

**Where the last subtraction is counted**

GCC records the last subtraction against the closing brace, not against the line `total = total - detour;`. The figure shows GCC's record as it is. The record says which line an instruction is counted against, and the compiler decides it.

## 5. The wrong way round

A second function, `fuel_used`, should return the litres used on a trip. That is the fuel at the start minus the fuel at the end. Its C was written the wrong way round: `return at_end - at_start;`. GCC turned it into `sub w0, w1, w0` and `ret`.

`at_start` arrives in `w0`, and `at_end` in `w1`. `sub` takes its third operand away from its second. It writes the answer into its first.

**Fix the subtraction**

Change the instructions so the function returns `at_start` minus `at_end`. Three calls test it. You can type the instructions, or tap a line to change it.

1. `sub` writes its first operand as its second operand minus its third.
2. The registers are right. Their order is not.
3. `sub w0, w2, w3` puts `w2` minus `w3` into `w0`.
4. The result must still go into `w0`. The second operand must be `at_start`, which is in `w0`.
5. The whole answer is `sub w0, w0, w1`, then `ret`.

## 6. Removing `ret`

The processor keeps a program's instructions and values outside its registers, in a place called **memory**. In memory, `fuel_used`'s instructions come straight after `trip_distance`'s. The figure uses GCC's output from correct C, so `fuel_used` is `sub w0, w0, w1`, then `ret`. The figure has a switch. It deletes `ret` from `trip_distance`, then runs `trip_distance(120, 85, 42, 15)` again.

**With `ret` deleted, what does `w0` hold when the run ends?**

- 232
- 147
- The run stops with an error
- 0

*Shown after the answer is checked.*

With no `ret`, the processor runs the next instruction in memory, which is `fuel_used`'s `sub w0, w0, w1`. That makes `w0` 232 minus 85, which is 147. Then `fuel_used`'s `ret` ends the run. Nothing marks where a function ends except `ret`.

## 7. How a program runs

A program is a list of instructions, kept one after another. The program counter says which one runs next. After most instructions, it moves on to the next one in the list.

Each instruction here reads registers and writes one register. These instructions work only with the values in registers. The names `leg1` and `total` are not in the instructions.

A function's arguments arrive in `w0`, `w1` and onwards, and its result leaves in `w0`. `ret` ends the function and goes back to the code that called it. The written form of instructions, one per line, is **assembly language**. GCC's listing is written in it.

## 8. Other functions

Every function in this course works this way. Longer functions have more instructions. Later modules add instructions that choose which instruction runs next, and instructions that read and write memory.

The compiler chooses the registers and the instructions. With the setting `-O0`, GCC makes twenty instructions from the same C, and they keep every variable in memory, outside the registers. So a listing belongs to one compiler at one setting.

## 9. Kilometres to service

The car needs a service when its odometer reaches a set reading. `km_to_service` returns the kilometres left before the service, after the trip so far and a planned trip. It keeps 50 km spare. Its four arguments are `service_at`, `odometer`, `trip_so_far` and `planned`, in `w0` to `w3`. GCC made five instructions from it, shown in the challenge below.

**Trace the call**

Trace the call `km_to_service(30000, 28750, 140, 390)` without running it, and give two values.

- `w0` when the function returns
- `w1` when the function returns

1. Each `sub` writes only its first operand.
2. A register no instruction writes keeps the value it arrived with.
3. After `sub w0, w0, w1` alone, `w0` is 30000 minus 28750, which is 1250.
4. `w1` arrives holding 28750, and no instruction writes `w1`.
5. `w0` is 670 and `w1` is 28750.

*Feedback for a wrong `w1`:* A `sub` writes its first operand only, so ask which instruction, if any, writes `w1`.

*Feedback for a wrong `w0`:* Take each `sub` in turn, and write down `w0` after each one.

## 10. Looking back

- Which register held `total`, and what happened to `leg1`?
- If the function needed `leg1` again after the first instruction, what would the compiler have had to do?
- Why did deleting `ret` change the result?
- What do the instructions know about the names `leg1` and `total`?

## 11. The model and the real processor

The simulator runs one instruction per step. A real processor works on many instructions at once, and it may run them out of order. It still guarantees the same results as running them one at a time. That guarantee is all this lesson relies on.
