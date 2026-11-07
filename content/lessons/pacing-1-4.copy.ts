// Copyright © 2026 Christopher Snow

// New pacing copy; exact strings recorded in docs/notes/course-pacing-implementation/copy.md.
import { UNSIGNED_WEIGHTS } from "./twos-complement.prose";

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
      "The **unsigned reading** adds the positive amounts represented by the bits. The simulator shows register numbers in unsigned decimal. Use the figure to follow how the bits contribute to that number.",
    investigation:
      UNSIGNED_WEIGHTS +
      "\n\n" +
      "The figure starts with only bit 0 set. Press a bit to set or clear it and inspect its weight.",
  },
  loadConstant: {
    title: "Loading a constant",
    objectives: ["test whether a constant fits one mov instruction."],
  },
  buildConstant: {
    reminder:
      "`mov` replaces the whole destination value. [Loading a constant](#/lesson/constants-and-widths) shows which constants fit one instruction.",
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
    reminder:
      "A negative printed constant still names a bit pattern. [Signed and unsigned readings](#/lesson/same-bits-two-readings) shows how the same bits can have either reading.",
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
    reminder:
      "AND clears bits where its mask has zeros; OR sets bits where its mask has ones. [Changing one warning](#/lesson/masks) lets you try both rules.",
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
    reminder:
      "After subtraction, C records whether no unsigned borrow was needed, while V records signed overflow. [Subtraction flags and negation](#/lesson/subtraction-flags-and-negation) explains these separate tests.",
    title: "Choosing a signed or unsigned result",
    objectives: ["choose a condition that matches the signed or unsigned order."],
    coreConditions:
      "After `cmp a, b`, choose the condition for the reading you need:\n\n- `cs` means higher or same, unsigned: C is 1.\n- Its opposite, `cc`, means lower, unsigned: C is 0.\n- `ge` means greater than or equal, signed: N equals V.\n- Its opposite, `lt`, means less than, signed: N differs from V.",
  },
  conditions: {
    reminder:
      "A condition reads flags using a signed or unsigned rule. [Choosing a signed or unsigned result](#/lesson/compare-and-choose) follows the compare and selection together.",
    title: "Conditions and Boolean results",
    objectives: ["read condition rules and turn a condition into a Boolean result."],
    intro:
      "A compare leaves flags that several conditions can read. Use the condition explorer to compare their rules, then follow how cset produces a Boolean result.",
    extensionsSummary: "Other compiler forms and bit tests",
  },
  addition: {
    reminder:
      "The same bits can represent different signed and unsigned numbers. [Signed and unsigned readings](#/lesson/same-bits-two-readings) shows how to calculate each reading.",
    explanation:
      "The same result bits have signed and unsigned readings. After addition:\n\n- C reports whether the unsigned sum is too large.\n- V reports signed **overflow**: the mathematical signed sum is outside the signed range.\n\nThese are separate tests.",
    title: "Addition and its flags",
    objectives: ["calculate result bits and flags for an addition."],
  },
  subtraction: {
    drilldownTitle: "How an adder subtracts",
    explanation:
      "After `subs`:\n\n- N and Z describe the result bits.\n- V reports whether the signed difference is outside the signed range.\n- C is 1 when no unsigned borrow was needed.\n\nThe counter result gives the forward distance only while fewer than a full turn has passed and the counter advances normally.",
    title: "Measuring elapsed ticks",
    objectives: ["use subtraction to measure elapsed ticks across a counter wrap."],
    reflection:
      "A subtraction gives the forward distance between counter readings when the counter advances normally and fewer than a full turn has passed. The readings alone cannot show how many full turns passed.\n\nUse this pair of counter readings:\n\n- `then` is 4294967000.\n- `now` is 296.\n\n**Question:** What does `elapsed(now, then)` return, and what does `subs` set C to?",
    reflectionAnswer:
      "592, and C is 0. 296 ticks reach the wrap, 296 more reach 296, and a borrow was needed.",
  },
  arithmeticBits: {
    title: "Arithmetic on register bits",
    comparisonTitle: "A trip beyond its planned distance",
    objectives: [
      "choose C types and checks that match what a trip’s returned distance should mean.",
    ],
    intro:
      "The trip computer should show how much distance remains and how far you have gone beyond the plan. You planned 3 km and travelled 5 km. Can the returned distance express that you are beyond the plan?\n\nCompare two C functions that subtract the distance travelled from the planned distance. Their parameter and return types differ. You have already calculated this subtraction with four bits.\n\nOn this AArch64 target, both types use 32 bits:\n\n- `int` uses the signed reading.\n- `unsigned int` uses the unsigned reading.\n\nIn C, `unsigned` on its own means `unsigned int`.",
    caption:
      "Two independent calls with planned = 3 km and travelled = 5 km. Predict the instructions, then press Run comparison to compare their returned bits and C values.",
    question:
      "Does changing these C types from `int` to `unsigned` change the instructions in the recorded GCC output?",
    options: [
      { value: "same", label: "The instructions are identical." },
      { value: "different", label: "The instructions differ." },
    ],
    explain:
      "Both listings use `sub w0, w0, w1` followed by `ret`. The subtraction keeps the low 32 result bits. It needs no separate signed or unsigned form.",
    callIntro:
      "After checking your prediction, press **Run comparison**. The simulator runs each function independently from the same starting arguments. Their matching returned bits appear once, with a separate C reading for each return type.",
    boundsTitle: "C arithmetic has type rules",
    bounds:
      "C applies different rules to these two types:\n\n- **A negative `int` result can be valid.** Here `int` ranges from −2147483648 to 2147483647. A mathematical result outside that range is signed **overflow**. A negative value within this range does not overflow.\n- **Unsigned arithmetic wraps into range.** Here the range is 0 to 4294967295. A mathematical result below zero or above that maximum wraps back into range. Subtraction below zero follows this rule too.\n- **Signed arithmetic outside its range has no C guarantee.** For signed addition, subtraction and multiplication, an out-of-range result has **undefined behaviour**: C places no requirements on that case. For example, adding 1 to 2147483647 exceeds this `int` range. C guarantees neither wrapping nor an error.\n\nFor compiler examples and ways to check the bounds, see [C overflow and machine results](#/lesson/c-and-overflow).",
    contract:
      "Decide what the function should return when the trip exceeds its plan: a negative distance, zero, or a separate error report. That choice determines the C types and any checks the function needs. Changing the types alone does not add a check.",
    reflectionTitle: "Return zero beyond the plan",
    reflection:
      "If the function must return zero once the planned distance is exceeded, what check must it make before subtracting?",
    reflectionSummary: "Check your reasoning",
    reflectionAnswer:
      "Check whether `travelled > planned`. If so, return zero; otherwise subtract `travelled` from `planned`. Make this check before subtracting so the unsigned subtraction cannot wrap below zero.",
    compilerSummary: "Which compiler?",
    compiler:
      "These are recorded GCC 16.1.0 listings for AArch64 Linux, compiled with `-O1 -g`. `-O1` enables compiler optimisations; `-g` records source-line information. Other compiler settings may choose different instructions. The C rules here follow draft N3096, sections 6.2.5 and 6.5 paragraph 5.",
    originality: {
      textbookExample:
        "A signed-versus-unsigned puzzle that changes the source, the arithmetic and the displayed interpretation at once.",
      howThisDiffers:
        "Continues the earlier four-bit 3 minus 5 subtraction with two recorded 32-bit trip functions. The learner predicts whether their instructions differ, then compares model-derived returns against the trip’s purpose and chooses a check for a different return rule.",
    },
  },
  branches: {
    reminder:
      "A condition asks a yes-or-no question about the flags. [Conditions and Boolean results](#/lesson/conditions-and-boolean-results) lists the rules each condition uses.",
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
    reminder:
      "Each warning occupies its own bit in the warning word. [Changing one warning](#/lesson/masks) gives the warning positions and shows how to change one bit independently.",
    title: "Testing registers and bits",
    objectives: ["follow branches that test a register or one bit without reading the flags."],
    caption: "The course-written service function, stepped with warning word 0x2a.",
  },
  shifts: {
    reminder:
      "A set top bit makes the signed reading negative, while the unsigned reading stays non-negative. [Signed and unsigned readings](#/lesson/same-bits-two-readings) explains the two readings.",
    title: "Choosing a shift",
    objectives: ["choose how a shift fills the places left by moved bits."],
  },
  staleFlags: {
    reminder:
      "`add` leaves the flags unchanged; `adds` writes them. [Addition and its flags](#/lesson/adding-and-the-flags) explains what N, Z, C and V record.",
    title: "Flags and overflow",
    objectives: [
      "distinguish preserved flags from flags written by the latest arithmetic operation.",
    ],
    intro:
      "An instruction that leaves the flags unchanged can leave an earlier operation’s flags beside a new result. Follow the two additions to identify which operation the flags describe.",
  },
  subtractionArithmetic: {
    reminder:
      "Each addition column passes its carry to the next column on the left. [Addition and its flags](#/lesson/adding-and-the-flags) follows those carries and the flags they produce.",
    title: "Subtraction flags and negation",
    objectives: [
      "relate subtraction’s flags to its arithmetic and test negation at the signed limit.",
    ],
    exampleCaption: "A counter subtraction, showing its result bits and flags.",
  },
  shiftDivision: {
    reminder:
      "`asr` fills from the old top bit; `lsr` fills with zeros. [Choosing a shift](#/lesson/shifts) shows how that changes the signed and unsigned readings.",
    title: "Shifts and signed division",
    objectives: ["compare a shift with signed division and follow the compiler’s correction."],
  },
} as const;
