# Module 2: the lessons' words, as drafted

Drafted by Haiku from the fact brief in `docs/notes/module-2/brief.md`, a part at a time; checked for facts by the managing session, which narrowed two sentences the brief had overstated (which instructions set the flags; how a real processor adds), cut one repeat, and set the answers' explanations in plain type as Module 0's are. After the build, Haiku replaced the generic titles of parts 2 to 10 with titles that name each section's content (16 October 2026). After the module's review, Haiku redrafted the parts its sceptic upheld (the failure experiment's new program, the subtraction drawn bit by bit, the ungated answer moved into the prediction's explanation, the meaning of C after a subtraction), from facts the simulator produced. Every number was produced by the simulator before the brief went out.

# Lesson 1: Adding, and the four flags

## 0. Objectives

- Follow an addition column by column, with the carry into each column.
- Say what each of the four flags records after `adds`.
- Explain why one adder serves both readings, and which flag judges which.

## 1. How can the processor say when an answer does not fit?

Module 1 showed that 4294967284 and −12 are one pattern. It also showed that GCC uses the same `sub` instruction for `int` and for `unsigned`.

So the processor adds without knowing which reading the program wants. It must still say when an answer does not fit, and it must do that for both readings at once.

## 2. When an addition does not fit

An addition in 32 bits can give an answer that does not fit. The bits that remain are then wrong for one reading or the other. A program that must not continue with a wrong answer needs to know it happened.

`add` keeps no record. `adds` does the same addition and also records four facts about the answer. Each fact sits in a **flag**. The four flags are named N, Z, C and V.

## 3. Two readings of one addition

The figure adds 2147483647 and 1 with `adds w0, w0, w1`, which is `0x7fffffff` plus `0x00000001` in hexadecimal.

**Which readings of the answer are right?**

- Both
- Only the unsigned
- Only the signed
- Neither

*Shown after the answer is checked.*

The answer is `0x80000000`. Unsigned, it reads 2147483648, which is right. Signed, it reads −2147483648, which is wrong. 2147483647 plus 1 should be 2147483648. The signed reading cannot hold that number.

## 4. Carries and the four flags

The part of the processor that adds two registers' bits is called the **adder**. The figure draws the addition column by column, from the right, as on paper. A column adds its two bits and any 1 arriving from the right. If that total is 2 or 3, a 1 goes on to the next column on the left. That 1 is the **carry**.

After `adds`, four flags record facts about the answer:

- N is the answer's top bit.
- Z is 1 when the answer is 0.
- C is the carry out of the top bit, the carry that would need a 33rd bit.
- V is 1 when the carry into the top bit differs from the carry out of it.

For `0x7fffffff` plus 1, a carry runs through every column into the top bit. None comes out of it. So N is 1, Z is 0, C is 0 and V is 1.

*`adds w0, w0, w1` column by column, with the carry into each column above it, and the four flags after it.*

**GCC's own overflow check**

GCC uses V itself. For `__builtin_add_overflow` on two `int`s, GCC 16.1 at `-O1` compiles to this:

```
add_overflows:
        cmn     w0, w1
        cset    w0, vs
        ret
```

The two instructions before `ret` return 1 exactly when V is set. Both are instructions a later module explains.

## 5. Three additions to predict

Earlier, you predicted one addition. Now you predict three.

**Predict the four flags**

Predict N, Z, C and V for three additions with `adds`, before running them.

The additions are:

- `0xffffffff` plus 1
- 5 plus 3
- `0x80000000` plus `0x80000000`

For each addition, give N, Z, C and V.

1. C is the carry out of the top bit. V is 1 when the carry into the top bit and the carry out of it differ.
2. C and V are not the same thing. One addition here sets both, and one sets only C.
3. 5 plus 3 is 8. No carry reaches the top bit, so N, Z, C and V are all 0.
4. `0xffffffff` plus 1 is 0 with a carry out of the top bit, so Z is 1 and C is 1.
5. `0xffffffff` plus 1 gives N 0, Z 1, C 1 and V 0. 5 plus 3 has all four at 0. `0x80000000` plus `0x80000000` gives N 0, Z 1, C 1 and V 1.

## 6. Running add instead of adds

The figure runs `sum_flags(0x7fffffff, 1, 0xffffffff)`, with `w0` as `0x7fffffff`, `w1` as 1 and `w2` as `0xffffffff`. First it runs `adds w3, w2, w2`, which adds `0xffffffff` to itself and leaves N and C at 1. Then it runs `add w0, w0, w1` instead of `adds`, on `0x7fffffff` plus 1.

**After `add`, what do the flags show?**

- N and V are 1, from the addition
- N and C are still 1, as `adds` left them
- All four are 0
- The run stops with an error

*Shown after the answer is checked.*

N and C are still 1, as `adds` left them. `add` gives the same answer as `adds` would, `0x80000000`, but records nothing. Had `add` recorded flags, they would be N 1, Z 0, C 0 and V 1, the same as `adds` gives for `0x7fffffff` plus 1 earlier in this lesson. Had it cleared them, all four would be 0. The three outcomes differ, so the run tells them apart. Of the instructions met so far, only those whose names end in `s` record the four facts.

## 7. Which flag judges which reading

The adder adds bits. It gives one answer for both readings. N and Z describe that answer: its top bit, and whether it is 0.

C judges the unsigned reading. A carry out of the top bit means the unsigned answer did not fit.

V judges the signed reading. When the carry into the top bit and the carry out of it differ, the top bit came out wrong for the signed answer. That case is called **overflow**.

## 8. Flags keep their values

Every `adds` sets all four flags. The program reads the one that matches its reading.

The flags keep their values until another instruction records them. Later modules show the instructions that read the flags to choose what runs next.

## 9. The smallest signed overflow

This challenge uses V, the flag that judges the signed reading.

**Find the smallest overflow**

Give the smallest positive number that, added to `0x7ffffffe` with `adds`, makes V 1.

Enter the number in decimal.

1. V is 1 when the signed answer does not fit, so look for the first signed answer above 2147483647.
2. The question is about V, not C. The unsigned answer fits for small numbers.
3. `0x7fffffff` plus 1 makes V 1.
4. `0x7ffffffe` is 2147483646.
5. The answer is 2.

## 10. Looking back

- Why can one addition be right and wrong at once?
- Which flag would a program using `unsigned` read, and which one using `int`?
- What does `add` do to the flags?

## 11. The model and the real processor

The simulator works out the flags as the architecture defines them. A real processor need not add column by column. The drawing shows the arithmetic, not the circuit. The digital-design course builds the circuit.

# Lesson 2: Subtracting, and the tick counter

## 0. Objectives

- Explain why `elapsed(now, then)` is right when the counter has wrapped.
- Say what C records after `subs`.
- Write `elapsed` and pass tests across the wrap.

## 1. Is the answer still right after a wrap?

The trip computer counts milliseconds in a 32-bit `unsigned` counter. Each count is one millisecond, called a **tick**. It reaches 4294967295, then goes back to 0. Going back to 0 is called a **wrap**.

4294967296 milliseconds is about 49.71 days. So a car that is never switched off wraps its counter every 50 days or so.

`elapsed(now, then)` returns `now - then`. GCC makes it two instructions, one subtraction and a `ret`.

Suppose the counter wraps between `then` and `now`.

## 2. Why the mistake shows up late

A program that measures time with a counter like this one runs for weeks before the wrap. So a mistake here shows up rarely, and late. The answer depends on how the processor subtracts.

## 3. Elapsed across the wrap

`then` is 4294966296, taken just before the wrap; `now` is 1000, taken just after it.

**What does `elapsed(1000, 4294966296)` return?**

- 2000
- −4294965296
- 4294965296
- 0

*Shown after the answer is checked.*

The answer is 2000. Counting on from 4294966296, 1000 steps reach the wrap, and 1000 more reach 1000. The subtraction needs a borrow, because 1000 is less than 4294966296 under the unsigned reading, so C is 0 after `subs`. The 32 bits that remain are still the right distance, 2000.

## 4. Subtraction as addition, and borrows

The figure draws the counter's values on a ring. Two counter values 2000 apart sit at almost one spot on a ring of 4294967296 values, so a strip under the ring enlarges the stretch around the wrap, where `then` and `now` sit.

The processor subtracts by adding. `a - b` is worked out as `a` plus `b` with each of its bits changed to the other value (each 1 becomes 0, each 0 becomes 1), plus 1. It uses the same adder as in lesson 1. With `subs`, the flags come from that addition.

A subtraction needs a **borrow** when `a` is less than `b` under the unsigned reading. C is 1 when no borrow was needed, and 0 when one was.

After you answer the prediction above, two more figures open. Each works a `subs` column by column, with each bit of the second number changed: one across the wrap, and one that does not wrap.

*The counter as a ring: `then`, `now`, and the distance between them. The strip under the ring enlarges the stretch around the wrap.*

## 5. Writing elapsed yourself

Earlier, GCC wrote `elapsed` for you. Here you write it yourself.

**Write `elapsed`**

Write `elapsed(now, then)`, which returns the milliseconds from `then` to `now`. Four calls test it, two across the wrap.

You may use `add`, `sub`, `adds`, `subs` and `ret`.

1. A 32-bit subtraction keeps the low 32 bits of the true answer. Those 32 bits are the distance round the ring.
2. No test for the wrap is needed.
3. `elapsed(5000, 1000)` is 4000. `sub` takes 1000 from 5000.
4. `now` arrives in `w0` and `then` in `w1`.
5. The whole answer is `sub w0, w0, w1`, then `ret`.

## 6. Negating 0x80000000

`neg w0, w0` turns a value into its negative, as 0 minus the value. The figure runs `negs w0, w0` on `0x80000000`, which reads as −2147483648 signed.

**What does `w0` hold afterwards?**

- `0x80000000`, unchanged
- `0x7fffffff`
- 0
- The run stops with an error

*Shown after the answer is checked.*

`w0` still holds `0x80000000`, unchanged, and V is 1. The signed answer, 2147483648, does not fit, so the same pattern comes back.

## 7. Why the low bits are enough

Subtraction is addition with each bit of the second value changed to the other, and 1 added. N, Z and V mean what they meant in lesson 1. C is still the carry out of the top bit, but after a subtraction a 1 means no borrow was needed.

The 32 bits of the answer are the true answer with every bit above the lowest 32 dropped. Dropping those bits is why a wrapped counter still gives the right distance.

## 8. Other counters, and GCC's check

Any counter that wraps gives the right distance by plain subtraction, as long as less than one full turn passed.

GCC's `sub_overflows`, from `__builtin_sub_overflow`, runs `subs w0, w0, w1` and then an instruction a later module explains. That instruction reads V after the subtraction, as `add_overflows` did after an addition.

## 9. Stepping from the top to zero

This challenge looks at the step where the counter goes from its largest value to 0.

**One step past the top**

Give `elapsed(0, 4294967295)`, and the C flag that `subs` would set for the same call.

Enter the result in decimal, and C as 0 or 1.

1. Subtracting keeps the low 32 bits. C is 1 only if no borrow was needed.
2. 0 is smaller than 4294967295 under the unsigned reading.
3. `elapsed(1000, 4294966296)` is 2000, with C 0.
4. One step after 4294967295, the counter reads 0.
5. The whole answer is 1, and C is 0.

## 10. Looking back

- Why does `elapsed` need no special case for the wrap?
- What does C mean after `subs`, and how does that differ from after `adds`?
- Why does negating `0x80000000` give `0x80000000`?

## 11. The model and the real processor

As in lesson 1, the flags follow the architecture's definition, checked against QEMU. The drawing shows the arithmetic, not the circuit.
