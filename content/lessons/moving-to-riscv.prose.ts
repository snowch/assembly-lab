// Copyright © 2026 Christopher Snow

// Separate copy draft. Sources, scope and canonical wording:
// docs/notes/subtraction-transfer/guide-copy.md.
export const TRANSFER_PROSE = {
  title: "Moving from Arm to RISC-V",
  line: "Translate a small function and run it in RISC-V Assembly Lab.",
  objectives: [
    "translate a function while keeping its operand roles and width.",
    "distinguish the calling convention from the setup each lab supplies.",
  ],
  intro:
    "You can reuse your knowledge of bits, memory, control flow and functions. Check the target’s register roles, result width and execution environment when you translate the instructions. This appendix compares Arm A64 with the RV64 target in RISC-V Assembly Lab.",
  registers: {
    title: "Register roles and widths",
    prose:
      "A calling convention is the agreement between a function and its caller. These are the ordinary integer-register roles used by the examples:\n\n" +
      "| Role | Arm A64 | RISC-V RV64 |\n| --- | --- | --- |\n" +
      "| First arguments | `x0`–`x7` | `a0`–`a7` |\n" +
      "| First result | `x0` | `a0` |\n" +
      "| Return address | `x30` | `ra` |\n" +
      "| Always-zero operand | `xzr` | `zero`, also named `x0` |\n\n" +
      "RISC-V `x0` always reads zero. It cannot hold the argument or result that Arm calls `x0`.\n\n" +
      "An Arm write through a `w` name clears the upper half of its `x` register. RV64 W arithmetic instead copies result bit 31 into the upper half. The worked function below uses 64-bit operations in both versions.\n\n" +
      "The preserved general-purpose integer registers differ: Arm uses `x19`–`x29`; RISC-V uses `s0`–`s11`. Restore `sp` to its incoming value before returning, and keep it 16-byte aligned. A function that makes a nested call must protect its own return address and any values needed afterwards.",
  },
  worked: {
    title: "Translate a difference function",
    before:
      "Both functions return the low 64 bits of `now - then`. Their caller supplies `now` first and `then` second. The destination is also the first input, so subtraction replaces `now` with the difference. These functions make no further calls.",
    armLabel: "Arm A64 function",
    armSource: "difference:\n  sub x0, x0, x1\n  ret",
    riscvLabel: "RISC-V RV64 function, read-only here",
    riscvSource: "difference:\n  sub a0, a0, a1\n  ret",
    after:
      "`ret` returns control to the caller. The subtraction has already placed the result in the agreed register. The RISC-V function is a translation to run in the other lab; this page’s Arm editor accepts Arm instructions.",
    observed: (now: number, then: number, result: bigint) =>
      `With \`now = ${now}\` and \`then = ${then}\`, both functions return \`${result}\`. Check the result register after the function returns.`,
  },
  conditions: {
    title: "Comparisons and condition flags",
    prose:
      "Arm `adds`, `subs` and `cmp` write NZCV. Ordinary `add` and `sub` preserve those flags. RISC-V integer arithmetic has no NZCV flags. Its conditional branches compare registers directly, and instructions such as `sltu` place a comparison result in a register.\n\n" +
      "Choose the relationship you need before translating a branch. An unsigned comparison still needs unsigned ordering in the other instruction set. The RISC-V appendix below provides a runnable carry check and an unsigned-branch exercise.",
  },
  environment: {
    title: "What each lab supplies",
    prose:
      "The core Arm activities run supported functions in the browser simulator. The lesson supplies incoming arguments and recognises the function’s return. The course’s GNU/QEMU and physical-board activities have their own startup and debugging instructions.\n\n" +
      "RISC-V Assembly Lab uses GNU tools to assemble and link code. A CPU emulator runs the executable as a user process in the xv6 operating system. For an assembly fragment, the lab supplies entry, stack setup, register capture, reporting and exit. Open **Tools → Program** there to inspect that complete program.\n\n" +
      "A function body needs a caller. A top-level fragment reaches the lab’s capture code by continuing past its last instruction. Use `ret` inside a called function. When you write a complete program, you supply its entry and exit.\n\n" +
      "System calls, valid addresses and device access belong to the environment. xv6’s system calls differ from Linux’s. Keep those choices separate from translating the calculation.",
  },
  run: {
    title: "Run the RISC-V version",
    before:
      "Copy the caller and function below. Then open the [RISC-V playground](https://snowch.github.io/riscv-assembly-lab/playground/). Choose **Tools → Projects → New project**. Select **Assembly fragment**, give it a name and choose **Create project**. Paste the copied code into the editor:",
    source:
      "li a0, 53\nli a1, 40\ncall difference\nmv t2, a0\nj done\ndifference:\n  sub a0, a0, a1\n  ret\ndone:",
    after:
      "Choose **Build & Run**, then find `t2` in **Registers**. The caller loads both arguments and calls `difference`. After the function returns, `mv t2, a0` copies its result into the default result display. `j done` skips the function body before the lab captures registers.\n\n" +
      "For instruction-by-instruction inspection, choose **Start stepping**. The lab runs the supplied entry and setup, then pauses before the first machine instruction in your fragment. Choose **Step instruction** to advance. A source line may expand into several machine instructions. In **Tools → Program**, compare your fragment with the supplied program around it.",
    fresh:
      "Extend the RISC-V function to return the low 64 bits of `now - then + adjustment`. Add `li a2, 3` before `call difference`. In `difference`, add `a2` to the subtraction result before `ret`. Keep `a1` and `a2` unchanged. Predict the result, choose **Build & Run**, then inspect `t2`. Choose **Inspect registers**, then **All** under **Show registers**, to compare `a0`, `a1` and `a2`. Try a different adjustment and explain which instruction consumes it.",
  },
  practice: {
    sectionTitle: "Run the Arm version",
    caption: "A 64-bit function with three supplied arguments.",
    title: "Translate an adjusted difference",
    before:
      "This Arm exercise gives you a fresh function to translate. It also provides a place to run an Arm version when you arrive from the RISC-V course.",
    task:
      "Write `adjusted_difference(now, then, adjustment)`. Return the low 64 bits of `now - then + adjustment`.\n\n" +
      "At function entry:\n\n- `x0` holds `now`.\n- `x1` holds `then`.\n- `x2` holds `adjustment`.\n\n" +
      "All three inputs are 64-bit patterns. Return the result in `x0`, keeping `x1` and `x2` unchanged. Use `sub`, `add` and `ret`. Choose **Run tests** to check your function on fresh calls.",
    hints: [
      "Subtract `then` from `now` first. Add `adjustment` to that difference before returning.",
      "Keep the calculation 64 bits wide. A `w` destination would discard the upper half of an input or intermediate result.",
      "Read `x1` and `x2` as inputs. You can replace `x0` with the difference, then with the adjusted difference.",
      "The second arithmetic instruction reads the difference now held in `x0`. `ret` returns control after the result is ready.",
      "Use `sub x0, x0, x1`, then `add x0, x0, x2`, then `ret`.",
    ],
    caseLabels: {
      ordinary: "Ordinary difference and adjustment",
      wide: "Values beyond 32 bits",
      subtractionWrap: "Subtraction wraps at 64 bits",
      additionWrap: "Adjustment wraps at 64 bits",
      equal: "Equal readings with an adjustment",
    },
  },
  next: {
    title: "Continue in RISC-V Assembly Lab",
    prose:
      "[The RISC-V transfer appendix](https://snowch.github.io/riscv-assembly-lab/lessons/riscv-and-arm/) compares both directions and keeps the carry and branch experiments together. [Using the workbench](https://snowch.github.io/riscv-assembly-lab/using-the-workbench/) explains projects, setup and debugging controls.",
  },
  references:
    "- [RV64 integer instructions](https://docs.riscv.org/reference/isa/unpriv/rv64.html)\n" +
    "- [RISC-V procedure calling convention](https://riscv-non-isa.github.io/riscv-elf-psabi-doc/)\n" +
    "- [Arm AAPCS64](https://github.com/ARM-software/abi-aa/blob/2025Q4/aapcs64/aapcs64.rst)\n" +
    "- [The xv6 source used by RISC-V Assembly Lab](https://github.com/mit-pdos/xv6-riscv/tree/d7c0a1b7a703f7366942092f9cf421b6cd111a36)",
  originality: {
    textbookExample: "A list of instruction-name substitutions without a runnable transfer task.",
    howThisDiffers:
      "Uses the same fixed-width difference function to separate register roles, instruction effects and supplied runtime setup. A fresh three-argument function and a runnable caller connect the two course environments.",
  },
} as const;
