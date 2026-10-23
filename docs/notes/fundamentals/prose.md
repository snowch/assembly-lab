# Fundamentals: canonical prose

Copyright © 2026 Christopher Snow

Drafted from the checked facts for the existing primitive programs and the recorded increment_int listing. The four fresh exercise calls are independently checked against GNU/QEMU. Each lesson has its own visible course-plan entry; each worked example remains visible within its lesson.

## One addition

### addition / sections / question

How does a processor add two values? Start with one instruction and watch where its result goes.

### addition / sections / motivation

A **register** is a small store inside the processor that holds a value. The names `w0`, `w1` and `w2` select 32 bits of three registers. Module 1 shows the rest of each register.

An **instruction** tells the processor to perform an operation. Assembly language writes instructions with names such as `add`. The parts after the name are its **operands**.

### addition / sections / prediction

In `add w2, w0, w1`, the first operand names the register written. The instruction adds the values supplied by the second and third operands. Before running it, point to the two inputs and the destination.

### addition / sections / investigation

The figure starts with `w0` holding 12, `w1` holding 7 and `w2` holding 0. Press Run the instruction. Compare the inputs with the result.

The figure runs a simulator in your browser. The simulator imitates the processor; the course calls it the model.

### addition / sections / construction

Read the instruction from left to right: add, write `w2`, read `w0`, read `w1`. The destination tells you where to put the sum.

### addition / sections / failureExperiment

Reading a register does not empty it. Check the two input registers after the instruction: did either lose its value?

### addition / sections / explanation

This addition reads its inputs and writes its destination. The other registers keep their values.

### addition / sections / generalisation

The first operand can name a different destination. Use that rule in the new example below; its inputs differ from the figure above.

### addition / sections / challenge

Work out the result of one addition without running it. Give the value written and the value of an input register afterwards.

### addition / sections / reflection

When you read an `add`, identify its destination before calculating. Which operands supply the values, and which operand names the register written?

### addition / figure / title

One addition

### addition / figure / prose

Run `add w2, w0, w1` once to see what it reads and writes.

### addition / challenge / task

Before `add w1, w0, w2` runs, `w0` holds 14, `w1` holds 0 and `w2` holds 5. What do `w1` and `w0` hold after this instruction?

### addition / challenge / hints 1

The first operand names the register written.

### addition / challenge / hints 2

Use the starting values of the second and third operands for the addition.

### addition / challenge / hints 3

In the worked addition, 12 plus 7 writes 19 to `w2`. The input registers keep 12 and 7.

### addition / challenge / hints 4

This instruction reads `w0` and `w2`. It writes `w1`; it does not write `w0`.

### addition / challenge / hints 5

`w1` holds 19 and `w0` still holds 14.

### addition / modelVsReality

The figure runs one instruction and shows its effect on the selected registers. It leaves out the surrounding program. A real processor runs instructions as part of a program; the next lessons build up that context.

### addition / originalityNote / textbookExample

A first assembly example often loads constants and adds them inside a complete program.

### addition / originalityNote / howThisDiffers

This lesson begins with visible starting registers and isolates one addition. Its exercise changes the destination and checks that reading an input preserves it.

### addition labels / title

One addition

### addition labels / objectives 1

Identify an addition's inputs and destination.

### addition labels / objectives 2

Work out which register an addition writes and which registers keep their values.

### addition labels / titles / question

One operation

### addition labels / titles / motivation

Registers and instructions

### addition labels / titles / prediction

Reading add

### addition labels / titles / investigation

Run one addition

### addition labels / titles / construction

Identify the destination

### addition labels / titles / failureExperiment

Reading keeps the input

### addition labels / titles / explanation

Inputs and result

### addition labels / titles / generalisation

A different destination

### addition labels / titles / challenge

Trace a new addition

### addition labels / titles / reflection

Read before calculating

### addition labels / captions / figure

One addition with its starting inputs and result.

### addition labels / captions / challenge

A new addition to trace without running it.

### addition labels / challenge / title

Follow the operands

### addition labels / challenge / fields / w1

`w1` after the instruction

### addition labels / challenge / fields / w0

`w0` after the instruction

### addition labels / challenge / tests / w1

w1 after the instruction

### addition labels / challenge / tests / w0

w0 after the instruction

## A tiny function

### function / sections / question

How does an addition become the result of a function call? Follow a function that increases its input by one.

### function / sections / motivation

`increment_int` takes the integer input `n` and returns it increased by one. GCC, a compiler, translated the C below into an assembly **listing**, a written sequence of instructions. `increment_int:` names the function.

Code that calls a function is its **caller**. The input it supplies is an **argument**. For this function, the argument arrives in `w0` and the integer result is left in `w0` too.

### function / sections / prediction

In `add w0, w0, 1`, the last operand is the number one written inside the instruction. The instruction reads the incoming `w0` and writes the increased value back there. What still needs to happen before the caller can continue?

### function / sections / investigation

Follow `increment_int(7)` below. Run `add` to prepare the result, then run `ret` to return to the caller. Use Show instructions or Show C to move across the paired listing on a narrow screen.

### function / sections / construction

Follow the value through the call: the caller supplies the argument, the function calculates in `w0`, and the caller receives the value left there when the function returns.

### function / sections / failureExperiment

Look back at the state after the addition: the result was ready in `w0`, while the caller was still waiting. Running `ret` let the caller continue with that result.

### function / sections / explanation

`ret` returns to the code that called the function. It does not calculate or move the result. The caller uses the value already in `w0`.

### function / sections / generalisation

This placement of an integer argument and result is a rule for calling these functions. It is separate from the operand rule: `add` still writes the register named by its first operand.

### function / sections / challenge

Now follow the same function with a different argument. Calculate the value it returns without running this call.

### function / sections / reflection

Describe the two jobs separately: what does the addition do, and what does `ret` do?

### function / figure / title

A call and its return

### function / figure / prose

Step through `increment_int(7)`. The caller waits until `ret` runs.

### function / challenge / task

For `increment_int(0)`, the argument arrives in `w0`. The function runs `add w0, w0, 1`, then `ret`. What value does the caller receive?

### function / challenge / hints 1

Follow the addition before considering the return.

### function / challenge / hints 2

The last operand of `add w0, w0, 1` is a number, not another register.

### function / challenge / hints 3

For `increment_int(7)`, the addition writes 8 to `w0`. Then `ret` returns without changing that value.

### function / challenge / hints 4

Start with the new argument in `w0`. Add one; `ret` leaves that result in place.

### function / challenge / hints 5

The caller receives 1.

### function / modelVsReality

The simulator supplies the call and shows the caller waiting for the result. It omits the instructions that make the call. Later lessons examine calls in more detail. GCC 16.1.0 made this recorded listing for 64-bit Arm using `-O1`, an optimisation setting that asks it to make code shorter and faster.

### function / originalityNote / textbookExample

An introductory function example often combines several arithmetic operations or introduces call machinery immediately.

### function / originalityNote / howThisDiffers

This complete function adds one to a single input. The figure separates preparing its result from returning it, before the course combines more operations.

### function labels / title

A tiny function

### function labels / objectives 1

Follow an integer argument into a function and its result back to the caller.

### function labels / objectives 2

Explain how preparing a result differs from returning to the caller.

### function labels / titles / question

Return an increased value

### function labels / titles / motivation

A function and its listing

### function labels / titles / prediction

Preparing the result

### function labels / titles / investigation

Follow the call

### function labels / titles / construction

Argument to result

### function labels / titles / failureExperiment

Ready to return

### function labels / titles / explanation

What ret does

### function labels / titles / generalisation

Calling rules and operand rules

### function labels / titles / challenge

A different argument

### function labels / titles / reflection

Calculation and return

### function labels / captions / figure

The complete increment_int function and its caller, one instruction at a time.

### function labels / captions / challenge

The same function called with a new argument.

### function labels / challenge / title

Trace increment_int

### function labels / challenge / fields / w0

Value received by the caller

### function labels / challenge / tests / w0

Value received by the caller

## Subtraction and reuse

### subtraction / sections / question

Can an instruction read a register and replace its value? What changes when the operation is subtraction?

### subtraction / sections / motivation

A destination can also supply an input. The instruction reads the old input values before writing its result. In `add w0, w0, w1`, both appearances of `w0` name the same register.

### subtraction / sections / prediction

The first figure starts with `w0` holding 9 and `w1` holding 4. Predict the value written to `w0`, then run the addition.

### subtraction / sections / investigation

The subtraction figure starts a separate example: `w0` holds 20 and `w1` holds 6. `sub` subtracts its third operand from its second, then writes the register named by its first operand. Predict the result before running it.

### subtraction / sections / construction

Read `sub w1, w0, w1` as: write `w1` with the old value in `w0` minus the old value in `w1`.

### subtraction / sections / failureExperiment

Swapping subtraction's inputs changes the calculation. Check their order in the instruction before deciding which value to subtract.

### subtraction / sections / explanation

Repeating a register name does not create another register. An input can be read and then overwritten by the result of the same instruction.

### subtraction / sections / generalisation

For both `add` and `sub`, the first operand names the destination. For `sub`, keep the order of the remaining operands: second minus third.

### subtraction / sections / challenge

Use the subtraction rule with fresh inputs below. Track the register written and a register only read.

### subtraction / sections / reflection

When a register appears twice, distinguish its old input value from the result written afterwards.

### subtraction / figure / title

Read and replace

### subtraction / figure / prose

Run `add w0, w0, w1` with the starting values shown.

### subtraction / secondFigure / title

Subtract in order

### subtraction / secondFigure / prose

This example starts afresh. Predict what `sub w1, w0, w1` writes.

### subtraction / challenge / task

Before `sub w1, w0, w1` runs, `w0` holds 18 and `w1` holds 5. What do `w1` and `w0` hold after this instruction?

### subtraction / challenge / hints 1

First identify the destination.

### subtraction / challenge / hints 2

Subtract the third operand's old value from the second operand's old value.

### subtraction / challenge / hints 3

In the worked subtraction, 20 minus 6 writes 14 to `w1`. The instruction reads the old 6 before replacing it.

### subtraction / challenge / hints 4

The calculation uses 18 minus 5. Only `w1` is written.

### subtraction / challenge / hints 5

`w1` holds 13 and `w0` still holds 18.

### subtraction / modelVsReality

Each figure starts with its own inputs and runs one arithmetic instruction. The figures do not pass values to each other. The simulator reads the old values before writing the destination, as these instructions require.

### subtraction / originalityNote / textbookExample

Subtraction is often introduced as another instruction in a longer arithmetic program.

### subtraction / originalityNote / howThisDiffers

Two separate examples first establish read-before-write, then apply it to operand order in subtraction. A fresh-input exercise checks both the result and the untouched input.

### subtraction labels / title

Subtraction and reuse

### subtraction labels / objectives 1

Trace an instruction that reads and writes the same register.

### subtraction labels / objectives 2

Subtract the third operand from the second and identify the destination.

### subtraction labels / titles / question

Read, then replace

### subtraction labels / titles / motivation

One register in two roles

### subtraction labels / titles / prediction

Reuse in addition

### subtraction labels / titles / investigation

Subtraction

### subtraction labels / titles / construction

Read the subtraction

### subtraction labels / titles / failureExperiment

Input order matters

### subtraction labels / titles / explanation

Old value and new value

### subtraction labels / titles / generalisation

The shared operand rule

### subtraction labels / titles / challenge

Subtract with new inputs

### subtraction labels / titles / reflection

Track the old value

### subtraction labels / captions / figure

An addition that reads w0 and writes its result there.

### subtraction labels / captions / secondFigure

A separate subtraction with its own starting inputs.

### subtraction labels / captions / challenge

A fresh subtraction to trace without running it.

### subtraction labels / challenge / title

Follow the subtraction

### subtraction labels / challenge / fields / w1

`w1` after the instruction

### subtraction labels / challenge / fields / w0

`w0` after the instruction

### subtraction labels / challenge / tests / w1

w1 after the instruction

### subtraction labels / challenge / tests / w0

w0 after the instruction

## Instructions in sequence

### sequence / sections / question

What does the second instruction read when the first has already written a result?

### sequence / sections / motivation

Instructions use the state left by earlier instructions. The next example first adds into `w2`, then subtracts from that result.

### sequence / sections / prediction

Start with `w0` holding 8, `w1` holding 3 and `w2` holding 0. Identify which register the first instruction writes. Which instruction will read that result?

### sequence / sections / investigation

The marker ▸ shows which instruction runs next. The processor tracks that position in its **program counter**, a special register. Ordinary instructions do not name it the way they name `w0`. Run the two instructions one at a time.

### sequence / sections / construction

After the first instruction, pause. Use the value now in `w2` as the second instruction's input. Do not return to its starting value.

### sequence / sections / failureExperiment

Starting both instructions from the original register values would describe two separate examples. This figure runs a sequence: the second instruction uses the first instruction's result.

### sequence / sections / explanation

The register values and the next-instruction position together describe this run. An arithmetic instruction updates its destination, then execution moves to the next instruction.

### sequence / sections / generalisation

`ret` changes where execution continues by returning to the caller. The worked arithmetic example stops after its two shown instructions; it does not show a complete function.

### sequence / sections / challenge

Trace the same sequence with fresh inputs. Keep the intermediate value in mind when you run the second instruction on paper.

### sequence / sections / reflection

For each step, ask two questions: what did this instruction write, and which instruction runs next? The next lesson combines these mechanics in a complete function.

### sequence / figure / title

Two instructions

### sequence / figure / prose

Run the addition, then the subtraction. The second uses the state left by the first.

### sequence / challenge / task

Start with `w0` holding 10, `w1` holding 4 and `w2` holding 0. Run `add w2, w0, w1`, then `sub w2, w2, w1`, in that order. What do `w2` and `w1` hold after both instructions?

### sequence / challenge / hints 1

Write down the registers after the first instruction before tracing the second.

### sequence / challenge / hints 2

The subtraction reads the value the addition left in `w2`.

### sequence / challenge / hints 3

In the worked sequence, 8 plus 3 writes 11 to `w2`. Then 11 minus 3 writes 8 to `w2`.

### sequence / challenge / hints 4

Both instructions write `w2`. Neither writes `w1`.

### sequence / challenge / hints 5

After both instructions, `w2` holds 10 and `w1` still holds 4.

### sequence / modelVsReality

The figure runs one instruction per step and stops after the two shown arithmetic instructions. A real processor can work on several instructions at once, but must preserve the results required by their order for this example.

### sequence / originalityNote / textbookExample

An instruction sequence is often introduced through a complete multi-operation function.

### sequence / originalityNote / howThisDiffers

This two-instruction sequence makes the second operation consume the first result. A separate fresh-input trace checks that the learner carries state forward before meeting the trip function.

### sequence labels / title

Instructions in sequence

### sequence labels / objectives 1

Follow register values from one instruction to the next.

### sequence labels / objectives 2

Explain what the next-instruction marker represents.

### sequence labels / titles / question

Use the previous result

### sequence labels / titles / motivation

One changing state

### sequence labels / titles / prediction

Find the connection

### sequence labels / titles / investigation

Follow the marker

### sequence labels / titles / construction

Pause between instructions

### sequence labels / titles / failureExperiment

Keep the intermediate result

### sequence labels / titles / explanation

Values and position

### sequence labels / titles / generalisation

Continue or return

### sequence labels / titles / challenge

Trace both instructions

### sequence labels / titles / reflection

Follow the state

### sequence labels / captions / figure

Two instructions sharing one set of registers.

### sequence labels / captions / challenge

The same sequence with fresh starting values.

### sequence labels / challenge / title

Use the previous result

### sequence labels / challenge / fields / w2

`w2` after both instructions

### sequence labels / challenge / fields / w1

`w1` after both instructions

### sequence labels / challenge / tests / w2

w2 after both instructions

### sequence labels / challenge / tests / w1

w1 after both instructions

## Synthesis bridge

### synthesis / title

Putting it together

### synthesis / question

How do individual instructions perform a complete C function? Follow a trip calculation, then repair another function.

### synthesis / motivation

You have practised addition, a function call and return, subtraction, and instructions in sequence. Now combine those mechanics.

If you arrived here directly, start with the earlier Fundamentals lessons:

- [One addition](#/lesson/one-addition)
- [A tiny function](#/lesson/tiny-function)
- [Subtraction and reuse](#/lesson/subtraction-and-reuse)
- [Instructions in sequence](#/lesson/instructions-in-sequence)

### synthesis / motivationTitle

From instructions to a function

### synthesis / objectives 1

Trace a complete compiled function using the operand rules.

### synthesis / objectives 2

Connect C arguments and results to the registers that hold them.

### synthesis / objectives 3

Repair a subtraction whose inputs are reversed.

### synthesis / objectives 4

Explain what happens when a function's `ret` is removed.

### synthesis / originalityNote / textbookExample

A first assembly program often combines loading constants, arithmetic and output before the individual mechanics are established.

### synthesis / originalityNote / howThisDiffers

This lesson combines mechanics already practised in four visible Fundamentals lessons. Its trip calculation, operand-order repair and experiment removing a return connect those mechanics to complete compiler output.

## Course plan

### module / title

Fundamentals

### module / line

Learn one operation at a time, follow a function call, then combine the instructions.


### synthesis / listingNavigation

On a narrow screen, swipe sideways within the listing to move between the C and instructions.
