// Copyright © 2026 Christopher Snow

// Lesson 2 of Module 4: the paragraphs, hints, tasks and notes, kept word for word from
// docs/notes/module-4/prose.md (the part under "# Lesson 2"). branches.prose.test.ts holds every string
// here to that file, so a change of wording is made there first.

export const PROSE = {
  question:
    "The trip computer's `describe` returns 2 when the gradient is above 10, −2 when it is below −10, and 0 otherwise. It is the C function:\n\n" +
    "```c\nint describe(int gradient)\n{\n    if (gradient > 10)\n        return 2;\n    if (gradient < -10)\n        return -2;\n    return 0;\n}\n```\n\n" +
    "GCC 16.1 at `-O1` made eight instructions (recorded listing):\n\n" +
    "```\ndescribe:\n        cmp     w0, 10\n        bgt     .L9\n        cmn     w0, #10\n        mov     w0, -2\n        csel    w0, w0, wzr, lt\n.L7:\n        ret\n.L9:\n        mov     w0, 2\n        b       .L7\n```\n\n" +
    "Every listing so far ran from its first instruction to its `ret`, in order. This one has two names that end in a colon, `.L7:` and `.L9:`, and two instructions that use them, `bgt .L9` and `b .L7`.\n\n" +
    "**How does the processor decide which instruction runs next?**\n\n" +
    "The figure puts each instruction beside the C line GCC recorded for it. `cmp` and `bgt` sit beside `if (gradient > 10)`. `cmn`, `mov w0, -2` and `csel` sit beside `return 0;`. `.L7:` and `ret` sit beside the closing brace `}`. `mov w0, 2` and `b .L7` sit beside `return 2;`. No instruction is recorded against `if (gradient < -10)` or `return -2;`.",

  motivation:
    "A C `if` runs some statements and not others. `describe` returns different numbers for different gradients, so not every instruction can run every time. Until now, each instruction ran after the one before it. A function that decides needs an instruction that changes which one runs next. In `describe`, `b .L7` makes the run go on at the place named `.L7`, and `bgt .L9` does so only when a test of the flags says greater than.",

  prediction: "The figure runs `describe(15)` on the listing from part 1.",

  predictionQuestion: "**How many instructions run before the function returns?**",

  predictionExplain:
    "The answer is 5. The run is `cmp w0, 10`, `bgt .L9`, `mov w0, 2`, `b .L7` and `ret`. The three instructions between `bgt .L9` and `.L7` (`cmn`, `mov w0, -2` and `csel`) did not run. `describe(15)` returns 2.",

  investigation:
    "A **branch** is an instruction that can change which instruction runs next. A **label** is a name for the place of an instruction: `.L9:` names the `mov w0, 2` under it. A branch names the label it goes to.\n\n" +
    "`b .L7` always goes to `.L7`. `bgt .L9` goes to `.L9` only if the condition `gt` is yes, read from the flags exactly as `csel` read them in Lesson 1. When a branch goes to its label, it is **taken**. When it does not, the next instruction runs, and the branch is **not taken**. GCC writes `bgt`. Arm writes `b.gt`, which is the same instruction, and the course's assembler accepts both.\n\n" +
    "- `describe(15)`: `cmp w0, 10` leaves NZCV 0010. `gt` is yes, since Z is 0 and N equals V, so `bgt` is taken to `.L9`. Then `mov w0, 2`, `b .L7` (taken) and `ret`. The result is 2, in five instructions.\n- `describe(10)`: `cmp w0, 10` leaves NZCV 0110. `gt` is no, since Z is 1, so `bgt` is not taken. The run goes down the listing: `cmn`, `mov`, `csel` and `ret`. The result is 0, in six instructions.\n- `describe(-15)`: `cmp w0, 10` leaves NZCV 1010, so `bgt` is not taken. `cmn w0, #10` leaves NZCV 1000. The result is −2 (`0xfffffffe`), in six instructions.\n- `describe(0)`: `cmp` leaves NZCV 1000, and `cmn` leaves NZCV 0000. The result is 0, in six instructions.\n\n" +
    "`cmn w0, #10` sets the flags of `w0` plus 10. After it, `lt` is yes exactly when `w0` plus 10 is below 0, that is, when `w0` is below −10. It is the same test as comparing with −10. The GNU assembler (`as`) itself turns `cmp w0, -10` into `cmn w0, 10`, and the simulator gives the same flags for both. GCC prints `cmp w0, 10` without `#` and `cmn w0, #10` with it. Both forms are accepted.\n\n" +
    "`mov w0, -2` sits between `cmn` and `csel` and leaves the flags alone, so `csel` still reads `cmn`'s flags. `csel w0, w0, wzr, lt` gives `w0` (now −2) when `lt` is yes, and `wzr` when it is no. `wzr` is a register name that always reads as 0. Both paths end at the one `ret` under `.L7`: the first by falling through from `csel`, and the second by `b .L7`.",

  construction: "`fuel_warning` has three outcomes, and you choose the tests and their order.",

  fuelWarningTask:
    "Write `fuel_warning(litres, reserve)`. It returns 2 when `litres` is 0, 1 when `litres` is below `reserve`, and 0 otherwise. Both are `unsigned`. Use only `cmp`, a branch with a condition, `cbz`, `b`, `mov` and `ret`. Five calls test it: one with `litres` equal to `reserve`, and one with the top bit of `litres` set.\n\n" +
    "`litres` arrives in `w0` and `reserve` in `w1`; the answer leaves in `w0`. `cbz w0, label` goes to the label when `w0` is 0. It neither reads nor changes the flags: with flags 0000 or 1111, they stay the same. You name your own labels, and any name works. The `.L` that starts each of GCC's labels is only GCC's habit. GCC puts each label on its own line, followed by a colon, before the instruction it names.",

  fuelWarningHints: [
    "Two questions need two tests: is `litres` 0, and is it below `reserve`. Ask the empty one first.",
    'Ask "below `reserve`" first and `litres` 0 also passes it, so it returns 1, not 2.',
    "`cbz w0, label` goes to the label when `w0` is 0. `cmp w0, w1` sets the flags of `litres` minus `reserve`.",
    '`litres` and `reserve` are `unsigned`: a value with the top bit set is a large number, so use the unsigned condition for "below", `cc`. A signed condition gets one test wrong.',
    "`cbz w0, .Lempty`, `cmp w0, w1`, `b.cc .Llow`, `mov w0, 0`, `ret`, then `.Llow:` `mov w0, 1`, `ret`, then `.Lempty:` `mov w0, 2`, `ret`.",
  ] as const,

  failureExperiment:
    "The figure runs `describe` with `bgt .L9` changed to `bge .L9`, on `describe(10)`.",

  failureQuestion: "**What does it return?**",

  failureExplain:
    "It returns 2, in five instructions. `cmp w0, 10` leaves NZCV 0110. `ge` is yes when N equals V, and both are 0, so the branch is taken. `gt` also needs Z to be 0, and Z is 1, so GCC's `bgt` is not taken and `describe(10)` returns 0. With `bge`, `describe(12)` still returns 2, and `describe(9)` still returns 0.",

  explanation:
    "`cbz w0, .L17` goes to `.L17` when `w0` is 0, and `cbnz` goes when it is not 0. Neither reads nor changes the flags. `tbz w0, 1, label` goes to the label when bit 1 of `w0` is 0, and `tbnz` goes when it is 1. No recorded listing in this module uses `cbnz`, `tbz` or `tbnz`, so none of them is shown as GCC's output. The course's own example, which is not GCC's, is:\n\n" +
    "```\nservice:\n        tbz     w0, 1, .Lno\n        mov     w0, 1\n        ret\n.Lno:\n        mov     w0, 0\n        ret\n```\n\n" +
    "`service(0x2a)` returns 1. Bit 1 is set, so `tbz` is not taken, and three instructions run. `service(0x28)` returns 0. `tbz` is taken, and three instructions run.\n\n" +
    "GCC's `maybe_beep`, from `void maybe_beep(unsigned litres) { if (litres == 0) beep(); }`, is shown here as an excerpt: its first two instructions only (recorded listing):\n\n" +
    "```\nmaybe_beep:\n        cbz     w0, .L17\n        ret\n```\n\n" +
    "The instructions from `.L17` run `beep`. They belong to a later module, so they are not shown. `maybe_beep(5)` runs two instructions: `cbz` is not taken, and `ret` follows. `maybe_beep(0)` sends the run to `.L17`, because `cbz` is taken. GCC put the part that runs `beep` after the `ret`, so the straight-line path is the one where `litres` is not 0.",

  generalisation:
    "In Lesson 1, GCC 16.1 at `-O1` turned the `if` in `warning_light` into `cmp` and `cset`, with no branch. In `describe`, it used one branch, for `gradient > 10`, and a `csel` for `gradient < -10`. In `maybe_beep`, it used a branch, `cbz`. This is what one compiler did at one level: GCC 16.1 at `-O1`. `csel` and `cset` choose between values in registers. Running `beep` is not a value in a register, so `maybe_beep` needs a branch. That reasoning comes from what `csel` does. It is not a claim about why GCC chose the branch.",

  challenge: "This challenge counts the instructions in three runs of `describe`.",

  countsTask:
    "For `describe`, give what it returns and how many instructions run, for gradients 11, −10 and −11. Enter results in decimal.",

  countsHints: [
    "`bgt` is taken only when `gt` is yes after `cmp w0, 10`.",
    "A run that takes `bgt` skips `cmn`, `mov w0, -2` and `csel`. A run that does not take it skips `mov w0, 2` and `b .L7`.",
    "After `cmn w0, #10`, `lt` is yes only when `w0` is below −10. −10 itself is not.",
    "11 is above 10. −11 is below −10. −10 is neither.",
    "2 in 5 instructions; 0 in 6; −2 in 6.",
  ] as const,

  reflection:
    "- What decides whether a branch is taken?\n- Why does `describe(10)` run six instructions and `describe(15)` run five?\n- Why must `fuel_warning` test for 0 before it tests against the reserve?",

  modelVsReality:
    "Many real processors start on later instructions before a branch is decided. The results are still those of one instruction at a time. The simulator runs one instruction at a time and gives the same results.\n\n" +
    "The arrows in the figure show the program's path, not the processor's timing.",
} as const;
