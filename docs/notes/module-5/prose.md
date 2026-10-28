# Module 5: Loops (lesson text)

Drafted in a separate Codex session from the checked compiler listings and simulator results on 17 October 2026. The drafting session used its inherited model and effort settings. Sources and compiler records are in `listings.md`; independent review and validation are recorded separately.

This file contains the learner-facing prose, hints and labels word for word. Headings that identify a passage are editorial markers.

# Lesson 1: Counting up, and the branch backwards

## 0. Objectives

- follow a loop and distinguish iterations from instructions;
- explain why the first test can skip the loop body;
- write a counting loop that handles equal and descending endpoints.

## 1. How do instructions repeat?

The trip computer dims its dashboard after each idle tick. In this example, each tick halves an unsigned brightness setting and drops any remainder. This is a chosen dimming rule, not a description of display hardware.

`dim_up` applies that rule for each tick from `start` up to, but not including, `end`. `brightness >>= 1` means `brightness = brightness >> 1`. The C below repeats that operation with a `for` loop.

**How can a fixed set of instructions repeat the dimming operation a different number of times for different inputs?**

*Closed note: Which compiler?*

GCC 16.1 with `-O1`, as in Module 0.

*End of closed note.*

## 2. The body, the test and the next tick

A **loop** repeats part of a program while a condition holds. The repeated part is its **body**. Each execution of that body is one **iteration**. Here, the body halves `brightness`.

The `for` first sets `tick` to `start`. It tests `tick < end` before running the body. After the body, `tick++` adds 1 to `tick`. It repeats the test before each later iteration. If the first test is false, the body never runs.

These endpoints use ordinary unsigned ordering. They do not describe elapsed time across a counter wrap: if `start` is at or above `end`, there is no dimming to do.

## 3. Count the instructions in a loop

The stepper runs `dim_up(128, 2, 5)` on GCC's listing. Count only the instructions that execute, including `ret`.

These counts measure executed instructions, not elapsed time. A **trace** records the instructions that ran. The simulator limits its length; reaching that limit does not establish whether the function would eventually return.

**How many instructions run before the function returns?**

*After committing the prediction:*

The run executes 15 instructions. The first `cmp` and `bcs` run once. Then the four instructions under `.L3` run three times, as `tick` advances from 2 to 5. Finally, `ret` runs.

The brightness changes from 128 to 64, then 32, then 16. Each `lsr` writes the next brightness back to `w0`.

## 4. Follow the branch backwards

`brightness` arrives in `w0`, `start` in `w1` and `end` in `w2`. `w1` then holds the changing value of `tick`.

The first `cmp` compares `start` with `end`. `bcs .L2` goes straight to `ret` when `start` is at or above `end`, using the unsigned condition `cs`. This first test prevents an unwanted iteration.

When `start` is below `end`, execution reaches `.L3`. `lsr` halves the brightness in `w0`. `add` advances the tick in `w1`. `cmp` then tests whether the tick has reached `end`.

`bne .L3` goes backwards to the same `lsr` when the tick and `end` are unequal. That branch runs the body again. When they are equal, the branch is not taken and `ret` follows.

Choose different endpoints in the figure. Its bar counts executions of the dimming operation. The stepper counts every instruction, including the tests and branches.

## 5. Write the dimming loop

Build the same dimming function from instructions you already know. The first test matters as much as the branch that repeats the body.

### Write dim_up

Write `dim_up(brightness, start, end)`. All arguments are unsigned. For each tick from `start` up to, but not including, `end`, halve the brightness and drop any remainder. Return the final brightness. If `start` is at or above `end`, return the original brightness.

`brightness` arrives in `w0`, `start` in `w1`, and `end` in `w2`. Return the result in `w0`. Use `cmp`, branches, `lsr`, `add` and `ret`.

The tests include equal and descending endpoints, and an interval that ends at the largest unsigned value.

*Hints, in order:*

- Decide whether any work is needed before the first shift.
- A signed comparison can put large unsigned endpoints in the wrong order. Forgetting equality also runs the body when no ticks were requested.
- In the first iteration of `dim_up(128, 2, 5)`, the shift changes brightness from 128 to 64. The increment changes the tick from 2 to 3.
- Put a label before the shift. After advancing the tick, test whether another iteration is needed and branch back to that label.
- Use `cmp w1, w2` and `b.cs done` before `again:`. Under `again:`, put `lsr w0, w0, #1`, `add w1, w1, #1`, `cmp w1, w2` and `b.cc again`. Under `done:`, put `ret`.

## 6. Changing bne to beq

The program below has its backward branch changed from `bne .L3` to `beq .L3`. The other instructions are unchanged. Predict its result for `dim_up(128, 2, 5)`.

**What brightness does the changed function return?**

*After committing the prediction:*

The changed function returns 64 after one iteration and seven instructions. The first shift changes the brightness from 128 to 64. The increment changes the tick from 2 to 3.

The tick is not yet equal to `end`, which is 5. The new `beq` is therefore not taken, and execution reaches `ret`. The original `bne` would have repeated the body.

## 7. Why the last test asks about equality

GCC uses different comparisons at the beginning and end of this loop. The first asks whether `start` is at or above `end`. The later comparison asks only whether `tick` equals `end`.

Once the first test admits the run, `tick` starts below `end` and increases by 1. It must reach `end`; it cannot skip over it. That is why testing for inequality is enough at the bottom of this loop.

The last increment changes `end - 1` to `end`. Even when `end` is the largest unsigned value, the increment does not wrap. The loop stops before another increment could do so.

The order of the operands in the final `cmp` does not change whether they are equal. It would matter for a condition that asks which value is larger.

## 8. Find what changes and what stops the loop

A branch can go to an earlier instruction just as it can go to a later one. Returning to an earlier instruction lets a small listing do repeated work.

To understand a loop, first check whether it tests before the first iteration. Find the instructions that do the work and the change that lets the loop stop. Then follow the branch that decides whether to repeat.

## 9. Count three runs

### Count three runs of dim_up

For GCC's original `dim_up` listing, give the returned brightness and the number of instructions that run for each call: `dim_up(128, 7, 7)`, `dim_up(128, 7, 8)` and `dim_up(128, 7, 9)`. Enter decimal numbers.

Count every executed instruction, including `ret`. Do not count labels.

*Hints, in order:*

- Work out how many times the body runs for each pair of endpoints.
- Skipping the body does not mean skipping every instruction. The initial `cmp` and `bcs` still run.
- For the equal endpoints in `dim_up(128, 7, 7)`, follow the initial `cmp` and `bcs` straight to `ret`. There is no iteration to count.
- Every call also runs `ret`. Add those instructions to the instructions from the iterations.
- The results and instruction counts are 128 and 3; 64 and 7; 32 and 11.

*Feedback:*

Follow the initial test first. Count each instruction that runs, including every branch and `ret`.

## 10. What you now know

- A loop repeats its body. Each execution of the body is one iteration.
- A branch to an earlier instruction can repeat the same work.
- A test before the body can skip all iterations.
- The count of iterations differs from the count of instructions.


## Figure captions and labels

dim_up in C and the instructions GCC made from it.

Predict the number of instructions run by dim_up(128, 2, 5).

Follow dim_up(128, 2, 5) one instruction at a time.

Choose endpoints and see how many dimming operations run and the brightness after each one.

Write and test your counting loop.

Predict the result after changing the backward bne to beq.

See how many dimming operations the changed loop runs and the brightness after each one.

Give a result and an instruction count for each call.

dim_up(128, 2, 5)

dim_up(128, 5, 5)

dim_up(128, 5, 2)

15

7

12

3

16

64

128

0

dim_up(128, 2, 5)

dim_up(128, 5, 5)

dim_up(128, 5, 2)

dim_up(128, 0, 1)

dim_up(0xffffffff, 0, 31)

dim_up(128, 0xfffffffc, 0xffffffff)

dim_up(128, 2147483646, 2147483649)

`dim_up(128, 7, 7)`

`dim_up(128, 7, 8)`

`dim_up(128, 7, 9)`

`dim_up(128, 7, 7)` returns

instructions run for `dim_up(128, 7, 7)`

`dim_up(128, 7, 8)` returns

instructions run for `dim_up(128, 7, 8)`

`dim_up(128, 7, 9)` returns

instructions run for `dim_up(128, 7, 9)`

## Originality record

Adding consecutive integers or computing a factorial with a counting loop.

A dashboard brightness setting is halved for an interval of idle ticks. The learner follows repeated shifts and handles empty, descending and boundary intervals.

# Lesson 2: Counting down, and knowing when to stop

## 0. Objectives

- use the flags from subtraction to control a countdown;
- explain what changes when the loop tests after its body;
- write a loop that stops when no useful work remains.

## 1. Where does the loop get its flags?

The dashboard's dimming rule is still to halve an unsigned brightness setting at each idle tick, dropping any remainder. This time, the function receives the number of ticks to apply.

`dim_down` reduces `ticks` after each dimming operation. The C uses `while (ticks != 0)` to repeat until no ticks remain. `ticks--` subtracts 1 from `ticks`.

GCC uses `subs` and `bne` at the bottom of this loop. There is no separate `cmp`. **Where does the branch get its flags?**

*Closed note: Which compiler?*

GCC 16.1 with `-O1`, as in Module 0.

*End of closed note.*

## 2. Counting down to zero

Counting down makes the stopping value zero. Subtracting already tells the processor whether the result is zero: `subs` writes the result and updates Z. Z is 1 when the result is zero, and 0 otherwise. A later branch can use that flag.

The function must also handle a count that starts at zero. No dimming is needed in that case. The first instruction, `cbz w1, .L2`, skips the body and reaches `ret`.

## 3. Count the dimming operations

The figure runs `dim_down(128, 3)` on GCC's listing.

**How many times does the dimming operation run before the function returns?**

*After committing the prediction:*

The dimming operation runs three times. The remaining tick count falls from 3 to 2, then 1, then 0. The brightness falls from 128 to 64, then 32, then 16.

The final `subs` produces zero, so it sets Z to 1. `bne` is then not taken, and `ret` returns 16.

## 4. Let subs test the remaining count

`brightness` arrives in `w0`, and `ticks` arrives in `w1`. `cbz` checks the initial tick count without reading or changing the flags.

Each iteration runs `lsr` to dim the display, then `subs w1, w1, #1` to reduce the count. `bne .L3` reads the flags that `subs` just set. It repeats the body when Z is 0, because ticks remain. When the count reaches zero, Z is 1 and the function returns.

Choose a tick count in the figure. A zero count skips the body. The other runs show the brightness changing after each dimming operation.

## 5. Write the countdown

Write a countdown loop that uses the flags from subtraction. Preserve the initial test so a zero count leaves the brightness unchanged.

### Write dim_down

Write `dim_down(brightness, ticks)`. Both arguments are unsigned. Halve the brightness once for each tick, dropping any remainder, then return the final brightness. If `ticks` is zero, return the original brightness.

`brightness` arrives in `w0`, and `ticks` in `w1`. Return the result in `w0`. Use `cbz`, `lsr`, `subs`, branches and `ret`. A separate `cmp` is not available: use the flags from `subs`.

*Hints, in order:*

- Handle a count of zero before running the first shift.
- A branch to the instruction after the shift would skip dimming on later iterations. The repeat label must include the shift.
- In the first iteration of `dim_down(128, 3)`, the shift changes brightness to 64. Subtracting 1 changes the count from 3 to 2, so Z is 0 and ticks remain.
- Use `b.ne` to repeat when the subtraction result is not zero. If no instruction changes the flags in between, the branch reads the flags from `subs`.
- Start with `cbz w1, done`. Under `again:`, put `lsr w0, w0, #1`, `subs w1, w1, #1` and `b.ne again`. Under `done:`, put `ret`.

## 6. Start a do loop with zero ticks

A `do` loop runs its body before testing the condition. GCC's `dim_do` listing has no initial `cbz`. It starts with the shift, subtracts 1 from the count, then tests whether to repeat.

The figure runs `dim_do(128, 0)`. The simulator will stop this trace after 20 instructions if the function has not returned.

**Does the function return within this trace, or does the simulator reach its limit?**

*After committing the prediction:*

The simulator reaches its limit. The first shift halves the brightness even though the count starts at zero. The subtraction then changes the unsigned count from 0 to 4294967295, which is `0xffffffff`. That result is not zero, so `bne` repeats the body.

This call is very long, but finite. Repeated subtraction eventually brings the count back to zero. It takes 2³² iterations in total, including the first one.

The stepper shows the remaining count in `w1`, alongside the brightness in `w0` and the flags. The trace contains only the first 20 instructions. Its limit is not evidence that a loop runs forever; the count's changes tell us why this one eventually stops.

## 7. Testing before or after the body

A `while` loop tests before its first iteration. A `do` loop tests after its first iteration, so its body always runs at least once. That difference matters when the requested count is zero.

With a positive count, these two functions perform the same number of dimming operations and return the same brightness. With a zero count, `dim_down` skips the body. `dim_do` runs the body anyway: it shifts the brightness, then subtracts from zero.

Unsigned subtraction wraps, as Module 2 showed. It does not produce a negative count that could stop the loop.

## 8. Why unsigned counts cannot go below zero

A different mistake is to use `while (ticks >= 0)` with unsigned `ticks`. Unlike the test in `dim_do`, this condition can never become false. Subtracting from zero wraps to the largest unsigned value, which still passes the test.

For `dim_wrong`, GCC 16.1 at `-O1` emits a branch to its own label. That recorded assembly repeats forever. It is not a promise about every C compiler.

For a countdown, test whether work remains. An unsigned count cannot become negative.

The stepper below runs course-written assembly. After subtracting, it compares the remaining unsigned count with zero and repeats on `cs`: higher or same.

Every unsigned value is at or above zero. `cmp w1, #0` therefore always sets C to 1, including when `w1` is zero. It overwrites the flags from `subs`, and `bcs` always branches back. This loop never reaches `ret`.

The condition proves why this assembly keeps running. A trace that reaches its instruction limit, by itself, would not prove that.

*Closed note: What the C standard permits*

C distinguishes an always-true test from a constant expression. `ticks >= 0` reads a variable, so it is not a constant expression, even though unsigned `ticks` makes it always true.

C23 draft N3096, section 6.8.5 paragraph 4, lets a compiler assume termination for such a loop if it performs none of the specified observable operations. These include input and output: effects beyond ordinary changes to local variables.

`dim_wrong` changes only local variables, so it meets these conditions. For example, a compiler may remove this loop instead of emitting instructions that repeat forever. The recorded GCC listing shows one compiler's choice; the C source does not guarantee that choice.

*End of closed note.*

## 9. Stop when the display is dark

### Write dim_until_dark

Write `dim_until_dark(brightness, ticks)`. Return the same brightness as `dim_down`, but stop as soon as either the count or the brightness is zero. Shifting zero again cannot change the result.

Both arguments are unsigned. They arrive in `w0` and `w1`; return the brightness in `w0`. Use `cbz`, `lsr`, `subs`, branches and `ret`.

The tests include the largest unsigned tick count. Your function must finish within the simulator's instruction limit, so it must stop when further shifts would do no work.

A 32-bit value becomes zero after at most 32 logical right shifts by one place. Each shift moves every remaining bit towards the bottom, and bits that pass the bottom are lost.

*Hints, in order:*

- There are two reasons to stop: no ticks remain, or the brightness is already zero.
- Shifting before checking a zero tick count would dim the display when no dimming was requested. Check the count first.
- With zero brightness and a nonzero tick count, another shift would still leave zero. A `cbz` on `w0` can return immediately in this case.
- After a shift, use `subs` to reduce the count and `b.ne` to repeat. Make the repeat label include the brightness check.
- Start with `cbz w1, done`. Under `again:`, put `cbz w0, done`, `lsr w0, w0, #1`, `subs w1, w1, #1` and `b.ne again`. Under `done:`, put `ret`.

*Feedback:*

Check both stopping conditions. A zero tick count preserves the brightness; zero brightness needs no further shifts.

## 10. What you now know

- `subs` can change a count and set the flags needed by a branch.
- A `while` loop can skip its body; a `do` loop runs it at least once.
- An unsigned value is always at or above zero.
- Reaching the simulator's instruction limit does not prove that a loop runs forever.
- A loop can stop early when further work cannot change its result.


## Figure captions and labels

dim_down in C and the instructions GCC made from it.

Predict how many dimming operations dim_down(128, 3) runs.

Follow the countdown, the brightness and the flags one instruction at a time.

Choose a tick count and follow the resulting loop.

Write and test a loop that counts down to zero.

Predict whether dim_do(128, 0) returns within the trace limit.

Step through dim_do with a zero tick count and inspect the brightness, remaining count and flags.

Follow the beginning of dim_do with a zero tick count.

Step through a course-written loop and inspect the count and flags after subs and cmp.

A course-written loop that compares an unsigned count with zero after subtracting.

dim_wrong in C and GCC's recorded output.

Write a loop that stops when either the tick count or the brightness reaches zero.

dim_down(128, 0)

dim_down(128, 1)

dim_down(128, 3)

dim_do(128, 0)

dim_down_wrong(128, 3)

0

1

3

4

The function returns within the trace.

The simulator reaches its instruction limit.

dim_down(128, 0)

dim_down(128, 1)

dim_down(128, 3)

dim_down(0, 3)

dim_down(0xffffffff, 31)

dim_down(0xffffffff, 32)

dim_until_dark(128, 0)

dim_until_dark(128, 3)

dim_until_dark(0, 0xffffffff)

dim_until_dark(1, 0xffffffff)

dim_until_dark(0xffffffff, 0xffffffff)

dim_until_dark(0xffffffff, 31)

## Originality record

A factorial countdown or an unsigned loop that prints decreasing integers.

The dashboard's dimming loop compares a zero-count entry check with a do loop, then uses zero brightness to bound useful work even for the largest unsigned count.

# Loop figure interface

Parameterized messages are shown with example counts and a placeholder. The figure substitutes counts and values from the simulator.

## chooseRun

Choose the inputs to run

## chart

Number of dimming operations

## iterations

The loop body ran 1 time.

The loop body ran 2 times.

The loop body ran {n} times.

## partialIterations

The trace contains 1 dimming operation before the simulator stopped.

The trace contains 2 dimming operations before the simulator stopped.

The trace contains {n} dimming operations before the simulator stopped.

## history

w0 after each dimming operation

## initial

Before the first dimming operation

## iteration

After dimming operation 1

After dimming operation 2

After dimming operation {n}

## returned

Returned 1 in w0.

Returned 2 in w0.

Returned {n} in w0.

## limited

The simulator stopped after 1 instruction. Reaching this limit does not prove that the program runs forever.

The simulator stopped after 2 instructions. Reaching this limit does not prove that the program runs forever.

The simulator stopped after {n} instructions. Reaching this limit does not prove that the program runs forever.

## noIterations

The loop body did not run.

## moreHistory

1 more entry is not shown.

2 more entries are not shown.

{n} more entries are not shown.
