# Review of `docs/plan.md` (Assembly Lab, checkpoint 1)

Reviewer: read as the harshest reader, against `docs/notes/checkpoint-1/listings.md`, the two earlier
courses' `CLAUDE.md` and plans, the platform contract, and the notes in
`/home/user/programmer-calculator/docs/`.

Tools used: 10 Compiler Explorer compile requests (of 15 allowed), one `GET /api/compilers/c`;
`apt-get download` of Ubuntu 24.04's `binutils-aarch64-linux-gnu`, `binutils-arm-linux-gnueabihf` and
`qemu-user` (QEMU 8.2.2), unpacked under the scratchpad (no system install, no repository file touched), used to
assemble and run small programs. developer.arm.com is **not reachable** from here (the proxy answers 403 to
the CONNECT), so no claim below is checked against an Arm document. Claims that rest only on QEMU or GNU as are
labelled so; they are not claims about the architecture.

Counts: **2 high, 11 medium, 9 low** (22 findings).

---

## High

### 1. "Armv7-A has no divide instruction" is false, and Decision 1's table and Chapter A build on it

Plan, Decision 1 table: "`bl __aeabi_idiv`: Armv7-A has no divide instruction". Also Decision 1:
"A32 stays in the course as the optional chapter (Decision 4), where conditional execution and the
missing divide are the point"; Decision 4: "the missing divide"; the Optional table: "the divide
that is a library call".

Evidence (compiled, ARM GCC 15.2.0 `carmg1520`, `-O1 -marm`):
- `-march=armv7-a` gives `bl __aeabi_idiv` (the plan's listing, reproduced).
- `-march=armv7ve` gives `sdiv r0, r0, r1`, `udiv r0, r0, r1`, and for `a % b` `sdiv r3, r0, r1` then `mls r0, r3, r1, r0`.
- `-mcpu=cortex-a7` (the core of the Raspberry Pi 2) also gives `sdiv`/`udiv`.
- GNU as 2.42 (`arm-linux-gnueabihf-as`): `sdiv r0, r0, r1` with `-march=armv7-a` fails with "selected processor does not support `sdiv' in ARM mode"; it assembles with `-march=armv7ve` and with `-march=armv7-a+idiv`.

So the listing shows what GCC does for a baseline `armv7-a` target that does not assume the optional
divide; it does not show that the architecture lacks the instruction. The Arm text that would settle the
architectural statement is the Arm Architecture Reference Manual (DDI 0406 for Armv7-A/R, the divide
extension's section); unverified here for want of access. The table cell, the Chapter A teaching and the "Raspberry Pi
on a 32-bit OS" cell all inherit the error: a reader's own Pi 2/3 or 32-bit phone has a hardware divide.

Fix: state the true fact (baseline `-march=armv7-a` code calls a library routine; Armv7-A processors with the
divide extension, such as Cortex-A7/A15, have `sdiv`/`udiv`) and re-choose what Chapter A's "divide" point is.

### 2. The calling convention is needed from Module 0 but taught in Module 9

Plan, Module 0 capstone: "trace a five-instruction function and predict its result". Module 2 capstone:
"write `elapsed(now, then)` and pass its tests across the wrap". Module 3: "pack and unpack the trip computer's
warning word". Module 4: "a signed and an unsigned maximum". Module 5: "write loops that pass their tests".
Module 9 "Teaches": "`bl`, `ret`, the link register ... which registers carry arguments and results and which a
function must keep (the calling convention)".

Every capstone from Module 0 to 5 is a function with arguments and a result, so the learner must already know
that arguments arrive in `w0`, `w1`, ..., that the result leaves in `w0`, and that `ret` ends the function. The
listings show it on every line (`elapsed: sub w0, w0, w1 / ret`). Module 0 also uses `ret`, `mov`, `add` (and
names registers) before Module 1 and Module 2 "teach" them. The plan places the whole convention in Module 9.
Reasoning from the plan's own table; no compile needed.

Fix: say in Module 0's row that the minimal convention (argument and result registers, `ret`) arrives there, and
leave only what a function must preserve, and the stack, for Module 9.

---

## Medium

### 3. The notes are 32-bit ARM, which Decision 1 never says; "the place the notes send a reader" is not true today

Plan, "What the course is for": "Assembly Lab is the one that meets a real instruction set ... and is the place
the notes send a reader who gets stuck on a listing." Decision 1 table: "an 8-bit teaching machine | nothing:
the notes' fiction, with ARM's names".

Evidence (notes HTML): the notes' assembly is 32-bit ARM with upper-case mnemonics (`BEQ`, `BVS`, `BCS`, `CMP`,
`LDRB`, `LDRSB`); `bytes-to-registers.html`: "on ARM every register is 32 bits wide"; `c-meets-the-wheel.html`
points to "an ARM GCC at -O1"; no page mentions A64, AArch64, ARM64 or Armv8. No page links to Assembly Lab (grep
for "assembly lab" in all nine pages and the contents finds nothing). So recommending A64 makes the course
disagree with the notes on a sentence the notes state outright ("every register is 32 bits wide"), and a reader
sent from `b.cond` pages meets `b.ge`, `w`/`x`, and `csel`. The plan weighs A32 against A64 on simulation
cleanliness but omits that A32 is the machine the author's own notes already use.

Fix: add the notes' choice to Decision 1 as a cost of A64 (and as a reason for A32 or for the notes' pages to gain a
bridge), and change the present-tense "sends" to what is planned.

### 4. "`w0` is the low half of `x0`" omits the rule that makes the thesis true: a write to `w0` clears the top half

Plan, Decision 1 table: "31 of 64 bits; each also read as 32 bits (`w0` is the low half of `x0`)"; Decision 1:
"drawing a 64-bit register as two halves"; Module 1: "`w` and `x`".

Evidence: under QEMU 8.2.2 user mode, `mov x7, -1` then `mov w7, 5` leaves `X07=0000000000000005`; `mov x13, 0x12340000`
then `mov w13, 257` leaves `X13=0000000000000101`. GCC relies on it: `unsigned long widen(unsigned a, unsigned b)
{ return a + b; }` compiles to `add w0, w0, w1; ret` (no `uxtw`). A figure that draws "two halves" and lets a
`w` write leave the top half alone would be wrong. This is QEMU's behaviour and GCC's reliance on it; the Arm
manual statement (DDI 0487, "Register ... W register writes") is unverified here.

Fix: Module 1 (not Module 6) must carry the zero-on-write rule, and the register figure must show it.

### 5. The `int8_t` row is wrong for A64, the machine the plan recommends

Plan, Decision 1 table: "`int8_t` arithmetic in real code runs at 32 bits and is then narrowed (`sxtb`), so the
8-bit machine's V flag is not what a real program sees".

Evidence (listings, reproduced): A64 `inc8: sxtb w0, w0 / add w0, w0, 1 / ret` (the narrowing comes **before**
the add, on the argument, and nothing narrows the result); A32 `add r0, r0, #1 / sxtb r0, r0` (narrowed
after). Compiled: `int8_t add8s(int8_t a, int8_t b)` gives `add w0, w1, w0, sxtb`; `uint8_t add8u` gives `and w1, w1,
255 / add w0, w1, w0, uxtb`; a caller of `void take(int8_t)` passes `x` with no extension (`bl take`), so on A64 the
callee extends its arguments and leaves the result's top bits unspecified (the AAPCS64 text, which `docs/sources.md`
says is reachable, would state this; not read). No flags are set at all in `inc8`. The conclusion (an 8-bit
machine disagrees with a compiler) stands; the stated mechanism is A32's, not A64's.

Fix: say what each listing shows, and note that on A64 the extension is of the operands.

### 6. Instructions the plan's own listings need are taught by no module

Teaches columns omit: `sxtb`/`uxtb`/`sxth`/`uxth` and the extended-register operand (`w1, sxtw`, `w0, uxtb`),
`ubfx`/`bfi`, `movk`, `msub`, and the zero register `wzr`/`xzr` and `sp`.

Evidence (compiled, ARM64 GCC 16.1.0 `-O1`):
- `uint8_t add8u(uint8_t,uint8_t)`: `and w1, w1, 255; add w0, w1, w0, uxtb`. Module 1's own C column is "`int`, `unsigned`, `uint8_t` declarations".
- `(x >> 3) & 7`: `ubfx x0, x0, 3, 3` (Module 3's "fields and masks" and "pack and unpack the warning word").
- `return 0x12345;`: `mov w0, 9029; movk w0, 0x1, lsl 16` (Module 1 "which constants fit"; Module 8's `div10` also uses `movk`).
- `a % b`: `sdiv w2, w0, w1; msub w0, w2, w1, w0` (Module 8 "the remainder computed from it"; `msub` is not listed, `madd` is).
- `a[i]` with `int i`: `ldr w0, [x0, w1, sxtw 2]` (Module 7 "an index scaled by the element's size"); `strb wzr, [x2], 1` (`wzr`).
- the plan's own Decision 1 text cites `sxtw` as part of Module 6, but Module 6's "Teaches" lists loads, not `sxtw`.

This also leaves the thesis ("A type is a choice of instruction: which load, which compare, which branch, which
multiply, which shift") without the instruction by which a narrow type is held in a wide register, which is where
`int8_t` and `uint8_t` show in arithmetic.

Fix: give each of these a module (extension and `movk` with Module 1 or 3, `ubfx` Module 3, `msub` Module 8, `wzr`/`sp` where first used).

### 7. Module 6 carries too much, and the 32-to-64 jump lands inside it

Plan, Module 6 "Teaches": memory as bytes, little-endian, nine load/store forms, "zero and sign extension;
addresses are 64 bits (`x` registers)"; Decision 1: "The 64-bit `x` registers arrive with addresses in Module 6";
"the estimate is two lessons a module".

A learner meets in one module: the memory model, byte order, nine mnemonics, two extension rules, 64-bit registers
as a second width, and `sxtw`. Meanwhile GCC at `-O1` puts `x` registers into listings the plan places in Modules
1 to 5 ("Modules 1 to 5 draw 32 bits"): `(x >> 3) & 7` compiles to `ubfx x0, x0, 3, 3` for a 32-bit `unsigned`,
and `ret` uses `x30`. Module 1 already teaches `x`. The x-register idea is thus needed before Module 6 (Module 1
for the name, Module 3 for GCC's listing) and again in Module 6 with memory.

Fix: either move 64-bit arithmetic and `sxtw`/`uxtw` into a short step before Module 6, or split Module 6 (memory and bytes; widths and extension), and say which Module 1-5 listings may show `x`.

### 8. "What the course assumes" does not match what Module 1 and Modules 6 to 7 then need

Plan: "The reader can read simple C (variables, `if`, loops, functions, arrays) and convert between binary and
decimal. It does not assume two's complement, any assembly, or any electronics: Module 1 derives the signed reading
from the machine".

- Hex is not assumed, yet Module 1 reads a pattern "in hex", every register figure needs it, and the notes assume "binary and hex".
- Pointers are not assumed, yet Module 6's C column is "a pointer's size", Module 7 is `*p++` and `p + 1`.
- Fixed-width types (`int8_t`, `uint8_t`) are not assumed, yet are Module 1's column.
So Module 1 must also teach hex, two's complement, the register, `mov` with the immediate-encoding rule, `w`/`x` and
the zero-on-write rule (finding 4), and fixed-width types. It is the heaviest module and is estimated at two lessons.

Fix: add hex (and fixed-width types) to the assumptions or to Module 1's row, say who teaches C pointers, and look at Module 1's load.

### 9. Decision 1 weighs three candidates; its first reason is unverified and x86-64 and RISC-V get no hearing

Plan: "Three candidates" (A64, A32, an 8-bit machine); "It is what the reader's own phone, laptop or cloud server
most likely runs, so a program from the course can run natively".

x86-64 appears only as a possible later chapter ("A second optional chapter, on x86-64, is possible later"), and
RISC-V not at all, while the notes say "where x86 differs it says so". "Most likely runs" is a market claim for
laptops and cloud servers; I believe, but cannot verify here, that x86-64 still dominates both. It needs a source
(a market-share report) or removal. "Can run natively" is also loose: macOS on Apple silicon uses a different
assembler syntax and, per Apple's published arm64 ABI notes (unread), a different argument-extension rule from
AAPCS64, so GNU-as programs that the QEMU test accepts would not assemble there unchanged.

Fix: say why x86-64 and RISC-V are not candidates, and restate or source the first reason.

### 10. "It overlaps with neither earlier course's situation" is false for the first quantity

Plan, Decision 3: "an outside temperature, a signed byte from a sensor (Modules 1, 6)"; "It overlaps with neither
earlier course's situation."

Evidence: digital-design's module 5 brief (`docs/notes/module-5-state-machines/briefs/00-module.md`) sets "a shop
with a freezer room. A sensor in the freezer room sends its reading, a 16-bit word ... `FF48` (-184, -18.4
degrees)". The same quantity: a signed temperature from a sensor. The trip computer as a whole does differ.

Fix: replace the temperature or drop the sentence; and keep it in the originality note.

### 11. Decision 4 hides its cost: an optional chapter on A32 needs a second model

Plan, Decision 4: "the course's programs are compiled for A32 and the learner sees conditional execution, the missing
divide and the different immediates". "The model" describes only "An assembler for the course's subset of A64" and a
simulator; the plan's own rule is "Everything a figure shows comes from running the course's model".

Showing A32 running (conditional execution, `movw`, `__aeabi_idiv`) needs an A32 assembler, simulator (the shifter
carry rules the plan cites as a reason to avoid A32) and a second differential test (`qemu-arm`,
`gcc-arm-linux-gnueabihf`). Without them the chapter is recorded listings only, which the plan does not say. Decision 1
states A64's costs; Decision 4 states none.

Fix: state which of the two Chapter A is, and its cost, before the author takes the decision.

### 12. "It shows the response's attribution line" is true of the plain-text response only

Plan, "A real compiler, optionally (tier 3)": "it shows the response's attribution line".

Evidence (compiled, ARM64 GCC 16.1.0): a request with `Accept: text/plain` returns `# Compilation provided by
Compiler Explorer at https://godbolt.org/` as its first line. The same request with `Accept: application/json` returns
the keys `inputFilename, code, okToCache, timedOut, stdout, stderr, truncated, execTime, ..., asm, optOutput,
labelDefinitions, ...`; the first `asm` lines (comment filter off) are the compiler's own comments (`// GNU C23 (GCC)
version 16.1.0 ...`); the string "Compiler Explorer" occurs nowhere in the JSON. A panel that parses JSON has no
line to show. CORS is open (`access-control-allow-origin: *`, GET with an `Origin` header).

Fix: say which `Accept` the panel sends, or that the page writes the attribution itself.

### 13. Modules 0, 10 and 11 show GCC output, which the model cannot produce

Plan, Module 0 "C beside it": "a whole function, and the listing GCC made for it"; Module 10: "the same C beside
GCC's listing"; Module 11: "the check the optimiser deletes", "`-fwrapv`, `-fsanitize=undefined`, `ckd_add`".
"The model" says: "Everything a figure shows comes from running the course's model" and the course compiler is "a fixed pattern".

The course's compiler does not optimise, so the deleted check (`check: mov w0, 1; ret`, reproduced) cannot come from
the model; it must be a recorded listing (the plan's own rule makes listings recorded and versioned). The panel is
optional, so these lessons depend on stored listings. The plan never says so, nor that a recorded listing is not "run
by the model". (`ckd_add` itself compiles: `adds w0, w0, w1; str w0, [x2]; cset w0, vs` with `-std=c23`, GCC 16.1.)

Fix: state in "The model" that recorded GCC listings are shown, and that the model assembles and runs them.

---

## Low

### 14. `b.cond` and `b.ge` are not "the syntax GCC prints"

Plan, "The model": "An assembler ... in the syntax GCC prints"; Decision 1 and Module 4 write `b.ge`, `b.cond`. GCC 16.1
prints `ble .L21` and `bne .L20` (and no `#`, `sxtw 2`, `lsl 16`). GNU as 2.42 accepts both `bne` and `b.ne` (assembled
without error). A learner will see `b.le` in the lessons and `ble` in every GCC listing.

Fix: say which spelling the course teaches and that the assembler accepts the other.

### 15. The named Ubuntu packages give the toolchain and the emulator, not the readout

Plan: "Ubuntu's `qemu-user` and `gcc-aarch64-linux-gnu` packages provide both." Checked: `gcc-aarch64-linux-gnu`
depends (via `gcc-13-aarch64-linux-gnu`) on `binutils-aarch64-linux-gnu`, which holds `as` and `ld`; `qemu-user` holds
`qemu-aarch64` (QEMU 8.2.2 on Ubuntu 24.04). Registers and NZCV can be read with `-singlestep -d cpu` (one dump per
instruction; `PSTATE=60000000 -ZC-` seen). Memory needs a GDB stub (`-g`) and `gdb-multiarch`, a third package, or the program
writing its memory out.

Fix: name the means of reading registers and memory.

### 16. `mov r0, #257` does not fail on Armv7-A under GNU as

Plan: "`movw r0, #257`: plain `mov` cannot hold 257". True of the encoding: `arm-linux-gnueabihf-as -march=armv5te`
rejects it ("invalid constant (101) after fixup"). But with `-march=armv7-a` GNU as silently assembles
`mov r0, #257` as `movw r0, #257` (e3000101). A Chapter A figure promising "the errors a real assembler gives" would not find one.

### 17. "microcontrollers run its Thumb form"

Plan, Decision 1 table, A32 cell. Cortex-M parts run Thumb-2 of the M profile, which is a different profile from Armv7-A
(Arm's profile documents would say; unverified). Wording only.

### 18. "tier 2" and "tier 3" name something else in digital-design

Plan, "The model": "A small C compiler (tier 2)", "A real compiler, optionally (tier 3)" with no tier 1 defined.
digital-design's plan uses "tiers" for graded projects: "guided ..., semi-guided ... and engineering".

### 19. The plan describes the originality process incompletely

Plan, "How each module is built": "an originality note naming the textbook example to avoid" (per module). The
platform contract requires "an `originalityNote` on every lesson" (`contract/README.md`), and digital-design's
CLAUDE.md that "a test fails a lesson without one". Not misdescribed, but the plan is also silent on how the family's
ban on "a named commercial ISA's mnemonics" applies to a course whose subject is one (`CLAUDE.md` in the repo answers it; the plan does not),
and its module order (state, arithmetic, logic and shifts, branches, loops, memory, arrays, multiply, calls) is the
usual textbook order, which digital-design's rule names as "the signal". I have not compared it with Harris and Harris
or Patterson and Hennessy, so this is a prompt to check, not a finding of copying.

### 20. The reading step omits the dark theme and the tablet width

Plan, "How each module is built", step 3: "at phone and desktop widths". digital-design's CLAUDE.md requires "phone,
tablet and desktop widths and in the dark theme"; metadata-systems' "phone and desktop widths and in the dark theme".

### 21. Module table slips

Module 3 teaches `tst` and Module 4 teaches `tst` again. Module 8, "Multiply and divide", sits under "Part 3: Memory"
and needs nothing from memory.

### 22. "division by zero is defined (the result is 0)" is stated without its source

Plan, Decision 1. Under QEMU 8.2.2 user mode: with `x2 = x3 = 99`, `x11 = -1`, `sdiv w2, w0, w1`, `udiv w3, w0, w1` and
`sdiv x11, x0, x1` with `w1 = 0` all leave 0; `sdiv w6, 0x80000000, -1` leaves `0x80000000` (no trap). That is QEMU, not the
Arm manual (unreachable). The plan's own rule is "never from memory" and `docs/sources.md` says the manual cannot be reached.

---

## Claims verified, and how

Compiled (Compiler Explorer, `carm64g1610` ARM64 GCC 16.1.0 `-O1`; `carmg1520` ARM GCC 15.2.0 `-O1 -marm -march=armv7-a`),
with both sources in one file; the output matches `listings.md` instruction for instruction:
- `sdiv w0, w0, w1`; `bl __aeabi_idiv` (with `-march=armv7-a`); `cmp w1, w0` then `csel w0, w1, w0, ge`; `cmp r1, r0` then `movge r0, r1`;
  `mov w0, 257` and `movw r0, #257`; `add x0, x0, w1, sxtw` and A32's `add r0, r0, r1` for `long + int`; `ldrsb w0` / `ldrb w0`;
  `cset w0, cc`; `check` compiled to `mov w0, 1`; `elapsed` is one `sub`.
- `ldrsw x0, [x0]` and `ldrsb x0, [x0]` for `long` results; `umull x0, w1, w0`; `adds`/`cset w0, vs` for `ckd_add` (`-std=c23`).
- ARM GCC 16.1.0 (`carmg1610`) gives byte-identical A32 output to 15.2.0 for the whole test file, so the version mismatch changes nothing.
- Compiler ids and versions from the compiler list: `carm64g1610` "ARM64 GCC 16.1.0", `carmg1520` "ARM GCC 15.2.0".
- `access-control-allow-origin: *` on the API.

Run or assembled (QEMU 8.2.2 user mode and GNU binutils 2.42 from Ubuntu 24.04 packages; behaviour of those tools, not an Arm statement):
- division by zero gives 0 (signed and unsigned, 32 and 64 bit); `INT_MIN / -1` gives `INT_MIN`; a write to `w7` clears the top half of `x7`;
  `subs w, w, w` of equal values sets Z and C (so C means "no borrow" on subtraction); the assembler rejects `mov w0, 0x12345`
  ("immediate cannot be moved by a single instruction"), `and w0, w0, #0x101` ("immediate out of range"), and `mov x0, w1` and `add w0, x1, x2`
  ("operand mismatch"), which backs the plan's "errors a real assembler gives" for constants and register widths.
- `sdiv` is rejected for `-march=armv7-a` and accepted for `armv7ve` (finding 1).
- Ubuntu 24.04 has `qemu-user`, `gcc-aarch64-linux-gnu` and `binutils-aarch64-linux-gnu` (finding 15).

Read in the repositories: the titles of both earlier courses; digital-design's Modules 10 (ISA) and 11 (Assembly); the ten sections
and the `originalityNote` rule; the notes' "ten small C programs"; the notes' Bit Lab; the four decisions and six checkpoints
as numbered; twelve modules in four parts plus one optional chapter.

## Not verified, and what would verify it

- Every statement about what the A64 and A32 architectures define (31 general registers, 16 A32 registers with `sp`, `lr`, `pc`;
  C meaning "no borrow" as an architectural rule; V as "carry into the top bit differs from the carry out"; no shifter carry for
  A64 logical instructions; division by zero defined as 0; `ldrsw`, `sxtw` semantics; bitmask-immediate rule): Arm Architecture
  Reference Manual DDI 0487 (A64) and DDI 0406 (Armv7-A), via developer.arm.com, not reachable here.
- "Raspberry Pi 4 and 5 on a 64-bit OS", "AWS Graviton", "Apple silicon Macs", "Raspberry Pi on a 32-bit OS": Raspberry Pi and vendor documentation.
- "most likely runs" (finding 9): a market-share source.
- AAPCS64's callee-extends rule and `long` being 32 bits in A32 (`ILP32`) beyond the one listing: AAPCS64/AAPCS32 in `ARM-software/abi-aa` (the plan's `docs/sources.md` says reachable; not read).
- Compiler Explorer's policy points (storage of submitted source, rate limits): its `docs/API.md` and `docs/Privacy.md`; not read.
