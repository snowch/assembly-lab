# Module 2: the lessons' words, as drafted

The clarity revision on 17 October 2026 uses a separate Codex drafting pass and independent review, with the session's model and inherited effort. The earlier drafting history follows.

Drafted by Haiku from the fact brief in `docs/notes/module-2/brief.md`, a part at a time; checked for facts by the managing session, which narrowed two sentences the brief had overstated (which instructions set the flags; how a real processor adds), cut one repeat, and set the answers' explanations in plain type as Module 0's are. After the build, Haiku replaced the generic titles of parts 2 to 10 with titles that name each section's content (16 October 2026). After the module's review, Haiku redrafted the parts its sceptic upheld (the failure experiment's new program, the subtraction drawn bit by bit, the ungated answer moved into the prediction's explanation, the meaning of C after a subtraction), from facts the simulator produced. Every number was produced by the simulator before the brief went out. On 17 October 2026 the author asked for the carries to be drawn where they matter. Lesson 1's sections 1, 2, 4 to 8 and 10 and lesson 2's sections 1 to 8 and 10 now carry improved text, checked for facts, and each section 10 is "What you now know". The interface lines at the end are the words the figures and graders say.

# Lesson 1: Adding, and the four flags

## 0. Objectives

- Follow an addition column by column, with the carry into each column.
- Say what each of the four flags records after `adds`.
- Explain why one adder serves both readings, and how C and V report whether each sum fits.

## 1. How can the processor say when an answer does not fit?

In Module 1, the same 32 bits could represent different signed and unsigned numbers. The processor adds these bits without knowing which reading the program uses. The sum may not fit that reading's range. How can the processor tell us when that happens?

## 2. When an addition does not fit

Every addition in this lesson uses a `w` name, so it keeps 32 result bits. If the sum of the two numbers is outside the signed or unsigned range, those bits cannot represent that sum under that reading.

`add` writes the result and leaves the flags unchanged. `adds` writes the same result and also records four facts about the addition. Each fact is stored in a **flag**: a single bit that is either 0 or 1. The four flags are named N, Z, C and V.

Neither instruction stops the program or reports an error when the sum does not fit. To detect this, the program must read a flag.

## 3. Two readings of one addition

The figure adds 2147483647 and 1 with `adds w0, w0, w1`, which is `0x7fffffff` plus `0x00000001` in hexadecimal.

**Which readings of the answer are right?**

- Both
- Only the unsigned
- Only the signed
- Neither

*Shown after the answer is checked.*

The answer is `0x80000000`. Unsigned, it reads 2147483648, which is right. Signed, it reads −2147483648, which is wrong. 2147483647 plus 1 should be 2147483648. The signed reading cannot hold that number. The largest signed reading is 2147483647 (Module 1).

## 4. Carries and the four flags

The part of the processor that adds is the **adder**. The figure works the addition column by column, from the right, as on paper. A column adds its two bits and the 1 carried in from the right, if there is one. The total is 0, 1, 2 or 3.

The column keeps the total's lowest bit as its result bit. It passes the total's other bit, the **carry**, to the next column on the left.

You can step through the figure one column at a time, jump over a group of columns, or show them all.

After `adds`, four flags record facts about the answer:

- N is the top bit of the result.
- Z is 1 when all 32 result bits are 0.
- C is the carry out of bit 31, for an addition.
- V is 1 when the carry into bit 31 differs from the carry out of it.

The figure's last column, bit 31, shows the carry into bit 31 and the carry out of it. Those two carries give C and V.

*`adds w0, w0, w1` column by column, with the carry into each column above it, and the four flags after it.*

**How GCC checks for overflow**

`__builtin_add_overflow` is a function built into GCC. It adds two numbers and reports whether the result did not fit. For two `int`s, GCC 16.1 with `-O1`, as in Module 0, compiles a call to it into this:

```
add_overflows:
        cmn     w0, w1
        cset    w0, vs
        ret
```

The first line, `add_overflows:`, is the function's name and a colon. The two instructions before `ret` return 1 exactly when V is set. A later module explains them.

## 5. Three additions to predict

Earlier, you predicted one addition. Now you predict three.

**Predict the four flags**

Give N, Z, C and V for each of three additions with `adds`. Each addition has its own group of four boxes, N, Z, C and V. Each box takes 0 or 1.

The three additions are:

- `0xffffffff` plus 1
- 5 plus 3
- `0x80000000` plus `0x80000000`

Check your answers. A wrong flag is named, and the answers you got right stay.

1. C is the carry out of the top bit. V is 1 when the carry into the top bit and the carry out of it differ.
2. C and V are not the same thing. One addition here sets both, and one sets only C.
3. 5 plus 3 is 8. No carry reaches the top bit, so N, Z, C and V are all 0.
4. `0xffffffff` plus 1 is 0 with a carry out of the top bit, so Z is 1 and C is 1.
5. `0xffffffff` plus 1 gives N 0, Z 1, C 1 and V 0. 5 plus 3 has all four at 0. `0x80000000` plus `0x80000000` gives N 0, Z 1, C 1 and V 1.

*Step through the addition column by column to inspect the result bits, carries and flags.*

*Shown after the challenge is passed.*

C and V are separate tests, one for each reading, so either can be 1 without the other. `0xffffffff` plus 1 carries into bit 31 and out of it, so C is 1 and V is 0; `0x7fffffff` plus 1 carries into bit 31 but not out, so C is 0 and V is 1. `0x80000000` plus `0x80000000` makes C and V both 1.

## 6. Running add instead of adds

The figure runs `sum_flags` with `w0` = `0x7fffffff`, `w1` = 1 and `w2` = `0xffffffff`.

It runs `adds w3, w2, w2` first, which adds `0xffffffff` to itself. Then it runs `add w0, w0, w1`, which adds `0x7fffffff` and 1. After each step, the figure shows which registers and which flags changed.

**After `add`, what do the flags show?**

- N and V are 1, from the addition
- All four are 0
- N and C are still 1, as `adds` left them
- The run stops with an error

*Shown after the answer is checked.*

N and C are still 1, as `adds` left them. `add` wrote `0x80000000` to `w0` and left the flags alone.

Had `add` set the flags, they would be N 1, Z 0, C 0 and V 1. That is what `adds` gives for `0x7fffffff` plus 1 earlier in this lesson. Had `add` cleared them, all four would be 0.

Of `add`, `adds` and `sub`, only `adds` writes the flags.

## 7. Unsigned carry and signed overflow

The adder produces the same 32 result bits for both readings. N records the top bit, and Z records whether all the result bits are zero.

C records the carry out of bit 31. After an addition, C is 1 when the sum of the unsigned numbers is too large for 32 bits.

V reports signed **overflow**: the sum of the signed numbers is outside the signed range. V is 1 when the carry into bit 31 differs from the carry out of it.

C and V are separate tests.

## 8. Flags keep their values

Every `adds` writes all four flags. The flags keep their values until another instruction writes them. `add` and `sub` do not write the flags.

To check whether an addition fits, a program reads C for unsigned numbers or V for signed numbers. Later modules show instructions that read the flags.

## 9. The smallest signed overflow

This challenge uses V to detect a sum outside the signed range.

**Find the smallest overflow**

Give the smallest positive number that, added to `0x7ffffffe` with `adds`, makes V 1.

Enter the number in decimal.

1. V is 1 when the signed answer does not fit, so look for the first signed answer above 2147483647.
2. The question is about V, not C. The unsigned answer fits for small numbers.
3. `0x7fffffff` plus 1 makes V 1.
4. `0x7ffffffe` is 2147483646.
5. The answer is 2.

## 10. What you now know

- `adds` adds two numbers and writes N, Z, C and V.
- N and Z describe the result.
- C is the carry out of bit 31 for an addition.
- V reports signed overflow.
- `add` does not write the flags.
- The flags keep their values until an instruction writes them.

**Question:** `adds` adds `0xc0000000` and `0xc0000000`. Which of C and V is 1?

**Answer**

The result is `0x80000000`. A carry goes into bit 31 and a carry comes out, so C is 1 and V is 0. The unsigned result does not fit, but the signed one does: −1073741824 plus −1073741824 is −2147483648.

## 11. The model and the real processor

The architecture is Arm's published definition of what each instruction does. The simulator works out the flags as the architecture defines them. The course checks its simulator against QEMU, a widely used program that imitates Arm processors. A real processor need not add column by column. The drawing shows the arithmetic, not the circuit. The digital-design course builds the circuit.

# Lesson 2: Subtracting, and the tick counter

## 0. Objectives

- Explain why `elapsed(now, then)` works across a wrap when the counter advances normally and less than a full turn passes.
- Say what C records after `subs`.
- Write `elapsed` and pass tests across the wrap.

## 1. Is the answer still right after a wrap?

The trip computer counts milliseconds using a 32-bit unsigned counter. After 4294967295, the next value is 0.

Each count is a **tick**. Going back to 0 is a **wrap**.

`elapsed(now, then)` returns `now - then`. GCC makes it one subtraction and a `ret`.

One full turn of the counter, 4294967296 ticks, is about 49.71 days.

Throughout this lesson, assume the counter advances one tick per millisecond without being reset. Fewer than 4294967296 ticks pass between the two readings.

How can you work out the elapsed time if the counter wraps between the two readings?

## 2. Why tests need to cross a wrap

It is easy to assume that a later reading is always larger than an earlier one. After a wrap, `now` can be less than `then`. Tests that never cross the wrap will not catch a mistake based on that assumption. Include readings on both sides of the wrap.

## 3. Elapsed across the wrap

`then` is 4294966296, the count just before the wrap; `now` is 1000, the count just after it.

**What does `elapsed(1000, 4294966296)` return?**

- −4294965296
- 4294965296
- 2000
- 0

*Shown after the answer is checked.*

The answer is 2000. Counting forward from 4294966296, 1000 ticks reach the wrap to 0, and 1000 more reach 1000.

## 4. Subtraction as addition, and borrows

After 4294967295 comes 0, so the counter's values form a ring. The figure draws them that way. The counter counts forward, clockwise.

Two readings close together sit at almost one spot on a ring of 4294967296 values. So the strip under the ring enlarges the stretch round the wrap. The strip shows `then`, the wrap from 4294967295 to 0, `now`, the ticks before the wrap, the ticks after it, and their total.

`subs` does the same subtraction as `sub` and also replaces all four flags, N, Z, C and V. `sub` leaves the flags unchanged.

The processor subtracts by adding. To work out `a - b`, it changes every bit of `b`: each 1 becomes 0, and each 0 becomes 1. It adds the result to `a`, and adds 1 more as the carry into the first column.

The example uses four bits only, to show the method. The real instruction uses 32. 5 is `0101`. 3 is `0011`, and with every bit changed it is `1100`.

```
   0101     5
+  1100     3, every bit changed
+     1     carry in, into the first column
  -----
  10010     sum
   0010     kept: 2
  1         carry out of the top
```

For 32 bits, changing every bit of `b` gives 4294967295 minus `b`. Adding 1 gives 4294967296 minus `b`, or 2³² minus `b`. This is the full sum, before keeping only the low 32 bits. When `b` is 0, the full sum is 4294967296: the low 32 bits are 0, with a carry out of the top bit.

The figures below show the same steps for the real 32-bit `subs`: the second operand, its bits changed, the carry in of 1, the result and the carry out.

A subtraction needs a **borrow** when `a` is less than `b` under the unsigned reading. After `adds`, C = 1 means a carry left the top bit. After `subs`, C = 1 means no borrow was needed, and C = 0 means one was.

The two agree: a carry leaves the top exactly when `a` is at least `b`.

The two figures below show the final states of two subtractions, each of which can be stepped column by column. One needs a borrow: 1000 minus 4294966296 leaves C 0. The other does not: 9000 minus 2500 leaves C 1 and the result 6500.

*The counter as a ring: `then`, `now`, and the distance between them.*

## 5. Writing elapsed yourself

Earlier, GCC wrote `elapsed` for you. Here you write it yourself.

**Write `elapsed`**

Write `elapsed(now, then)`. It returns the ticks from `then` to `now`. `now` arrives in `w0`, `then` arrives in `w1`, and the result goes back in `w0`.

Assume the counter advances normally and less than one full turn passes between readings. Your function must work whether or not the counter wrapped. Four calls test it, two of them across the wrap.

You may use `add`, `sub`, `adds`, `subs` and `ret`.

1. The 32 bits of a 32-bit subtraction are `now - then` when `now` is at least `then`, and `now - then + 4294967296` when `now` is less than `then`. Either way they are the distance round the ring.
2. No test for the wrap is needed.
3. `elapsed(5000, 1000)` is 4000. `sub` takes 1000 from 5000.
4. `now` arrives in `w0` and `then` in `w1`.
5. The whole answer is `sub w0, w0, w1`, then `ret`.

*Shown after the challenge is passed.*

A single 32-bit subtraction keeps the low 32 bits of `now - then`. When `now` is less than `then`, those bits are `now - then + 4294967296`: the distance forward round the wrap. The subtraction cannot tell a gap of 2000 ticks from a gap of 2000 ticks plus a full turn of 4294967296, because the readings alone do not show how many full turns passed.

## 6. Negating 0x80000000

`neg w0, w0` sets a value to its negative, which is 0 minus the value. `negs` does the same and also writes the four flags.

The figure runs `negs w0, w0` on `0x80000000`, the smallest signed 32-bit value, which is −2147483648.

**What does `w0` hold afterwards?**

- `0x7fffffff`
- `0x80000000`, unchanged
- 0
- The run stops with an error

*Shown after the answer is checked.*

```
the input                         −2147483648
its negative                      +2147483648
the largest signed 32-bit value   +2147483647
```

The negative does not fit the signed range. So the 32 bits that come back are `0x80000000` again, unchanged, and `negs` sets V to 1.

## 7. Why the low bits are enough

N and Z describe the 32-bit result, as before. V reports whether the signed difference is outside the signed range. C is still the carry out of the top bit. After `subs`, C = 1 means no borrow was needed.

The adder adds `now` to `then` with every bit changed, plus 1. That sum is `now - then + 4294967296`.

If `now` is at least `then`, the sum is 4294967296 or more: a carry leaves the top, C is 1, and the 32 bits kept are `now - then`.

If `now` is less than `then`, no carry leaves the top, C is 0, and the 32 bits kept are `now - then + 4294967296`: the distance forward from `then`, round the wrap, to `now`.

## 8. Other counters

Subtraction gives the elapsed ticks modulo 2³². Modulo 2³² means the remainder after dividing by 4294967296, so any whole number of full turns is lost. It gives the actual elapsed time when the counter advances normally and fewer than 2³² ticks have passed between readings.

After `subs`, C = 0 means a borrow. When the counter advances normally and fewer than 2³² ticks have passed, C = 0 also means the counter wrapped once between the readings. But C is one bit. It does not record how many wraps happened.

Any 32-bit counter subtracted in 32 bits behaves this way.

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

## 10. What you now know

- A subtraction is done as an addition of the second operand with every bit changed, plus 1.
- C = 1 after `subs` means no borrow.
- A 32-bit unsigned counter wraps from 4294967295 to 0.
- For a counter advancing normally, one 32-bit subtraction gives the elapsed ticks if less than a full turn has passed.
- The readings alone cannot show how many full turns passed.
- `negs` can set V even when the 32 bits come back unchanged.

**Question:** `then` is 4294967000 and `now` is 296. What does `elapsed(now, then)` return, and what does `subs` set C to?

**Answer**

592, and C is 0. 296 ticks reach the wrap, 296 more reach 296, and a borrow was needed.

## 11. The model and the real processor

As in lesson 1, the flags follow the architecture's definition, checked against QEMU. The drawing shows the arithmetic, not the circuit.

# Interface strings

The words the figures and the graders say, which are not part of a lesson's text. Each is in `packages/views/src/strings.arith.ts`, marked DRAFT, and `module-2.prose.test.ts` holds those strings to the lines here. A word `{in}` stands for the carry into bit 31 and `{out}` for the carry out of it.

## The carries at bit 31 (lesson 1, section 4; lesson 2, section 4)

Carry into bit 31: {in}
Carry out of bit 31: {out}
C = 0: no carry left bit 31, so the unsigned result fits
C = 1: a carry left bit 31, so the unsigned result does not fit
V = 0: the carries match ({in} in, {out} out), so the signed result fits
V = 1: the carries differ ({in} in, {out} out), so the signed result does not fit

After a subtraction, the two lines for C are these:

C = 0: a borrow was needed
C = 1: no borrow

## A wrong flag (lesson 1, section 5)

N: N is the top bit of the 32-bit result.
Z: Z is 1 only when all 32 result bits are 0.
C: C is the carry out of the top bit. Check whether a carry leaves bit 31.
V: Compare the carry into the top bit with the carry out of it.

## After add (lesson 1, section 6), the stepper's status

`w0` changed. N, Z, C and V were not updated by `add`.
