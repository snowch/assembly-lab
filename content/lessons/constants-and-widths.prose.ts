// Copyright © 2026 Christopher Snow

// The second lesson of Module 1: the paragraphs, hints and tasks, kept word for word from
// docs/notes/module-1/prose.md (the part headed "Lesson 2"). constants-and-widths.prose.test.ts
// holds every string here to that file, so a change of wording is made there first.

export const PROSE = {
  question:
    "The trip computer's service interval is 30000 kilometres. The odometer's limit is 1000000.\n\n" +
    "For `return 30000;`, GCC makes one instruction: `mov w0, 30000`. For `return 1000000;`, it makes two.",
  questionDetailsSummary: "Which compiler?",
  questionDetails: "The listings in this lesson are from GCC 16.1 with `-O1`, as in Module 0.",

  motivation:
    "`mov` puts a fixed number in a register: `mov w0, 30000` puts 30000 in `w0`. A number written inside an instruction is a **constant**.\n\n" +
    "An instruction is 32 bits long, so it cannot hold every 32-bit constant.\n\n" +
    "Split a register's 32 bits into two halves. The upper half is the left 16 bits. The lower half is the right 16 bits.\n\n" +
    "30000 is `0x00007530`. Its upper half is `0000`, so all its set bits are in the lower half.\n\n" +
    "A single `mov` can load a constant whose set bits all fall in one 16-bit half. Some other patterns load too, so this is not the complete rule.\n\n" +
    "In hexadecimal each half is four digits, so the boundary falls in the middle of the eight digits.",

  prediction:
    "Here are the four in hexadecimal, with a space between the halves. 65536 is `0x0001 0000`, 70000 is `0x0001 1170`, 100000 is `0x0001 86a0`, and 1000000 is `0x000f 4240`. Look at which halves of each number have set bits.",
  predictionQuestion: "**Which of these can one `mov` put in `w0`?**",
  predictionExplain:
    "Only 65536 fits. Its only set bit is in the upper half, so its lower half is `0000`. The other three numbers have set bits in both halves.",

  investigation:
    "The figure assembles `mov w0,` followed by the number you type. Assembling turns that text into an instruction.\n\n" +
    "The course's assembler accepts and rejects the same numbers as the GNU assembler, the program GCC uses to turn its listings into instructions. So the figure is the authority on whether a number fits.\n\n" +
    "`mov` is a name the assembler accepts for more than one instruction. It chooses the one that can hold the constant.",
  investigationDetailsSummary: "Other patterns that fit",
  investigationDetails:
    "`-1` fits, with all 32 bits set.\n\n" +
    "1048575 (`0x000fffff`) fits. It has twenty 1s in a row across both halves.\n\n" +
    "65537 (`0x00010001`) fits. It is a single 1 repeated every 16 bits.\n\n" +
    "The full rule is longer than this course needs. The figure checks any number.",

  construction:
    "`movk` replaces one 16-bit half of a register and keeps the rest. `mov` replaces the whole register.\n\n" +
    "`lsl 16` after the number tells `movk` to put it in the upper half, bits 16 to 31. Without `lsl 16`, `movk` puts it in the lower half.\n\n" +
    "For example, `mov w0, 3` gives `0x0000 0003`. Then `movk w0, 2, lsl 16` gives `0x0002 0003`, which is 131075. The upper half is new, and the lower half is kept. The figure draws each step.\n\n" +
    "To split a number into its two halves, divide it by 65536. That is the worth of the lowest bit of the upper half. The whole-number answer is the upper half, and what is left over is the lower half.\n\n" +
    "Writing `#` before a number is optional. `mov w0, 30000` and `mov w0, #30000` are the same instruction.",
  /** Shown once Build 1000000 has passed, above the stepper through the learner's own solution. */
  constructionSolved:
    "Step through your solution below to see each instruction's halves, and which half changed and which was kept.",
  buildTask:
    "Put 1000000 in `w0` and return it, using only `mov`, `movk` and `ret`. The starting text, `mov w0, 1000000` then `ret`, does not assemble.",
  buildHints: [
    "One `mov` holds a number whose bits fall in one 16-bit half. `movk` sets the other half without touching the first.",
    "A second `mov` replaces the whole register. Only `movk` keeps the other half.",
    "`mov w0, 1` then `movk w0, 1, lsl 16` leaves 65537 in `w0`.",
    "The lower half is 16960, and `mov w0, 16960` puts it there.",
    "`mov w0, 16960`, then `movk w0, 0xf, lsl 16`, then `ret`.",
  ] as const,

  failureExperiment:
    "The figures so far showed 32 bits, because they used `w` names. Each register holds 64 bits, and it has two names.\n\n" +
    "The `x` name, `x3`, names all 64 bits. The `w` name, `w3`, names the lower 32 bits of the same register. They are not two registers.\n\n" +
    "The figure runs `mov x3, -1`, which sets all 64 bits, then `mov w3, -1`.",
  failureQuestion: "**After `mov w3, -1`, what does `x3` hold?**",
  failureExplain:
    "The lower 32 bits are set and the upper 32 are cleared, so `x3` holds `0x00000000ffffffff`. Writing a `w` name always clears the upper 32 bits of the `x` register.",

  explanation:
    "A constant that does not fit in one `mov` is built half by half, with `mov` then `movk`.",

  generalisation:
    "A `long` in C is an integer type; on 64-bit Arm Linux it is 64 bits, so GCC 16.1 at `-O1` turns `return -1;` with `long` into `mov x0, -1`, which uses the `x` name. The `u` in `4294967295u` marks the constant as `unsigned`. GCC 16.1 at `-O1` turns `return -1;` with `int` and `return 4294967295u;` with `unsigned` into the same instruction, `mov w0, -1`: the same 32 bits, read two ways.\n\n" +
    "Every constant in every listing is a pattern of bits. The C type only decides how the program reads it later.",

  challenge:
    "The figure shows four instructions: `mov x1, -1`, `mov w1, 5`, `mov w2, 16960`, `movk w2, 0xf, lsl 16`.",
  predictTask: "Without running them, give `x1` and `w2` after all four, as decimal numbers.",
  predictHints: [
    "Writing `w1` clears the upper half of `x1`.",
    "`mov w1, 5` does not keep the 1s that `mov x1, -1` set in the upper half.",
    "After `mov x3, -1` then `mov w3, -1`, `x3` is `0x00000000ffffffff`.",
    "`w2` ends as `0x000f4240`.",
    "`x1` is 5 and `w2` is 1000000.",
  ] as const,

  reflection:
    "- Not every constant fits in a single `mov`.\n" +
    "- `movk` replaces one chosen 16-bit half and keeps the rest.\n" +
    "- `wN` names the lower 32 bits of `xN`.\n" +
    "- Writing `wN` clears the upper 32 bits of `xN`.\n\n" +
    "**`x5` holds `0xffffffffffffffff`. Then `mov w5, 7` runs. What does `x5` hold?**",
  reflectionDetailsSummary: "Answer",
  reflectionDetails:
    "`x5` holds 7. Writing `w5` put 7 in the lower 32 bits and cleared the upper 32.",

  modelVsReality:
    "The course does not show how an instruction's bits hold its constant. The course takes which constants fit from the GNU assembler, and tests its own assembler against that one line by line.",
} as const;
