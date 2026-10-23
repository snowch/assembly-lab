// Copyright © 2026 Christopher Snow

// Drafted from checked primitive traces and the recorded increment_int listing.
// Canonical copy: docs/notes/fundamentals/prose.md.
export const FUNDAMENTALS_PROSE = {
  addition: {
    sections: {
      question:
        "How does a processor add two values? Start with one instruction and watch where its result goes.",
      motivation:
        "A **register** is a small store inside the processor that holds a value. The names `w0`, `w1` and `w2` select 32 bits of three registers. Module 1 shows the rest of each register.\n\nAn **instruction** tells the processor to perform an operation. Assembly language writes instructions with names such as `add`. The parts after the name are its **operands**.",
      prediction:
        "In `add w2, w0, w1`, the first operand names the register written. The instruction adds the values supplied by the second and third operands. Before running it, point to the two inputs and the destination.",
      investigation:
        "The figure starts with `w0` holding 12, `w1` holding 7 and `w2` holding 0. Press Run the instruction. Compare the inputs with the result.\n\nThe figure runs a simulator in your browser. The simulator imitates the processor; the course calls it the model.",
      construction:
        "Read the instruction from left to right: add, write `w2`, read `w0`, read `w1`. The destination tells you where to put the sum.",
      failureExperiment:
        "Reading a register does not empty it. Check the two input registers after the instruction: did either lose its value?",
      explanation:
        "This addition reads its inputs and writes its destination. The other registers keep their values.",
      generalisation:
        "The first operand can name a different destination. Use that rule in the new example below; its inputs differ from the figure above.",
      challenge:
        "Work out the result of one addition without running it. Give the value written and the value of an input register afterwards.",
      reflection:
        "When you read an `add`, identify its destination before calculating. Which operands supply the values, and which operand names the register written?",
    },
    figure: {
      title: "One addition",
      prose: "Run `add w2, w0, w1` once to see what it reads and writes.",
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
      question:
        "How does an addition become the result of a function call? Follow a function that increases its input by one.",
      motivation:
        "`increment_int` takes the integer input `n` and returns it increased by one. GCC, a compiler, translated the C below into an assembly **listing**, a written sequence of instructions. `increment_int:` names the function.\n\nCode that calls a function is its **caller**. The input it supplies is an **argument**. For this function, the argument arrives in `w0` and the integer result is left in `w0` too.",
      prediction:
        "In `add w0, w0, 1`, the last operand is the number one written inside the instruction. The instruction reads the incoming `w0` and writes the increased value back there. What still needs to happen before the caller can continue?",
      investigation:
        "Follow `increment_int(7)` below. Run `add` to prepare the result, then run `ret` to return to the caller. Use Show instructions or Show C to move across the paired listing on a narrow screen.",
      construction:
        "Follow the value through the call: the caller supplies the argument, the function calculates in `w0`, and the caller receives the value left there when the function returns.",
      failureExperiment:
        "Look back at the state after the addition: the result was ready in `w0`, while the caller was still waiting. Running `ret` let the caller continue with that result.",
      explanation:
        "`ret` returns to the code that called the function. It does not calculate or move the result. The caller uses the value already in `w0`.",
      generalisation:
        "This placement of an integer argument and result is a rule for calling these functions. It is separate from the operand rule: `add` still writes the register named by its first operand.",
      challenge:
        "Now follow the same function with a different argument. Calculate the value it returns without running this call.",
      reflection:
        "Describe the two jobs separately: what does the addition do, and what does `ret` do?",
    },
    figure: {
      title: "A call and its return",
      prose: "Step through `increment_int(7)`. The caller waits until `ret` runs.",
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
      question:
        "Can an instruction read a register and replace its value? What changes when the operation is subtraction?",
      motivation:
        "A destination can also supply an input. The instruction reads the old input values before writing its result. In `add w0, w0, w1`, both appearances of `w0` name the same register.",
      prediction:
        "The first figure starts with `w0` holding 9 and `w1` holding 4. Predict the value written to `w0`, then run the addition.",
      investigation:
        "The subtraction figure starts a separate example: `w0` holds 20 and `w1` holds 6. `sub` subtracts its third operand from its second, then writes the register named by its first operand. Predict the result before running it.",
      construction:
        "Read `sub w1, w0, w1` as: write `w1` with the old value in `w0` minus the old value in `w1`.",
      failureExperiment:
        "Swapping subtraction's inputs changes the calculation. Check their order in the instruction before deciding which value to subtract.",
      explanation:
        "Repeating a register name does not create another register. An input can be read and then overwritten by the result of the same instruction.",
      generalisation:
        "For both `add` and `sub`, the first operand names the destination. For `sub`, keep the order of the remaining operands: second minus third.",
      challenge:
        "Use the subtraction rule with fresh inputs below. Track the register written and a register only read.",
      reflection:
        "When a register appears twice, distinguish its old input value from the result written afterwards.",
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
      question:
        "What does the second instruction read when the first has already written a result?",
      motivation:
        "Instructions use the state left by earlier instructions. The next example first adds into `w2`, then subtracts from that result.",
      prediction:
        "Start with `w0` holding 8, `w1` holding 3 and `w2` holding 0. Identify which register the first instruction writes. Which instruction will read that result?",
      investigation:
        "The marker ▸ shows which instruction runs next. The processor tracks that position in its **program counter**, a special register. Ordinary instructions do not name it the way they name `w0`. Run the two instructions one at a time.",
      construction:
        "After the first instruction, pause. Use the value now in `w2` as the second instruction's input. Do not return to its starting value.",
      failureExperiment:
        "Starting both instructions from the original register values would describe two separate examples. This figure runs a sequence: the second instruction uses the first instruction's result.",
      explanation:
        "The register values and the next-instruction position together describe this run. An arithmetic instruction updates its destination, then execution moves to the next instruction.",
      generalisation:
        "`ret` changes where execution continues by returning to the caller. The worked arithmetic example stops after its two shown instructions; it does not show a complete function.",
      challenge:
        "Trace the same sequence with fresh inputs. Keep the intermediate value in mind when you run the second instruction on paper.",
      reflection:
        "For each step, ask two questions: what did this instruction write, and which instruction runs next? The next lesson combines these mechanics in a complete function.",
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
    "You have practised addition, a function call and return, subtraction, and instructions in sequence. Now combine those mechanics.\n\nIf you arrived here directly, start with the earlier Fundamentals lessons:\n\n- [One addition](#/lesson/one-addition)\n- [A tiny function](#/lesson/tiny-function)\n- [Subtraction and reuse](#/lesson/subtraction-and-reuse)\n- [Instructions in sequence](#/lesson/instructions-in-sequence)",
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
