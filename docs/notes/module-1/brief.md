# Brief: draft Module 1's two lessons from facts, a part at a time

Same rules as the course's earlier drafting: use every fact given for a part, add no fact, change
no meaning; numbers, register names, instruction and C text exactly as given. Read the style rules
in `/tmp/claude-0/-home-user/7d96cd44-305c-57f1-92b2-23ddaca03a5e/scratchpad/al/style-body.md`
(rules 1 to 22) first. British English, plain words, about twenty words a sentence, active voice,
"you", no em dashes, no marketing, no "in this lesson we will". Code in backticks.

Read Module 0's finished text first, so you know what the reader already has and do not repeat it:
`/home/user/assembly-lab/docs/notes/module-0/prose.md`. The reader already knows: instruction,
register, listing, assembly language, operand, program counter, memory; that arguments arrive in
`w0` onwards and the result leaves in `w0`; `add`, `sub`, `ret`; the trip computer; GCC 16.1 at
`-O1`.

**Terms.** Lesson 1 introduces, in plain English first: *hexadecimal*, *unsigned reading*,
*signed reading*, *top bit*. Lesson 2 introduces: *constant* (the number written inside an
instruction), *`x` register* and *`w` register* as two names for one register. Never use: flag,
carry, overflow, borrow, wrap, sign extension, two's complement, encoding, opcode, mnemonic,
immediate.

Write both lessons to
`/tmp/claude-0/-home-user/7d96cd44-305c-57f1-92b2-23ddaca03a5e/scratchpad/al/drafts/m1.md`, as
`# Lesson 1` with parts `## 0.` to `## 11.`, then `# Lesson 2` the same. Draft a part at a time,
re-reading what you have written, so nothing is said twice and the joins read on. Mark a figure's
caption, and anything shown only after an answer is checked, in italics, as in Module 0's text.

# Lesson 1: One pattern, three readings

## 0. Objectives (three or four lines, each starting with a verb)
- write a register's 32 bits in hexadecimal, and back;
- read one pattern of bits as an unsigned number and as a signed number;
- explain why the same instructions serve `int` and `unsigned`.

## 1. Question (title a question)
- In Module 0, `fuel_used` was first written the wrong way round, as `return at_end - at_start;`.
- The figure runs it again, with `fuel_used(50, 38)`.
- The C says the answer is 38 minus 50. Its type is `int`, so the answer should be −12.
- After `sub w0, w1, w0`, `w0` holds 32 bits, and read as a number they give 4294967284.
- The question: which is right, −12 or 4294967284?
- Caption: `fuel_used(50, 38)` as first written; `w0` after its subtraction.

## 2. Motivation (short label; one paragraph)
- Every value in a register is only bits. A number is a way of reading them.
- A program that reads the bits one way, when the C meant the other, gets the wrong answer without any error.
- This module is about the readings. Later modules show the instructions that choose one.

## 3. Prediction (short label; a sentence or two, a question, four options, an explanation)
- The figure can add 12 to `w0`, with `add w0, w0, 12`.
- Question: after adding 12, what does `w0` hold?
- Options: 0; 4294967296; 24; the run stops with an error.
- Explanation, after checking: `w0` holds 0. 4294967284 plus 12 is 4294967296, which needs 33 bits: a 1 followed by 32 zeros. A register has 32, so only the 32 zeros are kept. Adding 12 to the pattern gives 0, so the pattern behaves exactly as −12 would.

## 4. Investigation (short label; three short paragraphs; one caption)
- Thirty-two ones and zeros are hard to read. **Hexadecimal** writes them shorter: each group of four bits becomes one digit, 0 to 9 then `a` to `f` for ten to fifteen. `0x` in front marks a number as hexadecimal.
- The pattern in `w0` is `1111 1111 1111 1111 1111 1111 1111 0100`, written `0xfffffff4`.
- The **unsigned reading** adds up every bit's worth, from 1 for the rightmost bit to 2147483648 for the leftmost, the **top bit**. For this pattern it gives 4294967284.
- The **signed reading** counts the top bit as minus 2147483648 instead, and every other bit the same. For this pattern it gives −12.
- The figure lets you set any bit, and shows all three readings, each with the sum that gives it.
- Caption: one register, set bit by bit; hexadecimal, unsigned and signed readings, each with its sum.

## 5. Construction (short label; one paragraph; a challenge title; a task; two field labels; five hints)
- Challenge: set `w0`'s bits so that its signed reading is −1, then give the unsigned reading of the same bits.
- Field labels: the bits of `w0`; its unsigned reading.
- Hints:
  1. concept: in the signed reading the top bit is worth minus 2147483648, and the other bits add to it.
  2. mistake class: −1 is not the pattern for 1 with the top bit set.
  3. smaller example: the pattern for −12 is `0xfffffff4`; adding 12 to it gives 0.
  4. part of the answer: the pattern for −1 is the one that gives 0 when 1 is added to it.
  5. whole answer: all 32 bits set, `0xffffffff`; its unsigned reading is 4294967295.

## 6. Failure experiment (short label; a sentence or two; a question; four options; an explanation)
- The figure shows two functions side by side: `fuel_used_wrong`, with `int`, and `fuel_used_wrong_u`, the same C with `unsigned`.
- Question: what does GCC do differently for the `unsigned` version?
- Options: nothing: the instructions are the same; it uses a different subtraction; it adds a check for a negative answer; it uses `x` names for the registers.
- Explanation, after checking: both listings are `sub w0, w1, w0` then `ret`. The figure compares them line by line. The type changes how a program reads the result, not the subtraction.

## 7. Explanation (short label; two or three short paragraphs)
- A register holds bits, and nothing else. It has no type.
- In the two readings only the top bit's worth differs: plus 2147483648 unsigned, minus 2147483648 signed.
- When the top bit is 0 the two readings agree.
- A subtraction or an addition gives the same bits whichever reading the program will use later. That is why one `sub` serves `int` and `unsigned`.

## 8. Generalisation (short label; one or two short paragraphs)
- Every 32-bit pattern has an unsigned reading from 0 to 4294967295 and a signed reading from −2147483648 to 2147483647.
- Some instructions do depend on the reading: the branches that act on a comparison, and the instructions that widen a value to more bits. The comparison itself does not; the branch after it chooses the reading. Later modules meet them, and they are where a C type finally shows in the instructions.

## 9. Challenge (short label; a sentence; a challenge title; a task; six field labels; five hints)
- Task: give both readings of three patterns: `0x0000002a`, `0x80000000` and `0xffffff38`.
- Field labels: unsigned reading of `0x0000002a`; signed reading of `0x0000002a`; and the same two for each of the others.
- Hints:
  1. concept: the unsigned reading counts the top bit as plus 2147483648; the signed reading counts it as minus 2147483648.
  2. mistake class: the two readings differ only when the top bit is 1.
  3. smaller example: `0xfffffff4` reads as 4294967284 unsigned and −12 signed.
  4. part of the answer: `0x0000002a` has its top bit 0, so both readings are 42.
  5. whole answer: 42 and 42; 2147483648 and −2147483648; 4294967096 and −200.

## 10. Reflection (three or four questions)
- Which reading gave −12, and which bit made the difference?
- Why did adding 12 give 0?
- Where in a program does the type `int` or `unsigned` exist, if not in the instructions?

## 11. The model and the real processor (one short paragraph)
- A real processor's registers hold bits with no type, as the simulator's do. Nothing in this lesson is simplified.

# Lesson 2: Constants and widths

## 0. Objectives
- say which constants one `mov` can put in a register, and build the rest with `movk`;
- explain why `-1` and `4294967295` give the same instruction;
- use the `x` and `w` names of one register, and say what writing the `w` name does to the rest.

## 1. Question (title a question)
- The trip computer's service interval is 30000 kilometres; the odometer's limit is 1000000.
- GCC makes one instruction for `return 30000;`: `mov w0, 30000`.
- For `return 1000000;` it makes two: `mov w0, 16960`, then `movk w0, 0xf, lsl 16`.
- The question: why can one instruction not hold 1000000?
- Caption: the two functions and GCC's listings for them.

## 2. Motivation (short label; one paragraph)
- Almost every function puts a fixed number in a register somewhere.
- A number written inside an instruction is a **constant**.
- An instruction is a fixed size, so only some numbers fit inside one.

## 3. Prediction (short label; a sentence, a question, four options, an explanation)
- Question: which of these can one `mov` put in `w0`?
- Options: 65536; 70000; 100000; 1000000.
- Explanation, after checking: only 65536. Its bits fit in one 16-bit half of the register: a single 1, with nothing else set. The other three need bits in both halves.

## 4. Investigation (short label; two or three short paragraphs; a caption; a closed note)
- The figure assembles `mov w0, ` followed by any number you type, with the course's assembler, which accepts and rejects what the GNU assembler does.
- A `mov` with a constant works when the number's set bits all fall within one 16-bit half of the register.
- For a number that needs both halves the assembler says no single instruction can put it in a register.
- Caption: type a number; the figure shows whether one `mov` can hold it, and what `w0` then holds.
- Closed note (summary line of a few words, then two or three sentences): a few more numbers fit. A number whose bits are all ones except within one 16-bit half fits, such as `-1`. So does a number whose bits repeat one short pattern, such as 65537, which is `0x00010001`. The lesson takes these from the assembler's behaviour, not from the instruction's bits, which the course does not show.

## 5. Construction (short label; one paragraph; challenge title; task; five hints)
- `movk` replaces one 16-bit part of a register and keeps the rest. `lsl 16` names the upper half.
- 1000000 is `0x000f4240`: the lower half is `0x4240`, which is 16960, and the upper half is `0xf`, which is 15.
- Challenge: put 1000000 in `w0` and return it, using only `mov`, `movk` and `ret`. The starting text, `mov w0, 1000000` then `ret`, does not assemble.
- Hints:
  1. concept: one `mov` holds a number whose bits fall in one 16-bit half; `movk` sets the other half without touching the first.
  2. mistake class: a second `mov` replaces the whole register; only `movk` keeps the other half.
  3. smaller example: `mov w0, 1` then `movk w0, 1, lsl 16` leaves 65537 in `w0`.
  4. part of the answer: the lower half is 16960, and `mov w0, 16960` puts it there.
  5. whole answer: `mov w0, 16960`, then `movk w0, 0xf, lsl 16`, then `ret`.

## 6. Failure experiment (short label; one paragraph; a question; four options; an explanation; a caption)
- Each register holds 64 bits. **`x3`** names all 64, and **`w3`** names the lower 32 of the same register. A `long` in C uses the `x` name: GCC turns `return -1;` with `long` into `mov x0, -1`.
- The figure runs `mov x3, -1`, which sets all 64 bits, then `mov w3, -1`.
- Question: after `mov w3, -1`, what does `x3` hold?
- Options: all 64 bits set, as before; the lower 32 bits set and the upper 32 cleared; the lower 32 bits set and the upper 32 unknown; the run stops with an error.
- Explanation, after checking: the lower 32 bits are set and the upper 32 are cleared, so `x3` holds `0x00000000ffffffff`. Writing a `w` name always clears the upper half of the register.
- Caption: `x3` drawn as two halves of 32 bits, with `w3` its lower half.

## 7. Explanation (short label; two or three short paragraphs)
- A constant is written into the instruction, and an instruction has room for only some numbers.
- One `mov` fits a number in one 16-bit half; `movk` fills in another half without disturbing the rest.
- An instruction that writes a `w` name writes all 64 bits of the register: the 32 it names, and zeros above them.

## 8. Generalisation (short label; one or two short paragraphs)
- GCC turns `return -1;` with `int` and `return 4294967295u;` with `unsigned` into the same instruction, `mov w0, -1`: the same 32 bits, read two ways.
- Every constant in every listing is a pattern of bits, and the C type only decides how the program reads it later.

## 9. Challenge (short label; a sentence; a challenge title; a task; two field labels; five hints)
- The figure shows four instructions: `mov x1, -1`, `mov w1, 5`, `mov w2, 16960`, `movk w2, 0xf, lsl 16`.
- Task: without running them, give `x1` and `w2` after all four, as decimal numbers.
- Field labels: `x1` at the end; `w2` at the end.
- Hints:
  1. concept: writing `w1` clears the upper half of `x1`.
  2. mistake class: `mov w1, 5` does not keep the 1s that `mov x1, -1` set in the upper half.
  3. smaller example: after `mov x3, -1` then `mov w3, -1`, `x3` is `0x00000000ffffffff`.
  4. part of the answer: `w2` ends as `0x000f4240`.
  5. whole answer: `x1` is 5 and `w2` is 1000000.

## 10. Reflection (three or four questions)
- Why does one `mov` hold 65536 but not 70000?
- What does `movk` keep that `mov` does not?
- If a function wrote `w0` and its caller read `x0`, what would the caller find in the upper half?

## 11. The model and the real processor (one short paragraph)
- The course does not show how an instruction's bits hold its constant. Which constants fit is taken from the GNU assembler, and the course's assembler is tested against it line by line.
