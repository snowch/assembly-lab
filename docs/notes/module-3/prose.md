# Module 3: the lessons' words, as drafted

Drafted by Haiku from the fact brief in `docs/notes/module-3/brief.md`, a part at a time, and checked for facts by the managing session. Every number was produced by the simulator before the brief went out; the last challenge's claims about GCC are recorded in `listings.md`, under "The shifts in Lesson 2's last challenge".

# Lesson 1: Masks and fields

## 0. Objectives

- set, clear and flip one bit of a word with OR, AND and exclusive OR;
- read a field out of a word, and write one in;
- build `set_gear` from `and`, `lsl` and `orr`.

## 1. How do you change one warning?

The trip computer keeps its warnings in one `unsigned`, the warning word. Each of its low bits says one thing. Bits are counted from the right, starting at 0; bit n is worth 2 to the power n, so bit 0 is worth 1 and bit 2 is worth 4. Bit 0 means fuel is low. Bit 1 means service is due. Bit 2 means a door is open. Bit 3 means the lights are on.

Bits 4 to 6 hold the gear, a number from 0 to 7.

How does a program change one bit, or the gear, without disturbing the rest?

*The warning word's 32 bits, with bits 0 to 6 labelled.*

## 2. Why one bit at a time

`add` and `sub` change a whole number at once, and a carry can reach any bit. Changing one warning must leave every other warning as it was. The instructions in this lesson work on each bit separately. Bit 5 of the answer depends only on bit 5 of the two values.

## 3. The constant that clears bit 2

In this C, `w` is the warning word, a C variable, not the register `w0`, and `DOOR_OPEN` is a name for 4, the worth of bit 2. In C, `&` is AND of each pair of bits, and `~` turns every bit over: each 1 becomes 0, and each 0 becomes 1. GCC turns `return w & ~DOOR_OPEN;`, which clears bit 2, into `and w0, w0, -5`.

**Why is the constant −5?**

- −5 is `0xfffffffb`, every bit set except bit 2;
- −5 is bit 2 counted backwards;
- the compiler subtracts 5 from the word;
- −5 is an error in the listing.

*Shown after the answer is checked.*

`0xfffffffb` has every bit set except bit 2, and its signed reading is −5. GCC prints the constant by its signed reading. The `and` instruction keeps a bit only where both values have 1. So every bit survives except bit 2.

## 4. Four operations, masks and fields

Each of these works on one bit at a time. The answer's bit is 1 only where both values have 1. This is AND, written `and`. The answer's bit is 1 where either value has 1. This is OR, written `orr`. The answer's bit is 1 where exactly one value has 1. This is exclusive OR, written `eor`. Turning every bit over is NOT: each 1 becomes 0, and each 0 becomes 1.

A value chosen to pick out bits is called a **mask**. In `orr w0, w0, 1`, the mask 1 sets bit 0. In `and w0, w0, -5`, the mask clears bit 2. In `eor w0, w0, 8`, the mask flips bit 3.

A run of bits that together hold one number is called a **field**, such as the gear in bits 4 to 6. The instruction `lsl` moves bits up. `lsl w1, w1, 4` moves every bit of `w1` up four places.

GCC reads the gear with `ubfx x0, x0, 4, 3`. This takes 3 bits, starting at bit 4, and puts them at the bottom. It writes the gear with `bfi w0, w1, 4, 3`. This puts the low 3 bits of `w1` into bits 4 to 6 of `w0`, and leaves the rest of `w0` alone. `clear_door` is the function whose C is `return w & ~DOOR_OPEN;`, and `gear_of` is the function GCC compiled to `ubfx x0, x0, 4, 3`, which reads the gear. Two examples: `clear_door(0xf)` gives `0xb`, which is 11, and `gear_of(0x35)` gives 3.

*A word and a mask, combined bit by bit.*

## 5. Writing a field

Writing a field changes only its own bits and leaves the rest as they were. The challenge below writes a new gear into a word.

**Write `set_gear`**

Write `set_gear(w, g)`, which puts the low 3 bits of `g` into bits 4 to 6 of `w` and returns the word. Use only `and`, `lsl`, `orr` and `ret`. Four calls test it. In one of them, `g` is larger than 7, and only its low 3 bits may land.

`w` arrives in `w0` and `g` in `w1`.

1. Clear the field in the word, move the new gear into place, then join the two.
2. Without clearing bits 4 to 6 first, OR keeps the old gear's 1s.
3. `lsl w1, w1, 4` moves bits 0 to 2 of `w1` up to bits 4 to 6.
4. `and w1, w1, 7` keeps only the low 3 bits of `g`. `and w0, w0, -113` clears bits 4 to 6 of `w`, because −113 is `0xffffff8f`.
5. `and w1, w1, 7`, `lsl w1, w1, 4`, `and w0, w0, -113`, `orr w0, w0, w1`, `ret`.

## 6. Leaving out the clear

The figure runs `set_gear` without the step that clears the field: `and w1, w1, 7`, `lsl w1, w1, 4`, `orr w0, w0, w1`, `ret`, on `set_gear(0x35, 5)`.

**What does it return?**

- `0x75`
- `0x55`
- `0x35`
- the run stops with an error

*Shown after the answer is checked.*

It returns `0x75`. The old gear, 3, left bits 4 and 5 set. OR cannot clear them, so they stay set beside the new gear's bits 4 and 6. Clearing the field first gives the right answer, `0x55`.

## 7. What each operation does

AND clears a bit where the mask has a 0. OR sets a bit where the mask has a 1. Exclusive OR flips a bit where the mask has a 1.

Each bit of the answer depends only on the same bit of the two values. No carry runs from one bit into the next, so nothing else changes.

## 8. Fields in real code

Status words, packed dates and colours keep several small numbers in one word in the same way.

GCC writes the gear in one instruction, `bfi`, where your version took four instructions before `ret`. The result is the same: `set_gear(0x35, 5)` returns `0x55` both ways.

## 9. Three results from one word

This challenge uses the operations and the gear on one word.

**Trace three results**

For the warning word `0x2a`, give three results as hexadecimal: the word after `orr w0, w0, 1`; the word after `and w0, w0, -9`; and the gear from `ubfx x0, x0, 4, 3` of the original word.

Field labels: "after `orr`"; "after `and`"; "the gear".

1. OR sets the mask's bits; AND with −9 clears bit 3; `ubfx` takes bits 4 to 6.
2. Each result starts from `0x2a`, not from the one before.
3. `0x2a` is `0010 1010`: bits 1, 3 and 5 are set.
4. −9 is `0xfffffff7`, every bit except bit 3.
5. `0x2b`; `0x22`; `0x2`.

## 10. Looking back

- Why does GCC print the mask for clearing bit 2 as −5?
- Why must the field be cleared before the new gear is joined in?
- What does exclusive OR do that AND and OR cannot?

## 11. The model and the real processor

`ubfx` and `bfi` are two names the assembler gives to more general instructions. The course uses the two names GCC prints.

# Lesson 2: Shifts, and the type that picks one

## 0. Objectives

- shift a word left or right, and say what fills the gap;
- explain why GCC uses `asr` for `int` and `lsr` for `unsigned`;
- say why dividing a negative `int` by 2 is not the same as shifting it.

## 1. Why does the C type change the instruction?

C writes a shift right as `>>` and a shift left as `<<`. `g >> 1` shifts the bits of `g` one place right. GCC turns `g >> 1` into `asr w0, w0, 1` when `g` is an `int`. When `g` is an `unsigned`, it turns `g >> 1` into `lsr w0, w0, 1`. This is the first place in the course where the C type changes the instruction.

The question is what each instruction does differently.

## 2. Why moving bits matters

Moving every bit one place left doubles an `unsigned` value. Moving it one place right halves it, dropping any remainder. GCC turns `n * 8` into `lsl w0, w0, 3`.

## 3. What fills the top bit

The figure takes −7, which is `0xfffffff9`, and moves its bits one place right.

**What fills the top bit for an `int`?**

- A copy of the old top bit, which is 1
- A 0
- The bit that fell off the bottom
- Nothing: the word gets shorter

*Shown after the answer is checked.*

For an `int`, the top bit is filled with a copy of the old top bit. `asr w0, w0, 1` gives `0xfffffffc`, which is −4. `lsr w0, w0, 1` fills with 0 and gives `0x7ffffffc`, which is 2147483644.

## 4. Left and right shifts

Moving every bit along by a number of places is called a **shift**. Bits that move past the end are lost. `lsl` moves bits left and fills the gap at the bottom with zeros.

A shift to the right that fills the top with zeros is a **logical shift**, written `lsr`. It halves the unsigned reading.

A shift to the right that fills the top with copies of the top bit is an **arithmetic shift**, written `asr`. It halves the signed reading, rounding down.

*One word, shifted by the instruction you choose; the bits that fall off, and what fills the gap.*

## 5. Division and shifting

C's `/` divides, and a shift can seem to do the same job. This challenge compares them for a positive value and for a negative one.

**Compare shifts with division**

Give `asr` by 2, `lsr` by 2, and C's `/ 4`, for 21 and for −21. Give each answer as a decimal number in its `int` reading, except where the field label says unsigned. On two `int`s, C's `/` gives a whole number and rounds towards zero. For example, `7 / 2` is 3, and `-7 / 2` is −3.

Field labels: "`asr` of 21 by 2"; "`lsr` of 21 by 2"; "`21 / 4`"; "`asr` of −21 by 2"; "`lsr` of −21 by 2, unsigned reading"; "`-21 / 4`".

1. For a positive value all three agree; for a negative value they do not.
2. `asr` rounds down; C's `/` rounds towards zero; `lsr` fills with zeros, so a negative value becomes a large positive one.
3. `asr` of −7 by 1 is −4; −7 / 2 in C is −3.
4. 21 gives 5 all three ways.
5. 5, 5, 5; −6, 1073741818, −5.

## 6. How GCC divides by 2

C's `g / 2` for an `int` rounds towards zero: −7 / 2 is −3. GCC does not make it one `asr`. It makes `add w0, w0, w0, lsr 31`, then `asr w0, w0, 1`.

**What does the first instruction add?**

- 1 when `g` is negative, 0 otherwise
- always 1
- 31
- half of `g`

*Shown after the answer is checked.*

The operand `w0, lsr 31` moves the top bit to the bottom. So it adds 1 when `g` is negative, and 0 otherwise. Adding 1 to a negative value before `asr` makes the shift round towards zero, as C requires. `div2(-7)` gives −3.

## 7. Why the type picks the shift

The unsigned and signed readings differ in the top bit's worth, so halving them needs different fills: zeros for unsigned, copies of the top bit for signed.

So the C type decides which shift GCC uses. The add and subtract of earlier modules did not depend on the type. The right shift does.

## 8. Shifts inside other instructions

A shift can also be part of another instruction's operand, as `w0, lsr 31` was inside the `add` above. Listings use this often to scale or move a value on the way in.

## 9. Which instruction for which type

This challenge uses the type alone to pick the instruction.

**Pick the instruction**

Say which instruction GCC uses for each: `x >> 3` with `int x`; `x >> 3` with `unsigned x`; `x << 3` with either.

Field labels: "`int x >> 3`"; "`unsigned x >> 3`"; "`x << 3`".

1. On a right shift, the fill depends on the reading. A left shift fills with zeros either way.
2. A left shift is the same for both types.
3. `int g >> 1` became `asr w0, w0, 1`.
4. `unsigned n >> 1` became `lsr w0, w0, 1`.
5. `asr`; `lsr`; `lsl`.

## 10. Looking back

- What fills the gap in `lsr`, and in `asr`?
- Why is `g / 2` not one `asr` for a negative `int`?
- Where else might the C type change which instruction GCC uses?

## 11. The model and the real processor

The simulator's shifts follow the architecture's results, checked against QEMU. `lsl`, `lsr` and `asr` with a constant are names for more general instructions. The course uses the names GCC prints.
