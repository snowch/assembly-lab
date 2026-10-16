# Sceptic's verdicts on the review of `docs/plan.md` (checkpoint 1)

Counts: **5 upheld, 11 upheld in part, 2 already answered, 4 rejected** (22 findings).

## What I checked, and how

- Compiler Explorer: **1 compile request** of 12 (ARM64 GCC 16.1.0, `carm64g1610`, `-O1`, one file of seven
  functions, JSON `Accept`). It reproduced `ubfx x0, x0, 3, 3` for `(x >> 3) & 7` on `unsigned`;
  `sdiv`/`msub` for `%`; `ldr w0, [x0, w1, sxtw 2]` for `a[i]`; `mov w0, 9029` then `movk w0, 0x1, lsl 16` for
  `0x12345`; `add w0, w1, w0, sxtb` for `int8_t` addition; `add w0, w0, w1` for `unsigned long widen(unsigned, unsigned)`.
  The same JSON response has no string "Compiler Explorer" or "godbolt" anywhere (searched with Python).
- Binutils 2.42 and QEMU 8.2.2 from the reviewer's unpacked Ubuntu packages (run with `LD_LIBRARY_PATH` pointing
  into the scratchpad; nothing installed). `arm-linux-gnueabihf-as`: `sdiv r0, r0, r1` is rejected with
  `-march=armv7-a` ("selected processor does not support `sdiv' in ARM mode") and accepted with `armv7ve` and
  `armv7-a+idiv`; `mov r0, #257` is rejected with `-march=armv5te` ("invalid constant (101) after fixup") and
  assembles as `movw r0, #257` (`e3000101`) with `-march=armv7-a`. `aarch64-linux-gnu-as` accepts `ble`, `bne` and `b.le`.
  `qemu-aarch64 -singlestep -d cpu` on a small program: `mov x7, -1; mov w7, 5` leaves `X07=0000000000000005`;
  `sdiv w2` and `udiv w3` by zero leave `X02=X03=0`; `sdiv w, 0x80000000, -1` leaves `0x80000000`, no trap.
  These are statements about GNU as and QEMU, not about the architecture.
- Arm documents reached through `raw.githubusercontent.com` (`ARM-software/abi-aa`):
  - `aapcs64/aapcs64.rst`, "Parameter passing", Stage C: "When an argument is assigned to a register any unused
    bits in the register have unspecified value." "Result return": "the result is returned in the same registers as
    would be used for such an argument". So the callee extends arguments and the caller extends results it needs.
  - `addenda32/addenda32.rst`, build attributes, `Tag_DIV_use` value 2: "This code was permitted to use SDIV and UDIV in
    the Arm and Thumb ISAs; the instructions are present as an optional architectural extension above the base
    architecture implied by Tag_CPU_arch and Tag_CPU_arch_profile." The revision table also says "added Tag_DIV_use to
    describe use of UDIV/SDIV in code for v7A". That is Arm's own statement that on v7-A the divide is optional.
- Compiler Explorer's `docs/API.md` (raw, `compiler-explorer/compiler-explorer`): the `curl` example shows
  "# Compilation provided by Compiler Explorer at godbolt.org" as the first line of the text response only.
- Not checked and not claimed: DDI 0487 and DDI 0406 (unreachable), market share, Apple's arm64 ABI, Raspberry Pi
  and vendor documentation, Cortex-M versus Armv7-A wording.
- Plan quotes: every quote in findings 1 to 22 that I used is exact. Exceptions noted below.

## The 22

| # | Finding | Reviewer's severity | Verdict | One-line reason |
| --- | --- | --- | --- | --- |
| 1 | "Armv7-A has no divide instruction" is false | high | **upheld** | Arm's `Tag_DIV_use` calls divide "an optional architectural extension" on v7-A; two details over-reach (see below) |
| 2 | Calling convention needed from Module 0, taught in Module 9 | high | **upheld in part** | Real gap for argument and result registers; the "`ret`, `mov`, `add` before they are taught" half is answered by the term rule; severity medium, not high |
| 3 | Notes are 32-bit ARM; "the place the notes send a reader" is untrue today | medium | **upheld in part** | Notes say "on ARM every register is 32 bits wide" and send readers to an "ARM GCC"; no link to Assembly Lab. But "A32 is the machine the notes use" overstates: the traces run on an 8-bit fiction, which the plan's own table says |
| 4 | `w0` low half of `x0` omits that a `w` write clears the top half | medium | **upheld in part** | True and verified; but the plan's sentence is not false and this is a lesson-level rule; belongs in A64's stated cost and Module 1's row |
| 5 | The `int8_t` row is wrong for A64 | medium | **upheld** | Listing: A64 narrows the operand before the add and never the result; the plan's "then narrowed (`sxtb`)" is A32's order. Conclusion stands |
| 6 | Instructions the plan's own listings need are taught by no module | medium | **upheld in part** | `sxtb`/`uxtb`/extended-register operand, `sxtw`, `movk`, `msub` are real omissions; `wzr`/`xzr`/`sp` are register names, and `ubfx`/`bfi` are not needed by hand-written code |
| 7 | Module 6 carries too much; the 32-to-64 jump lands inside it | medium | **upheld in part** | Only the x-register timing point survives (GCC prints `ubfx x0` for a 32-bit `unsigned`); "too much in Module 6" is an estimate the module note fixes |
| 8 | Assumptions do not match Modules 1, 6, 7 | medium | **upheld in part** | Hex is missing from the assumptions; pointers are answered by Module 7's title; fixed-width types and "heaviest module" are taste |
| 9 | Three candidates; first reason unverified; x86-64 and RISC-V unheard | medium | **upheld in part** | "most likely runs ... so ... can run natively" is loose and I cannot source it either; "no hearing for x86-64/RISC-V" is thin (Arm is fixed by the repo's own `CLAUDE.md` and `sources.md`) |
| 10 | "Overlaps with neither earlier course's situation" is false for the first quantity | medium | **upheld in part** | Digital-design's brief has a signed freezer-room temperature word (`FF48`, -18.4); the situation differs, one quantity coincides; "false" is too strong |
| 11 | Decision 4 hides a second model | medium | **upheld in part** | The plan never says whether the chapter is recorded listings or a second simulator; the cheap reading is available but unstated |
| 12 | "Attribution line" is true of the plain-text response only | medium | **upheld** | Verified: JSON response has no such string; the line is in the text response (`API.md`) |
| 13 | Modules 0, 10, 11 show GCC output the model cannot produce | medium | **already answered** | Plan: "Every claim about GCC's output is a compiled listing, with the compiler's version and flags recorded"; `CLAUDE.md`: "or a compiler listing that is recorded in the repository, and a test pins it" |
| 14 | `b.cond`/`b.ge` are not "the syntax GCC prints" | low | **upheld** | `docs/notes/checkpoint-1/listings.md` itself shows `ble .L8`, `bne .L10`; the assembler accepts both |
| 15 | The named packages give toolchain and emulator, not the readout | low | **rejected** | The plan does not say the packages provide the readout |
| 16 | `mov r0, #257` does not fail on Armv7-A under GNU as | low | **rejected** | Verified, but the plan only says the plain `mov` encoding cannot hold 257, which is true; the assembler-errors promise is about the A64 model |
| 17 | "microcontrollers run its Thumb form" | low | **rejected** | No evidence offered, reviewer calls it "wording only" and "unverified" |
| 18 | "tier 2" and "tier 3" name something else in digital-design | low | **upheld in part** | Tier 1 is never defined (grep: two occurrences in the repo); the cross-course collision is weak |
| 19 | The plan describes the originality process incompletely | low | **rejected** | Not misdescribed, answered by `CLAUDE.md`, and the module-order point is by the reviewer's own words "not a finding" |
| 20 | Reading step omits dark theme and tablet width | low | **upheld in part** | Dark theme: yes (both sibling courses require it). Tablet: no (only digital-design does; this repo's `CLAUDE.md` says phone and desktop) |
| 21 | Module table slips (`tst` twice; Module 8 under Memory) | low | **upheld** | Both are in the plan text exactly as quoted |
| 22 | "division by zero is defined (the result is 0)" has no source | low | **already answered** | `docs/sources.md` assigns "division by zero, shifts by the width" to DDI 0487 for lessons; the claim is true under QEMU (rerun); the plan is not a lesson |

## Ranked fix list (surviving findings, by how far each would mislead the author at checkpoint 1)

The four decisions are what the author takes, so findings that sit in Decisions 1 to 4 rank above module-table fixes.

1. **Finding 1 (Decision 1 table, Decision 4, Optional chapter A).** The A32 column states as architecture what is a
   baseline-target fact, and the author weighs A64 against A32 using that cell. Fix: say that the baseline `armv7-a`
   target has no divide and GCC calls `__aeabi_idiv`, while divide is an optional extension on v7-A (cite `Tag_DIV_use`
   in AAPCS32's addenda, `docs/sources.md` already lists AAPCS32's repository). Keep the chapter's "divide that is a
   library call" point, tied to `-march=armv7-a`, which is how `listings.md` recorded it.
   Details in the finding that are wrong: (a) "the 'Raspberry Pi on a 32-bit OS' cell inherits the error": that cell
   says nothing about divide; (b) "re-choose what Chapter A's divide point is": the listing is real for the recorded
   flags, so the point survives with its qualifier. The reviewer's `-mcpu=cortex-a7` and `armv7ve` GCC results I did not
   reproduce (I reproduced the assembler's gating instead and read Arm's attribute text).
2. **Finding 3 (Decision 1, "What the course is for").** The notes state "on ARM every register is 32 bits wide" and send
   readers to "an ARM GCC at -O1" (the 32-bit compiler on Compiler Explorer; `listings.md` uses `carmg1520` for it), and
   none of the nine pages links to Assembly Lab. Fix: change "is the place the notes send" to a plan in the future tense,
   add the notes' 32-bit wording to A64's stated costs (and name that the notes need a bridge sentence), without claiming
   A32 is "the machine the notes use": their traces are an 8-bit fiction with ARM names.
3. **Finding 11 (Decision 4).** The author cannot price the optional chapter. Fix: one sentence saying which of the two it
   is (recorded GCC listings of the course's programs, which `CLAUDE.md` already permits, or a second assembler and
   simulator with its own QEMU test) and the cost of the second.
4. **Finding 9 (Decision 1, first reason).** The argument for A64 rests on "most likely runs ... can run natively". Fix:
   restate it as what the table's own first row lists (phones, Apple silicon Macs, Pi 4/5, Graviton), drop "laptop or
   cloud server most likely" unless sourced, and add one sentence saying why x86-64 and RISC-V are not candidates (the
   repo is fixed on Arm's documents) or that the later x86-64 chapter is the answer.
5. **Finding 5 (Decision 1 table, last row).** Fix: say what each recorded listing shows: A64 extends the operand
   (`sxtb w0, w0` before the `add`), A32 narrows after it, and the conclusion (an 8-bit V flag is not what a program sees)
   stands. AAPCS64 Stage C is the source for why.
6. **Finding 4 (Decision 1 costs; Module 1 row).** Fix: put "a write to `w` clears the top half of `x`" in A64's stated
   cost and in Module 1's Teaches, and keep the register figure from drawing "two halves" without it. Verified under QEMU
   and in GCC's `widen`; the Arm manual statement is unchecked.
7. **Finding 10 (Decision 3).** Fix: drop "overlaps with neither" or narrow it to the situation as a whole and change the
   signed quantity (the freezer-room temperature is the same kind of value) or note the overlap in the originality note.
8. **Finding 7 (Decision 1, second reason; surviving part only).** Fix: one clause that GCC's listings put `x` names in
   Modules 1 to 5 (`ubfx x0, x0, 3, 3`), so "draw 32 bits" is about the figures, not the listings. Do not split Module 6.
9. **Finding 2 (Module 0 or 2 row).** Fix: say where "arguments in `w0`, `w1`, result in `w0`, `ret` ends the function"
   arrives (Module 0), and leave "what a function must keep" and the stack for Module 9. Severity medium.
10. **Finding 6 (Teaches columns).** Fix: add the extension instructions and extended-register operand (Module 1 or 6),
    `sxtw` (Module 6, where Decision 1 already puts it), `movk` (Module 1) and `msub` (Module 8) to the Teaches cells, or
    say the cells list headline instructions and module notes complete them. Leave `ubfx`, `wzr`, `sp` to module notes.
11. **Finding 8 (assumptions).** Fix: add hex to the assumptions or to Module 1's row.
12. **Finding 12 ("A real compiler" bullet).** Fix: say the panel asks for the text response and shows its first line, or
    that the page writes the attribution itself (`CLAUDE.md` already says "Compiler Explorer's attribution" neutrally).
13. **Finding 14 ("The model" bullet).** Fix: say which branch spelling the course teaches (`b.cond`) and that the
    assembler also accepts GCC's `ble`/`bne` spelling (verified), or drop "in the syntax GCC prints".
14. **Finding 20 (step 3 of "How each module is built").** Fix: add "and in the dark theme" (and the same in `CLAUDE.md`'s
    Readers bullet). Do not add tablet.
15. **Finding 18 ("The model").** Fix: drop the "(tier 2)" and "(tier 3)" labels or define tier 1.
16. **Finding 21 (module tables).** Fix: decide where `tst` is taught (Module 3 as a logical test, Module 4 as a compare)
    or list it once; rename or move Part 3's heading so Module 8 fits (the checkpoint list already groups "Control and
    memory: Modules 4 to 8").

## Rejected or answered, so they do not come back

- **13** Already answered: the plan's "Every claim about GCC's output is a compiled listing" and `CLAUDE.md`'s "or a compiler
  listing that is recorded in the repository, and a test pins it"; recorded listings are the stated design, and the CI
  job assembles every program shown.
- **22** Already answered: `docs/sources.md` sends "division by zero, shifts by the width" to DDI 0487 or QEMU at lesson time;
  the claim is true under QEMU (rerun: 0 for `sdiv`/`udiv`, `INT_MIN / -1` gives `INT_MIN`, no trap); the plan is not a lesson.
- **15** Rejected: "provide both" means the assembler/linker and the emulator; the plan does not say the packages supply the
  register and memory readout, which is checkpoint 2 work (`docs/machine.md`). My QEMU run did print registers and PSTATE with
  `-singlestep -d cpu`; memory readout I did not test.
- **16** Rejected: the plan says only that plain `mov` cannot hold 257, true of the encoding (GNU as rejects it for `armv5te`);
  no sentence promises an A32 assembler error, and "errors a real assembler gives" is the A64 model's promise.
- **17** Rejected: the finding supplies no evidence and calls itself "wording only"; I did not check it either.
- **19** Rejected: the per-module originality note and the per-lesson `originalityNote` are different things, not a
  misdescription; `CLAUDE.md`'s Originality section answers the ISA-mnemonics point; the module-order point is, in the
  reviewer's words, "a prompt to check, not a finding", with no comparison made.
- **Parts of upheld-in-part findings that are rejected:** 2 (the `ret`/`mov`/`add` before-taught half: `CLAUDE.md`'s term rule
  introduces a term when the program raises it); 7 ("Module 6 carries too much", the split: an estimate the module note
  fixes); 8 (pointers: Module 7's title and figure teach them; fixed-width types: shown beside the C, not assumed;
  "Module 1 is the heaviest": estimate); 20 (tablet width); 6 (`wzr`, `sp`, `ubfx`, `bfi`).
