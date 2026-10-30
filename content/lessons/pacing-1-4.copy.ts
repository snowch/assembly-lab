// Copyright © 2026 Christopher Snow

// New pacing copy; exact strings recorded in docs/notes/course-pacing-implementation/copy.md.
export const COPY = {
  hexadecimal: {
    title: "Reading hexadecimal",
    objectives: ["read a register’s bits in hexadecimal."],
    intro:
      "Hexadecimal groups the bits into a shorter form. Use the register reader to match each hexadecimal digit to its bits.",
    activity:
      "Change a bit and follow its hexadecimal digit. Then type a hexadecimal pattern and check which bits it sets. Both controls edit the same pattern.",
    caption: "The same register pattern as bits and hexadecimal digits.",
  },
  readings: {
    title: "Signed and unsigned readings",
    objectives: ["read the same register bits as signed or unsigned numbers."],
    intro:
      "The **signed reading** allows negative numbers and is the reading C’s `int` uses here. The **unsigned reading** counts every bit as a positive amount. The simulator shows register numbers in unsigned decimal.\n\nNothing in the register changes when we change how we read its bits.",
    investigation:
      "Each bit is worth twice the bit to its right: 1, 2, 4, 8 and so on. The leftmost bit, bit 31, is the **top bit**. It is worth 2147483648.\n\nThe **unsigned reading** adds the values of the bits that are 1. The **signed reading** does the same, except the top bit counts as minus 2147483648.\n\nThe other 31 bits count the same in both readings. So when the top bit is 0, the two readings agree.\n\nThe figure starts with `0xfffffff4`, the initial pattern in `w0`. It shows the top bit’s value and the other 31 bits’ total in each reading. Open Show calculation to see how those parts add up.",
  },
  loadConstant: {
    title: "Loading a constant",
    objectives: ["test whether a constant fits one mov instruction."],
  },
  buildConstant: {
    title: "Building a constant",
    objectives: ["combine mov and movk to construct a constant."],
    intro:
      "A constant that does not fit one instruction can be built in parts. Use movk to replace a part while keeping the other bits.",
  },
  registerWidths: {
    title: "Writing w and x registers",
    objectives: ["predict how a write through a w name affects its x register."],
    intro:
      "The w and x names refer to the same register at different widths. Predict what remains after each write.",
  },
  masks: {
    title: "Changing one warning",
    objectives: ["set, clear and flip a warning bit without changing the other bits."],
    traceTitle: "Trace two mask operations",
    traceCaption: "Two separate mask operations on the same starting warning word.",
    traceTask:
      "The warning word is `0x2a`. Give two results in hexadecimal:\n\n- the word after `orr w0, w0, 1`;\n- the word after `and w0, w0, -9`.\n\nStart with `0x2a` separately for each instruction.",
    traceHints: [
      "OR sets the mask’s bits. AND keeps bits where the mask has a one.",
      "Start each instruction with the original word, not the previous result.",
      "`0x2a` is `0010 1010`: bits 1, 3 and 5 are set.",
      "−9 is `0xfffffff7`, every bit except bit 3.",
      "The OR result is `0x2b`; the AND result is `0x22`.",
    ],
    investigationTitle: "Three rules for masks",
  },
  fields: {
    title: "Reading and writing a field",
    objectives: ["replace a field while keeping every bit outside it."],
    intro:
      "The warning word also holds the selected gear. Read the gear’s field, then replace it without changing the warnings.",
    traceTitle: "Read the gear",
    traceCaption: "Extract the gear field from the original warning word.",
    traceTask:
      "The warning word is `0x2a`. What gear does `ubfx x0, x0, 4, 3` return? Enter the result in hexadecimal.",
    traceHints: [
      "Find the gear field in the original word.",
      "The field starts at bit 4; the low warning bits are outside it.",
      "`0x2a` is `0010 1010`.",
      "Move bits 4 to 6 down to the lowest three places.",
      "The gear is `0x2`.",
    ],
    readTitle: "Reading the gear field",
  },
  compare: {
    title: "Choosing a signed or unsigned result",
    objectives: ["choose a condition that matches the signed or unsigned order."],
    coreConditions:
      "After `cmp a, b`, `cs` means higher or same, unsigned: C is 1. Its opposite, `cc`, means lower: C is 0. For signed order, `ge` means greater than or equal: N equals V. Its opposite, `lt`, means less than: N differs from V.",
  },
  conditions: {
    title: "Conditions and Boolean results",
    objectives: ["read condition rules and turn a condition into a Boolean result."],
    intro:
      "A compare leaves flags that several conditions can read. Use the condition explorer to compare their rules, then follow how cset produces a Boolean result.",
    extensionsSummary: "Other compiler forms and bit tests",
  },
  addition: {
    explanation:
      "The same result bits have signed and unsigned readings. After addition, C reports whether the unsigned sum is too large. V reports signed **overflow**: the mathematical signed sum is outside the signed range. These are separate tests.",
    title: "Addition and its flags",
    objectives: ["calculate result bits and flags for an addition."],
  },
  subtraction: {
    drilldownTitle: "How an adder subtracts",
    explanation:
      "N and Z describe the result bits. V reports whether the signed difference is outside the signed range. After `subs`, C is 1 when no unsigned borrow was needed. The counter result gives the forward distance only while fewer than a full turn has passed and the counter advances normally.",
    title: "Measuring elapsed ticks",
    objectives: ["use subtraction to measure elapsed ticks across a counter wrap."],
    reflection:
      "A subtraction gives the forward distance between counter readings when the counter advances normally and fewer than a full turn has passed. The readings alone cannot show how many full turns passed.\n\nUse this pair of counter readings:\n\n- `then` is 4294967000.\n- `now` is 296.\n\n**Question:** What does `elapsed(now, then)` return, and what does `subs` set C to?",
    reflectionAnswer:
      "592, and C is 0. 296 ticks reach the wrap, 296 more reach 296, and a borrow was needed.",
  },
  arithmeticBits: {
    title: "Arithmetic on register bits",
    objectives: [
      "follow how addition and subtraction act on the same bits under signed and unsigned readings.",
    ],
  },
  branches: {
    title: "Following a branch",
    objectives: ["trace how a conditional branch chooses the next instruction."],
  },
  zeroAndThresholdBranch: {
    title: "Zero and threshold branches",
    objectives: [
      "write a function that distinguishes zero from values on either side of a threshold.",
    ],
  },
  registerBitBranches: {
    title: "Testing registers and bits",
    objectives: ["follow branches that test a register or one bit without reading the flags."],
    caption: "The course-written service function, stepped with warning word 0x2a.",
  },
  shifts: {
    title: "Choosing a shift",
    objectives: ["choose how a shift fills the places left by moved bits."],
  },
  staleFlags: {
    title: "Flags and overflow",
    objectives: [
      "distinguish preserved flags from flags written by the latest arithmetic operation.",
    ],
    intro:
      "An instruction that leaves the flags unchanged can leave an earlier operation’s flags beside a new result. Follow the two additions to identify which operation the flags describe.",
  },
  subtractionArithmetic: {
    title: "Subtraction flags and negation",
    objectives: [
      "relate subtraction’s flags to its arithmetic and test negation at the signed limit.",
    ],
    exampleCaption: "A counter subtraction, showing its result bits and flags.",
  },
  shiftDivision: {
    title: "Shifts and signed division",
    objectives: ["compare a shift with signed division and follow the compiler’s correction."],
  },
} as const;
