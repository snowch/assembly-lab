// Copyright © 2026 Christopher Snow

// Lesson 1 of Module 4: the paragraphs, hints, tasks and notes, kept word for word from
// docs/notes/module-4/prose.md (the part under "# Lesson 1"). module-4.prose.test.ts holds every
// string here to that file, so a change of wording is made there first. A closed note is the
// section's `details`: its summary is the note's title and its prose is the note.

export const PROSE = {
  question:
    'The trip computer returns the larger of two gradients with `steeper_s`. `steeper_u` is the same C with `unsigned` arguments.\n\n`a > b ? a : b` means "`a` if `a` is greater than `b`, otherwise `b`".\n\nBoth functions get the same two 32-bit patterns, `0xffffffff` and 1. They return different results: `steeper_s` returns 1, and `steeper_u` returns 4294967295.\n\nModule 1 showed that one pattern can have two readings. `0xffffffff` is −1 signed and 4294967295 unsigned.\n\nThe paired listings below show the functions and the instructions GCC recorded.\n\n`cmp` and `csel` are explained in the next sections. For now, the one fact you need is that `csel` picks one of two registers.\n\n**Two functions receive the same 32-bit patterns but return different results. What changes in the instructions when the C type changes?**',

  questionNoteSummary: "Which compiler?",
  questionNote: "GCC 16.1 with `-O1`, as in Module 0.",

  motivation:
    "A decision often needs only the flags, not the result. `cmp` is Arm’s name for `subs` with its result discarded. `cmp w1, w0` sets the flags for `w1` minus `w0` and writes no register. This is a **compare**.\n\nThe order matters. `cmp w1, w0` is `w1` minus `w0`. `cmp w0, w1` is the other way round, and its flags can differ.\n\n`cmp` also takes a constant, as `subs` does: `cmp w0, 10`.\n\nThe flags keep their values until another instruction writes them.",

  motivationNoteSummary: "cmn",
  motivationNote:
    "`cmn` is Arm’s name for `adds` with its result discarded. `cmn w0, w1` sets the flags for `w0` plus `w1` and writes no register. Module 2's `add_overflows` used it.",

  prediction:
    "The figure shows `steeper_s`'s three instructions from above, and runs `steeper_u` and `steeper_s` on `0xffffffff` and 1.",

  predictionQuestion: "**What does GCC change to make `steeper_u`'s three instructions?**",

  predictionExplain:
    "Only the last operand of `csel` changes: `ge` in `steeper_s`, and `cs` in `steeper_u`.\n\n" +
    "GCC compiled `steeper_u` to the three instructions below.\n\n" +
    "```\nsteeper_u:\n        cmp     w1, w0\n        csel    w0, w1, w0, cs\n        ret\n```\n\n" +
    "The `cmp` instruction is identical in both functions. It sets the same flags. The condition on `csel` determines whether those flags are read by the signed or the unsigned rules.\n\n" +
    "`cs` asks about the unsigned reading: higher or same. It is yes when C is 1. After a compare, C is 1 when no borrow was needed.",

  investigation:
    "The compare comes first. `w0` holds `a`, and `w1` holds `b`. `cmp w1, w0` sets the flags of `b` minus `a`.\n\n" +
    "The condition comes next. The last operand of `csel` names a yes-or-no question about the flags. That question is a **condition**. `ge` (greater than or equal, signed) is yes when N equals V. `cs` (higher or same, unsigned) is yes when C is 1.\n\n" +
    "Last comes the select. The first register in `csel` is the destination: the register it writes. The next two registers hold the values to choose between. When the condition is yes, `csel` copies the first source; when it is no, it copies the second.\n\nHere, `csel w0, w1, w0, ge` writes to `w0`. It copies `w1` when `ge` is yes, and `w0` when `ge` is no. The second source is also the destination, so the no case leaves `w0` unchanged. No instruction is skipped.\n\n" +
    "So both functions return `b` when `b` is at least `a`, and `a` otherwise. That is the larger value.\n\n" +
    "The figure shows the three stages for `0xffffffff` and 1, from the run.\n\n" +
    "The signed names are *greater* and *less*. The unsigned names are *higher* and *lower*. For these two functions, the difference between `int` and `unsigned` is in the condition GCC chose.",

  construction: "`less_fuel` is a choice between two registers, as `steeper_u` was.",

  lessFuelTask:
    "Write `less_fuel(a, b)`. It returns the smaller of two `unsigned` litres values. Use only `cmp`, `csel` and `ret`.\n\n" +
    "- `a` arrives in `w0`.\n- `b` arrives in `w1`.\n\nThe answer leaves in `w0`. A comment starts with `//`.\n\n" +
    "Five calls test it. In two of them, one value has the top bit set.",

  lessFuelHints: [
    "Compare the two, then let one `csel` choose between them.",
    "A signed condition can misread an unsigned value whose top bit is set. Choose a condition for unsigned ordering.",
    "`csel w0, w0, w1, cc` would give `w0` when `cc` is yes and `w1` when it is no.",
    "`cc` is yes when C is 0, that is, when `w0` is lower than `w1`. Compare `w0` with `w1`, in that order.",
    "`cmp w0, w1`, `csel w0, w0, w1, cc`, `ret`.",
  ] as const,

  /** What the grader says for a failed test, chosen by what the run shows (the rule is `less-fuel`). */
  lessFuelFeedback: {
    topBit:
      "Only the calls with the top bit set fail. Does your condition read the signed order or the unsigned order?",
    larger:
      "The larger value comes back. Check the order of `cmp`'s operands, and the order of `csel`'s two sources.",
    equal:
      "The returned value is wrong even though the inputs were equal. Check what each source register holds when `csel` runs. Has an earlier instruction overwritten an input?",
  },

  /** Said inside the figure that steps the learner's own solution, once the challenge has passed. */
  lessFuelAfterPass:
    "Step through one of the tests below to see the compare, the flags, the condition and the value `csel` chose.",

  failureExperiment:
    "The figure runs `steeper_u` with its last operand changed from `cs` to `ge`. The instructions are `cmp w1, w0`, `csel w0, w1, w0, ge` and `ret`. The inputs are `0x80000000` and 1.",

  failureQuestion: "**What does it return?**",

  failureExplain:
    "The run has the same operands as GCC's `steeper_u`: `0x80000000` and 1. It uses the same `cmp`, `cmp w1, w0`. That `cmp` leaves NZCV 1001: N is 1, Z is 0, C is 0 and V is 1.\n\n" +
    "In the changed function, `ge` is yes because N equals V. Its `csel` copies 1 from `w1` into `w0`.\n\n" +
    "In a separate run of GCC's original `steeper_u` with the same inputs, `cs` is no because C is 0. Its `csel` leaves `0x80000000` in `w0`, which is 2147483648.\n\n" +
    "With `ge`, the function reads the bits as signed. `0x80000000` is the smallest `int`, so the function returns 1. GCC's `steeper_u`, with `cs`, returns 2147483648.",

  explanation:
    "GCC prints the conditions `cs` and `cc`. Arm also writes them `hs` and `lo`, and the assembler accepts both.\n\n" +
    "In `cmp a, b`, `a` is the first operand and `b` is the second. After that compare, the core conditions come in groups. Each line says what the condition means, and which flags it reads.\n\n" +
    "- Equality: `eq` (a = b, Z is 1) and `ne` (a ≠ b, Z is 0).\n- Unsigned order: `cs` (a ≥ b, C is 1) and `cc` (a < b, C is 0).\n- Signed order: `ge` (a ≥ b, N equals V) and `lt` (a < b, N differs from V).\n\n" +
    "`hi` and `gt` exclude equality. Each has an opposite condition that includes equality. These conditions read Z as well.\n\n" +
    "- `hi` (higher, unsigned) is `cs` without equality: C is 1 and Z is 0. Its opposite is `ls` (lower or same, unsigned): C is 0 or Z is 1.\n- `gt` (greater than, signed) is `ge` without equality: Z is 0 and N equals V. Its opposite is `le` (less than or equal, signed): Z is 1 or N differs from V.\n\n" +
    "`vs`, which Module 2 met, is yes when V is 1.\n\n" +
    "The figure below uses `cmp w0, w1`, the reverse of `steeper_s`'s `cmp w1, w0`. Here, `a` is `w0` and `b` is `w1`. Choose a pair of values. For each condition, the figure shows the rule, the flags it reads and whether the condition holds.",

  explanationNoteSummary: "Every condition this course uses",
  explanationNote:
    "- `eq`, equal (either reading): Z is 1.\n- `ne`, not equal (either reading): Z is 0.\n- `cs`, higher or same, unsigned: C is 1.\n- `cc`, lower, unsigned: C is 0.\n- `hi`, higher, unsigned: C is 1 and Z is 0.\n- `ls`, lower or same, unsigned: C is 0 or Z is 1.\n- `ge`, greater than or equal, signed: N equals V.\n- `lt`, less than, signed: N differs from V.\n- `gt`, greater than, signed: Z is 0 and N equals V.\n- `le`, less than or equal, signed: Z is 1 or N differs from V.\n- `vs` (met in Module 2): V is 1.\n\n" +
    "Exactly one of each pair holds at every setting of the flags: `eq` or `ne`, `cs` or `cc`, `hi` or `ls`, `ge` or `lt`, `gt` or `le`. This is checked at all sixteen settings of the flags.\n\n" +
    "`cmp w0, w1` with 8 and 8 leaves NZCV 0110. So `eq`, `ge`, `le`, `cs` and `ls` are yes. `ne`, `gt`, `lt`, `hi` and `cc` are no.\n\n" +
    "With `0x7fffffff` and `0xffffffff`, `cmp w0, w1` leaves NZCV 1001. N is 1, yet 2147483647 is not less than −1. The signed subtraction overflowed, so V is 1 too. N equals V, so `ge` is yes. As unsigned, `cc` is yes.\n\n" +
    "A condition read after something other than `cmp` uses the flags that the last instruction to set them wrote.",

  generalisation:
    "`bool` is a C type that holds 0 or 1. A comparison, such as `litres < reserve`, gives 1 if it is true and 0 if it is not.\n\n`fuel_low` returns the result of this comparison:\n\n```c\nbool fuel_low(unsigned litres,\n              unsigned reserve)\n{\n    return litres < reserve;\n}\n```\n\nGCC 16.1 at `-O1` compiled it to these three instructions:\n\n" +
    "```\nfuel_low:\n        cmp     w0, w1\n        cset    w0, cc\n        ret\n```\n\n" +
    "`cset w0, cc` writes 1 to `w0` when `cc` is yes, and 0 when it is no. `csel` selects between register values. `cset` writes 0 or 1.\n\n" +
    "`fuel_low(5, 8)` is 1, and `fuel_low(8, 8)` is 0.\n\n" +
    'Not every C `if` makes the processor skip instructions. `warning_light` is written with `if (litres < reserve) return 1;` and then `return 0;`. GCC 16.1 at `-O1` compiled it to the same listing, which runs every instruction. The closed note "`warning_light`, and `tst` and `ands`" shows that listing and its two results.\n\n' +
    "`downhill` is `bool downhill(int gradient) { return gradient < 0; }`. GCC 16.1 at `-O1` compiled it to two instructions:\n\n" +
    "```\ndownhill:\n        lsr     w0, w0, 31\n        ret\n```\n\n" +
    "There is no compare. The signed reading of a number is negative exactly when its top bit is 1. `lsr w0, w0, 31` moves the top bit to the bottom, as Module 3 showed. So the result is 1 for a negative gradient, and 0 otherwise.",

  generalisationNoteSummary: "warning_light, and tst and ands",
  generalisationNote:
    "**`warning_light`**\n\n" +
    "```\nwarning_light:\n        cmp     w0, w1\n        cset    w0, cc\n        ret\n```\n\n" +
    "`warning_light(5, 8)` is 1, and `warning_light(8, 8)` is 0.\n\n" +
    "**`tst` and `ands`**\n\n" +
    "Two more instructions exist in the architecture: `tst` and `ands`. GCC 16.1 at `-O1` did not use either in any listing here. The `tst` and `ands` examples below are course-written assembly.\n\n" +
    "`tst w0, 2` sets the flags from `w0` AND 2, and writes no register. N is the top bit of the AND result. Z is 1 when the AND result is 0. C and V are set to 0. With the warning word `0x2a`, `tst w0, 2` leaves NZCV 0000. With `0x28`, it leaves NZCV 0100, so Z is 1 when the service-due bit (bit 1) is clear.\n\n" +
    "`ands w1, w0, 2` writes the AND result to `w1` as well. With `0x2a`, `w1` is 2 and NZCV is 0000. `and` alone leaves the flags as they were.",

  holdsTask:
    "- `w0` holds `0xfffffffb`.\n- `w1` holds 2.\n\nAfter `cmp w0, w1`, which of `ge`, `cs`, `lt` and `cc` are yes? Enter 1 for yes and 0 for no.",

  holdsHints: [
    "`cmp w0, w1` sets the flags of `w0` minus `w1`.",
    "Do not give `0xfffffffb` the same meaning in both comparisons: it is −5 signed and 4294967291 unsigned. 2 is 2 either way.",
    "For the simpler comparison of 8 with 8, equality makes `ge` and `cs` yes, and `lt` and `cc` no. Now apply the signed and unsigned readings to the task's unequal inputs.",
    "The flags are NZCV 1010. `ge` needs N equal to V; `cs` needs C to be 1.",
    "`ge` 0; `cs` 1; `lt` 1; `cc` 0.",
  ] as const,

  reflection:
    "- `cmp` sets the flags as a subtraction would, and keeps no result.\n- The order of its operands matters.\n- A condition reads the flags.\n- Signed and unsigned comparisons use different conditions.\n- `csel` chooses one of two register values without skipping any instruction.\n- `cset` writes 0 or 1 from a condition.\n\n" +
    "Before `cmp w0, w1` runs:\n\n- `w0` holds 2.\n- `w1` holds `0xfffffffe`.\n\nQuestion: After `cmp w0, w1`, what does `csel w0, w0, w1, gt` leave in `w0`? What would `hi` in place of `gt` leave?",

  reflectionNoteSummary: "Answer",
  reflectionNote:
    "The flags are NZCV 0000. `gt` (Z is 0 and N equals V) is yes: as signed, 2 is greater than −2, so `w0` keeps 2. `hi` (C is 1 and Z is 0) is no, because C is 0: as unsigned, 2 is lower than 4294967294, so `w0` gets `0xfffffffe`.",

  modelVsReality: "",
} as const;
