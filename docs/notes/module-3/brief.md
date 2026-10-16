# Brief: draft Module 3's two lessons from facts, a part at a time

Same rules as before: every fact used, none added, no meaning changed; numbers, registers,
instruction and C text exactly as given. Read the style rules in
`/tmp/claude-0/-home-user/7d96cd44-305c-57f1-92b2-23ddaca03a5e/scratchpad/al/style-body.md` first.
British English, plain words, about twenty words a sentence, active voice, "you", no em dashes, no
marketing, no "in this lesson we will". Code in backticks. Captions and the line "Shown after the
answer is checked" in italics; the explanation after that line in plain type. Hints as a plain
numbered list (no "concept:" labels). Headings are labels that say what the section holds, not
generic words such as "Motivation".

Read what the reader already has first:
`/home/user/assembly-lab/docs/notes/module-0/prose.md`, `docs/notes/module-1/prose.md`,
`docs/notes/module-2/prose.md` (all under `/home/user/assembly-lab/`). The reader knows registers,
`w` and `x` names, hexadecimal, the unsigned and signed readings, the top bit, constants, `mov`,
`movk`, `add`, `sub`, `adds`, `subs`, `neg`, the four flags, carry, overflow, borrow, wrap.

**Terms.** Lesson 1 introduces: *mask*, *field*, and the operations AND, OR, exclusive OR and NOT
(plain English first). Lesson 2 introduces: *shift*, *logical shift*, *arithmetic shift* (plain
English first: filling with zeros, or with copies of the top bit). Never use: sign extension,
condition, branch, two's complement, encoding, opcode, mnemonic, immediate, barrel shifter.

Write to `/tmp/claude-0/-home-user/7d96cd44-305c-57f1-92b2-23ddaca03a5e/scratchpad/al/drafts/m3.md`,
`# Lesson 1` with parts `## 0.` to `## 11.`, then `# Lesson 2` the same.

# Lesson 1: Masks and fields

## 0. Objectives
- set, clear and flip one bit of a word with OR, AND and exclusive OR;
- read a field out of a word, and write one in;
- build `set_gear` from `and`, `lsl` and `orr`.

## 1. Question (title a question)
- The trip computer keeps its warnings in one `unsigned`, the warning word. Each of its low bits says one thing: bit 0 fuel low, bit 1 service due, bit 2 a door open, bit 3 the lights on.
- Bits 4 to 6 hold the gear, a number from 0 to 7.
- The question: how does a program change one bit, or the gear, without disturbing the rest?
- Caption: the warning word's 32 bits, with bits 0 to 6 labelled.

## 2. Why one bit at a time (label; one paragraph)
- `add` and `sub` change a whole number at once; a carry can reach any bit.
- Changing one warning must leave every other warning as it was.
- The instructions in this lesson work on each bit separately: bit 5 of the answer depends only on bit 5 of the two values.

## 3. Prediction (label; a sentence; a question; four options; an explanation)
- GCC turns `return w & ~DOOR_OPEN;`, which clears bit 2, into `and w0, w0, -5`.
- Question: why −5?
- Options: −5 is `0xfffffffb`, every bit set except bit 2; −5 is bit 2 counted backwards; the compiler subtracts 5 from the word; −5 is an error in the listing.
- Explanation: `0xfffffffb` has every bit set except bit 2, and its signed reading is −5. GCC prints the constant by its signed reading. AND keeps a bit only where both values have it, so every bit survives except bit 2.

## 4. Investigation (label; two or three short paragraphs; a caption)
- AND gives 1 in a bit only where both values have 1. OR gives 1 where either has 1. Exclusive OR gives 1 where exactly one has 1. NOT turns every bit over.
- A **mask** is a value chosen to pick out bits: `orr w0, w0, 1` sets bit 0; `and w0, w0, -5` clears bit 2; `eor w0, w0, 8` flips bit 3.
- A **field** is a run of bits that together hold one number, such as the gear in bits 4 to 6.
- GCC reads the gear with `ubfx x0, x0, 4, 3`: take 3 bits starting at bit 4, and put them at the bottom. It writes the gear with `bfi w0, w1, 4, 3`: put the low 3 bits of `w1` into bits 4 to 6 of `w0`, leaving the rest.
- `clear_door(0xf)` gives `0xb`, which is 11. `gear_of(0x35)` gives 3.
- Caption: a word and a mask, combined bit by bit.

## 5. Construction (label; one paragraph; challenge title; task; five hints)
- Challenge: write `set_gear(w, g)`, which puts the low 3 bits of `g` into bits 4 to 6 of `w` and returns the word. Use only `and`, `lsl`, `orr` and `ret`. Four calls test it; in one, `g` is larger than 7, and only its low 3 bits may land.
- `w` arrives in `w0` and `g` in `w1`.
- Hints:
  1. Clear the field in the word, move the new gear into place, then join the two.
  2. Without clearing bits 4 to 6 first, OR keeps the old gear's 1s.
  3. `lsl w1, w1, 4` moves bits 0 to 2 of `w1` up to bits 4 to 6.
  4. `and w1, w1, 7` keeps only the low 3 bits of `g`; `and w0, w0, -113` clears bits 4 to 6 of `w`, because −113 is `0xffffff8f`.
  5. `and w1, w1, 7`, `lsl w1, w1, 4`, `and w0, w0, -113`, `orr w0, w0, w1`, `ret`.

## 6. Failure experiment (label; one paragraph; a question; four options; an explanation)
- The figure runs `set_gear` without the step that clears the field: `and w1, w1, 7`, `lsl w1, w1, 4`, `orr w0, w0, w1`, `ret`, on `set_gear(0x35, 5)`.
- Question: what does it return?
- Options: `0x75`; `0x55`; `0x35`; the run stops with an error.
- Explanation: `0x75`. The old gear, 3, left bits 4 and 5 set; OR cannot clear them, so they join the new gear's bits 4 and 6. The right answer is `0x55`.

## 7. What each operation does (label; two short paragraphs)
- AND clears, OR sets, exclusive OR flips, each only where the mask has a 1 (for AND, where the mask has a 0).
- Each bit of the answer depends only on the same bit of the inputs, so no carry runs between bits and nothing else changes.

## 8. Fields everywhere (label; one or two short paragraphs)
- Status words, packed dates and colours keep several small numbers in one word in the same way.
- GCC writes the gear in one instruction, `bfi`, where your version took four. The result is the same: `set_gear(0x35, 5)` returns `0x55` both ways.

## 9. Challenge (label; a sentence; challenge title; task; field labels; five hints)
- Task: for the warning word `0x2a`, give three results as hexadecimal: after `orr w0, w0, 1`; after `and w0, w0, -9`; and `ubfx x0, x0, 4, 3` of the original word.
- Field labels: after `orr`; after `and`; the gear.
- Hints:
  1. OR sets the mask's bits; AND with −9 clears bit 3; `ubfx` takes bits 4 to 6.
  2. Each result starts from `0x2a`, not from the one before.
  3. `0x2a` is `0010 1010`: bits 1, 3 and 5 are set.
  4. −9 is `0xfffffff7`, every bit except bit 3.
  5. `0x2b`; `0x22`; `0x2`.

## 10. Looking back (three questions)
- Why does GCC print the mask for clearing bit 2 as −5?
- Why must the field be cleared before the new gear is joined in?
- What does exclusive OR do that AND and OR cannot?

## 11. The model and the real processor
- `ubfx` and `bfi` are two names the assembler gives to more general instructions; the course uses the two names GCC prints.

# Lesson 2: Shifts, and the type that picks one

## 0. Objectives
- shift a word left or right, and say what fills the gap;
- explain why GCC uses `asr` for `int` and `lsr` for `unsigned`;
- say why dividing a negative `int` by 2 is not the same as shifting it.

## 1. Question (title a question)
- GCC turns `g >> 1` into `asr w0, w0, 1` when `g` is an `int`, and into `lsr w0, w0, 1` when it is an `unsigned`.
- This is the first place in the course where the C type changes the instruction.
- The question: what does each instruction do differently?

## 2. Why shifting matters (label; one paragraph)
- Moving every bit one place left doubles an `unsigned` value; moving it one place right halves it, dropping any remainder.
- GCC turns `n * 8` into `lsl w0, w0, 3`.

## 3. Prediction (label; a sentence; a question; four options; an explanation)
- The figure takes −7, which is `0xfffffff9`, and moves its bits one place right.
- Question: what fills the top bit for an `int`?
- Options: a copy of the old top bit, 1; a 0; the bit that fell off the bottom; nothing, the word gets shorter.
- Explanation: a copy of the old top bit. `asr w0, w0, 1` gives `0xfffffffc`, which is −4. `lsr w0, w0, 1` fills with 0 and gives `0x7ffffffc`, which is 2147483644.

## 4. Investigation (label; two or three short paragraphs; a caption)
- A **shift** moves every bit along by a number of places; bits that move past the end are lost.
- `lsl` moves bits left and fills the gap at the bottom with zeros.
- `lsr`, a **logical shift**, moves bits right and fills the top with zeros. It halves the unsigned reading.
- `asr`, an **arithmetic shift**, moves bits right and fills the top with copies of the top bit. It halves the signed reading, rounding down.
- Caption: one word, shifted by the instruction you choose; the bits that fall off, and what fills the gap.

## 5. Construction (label; one paragraph; challenge title; task; field labels; five hints)
- Challenge: give `asr` by 2, `lsr` by 2, and C's `/ 4`, for 21 and for −21, as decimal numbers in their `int` readings except where noted.
- Field labels: `asr` of 21 by 2; `lsr` of 21 by 2; `21 / 4`; `asr` of −21 by 2; `lsr` of −21 by 2, unsigned reading; `-21 / 4`.
- Hints:
  1. For a positive value all three agree; for a negative value they do not.
  2. `asr` rounds down; C's `/` rounds towards zero; `lsr` fills with zeros, so a negative value becomes a large positive one.
  3. `asr` of −7 by 1 is −4; −7 / 2 in C is −3.
  4. 21 gives 5 all three ways.
  5. 5, 5, 5; −6, 1073741818, −5.

## 6. Failure experiment (label; one paragraph; a question; four options; an explanation)
- C's `g / 2` for an `int` rounds towards zero: −7 / 2 is −3.
- GCC does not make it one `asr`. It makes `add w0, w0, w0, lsr 31`, then `asr w0, w0, 1`.
- Question: what does the first instruction add?
- Options: 1 when `g` is negative, 0 otherwise; always 1; 31; half of `g`.
- Explanation: `w0, lsr 31` moves the top bit to the bottom, so it adds 1 when `g` is negative and 0 otherwise. Adding 1 to a negative value before `asr` makes the shift round towards zero, as C requires: `div2(-7)` gives −3.

## 7. Why the type picks the shift (label; two short paragraphs)
- The unsigned and signed readings differ in the top bit's worth, so halving them needs different fills: zeros for unsigned, copies of the top bit for signed.
- So the C type decides which shift GCC uses. The add and subtract of earlier modules did not depend on the type; this does.

## 8. Shifts in listings (label; one paragraph)
- A shift can also be part of another instruction's operand, as `w0, lsr 31` was inside the `add`. Listings use this often to scale or move a value on the way in.

## 9. Challenge (label; a sentence; challenge title; task; field labels; five hints)
- Task: say which instruction GCC uses for each: `x >> 3` with `int x`; `x >> 3` with `unsigned x`; `x << 3` with either.
- Field labels: `int x >> 3`; `unsigned x >> 3`; `x << 3`.
- Hints:
  1. The fill on the right shifts depends on the reading; the left shift fills with zeros either way.
  2. A left shift is the same for both types.
  3. `int g >> 1` became `asr w0, w0, 1`.
  4. `unsigned n >> 1` became `lsr w0, w0, 1`.
  5. `asr`; `lsr`; `lsl`.

## 10. Looking back (three questions)
- What fills the gap in `lsr`, and in `asr`?
- Why is `g / 2` not one `asr` for a negative `int`?
- Where else might the C type change which instruction GCC uses?

## 11. The model and the real processor
- The simulator's shifts follow the architecture's results, checked against QEMU. `lsl`, `lsr` and `asr` with a constant are names for more general instructions; the course uses the names GCC prints.
