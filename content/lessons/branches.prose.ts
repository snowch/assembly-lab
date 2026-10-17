// Copyright © 2026 Christopher Snow

// Lesson 2 of Module 4: the paragraphs, hints, tasks and notes, kept word for word from
// docs/notes/module-4/prose.md (the part under "# Lesson 2"). module-4.prose.test.ts holds every
// string here to that file, so a change of wording is made there first. A closed note is the
// section's `details`: its summary is the note's title and its prose is the note.

export const PROSE = {
  question:
    "The trip computer classifies a gradient as steep uphill, steep downhill or neither. The result depends on how the gradient compares with 10 and −10.\n\n" +
    "`describe` returns 2 when the gradient is above 10, −2 when it is below −10, and 0 otherwise. Its C is below.\n\n" +
    "```c\nint describe(int gradient)\n{\n    if (gradient > 10)\n        return 2;\n    if (gradient < -10)\n        return -2;\n    return 0;\n}\n```\n\n" +
    "GCC made the eight instructions below.\n\n" +
    "```\ndescribe:\n        cmp     w0, 10\n        bgt     .L9\n        cmn     w0, #10\n        mov     w0, -2\n        csel    w0, w0, wzr, lt\n.L7:\n        ret\n.L9:\n        mov     w0, 2\n        b       .L7\n```\n\n" +
    "GCC records, for each instruction, the C line it came from. Here `cmn`, `mov w0, -2` and `csel` sit beside `return 0;`, and no instruction sits beside `if (gradient < -10)` or `return -2;`.\n\n" +
    "`wzr` is a register name that always reads as 0. A write to it is thrown away.\n\nEvery listing so far ran from its first instruction to its `ret`, in order. This one has two lines that end in a colon, `.L7:` and `.L9:`. Two instructions name them.\n\n" +
    "**How does the processor execute only the instructions needed for that result?**",

  questionNoteSummary: "Which compiler?",
  questionNote: "GCC 16.1 with `-O1`, as in Module 0.",

  motivation:
    "A **label** is a name that ends in a colon. It names the place of the instruction on the line below it. A label is not an instruction, and it does not run.\n\n" +
    "A **branch** is an instruction that can change which instruction runs next.\n\n" +
    "`b .L7` always continues at `.L7`.\n\n" +
    "`bgt .L9` continues at `.L9` only when the condition `gt` holds. The condition is read from the flags, as `csel` read them. Otherwise, the next instruction runs.\n\n" +
    "When a branch goes to its label, it is **taken**. When it does not, it is **not taken**.",

  prediction: "The figure runs `describe(15)` on the listing above.",

  predictionQuestion: "**How many instructions run, counting `ret`?**",

  predictionExplain:
    "The answer is 5. For `describe(15)`, the run is `cmp w0, 10`, `bgt .L9` (taken), `mov w0, 2`, `b .L7` (taken) and `ret`.\n\n" +
    "`cmn`, `mov w0, -2` and `csel` were skipped. `describe(15)` returns 2.",

  investigation:
    "Different gradients run different instructions, so the run can have a different length. The figure runs `describe` on the gradient you choose: above 10, exactly 10, below −10, or between. It draws the path the run took, marks each branch as taken, not taken or not reached, and counts the instructions that ran.\n\n" +
    "GCC writes `bgt`. Arm writes `b.gt`. It is the same instruction, and the course's assembler accepts both.\n\n" +
    "`cmn w0, #10` sets the flags from adding 10 to the gradient. Adding 10 is the same calculation as subtracting −10, so these flags compare the gradient with −10. The signed `lt` condition is therefore yes when the gradient is below −10.\n\n" +
    "`mov w0, -2` sits between `cmn` and `csel`. It leaves the flags alone, so `csel` still reads `cmn`'s flags. `csel w0, w0, wzr, lt` gives −2 when `lt` is yes, and 0 when it is no.\n\n" +
    "Both paths end at the one `ret` under `.L7`.",

  investigationNoteSummary: "cmp with a negative number",
  investigationNote:
    "The GNU assembler turns `cmp w0, -10` into `cmn w0, 10`. The simulator gives the same flags for both. GCC prints `cmp w0, 10` without `#`, and `cmn w0, #10` with it. Both forms are accepted.",

  construction: "`fuel_warning` has three outcomes, and you choose the tests and their order.",

  fuelWarningTask:
    "Write `fuel_warning(litres, reserve)`. Both are `unsigned`. Its rules, in order:\n\n" +
    "- If `litres` is 0, return 2.\n- Otherwise, if `litres` is below `reserve`, return 1.\n- Otherwise, return 0.\n\n" +
    "Use only `cmp`, a branch with a condition, `cbz`, `b`, `mov` and `ret`. Five calls test it. One has `litres` equal to `reserve`. One has the top bit of `litres` set.\n\n" +
    "`litres` arrives in `w0`, and `reserve` arrives in `w1`. The answer leaves in `w0`.\n\n" +
    "`cbz w0, label` goes to the label when `w0` is 0. It neither reads nor changes the flags.\n\n" +
    "Choose a different name for each label. A simple convention is to use letters and underscores, starting with a letter. Do not use a register name. You can also use GCC's `.L` prefix, but it is not required.\n\n" +
    "A label goes on its own line, followed by a colon, before the instruction it names.",

  fuelWarningHints: [
    "Two questions need two tests: is `litres` 0, and is it below `reserve`. Does a `litres` of 0 also pass the second test?",
    'When `reserve` is above 0, zero litres is also below the reserve. Checking "below `reserve`" first would then return 1 instead of 2.',
    "`cbz w0, label` goes to the label when `w0` is 0. `cmp w0, w1` sets the flags of `litres` minus `reserve`.",
    '`litres` and `reserve` are `unsigned`: a value with the top bit set is a large number, so use the unsigned condition for "below", `cc`. A signed condition gets one test wrong.',
    "`cbz w0, .Lempty`, `cmp w0, w1`, `b.cc .Llow`, `mov w0, 0`, `ret`, then `.Llow:` `mov w0, 1`, `ret`, then `.Lempty:` `mov w0, 2`, `ret`.",
  ] as const,

  /** What the grader says for a failed test, chosen by what the run shows (the rule is `fuel-warning`). */
  fuelWarningFeedback: {
    zeroFirst: "A `litres` of 0 returns 1. Does the check for 0 come first?",
    fellThrough:
      "The run for a `litres` of 0 went on into the next block instead of returning. Does every block end in `ret` or `b`?",
    topBit: 'The call with the top bit set fails. Is "below" read as unsigned?',
    label:
      "The wrong value comes back. Which label did the run reach, and which branch sent it there?",
    overwritten:
      "An input was overwritten. Does a `mov` into `w0` run before the last test? It would replace `litres`, which is in `w0`.",
  },

  failureExperiment:
    "The figure runs `describe` with `bgt .L9` changed to `bge .L9`, on `describe(10)`.",

  failureQuestion: "**What does it return?**",

  failureExplain:
    "`cmp w0, 10` with 10 leaves Z 1, so NZCV is 0110.\n`gt` needs Z to be 0. Z is 1, so `gt` is no.\n`ge` needs N to equal V. N and V are both 0, so `ge` is yes.\n\n" +
    "GCC's `bgt` is not taken, so `describe(10)` returns 0 in six instructions. With `bge`, the branch is taken. `describe(10)` then returns 2 in five instructions.\n\n" +
    "The boundary moved: 10 now returns 2. The values on either side did not change. `describe(12)` still returns 2, and `describe(9)` still returns 0.",

  explanation:
    "Four branches test a register, not the flags.\n\n" +
    "- `cbz` goes when the register is 0.\n- `cbnz` goes when the register is not 0.\n- `tbz w0, 1, label` goes when bit 1 of `w0` is 0.\n- `tbnz` goes when that bit is 1.\n\n" +
    "None of them reads or changes the flags. `bgt` reads them.\n\n" +
    "GCC did not use `cbnz`, `tbz` or `tbnz` in any listing here. So `service` is the course's own example, not GCC's. Its listing is below. Bit 1 of the warning word is the service-due bit, as Module 3 showed.\n\n" +
    "```\nservice:\n        tbz     w0, 1, .Lno\n        mov     w0, 1\n        ret\n.Lno:\n        mov     w0, 0\n        ret\n```\n\n" +
    "`service(0x2a)` returns 1. `tbz` is not taken, and three instructions run.\n\n" +
    "`service(0x28)` returns 0. `tbz` is taken, and three instructions run.",

  explanationNoteSummary: "An excerpt of GCC's maybe_beep",
  explanationNote:
    "GCC 16.1 at `-O1` compiled `void maybe_beep(unsigned litres) { if (litres == 0) beep(); }`. `beep` is another function. `void` means it returns nothing.\n\n" +
    "The listing below is an excerpt. It shows the first two instructions only.\n\n" +
    "```\nmaybe_beep:\n        cbz     w0, .L17\n        ret\n```\n\n" +
    "The instructions from `.L17` run `beep`. They belong to a later module, so they are not shown here.\n\n" +
    "`maybe_beep(5)` runs two instructions: `cbz` is not taken, and `ret` follows. `maybe_beep(0)` sends the run to `.L17`, because `cbz` is taken. GCC put the part that runs `beep` after the `ret`, so the straight-line path is the one where `litres` is not 0.",

  generalisation:
    "GCC 16.1 at `-O1` made different choices for different `if`s. In `warning_light`, the `if` became `cmp` and `cset`, with no branch. In `describe`, one `if` became a branch, for `gradient > 10`, and the other became a `csel`, for `gradient < -10`. In `maybe_beep`, the `if` became a branch, `cbz`.\n\n" +
    "`csel` chooses between register values. `cset` writes 0 or 1. Neither can decide whether another function runs. In `maybe_beep`, the branch decides whether execution reaches the instructions that run `beep`.\n\n" +
    "These examples show what GCC produced at this setting. They do not tell us why GCC chose each instruction.",

  countsTask:
    "For `describe`, give what it returns and how many instructions run, for gradients 11, −10 and −11. Enter results in decimal. The boxes are grouped by gradient.\n\n" +
    "Count only instructions that run. Labels are not instructions. Include `ret`.",

  countsHints: [
    "`bgt` is taken only when `gt` is yes after `cmp w0, 10`.",
    "A run that takes `bgt` skips `cmn`, `mov w0, -2` and `csel`. A run that does not take it skips `mov w0, 2` and `b .L7`.",
    "After `cmn w0, #10`, `lt` is yes only when `w0` is below −10. −10 itself is not.",
    "11 is above 10. −11 is below −10. −10 is neither.",
    "2 in 5 instructions; 0 in 6; −2 in 6.",
  ] as const,

  /** What the grader says for a wrong count. */
  countsFeedback: "Look at which branch was taken, and which instructions it skipped.",

  reflection:
    "- A label names a place in the code. It is not an instruction.\n- A branch can change which instruction runs next.\n- A conditional branch is taken only when its condition holds.\n- A branch that is not taken lets the next instruction run.\n- `cbz` and `tbz` test a register or one bit, not the flags.\n- Different inputs can run different instructions.\n\n" +
    "Question: `service` is given `0x29`. Is `tbz` taken, what does `service` return, and how many instructions run?",

  reflectionNoteSummary: "Answer",
  reflectionNote:
    "`0x29` is `0010 1001`. Bit 1 is 0, so `tbz` is taken. The run is `tbz`, `mov w0, 0` and `ret`: three instructions. (`.Lno:` is a label, not counted.) `service` returns 0.",

  modelVsReality:
    "Many real processors start on later instructions before a branch is decided. The results are still those of one instruction at a time. The simulator runs one instruction at a time and gives the same results.\n\n" +
    "The arrows in the figure show the program's path, not the processor's timing.",
} as const;
