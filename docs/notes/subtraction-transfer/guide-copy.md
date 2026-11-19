# Directional transfer guide copy

Copyright © 2026 Christopher Snow

## Separate drafting pass

Drafted from `brief.md` in a separate agent session using the inherited Codex model and effort. Read the Arm authoring/style rules, the RISC-V authoring brief and actual program wrapper/control copy. These are copy drafts for parent integration and independent review; the writer has not run a browser study or native checks.

The intended reader has completed the core integer, width, comparison and function lessons in one course. A programmer arriving with only C is directed to the other course's opening lessons, not assumed ready for this appendix. The guides define the calling convention locally and keep the current lab's execution boundary explicit.

## Checked facts and sources

- Arm argument, return-address, preservation and stack roles: AAPCS64 release 2025Q4, retrieved directly from `https://raw.githubusercontent.com/ARM-software/abi-aa/2025Q4/aapcs64/aapcs64.rst`. Inspected general-purpose register table/paragraphs and stack constraints: r0–r7, r19–r29 and SP, LR/r30, SP mod 16. Local retrieved source: `/tmp/subtraction-transfer-aapcs64.rst`.
- Arm W-write behaviour and flag-setting versus flag-preserving arithmetic: existing width, flag and calling-convention lessons and their executed machine/native checks; the parent owns native verification of the new displayed leaf function. The prose gives a 64-bit example and does not generalise narrow argument/result rules.
- RISC-V integer register names/roles, argument/results, preservation and stack: official psABI extract `/tmp/riscv-audit-abi.txt`, especially integer register table, Integer Calling Convention, standard stack alignment and s0–s11 paragraph. It specifies eight argument registers, first two also results, and 128-bit stack alignment.
- RV64 W arithmetic: official `/tmp/riscv-audit-rv64.txt` Integer Computational Instructions, sign extension of the low 32-bit result. The wording describes copying bit 31; it never claims unsigned narrow arguments are always zero-extended.
- RISC-V wrapper: `site/course/model.js` prepares entry/registers/stack area; appends capture/report/exit. A function body needs a caller and a top-level fragment must reach capture normally.
- RISC-V actual control names: `content/guides/playground.json`, generated new-project dialog in `tools/build-course.js`, and `site/playground/layout.js`. New project → Assembly fragment → Create project; Build & Run; Start stepping/Step instruction; Tools → Program; Inspect registers/Show registers/All. These control names were source-inspected, not browser-verified by this writer.
- Arm written-exercise control: `platform/lesson-runtime/src/strings.ts` uses Run tests. The guide's exercise task uses the parent's agreed `write-transfer-difference` contract, low-64-bit result in x0 and preservation of x1/x2.

AAPCS64 retrieved content SHA-256: `92460d0e8a1e081e0b1ed8f23dd6f9a0716ca566158a3e099a48de62cb2125a6`.

## Worked and fresh applications

The displayed difference functions are handwritten examples, not compiler output. The two inputs and result stay 64 bits. The plain RISC-V function is explicitly read-only in Arm, and the plain Arm function is explicitly read-only in RISC-V. No text suggests either editor accepts the other instruction set.

A short RISC-V caller makes the function feasible to run in an independent Assembly fragment project. It loads two concrete arguments, calls the leaf function, copies a0 to t2 for the default Registers display and jumps past the function body. The parent will test the exact displayed snippet and its result. The optional `observed` Arm-copy function accepts model values; it does not fabricate an observed result.

The fresh three-argument exercise computes an adjusted difference, includes wide/wrapped cases and requires the two later inputs to remain unchanged. Its five hints progress from operation order and width to the final reference sequence. The parent owns the seeded calls, reference program, native/model verification and browser interaction. Outgoing Arm learners can translate that function to a0/a1/a2 in their independent RISC-V project; incoming RISC-V learners follow the cross-link to run the Arm version in the actual Arm exercise.

## Integration and clarity checks

The new RISC-V guide prepends to the existing `riscv-and-arm` appendix and supplies its directional title/summary. Keep the existing carry starter, prediction, saved-state identity and graded exercise. The guide already explains register widths and flags; the original generic width paragraph and general flag introduction need not be repeated before the native example. Retain the example-specific explanation of add/sltu and the prediction boundary. The guide gives no numerical answer to that prediction.

Use the guide's headings, table and short function comparison as visible reference material. Keep the actual run directions visible beside the runnable caller. Do not place required setup guidance inside an optional disclosure. The original native carry and branch activities remain useful further practice, not prerequisites for finding the directional guide.

Sentence pass: plain British English, active instructions, concrete controls, no em dashes or unlabelled compiler claims. Idea pass: roles precede the worked translation; the function/process boundary precedes run instructions; the fresh task has an executable destination. The three default result registers t0/t1/t2 differ from the ABI result a0, so the caller copies a0 into t2 and names that copy explicitly. The full-register view remains a parent browser-verification item.

No learner or technical independent review has been claimed by this drafting pass. No novice learning effectiveness has been measured.

The independent technical review requested an explicit scope on the preservation lists and restoration of the stack pointer. Both guides now name general-purpose integer registers and require `sp` to be restored on return as well as kept aligned. This drafting pass applied that accepted qualification; it does not treat the list as the whole ABI-preserved state.

Primary-source links remain separate from the teaching sequence: Arm uses `references`; RISC-V guide data uses a root-level `references` array for inclusion in the existing page-bottom References disclosure.

The independent learner and technical reviews found two further wording faults. The fresh RISC-V edit now names its calculation and function directly, without an incorrect positional reference to an exercise below. Both guides explain that Start stepping runs supplied entry/setup before pausing at the first machine instruction in the editable fragment; source lines can still expand into several machine instructions. Root-level RISC-V references remain unchanged.

The local UI review found the same task name repeated in the construction heading, exercise caption and card. The construction now has `sectionTitle` (Run the Arm version), the caption identifies a 64-bit function with three supplied arguments, and the card retains its specific task title. This changes local copy only.

The final prerequisite review added two local definitions before use. Incoming RISC-V readers now learn that Arm `w0` names the low 32 bits of the same 64-bit `x0` register before reading the W-write rule. Outgoing Arm readers now meet xv6 as an operating system at its first mention. No additional OS detail or instruction was introduced.

## Canonical Arm source

```ts
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

```

## Canonical RISC-V guide data

```json
{
  "title": "Moving from RISC-V to Arm",
  "summary": "Translate a function’s register roles and width, then run its Arm version in the other lab.",
  "sections": [
    {
      "heading": "What carries over",
      "prose": [
        "Your knowledge of bits, memory, control flow and functions still applies. This guide compares RV64 with Arm A64. Check the calling convention, result width and execution environment as you translate.",
        "A calling convention is the agreement between a function and its caller. The table shows ordinary integer-register roles used by the worked function."
      ],
      "table": {
        "headings": [
          "Role",
          "RISC-V RV64",
          "Arm A64"
        ],
        "rows": [
          [
            "First arguments",
            "`a0`–`a7`",
            "`x0`–`x7`"
          ],
          [
            "First result",
            "`a0`",
            "`x0`"
          ],
          [
            "Return address",
            "`ra`",
            "`x30`"
          ],
          [
            "Always-zero operand",
            "`zero`, also named `x0`",
            "`xzr`"
          ]
        ]
      }
    },
    {
      "heading": "Check the register names",
      "prose": [
        "Arm `x0` is an ordinary register used for the first argument and result. It does not have the always-zero meaning of RISC-V `x0`.",
        "In Arm, `w0` names the low 32 bits of the same 64-bit register named `x0`. A write through a `w` name clears the upper half of its `x` register. RV64 W arithmetic copies result bit 31 into the upper half. Keep the worked function 64 bits wide in both versions.",
        "The preserved general-purpose integer registers differ: RISC-V uses `s0`–`s11`; Arm uses `x19`–`x29`. Restore `sp` to its incoming value before returning, and keep it 16-byte aligned. A function that makes a nested call must protect its incoming return address and values needed afterwards."
      ]
    },
    {
      "heading": "Translate a difference function",
      "prose": [
        "Both functions return the low 64 bits of `now - then`. Their caller supplies `now` first and `then` second. The destination is also the first input, so the subtraction replaces `now` with the difference. Neither function makes a further call.",
        "These are function bodies, with no process startup or reporting code. The Arm source is read-only in this RISC-V lab; use the linked Arm exercise to run Arm instructions."
      ],
      "snippets": [
        {
          "label": "RISC-V RV64 function",
          "source": "difference:\n  sub a0, a0, a1\n  ret"
        },
        {
          "label": "Arm A64 function, read-only here",
          "source": "difference:\n  sub x0, x0, x1\n  ret"
        }
      ]
    },
    {
      "heading": "Know what the lab supplies",
      "prose": [
        "Here, GNU tools assemble and link your source. A CPU emulator runs the executable as an xv6 user process. For fragments, the lab supplies entry, stack setup, register capture, reporting and exit. Tools → Program shows that complete program.",
        "The core Arm lessons run supported functions in a browser simulator. The lesson supplies arguments and recognises the function’s return. That course’s GNU/QEMU and physical-board activities have their own startup and debugging instructions.",
        "A function body returns to its caller. A top-level fragment continues into the supplied capture code. A complete program supplies its own entry and exit. System calls, valid addresses and device access depend on the environment; xv6 system calls differ from Linux’s."
      ]
    },
    {
      "heading": "Run the RISC-V caller",
      "prose": [
        "Copy the caller and function below. Then open the RISC-V playground to run the function independently. Choose Tools → Projects → New project. Select Assembly fragment, give it a name and choose Create project. Paste the copied code into the editor."
      ],
      "snippets": [
        {
          "label": "RISC-V assembly fragment with a caller",
          "source": "li a0, 53\nli a1, 40\ncall difference\nmv t2, a0\nj done\ndifference:\n  sub a0, a0, a1\n  ret\ndone:"
        }
      ],
      "after": [
        "Choose Build & Run, then find `t2` in Registers. Compare it with the difference of the two loaded arguments. The call enters `difference`. After `ret` returns, `mv t2, a0` copies the result into the default result display. Then `j done` skips the function body before the lab captures registers.",
        "Start stepping runs the supplied entry and setup, then pauses before the first machine instruction in your fragment. Step instruction advances through the executed instructions; a source line may expand into several. Tools → Program shows the supplied program and its machine instructions."
      ],
      "links": [
        {
          "label": "Open the RISC-V playground",
          "href": "../../playground/"
        }
      ]
    },
    {
      "heading": "Try a fresh Arm function",
      "prose": [
        "Open the Arm transfer appendix and find Translate an adjusted difference. Its editor supplies 64-bit now, then and adjustment values in `x0`, `x1` and `x2`. Write the low-64-bit result of now minus then plus adjustment into `x0`, keeping `x1` and `x2` unchanged. Choose Run tests and inspect the fresh calls, including inputs wider than 32 bits.",
        "The same page shows the Arm calling convention before the task. Identify which RISC-V registers would carry those three arguments. Explain why using a `w` destination could change the function’s result."
      ],
      "links": [
        {
          "label": "Open the Arm function exercise",
          "href": "https://snowch.github.io/assembly-lab/#/lesson/moving-to-riscv"
        },
        {
          "label": "Using the RISC-V workbench",
          "href": "../../using-the-workbench/"
        }
      ]
    },
    {
      "heading": "Compare flags and branches below",
      "prose": [
        "The runnable RISC-V example below checks carry explicitly. Arm flag-setting arithmetic records NZCV; ordinary `add` and `sub` preserve it. RISC-V integer arithmetic has no NZCV flags. Its branches compare registers directly. Use the example and optional exercise to check the required unsigned relationship."
      ]
    }
  ],
  "references": [
    {
      "label": "Arm AAPCS64",
      "href": "https://github.com/ARM-software/abi-aa/blob/2025Q4/aapcs64/aapcs64.rst"
    },
    {
      "label": "RISC-V procedure calling convention",
      "href": "https://riscv-non-isa.github.io/riscv-elf-psabi-doc/"
    }
  ]
}

```
