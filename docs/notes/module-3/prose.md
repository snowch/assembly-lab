# Module 3: the lessons' words, as drafted

Drafted by Haiku from the fact brief in `docs/notes/module-3/brief.md`, a part at a time, and checked for facts by the managing session. Every number was produced by the simulator before the brief went out; the last challenge's claims about GCC are recorded in `listings.md`, under "The shifts in Lesson 2's last challenge".

Revised on 17 October 2026 in a separate Codex drafting pass from checked findings. The accompanying clarity review records the independent reviews and verification.

# Lesson 1: Masks and fields

## 0. Objectives

- set, clear and flip one bit of a word with OR, AND and exclusive OR;
- read a field out of a word, and write one in;
- build `set_gear` from `and`, `lsl` and `orr`.

## 1. How do you change one warning?

The trip computer keeps its warnings in one `unsigned` number. This course calls it the **warning word**. A 32-bit value like this is called a **word**.

Each of the lowest four bits is one warning. Bits are counted from the right, starting at 0, and bit n is worth 2 to the power n. Bit 0 means fuel is low. Bit 1 means service is due. Bit 2 means a door is open. Bit 3 means the lights are on.

Bits 4 to 6 hold the selected gear, a number from 0 to 7.

Each warning is on or off on its own. How can the program change one warning without changing the others?

*The warning word's 32 bits. The table beside it gives each bit's meaning.*

## 2. Why one bit at a time

`add` and `sub` change a whole number. A carry can run from one bit into the next and reach any bit. So an `add` or a `sub` can change warnings it was not meant to touch.

`and`, `orr` and `eor` work on each bit separately. Bit 5 of the result depends only on bit 5 of the two inputs.

## 3. The constant that clears bit 2

In this C, `w` is the warning word. It is a C variable, not the register `w0`. `DOOR_OPEN` is a name for 4, the worth of bit 2.

In C, `&` takes the AND of each pair of bits: the result is 1 only when both input bits are 1. `~` turns every bit over: each 1 becomes 0, and each 0 becomes 1. So `return w & ~DOOR_OPEN;` clears bit 2. GCC compiled that line to `and w0, w0, -5`.

C has other bit operators too. `|` takes the OR of each pair of bits. `^` takes the exclusive OR of each pair. `<<` moves bits towards the top. `FUEL_LOW` is a name for 1, the worth of bit 0.

*Closed note: Which compiler?*

GCC 16.1 at `-O1` compiled this, as in Module 0.

**Why is the constant −5?**

- −5 is bit 2 counted backwards;
- −5 is `0xfffffffb`, every bit set except bit 2;
- the compiler subtracts 5 from the word;
- −5 is an error in the instruction.

*Shown after the answer is checked.*

`0xfffffffb` and −5 are the same 32-bit pattern. Read as a signed number, the pattern is −5, and GCC prints it that way. Every bit of the pattern is 1 except bit 2.

The processor does not subtract 5. `and` keeps the bits where the mask has a 1, and clears bit 2, where the mask has a 0. Every other bit stays as it was. The figure shows the low eight bits of the word, the mask and the result, with bit 2 marked.

## 4. Masks, fields and the three rules

A value chosen to pick out bits is a **mask**. Each of the three operations treats a mask bit in its own way.

- **AND** (`and`): a mask bit of 0 clears the bit, and a 1 keeps it. `and w0, w0, -5` clears bit 2.
- **OR** (`orr`): a mask bit of 1 sets the bit, and a 0 keeps it. `orr w0, w0, 1` sets bit 0.
- **Exclusive OR** (`eor`): a mask bit of 1 flips the bit, and a 0 keeps it. `eor w0, w0, 8` flips bit 3.

C uses `~` to turn every bit over. In `w & ~DOOR_OPEN`, GCC worked out the bits of `~DOOR_OPEN` itself. It printed those bits as −5, their signed reading. So the listing needs no separate instruction that turns bits over.

The figure combines a word and a mask with the instruction you choose. It marks which bits changed.

`clear_door` is the function whose C is `return w & ~DOOR_OPEN;`. `clear_door(0xf)` gives `0xb`, which is 11.

*A word and a mask, combined bit by bit.*

**OR with a register input**

In `orr w0, w0, w1`, the instruction reads both registers and writes their OR to `w0`. It leaves `w1` unchanged. Change either starting value below to compare the input bits with the result.

Immediate masks for `and`, `orr` and `eor` must fit particular bit patterns; not every 32-bit value fits. A mask that does not fit can be loaded into a register, using `mov` and `movk` as needed, then supplied through a register input. See [Arm’s ORR (immediate) reference](https://developer.arm.com/documentation/ddi0602/2025-12/Base-Instructions/ORR--immediate---Bitwise-OR--immediate--).

*OR of two register values; w0 is written and w1 is kept.*

A run of bits that together hold one number is called a **field**. The gear is a field, in bits 4 to 6.

`lsl` moves every bit towards the top by a number of places. `lsl w1, w1, 4` moves each bit of `w1` up four places. Zeros fill the four lowest bits. Bits moved past bit 31 are lost. So bits 0 to 2 move to bits 4 to 6. The `lsl 16` in `movk`, from Module 1, moved a number into the upper half the same way.

GCC reads the gear with `ubfx x0, x0, 4, 3`. This takes 3 bits, starting at bit 4, and moves them to the lowest three places. The result is their unsigned value.

`gear_of` returns the gear. Its C uses `>> 4` to move the bits four places right, then `& 7` to keep the lowest three. GCC uses `ubfx` to do both operations, then `ret` to return. For `0x35`, which is `0011 0101`, bits 6 to 4 are `011`. So `gear_of(0x35)` is 3.

The listing names `x0`, the 64-bit name of the register. The gear lies in its lower 32 bits, which `w0` names, so the result is the same.

## 5. Writing a field

Writing a field changes only its own bits and leaves the rest as they were. The challenge below writes a new gear into a word.

Start with a gear that already fits its three bits. The warning word is `0x35`, and the new gear is 2. Clear the old gear, place the new gear in bits 4 to 6, and keep every warning bit.

*Replace an in-range gear before writing the general function.*

**What word should this field replacement return?**

- `0x25`;
- `0x35`;
- `0x20`.

*Shown after the answer is checked.*

The result is `0x25`. Clearing bits 4 to 6 keeps the warnings in the low four bits. Placing gear 2 in the cleared field gives `0010 0101`. OR joins the prepared word and the positioned gear.

The writing exercise adds one more requirement: when the new value is larger than the field can hold, keep only its low three bits before positioning it.

**Write `set_gear`**

Write `set_gear(w, g)`. It puts the low 3 bits of `g` into bits 4 to 6 of `w`, and returns the word. `w` arrives in `w0`, and `g` arrives in `w1`. Put the result in `w0`.

Use only `and`, `lsl`, `orr` and `ret`. Four calls test your code. In one of them, `g` is 13, which is larger than 7. Only its low 3 bits may land in the field. Every bit outside bits 4 to 6 must stay unchanged.

1. Clear the field in the word, move the new gear into place, then join the two.
2. Moving all of `g` into place can change bits outside the field. Keep only its low 3 bits before moving them.
3. `lsl w1, w1, 4` moves bits 0 to 2 of `w1` up to bits 4 to 6.
4. `and w1, w1, 7` keeps only the low 3 bits of `g`. `and w0, w0, -113` clears bits 4 to 6 of `w`, because −113 is `0xffffff8f`.
5. `and w1, w1, 7`, `lsl w1, w1, 4`, `and w0, w0, -113`, `orr w0, w0, w1`, `ret`.

*Shown after the challenge has been run.*

Step through your own instructions below. When an instruction writes a register, the figure shows its bits before and after. This may be the new gear in `w1` or the warning word in `w0`.

*Shown after the challenge passes.*

Only the low 3 bits of `g` may land in the field. A value larger than 7 must not spill out of it. 13 is `1101` in its low four bits. Without keeping only the low 3 bits, its bit 3 would land in bit 7 of the word, outside the field.

GCC writes the field in one instruction, `bfi w0, w1, 4, 3`, then returns with `ret`. `w0` holds the word, and `w1` holds the new gear. The 4 is the first bit of the field, and the 3 is its width. The instruction puts the low 3 bits of `w1` into bits 4 to 6 of `w0`, and keeps every other bit. Your code and GCC's both return `0x55` for `set_gear(0x35, 5)`.

`ubfx` and `bfi` are Arm’s names for two cases of more general instructions. The course uses the names GCC prints.

## 6. Leaving out the clear

The figure runs `set_gear` without the step that clears the field: `and w1, w1, 7`, `lsl w1, w1, 4`, `orr w0, w0, w1`, `ret`, on `set_gear(0x35, 5)`.

**What does it return?**

- `0x35`
- `0x55`
- `0x75`
- the run stops with an error

*Shown after the answer is checked.*

The result is `0x75`. The old word `0x35` is `0011 0101`. The new gear, moved into place, is `0101 0000`. OR of the two gives `0111 0101`, which is `0x75`.

The old gear, 3, left bits 4 and 5 set, and they stay set. Clearing the field first gives `0101 0101`, which is `0x55`.

OR can set bits, but it cannot clear bits that were already 1. The old gear must be cleared before the new gear is inserted.

## 7. What each operation does

No carry runs from one bit into the next. So, for `and`, `orr` and `eor`, each bit of the result depends only on the same bit of the two inputs. That is why a mask can change one warning and leave the rest.

## 8. Fields in real code

A colour can keep its red, green and blue amounts in separate fields of one word. As with the gear, `ubfx` can pick out one field and move it to the lowest bits so the program can use its value.

## 9. Three results from one word

This challenge uses the operations and the gear on one word.

**Trace three results**

The warning word is `0x2a`. Give three results, in hexadecimal:

- the word after `orr w0, w0, 1`;
- the word after `and w0, w0, -9`;
- the gear of the original word, from `ubfx x0, x0, 4, 3`.

Start with `0x2a` separately for each instruction. Do not use one instruction's result as the next instruction's input.

Field labels: "after `orr`"; "after `and`"; "the gear".

1. OR sets the mask's bits; AND with −9 clears bit 3; `ubfx` takes bits 4 to 6.
2. Using the previous result as the next input changes the task. Start each instruction separately with `0x2a`.
3. `0x2a` is `0010 1010`: bits 1, 3 and 5 are set.
4. −9 is `0xfffffff7`, every bit except bit 3.
5. `0x2b`; `0x22`; `0x2`.

*Shown under a wrong answer.*

- **`orr` box:** OR with 1 sets bit 0 and keeps every other bit.
- **`and` box:** AND with −9, which is `0xfffffff7`, clears bit 3 and keeps every other bit.
- **Gear box:** The gear is bits 4 to 6, moved down to the lowest three places.
- **Chained answer:** Each result starts from `0x2a`, not from the result before.

## 10. What you now know

- AND clears bits where the mask has a 0 and keeps the others.
- OR sets bits where the mask has a 1 and keeps the others.
- Exclusive OR flips bits where the mask has a 1 and keeps the others.
- A mask chooses which bits an operation changes.
- A field holds a small number across several bits.
- Writing a field means clearing it, moving the new value into place and combining, so the bits around it are kept.
- `ubfx` reads a field, and `bfi` writes one.

The warning word is `0x47`. Start with that value separately for each instruction. What does `ubfx x0, x0, 4, 3` give, and what does `eor w0, w0, 4` give?

*Closed note: Answer*

`0x47` is `0100 0111`. Bits 6 to 4 are `100`, so the gear is 4. `eor` with 4 flips bit 2 from 1 to 0, giving `0x43`.

# Lesson 2: Shifts, and the type that picks one

## 0. Objectives

- shift a word left or right, and say what fills the gap;
- explain why GCC uses `asr` for `int` and `lsr` for `unsigned`;
- explain why division and right shift can round a negative `int` differently.

## 1. Why does the C type change the instruction?

C writes a shift right as `>>` and a shift left as `<<`. `g >> 1` shifts the bits of `g` one place right.

GCC 16.1 at `-O1` turns `g >> 1` into `asr w0, w0, 1` when `g` is an `int`. When `g` is an `unsigned`, it turns the same expression into `lsr w0, w0, 1`. Both types use the same register width here. Their signed and unsigned readings lead GCC to choose different right shifts.

What does each instruction do differently?

*Closed note: What C says*

For a negative `int`, the C standard lets the compiler choose and document the result of `>>`. Another C compiler may make a different choice.

For some signed left shifts, C gives no guarantee about the program's behaviour. This includes shifting a negative `int` left. GCC supports left shifts of negative signed values as an extension to C, but code that relies on that extension is not guaranteed to work the same way with another compiler. This lesson's C left-shift examples avoid those cases. The compiler is GCC 16.1 with `-O1`, as in Module 0.

## 2. Why moving bits matters

Moving every bit one place left doubles an `unsigned` value, as long as no 1 moves past the top. Moving every bit one place right halves it, and drops any remainder. GCC turns `n * 8` into `lsl w0, w0, 3`.

## 3. What fills the top bit

The figure takes −7, which is `0xfffffff9`, and moves its bits one place right.

**Which general rule does GCC use for the top bit when shifting an `int` right?**

- A 0
- The bit that fell off the bottom
- A copy of the old top bit, which is 1
- Nothing: the word gets shorter

*Shown after the answer is checked.*

The figure takes −7, which is `0xfffffff9`. For an `int`, the top bit is filled with a copy of the old top bit. The old top bit is 1, so `asr w0, w0, 1` fills the top with 1. The result is `0xfffffffc`, which is −4.

`lsr w0, w0, 1` fills the top with 0 instead. The result is `0x7ffffffc`, which is 2147483644. The prediction figure shows the `asr` result and marks the bits that changed. In the next section, you can choose either shift and see which bits fill the gap.

## 4. Left and right shifts

Moving every bit along by a number of places is a **shift**. Bits that move past the end are lost.

- `lsl` moves bits left and fills the gap on the right with zeros.
- `lsr`, a **logical shift**, moves bits right and fills the gap on the left with zeros. A shift by one place halves the unsigned reading and drops any remainder.
- `asr`, an **arithmetic shift**, moves bits right and fills the gap on the left with copies of the old top bit. A shift by one place halves the signed reading and rounds down to the next whole number if needed.

For either right shift, repeat that halving once for each place moved. A shift by two places divides by 4, with the same rounding rule. The figure shifts a word by the instruction and distance you choose. Arrows show the direction, the bits lost and the bits filled.

With a constant, `lsl`, `lsr` and `asr` are names for more general instructions. The course uses the names GCC prints.

*One word, shifted by the instruction you choose; the bits that fall off, and what fills the gap.*

**Shift an input before adding**

`lsl #1` shifts the value read from `w1` one bit left before the addition. It does not write `w1`. The sum goes to `w2`; both input registers keep their values.

See [Arm’s ADD (shifted register) reference](https://developer.arm.com/documentation/ddi0602/2025-12/Base-Instructions/ADD--shifted-register---Add-optionally-shifted-register-).

*One addition with its w1 input shifted before use.*

## 5. Division and shifting

C's `/` divides, and a shift can seem to do the same job. This challenge compares them for a positive value and for a negative one.

**Compare shifts with division**

Give the results of three operations for two inputs: `asr` by 2, `lsr` by 2, and C's `/ 4`. The inputs are 21 and −21. Give each answer as a decimal number in its signed reading. The answer boxes are grouped by input.

For two `int` values, C's `/` gives a whole number and rounds towards zero. For example, `7 / 2` is 3, and `-7 / 2` is −3.

Field labels: "`asr` of 21 by 2"; "`lsr` of 21 by 2"; "`21 / 4`"; "`asr` of −21 by 2"; "`lsr` of −21 by 2 (−21 taken as unsigned)"; "`-21 / 4`".

1. For a positive value all three agree; for a negative value they do not.
2. Do not round `asr` towards zero like C's `/`. `asr` rounds down. `lsr` fills with zeros, so a negative value becomes a large positive one.
3. `asr` of −7 by 1 is −4; −7 / 2 in C is −3.
4. 21 gives 5 all three ways.
5. 5, 5, 5; −6, 1073741818, −5.

*Shown under a wrong answer.*

- `asr` rounds down, towards the more negative whole number.
- C's `/` rounds towards zero.
- `lsr` reads the bits as unsigned and fills with zeros, so a negative value becomes a large positive one.

## 6. How GCC divides by 2

C's `g / 2` for an `int` rounds towards zero. So −7 / 2 is −3. GCC does not make it one `asr`. It makes `add w0, w0, w0, lsr 31`, then `asr w0, w0, 1`.

In the `add`, the last operand is `w0, lsr 31`. That is the value of `w0`, shifted right by 31 places on the way in. Forming that operand does not change `w0`. The `add` then adds the operand to `w0`, and writes the sum to `w0`.

**What does the first instruction add?**

- always 1
- 1 when `g` is negative, 0 otherwise
- 31
- half of `g`

*Shown after the answer is checked.*

`w0, lsr 31` moves the top bit of `g` to the bottom. So the `add` adds 1 when `g` is negative, and 0 otherwise.

For `div2(-7)`, the top bit of −7 is 1. The `add` writes −6 to `w0`, and `asr w0, w0, 1` then gives −3. For `div2(7)`, the `add` adds 0, so the result is 3.

Adding 1 to a negative odd value before `asr` makes the shift round towards zero, as C requires. For a negative even value, halving already gives a whole number. Adding 1 before halving puts the value halfway above that number, so rounding down gives the same result. The figure shows `w0` after each instruction.

## 7. Why the type picks the shift

| C type | Right shift | Fills the top bit with |
| --- | --- | --- |
| `int` | `asr` | a copy of the old top bit |
| `unsigned` | `lsr` | zeros |

For a negative signed value, `asr` keeps the top bit set, so the result stays negative. `lsr` fills with zeros to divide the unsigned value. The table shows the choices made by GCC 16.1 at `-O1` for the types used here. With the same register width, signed and unsigned addition used the same instruction in earlier modules. Right shift needs a different instruction for each reading.

## 8. Shifts inside other instructions

A shift can be part of another instruction's operand, as `w0, lsr 31` was in the `add`. The shift does not change the register it reads.

`movk w0, 0xf, lsl 16` is another case. The `lsl 16` moves the 16-bit number `0xf` into the upper half before `movk` puts it there.

## 9. Which instruction for which type

This challenge uses the type alone to pick the instruction.

**Pick the instruction**

Say which instruction GCC uses for each: `x >> 3` with `int x`; `x >> 3` with `unsigned x`; `x << 3` with either.

Field labels: "`int x >> 3`"; "`unsigned x >> 3`"; "`x << 3`".

1. On a right shift, the fill depends on the reading. A left shift fills with zeros either way.
2. Do not choose a different left shift for each type. Both use `lsl` for the C expressions here.
3. `int g >> 1` became `asr w0, w0, 1`.
4. `unsigned n >> 1` became `lsr w0, w0, 1`.
5. `asr`; `lsr`; `lsl`.

## 10. What you now know

- `lsl` moves bits left and fills with zeros.
- `lsr` moves bits right and fills with zeros.
- `asr` moves bits right and fills with copies of the top bit.
- For these C types, GCC chooses `asr` or `lsr` for `>>` according to the signed or unsigned reading.
- For a negative value, `asr` rounds down, and C's `/` rounds towards zero.
- A shift inside another instruction's operand does not change the register it reads.

For `int g = -9`, what do `g / 2` and `asr` by 1 give?

*Closed note: Answer*

`g / 2` is −4, rounding towards zero. `asr` by 1 gives −5, rounding down. GCC's extra `add` of 1 makes −8 first, and `asr` of −8 by 1 is −4.
