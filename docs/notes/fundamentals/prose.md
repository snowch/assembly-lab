# Fundamentals: canonical prose

Copyright © 2026 Christopher Snow

Drafted from the checked facts for the existing primitive programs and the recorded increment_int and add_ints listings. The fresh exercise calls are independently checked against GNU/QEMU. Each lesson has its own visible course-plan entry; each worked example remains visible within its lesson.

## One addition

### addition / sections / question

How does a processor add two values?

### addition / sections / motivation

A **register** is a small, fast store inside the processor. This course uses AArch64, Arm’s 64-bit mode. It has 31 general-purpose integer registers, used for ordinary calculations, named `x0` to `x30`. Other registers have special jobs.

An **instruction** tells the processor to perform an operation. Assembly language writes instructions with names such as `add`. The parts after the name are its **operands**.

**Memory** holds the program’s instructions and much more data than the registers can hold. For `add`, a value held in memory must first be brought into a register. A result can be written back.

### addition / sections / prediction

In `add w2, w0, w1`, the **inputs** are `w0` and `w1`: the instruction reads the values stored there. It adds those values and writes the result into `w2`. The register that receives the result is the **destination**, named first in this instruction.

### addition / sections / investigation

Press Run the instruction. The figure runs a **simulator** in your browser: a program that imitates the processor. The course calls it the model.

### addition / sections / construction

Read the result back through the instruction: which operand names the register that was written?

### addition / sections / failureExperiment

Did either input register lose its value when the instruction read it?

### addition / sections / explanation

Reading preserves the inputs. Only the destination is written.

### addition / sections / generalisation

The destination can be a different register. Apply the same operand rule below.

### addition / sections / challenge

Trace a new addition without running it.

### addition / figure / title

One addition

### addition / figure / prose

The diagram shows the input values and where the result will go. Run `add w2, w0, w1` once.

### addition / simulationNote / summary

What the simulator shows

### addition / simulationNote / prose

The simulator shows each instruction’s completed effect. Real processors can work on several instructions at once. For these examples, the required results are the same. The simulator does not show how long a processor takes.

### addition / registerViews / caption

Each x name selects all 64 bits; its matching w name selects the lower 32 bits of the same register.

### addition / registerViews / after

You will experiment with both names in [Constants and widths](#/lesson/constants-and-widths) in Module 1, under ‘Two names, one register’.

### addition / references / summary

Arm’s reference manuals

### addition / references / prose

- [Arm’s instruction reference](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/ADD--shifted-register---Add-optionally-shifted-register-) opens at the entry for `add`.
- The [architecture reference manual](https://developer.arm.com/documentation/ddi0487/latest/) describes the registers and wider processor rules.

Both references are free to read without an account. If an Arm ID sign-in panel opens, close it to read the documentation.

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

### addition labels / captions / figure

Press Run the instruction to see the result written to w2.

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

## Adding a constant

### constant / sections / motivation

The third operand of `add` can be a number written inside the instruction. That fixed number is a **constant**.

In `add w2, w0, 1`, the instruction reads `w0` and adds the constant 1. The first operand still names the destination, `w2`.

### constant / sections / investigation

The next example starts again with `w0` holding 7. In `add w0, w0, 1`, both appearances of `w0` name the same register. The instruction reads its old value before writing the result there.

### constant / sections / challenge

Arm calls a constant written inside an instruction an **immediate**. Any whole number from 0 to 4095, inclusive, fits the form of `add` used here. Larger constants may need a different form of `add` or extra instructions. See [Arm’s ADD (immediate) reference](https://developer.arm.com/documentation/ddi0602/2025-12/Base-Instructions/ADD--immediate---Add-immediate-value-).

Use a different constant and destination. Work out the result without running the instruction.

### constant / firstFigure / title

Add into w2

### constant / firstFigure / prose

Run `add w2, w0, 1` with the starting values shown.

### constant / figure / title

Add back into w0

### constant / figure / prose

Run `add w0, w0, 1`. This example starts afresh.

### constant / challenge / task

Before `add w1, w0, 3` runs, `w0` holds 10 and `w1` holds 0. What do `w1` and `w0` hold after this instruction?

### constant / challenge / hints / 1

A constant supplies its value directly; it does not name a register.

### constant / challenge / hints / 2

The 3 is an input value, not a register number. The first operand still names the destination.

### constant / challenge / hints / 3

In the worked example, `add w2, w0, 1` starts with 7 in `w0` and writes 8 to `w2`. The input `w0` keeps 7.

### constant / challenge / hints / 4

Add the value in `w0` to 3. Write the result to `w1`; `w0` is not written.

### constant / challenge / hints / 5

`w1` holds 13 and `w0` still holds 10.

### constant / originalityNote / textbookExample

A constant is often introduced while loading registers inside a complete program.

### constant / originalityNote / howThisDiffers

This lesson introduces a number inside an addition before the first function. Two independent examples show a separate destination and reuse of the input register. The exercise changes the constant and destination.

### constant labels / title

Adding a constant

### constant labels / objectives / 1

Identify a constant supplied by an instruction.

### constant labels / objectives / 2

Trace an addition that reads and writes the same register.

### constant labels / titles / motivation

A number in the instruction

### constant labels / titles / investigation

Read and replace w0

### constant labels / titles / challenge

Use a different constant

### constant labels / captions / firstFigure

An addition with a register input and a constant.

### constant labels / captions / figure

A separate addition that reads and writes w0.

### constant labels / captions / challenge

A fresh constant and destination to trace.

### constant labels / challenge / title

Follow the constant

### constant labels / challenge / fields / w1

`w1` after the instruction

### constant labels / challenge / fields / w0

`w0` after the instruction

### constant labels / challenge / tests / w1

w1 after the instruction

### constant labels / challenge / tests / w0

w0 after the instruction

## A tiny function

### function / sections / motivation

`increment_int` takes the integer input `n` and returns it increased by one. GCC, a compiler, translated the C below into an assembly **listing**, a written sequence of instructions. GCC 16.1.0 made these listings for 64-bit Arm using `-O1`, an optimisation setting that asks it to make code shorter and faster. `increment_int:` names the function.

Code that calls a function is its **caller**. The input it supplies is an **argument**. For this function, the argument arrives in `w0` and the integer result is left in `w0` too.

The function adds one, then `ret` returns to its caller. The next lesson follows execution back into the caller.

### function / sections / investigation

The simulator supplies the call and shows the caller waiting for the result. It omits the instructions that make the call.

Run the function one instruction at a time. Watch where the argument arrives and where the result is left. On a narrow screen, scroll sideways within the listing to see the C and instructions.

### function / sections / construction

`add_ints` takes two integer arguments. For this function, the first arrives in `w0` and the second in `w1`. The C names those inputs `a` and `b`.

The figure starts a separate call, `add_ints(7, 5)`. Its integer result is left in `w0`, just as for `increment_int`.

### function / sections / challenge

Trace `add_ints` with fresh arguments. Identify the result register and the input register that keeps its value.

### function / figure / title

One argument, one result

### function / figure / prose

Run the addition, then the return. Watch the value in `w0`.

### function / twoArgumentFigure / title

Two arguments, one result

### function / twoArgumentFigure / prose

Run the addition, then the return. Watch both registers.

### function / challenge / task

For `add_ints(6, 4)`, the arguments arrive in `w0` and `w1`, in that order. The function runs `add w0, w0, w1`, then `ret`. What do `w0` and `w1` hold when the function returns?

### function / challenge / hints / 0

Place each argument in its incoming register before tracing the addition.

### function / challenge / hints / 1

The first operand names the register written. Reading the other input does not replace it.

### function / challenge / hints / 2

In the worked call, `add_ints(7, 5)` leaves 12 in `w0` and keeps 5 in `w1`.

### function / challenge / hints / 3

Add the two fresh arguments into `w0`. The addition does not write `w1`.

### function / challenge / hints / 4

The function leaves 10 in `w0` and keeps 4 in `w1`.

### function / originalityNote / textbookExample

An introductory function example often combines several arithmetic operations or introduces call machinery immediately.

### function / originalityNote / howThisDiffers

Two small complete functions connect incoming arguments and an integer result to their registers. A fresh two-argument call checks the result and the preserved input before the next lesson follows execution back into the caller.

### function labels / title

A tiny function

### function labels / objectives / 0

Identify the registers holding one or two integer arguments.

### function labels / objectives / 1

Trace a function’s result and an input register that keeps its value.

### function labels / titles / motivation

A function and its listing

### function labels / titles / investigation

One argument

### function labels / titles / construction

Two arguments, one result

### function labels / titles / challenge

Fresh arguments

### function labels / captions / figure

The complete increment_int function, with its incoming argument and result.

### function labels / captions / twoArgumentFigure

The complete add_ints function, with its two incoming arguments and returned result.

### function labels / captions / challenge

A fresh call to add_ints, traced through both registers.

### function labels / challenge / title

Trace add_ints

### function labels / challenge / fields / w0

`w0` when the function returns

### function labels / challenge / fields / w1

`w1` when the function returns

### function labels / challenge / tests / w0

w0 when the function returns

### function labels / challenge / tests / w1

w1 when the function returns

## Subtraction and reuse

### subtraction / sections / question

Can an instruction read a register and replace its value?

### subtraction / sections / motivation

In `add w0, w0, w1`, both appearances of `w0` name the same register. The instruction reads its old value before writing the result there.

### subtraction / sections / prediction

Predict what the addition writes to `w0`, then run it.

### subtraction / sections / investigation

`sub` subtracts its third operand from its second, then writes its first operand. The next figure starts a separate example. Predict the result before running it.

### subtraction / sections / construction

In the subtraction, which old value was read before being replaced?

### subtraction / sections / failureExperiment

Would swapping the subtraction inputs give the same result?

### subtraction / sections / explanation

Repeating a register name does not create another register. Read its old value before replacing it.

### subtraction / sections / generalisation

Both instructions write their first operand. Subtraction keeps the input order: second minus third.

### subtraction / sections / challenge

Trace a fresh subtraction without running it.

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

What does the second instruction read after the first writes a result?

### sequence / sections / motivation

The next example adds into `w2`, then subtracts from that result.

### sequence / sections / prediction

Which register does the first instruction write? Which instruction will read that result?

### sequence / sections / investigation

The marker ▸ shows which instruction runs next. The processor tracks that position in its **program counter**, a special register. Ordinary instructions do not name it the way they name `w0`. Run the two instructions one at a time. This figure stops after the subtraction.

### sequence / sections / construction

After the addition, pause. Which value will the subtraction read from `w2`?

### sequence / sections / failureExperiment

Using the starting value of `w2` again would lose the addition's result.

### sequence / sections / explanation

An arithmetic instruction writes its destination, then execution moves to the next instruction. That instruction uses the values now in the registers.

### sequence / sections / challenge

Trace the sequence with fresh inputs. Use the first result when running the second instruction.

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

Values and position

### sequence labels / titles / challenge

Trace both instructions

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

This lesson combines mechanics already practised in the earlier Fundamentals lessons. Its trip calculation, operand-order repair and experiment removing a return connect those mechanics to complete compiler output.

## Course plan

### module / title

Fundamentals

### module / line

Learn one operation at a time, follow a function call, then combine the instructions.


### synthesis / listingNavigation

On a narrow screen, swipe sideways within the listing to move between the C and instructions.
