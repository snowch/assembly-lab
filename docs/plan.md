# The course plan

What the course teaches, module by module and in what order, the decisions the author takes at
checkpoint 1, and what has been decided since. It says what is planned, not what is built: the
front page shows which modules have lessons, worked out from the lessons themselves.

**Status: proposed, for the author's review at checkpoint 1** (16 October 2026). Four decisions
below are the author's to take before any lesson is written. Each has a recommendation.

## What the course is for

The third of the author's works on one machine, each a different way of knowing it:

| Work | The machine, seen as | The reader |
| --- | --- | --- |
| `snowch/digital-design` | something you **build**: gates up to a CPU with its own instruction set | builds each part, then uses it |
| the notes, *From gates to a compiled if* (`snowch/programmer-calculator`, `docs/`) | something you **read**: what bits mean, the wheel, the flags, where C trips | reads, steps worked examples, drills |
| **Assembly Lab** | something you **drive**: a real instruction set, one instruction at a time, with the C that compiled to it | writes and runs programs, predicts, breaks, compares with a real compiler |

Digital-design teaches assembly for its own course machine (its Modules 10 and 11), whose
instruction set is deliberately original. Assembly Lab is the one that meets a real instruction
set, the one a real compiler targets, and is the place the notes send a reader who gets stuck on
a listing.

The learner finishes able to read the listing a compiler produces for small C functions, predict
what each instruction does to the registers, the flags and memory, write small functions by hand
that pass tests, and say why a C program behaves differently at the edge of a type's range from
how it reads.

### The thesis every module serves

> The registers hold bits. The instruction decides what they mean.

C's types (`int8_t` or `uint8_t`, `int` or `unsigned`, a pointer) do not exist in the machine. A
type is a choice of instruction: which load, which compare, which branch, which multiply, which
shift. Every module shows one more place where the compiler made that choice for you.

### What the course assumes

The reader can read simple C (variables, `if`, loops, functions, arrays) and convert between
binary and decimal. It does not assume two's complement, any assembly, or any electronics:
Module 1 derives the signed reading from the machine, and the course links to digital-design and
the notes for how the parts are built, never relying on them.

## Decision 1: which machine

The course drives one real instruction set throughout. Three candidates, each shown by what GCC
16.1 and 15.2 emit at `-O1` for the same C on Compiler Explorer (16 October 2026; the listings
are kept in `docs/notes/checkpoint-1/`):

| | **A64** (64-bit ARM, AArch64) | **A32** (32-bit ARM, Armv7-A) | an 8-bit teaching machine |
| --- | --- | --- | --- |
| What runs it | phones, Apple silicon Macs, Raspberry Pi 4 and 5 on a 64-bit OS, AWS Graviton and other Arm servers | Raspberry Pi on a 32-bit OS, older phones; microcontrollers run its Thumb form | nothing: the notes' fiction, with ARM's names |
| Registers | 31 of 64 bits; each also read as 32 bits (`w0` is the low half of `x0`) | 16 of 32 bits, three of them special (`sp`, `lr`, `pc`) | as many as the course likes, 8 bits |
| `int x; x / y` | `sdiv w0, w0, w1` | `bl __aeabi_idiv`: Armv7-A has no divide instruction | invented |
| `a > b ? a : b` | `cmp`, then `csel w0, w1, w0, ge` | `cmp`, then `movge r0, r1`: any instruction can be made conditional | invented |
| `return 257;` | `mov w0, 257` | `movw r0, #257`: plain `mov` cannot hold 257 | invented |
| `long + int` | `add x0, x0, w1, sxtw`: the int is sign-extended inside the add | not applicable: `long` is 32 bits | not applicable |
| Agrees with a real compiler and a real CPU | yes | yes | no: `int8_t` arithmetic in real code runs at 32 bits and is then narrowed (`sxtb`), so the 8-bit machine's V flag is not what a real program sees |

**Recommendation: A64**, with the 32-bit `w` registers as the working width until memory
arrives. The reasons:

- It is what the reader's own phone, laptop or cloud server most likely runs, so a program
  from the course can run natively, and the compiler comparison panel matches what they would see
  at work.
- `int` arithmetic happens in the 32-bit `w` registers, so Modules 1 to 5 draw 32 bits, as A32
  would. The 64-bit `x` registers arrive with addresses in Module 6, which is where the notes'
  hardest idea, widening a value by copying its sign bit, becomes an everyday instruction
  (`sxtw`, `ldrsb w0`, `ldrsw x0`).
- It is cleaner to simulate correctly: no `pc` as an ordinary register, no conditional execution
  on every instruction, no shifter carry rules for logical instructions, and division by zero is
  defined (the result is 0), so the simulator can be exact.
- It reads the flags with `csel`, `cset` and `b.ge`, which keep "compare, then decide" visible
  without A32's conditional suffix on every instruction.

What A64 costs: two names for each register (`w0` and `x0`) are one more thing in Module 1, and
its logical-immediate rule (which constants `and w0, w0, #...` accepts) is stranger than A32's.
The course meets the first head on in Module 1 and keeps the second in a `details` note.

A32 stays in the course as the optional chapter (Decision 4), where conditional execution and
the missing divide are the point. The 8-bit machine is not recommended: the comparison with a
real compiler would contradict it from Module 2 onward. Its one virtue, every bit on screen, the
figures keep by drawing 32 bits grouped in bytes, and drawing a 64-bit register as two halves.

## Decision 2: the course's name

**Recommendation:** *Assembly Lab: From a Line of C to the Bits in a Register.* It names the
journey the way *Digital Design: From Bits to a Working Computer* and *Metadata Systems: From Raw
Files to a Working Metadata Platform* do, and "Lab" pairs with the notes' Bit Lab. Alternative:
*Assembly Lab: Driving a Real Processor from C.*

## Decision 3: a running situation

Both earlier courses give their lessons a real question from a running situation (a shop with
freezer rooms; a bicycle-parts shop's data platform). This course needs values that are naturally
signed and unsigned, narrow and wide, and counters that wrap.

**Recommendation: a car's trip computer.** Every quantity it handles exercises one of the
modules, and none needs explaining:

- an outside temperature, a signed byte from a sensor (Modules 1, 6);
- a fuel-level reading, an unsigned byte (Modules 1, 6);
- a millisecond tick counter that wraps, and the elapsed time computed across the wrap by
  unsigned subtraction, which is correct even when it looks wrong (Modules 2, 4);
- distance and fuel used, and the average consumption, which needs a multiply into a wider
  result and a divide (Module 8);
- a log of trips in memory, walked as an array (Module 7);
- warning flags packed into one word (Module 3).

It overlaps with neither earlier course's situation. Alternative: no running situation, each
lesson opening on a short C function with a question about it, as the notes do.

## Decision 4: what is optional

**Recommendation:** one optional chapter after the parts, *The same programs on 32-bit ARM*,
where the course's programs are compiled for A32 and the learner sees conditional execution, the
missing divide and the different immediates. A second optional chapter, on x86-64, is possible
later and not planned.

## The modules

Built in order; each module's capstone is used again later. Every lesson has the platform's ten
sections (question, motivation, prediction, investigation, construction, failure experiment,
explanation, generalisation, challenge, reflection) and follows the loop predict, run, inspect,
break, explain, change, run again. A module's plan note fixes its lessons; the estimate is two
lessons a module.

### Part 1: The machine's state

| Module | Teaches | Key figures | Capstone | C beside it |
| --- | --- | --- | --- | --- |
| 0 Meet the machine | a program is a list of instructions; each changes a few registers, the flags or memory, and the next one runs | a finished C function stepped instruction by instruction, its C line lit as each runs; the registers drawn as bits | trace a five-instruction function and predict its result | a whole function, and the listing GCC made for it |
| 1 Registers and readings | a register is 32 (or 64) bits with no type; one pattern read unsigned, signed and in hex; `mov` and which constants fit; `w` and `x` | a register to change bit by bit, read three ways at once; `mov` with a constant that will not fit | put given values in registers; say what a pattern reads as each way | `int`, `unsigned`, `uint8_t` declarations: the same bits, different readings |
| 2 Adding, subtracting and the flags | `add`, `sub`, `adds`, `subs`, `neg`; the carries; N, Z, C (on subtraction: no borrow), V (the carry into the top bit differs from the carry out); one adder for both readings | carries drawn column by column; flags predicted before the run; the tick counter's elapsed time across the wrap | predict the four flags for given additions; write `elapsed(now, then)` and pass its tests across the wrap | `a + b`, `a - b`, and why the two readings need one adder, not two |
| 3 Logic, shifts and masks | `and`, `orr`, `eor`, `bic`, `mvn`, `tst`; `lsl`, `lsr`, `asr`, `ror`; shifted operands; fields and masks | a word with a mask over it; a shift that fills with 0 or with the sign | pack and unpack the trip computer's warning word | `&`, `|`, `^`, `~`, `<<`, `>>` on signed and unsigned |

### Part 2: Choosing what runs next

| Module | Teaches | Key figures | Capstone | C beside it |
| --- | --- | --- | --- | --- |
| 4 Compare and branch | `cmp`, `cmn`, `tst`; `b.cond`; the condition table and its signed and unsigned pairs; `cset`, `csel`; `cbz`, `tbz` | one compare, every condition, which branches go; a listing with arrows from each branch | a signed and an unsigned maximum that give different answers for the same bits | `if`, `?:`, comparisons between signed and unsigned |
| 5 Loops | a loop is a branch backwards; counting up and down; the flags from `subs` instead of a `cmp`; the unsigned countdown that never ends | a loop's run with the branch's target lit; the iteration count against the input | write loops that pass their tests, including at 0 and at the type's limits | `for`, `while`, `do`, and the `i >= 0` that is always true |

### Part 3: Memory

| Module | Teaches | Key figures | Capstone | C beside it |
| --- | --- | --- | --- | --- |
| 6 Loads, stores and widths | memory as bytes with addresses; little-endian order; `ldr`, `str`, `ldrb`, `ldrsb`, `ldrh`, `ldrsh`, `ldrsw`, `strb`, `strh`; zero and sign extension; addresses are 64 bits (`x` registers) | memory as rows of bytes; a load drawn as bits copied and the rest filled; the same byte loaded both ways | read the trip computer's sensor record of mixed widths | `char`, `short`, `int`, `long`, casts, and a pointer's size |
| 7 Arrays, strings and pointers | an index scaled by the element's size; addressing modes with an offset, pre- and post-index; a string as bytes ending in 0 | an array in memory with the pointer moving through it | walk the log of trips; find a string's length | `a[i]`, `*p++`, `p + 1` meaning one element on |
| 8 Multiply and divide | `mul`, `madd`, `smull`, `umull`, `smulh`, `umulh`; `sdiv`, `udiv`; the high half, where the reading matters again; dividing by a constant by multiplying | a product in two halves; a division with its quotient and the remainder computed from it | average consumption without overflow | `*`, `/`, `%`, `INT_MIN / -1` |

### Part 4: Functions and C

| Module | Teaches | Key figures | Capstone | C beside it |
| --- | --- | --- | --- | --- |
| 9 Calls and the stack | `bl`, `ret`, the link register; the stack in memory; `stp`, `ldp`; which registers carry arguments and results and which a function must keep (the calling convention) | the stack growing and shrinking as calls run; the registers a call may change | a function that calls another and keeps its values; a recursive one | functions, arguments, local variables, recursion |
| 10 From C to assembly | the course's small C compiler: a line of C becomes instructions in a fixed pattern; then a real compiler at `-O1` does better | edit C and watch the listing change; the same C beside GCC's listing | hand-compile a small function and pass its tests | the C subset the course compiles (decided at checkpoint 5) |
| 11 Where C and the machine disagree | undefined behaviour against what the hardware does; the check the optimiser deletes; narrowing; `%d` and `%u`; sanitizers and checked arithmetic | the notes' ten C scenarios, run on this machine at 32 bits | find and fix the overflow in a given function, with tests that probe the edges | `-fwrapv`, `-fsanitize=undefined`, `ckd_add` |

### Optional, after the parts

| Chapter | What it shows |
| --- | --- |
| A The same programs on 32-bit ARM | the course's programs compiled for A32: conditional execution, `movw`, the divide that is a library call |

## The model

Everything a figure shows comes from running the course's model, never from a scripted
animation, as in the earlier courses:

- **An assembler** for the course's subset of A64, in the syntax GCC prints, with the errors a
  real assembler gives for a constant that will not fit or a register of the wrong width.
- **A simulator**: registers, the flags, byte-addressed little-endian memory with a stack, one
  instruction per step, and a trace of what each step changed. The adder exposes its carries so a
  figure can draw them.
- **A small C compiler (tier 2)**, from Module 10: a deliberate subset, compiled one statement at
  a time in a fixed pattern, so a C line maps to a few instructions the learner can predict. Its
  subset is decided at checkpoint 5, once the instruction set has settled.
- **A real compiler, optionally (tier 3)**: a "compare with GCC" panel sends the learner's C to
  Compiler Explorer's public API on a press, never on a keystroke, after saying that the code
  leaves the page and linking to Compiler Explorer's privacy policy; it shows the response's
  attribution line and a link to open the same code on godbolt.org; it caches each result; and the
  page works fully without it.

`docs/machine.md` will fix the subset, its syntax and its semantics, and what is left out, at
checkpoint 2.

### How the model is kept honest

- **A differential test against real tools.** A CI job assembles every program the course shows
  with the GNU toolchain for AArch64, runs it under QEMU's user mode, and compares the registers,
  the flags and memory with the simulator's. It plays the part that Verilator and Yosys play for
  digital-design. Ubuntu's `qemu-user` and `gcc-aarch64-linux-gnu` packages provide both.
- **Every claim about GCC's output is a compiled listing**, with the compiler's version and flags
  recorded where the lesson uses it.
- **Every claim about the instruction set is checked against Arm's architecture reference
  manual** (`docs/sources.md`), or by running it under QEMU, never from memory.

## The checkpoints

The author reviews the course at six checkpoints:

1. **The plan** (this file), the four decisions above, and the scaffold live on the site.
2. **The machine**: `docs/machine.md`, the assembler and the simulator, the differential test
   against QEMU passing, and Module 0 built end to end.
3. **The machine's state**: Modules 1 to 3 usable.
4. **Control and memory**: Modules 4 to 8 usable.
5. **The C compiler's subset**, before Module 10, with Module 9 done.
6. **The whole course**, Modules 10 and 11 and the optional chapter.

A module is done when its tests pass (unit, integration, the browser suite and the differential
test), its lessons have been read by a reviewer and the surviving findings fixed, `docs/` is
updated, and its one-page note in `docs/notes/` says what was reused, what was built and what
would be changed.

## How each module is built

The way digital-design was built, because it worked there:

1. **Plan.** The module's note records the facts the lessons rest on, each checked against the
   model or a source; the terms each lesson may introduce; and an originality note naming the
   textbook example to avoid.
2. **Build.** Code first. Then briefs to a Haiku subagent as lists of checked facts; Haiku drafts
   every sentence a learner reads; the builder checks the facts and nothing else, and sends a
   wrong draft back with a note.
3. **Read.** A reader is given the built site and screenshots at phone and desktop widths and
   presses everything. Each finding quotes the page, gives a severity, suggests a direction
   without rewriting, and never contains a challenge's answer.
4. **Sceptic.** A separate agent attacks every finding against the page, the model and the rules,
   and recommends the smallest fix.
5. **Fix list.** Only what survived, ranked, with the rejected items listed so they do not return.
6. **Verify.** A fresh checker confirms each fix in the built site: judge the page, not the note.
7. **Full check, then merge.**

No agent gives the verdict on its own work, the managing session's included.

## Decisions since the brief

None yet. Each decision is recorded here with its date and reasons.
