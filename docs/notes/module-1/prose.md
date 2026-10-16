# Module 1: the lessons' words, as drafted

Drafted by Haiku from the fact brief in `docs/notes/module-1/brief.md`, a part at a time; checked for facts by the managing session, which sent four parts back once (a register's width stated two ways, the bits' worths given without their rule, the GNU assembler unexplained, and a repeat) and renamed one heading after its paragraph was cut. Every number was produced by the simulator or GNU as before the brief went out.

# Lesson 1: One pattern, three readings

## 0. Objectives

- write a register's 32 bits in hexadecimal, and convert hexadecimal back to bits;
- read one pattern of bits as an unsigned number and as a signed number;
- explain why the same instructions serve `int` and `unsigned`.

## 1. Which is right, −12 or 4294967284?

In Module 0, `fuel_used` was first written the wrong way round, as `return at_end - at_start;`. The figure runs it again, with `fuel_used(50, 38)`. The C says the answer is 38 minus 50, and its type is `int`. So the answer should be −12.

After `sub w0, w1, w0`, `w0` holds 32 bits. Read as a number, they give 4294967284.

*`fuel_used(50, 38)` as first written; `w0` after its subtraction.*

## 2. Why the readings matter

Every value in a register is only bits. A number is a way of reading them.

A program that reads the bits one way, when the C meant the other, gets the wrong answer without any error. This module is about the readings. Later modules show the instructions that choose one.

## 3. Adding 12

The figure can add 12 to `w0`, with `add w0, w0, 12`.

**After adding 12, what does `w0` hold?**

- 0
- 4294967296
- 24
- the run stops with an error

*Shown after the answer is checked.*

`w0` holds 0. 4294967284 plus 12 is 4294967296, which needs 33 bits: a 1 followed by 32 zeros. `w0` has 32 bits, so the 33rd bit is dropped and only the 32 zeros are kept. Adding 12 to the pattern gives 0, so the pattern behaves exactly as −12 would.

## 4. Reading the bits

Thirty-two ones and zeros are hard to read. A shorter way to write them is **hexadecimal**. Each group of four bits becomes one digit: 0 to 9, then `a` to `f` for ten to fifteen. A `0x` in front marks a number as hexadecimal.

The pattern in `w0` is `1111 1111 1111 1111 1111 1111 1111 0100`, written `0xfffffff4`. The **unsigned reading** adds up the worth of every bit that is 1. Each bit is worth twice the bit to its right, so the worths run 1, 2, 4, 8 and so on, up to 2147483648 for the leftmost bit. That leftmost bit is the **top bit**. For this pattern the unsigned reading gives 4294967284.

The **signed reading** counts the top bit as minus 2147483648 instead, and every other bit the same. For this pattern it gives −12. Both −12 and 4294967284 are right. They are two readings of the same 32 bits. The figure lets you set any bit, and shows all three readings, each with the sum that gives it.

*One register, set bit by bit; hexadecimal, unsigned and signed readings, each with its sum.*

## 5. Setting the bits

Set the bits yourself, in the figure, and read all three readings as you go.

**Make −1**

Set `w0`'s bits so that its signed reading is −1, then give the unsigned reading of the same bits.

Field labels: "the bits of `w0`" and "its unsigned reading".

1. In the signed reading the top bit is worth minus 2147483648, and the other bits add to it.
2. −1 is not the pattern for 1 with the top bit set.
3. The pattern for −12 is `0xfffffff4`; adding 12 to it gives 0.
4. The pattern for −1 is the one that gives 0 when 1 is added to it.
5. Set all 32 bits: `0xffffffff`. Its unsigned reading is 4294967295.

## 6. The `unsigned` version

The figure shows two functions side by side: `fuel_used_wrong`, with `int`, and `fuel_used_wrong_u`, the same C with `unsigned`.

*The two functions side by side, with GCC's listing for each.*

**What does GCC do differently for the `unsigned` version?**

- Nothing: the instructions are the same.
- It uses a different subtraction.
- It adds a check for a negative answer.
- It uses different register names.

*Shown after the answer is checked.*

Both listings are `sub w0, w1, w0` then `ret`. The figure compares them line by line. The type changes how a program reads the result, not the subtraction.

## 7. Bits and readings

A register has no type. It holds bits, and nothing else.

The two readings differ only in the top bit's worth: plus 2147483648 unsigned, minus 2147483648 signed. When the top bit is 0, the two readings agree.

A subtraction or an addition gives the same bits, whichever reading the program uses later. So one `sub` serves both `int` and `unsigned`.

## 8. Every 32-bit pattern

Every 32-bit pattern has an unsigned reading from 0 to 4294967295, and a signed reading from −2147483648 to 2147483647.

Some instructions depend on the reading. One kind chooses what runs next after a comparison. Another kind widens a value to more bits. The comparison itself does not depend on the reading: the instruction that follows it chooses the reading. Later modules meet these instructions, and they are where a C type finally shows in the instructions.

## 9. Three more patterns

Use what you have learned to read three new patterns.

**Two readings each**

Give both readings of three patterns: `0x0000002a`, `0x80000000` and `0xffffff38`.

Field labels, in order: "unsigned reading of `0x0000002a`"; "signed reading of `0x0000002a`"; "unsigned reading of `0x80000000`"; "signed reading of `0x80000000`"; "unsigned reading of `0xffffff38`"; "signed reading of `0xffffff38`".

1. The unsigned reading counts the top bit as plus 2147483648. The signed reading counts it as minus 2147483648.
2. The two readings differ only when the top bit is 1.
3. `0xfffffff4` reads as 4294967284 unsigned and −12 signed.
4. `0x0000002a` has its top bit 0, so both readings are 42.
5. The answers, unsigned first in each pair: 42 and 42; 2147483648 and −2147483648; 4294967096 and −200.

## 10. Looking back

- Which reading gave −12, and which bit made the difference?
- Why did adding 12 give 0?
- Where in a program does the type `int` or `unsigned` exist, if not in the instructions?

## 11. The model and the real processor

A real processor's registers hold bits with no type, as the simulator's do. Nothing in this lesson is simplified.

# Lesson 2: Constants and widths

## 0. Objectives

- say which numbers one `mov` can put in a register, and build the rest with `movk`;
- explain why `-1` and `4294967295` give the same instruction;
- use the `x` and `w` names of one register, and say what writing the `w` name does to the rest.

## 1. Why can one instruction not hold 1000000?

The trip computer's service interval is 30000 kilometres. The odometer's limit is 1000000.

GCC makes one instruction for `return 30000;`: `mov w0, 30000`. For `return 1000000;` it makes two: `mov w0, 16960`, then `movk w0, 0xf, lsl 16`.

*The two functions and GCC's listings for them.*

## 2. Numbers inside instructions

Almost every function puts a fixed number in a register somewhere. The instruction `mov` does that: `mov w0, 30000` puts 30000 in `w0`. A number written inside an instruction is called a **constant**. An instruction is a fixed size, so only some numbers fit inside one.

## 3. Which numbers fit?

Each number below could be the constant in one `mov`.

**Which of these can one `mov` put in `w0`?**

- 65536
- 70000
- 100000
- 1000000

*Shown after the answer is checked.*

Only 65536. Its bits fit in one of the register's two 16-bit halves, the lower or the upper: a single 1, with nothing else set. The other three need bits in both halves.

## 4. Trying a number

The figure assembles `mov w0, ` followed by the number you type. Assembling turns that text into an instruction. The course's assembler accepts and rejects the same numbers as the GNU assembler. The GNU assembler is the program that GCC itself uses to turn its listings into instructions.

A `mov` with a constant works when the number's set bits all fall within one 16-bit half of the register. For a number that needs both halves, the assembler says no single instruction can put it in a register.

*Type a number; the figure shows whether one `mov` can hold it, and what `w0` then holds.*

**A few more numbers fit.**

A number whose bits are all ones except within one 16-bit half fits, such as `-1`. So does a number whose bits repeat one short pattern, such as 65537, which is `0x00010001`.

## 5. Building 1000000

`movk` replaces one 16-bit half of a register and keeps the rest. `lsl 16` names the upper half. 1000000 is `0x000f4240`: the lower half is `0x4240`, which is 16960, and the upper half is `0xf`, which is 15.

**Build 1000000**

Put 1000000 in `w0` and return it, using only `mov`, `movk` and `ret`. The starting text, `mov w0, 1000000` then `ret`, does not assemble.

1. One `mov` holds a number whose bits fall in one 16-bit half. `movk` sets the other half without touching the first.
2. A second `mov` replaces the whole register. Only `movk` keeps the other half.
3. `mov w0, 1` then `movk w0, 1, lsl 16` leaves 65537 in `w0`.
4. The lower half is 16960, and `mov w0, 16960` puts it there.
5. `mov w0, 16960`, then `movk w0, 0xf, lsl 16`, then `ret`.

## 6. Two names, one register

The registers so far have been drawn as 32 bits, because the lessons used their `w` names. Each register holds 64 bits, and it has two names. The **`x` register** name is `x3`, and it names all 64 bits. The **`w` register** name is `w3`, and it names the lower 32 bits of the same register. A `long` in C uses the `x` name: GCC turns `return -1;` with `long` into `mov x0, -1`. The figure runs `mov x3, -1`, which sets all 64 bits, then `mov w3, -1`.

*`x3` drawn as two halves of 32 bits, with `w3` its lower half.*

**After `mov w3, -1`, what does `x3` hold?**

- All 64 bits set, as before.
- The lower 32 bits set and the upper 32 cleared.
- The lower 32 bits set and the upper 32 unknown.
- The run stops with an error.

*Shown after the answer is checked.*

The lower 32 bits are set and the upper 32 are cleared, so `x3` holds `0x00000000ffffffff`. Writing a `w` name always clears the upper half of the register.

## 7. Constants in halves

One `mov` fits a number in one 16-bit half. `movk` fills in another half without disturbing the rest.

## 8. Constants and C types

GCC turns `return -1;` with `int` and `return 4294967295u;` with `unsigned` into the same instruction, `mov w0, -1`: the same 32 bits, read two ways.

Every constant in every listing is a pattern of bits. The C type only decides how the program reads it later.

## 9. Four instructions

The figure shows four instructions: `mov x1, -1`, `mov w1, 5`, `mov w2, 16960`, `movk w2, 0xf, lsl 16`.

**Predict two registers**

Without running them, give `x1` and `w2` after all four, as decimal numbers.

Field labels: "`x1` at the end"; "`w2` at the end".

1. Writing `w1` clears the upper half of `x1`.
2. `mov w1, 5` does not keep the 1s that `mov x1, -1` set in the upper half.
3. After `mov x3, -1` then `mov w3, -1`, `x3` is `0x00000000ffffffff`.
4. `w2` ends as `0x000f4240`.
5. `x1` is 5 and `w2` is 1000000.

## 10. Looking back

- Why does one `mov` hold 65536 but not 70000?
- What does `movk` keep that `mov` does not?
- If a function wrote `w0` and its caller read `x0`, what would the caller find in the upper half?

## 11. The model and the real processor

The course does not show how an instruction's bits hold its constant. The course takes which constants fit from the GNU assembler, and tests its own assembler against that one line by line.
