// Copyright © 2026 Christopher Snow

// The second lesson of Module 1: the paragraphs, hints and tasks, kept word for word from
// docs/notes/module-1/prose.md (the part headed "Lesson 2"). constants-and-widths.prose.test.ts
// holds every string here to that file, so a change of wording is made there first.

export const PROSE = {
  question:
    "The trip computer's service interval is 30000 kilometres. The odometer's limit is 1000000.\n\n" +
    "GCC 16.1 at `-O1` makes one instruction for `return 30000;`: `mov w0, 30000`. For `return 1000000;` it makes two instructions.",

  motivation:
    "Almost every function puts a fixed number in a register somewhere. The instruction `mov` does that: `mov w0, 30000` puts 30000 in `w0`. A number written inside an instruction is called a **constant**. An instruction is a fixed size, so only some numbers fit inside one. The 32 bits of a register split into a lower half (the right-hand 16) and an upper half (the left-hand 16).",

  prediction: "Each number below could be the constant in one `mov`.",
  predictionQuestion: "**Which of these can one `mov` put in `w0`?**",
  predictionExplain:
    "Only 65536. Its bits are a single 1, in the upper 16-bit half, so all its set bits are in one half. The other three need bits in both halves.",

  investigation:
    "The figure assembles `mov w0, ` followed by the number you type. Assembling turns that text into an instruction. The course's assembler accepts and rejects the same numbers as the GNU assembler. The GNU assembler is the program that GCC itself uses to turn its listings into instructions.\n\n" +
    "A `mov` with a constant works when all the number's set bits fall within one 16-bit half of the register. Other numbers fit too, though their bits are in both halves. `-1`, with all 32 bits set, fits. So does 1048575, which is `0x000fffff`: twenty 1s in a row across both halves. So do some numbers whose run of 1s repeats at equal spacing, such as 65537, which is a single 1 repeated every 16 bits: `0x00010001`. For most other numbers with bits in both halves, the assembler says no single instruction can put them in a register. The figure below is the way to find out for any number.",
  investigationDetailsSummary: "Some more numbers fit.",
  investigationDetails:
    "A number whose bits are all ones except within one 16-bit half fits, such as `-1`. So do some numbers whose bits repeat one short pattern, such as 65537, which is `0x00010001`.",

  construction:
    "`movk` replaces one 16-bit half of a register and keeps the rest. `lsl 16`, which Module 3 explains, names the upper half, where the number goes. You split 1000000 into its two halves yourself. To split a number into its 16-bit halves, divide it by 65536. The whole-number answer is the upper half, and what is left over is the lower half. 65536 is the worth of the lowest bit of the upper half. Writing `#` before a number in an instruction is optional: `mov w0, 30000` and `mov w0, #30000` are the same instruction (Module 0 met `#50`).",
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
    "The registers so far have been drawn as 32 bits, because the lessons used their `w` names. Each register holds 64 bits, and it has two names. The **`x` register** name is `x3`, and it names all 64 bits. The **`w` register** name is `w3`, and it names the lower 32 bits of the same register. The figure runs `mov x3, -1`, which sets all 64 bits, then `mov w3, -1`.",
  failureQuestion: "**After `mov w3, -1`, what does `x3` hold?**",
  failureExplain:
    "The lower 32 bits are set and the upper 32 are cleared, so `x3` holds `0x00000000ffffffff`. Writing a `w` name always clears the upper half of the register.",

  explanation:
    "One `mov` fits a number in one 16-bit half. `movk` fills in another half without disturbing the rest.",

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
    "- Why does one `mov` hold 65536 but not 70000?\n" +
    "- What does `movk` keep that `mov` does not?\n" +
    "- If a function wrote `w0` and its caller read `x0`, what would the caller find in the upper half?",

  modelVsReality:
    "The course does not show how an instruction's bits hold its constant. The course takes which constants fit from the GNU assembler, and tests its own assembler against that one line by line.",
} as const;
