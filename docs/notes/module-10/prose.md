# Module 10: canonical prose

Separately drafted lesson and interface strings retained for review.

# Lesson 1: From C to instructions

## question

You have followed assembly made by GCC. Now you can edit a C calculation and inspect each instruction produced by the course's smaller compiler. **How does a local variable become a register value?**

`trip_charge` multiplies an unsigned distance by a rate, stores that product in the local variable `charge`, then adds a fixed charge of 7 to the returned result.

## questionNoteSummary

The compiler used in this figure

## questionNote

The initial listing comes from the course compiler, which runs in your browser. It accepts a deliberately small C subset and translates it with fixed instruction patterns. It does not optimise those patterns like GCC.

The lesson also retains GCC 16.1 output at `-O1` for comparison. The optional live comparison sends source to Compiler Explorer only when you press its button. Local compilation and the exercises do not need that service.

## motivation

The course compiler assigns registers to the parameters and local variables. In this function, distance uses `w0`, rate uses `w1`, and charge uses `w2`. Extra registers such as `w8` and `w9` hold intermediate working values. These are temporary values needed while evaluating an expression.

The generated instructions load inputs into working registers, perform the multiplication, and copy the product into the local variable's register. The return calculation adds the fixed charge and puts the answer in `w0`. Register 0 then holds the return value, not the original distance.

The compiler builds constants with `movz` and, when needed, `movk`. `movz` places a 16-bit immediate in a selected part of the destination and clears the other bits. `movk`, introduced in Module 1, replaces a selected part while keeping the other bits. For some constants, `mov` is a shorter way to write `movz`. Both forms produce the same instruction bit pattern for the processor. This compiler writes `movz` explicitly.

## prediction

The distance is 6 and the rate is 4. The function multiplies them, then adds its fixed charge of 7.

## predictionQuestion

**What does `trip_charge(6, 4)` return?**

## predictionExplain

It returns 31. The product is 24, stored as charge, and the return expression adds 7. Follow that value from the expression's working registers through the local variable and into `w0`.

## investigation

Compile the source locally, choose inputs, and run it. The C evaluator first checks the operations on that input. If it completes, the A64 simulator executes the generated listing. The interface compares their results and lets you step through the instructions.

The highlighted C line is the line associated with the current generated instruction. One C expression can produce several instructions, so the highlight can stay on the same source line as different registers change.

Try changing the fixed charge or adding an unsigned local variable. The statement editor and the text editor both change the same C source. A new compilation generates instructions from that source; the interface does not substitute a prepared animation.

## construction

Write the same calculation directly in assembly. Your instructions can be shorter than the course compiler's fixed sequence while producing the required result.

## writeTask

Write `trip_charge` in assembly. The unsigned distance arrives in `w0` and rate in `w1`. Return `distance * rate + 7` in `w0`, keeping the low 32 bits as unsigned arithmetic requires.

## writeHints

Multiply the distance by the rate before adding the fixed charge.

The multiplication and addition both have unsigned 32-bit wrapping results.

With distance 1 and rate 1, the product is 1. Adding the fixed charge of 7 gives 8.

After the multiplication, add 7 to `w0`, then return.

Write `mul w0, w0, w1`, `add w0, w0, #7` and `ret`.

## failureExperiment

The changed C function returns `charge` directly. It no longer adds the fixed charge. Its inputs are still distance 6 and rate 4.

## failureQuestion

**What does the changed function return?**

## failureExplain

It returns 24. The multiplication still calculates the distance-dependent charge, but the return expression no longer adds 7. Recompile the changed source and find which generated instructions have disappeared.

## explanation

The course compiler follows a fixed pattern for each supported expression and statement. That makes the translation inspectable, but it can produce moves and intermediate values that a more capable optimiser removes. Different instruction sequences can implement the same defined C calculation.

The C types control the arithmetic rules and the instruction choices. They do not remain as labels attached to the registers. For these unsigned variables, arithmetic keeps the low 32 bits. A later comparison tests that wrapped value.

The final function caps a charge at a limit. It first calculates the unsigned 32-bit product, then compares that result with the limit. It does not compare an unlimited mathematical product with the limit.

## generalisation

Compare compiler output by following the values and the paths that run. A shorter listing is not, by itself, evidence that every input behaves correctly or that execution is faster. Check the source rules and the defined input cases.

If you choose the GCC comparison, the page sends the current C source only after you press the button. It identifies Compiler Explorer, links its privacy policy and provides a link to the same source there. Cached responses avoid repeating a request for unchanged source and settings. If the request fails, local compilation still works.

GCC may use instructions outside the course compiler's teaching subset. You can inspect that recorded response without treating it as a program this simulator can necessarily execute.

## finalTask

Write `cap_charge` in C. Its unsigned parameters are `distance`, `rate` and `limit`. Calculate the unsigned 32-bit product of distance and rate. If that product exceeds the limit, replace it with the limit. Return the resulting charge.

The cap applies after unsigned wrapping. Declare and initialise any local variable before using it.

## finalHints

Calculate the product in an unsigned local variable.

Compare the stored, wrapped product with the limit. Do not compare the limit with distance or rate separately.

With distance 6 and rate 4, the product is 24. A limit of 20 reduces it to 20; a limit of 30 leaves it at 24.

Return the local variable after the if statement, so both paths return a result.

In the function body, write `unsigned charge = distance * rate;`, then `if (charge > limit) { charge = limit; }`, then `return charge;`.

## reflection

- The course compiler maps variables and intermediate values to registers.
- One source expression can produce several instructions.
- Compiling again reflects changes to the actual C source.
- Different instruction sequences can implement the same calculation.
- Unsigned wrapping occurs at the arithmetic operation, before a later cap.

Why can two compilers produce different assembly for this function without disagreeing about its result?

## reflectionNoteSummary

Answer

## reflectionNote

The C source specifies the result for each defined input, not one mandatory instruction sequence. The course compiler uses inspectable fixed patterns; GCC can transform those patterns while preserving the required behaviour.

## modelVsReality

This compiler handles one function with unsigned parameters, initialised unsigned locals and the supported arithmetic and control-flow statements. It supports at most eight declared variables in total, including parameters, and uses fixed register assignments. It has limits on source size, nesting and execution.

Each run evaluates the C operations before executing assembly. It rejects unsupported or unsafe executed operations rather than treating a machine result as proof that the C was valid. That check covers the tested path in this subset, not arbitrary C or every possible input.

## originalityNote

A compiler walkthrough that translates isolated arithmetic expressions by hand.

An editable trip charge connects named C variables to working registers, then asks the learner to write equivalent assembly and a C cap whose position after unsigned wrapping matters.

## Labels

From C to instructions

follow a C variable through generated register operations;

change C and inspect the resulting assembly;

write equivalent calculations in C and assembly.

How does a C variable become a register value?

Assign registers and build expressions

Calculate the trip charge

Edit C and follow the generated instructions

Write the charge directly in assembly

Remove part of the source calculation

Compare calculations, not just instruction counts

Inspect a second compiler deliberately

Cap the wrapped charge in C

What you now know

trip_charge and the listing generated by the course compiler.

Predict the trip charge before inspecting the run.

Edit the C, compile it locally and step through the generated assembly.

Implement the same trip charge directly in assembly.

Predict the result after removing the fixed charge.

Compile and run the changed return expression.

Write and test the capped charge in C.

24

31

7

24

31

6

Write trip_charge in assembly

Calculate the example charge

Charge only the fixed amount for zero distance

Calculate from unit inputs

Wrap when adding the fixed charge

Wrap a multiplication above 32 bits

Write cap_charge in C

Cap a charge above the limit

Keep a charge below the limit

Keep a zero charge

Cap a wrapped nonzero product

Compare the limit after a product wraps to zero

# Lesson 2: Compile a loop and follow its branches

## question

A C loop can add the same rate for each recorded interval. The processor needs instructions that test, update and repeat. **Which generated branch makes the C loop run again?**

`accumulated_charge` starts its total and counter at zero. While the counter is below the count, it adds the rate to the total, then increases the counter.

## questionNoteSummary

The source and the local compiler

## questionNote

The listing is generated by the course compiler from the displayed C. It uses the same unsigned subset and fixed instruction patterns as the previous lesson. The repository also retains GCC 16.1 output at `-O1` for this source.

All local runs have an execution limit. Reaching that limit means the run was not completed within the budget; it does not by itself prove that a loop can never finish.

## motivation

A `for` statement supplies an initialisation, a condition and an update. The compiler places instructions for these operations around the body. A backward branch returns to the condition so it can decide whether another iteration should run.

In this example, count and rate arrive in `w0` and `w1`. The compiler keeps total in `w2` and the counter in `w3`. Its working registers evaluate the comparison and addition. The final return copies the total into `w0`.

A single `for` line can correspond to several parts of the listing. Source highlighting identifies the associated line; it does not mean one C line runs as one instruction.

## prediction

The count is 3 and the rate is 4. The loop begins with a zero total and adds the rate once per iteration.

## predictionQuestion

**What does `accumulated_charge(3, 4)` return?**

## predictionExplain

It returns 12. Three iterations each add 4 to the total. Follow the counter's update and the comparison that prevents a fourth iteration.

## investigation

Run the compiled loop and find the initialisation, condition, body and update in the listing. Step over the backward branch to see which comparison runs next.

Try count zero. The condition must reject the first iteration, leaving the total at zero. Then change the count and rate, and compare how the total and counter evolve.

If a source edit introduces an invalid operation on an executed path, the C evaluator stops before the assembly runs. Read its diagnostic rather than treating an incomplete trace as a returned result.

## construction

Write the repeated addition directly in assembly. You may count remaining iterations down instead of reproducing the compiler's increasing counter.

## writeTask

Write `accumulated_charge` in assembly. `w0` holds an unsigned count and `w1` an unsigned rate. Add the rate to an initially zero total once for each counted iteration. Return the unsigned 32-bit total in `w0`.

A zero count must return zero. The tests include a total that wraps.

## writeHints

Keep the count somewhere safe before making `w0` the total.

Start the total at zero and check the zero-count case before the body.

With count 1 and rate 9, the loop adds 9 to the zero total once, then returns 9.

Decrease the remaining count after the addition, and branch back while it is nonzero.

One complete solution is:

```asm
mov w2, w0
mov w0, #0
cbz w2, done
loop:
add w0, w0, w1
subs w2, w2, #1
b.ne loop
done:
ret
```

## failureExperiment

The changed C loop uses `i <= count` where it previously used `i < count`. The count is still 3 and the rate is 4.

## failureQuestion

**What does the changed function return?**

## failureExplain

It returns 16. The counter values 0, 1, 2 and 3 all satisfy the changed condition, so the body runs four times. The original loop stopped before the counter reached 3.

With count zero, the changed loop would still run once. The extra equality case changes both the ordinary run and the empty case.

## explanation

The loop boundary describes which counter values belong in the calculation. Starting at zero and using `< count` gives count iterations. Including equality adds the endpoint as another iteration.

An unsigned counter also has a maximum value. When the input count equals that maximum, every possible value of `i` satisfies `i <= count`. After the counter reaches the maximum, its next increment wraps it back to zero, so the loop keeps repeating.

The local evaluator would stop such a run at its budget. That budget is a tool limit. The reason this loop fails to finish comes from its always-true condition and wrapping counter, not merely from seeing the budget message.

## generalisation

Trace a loop from its initial state through its condition, body and update. Check the empty case and the boundary where repetition should stop. A loop that works for one small input can still fail at a type limit.

The final function repeats a one-bit right shift. Repeating that operation is different from making one shift whose count is the number of iterations. Every individual shift by one has a valid count, including when the loop runs 32 times. A single 32-bit C shift by 32 would be invalid.

Use the remaining count to control repetition. Decreasing it on each nonzero iteration gives the loop a route to zero.

## finalTask

Write `course_while` in C with unsigned parameters `value` and `count`. While count is nonzero, shift value right by one place and decrease count by one. Return value after the loop.

A zero count returns the original value. Use repeated single-place shifts, so a count of 32 is handled by 32 valid shifts rather than one invalid shift.

## finalHints

Use a while loop whose condition checks that count is nonzero.

Do not shift just once or leave count unchanged. Each loop iteration must shift value and decrease count.

With count zero, return the original value: value 128 stays 128. The loop condition must skip the first shift.

Put the return after the loop, so it also handles an initially zero count.

Write `while (count != 0) { value = value >> 1; count--; }`, followed by `return value;`.

## reflection

- A compiled loop has instructions for its condition, body and update.
- A backward branch connects one iteration to the next condition test.
- Source lines and instructions do not have a one-to-one relationship.
- Check both zero iterations and the final permitted counter value.
- Repeated valid operations need not equal one operation with a larger operand.

Why can shifting right by one 32 times be valid C when shifting a 32-bit value right by 32 once is not?

## reflectionNoteSummary

Answer

## reflectionNote

The C shift-count rule applies to each operation. Every repeated shift has count one, which is below the value's 32-bit width. The single shift has count 32, which is outside the permitted range.

## modelVsReality

The course compiler generates and runs a limited unsigned C language. The evaluator checks operations on the selected execution path and imposes a step budget before the A64 run. A successful run is evidence for those inputs, not a proof of termination or correctness for every input.

The compiler uses fixed register assignments and bounded source and expression sizes. It does not model the full language or reproduce GCC's optimisation choices.

## originalityNote

A loop compiled once into a static listing with no editable source.

A repeated trip charge exposes the generated condition and backward branch, then a boundary edit changes both ordinary and empty runs. The final dimming function distinguishes repeated valid shifts from one invalid large shift.

## Labels

Compile a loop and follow its branches

identify a loop’s condition, body and update in generated assembly;

check how a boundary edit changes the number of iterations;

write a C loop whose repeated operations stay within their rules.

Which branch repeats the C loop?

Place the condition around the body

Add the rate for each interval

Step from the body back to the condition

Write repeated addition in assembly

Include one counter value too many

Read the boundary with the counter’s range

Check the empty case and each operation

Write repeated shifts in C

What you now know

accumulated_charge and the course compiler’s generated loop.

Predict the total before running the loop.

Edit the loop and follow its generated branches.

Write a repeated-addition loop directly in assembly.

Predict the total after changing < to <=.

Compile and inspect the loop with the changed boundary.

Write and test a C loop that shifts one place at a time.

16

12

4

16

12

0

Write accumulated_charge in assembly

Perform no additions for zero count

Add the rate once

Add the example rate three times

Wrap the unsigned total

Repeat a zero rate

Write course_while in C

Shift 128 three times

Preserve the value for zero count

Keep zero while counting down

Handle 32 separate shifts

Shift an input with its top bit set

# Figure interface

Edit C text

Build C from statements

C source

Source lines

No source lines yet. Add a function and its statements.

Add line

Remove line

Move line up

Move line down

Replacement statement

Selecting a line loads it into these controls when they can represent it. Check the replacement preview before replacing the line.

Replacement preview

This line cannot be loaded into the statement controls. Use Edit C text, or choose a statement type to build a replacement.

Variable to assign

Left value

Right value

Operation

Number

Clear number

Replace selected line

Add statement

Use the entered number

Use one value

Start a function

Declare and initialise a variable

Assign a value

Return a value

Start an if statement

Start the else branch

Start a while loop

Start a for loop

Close a block

Compile C

Run with these inputs

Function inputs

Choose inputs and run the compiled function.

The C evaluator stopped before running the assembly. Read the diagnostic below.

Compiler and evaluator diagnostics

The C this compiler accepts

Write one function returning unsigned, with unsigned parameters and initialised unsigned local variables. You can use arithmetic, bitwise operations, comparisons, shifts, assignments, if/else, while and for. Calls, pointers, arrays and signed declarations are outside this subset. The compiler also limits source size and nesting. A successful compilation does not prove every input safe; each run checks its C operations before the assembly executes.

Restore the original C

Compare with GCC

Pressing Compare with GCC sends this C source to Compiler Explorer’s public service. The lesson works without sending it.

Compiler Explorer privacy policy

Compiler output provided by Compiler Explorer.

Open this C in Compiler Explorer

Waiting for Compiler Explorer…

Compiler Explorer could not return a listing. Your local compiler and exercises are still available.

GCC comparison needs a network connection. The local compiler and exercises work offline.

Showing the saved compiler response for this source and these settings.

Recorded GCC response

Course compiler assembly

Enter one whole unsigned 32-bit value for each parameter.

The assembly did not complete with the result calculated by the C evaluator. Check the reported run before using its result.

Write a C function before running the tests.

The C did not compile. Read the diagnostic and check the supported syntax.

The C evaluator could not complete this test safely. Read its diagnostic before changing the code.

The function returned a different value from the one required by this test.

Returned value

Required value

Line {line}: {source}

Input {name}

Compiled to 1 assembly line.

Compiled to 2 assembly lines.

The C evaluator and A64 simulator both return {value}.

Line {line}, column {column}: {message}
