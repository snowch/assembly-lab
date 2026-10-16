# The course machine

**Status: proposed for checkpoint 2** (16 October 2026). It assumes the plan's recommendation for
Decision 1, A64, which the author has not yet confirmed (`docs/plan.md`); if the author chooses
otherwise, this file is rewritten before any lesson depends on it.

The machine is a subset of A64, the 64-bit Arm instruction set, run by the course's simulator and
written in the GNU assembler's syntax, the syntax GCC prints. This file says what the subset is,
what each part does, how a program is laid out and run, and how the simulator is held to real
tools. `docs/plan.md` says which module introduces which instruction.

## Where each fact comes from

Arm's architecture reference manual (DDI 0487) is the authority, and it was not reachable from the
build containers when this file was written (`docs/sources.md`). Until it is, each rule below is
marked with what it was checked against:

- **[gas]**: GNU as 2.42 (`binutils-aarch64-linux-gnu`, Ubuntu 24.04) accepted or rejected the
  line, and `objdump` showed what it assembled to;
- **[qemu]**: QEMU 8.2.2 user mode (`qemu-aarch64`) ran it and its per-instruction CPU dump showed
  the result;
- **[gcc]**: a recorded GCC listing relies on it (`docs/notes/checkpoint-1/listings.md`);
- **[aapcs]**: AAPCS64, release 2025Q4;
- **[manual]**: still to be checked against DDI 0487 when it is reachable.

The differential test (below) turns every [qemu] mark into a test that runs on every push.

## State

- **31 general registers**, each 64 bits. Named `x0` to `x30` when all 64 bits are meant and `w0`
  to `w30` for the low 32 bits of the same register. `x30` is the link register. GNU as also accepts `lr` for it [gas], and so does
  the course's assembler; the lessons write `x30`, as GCC's listings do.
- **Writing a `w` register clears the top 32 bits of its `x` register.** [qemu, gcc; manual]
- **The zero register**, `xzr` and `wzr`: reads as 0, a write to it is discarded. In the same
  operand position some instructions mean `sp` instead (below). [gas; manual]
- **The stack pointer**, `sp` (and `wsp` for its low 32 bits), 64 bits.
- **The flags**: N, Z, C and V. The course draws them in that order.
- **The program counter**, 64 bits, not a general register.
- **Memory**: bytes at 64-bit addresses, little-endian. Only the regions a program declares, and
  the stack, exist; any other address stops the run (Faults, below).

### What each instruction does to the flags

Only instructions whose name ends in `s`, and `cmp`, `cmn` and `tst`, change the flags.
Everything else leaves them alone. [gas, qemu]

- **Addition** (`adds`, `cmn`): N is the result's top bit; Z is 1 when the result is 0; C is the
  carry out of the top bit; V is 1 when the carry into the top bit differs from the carry out.
  [qemu]
- **Subtraction** (`subs`, `cmp`, `negs`): computed as `a + NOT b + 1`, and the flags are that
  addition's. So C is 1 when no borrow happened (`a >= b` under the unsigned reading). [qemu]
- **Logical** (`ands`, `bics`, `tst`): N and Z from the result; C and V cleared to 0. [manual,
  then qemu in the corpus]
- The width of the operation (`w` or `x`) decides which bit is "the top bit": 31 or 63.

## The instructions

Mnemonics are case-insensitive. An immediate may be written with or without `#` (GCC omits it).
The assembler accepts exactly what GNU as accepts for these forms, and rejects with a message what
it rejects; the corpus pins each rule.

| Group | Instructions | Forms and rules |
| --- | --- | --- |
| Move | `mov`, `movz`, `movn`, `movk` | `mov` with a constant is accepted when one instruction can make it: a 16-bit chunk in one position (`movz`), the inverse of one (`movn`), or a bitmask pattern (as `orr`); otherwise "immediate cannot be moved by a single instruction" [gas]: `mov w0, 0x12345` is rejected, `mov w0, 65536`, `-1`, `0xffff0000` and `0x00ff00ff` are accepted [gas]. `movk` keeps the other bits and replaces one 16-bit chunk (`lsl 16`, `32`, `48`). `mov` between registers, and with `sp`. |
| Add and subtract | `add`, `adds`, `sub`, `subs`, `cmp`, `cmn`, `neg`, `negs` | immediate 0 to 4095, optionally `lsl 12` [gas]; GNU as also accepts a multiple of 4096 up to 4095 × 4096 by shifting it itself, and a negative immediate by swapping add and subtract (`add w0, w0, -1` is `sub w0, w0, 1`; `cmp w0, -5` is `cmn w0, 5`) [gas]; shifted register (`lsl`, `lsr`, `asr` by 0 to 31 or 63); extended register (`uxtb`, `uxth`, `uxtw`, `sxtb`, `sxth`, `sxtw`, `uxtx`, `sxtx`, with an optional left shift 0 to 4). `sp` may be the destination or first source of the immediate and extended forms. |
| Logical | `and`, `ands`, `orr`, `eor`, `bic`, `bics`, `orn`, `eon`, `mvn`, `tst` | immediate only when it is a bitmask pattern (`and w0, w0, 255` accepted; `and w0, w0, 257` rejected, "immediate out of range") [gas]; shifted register (`lsl`, `lsr`, `asr`, `ror`). |
| Shifts and fields | `lsl`, `lsr`, `asr`, `ror`; `ubfx`, `sbfx`, `ubfiz`, `sbfiz`, `bfi`, `bfxil`; `uxtb`, `uxth`, `sxtb`, `sxth`, `sxtw` | by an immediate 0 to width − 1 (`lsl w0, w1, 33` rejected, "immediate value out of range 0 to 31") [gas]; by a register, taking the amount modulo the width (`lsl` by 33 of a `w` register shifts by 1) [qemu]. |
| Conditional | `csel`, `csinc`, `csinv`, `csneg`, `cset`, `csetm`, `cinc`, `cneg` | conditions below. |
| Multiply and divide | `mul`, `madd`, `msub`, `mneg`, `smull`, `umull`, `smaddl`, `umaddl`, `smulh`, `umulh`, `sdiv`, `udiv` | division by zero gives 0 and does not stop the run [qemu; manual]; the most negative value divided by −1 gives itself [qemu; manual]. |
| Load and store | `ldr`, `str`, `ldrb`, `strb`, `ldrh`, `strh`, `ldrsb`, `ldrsh`, `ldrsw`, `ldp`, `stp`, `ldur`, `stur` | base `[xn]` or `[sp]`; with an immediate offset (scaled and unsigned, or unscaled and −256 to 255, which GNU as picks itself: `ldr w0, [x1, 3]` becomes `ldur`) [gas]; pre-index `[xn, imm]!`; post-index `[xn], imm`; register offset `[xn, xm]`, `[xn, xm, lsl s]`, `[xn, wm, sxtw s]`, `[xn, wm, uxtw s]`, where `s` is 0 or the access size's shift. An offset out of range is rejected ("immediate offset out of range") [gas]. `ldrsb`, `ldrsh` into `w` or `x`; `ldrsw` into `x`. Unaligned addresses are allowed for these. |
| Addresses | `adr`, `adrp` with `:lo12:` in `add` and in a load's offset | how GCC reaches a global; `adr` for a label within the program. |
| Branches | `b`, `b.cond` and the GCC spelling `bcond` (`bge` is `b.ge`) [gas], `cbz`, `cbnz`, `tbz`, `tbnz`, `bl`, `blr`, `br`, `ret` | `ret` with no operand returns to `x30`. |
| Other | `nop` | |

**Conditions**: `eq`, `ne`, `cs` (also `hs`), `cc` (also `lo`), `mi`, `pl`, `vs`, `vc`, `hi`, `ls`,
`ge`, `lt`, `gt`, `le`, `al`. Each is defined by the flags as the manual's condition table gives it
[manual], and the corpus holds each one at the flag values where it changes.

**Width rules**: the registers of one instruction agree in width except where a form says
otherwise (an extended operand, `smull`, `ldrsw`); a mismatch is rejected with "operand mismatch"
[gas].

### Directives and program text

`.text`, `.data`, `.rodata` (as `.section .rodata`), `.bss`, `.global`/`.globl`, `.type`,
`.size`, `.align`, `.p2align`, `.balign`, `.byte`, `.hword`/`.2byte`, `.word`/`.4byte`,
`.quad`/`.8byte`, `.ascii`, `.asciz`/`.string`, `.zero`/`.skip`. Directives GCC prints that the
course does not use (`.arch`, `.file`, `.cfi_*`, `.ident`, `.section .note.GNU-stack`) are
accepted and ignored, so a GCC listing assembles unchanged. Comments start with `//`; a label is a
name and a colon, `.L`-prefixed labels included.

## Programs and runs

A lesson's program is a function (or several) and, if it needs them, data. The simulator runs a
**call**: it sets the arguments in `x0` to `x7` (writing a `w` argument clears the top half, as
the hardware does), sets `sp` to the top of the stack and `x30` to a return address outside the
program, and runs until `ret` reaches that address. Registers not set by the call start at 0, as
QEMU's do at a program's entry [qemu].

**Layout.** The course fixes the addresses, so a figure's addresses are the addresses a real run
under QEMU has: text from `0x400000`, data and read-only data from `0x410000`, and a 64 KiB stack
whose top is `0x430000` (the stack is a `.bss` region from `0x420000`). The differential test
links with the same addresses (`ld -Ttext=0x400000 -Tdata=0x410000 -Tbss=0x420000`), and its
`_start` sets `sp` to `0x430000`; QEMU's own starting `sp` is elsewhere [qemu].

**Faults.** A run stops, with a sentence saying why and where, on: an address outside every
region; a store into text or read-only data; a branch to an address that is not an instruction;
or more steps than the run's limit (a loop that does not end). QEMU does not stop for a misaligned
`sp` [qemu]; neither does the simulator, but the trace marks it, because AAPCS64 requires `sp` to
be a multiple of 16 at every call [aapcs].

**The trace.** Each step records the instruction's address and source line, the registers it
wrote (before and after), the flags before and after, the bytes it stored (address, before, after),
whether a branch was taken and where to, and, for an addition or subtraction, the carry into every
bit. The figures draw from the trace; nothing in a figure is computed elsewhere.

**The instruction gate.** The assembler can be given the set of instructions a lesson allows. An
instruction outside it is rejected with a message that names it and says the course has not met
it yet. The message is learner-facing and goes through the prose process.

## What the machine leaves out

Encodings (no figure shows an instruction's bits; GNU as is the reference for which forms exist),
floating point and SIMD, system registers and exceptions other than the run's own stops, atomics
and exclusives, the carry-using `adc` and `sbc`, the bit-counting instructions, pointer
authentication, and timing of any kind: a step is one instruction, and there are no pipelines or
caches. Each lesson's model-versus-reality note says which of these its program would meet on real
hardware, if any.

## The differential test

`scripts/real-tools/` holds a corpus of programs, each a function, its data, and a list of calls
(arguments in, and what to compare). For each call it:

1. assembles the program with GNU as and links it with a generated `_start` that sets `sp`, puts
   the arguments in registers, calls the function, writes the program's data regions to standard
   output, and exits (linked at the layout above);
2. runs it under `qemu-aarch64 -one-insn-per-tb -d cpu`, which dumps every register and the flags
   before each instruction;
3. runs the same call on the simulator;
4. compares, instruction by instruction inside the function: the program counter, `x0` to `x30`,
   `sp` and NZCV; and at the end, the data regions' bytes.

A difference fails the test and prints the first instruction where the two disagree. The corpus
holds a program for every rule above, and every program a lesson shows is added to it. CI runs it
as its own job (it installs `qemu-user` and `binutils-aarch64-linux-gnu`); locally it runs where
those tools are installed or unpacked, found through `AL_TOOLS`. A second check runs every line in
`scripts/real-tools/lines/` through GNU as and through the course's assembler, and fails where one
accepts a line the other rejects.
