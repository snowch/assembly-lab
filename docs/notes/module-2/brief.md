# Brief: draft Module 2's two lessons from facts, a part at a time

Same rules as before: every fact used, none added, no meaning changed; numbers, registers,
instruction and C text exactly as given. Read the style rules in
`/tmp/claude-0/-home-user/7d96cd44-305c-57f1-92b2-23ddaca03a5e/scratchpad/al/style-body.md` first.
British English, plain words, about twenty words a sentence, active voice, "you", no em dashes, no
marketing, no "in this lesson we will". Code in backticks. Captions and anything shown only after
an answer is checked in italics.

Read what the reader already has, so you neither repeat it nor assume more:
`/home/user/assembly-lab/docs/notes/module-0/prose.md` and, if it exists,
`/tmp/claude-0/-home-user/7d96cd44-305c-57f1-92b2-23ddaca03a5e/scratchpad/al/drafts/m1.md` (Module 1:
hexadecimal, the unsigned and signed readings, the top bit, constants, `mov`, `movk`, `w` and `x`).

**Terms.** Lesson 1 introduces: *carry*, *flag* (and the names N, Z, C, V), *overflow* (only for
the signed reading's wrong answer). Lesson 2 introduces: *borrow*, *wrap*. Never use: condition,
branch, compare as an instruction name, two's complement, encoding, opcode, mnemonic, immediate.
`cmp`, `cmn` and `cset` may appear only inside a quoted GCC listing in a closed note, described as
"an instruction a later module explains".

Write to `/tmp/claude-0/-home-user/7d96cd44-305c-57f1-92b2-23ddaca03a5e/scratchpad/al/drafts/m2.md`,
`# Lesson 1` with parts `## 0.` to `## 11.`, then `# Lesson 2` the same.

# Lesson 1: Adding, and the four flags

## 0. Objectives
- follow an addition column by column, with the carry into each column;
- say what each of the four flags records after `adds`;
- explain why one adder serves both readings, and which flag judges which.

## 1. Question (title a question)
- Module 1 showed that 4294967284 and −12 are one pattern, and that GCC uses the same `add` and `sub` for `int` and `unsigned`.
- So the processor adds without knowing which reading the program wants.
- The question: when an answer does not fit, how can the processor say so for both readings at once?

## 2. Motivation (short label; one paragraph)
- An addition in 32 bits can give an answer that does not fit, and the bits that remain are then wrong for one reading or the other.
- A program that must not continue with a wrong answer needs to know it happened.
- `add` keeps no record. `adds` does the same addition and also records four facts about the answer.

## 3. Prediction (short label; a sentence; a question with four options; an explanation)
- The figure adds 2147483647 and 1 with `adds w0, w0, w1`. In hexadecimal that is `0x7fffffff` plus `0x00000001`.
- Question: which readings of the answer are right?
- Options: both; only the unsigned; only the signed; neither.
- Explanation after checking: the answer is `0x80000000`. Unsigned it reads 2147483648, which is right. Signed it reads −2147483648, which is wrong: 2147483647 plus 1 should be 2147483648, and the signed reading cannot hold it.

## 4. Investigation (short label; three short paragraphs; a caption; a closed note)
- The figure draws the addition column by column, from the right, as on paper.
- When a column's two bits and the 1 arriving from the right add up to 2 or 3, a 1 goes on to the next column on the left. That 1 is the **carry**.
- After `adds`, four **flags** record facts about the answer:
  - N: the answer's top bit.
  - Z: 1 when the answer is 0.
  - C: the carry out of the top bit, the one that would need a 33rd bit.
  - V: 1 when the carry into the top bit differs from the carry out of it.
- For `0x7fffffff` plus 1: a carry runs through every column into the top bit, and none comes out. So N is 1, Z is 0, C is 0, and V is 1.
- Caption: `adds w0, w0, w1` column by column, the carry into each column above it, and the four flags after it.
- Closed note (summary of a few words, then two or three sentences): GCC uses V itself. For `__builtin_add_overflow` on two `int`s it makes `cmn w0, w1` then `cset w0, vs`, which return 1 exactly when V is set. Both instructions are explained in a later module.

## 5. Construction (short label; one paragraph; challenge title; task; four field groups; five hints)
- Challenge: predict N, Z, C and V for three additions with `adds`, before running them.
- The additions: `0xffffffff` plus 1; 5 plus 3; `0x80000000` plus `0x80000000`.
- Fields: N, Z, C and V for each addition.
- Hints:
  1. concept: C is the carry out of the top bit; V is 1 when the carry into the top bit and the carry out of it differ.
  2. mistake class: C and V are not the same thing; one addition here sets both, one sets only C.
  3. smaller example: 5 plus 3 is 8; no carry reaches the top bit, so N, Z, C and V are all 0.
  4. part of the answer: `0xffffffff` plus 1 is 0 with a carry out of the top bit, so Z is 1 and C is 1.
  5. whole answer: `0xffffffff` plus 1: N 0, Z 1, C 1, V 0. 5 plus 3: all 0. `0x80000000` plus `0x80000000`: N 0, Z 1, C 1, V 1.

## 6. Failure experiment (short label; one paragraph; a question; four options; an explanation)
- The figure runs `add w0, w0, w1` instead of `adds`, on `0x7fffffff` plus 1, after an `adds` that left all four flags 0.
- Question: after `add`, what do the flags show?
- Options: V is 1, as with `adds`; all four are still 0; the run stops with an error; C is 1.
- Explanation after checking: all four are still 0. `add` gives the same answer and leaves the flags as they were. Only instructions whose names end in `s` record the four facts.

## 7. Explanation (short label; two or three short paragraphs)
- The adder adds bits; it gives one answer for both readings.
- C judges the unsigned reading: a carry out of the top bit means the unsigned answer did not fit.
- V judges the signed reading: when the carry into the top bit and the carry out of it differ, the top bit came out wrong for the signed answer. That is **overflow**.
- N and Z describe the answer itself: its top bit, and whether it is 0.

## 8. Generalisation (short label; one or two short paragraphs)
- Every `adds` sets all four flags; the program reads the one that matches its reading.
- The flags last until another instruction that records them; later modules show the instructions that read them to choose what runs next.

## 9. Challenge (short label; a sentence; title; task; one field; five hints)
- Task: give the smallest positive number that, added to `0x7ffffffe` with `adds`, makes V 1.
- Field: the number, in decimal.
- Hints:
  1. concept: V is 1 when the signed answer does not fit, so look for the first signed answer above 2147483647.
  2. mistake class: the question is about V, not C; the unsigned answer fits for small numbers.
  3. smaller example: `0x7fffffff` plus 1 makes V 1.
  4. part of the answer: `0x7ffffffe` is 2147483646.
  5. whole answer: 2.

## 10. Reflection (three questions)
- Why can one addition be right and wrong at once?
- Which flag would a program using `unsigned` read, and which one using `int`?
- What does `add` do to the flags?

## 11. The model and the real processor
- The simulator works out the flags as the architecture defines them. A real processor does not add column by column; the drawing shows the arithmetic, not the circuit. The digital-design course builds the circuit.

# Lesson 2: Subtracting, and the tick counter

## 0. Objectives
- explain why `elapsed(now, then)` is right when the counter has wrapped;
- say what C records after `subs`;
- write `elapsed` and pass tests across the wrap.

## 1. Question (title a question)
- The trip computer counts milliseconds in a 32-bit `unsigned` counter. It reaches 4294967295, then goes back to 0. Going back to 0 is called a **wrap**.
- 4294967296 milliseconds is about 49.71 days, so a car that is never switched off wraps its counter every 50 days or so.
- `elapsed(now, then)` returns `now - then`. GCC makes it one instruction, `sub w0, w0, w1`.
- The question: if the counter wraps between `then` and `now`, is the answer still right?

## 2. Motivation (short label; one paragraph)
- A program that measures time with a counter like this one runs for weeks before the wrap, so a mistake here shows up rarely and late.
- The answer depends on how the processor subtracts.

## 3. Prediction (short label; a sentence; a question; four options; an explanation)
- `then` is 4294966296, read just before the wrap; `now` is 1000, read just after it.
- Question: what does `elapsed(1000, 4294966296)` return?
- Options: 2000; −4294965296; 4294965296; 0.
- Explanation after checking: 2000. Counting on from 4294966296, 1000 steps reach the wrap and 1000 more reach 1000.

## 4. Investigation (short label; two or three short paragraphs; a caption)
- The figure draws the counter's values on a ring, with `then` and `now` either side of the wrap.
- The processor subtracts by adding: `a - b` is worked out as `a` plus the bits of `b` turned over, plus 1, with the same adder as lesson 1.
- With `subs`, the flags come from that addition. So C is 1 when no **borrow** was needed, that is when `a` is at least `b` under the unsigned reading, and 0 when one was.
- For `elapsed(1000, 4294966296)`, C is 0: the subtraction borrowed, because the counter wrapped. The 32 bits that remain are still the right distance, 2000.
- Caption: the counter as a ring; `then`, `now`, and the distance between them.

## 5. Construction (short label; one paragraph; challenge title; task; five hints)
- Challenge: write `elapsed(now, then)`, which returns the milliseconds from `then` to `now`. Four calls test it, two across the wrap.
- You may use `add`, `sub`, `adds`, `subs`, `neg` and `ret`.
- Hints:
  1. concept: a 32-bit subtraction keeps the low 32 bits of the true answer, and those are the distance round the ring.
  2. mistake class: no test for the wrap is needed.
  3. smaller example: `elapsed(5000, 1000)` is `sub` of 1000 from 5000: 4000.
  4. part of the answer: `now` arrives in `w0` and `then` in `w1`.
  5. whole answer: `sub w0, w0, w1`, then `ret`.

## 6. Failure experiment (short label; one paragraph; a question; four options; an explanation)
- `neg w0, w0` turns a value into its negative, as 0 minus the value.
- The figure runs `negs w0, w0` on `0x80000000`, which reads as −2147483648 signed.
- Question: what does `w0` hold afterwards?
- Options: `0x80000000`, unchanged; `0x7fffffff`; 0; the run stops with an error.
- Explanation after checking: `0x80000000`, unchanged, and V is 1. The signed answer, 2147483648, does not fit, so the same pattern comes back.

## 7. Explanation (short label; two or three short paragraphs)
- Subtraction is addition with the second value turned over and 1 added, so the flags mean what they meant in lesson 1.
- After `subs`, C is 1 when no borrow was needed, and 0 when one was.
- The 32 bits of the answer are the true answer with the bits above 32 dropped, which is why a wrapped counter still gives the right distance.

## 8. Generalisation (short label; one or two short paragraphs)
- Any counter that wraps gives the right distance by plain subtraction, as long as less than one full turn passed.
- GCC's `sub_overflows`, from `__builtin_sub_overflow`, is `subs w0, w0, w1` then `cset w0, vs`: it reads V after a subtraction, as `add_overflows` did after an addition.

## 9. Challenge (short label; a sentence; title; task; two fields; five hints)
- Task: give `elapsed(0, 4294967295)` and the C flag that `subs` would set for the same call.
- Fields: the result, in decimal; C, 0 or 1.
- Hints:
  1. concept: subtracting keeps the low 32 bits; C is 1 only if no borrow was needed.
  2. mistake class: 0 is smaller than 4294967295 under the unsigned reading.
  3. smaller example: `elapsed(1000, 4294966296)` is 2000, with C 0.
  4. part of the answer: one step after 4294967295 the counter reads 0.
  5. whole answer: 1, and C is 0.

## 10. Reflection (three questions)
- Why does `elapsed` need no special case for the wrap?
- What does C mean after `subs`, and how does that differ from after `adds`?
- Why does negating `0x80000000` give `0x80000000`?

## 11. The model and the real processor
- As in lesson 1: the flags follow the architecture's definition, checked against QEMU, and the drawing shows the arithmetic, not the circuit.
