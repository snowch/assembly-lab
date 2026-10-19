// Copyright © 2026 Christopher Snow

// Kept word for word in docs/notes/module-a/prose.md.
export const PROSE = {
  question:
    "The same C trip function can be compiled for a different Arm instruction set. Its calculation stays the same, but the registers and instructions change. **Which parts can you already understand, and which need a new rule?**\n\nThe paired listings implement `limit_trip`, which returns the smaller of an unsigned distance and limit. One targets A64, the instruction set used throughout the course. An Arm processor's mode determines which instruction sets and registers a program can use. Arm calls this its **execution state**. The other listing targets **A32**, an instruction set used in Arm's 32-bit execution state.",
  compilerNoteSummary: "The two compiler targets",
  compilerNote:
    "The A32 records use GCC 15.2 with `-O1 -marm -march=armv7-a`. `-marm` selects A32 rather than Thumb, another Arm instruction set. `-march=armv7-a` tells GCC which Armv7-A processor features it can assume are available.\n\nThe A64 records use GCC 16.1 with `-O1`. A64 uses Arm's 64-bit execution state even when an instruction operates on `w` registers. These are two particular compilations, not promises about the output of every compiler or setting.",
  motivation:
    "You already know how an unsigned comparison selects a result and how a function returns. Use those ideas to read the new syntax. In these A32 functions, the first arguments arrive in `r0` and `r1`, and the result leaves in `r0`. These are 32-bit registers, not `w` views of wider A64 `x` registers.\n\nA32's `lr` names its link register, also called `r14`. In this leaf function, `bx lr` returns to the saved address. The A64 listing uses `ret` for its return. Similar purposes do not imply identical register names or instruction spellings.",
  prediction:
    "Predict the result for distance 80 and limit 50 from the C function and its comparison. After checking your prediction, run the A64 version in the stepper below.",
  predictionQuestion: "**What does `limit_trip(80, 50)` return?**",
  predictionExplain:
    "It returns 50. The distance is above the limit, so the function selects the limit. The A64 simulator computes this result. The paired A32 listing is recorded compiler output; this course does not execute A32.",
  investigation:
    "In the A32 listing, `movcs r0, r1` is a move controlled by a condition. The `cs` suffix means carry set. After this unsigned comparison, that condition holds when the distance is greater than or equal to the limit. Only then does the move copy the limit into the result register.\n\nA64's `csel w0, w0, w1, ls` selects between two values. It keeps the distance when the lower-or-same condition holds, and selects the limit otherwise. Equal inputs give the same value whichever is selected.\n\nThe two listings implement the same C rule using different conditional instructions. Trace the A64 version, then identify the corresponding roles in the static A32 listing.",
  construction:
    "Read the instruction names directly from the A32 record. Separate the return instruction from the register that supplies its destination.",
  readTask:
    "Find two instruction names in the recorded A32 `limit_trip`: the conditional move and the return. Enter the mnemonic only for each, without registers or other operands.",
  readHints: [
    "Look at the A32 side of the pair.",
    "Do not enter a register name or the whole line. The fields ask for instruction names.",
    "In the A64 line `ret`, the instruction name is `ret`. Read only the instruction name from each requested A32 line, too.",
    "For the return, enter the instruction name before `lr`, not the register name itself.",
    "Enter `movcs` for the conditional move and `bx` for the return instruction.",
  ],
  readFeedback:
    "The answers are checked against instruction tokens in the recorded compiler output.",
  failureExperiment:
    "Take the conditional-move line from the A32 record and give it to the course's A64 assembler. The source still belongs to the A32 listing.",
  failureQuestion: "**Will the course A64 assembler accept this recorded line?**",
  failureExplain:
    "It rejects the line. The course assembler accepts the taught A64 subset, including its register names and instruction syntax. It does not accept A32 source.\n\nChanging the register spelling alone would not add A32's conditional-move form to that subset. This experiment checks the course assembler's language; it is not a test of every instruction in the complete A64 architecture.",
  explanation:
    "The service marker gives another spelling to inspect. For the constant 1001, the A32 compiler uses `movw r0, #1001`. Here, `movw` is an instruction name: it writes a 16-bit immediate into the low half of a register and clears the upper half. The `w` is not an A64 register-width prefix.\n\nA32 also has `movt`, which can set the upper half while leaving the lower half unchanged. This constant needs no such second instruction. The paired A64 record uses its own `mov` form.\n\nRead the instruction as part of its target architecture. Similar letters can have different roles in the two syntaxes.",
  generalisation:
    "The unsigned average reveals a target feature difference. The A64 record uses `udiv`. With these A32 settings, GCC does not assume a hardware integer-division instruction is available, so it calls a library helper.\n\nIn `bl __aeabi_uidiv`, `bl` is the call instruction and `__aeabi_uidiv` is the helper function's name. The helper name is not an instruction. A32 implementations with the optional divide extension can use hardware division; this one listing does not describe every A32 target.\n\nThe comparison uses a nonzero divisor. The course makes no claim here about what the A32 helper does when its divisor is zero.",
  divisionNoteSummary: "The A32 call and saved registers",
  divisionNote:
    "The A32 listing saves `{r4, lr}` with `push` before calling the helper. Braces enclose the register list. Saving two 32-bit registers preserves the 8-byte stack alignment required by this A32 calling convention. Register `r4` is preserved and supplies the extra space needed for alignment.\n\n`pop {r4, pc}` restores `r4` and loads the saved return address into `pc`, the program counter, which selects the next instruction. Loading that address returns to the caller. This is a different return sequence from the leaf function's `bx lr`.\n\nDo not carry A64's 16-byte stack-alignment rule over to this A32 convention.",
  finalTask:
    "Read the service-marker and average listings, then run the A64 average with distance 95 and trip count 4. Enter the A32 instruction used for the marker constant, the A32 division helper's name, the A64 division instruction, and the A64 result.\n\nFor instruction fields, enter only the mnemonic. For the helper, enter the function name shown after the call instruction.",
  finalHints: [
    "Use the marker pair for the first field and the average pair for the remaining fields.",
    "A call instruction and the helper name that follows it are different tokens. The helper field asks for the name.",
    "In the recorded A64 line `mov w0, 1001`, `mov` is the instruction name and `1001` is a value. For the A32 call, separate the instruction name from the helper name in the same way.",
    "The A64 average divides two unsigned integers. Its whole-number quotient discards the fractional part.",
    "Enter `movw` for the A32 constant instruction, `__aeabi_uidiv` for the helper and `udiv` for the A64 division. The result for inputs 95 and 4 is 23.",
  ],
  finalFeedback:
    "Instruction and helper names are checked against the records. The numerical answer is checked against the A64 simulator.",
  reflection:
    "- The same C calculation can use different instruction forms on different targets.\n- A32 register names are not narrower views of A64 registers.\n- An A32 condition suffix can control an instruction such as a move.\n- Target features can decide whether division uses an instruction or a helper call.\n- A recorded listing is evidence of one compiler configuration.\n\nWhen reading another architecture, begin with the values, the branches and the call boundaries you understand. Check its register rules and instruction syntax before treating familiar names as interchangeable.",
  modelVsReality:
    "A32 figures are static compiler records. The interactive execution and numerical predictions use only A64, which is the course simulator's instruction set. The A32 syntax experiment asks the existing A64 assembler whether it accepts one recorded line. It does not simulate that line.\n\nThis chapter does not compare instruction timing, run the A32 division library or claim that all Armv7-A implementations lack hardware divide.",
  originalityNote: {
    textbookExample: "A general A32 instruction catalogue or a second introduction to assembly.",
    howThisDiffers:
      "Three small trip-computer functions reuse mechanisms the learner already knows. A conditional limit, a service marker and a division call expose concrete differences without replacing the course's A64 machine.",
  },
} as const;
