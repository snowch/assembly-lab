// Copyright © 2026 Christopher Snow

// Kept word for word in docs/notes/module-10/prose.md.
export const PROSE = {
  question:
    "You have followed assembly made by GCC. Now you can edit a C calculation and inspect each instruction produced by the course's smaller compiler. **How does a local variable become a register value?**\n\n`trip_charge` multiplies an unsigned distance by a rate, stores that product in the local variable `charge`, then adds a fixed charge of 7 to the returned result.",
  questionNoteSummary: "The compiler used in this figure",
  questionNote:
    "The initial listing comes from the course compiler, which runs in your browser. It accepts a deliberately small C subset and translates it with fixed instruction patterns. It does not optimise those patterns like GCC.\n\nThe lesson also retains GCC 16.1 output at `-O1` for comparison. The optional live comparison sends source to Compiler Explorer only when you press its button. Local compilation and the exercises do not need that service.",
  motivation:
    "The course compiler assigns registers to the parameters and local variables. In this function, distance uses `w0`, rate uses `w1`, and charge uses `w2`. Extra registers such as `w8` and `w9` hold intermediate working values. These are temporary values needed while evaluating an expression.\n\nThe generated instructions copy inputs into working registers, perform the multiplication, and copy the product into the local variable's register. The return calculation adds the fixed charge and puts the answer in `w0`. Register 0 then holds the return value, not the original distance.\n\nThe compiler builds constants with `movz` and, when needed, `movk`. An **immediate** is a constant written in an instruction. `movz` places a 16-bit immediate in a selected part of the destination and clears the other bits. `movk`, introduced in Module 1, replaces a selected part while keeping the other bits. For some constants, `mov` is a shorter way to write `movz`. Both forms produce the same instruction bit pattern for the processor. This compiler writes `movz` explicitly.\n\nThis compiler accepts one function with unsigned parameters and initialised unsigned locals: at most eight declared variables in total. It supports the arithmetic and control-flow statements taught here, with limits on source size, nesting and execution.",
  prediction:
    "- The distance is 6.\n- The rate is 4.\n\nThe function multiplies them, then adds its fixed charge of 7.",
  predictionQuestion: "**What does `trip_charge(6, 4)` return?**",
  predictionExplain:
    "It returns 31. The product is 24, stored as charge, and the return expression adds 7. Follow that value from the expression's working registers through the local variable and into `w0`.",
  investigation:
    "Compile the source locally, choose inputs, and run it. The C evaluator first checks the operations on that input. It rejects unsupported or unsafe operations on the tested path. This checks that path in the supported subset, not arbitrary C or every possible input. If it completes, the A64 simulator executes the generated listing. The interface compares their results and lets you step through the instructions.\n\nThe highlighted C line is the line associated with the current generated instruction. One C expression can produce several instructions, so the highlight can stay on the same source line as different registers change.\n\nTry changing the fixed charge or adding an unsigned local variable. The statement editor and the text editor both change the same C source. A new compilation generates instructions from that source; the interface does not substitute a prepared animation.",
  construction:
    "Write the same calculation directly in assembly. Your instructions can be shorter than the course compiler's fixed sequence while producing the required result.",
  writeTask:
    "Write `trip_charge` in assembly.\n\n- The unsigned distance arrives in `w0`.\n- The unsigned rate arrives in `w1`.\n\nReturn `distance * rate + 7` in `w0`, keeping the low 32 bits as unsigned arithmetic requires.",
  writeHints: [
    "Multiply the distance by the rate before adding the fixed charge.",
    "Do not expect either operation to preserve bits above bit 31. Both results use unsigned 32-bit wrapping.",
    "With distance 1 and rate 1, the product is 1. Adding the fixed charge of 7 gives 8.",
    "After the multiplication, add 7 to `w0`, then return.",
    "Write `mul w0, w0, w1`, `add w0, w0, #7` and `ret`.",
  ],
  failureExperiment:
    "The changed C function returns `charge` directly. It no longer adds the fixed charge. Its inputs are still distance 6 and rate 4.",
  failureQuestion: "**What does the changed function return?**",
  failureExplain:
    "It returns 24. The multiplication still calculates the distance-dependent charge, but the return expression no longer adds 7. Recompile the changed source and find which generated instructions have disappeared.",
  explanation:
    "The course compiler follows a fixed pattern for each supported expression and statement. That makes the translation inspectable, but it can produce moves and intermediate values that a more capable optimiser removes. Different instruction sequences can implement the same defined C calculation.\n\nThe C types control the arithmetic rules and the instruction choices. They do not remain as labels attached to the registers. For these unsigned variables, arithmetic keeps the low 32 bits. A later comparison tests that wrapped value.\n\nThe final function caps a charge at a limit. It first calculates the unsigned 32-bit product, then compares that result with the limit. It does not compare an unlimited mathematical product with the limit.",
  generalisation:
    "Compare compiler output by following the values and the paths that run. A shorter listing is not, by itself, evidence that every input behaves correctly or that execution is faster. Check the source rules and the defined input cases.\n\nIf you choose the GCC comparison, the page sends the current C source only after you press the button. It identifies Compiler Explorer, links its privacy policy and provides a link to the same source there. Cached responses avoid repeating a request for unchanged source and settings. If the request fails, local compilation still works.\n\nGCC may use instructions outside the course compiler's teaching subset. You can inspect that recorded response without treating it as a program this simulator can necessarily execute.",
  finalTask:
    "Write `cap_charge` in C. Its unsigned parameters are `distance`, `rate` and `limit`. Calculate the unsigned 32-bit product of distance and rate. If that product exceeds the limit, replace it with the limit. Return the resulting charge.\n\nThe cap applies after unsigned wrapping. Declare and initialise any local variable before using it.",
  finalHints: [
    "Calculate the product in an unsigned local variable.",
    "Compare the stored, wrapped product with the limit. Do not compare the limit with distance or rate separately.",
    "With distance 6 and rate 4, the product is 24. A limit of 20 reduces it to 20; a limit of 30 leaves it at 24.",
    "Return the local variable after the if statement, so both paths return a result.",
    "In the function body, write `unsigned charge = distance * rate;`, then `if (charge > limit) { charge = limit; }`, then `return charge;`.",
  ],
  reflection:
    "- The course compiler maps variables and intermediate values to registers.\n- One source expression can produce several instructions.\n- Compiling again reflects changes to the actual C source.\n- Different instruction sequences can implement the same calculation.\n- Unsigned wrapping occurs at the arithmetic operation, before a later cap.",
  modelVsReality: "",
  originalityNote: {
    textbookExample:
      "A compiler walkthrough that translates isolated arithmetic expressions by hand.",
    howThisDiffers:
      "An editable trip charge connects named C variables to working registers, then asks the learner to write equivalent assembly and a C cap whose position after unsigned wrapping matters.",
  },
} as const;
