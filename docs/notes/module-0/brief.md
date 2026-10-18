# Brief: draft Module 0's lesson text from facts, a section at a time

You draft the words of one lesson of an interactive course, *Assembly Lab*. Use every fact given
for a part, add no fact, and change no fact's meaning. Numbers, register names, instruction text
and C text must appear exactly as given. Follow the style rules in
`/tmp/claude-0/-home-user/7d96cd44-305c-57f1-92b2-23ddaca03a5e/scratchpad/al/style-body.md`
(read rules 1 to 22 first). In short: British English, plain words, one idea per sentence of
about twenty words, active voice, the reader is "you", no em dashes, no marketing tone, no "in
this lesson we will", say the thing rather than hinting at it. Code, register names and
instructions go in backticks.

**Terms.** The lesson may use, from the first part where they are introduced onward: instruction,
register, listing, assembly language, operand, program counter. It must not use: flag, hexadecimal,
hex, signed, unsigned, address, memory address, stack, link register, calling convention, binary
encoding, opcode, mnemonic. Where a fact needs one of those ideas, it is phrased without the word.
A term is introduced in plain English first, then named.

Write each part under its heading in
`/tmp/claude-0/-home-user/7d96cd44-305c-57f1-92b2-23ddaca03a5e/scratchpad/al/drafts/m0.md`,
nothing else. Draft one part at a time, reading the previous parts first so the joins read on, and
so nothing is said twice.

## The situation (applies to every part; do not restate it all each time)

The course's running example is a car's trip computer. Its programs are small C functions. GCC,
a C compiler, version 16.1, with the setting `-O1`, turned each into instructions for a 64-bit Arm
processor. The reader steps the instructions on a simulator in the page.

## 0. Objectives (three to four lines, each starting with a verb, each one line)

- step through a compiled function one instruction at a time and say what each instruction changed;
- say where a function's arguments arrive and where its result leaves;
- fix a compiled function whose operands are in the wrong order;
- explain why removing `ret` changes what a function returns.

## 1. Question (title: a question; one or two short paragraphs)

- The trip computer keeps a work log of distances driven.
- For one trip, the work log's distance is the three legs added together, minus a private detour that the log must not include.
- The C function `trip_distance` does this in three statements. (The figure below shows it.)
- GCC turned it into four instructions, shown beside the C.
- The question: what does the processor do, instruction by instruction, when this function runs?

Also a caption for the figure (one line): the C function and the four instructions GCC made from it; each instruction sits beside the C line GCC recorded for it.

## 2. Motivation (title: a short label; one paragraph)

- The C is a description; the compiler translates it; the instructions are what the processor runs.
- Following the instructions reveals the calculation steps and where the processor keeps their results. It does not imply that C and its compiled instructions disagree.
- Every later module reads instructions like these.
- Here there are only four, which is few enough to follow one at a time.

## 3. Prediction (title: a short label; one paragraph, then the question and four options)

- The C names a variable, `total`. The instructions name no variable at all. They name `w0`, `w1`, `w2` and `w3`.
- The function's four arguments arrive in `w0`, `w1`, `w2` and `w3`, in order: `leg1` in `w0`, `leg2` in `w1`, `leg3` in `w2`, `detour` in `w3`.
- Before you step through, commit to an answer.
- Question: Where does the processor keep `total`?
- Options (four, short): in `w0`, in place of `leg1`; in a new place of its own; it does not keep it until the function returns; in `w3`, in place of `detour`.
- An explanation shown after the answer is checked (two sentences): the first instruction, `add w0, w0, w1`, writes its result into `w0`; so `total` lives in `w0`, and the value of `leg1` is gone once it runs.

## 4. Investigation (title: a short label; two or three short paragraphs, a figure caption, and a closed note)

- The figure runs `trip_distance(120, 85, 42, 15)` on the simulator.
- A **register** is a small store inside the processor that holds one value. Here each holds 32 bits, drawn as bits and as a decimal number.
- The marker shows which instruction runs next. The processor keeps that position in a register of its own, the **program counter**.
- Press Next to run one instruction.
- After `add w0, w0, w1`, `w0` holds 205, which is 120 plus 85. `w1` still holds 85.
- An instruction's parts after its name are its **operands**. In these instructions the first operand is where the result goes, and the other two are what it is made from.
- After the second instruction `w0` holds 247; after the third, 232.
- `ret` ends the function. Its result is whatever `w0` holds then: 232.
- The C line GCC recorded for each instruction is lit as it runs.
- Caption (one line): `trip_distance(120, 85, 42, 15)`, one instruction at a time; a register outlined has just changed.
- The closed note (a summary line of a few words, then two or three sentences): GCC records the last subtraction against the closing brace, not against the line `total = total - detour;`. The figure shows GCC's record as it is. The record says which line an instruction is counted against, and the compiler decides it.

## 5. Construction (title: a short label; one or two paragraphs; a challenge title and task)

- A second function, `fuel_used`, should return the litres used on a trip: the fuel at the start minus the fuel at the end.
- Its C was written the wrong way round: `return at_end - at_start;`.
- GCC turned it into `sub w0, w1, w0` and `ret`.
- `at_start` arrives in `w0`, and `at_end` in `w1`.
- `sub` takes its third operand away from its second and writes the answer into its first.
- Challenge title (a short imperative).
- Task (two or three sentences): change the instructions so the function returns `at_start` minus `at_end`. Three calls test it. You can type the instructions, or tap a line to change it.

Five hints, in this order, each one or two sentences:
1. concept: `sub` writes its first operand with its second operand minus its third.
2. mistake class: the registers are right; their order is not.
3. smaller example: `sub w0, w2, w3` puts `w2` minus `w3` into `w0`.
4. part of the answer: the result must still go into `w0`, and the first value after it must be `at_start`, which is in `w0`.
5. whole answer: `sub w0, w0, w1`, then `ret`.

## 6. Failure experiment (title: a short label; one paragraph, a question with four options, and an explanation)

- In the processor's store, `fuel_used`'s instructions come straight after `trip_distance`'s.
- The figure has a switch that deletes `ret` from `trip_distance`, then runs `trip_distance(120, 85, 42, 15)` again.
- Question: With `ret` deleted, what does `w0` hold when the run ends?
- Options: 232; 147; the run stops with an error; 0.
- Explanation after the answer is checked: with no `ret`, the processor runs the next instruction in its store, which is `fuel_used`'s `sub w0, w0, w1`. That makes `w0` 232 minus 85, which is 147. Then `fuel_used`'s `ret` ends the run. Nothing marks where a function ends except `ret`.

## 7. Explanation (title: a short label; three short paragraphs)

- A program is a list of instructions, kept one after another.
- The program counter says which one runs next. After most instructions it moves on to the next in the list.
- Each instruction here reads registers and writes one register.
- A function's arguments arrive in `w0`, `w1` and onwards; its result leaves in `w0`.
- `ret` ends the function and goes back to the code that called it.
- **Assembly language** is the written form of instructions, one per line. GCC's listing is written in it.
- The processor works only with the values in registers. The names `leg1` and `total` are not in the instructions.

## 8. Generalisation (title: a short label; two short paragraphs)

- Every function in this course works this way: arguments in `w0` onwards, the result in `w0`, and `ret` at the end.
- Longer functions have more instructions. Later modules add instructions that choose which instruction runs next, and instructions that read and write the processor's store of values.
- The compiler chooses the registers and the instructions. With the setting `-O0`, GCC makes twenty instructions from the same C, and they keep every variable outside the registers.
- So a listing belongs to one compiler at one setting.

## 9. Challenge (title: a short label; one paragraph; a challenge title and task; two field labels)

- The car needs a service when its odometer reaches a set reading.
- `km_to_service` returns the kilometres left before the service, after the trip so far and a planned trip, keeping 50 km spare.
- Its four arguments: `service_at`, `odometer`, `trip_so_far`, `planned`, in `w0` to `w3`.
- GCC made five instructions from it, shown in the challenge.
- Task: trace the call `km_to_service(30000, 28750, 140, 390)` without running it, and give two values.
- Field labels: `w0` when the function returns; `w1` when the function returns.

Five hints:
1. concept: each `sub` writes only its first operand.
2. mistake class: a register no instruction writes keeps the value it arrived with.
3. smaller example: after `sub w0, w0, w1` alone, `w0` is 30000 minus 28750, which is 1250.
4. part of the answer: `w1` arrives holding 28750, and no instruction writes `w1`.
5. whole answer: `w0` is 670 and `w1` is 28750.

Feedback for a wrong `w1` (one sentence, without giving the value): a `sub` writes its first operand only, so ask which instruction, if any, writes `w1`.
Feedback for a wrong `w0` (one sentence, without giving the value): take each `sub` in turn, and write down `w0` after each one.

## 10. Reflection (title: a short label; three or four questions, one sentence each)

- Which register held `total`, and what happened to `leg1`?
- If the function needed `leg1` again after the first instruction, what would the compiler have had to do?
- Why did deleting `ret` change the result?
- What do the instructions know about the names `leg1` and `total`?

## 11. The model and the real processor (one short paragraph)

- The simulator runs one instruction per step.
- A real processor works on many instructions at once and may run them out of order, but it guarantees the same results as running them one at a time.
- That guarantee is all this lesson relies on.
