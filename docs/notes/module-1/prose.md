# Module 1: the lessons' words, as drafted

Drafted by Haiku from the fact brief in `docs/notes/module-1/brief.md`, a part at a time; checked for facts by the managing session, which sent four parts back once (a register's width stated two ways, the bits' worths given without their rule, the GNU assembler unexplained, and a repeat) and renamed one heading after its paragraph was cut. Every number was produced by the simulator or GNU as before the brief went out.

The improvement pass (the title of Lesson 1, the top-bit table, the halves of sixteen, the `x3` figure and the closing questions) used the words of `m1-improve.md`, checked for facts and kept word for word. Closed notes and text that appears only after a challenge has passed are marked in italics.

# Lesson 1: Same bits, two readings

## 0. Objectives

- read a register's 32 bits in hexadecimal, and convert hexadecimal back to bits;
- read one pattern of bits as an unsigned number and as a signed number;
- say what changes, or does not, in the instructions GCC makes when a function's C type changes from `int` to `unsigned`.

## 1. Which is right, −12 or 4294967284?

In Module 0, `fuel_used` was first written with its subtraction the wrong way round. The figure runs that version, named `fuel_used_wrong`, as `fuel_used_wrong(50, 38)`.

The C calculation is 38 minus 50, with type `int`. That gives −12.

After `sub w0, w1, w0`, the register `w0` holds a pattern of 32 bits. Read as an unsigned number, where every bit counts as a positive amount, those bits give 4294967284.

How can the same bits be −12?

*fuel_used_wrong(50, 38) as first written. Press Next to see what its subtraction writes to w0.*

## 2. Why the readings matter

A register holds bits, not a signed or an unsigned number. The decimal number a figure shows is one way of reading those bits.

A program that reads the bits one way, when the C meant the other, gets a wrong answer with no error. Later modules show instructions that choose a reading.

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

Thirty-two ones and zeros are hard to read, so they are written in **hexadecimal**. Each group of four bits becomes one digit: 0 to 9, then `a` to `f` for ten to fifteen. `1111` is fifteen, so it is `f`; `0100` is four, so it is `4`. The eight bits `1111 0100` are written `f4`.

A `0x` in front marks a number as hexadecimal. The pattern in `w0` is eight groups of four, `1111 1111 1111 1111 1111 1111 1111 0100`, written `0xfffffff4`.

Hexadecimal is a compact way to write a bit pattern. It does not tell you whether to read that pattern as signed or unsigned. The figure below shows each digit under its four bits.

Each bit is worth twice the bit to its right: 1, 2, 4, 8 and so on. The leftmost bit, bit 31, is the **top bit**. It is worth 2147483648.

The **unsigned reading** adds the values of the bits that are 1. The **signed reading** does the same, except the top bit counts as minus 2147483648.

The other 31 bits count the same in both readings. So when the top bit is 0, the two readings agree.

The figure starts with `0xfffffff4`, the pattern `sub` left in `w0`. It shows the top bit's value and the other 31 bits' total in each reading. The full sum of every bit is under "Show calculation".

A bit that is 1 is **set**, and a bit that is 0 is **clear**: to set a bit is to make it 1, and to clear it is to make it 0.

Set or clear any bit, or press "Clear bits" to start from zero.

*One register, with each hexadecimal digit under its four bits. Each reading shows the top bit's value and the total from the other bits.*

## 5. Bits that read as −1

You can press bits one at a time, or type a pattern in hexadecimal and the bits follow it. The figure in "Reading the bits" shows both readings of any bits you change there.

**Make −1**

Set `w0`'s bits so that its signed reading is −1, then give the unsigned reading of the same bits.

Field labels: "the bits of `w0`" and "its unsigned reading".

1. In the signed reading the top bit is worth minus 2147483648, and the other bits add to it.
2. −1 is not the pattern for 1 with the top bit set.
3. The pattern for −12 is `0xfffffff4`; adding 12 to it gives 0.
4. The pattern for −1 is the one that gives 0 when 1 is added to it.
5. Set all 32 bits: `0xffffffff`. Its unsigned reading is 4294967295.

*Shown once Make −1 has passed.*

With all 32 bits set, the signed reading is −1 and the unsigned reading is 4294967295.

## 6. The `unsigned` version

The figure shows `fuel_used_wrong`, with `int`, beside `fuel_used_wrong_u`, the same C with `unsigned`.

*Closed note.*

**Which compiler?**

Both listings are from GCC 16.1 with the setting `-O1`, as in Module 0.

*The two functions side by side, with GCC's listing for each.*

**What does GCC do differently for the `unsigned` version?**

- It uses a different subtraction.
- Nothing: the instructions are the same.
- It adds a check for a negative answer.
- It uses different register names.

*Shown after the answer is checked.*

Both listings are `sub w0, w1, w0` then `ret`. GCC used the same `sub` instruction for both functions. The subtraction produces the same 32-bit pattern. Signed and unsigned values differ in how that pattern is read. Other operations, such as division and comparisons, can require different instructions.

## 7. Bits and readings

A register has no type.

An addition or a subtraction gives the same bits, whichever reading the program uses later. That is why one `sub` serves both `int` and `unsigned` here.

Both −12 and 4294967284 are readings of the same 32 bits. The C type says which reading the program means: `fuel_used_wrong` returns an `int`, so it means −12.

## 8. Every 32-bit pattern

Every 32-bit pattern has an unsigned reading from 0 to 4294967295, and a signed reading from −2147483648 to 2147483647.

Some instructions depend on whether the bits are read as signed or unsigned. Later modules show how to choose between them.

## 9. Three more patterns

Use what you have learned to read three new patterns.

**Two readings each**

Give both readings of three patterns: `0x0000002a`, `0x80000000` and `0xffffff38`.

Field labels, in order: "unsigned reading of `0x0000002a`"; "signed reading of `0x0000002a`"; "unsigned reading of `0x80000000`"; "signed reading of `0x80000000`"; "unsigned reading of `0xffffff38`"; "signed reading of `0xffffff38`".

1. The unsigned reading counts the top bit as plus 2147483648. The signed reading counts it as minus 2147483648.
2. Do not expect two different numbers from every pattern. When the top bit is 0, the two readings agree.
3. `0xfffffff4` reads as 4294967284 unsigned and −12 signed.
4. `0x0000002a` has its top bit 0, so both readings are 42.
5. The answers, unsigned first in each pair: 42 and 42; 2147483648 and −2147483648; 4294967096 and −200.

## 10. What you now know

- Hexadecimal is a compact way to write bits: four bits per digit.
- One 32-bit pattern has an unsigned reading and a signed reading.
- The top bit is worth plus 2147483648 in one reading and minus 2147483648 in the other.
- A register does not store a C type.

**What are the unsigned and signed readings of `0x80000001`?**

*Closed note.*

**Answer**

Unsigned 2147483649: the top bit, 2147483648, plus 1. Signed −2147483647: minus 2147483648, plus 1.

## 11. The model and the real processor

A real processor's registers hold bits with no type, as the simulator's do. Each register holds 64 bits; this lesson's figures show only the lower 32, which the `w` names use. Lesson 2 shows the rest.

# Lesson 2: Constants and widths

## 0. Objectives

- say which numbers one `mov` can put in a register, and build the rest with `movk`;
- explain why `-1` and `4294967295` give the same instruction;
- use the `x` and `w` names of one register, and say what writing the `w` name does to the rest.

## 1. Why can one instruction not hold 1000000?

The trip computer's service interval is 30000 kilometres. The odometer's limit is 1000000.

For `return 30000;`, GCC loads the result with one instruction: `mov w0, 30000`. For `return 1000000;`, it needs two instructions to load the result. In both cases, `ret` then returns to the code that called the function.

The C listing uses `int service_interval(void)`. The `void` inside the brackets means the function takes no arguments.

*Closed note.*

**Which compiler?**

The listings in this lesson are from GCC 16.1 with `-O1`, as in Module 0.

*service_interval in C and the instructions GCC produces for it.*

## 2. Numbers inside instructions

`mov` puts a fixed number in a register: `mov w0, 30000` puts 30000 in `w0`. A number written inside an instruction is a **constant**.

An instruction is 32 bits long. Some bits identify the operation and the destination register, leaving fewer than 32 for the constant. So one instruction cannot hold every 32-bit constant.

Split a register's 32 bits into two halves. The upper half is the left 16 bits. The lower half is the right 16 bits.

30000 is `0x00007530`. Its upper half is `0000`, so all its set bits are in the lower half.

A single `mov` can load a constant whose set bits all fall in one 16-bit half. Some other patterns load too, so this is not the complete rule.

In hexadecimal each half is four digits, so the boundary falls in the middle of the eight digits.

## 3. Which numbers fit?

Here are three of the four in hexadecimal, with a space between the halves. 65536 is `0x0001 0000`, 70000 is `0x0001 1170`, and 100000 is `0x0001 86a0`. The fourth, 1000000, is the odometer limit from the first section, which GCC needs two instructions for. Look at which halves of the three numbers have set bits.

**Which number does the rule above guarantee will fit in one `mov` to `w0`?**

- 65536
- 70000
- 100000
- 1000000

*Shown after the answer is checked.*

The rule guarantees that 65536 fits. Its only set bit is in the upper half, so its lower half is `0000`. The other three numbers have set bits in both halves, so the rule does not tell us whether they fit. The assembler rejects all three; you can check them in the next figure.

## 4. Trying a number

The figure assembles `mov w0,` followed by the number you type. Assembling turns that text into an instruction.

The course's assembler accepts and rejects the same numbers as the GNU assembler, the program GCC uses to turn its listings into instructions. So the figure is the authority on whether a number fits.

Other patterns load with one `mov` because `mov` is a name the assembler accepts for more than one instruction. It picks the one that can hold the constant.

*Closed note.*

**Other patterns that fit**

`-1` fits, with all 32 bits set.

1048575 (`0x000fffff`) fits. It has twenty 1s in a row across both halves.

65537 (`0x00010001`) fits. It is a single 1 repeated every 16 bits.

The full rule is longer than this course needs. The figure checks any number.

*Type a number; the figure shows whether one `mov` can hold it, and what `w0` then holds.*

## 5. Building 1000000

With a `w` name, `movk` replaces one 16-bit half of the 32 bits and keeps the other half. `mov` replaces all 32 bits.

`lsl 16` after the number tells `movk` to put it in the upper half, bits 16 to 31. Without `lsl 16`, `movk` puts it in the lower half.

For example, `mov w0, 3` gives `0x0000 0003`. Then `movk w0, 2, lsl 16` gives `0x0002 0003`, which is 131075. The upper half is new, and the lower half is kept. The figure draws each step.

To split a non-negative 32-bit integer into halves, divide it by 65536. This is the value of the lowest bit in the upper half. Take the result without its fractional part for the upper half. The amount left after this whole-number division is the **remainder**. It gives the lower half. In the example above, 131075 = 2 × 65536 + 3, so the upper half is 2 and the lower half is 3.

Writing `#` before a number is optional. `mov w0, 30000` and `mov w0, #30000` are the same instruction.

**Build 1000000**

Put 1000000 in `w0` and return it, using only `mov`, `movk` and `ret`. The starting text, `mov w0, 1000000` then `ret`, does not assemble.

1. One `mov` holds a number whose bits fall in one 16-bit half. `movk` writes the other half without touching the first.
2. A second `mov` replaces the whole register. Only `movk` keeps the other half.
3. `mov w0, 1` then `movk w0, 1, lsl 16` leaves 65537 in `w0`.
4. The lower half is 16960, and `mov w0, 16960` puts it there.
5. `mov w0, 16960`, then `movk w0, 0xf, lsl 16`, then `ret`.

*Shown once Build 1000000 has passed.*

Step through your solution below to see the two halves of `w0` after each instruction. Watch which half changes and which is kept.

## 6. Two names, one register

The figures so far showed 32 bits, because they used `w` names. Each register holds 64 bits, and it has two names.

The `x` name, `x3`, names all 64 bits. The `w` name, `w3`, names the lower 32 bits of the same register. They are not two registers.

The figure runs `mov x3, -1`, which sets all 64 bits, then `mov w3, -1`.

*`x3` drawn as two halves of 32 bits, with `w3` its lower half.*

**After `mov w3, -1`, what does `x3` hold?**

- All 64 bits set, as before.
- The lower 32 bits set and the upper 32 cleared.
- The lower 32 bits set and the upper 32 unknown.
- The run stops with an error.

*Shown after the answer is checked.*

The lower 32 bits are set and the upper 32 are cleared, so `x3` holds `0x00000000ffffffff`. Writing a `w` name always clears the upper 32 bits of the `x` register.

## 7. Constants in halves

A constant that does not fit in one `mov` is built half by half, with `mov` then `movk`.

## 8. Constants and C types

A `long` in C is an integer type. It is 64 bits on the system GCC compiles for here.

For a function returning `long`, GCC 16.1 at `-O1` loads the result of `return -1;` with `mov x0, -1`. The `x` name gives the instruction access to all 64 bits.

The `u` in `4294967295u` marks the constant as `unsigned`.

GCC 16.1 at `-O1` turns `return -1;` with `int` and `return 4294967295u;` with `unsigned` into the same instruction, `mov w0, -1`: the same 32 bits, read two ways.

Every constant in these listings is a pattern of bits. The C type affects how many bits the instructions use and how the program interprets those bits.

## 9. Four instructions

The figure shows four instructions: `mov x1, -1`, `mov w1, 5`, `mov w2, 16960`, `movk w2, 0xf, lsl 16`.

**Predict two registers**

Without running them, give `x1` and `w2` after all four, as decimal numbers.

Field labels: "`x1` at the end"; "`w2` at the end".

1. Writing `w1` clears the upper 32 bits of `x1`.
2. `mov w1, 5` does not keep the 1s that `mov x1, -1` set in the upper 32 bits.
3. After `mov x3, -1` then `mov w3, -1`, `x3` is `0x00000000ffffffff`.
4. `w2` ends as `0x000f4240`.
5. `x1` is 5 and `w2` is 1000000.

## 10. What you now know

- Not every constant fits in a single `mov`.
- With a `w` name, `movk` replaces one 16-bit half of the 32 bits and keeps the other half.
- `wN` names the lower 32 bits of `xN`.
- Writing `wN` clears the upper 32 bits of `xN`.

**`x5` holds `0xffffffffffffffff`. Then `mov w5, 7` runs. What does `x5` hold?**

*Closed note.*

**Answer**

`x5` holds 7. Writing `w5` put 7 in the lower 32 bits and cleared the upper 32.

## 11. The model and the real processor

The course does not show how an instruction's bits hold its constant. The course takes which constants fit from the GNU assembler, and tests its own assembler against that one line by line.
