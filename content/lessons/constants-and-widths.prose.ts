// Copyright © 2026 Christopher Snow

// The second lesson of Module 1: the paragraphs, hints and tasks, kept word for word from
// docs/notes/module-1/prose.md (the part headed "Lesson 2"). constants-and-widths.prose.test.ts
// holds every string here to that file, so a change of wording is made there first.

export const PROSE = {
  question:
    "The trip computer's service interval is 30000 kilometres. The odometer's limit is 1000000.\n\n" +
    "GCC loads the two results differently:\n\n- For `return 30000;`, it uses one instruction: `mov w0, 30000`.\n- For `return 1000000;`, it needs two instructions.\n\nIn both cases, `ret` then returns to the code that called the function.\n\n" +
    "The C listing uses `int service_interval(void)`. The `void` inside the brackets means the function takes no arguments.",
  questionDetailsSummary: "Which compiler?",
  questionDetails:
    "The instruction listings shown beside C are from GCC 16.1 with `-O1`, as in Module 0.",

  motivation:
    "`mov` puts a constant in a register: `mov w0, 30000` puts 30000 in `w0`.\n\n" +
    "An instruction is 32 bits long. Some bits identify the operation and the destination register, leaving fewer than 32 for the constant. So one instruction cannot hold every 32-bit constant.\n\n" +
    "Split a register's 32 bits into two halves. The upper half is the left 16 bits. The lower half is the right 16 bits.\n\n" +
    "30000 is `0x00007530`. Its upper half is `0000`, so all its set bits are in the lower half.\n\n" +
    "A single `mov` can load a constant whose set bits all fall in one 16-bit half. Some other patterns load too, so this is not the complete rule.\n\n" +
    "In hexadecimal each half is four digits, so the boundary falls in the middle of the eight digits.",

  prediction:
    "Here are three of the four in hexadecimal, with a space between the halves:\n\n- 65536 is `0x0001 0000`.\n- 70000 is `0x0001 1170`.\n- 100000 is `0x0001 86a0`.\n\nThe fourth, 1000000, is the odometer limit from the first section, which GCC needs two instructions for. Look at which halves of the three numbers have set bits.",
  predictionQuestion:
    "**Which number does the rule above guarantee will fit in one `mov` to `w0`?**",
  predictionExplain:
    "The one-half rule guarantees some constants fit. Other patterns can fit too. Try the candidates in the next figure to check what the assembler accepts.",

  investigation:
    "The figure assembles `mov w0,` followed by the number you type. Assembling turns that text into an instruction.\n\n" +
    "The course's assembler accepts and rejects the same numbers as the GNU assembler, the program GCC uses to turn its listings into instructions. So the figure is the authority on whether a number fits.\n\n" +
    "Other patterns load with one `mov` because `mov` is a name the assembler accepts for more than one instruction. It picks the one that can hold the constant.",
  investigationDetailsSummary: "Other patterns that fit",
  investigationDetails:
    "`-1` fits, with all 32 bits set.\n\n" +
    "1048575 (`0x000fffff`) fits. It has twenty 1s in a row across both halves.\n\n" +
    "65537 (`0x00010001`) fits. It is a single 1 repeated every 16 bits.\n\n" +
    "The full rule is longer than this course needs. The figure checks any number.",

  construction:
    "`mov w0, 1000000` cannot assemble: 1000000 does not match any constant pattern that one `mov` can encode. Build it in halves instead. Use `mov` to load the first part. A second `mov` would replace all 32 bits of `w0`, losing that part.\n\n`movk` means **move wide with keep**: here it replaces one 16-bit half and keeps the other.\n\n" +
    "`lsl` means **logical shift left**. In `movk`, `lsl 16` places the new constant in the upper half; it does not shift the value already in `w0`. Leaving it out selects the lower half.",
  constructionMethod:
    "### Find the two halves\n\n" +
    "Bit 0 is worth 1. Each position to the left is worth twice as much.\n\n" +
    "The upper half starts at bit 16, so double 1 sixteen times:\n\n" +
    "**Double each time:** 1 → 2 → 4 → … → 16384 → 32768 → 65536\n\n" +
    "So an upper-half value of 1 contributes 65536 to the whole number. An upper-half value of 2 contributes 131072.\n\n" +
    "In the worked example:\n\n" +
    "**131075 = 2 × 65536 + 3**\n\n" +
    "Two whole groups of 65536 give the upper half, 2. The remaining 3 goes in the lower half.\n\n" +
    "For another positive number that fits in `w0`, you can use the calculator below. Division keeps the whole-number part: the part before the decimal point.\n\n" +
    "1. Divide the number by 65536. The calculator's whole-number result is the upper half.\n" +
    "2. Multiply that result by 65536. Subtract that amount from your original number. The amount left, called the **remainder**, is the lower half.",
  constructionSyntax:
    "`#` before a number is optional: `mov w0, #3` means the same as `mov w0, 3`.",
  /** Shown once Build 1000000 has passed, above the stepper through the learner's own solution. */
  constructionSolved:
    "Step through your solution below. Watch which halves of `w0` are written or kept.",
  buildTask:
    "Put 1000000 in `w0` and return it, using only `mov`, `movk` and `ret`. The starting text, `mov w0, 1000000` then `ret`, does not assemble.\n\nChoose Text to type one instruction per line. Choose Tap to select a line and edit it with buttons. Press Run tests to check your program.",
  buildHints: [
    "One `mov` holds a number whose bits fall in one 16-bit half. `movk` writes the other half without touching the first.",
    "A second `mov` to `w0` replaces both 16-bit halves. `movk` replaces one half and keeps the other.",
    "`mov w0, 1` then `movk w0, 1, lsl 16` leaves 65537 in `w0`.",
    "The lower half is 16960, and `mov w0, 16960` puts it there.",
    "`mov w0, 16960`, then `movk w0, 0xf, lsl 16`, then `ret`.",
  ] as const,

  failureExperiment:
    "The `w` names in the earlier arithmetic examples selected 32 bits. Each register holds 64 bits, and it has two names.\n\n" +
    "For the same register:\n\n- The `x` name, `x3`, names all 64 bits.\n- The `w` name, `w3`, names the lower 32 bits.\n\nThey are not two registers.\n\n" +
    "The figure runs `mov x3, -1`, which sets all 64 bits, then `mov w3, -1`.",
  failureQuestion: "**After `mov w3, -1`, what does `x3` hold?**",
  failureExplain:
    "The lower 32 bits are set and the upper 32 are cleared, so `x3` holds `0x00000000ffffffff`. Writing a `w` name always clears the upper 32 bits of the `x` register.",

  immediateAdd: {
    title: "Multiply the constant before adding",
    prose:
      "`lsl #12` multiplies the constant `#1` by 4096 before the addition. The instruction writes `w2` and leaves `w0` unchanged.\n\nIn this form of `add`, the constant before `lsl` ranges from 0 to 4095. The only optional `lsl` amounts are 0 and 12; omitting `lsl` uses the constant unchanged. These options differ from those of `mov` and `movk`.\n\nSee [Arm’s ADD (immediate) reference](https://developer.arm.com/documentation/ddi0602/2025-12/Base-Instructions/ADD--immediate---Add-immediate-value-).",
  },

  generalisation:
    "A `long` in C is an integer type. It is 64 bits on the system GCC compiles for here.\n\n" +
    "For a function returning `long`, GCC 16.1 at `-O1` loads the result of `return -1;` with `mov x0, -1`. The `x` name gives the instruction access to all 64 bits.\n\n" +
    "The `u` in `4294967295u` marks the constant as `unsigned`.\n\n" +
    "GCC 16.1 at `-O1` turns `return -1;` with `int` and `return 4294967295u;` with `unsigned` into the same instruction, `mov w0, -1`: the same 32 bits, read two ways.\n\n" +
    "Every constant in these listings is a pattern of bits. The C type affects how many bits the instructions use and how the program interprets those bits.",

  challenge:
    "Follow the four instructions in the listing. Track the two register values separately.",

  predictTask: "Without running them, give `x1` and `w2` after all four, as decimal numbers.",
  predictHints: [
    "Writing `w1` clears the upper 32 bits of `x1`.",
    "`mov w1, 5` does not keep the 1s that `mov x1, -1` set in the upper 32 bits.",
    "After `mov x3, -1` then `mov w3, -1`, `x3` is `0x00000000ffffffff`.",
    "`w2` ends as `0x000f4240`.",
    "`x1` is 5 and `w2` is 1000000.",
  ] as const,

  reflection:
    "- Not every constant fits in a single `mov`.\n" +
    "- With a `w` name, `movk` replaces one 16-bit half of the 32 bits and keeps the other half.\n" +
    "- `wN` names the lower 32 bits of `xN`.\n" +
    "- Writing `wN` clears the upper 32 bits of `xN`.\n\n" +
    "**`x5` holds `0xffffffffffffffff`. Then `mov w5, 7` runs. What does `x5` hold?**",
  reflectionDetailsSummary: "Answer",
  reflectionDetails:
    "`x5` holds 7. Writing `w5` put 7 in the lower 32 bits and cleared the upper 32.",

  modelVsReality: "",
} as const;
