# Module 0, Putting it together: the lesson's words

Drafted by Haiku from the fact brief in `docs/notes/module-0/brief.md`, a part at a time; checked for facts by the managing session, which sent parts 6 and 8 back once (a word used in two senses, and a missing fact) and changed one sentence of part 7 to keep it true once memory is introduced. The lesson's `.prose.ts` and `.labels.ts` files take their words from here.

After the lesson's first review (16 October 2026) six parts were redrafted by Haiku from the review's surviving findings and checked for facts: the definition of a register moved before the first prediction, the closed note on the closing brace moved beside the first figure, the sentence that gave away the construction challenge's method was removed, and *listing*, `#50` and the odometer were explained.

After the author's second read (17 October 2026) thirteen texts were drafted by Haiku from a fact brief and checked for facts, and they replace or join the words below: section 1 (and the two closed notes beside its listing), the wrong-answer sentences of the prediction in section 3, section 4's paragraphs and its sentence for the end of the run, a sentence before the construction challenge and the feedback for the reversed subtraction in section 5, section 6's first paragraph, its wrong-answer sentences and its explanation, section 7's first paragraph, and section 10, which is now the list of what the lesson taught, a question and a closed answer. The lesson's `.prose.ts` and `.labels.ts` take these from this file too.

On 17 October 2026, a separate Codex drafting agent revised the prose from checked findings, followed by independent learner and technical review. See [the review record](./clarity-review.md).

A separate Codex drafting session revised the opening on 23 October 2026 from the checked arithmetic/trace brief. A first assembly-only addition precedes a small recorded C function call and return; later operations build towards the trip function and exercises. See `docs/notes/course-load-implementation/opening.md`.

The opening activities became four separate Fundamentals lessons on 23 October 2026. Their canonical prose is in `docs/notes/fundamentals/prose.md`. A separate drafting agent supplied this lesson's new synthesis opening from the checked brief. Its existing ID and challenge IDs remain stable.

A separate Codex drafting agent streamlined the synthesis lesson on 24 October 2026 after those introductory activities became visible lessons. The original opening prediction and its duplicate listing, register reveal and closing arithmetic question were removed. The complete-function walkthrough, repair, missing-return experiment and independent trace remain. See `docs/notes/synthesis-streamlining/copy-brief.md`.

## 0. Objectives

- Trace a complete compiled function using the operand rules.
- Connect C arguments and results to the registers that hold them.
- Explain what happens when a function's `ret` is removed.

## 1. Trace trip_distance

`trip_distance` adds three trip distances, called legs, then subtracts a detour. Its `int` arguments arrive in registers:

- `leg1` arrives in `w0`.
- `leg2` arrives in `w1`.
- `leg3` arrives in `w2`.
- `detour` arrives in `w3`.

GCC 16.1.0 at `-O1` made the four instructions below for 64-bit Arm. Follow the C variable `total` through the calculation: the instructions update `w0`, then `ret` returns with the result already there.

Run `trip_distance(120, 85, 42, 15)` with Next. The C statement and instruction that just ran are highlighted together; ▸ marks the next instruction. An outlined register was written by the last instruction. Back undoes a step; Reset starts again.

On a narrow screen, swipe sideways within the listing to see the C and instructions.

*trip_distance(120, 85, 42, 15), from incoming arguments to the returned result.*

*Shown once the run has ended.*

`ret` returns to the code that called this function. The function's result is whatever `w0` holds at that moment.

## 2. Removing `ret`

The processor keeps instructions in **memory**, outside its registers. Here, `fuel_used` follows `trip_distance` in memory. `fuel_used` contains `sub w0, w0, w1`, then `ret`.

Make your prediction, then use the switch to delete `trip_distance`’s `ret` and run `trip_distance(120, 85, 42, 15)` again.

*A prediction about what w0 holds when the run ends without ret.*

**This is a new situation.** Make your best prediction, even if you're unsure. You'll see what the processor does after you choose.

**With `ret` deleted, what does `w0` hold when the run ends?**

- 232
- 147
- The run stops with an error
- 0

*Shown after the answer is checked.*

*Shown as the button that commits this prediction.* See what happens

The processor does not stop just because it reaches the next function. Without `ret`, it carries on with the instructions that follow. In this example, the two functions sit one after the other in memory. So the next instruction is `fuel_used`'s `sub w0, w0, w1`. The `sub` makes `w0` 232 minus 85, which is 147. Then `fuel_used`'s `ret` returns.

*Feedback for the option "232":* Does the processor stop at the last instruction of `trip_distance` when `ret` is gone? Find out what is in memory straight after that instruction.

*Feedback for the option "The run stops with an error":* Look at what is in memory straight after `trip_distance`'s last instruction. Is there an instruction there for the processor to run?

*Feedback for the option "0":* Read each instruction that runs, including any that come after `trip_distance`. Does any of them write 0 into `w0`?

*trip_distance(120, 85, 42, 15) again, with a switch that deletes ret. In memory, fuel_used comes after trip_distance.*

## 3. Kilometres to service

`km_to_service` returns the kilometres remaining before a car needs a service, after allowing for the current trip and a planned trip. It keeps 50 km spare.

```c
int km_to_service(
    int service_at, int odometer,
    int trip_so_far, int planned);
```

The car's odometer records the total distance it has travelled. All four inputs are in kilometres:

- `service_at`: the odometer reading at which the service is due.
- `odometer`: the odometer reading before the current trip began.
- `trip_so_far`: the distance travelled on the current trip.
- `planned`: the distance of the planned trip.

The arguments arrive in `w0` to `w3`, in that order.

GCC made the five instructions shown below. The `#50` in the last `sub` is the number 50 written inside the instruction.

*The five instructions GCC made for km_to_service, and the call to trace.*

**Trace the call**

Without running the call `km_to_service(30000, 28750, 140, 390)`, give two values.

- `w0` when the function returns
- `w1` when the function returns

1. Each `sub` writes only its first operand.
2. Do not change a register just because an instruction reads it. A register no instruction writes keeps its initial value.
3. After `sub w0, w0, w1` alone, `w0` is 30000 minus 28750, which is 1250.
4. `w1` arrives holding 28750, and no instruction writes `w1`.
5. `w0` is 670 and `w1` is 28750.

*Feedback for a wrong `w1`:* A `sub` writes its first operand only, so ask which instruction, if any, writes `w1`.

*Feedback for a wrong `w0`:* Take each `sub` in turn, and write down `w0` after each one.

Trace the whole path: incoming arguments, each instruction's writes, and the return. A correct calculation is not enough if execution continues beyond the intended function.
