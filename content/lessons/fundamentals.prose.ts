// Copyright © 2026 Christopher Snow

// Drafted from checked primitive traces and the recorded increment_int listing.
// Canonical copy: docs/notes/fundamentals/prose.md.
export const FUNDAMENTALS_PROSE = {
  addition: {
    sections: {
      question: "How does a processor add two values?",
      motivation:
        "A **register** is a small, fast store inside the processor. This course uses AArch64, Arm’s 64-bit mode. It has 31 general-purpose integer registers, used for ordinary calculations, named `x0` to `x30`. Other registers have special jobs.\n\nAn **instruction** tells the processor to perform an operation. Assembly language writes instructions with names such as `add`. The parts after the name are its **operands**.\n\n**Memory** holds the program’s instructions and much more data than the registers can hold. For `add`, a value held in memory must first be brought into a register. A result can be written back.",
      prediction:
        "In `add w2, w0, w1`, the first operand names the register written. The second and third supply the values to add. Point to the inputs and the destination.",
      investigation:
        "Press Run the instruction. The figure runs a **simulator** in your browser: a program that imitates the processor. The course calls it the model.",
      construction:
        "Read the result back through the instruction: which operand names the register that was written?",
      failureExperiment: "Did either input register lose its value when the instruction read it?",
      explanation: "Reading preserves the inputs. Only the destination is written.",
      generalisation:
        "The destination can be a different register. Apply the same operand rule below.",
      challenge: "Trace a new addition without running it.",
      reflection: "Before calculating, identify the inputs and the destination.",
    },
    figure: {
      title: "One addition",
      prose: "The inputs are already in registers. Run `add w2, w0, w1` once.",
    },
    registerViews: {
      caption:
        "Each x name selects all 64 bits; its matching w name selects the lower 32 bits of the same register.",
      after:
        "You will experiment with both names in [Constants and widths](#/lesson/constants-and-widths) in Module 1, under ‘Two names, one register’.",
    },
    references: {
      summary: "Arm’s reference manuals",
      prose:
        "[Arm’s instruction reference](https://developer.arm.com/documentation/ddi0602/latest/) describes the instructions used here. The [architecture reference manual](https://developer.arm.com/documentation/ddi0487/latest/) also describes the registers and the wider processor rules.",
    },
    challenge: {
      task: "Before `add w1, w0, w2` runs, `w0` holds 14, `w1` holds 0 and `w2` holds 5. What do `w1` and `w0` hold after this instruction?",
      hints: [
        "The first operand names the register written.",
        "Use the starting values of the second and third operands for the addition.",
        "In the worked addition, 12 plus 7 writes 19 to `w2`. The input registers keep 12 and 7.",
        "This instruction reads `w0` and `w2`. It writes `w1`; it does not write `w0`.",
        "`w1` holds 19 and `w0` still holds 14.",
      ],
    },
    modelVsReality:
      "The figure runs one instruction and shows its effect on the selected registers. It leaves out the surrounding program. A real processor runs instructions as part of a program; the next lessons build up that context.",
    originalityNote: {
      textbookExample:
        "A first assembly example often loads constants and adds them inside a complete program.",
      howThisDiffers:
        "This lesson begins with visible starting registers and isolates one addition. Its exercise changes the destination and checks that reading an input preserves it.",
    },
  },
  function: {
    sections: {
      question: "How does a function give its result back to the code that called it?",
      motivation:
        "`increment_int` takes the integer input `n` and returns it increased by one. GCC, a compiler, translated the C below into an assembly **listing**, a written sequence of instructions. `increment_int:` names the function.\n\nCode that calls a function is its **caller**. The input it supplies is an **argument**. For this function, the argument arrives in `w0` and the integer result is left in `w0` too.",
      prediction:
        "In `add w0, w0, 1`, the last operand is the number one written inside the instruction. After the addition, can the caller continue yet?",
      investigation:
        "On a narrow screen, scroll sideways within the listing to see the C and instructions.",
      construction:
        "Match `n` in the C to the incoming value in `w0`. Which instruction prepares the result?",
      failureExperiment:
        "After `add`, the result was ready but the caller was waiting. Which instruction let it continue?",
      explanation:
        "`ret` returns to the caller without moving the result. The caller uses the value already in `w0`.",
      generalisation:
        "The calling rule puts this integer argument and result in `w0`. The operand rule still makes `add` write its first operand.",
      challenge: "Trace the same function with a different argument, without running it.",
      reflection:
        "Describe the two jobs separately: what does the addition do, and what does `ret` do?",
    },
    figure: {
      title: "A call and its return",
      prose: "Run the addition, then the return. Watch `w0` and the caller.",
    },
    challenge: {
      task: "For `increment_int(0)`, the argument arrives in `w0`. The function runs `add w0, w0, 1`, then `ret`. What value does the caller receive?",
      hints: [
        "Follow the addition before considering the return.",
        "The last operand of `add w0, w0, 1` is a number, not another register.",
        "For `increment_int(7)`, the addition writes 8 to `w0`. Then `ret` returns without changing that value.",
        "Start with the new argument in `w0`. Add one; `ret` leaves that result in place.",
        "The caller receives 1.",
      ],
    },
    modelVsReality:
      "The simulator supplies the call and shows the caller waiting for the result. It omits the instructions that make the call. Later lessons examine calls in more detail. GCC 16.1.0 made this recorded listing for 64-bit Arm using `-O1`, an optimisation setting that asks it to make code shorter and faster.",
    originalityNote: {
      textbookExample:
        "An introductory function example often combines several arithmetic operations or introduces call machinery immediately.",
      howThisDiffers:
        "This complete function adds one to a single input. The figure separates preparing its result from returning it, before the course combines more operations.",
    },
  },
  subtraction: {
    sections: {
      question: "Can an instruction read a register and replace its value?",
      motivation:
        "In `add w0, w0, w1`, both appearances of `w0` name the same register. The instruction reads its old value before writing the result there.",
      prediction: "Predict what the addition writes to `w0`, then run it.",
      investigation:
        "`sub` subtracts its third operand from its second, then writes its first operand. The next figure starts a separate example. Predict the result before running it.",
      construction: "In the subtraction, which old value was read before being replaced?",
      failureExperiment: "Would swapping the subtraction inputs give the same result?",
      explanation:
        "Repeating a register name does not create another register. Read its old value before replacing it.",
      generalisation:
        "Both instructions write their first operand. Subtraction keeps the input order: second minus third.",
      challenge: "Trace a fresh subtraction without running it.",
      reflection: "Distinguish the old input value from the result written afterwards.",
    },
    figure: {
      title: "Read and replace",
      prose: "Run `add w0, w0, w1` with the starting values shown.",
    },
    secondFigure: {
      title: "Subtract in order",
      prose: "This example starts afresh. Predict what `sub w1, w0, w1` writes.",
    },
    challenge: {
      task: "Before `sub w1, w0, w1` runs, `w0` holds 18 and `w1` holds 5. What do `w1` and `w0` hold after this instruction?",
      hints: [
        "First identify the destination.",
        "Subtract the third operand's old value from the second operand's old value.",
        "In the worked subtraction, 20 minus 6 writes 14 to `w1`. The instruction reads the old 6 before replacing it.",
        "The calculation uses 18 minus 5. Only `w1` is written.",
        "`w1` holds 13 and `w0` still holds 18.",
      ],
    },
    modelVsReality:
      "Each figure starts with its own inputs and runs one arithmetic instruction. The figures do not pass values to each other. The simulator reads the old values before writing the destination, as these instructions require.",
    originalityNote: {
      textbookExample:
        "Subtraction is often introduced as another instruction in a longer arithmetic program.",
      howThisDiffers:
        "Two separate examples first establish read-before-write, then apply it to operand order in subtraction. A fresh-input exercise checks both the result and the untouched input.",
    },
  },
  sequence: {
    sections: {
      question: "What does the second instruction read after the first writes a result?",
      motivation: "The next example adds into `w2`, then subtracts from that result.",
      prediction:
        "Which register does the first instruction write? Which instruction will read that result?",
      investigation:
        "The marker ▸ shows which instruction runs next. The processor tracks that position in its **program counter**, a special register. Ordinary instructions do not name it the way they name `w0`. Run the two instructions one at a time.",
      construction: "After the addition, pause. Which value will the subtraction read from `w2`?",
      failureExperiment: "Using the starting value of `w2` again would lose the addition's result.",
      explanation:
        "An arithmetic instruction writes its destination, then execution moves to the next instruction. That instruction uses the values now in the registers.",
      generalisation:
        "This figure stops after two arithmetic instructions. The earlier function continued with `ret` to return to its caller.",
      challenge:
        "Trace the sequence with fresh inputs. Use the first result when running the second instruction.",
      reflection: "At each step, ask: what was written, and which instruction runs next?",
    },
    figure: {
      title: "Two instructions",
      prose: "Run the addition, then the subtraction. The second uses the state left by the first.",
    },
    challenge: {
      task: "Start with `w0` holding 10, `w1` holding 4 and `w2` holding 0. Run `add w2, w0, w1`, then `sub w2, w2, w1`, in that order. What do `w2` and `w1` hold after both instructions?",
      hints: [
        "Write down the registers after the first instruction before tracing the second.",
        "The subtraction reads the value the addition left in `w2`.",
        "In the worked sequence, 8 plus 3 writes 11 to `w2`. Then 11 minus 3 writes 8 to `w2`.",
        "Both instructions write `w2`. Neither writes `w1`.",
        "After both instructions, `w2` holds 10 and `w1` still holds 4.",
      ],
    },
    modelVsReality:
      "The figure runs one instruction per step and stops after the two shown arithmetic instructions. A real processor can work on several instructions at once, but must preserve the results required by their order for this example.",
    originalityNote: {
      textbookExample:
        "An instruction sequence is often introduced through a complete multi-operation function.",
      howThisDiffers:
        "This two-instruction sequence makes the second operation consume the first result. A separate fresh-input trace checks that the learner carries state forward before meeting the trip function.",
    },
  },
} as const;

export const SYNTHESIS_COPY = {
  title: "Putting it together",
  question:
    "How do individual instructions perform a complete C function? Follow a trip calculation, then repair another function.",
  motivation:
    "You have practised addition, a function call and return, subtraction, and instructions in sequence. Now combine those mechanics.",
  motivationTitle: "From instructions to a function",
  listingNavigation:
    "On a narrow screen, swipe sideways within the listing to move between the C and instructions.",
  objectives: [
    "Trace a complete compiled function using the operand rules.",
    "Connect C arguments and results to the registers that hold them.",
    "Repair a subtraction whose inputs are reversed.",
    "Explain what happens when a function's `ret` is removed.",
  ],
  originalityNote: {
    textbookExample:
      "A first assembly program often combines loading constants, arithmetic and output before the individual mechanics are established.",
    howThisDiffers:
      "This lesson combines mechanics already practised in four visible Fundamentals lessons. Its trip calculation, operand-order repair and experiment removing a return connect those mechanics to complete compiler output.",
  },
} as const;

export const FUNDAMENTALS_MODULE = {
  title: "Fundamentals",
  line: "Learn one operation at a time, follow a function call, then combine the instructions.",
} as const;
