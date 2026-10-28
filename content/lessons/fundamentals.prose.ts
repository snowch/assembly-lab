// Copyright © 2026 Christopher Snow

// Drafted from checked primitive traces and the recorded increment_int listing.
// Canonical copy: docs/notes/fundamentals/prose.md.
import { CONSTANT_ADDITION_PROSE } from "./constant-addition.prose";

export const FUNDAMENTALS_PROSE = {
  constant: CONSTANT_ADDITION_PROSE,
  addition: {
    sections: {
      question: "How does a processor add two values?",
      motivation:
        "A **register** is a small, fast store inside the processor. This course uses AArch64, Arm’s 64-bit mode. It has 31 general-purpose integer registers, used for ordinary calculations, named `x0` to `x30`. Other registers have special jobs.\n\nAn **instruction** tells the processor to perform an operation. Assembly language writes instructions with names such as `add`. The parts after the name are its **operands**.\n\n**Memory** holds the program’s instructions and much more data than the registers can hold. For `add`, a value held in memory must first be brought into a register. A result can be written back.",
      prediction:
        "In `add w2, w0, w1`, the **inputs** are `w0` and `w1`: the instruction reads the values stored there. It adds those values and writes the result into `w2`. The register that receives the result is the **destination**, named first in this instruction.",
      investigation:
        "Press Run the instruction. The figure runs a **simulator** in your browser: a program that imitates the processor. The course calls it the model.",
      explanation: "Reading preserves the inputs. Only the destination is written.",
      generalisation:
        "The destination can be a different register. Apply the same operand rule below.",
      challenge: "Trace a new addition without running it.",
    },
    figure: {
      title: "One addition",
      prose:
        "The diagram shows the input values and where the result will go. Run `add w2, w0, w1` once.",
    },
    simulationNote: {
      summary: "What the simulator shows",
      prose:
        "The simulator shows each instruction’s completed effect. Real processors can work on several instructions at once. For these examples, the required results are the same. The simulator does not show how long a processor takes.",
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
        "- [Arm’s instruction reference](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/ADD--shifted-register---Add-optionally-shifted-register-) opens at the entry for `add`.\n- The [architecture reference manual](https://developer.arm.com/documentation/ddi0487/latest/) describes the registers and wider processor rules.\n\nBoth references are free to read without an account. If an Arm ID sign-in panel opens, close it to read the documentation.",
    },
    challenge: {
      task: "Before `add w1, w0, w2` runs:\n\n- `w0` holds 14.\n- `w1` holds 0.\n- `w2` holds 5.\n\nWhat do `w1` and `w0` hold after this instruction?",
      hints: [
        "The first operand names the register written.",
        "Use the starting values of the second and third operands for the addition.",
        "In the worked addition, 12 plus 7 writes 19 to `w2`. The input registers keep 12 and 7.",
        "This instruction reads `w0` and `w2`. It writes `w1`; it does not write `w0`.",
        "`w1` holds 19 and `w0` still holds 14.",
      ],
    },
    modelVsReality: "",
    originalityNote: {
      textbookExample:
        "A first assembly example often loads constants and adds them inside a complete program.",
      howThisDiffers:
        "This lesson begins with visible starting registers and isolates one addition. Its exercise changes the destination and checks that reading an input preserves it.",
    },
  },
  function: {
    sections: {
      motivation:
        "`increment_int` takes the integer input `n` and returns it increased by one. GCC, a compiler, translated the C below into an assembly **listing**, a written sequence of instructions. GCC 16.1.0 made these listings for 64-bit Arm using `-O1`, an optimisation setting that asks it to make code shorter and faster. `increment_int:` names the function.\n\nCode that calls a function is its **caller**. The input it supplies is an **argument**. For this function, the argument arrives in `w0` and the integer result is left in `w0` too.\n\nThe function adds one, then `ret` returns to its caller. The next lesson follows execution back into the caller.",
      investigation:
        "The simulator supplies the call and shows the caller waiting for the result. It omits the instructions that make the call.\n\nRun the function one instruction at a time. Watch where the argument arrives and where the result is left. On a narrow screen, scroll sideways within the listing to see the C and instructions.",
      construction:
        "`add_ints` takes two integer arguments. For this function, the first arrives in `w0` and the second in `w1`. The C names those inputs `a` and `b`.\n\nThe figure starts a separate call, `add_ints(7, 5)`. Its integer result is left in `w0`, just as for `increment_int`.",
      challenge:
        "Trace `add_ints` with fresh arguments. Identify the result register and the input register that keeps its value.",
    },
    figure: {
      title: "One argument, one result",
      prose: "Run the addition, then the return. Watch the value in `w0`.",
    },
    twoArgumentFigure: {
      title: "Two arguments, one result",
      prose: "Run the addition, then the return. Watch both registers.",
    },
    challenge: {
      task: "For a fresh call, `add_ints(6, 4)`:\n\n- The first argument, 6, arrives in `w0`.\n- The second argument, 4, arrives in `w1`.\n\nThe function runs `add w0, w0, w1`, then `ret`.\n\nWhat do `w0` and `w1` hold when the function returns?",
      hints: [
        "Place each argument in its incoming register before tracing the addition.",
        "The first operand names the register written. Reading the other input does not replace it.",
        "In the worked call, `add_ints(7, 5)` leaves 12 in `w0` and keeps 5 in `w1`.",
        "Add the two fresh arguments into `w0`. The addition does not write `w1`.",
        "The function leaves 10 in `w0` and keeps 4 in `w1`.",
      ],
    },
    modelVsReality: "",
    originalityNote: {
      textbookExample:
        "An introductory function example often combines several arithmetic operations or introduces call machinery immediately.",
      howThisDiffers:
        "Two small complete functions connect incoming arguments and an integer result to their registers. A fresh two-argument call checks the result and the preserved input before the next lesson follows execution back into the caller.",
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
      explanation:
        "Repeating a register name does not create another register. Read its old value before replacing it.",
      generalisation:
        "Both instructions write their first operand. Subtraction keeps the input order: second minus third.",
      challenge: "Trace a fresh subtraction without running it.",
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
      task: "Before `sub w1, w0, w1` runs:\n\n- `w0` holds 18.\n- `w1` holds 5.\n\nWhat do `w1` and `w0` hold after this instruction?",
      hints: [
        "First identify the destination.",
        "Subtract the third operand's old value from the second operand's old value.",
        "In the worked subtraction, 20 minus 6 writes 14 to `w1`. The instruction reads the old 6 before replacing it.",
        "The calculation uses 18 minus 5. Only `w1` is written.",
        "`w1` holds 13 and `w0` still holds 18.",
      ],
    },
    modelVsReality: "",
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
      investigation:
        "The marker ▸ shows which instruction runs next. The processor tracks that position in its **program counter**, a special register. Ordinary instructions do not name it the way they name `w0`. Run the two instructions one at a time. This figure stops after the subtraction.",
      explanation:
        "An arithmetic instruction writes its destination, then execution moves to the next instruction. That instruction uses the values now in the registers.",
      challenge:
        "Trace the sequence with fresh inputs. Use the first result when running the second instruction.",
    },
    figure: {
      title: "Two instructions",
      prose: "Run the addition, then the subtraction. The second uses the state left by the first.",
    },
    challenge: {
      task: "Start with:\n\n- `w0` holding 10.\n- `w1` holding 4.\n- `w2` holding 0.\n\nRun `add w2, w0, w1`, then `sub w2, w2, w1`, in that order.\n\nWhat do `w2` and `w1` hold after both instructions?",
      hints: [
        "Write down the registers after the first instruction before tracing the second.",
        "The subtraction reads the value the addition left in `w2`.",
        "In the worked sequence, 8 plus 3 writes 11 to `w2`. Then 11 minus 3 writes 8 to `w2`.",
        "Both instructions write `w2`. Neither writes `w1`.",
        "After both instructions, `w2` holds 10 and `w1` still holds 4.",
      ],
    },
    modelVsReality: "",
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
      "This lesson combines mechanics already practised in the earlier Fundamentals lessons. Its trip calculation, operand-order repair and experiment removing a return connect those mechanics to complete compiler output.",
  },
} as const;

export const FUNDAMENTALS_MODULE = {
  title: "Fundamentals",
  line: "Learn one operation at a time, follow a function call, then combine the instructions.",
} as const;
