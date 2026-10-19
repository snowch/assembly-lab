# Module 4: Compare and branch (lesson text)

Drafted by Haiku from the fact brief `brief.md` beside this file, 16 October 2026; every number
checked against the course's simulator (runs recorded with the brief) and the recorded GCC 16.1
`-O1` listings in `listings.md`. Two sentences of provenance meant for the checker were removed. The build found that the section *Changing `bgt` to `bge`* of Lesson 2 named `describe(11)`, one of the last challenge's gradients; it now names `describe(12)`, which the simulator also returns 2 for.
On 17 October 2026 the text of most sections was replaced by the improved text of brief 58 (24 items, checked for facts); the figure that draws it was extended to match. Lesson 1 is retitled "Compare, and the signed or unsigned condition".
The same day the review's fixes (15 items, checked for facts) changed Lesson 1's sections 5, 7, 8 and 9 and Lesson 2's sections 1, 3, 5 and 9, and added the feedback sentence for a run that goes on into the next block.
This file is the lesson's words: the lesson files keep them word for word.
On 17 October 2026 a separate Codex drafting pass clarified the operand roles, conditions, label names and branch explanations. See `clarity-review.md` for the independent reviews and checks.

How this file marks what the page does with a passage. A *Closed note* is the section's closed `details`, titled as the marker says; the marker lines are not words of the lesson. A line that starts `>` is a sentence a figure or a grader says (the stepper's status lines, the feedback after a failed test); the lesson's files hold it word for word where the grader or the figure reads it, and a test holds the two together.

# Lesson 1: Compare, and the signed or unsigned condition

## 0. Objectives
- say what `cmp` leaves behind, and which flags each condition reads;
- tell the signed conditions from the unsigned ones;
- build `less_fuel` from `cmp` and `csel`.

## 1. What does GCC change for `unsigned`?

The trip computer returns the larger of two gradients with `steeper_s`. `steeper_u` is the same C with `unsigned` arguments.

```c
int steeper_s(int a, int b)
{
    return a > b ? a : b;
}

unsigned steeper_u(unsigned a,
                   unsigned b)
{
    return a > b ? a : b;
}
```

`a > b ? a : b` means "`a` if `a` is greater than `b`, otherwise `b`".

Both functions get the same two 32-bit patterns, `0xffffffff` and 1. They return different results: `steeper_s` returns 1, and `steeper_u` returns 4294967295.

Module 1 showed that one pattern can have two readings. `0xffffffff` is −1 signed and 4294967295 unsigned.

GCC compiled `steeper_s` to the three instructions below.

*Closed note: Which compiler?*

GCC 16.1 with `-O1`, as in Module 0.

*End of closed note.*

```
steeper_s:
        cmp     w1, w0
        csel    w0, w1, w0, ge
        ret
```

`cmp` and `csel` are explained in the next sections. For now, the one fact you need is that `csel` picks one of two registers.

**Two functions receive the same 32-bit patterns but return different results. What changes in the instructions when the C type changes?**

*The C of both functions, `steeper_s`'s three instructions, and what each function returns for `0xffffffff` and 1.*

## 2. Why a decision needs the flags

A decision often needs only the flags, not the result. `cmp w1, w0` sets the flags exactly as `subs` would for `w1` minus `w0`. It writes no register, because no result is kept. This is a **compare**.

The order matters. `cmp w1, w0` is `w1` minus `w0`. `cmp w0, w1` is the other way round, and its flags can differ.

`cmp` also takes a constant, as `subs` does: `cmp w0, 10`.

The flags keep their values until another instruction writes them.

*Closed note: cmn*

`cmn w0, w1` sets the flags as `adds` would for `w0` plus `w1`, with no result. Module 2's `add_overflows` used it.

*End of closed note.*

## 3. Predict the change in `steeper_u`

The figure shows `steeper_s`'s three instructions from above, and runs `steeper_u` and `steeper_s` on `0xffffffff` and 1.

**What does GCC change to make `steeper_u`'s three instructions?**

- `cmp` becomes an instruction made for unsigned values.
- The operands of `cmp` change.
- Only the last operand of `csel` changes.
- `csel` becomes a different instruction.

*Shown after the answer is checked.*

Only the last operand of `csel` changes: `ge` in `steeper_s`, and `cs` in `steeper_u`.

GCC compiled `steeper_u` to the three instructions below.

```
steeper_u:
        cmp     w1, w0
        csel    w0, w1, w0, cs
        ret
```

The `cmp` instruction is identical in both functions. It sets the same flags. The condition on `csel` determines whether those flags are read by the signed or the unsigned rules.

`cs` asks about the unsigned reading: higher or same. It is yes when C is 1. After a compare, C is 1 when no borrow was needed.

## 4. What the last operand of `csel` asks

The compare comes first. `w0` holds `a`, and `w1` holds `b`. `cmp w1, w0` sets the flags of `b` minus `a`.

The condition comes next. The last operand of `csel` names a yes-or-no question about the flags. That question is a **condition**. `ge` (greater than or equal, signed) is yes when N equals V. `cs` (higher or same, unsigned) is yes when C is 1.

Last comes the select. The first register in `csel` is the destination: the register it writes. The next two registers hold the values to choose between. When the condition is yes, `csel` copies the first source; when it is no, it copies the second.

Here, `csel w0, w1, w0, ge` writes to `w0`. It copies `w1` when `ge` is yes, and `w0` when `ge` is no. The second source is also the destination, so the no case leaves `w0` unchanged. No instruction is skipped.

So both functions return `b` when `b` is at least `a`, and `a` otherwise. That is the larger value.

The figure shows the three stages for `0xffffffff` and 1, from the run.

The signed names are *greater* and *less*. The unsigned names are *higher* and *lower*. For these two functions, the difference between `int` and `unsigned` is in the condition GCC chose.

*`steeper_s` and `steeper_u` side by side; the one operand that differs is marked.*

## 5. Choosing the smaller of two values

`less_fuel` is a choice between two registers, as `steeper_u` was.

**Write `less_fuel`**

Write `less_fuel(a, b)`. It returns the smaller of two `unsigned` litres values. Use only `cmp`, `csel` and `ret`.

`a` arrives in `w0`, and `b` arrives in `w1`. The answer leaves in `w0`. A comment starts with `//`.

Five calls test it. In two of them, one value has the top bit set.

1. Compare the two, then let one `csel` choose between them.
2. A signed condition can misread an unsigned value whose top bit is set. Choose a condition for unsigned ordering.
3. `csel w0, w0, w1, cc` would give `w0` when `cc` is yes and `w1` when it is no.
4. `cc` is yes when C is 0, that is, when `w0` is lower than `w1`. Compare `w0` with `w1`, in that order.
5. `cmp w0, w1`, `csel w0, w0, w1, cc`, `ret`.

*Feedback after a failed test.*

> Only the calls with the top bit set fail. Does your condition read the signed order or the unsigned order?

> The larger value comes back. Check the order of `cmp`'s operands, and the order of `csel`'s two sources.

> The returned value is wrong even though the inputs were equal. Check what each source register holds when `csel` runs. Has an earlier instruction overwritten an input?

*Shown after the challenge passes.*

Step through one of the tests below to see the compare, the flags, the condition and the value `csel` chose.

## 6. Running `steeper_u` with `ge`

The figure runs `steeper_u` with its last operand changed from `cs` to `ge`. The instructions are `cmp w1, w0`, `csel w0, w1, w0, ge` and `ret`. The inputs are `0x80000000` and 1.

**What does it return?**

- `2147483648`
- `1`
- `0`
- the run stops with an error

*Shown after the answer is checked.*

The run has the same operands as GCC's `steeper_u`: `0x80000000` and 1. It uses the same `cmp`, `cmp w1, w0`. That `cmp` leaves NZCV 1001: N is 1, Z is 0, C is 0 and V is 1.

In the changed function, `ge` is yes because N equals V. Its `csel` copies 1 from `w1` into `w0`.

In a separate run of GCC's original `steeper_u` with the same inputs, `cs` is no because C is 0. Its `csel` leaves `0x80000000` in `w0`, which is 2147483648.

With `ge`, the function reads the bits as signed. `0x80000000` is the smallest `int`, so the function returns 1. GCC's `steeper_u`, with `cs`, returns 2147483648.

## 7. What each condition reads

GCC prints the conditions `cs` and `cc`. Arm also writes them `hs` and `lo`, and the assembler accepts both.

In `cmp a, b`, `a` is the first operand and `b` is the second. After that compare, the core conditions come in groups. Each line says what the condition means, and which flags it reads.

- Equality: `eq` (a = b, Z is 1) and `ne` (a ≠ b, Z is 0).
- Unsigned order: `cs` (a ≥ b, C is 1) and `cc` (a < b, C is 0).
- Signed order: `ge` (a ≥ b, N equals V) and `lt` (a < b, N differs from V).

`hi` and `gt` exclude equality. Each has an opposite condition that includes equality. These conditions read Z as well.

- `hi` (higher, unsigned) is `cs` without equality: C is 1 and Z is 0. Its opposite is `ls` (lower or same, unsigned): C is 0 or Z is 1.
- `gt` (greater than, signed) is `ge` without equality: Z is 0 and N equals V. Its opposite is `le` (less than or equal, signed): Z is 1 or N differs from V.

`vs`, which Module 2 met, is yes when V is 1.

The figure below uses `cmp w0, w1`, the reverse of `steeper_s`'s `cmp w1, w0`. Here, `a` is `w0` and `b` is `w1`. Choose a pair of values. For each condition, the figure shows the rule, the flags it reads and whether the condition holds.

*Closed note: Every condition this course uses*

- `eq`, equal (either reading): Z is 1.
- `ne`, not equal (either reading): Z is 0.
- `cs`, higher or same, unsigned: C is 1.
- `cc`, lower, unsigned: C is 0.
- `hi`, higher, unsigned: C is 1 and Z is 0.
- `ls`, lower or same, unsigned: C is 0 or Z is 1.
- `ge`, greater than or equal, signed: N equals V.
- `lt`, less than, signed: N differs from V.
- `gt`, greater than, signed: Z is 0 and N equals V.
- `le`, less than or equal, signed: Z is 1 or N differs from V.
- `vs` (met in Module 2): V is 1.

Exactly one of each pair holds at every setting of the flags: `eq` or `ne`, `cs` or `cc`, `hi` or `ls`, `ge` or `lt`, `gt` or `le`. This is checked at all sixteen settings of the flags.

`cmp w0, w1` with 8 and 8 leaves NZCV 0110. So `eq`, `ge`, `le`, `cs` and `ls` are yes. `ne`, `gt`, `lt`, `hi` and `cc` are no.

With `0x7fffffff` and `0xffffffff`, `cmp w0, w1` leaves NZCV 1001. N is 1, yet 2147483647 is not less than −1. The signed subtraction overflowed, so V is 1 too. N equals V, so `ge` is yes. As unsigned, `cc` is yes.

A condition read after something other than `cmp` uses the flags that the last instruction to set them wrote.

*End of closed note.*

*Two values you choose, the flags `cmp` leaves, and each condition beside whether it holds.*

## 8. What GCC does for a yes or no answer

`bool` is a C type that holds 0 or 1. A comparison, such as `litres < reserve`, gives 1 if it is true and 0 if it is not.

`fuel_low` returns the result of this comparison:

```c
bool fuel_low(unsigned litres,
              unsigned reserve)
{
    return litres < reserve;
}
```

GCC 16.1 at `-O1` compiled it to these three instructions:

```
fuel_low:
        cmp     w0, w1
        cset    w0, cc
        ret
```

`cset w0, cc` writes 1 to `w0` when `cc` is yes, and 0 when it is no. `csel` selects between register values. `cset` writes 0 or 1.

`fuel_low(5, 8)` is 1, and `fuel_low(8, 8)` is 0.

Not every C `if` makes the processor skip instructions. `warning_light` is written with `if (litres < reserve) return 1;` and then `return 0;`. GCC 16.1 at `-O1` compiled it to the same listing, which runs every instruction. The closed note "`warning_light`, and `tst` and `ands`" shows that listing and its two results.

*Closed note: warning_light, and tst and ands*

**`warning_light`**

```
warning_light:
        cmp     w0, w1
        cset    w0, cc
        ret
```

`warning_light(5, 8)` is 1, and `warning_light(8, 8)` is 0.

**`tst` and `ands`**

Two more instructions exist in the architecture: `tst` and `ands`. GCC 16.1 at `-O1` did not use either in any listing here. The `tst` and `ands` examples below are course-written assembly.

`tst w0, 2` sets the flags from `w0` AND 2, and writes no register. N is the top bit of the AND result. Z is 1 when the AND result is 0. C and V are set to 0. With the warning word `0x2a`, `tst w0, 2` leaves NZCV 0000. With `0x28`, it leaves NZCV 0100, so Z is 1 when the service-due bit (bit 1) is clear.

`ands w1, w0, 2` writes the AND result to `w1` as well. With `0x2a`, `w1` is 2 and NZCV is 0000. `and` alone leaves the flags as they were.

*End of closed note.*

`downhill` is `bool downhill(int gradient) { return gradient < 0; }`. GCC 16.1 at `-O1` compiled it to two instructions:

```
downhill:
        lsr     w0, w0, 31
        ret
```

There is no compare. The signed reading of a number is negative exactly when its top bit is 1. `lsr w0, w0, 31` moves the top bit to the bottom, as Module 3 showed. So the result is 1 for a negative gradient, and 0 otherwise.

## 9. Read four conditions after one `cmp`

**Read four conditions after one `cmp`**

`w0` holds `0xfffffffb` and `w1` holds 2. After `cmp w0, w1`, which of `ge`, `cs`, `lt` and `cc` are yes? Enter 1 for yes and 0 for no.

Field labels: "`ge`"; "`cs`"; "`lt`"; "`cc`".

1. `cmp w0, w1` sets the flags of `w0` minus `w1`.
2. Do not give `0xfffffffb` the same meaning in both comparisons: it is −5 signed and 4294967291 unsigned. 2 is 2 either way.
3. For the simpler comparison of 8 with 8, equality makes `ge` and `cs` yes, and `lt` and `cc` no. Now apply the signed and unsigned readings to the task's unequal inputs.
4. The flags are NZCV 1010. `ge` needs N equal to V; `cs` needs C to be 1.
5. `ge` 0; `cs` 1; `lt` 1; `cc` 0.

## 10. What you now know

- `cmp` sets the flags as a subtraction would, and keeps no result.
- The order of its operands matters.
- A condition reads the flags.
- Signed and unsigned comparisons use different conditions.
- `csel` chooses one of two register values without skipping any instruction.
- `cset` writes 0 or 1 from a condition.

Question: `w0` holds 2, and `w1` holds `0xfffffffe`. After `cmp w0, w1`, what does `csel w0, w0, w1, gt` leave in `w0`? What would `hi` in place of `gt` leave?

*Closed note: Answer*

The flags are NZCV 0000. `gt` (Z is 0 and N equals V) is yes: as signed, 2 is greater than −2, so `w0` keeps 2. `hi` (C is 1 and Z is 0) is no, because C is 0: as unsigned, 2 is lower than 4294967294, so `w0` gets `0xfffffffe`.

*End of closed note.*

## 11. The model and the real processor

The simulator's conditions follow the architecture's, and its tests hold each one at all sixteen settings of the flags, checked against QEMU. `cmp` and `cmn` are names for `subs` and `adds` with the result thrown away. The course uses the names GCC prints. The simulator runs one instruction at a time.

# Lesson 2: Branches, and the run that skips

## 0. Objectives
- follow a run that skips instructions, and say how many ran;
- say what a branch, a label, taken and not taken mean;
- build `fuel_warning` from `cmp`, `cbz` and branches.

## 1. Which instruction runs next?

The trip computer classifies a gradient as steep uphill, steep downhill or neither. The result depends on how the gradient compares with 10 and −10.

`describe` returns 2 when the gradient is above 10, −2 when it is below −10, and 0 otherwise. Its C is below.

```c
int describe(int gradient)
{
    if (gradient > 10)
        return 2;
    if (gradient < -10)
        return -2;
    return 0;
}
```

GCC made the eight instructions below.

```
describe:
        cmp     w0, 10
        bgt     .L9
        cmn     w0, #10
        mov     w0, -2
        csel    w0, w0, wzr, lt
.L7:
        ret
.L9:
        mov     w0, 2
        b       .L7
```

The figure pairs instructions with the C operations they carry out. It links `cmn` to `if (gradient < -10)` and `mov w0, -2` to `return -2;`. The `csel` instruction is linked to the choice between −2 and 0. GCC records all three against `return 0;`. Those original references are available in the compiler details.

`wzr` is a register name that always reads as 0. A write to it is thrown away.

Every listing so far ran from its first instruction to its `ret`, in order. This one has two lines that end in a colon, `.L7:` and `.L9:`. Two instructions name them.

**How does the processor execute only the instructions needed for that result?**

*Closed note: Which compiler?*

GCC 16.1 with `-O1`, as in Module 0.

*End of closed note.*

*`describe` in C and the eight instructions GCC made from it. The figure pairs instructions with their related C operations, keeping the instructions in GCC's order.*

## 2. Why a function needs to skip instructions

A **label** is a name that ends in a colon. It names the place of the instruction on the line below it. A label is not an instruction, and it does not run.

A **branch** is an instruction that can change which instruction runs next.

`b .L7` always continues at `.L7`.

`bgt .L9` continues at `.L9` only when the condition `gt` holds. The condition is read from the flags, as `csel` read them. Otherwise, the next instruction runs.

When a branch goes to its label, it is **taken**. When it does not, it is **not taken**.

## 3. Predict how many instructions run

The figure runs `describe(15)` on the listing above.

**How many instructions run, counting `ret`?**

- 5
- 8
- 6
- 3

*Shown after the answer is checked.*

The answer is 5. For `describe(15)`, the run is `cmp w0, 10`, `bgt .L9` (taken), `mov w0, 2`, `b .L7` (taken) and `ret`.

`cmn`, `mov w0, -2` and `csel` were skipped. `describe(15)` returns 2.

## 4. How a branch chooses its path

Different gradients run different instructions, so the run can have a different length. The figure runs `describe` on the gradient you choose: above 10, exactly 10, below −10, or between. It draws the path the run took, marks each branch as taken, not taken or not reached, and counts the instructions that ran.

GCC writes `bgt`. Arm writes `b.gt`. It is the same instruction, and the course's assembler accepts both.

`cmn w0, #10` sets the flags from adding 10 to the gradient. Adding 10 is the same calculation as subtracting −10, so these flags compare the gradient with −10. The signed `lt` condition is therefore yes when the gradient is below −10.

`mov w0, -2` sits between `cmn` and `csel`. It leaves the flags alone, so `csel` still reads `cmn`'s flags. `csel w0, w0, wzr, lt` gives −2 when `lt` is yes, and 0 when it is no.

Both paths end at the one `ret` under `.L7`.

*Closed note: cmp with a negative number*

The GNU assembler turns `cmp w0, -10` into `cmn w0, 10`. The simulator gives the same flags for both. GCC prints `cmp w0, 10` without `#`, and `cmn w0, #10` with it. Both forms are accepted.

*End of closed note.*

*`describe` with an arrow from each branch to its label, for the gradient you choose. The instructions that did not run are greyed.*

*Said by the stepper after a step that ran a branch.*

> `{branch}` was taken. Next: `{instruction}` at `{label}`.

> `{branch}` was not taken. Next: `{instruction}`.

> `{branch}` always goes to `{label}`. Next: `{instruction}`.

## 5. Three outcomes from two tests

`fuel_warning` has three outcomes, and you choose the tests and their order.

**Write `fuel_warning`**

Write `fuel_warning(litres, reserve)`. Both are `unsigned`. Its rules, in order:

- If `litres` is 0, return 2.
- Otherwise, if `litres` is below `reserve`, return 1.
- Otherwise, return 0.

Use only `cmp`, a branch with a condition, `cbz`, `b`, `mov` and `ret`. Five calls test it. One has `litres` equal to `reserve`. One has the top bit of `litres` set.

`litres` arrives in `w0`, and `reserve` arrives in `w1`. The answer leaves in `w0`.

`cbz w0, label` goes to the label when `w0` is 0. It neither reads nor changes the flags.

Choose a different name for each label. A simple convention is to use letters and underscores, starting with a letter. Do not use a register name. You can also use GCC's `.L` prefix, but it is not required.

A label goes on its own line, followed by a colon, before the instruction it names.

1. Two questions need two tests: is `litres` 0, and is it below `reserve`. Does a `litres` of 0 also pass the second test?
2. When `reserve` is above 0, zero litres is also below the reserve. Checking "below `reserve`" first would then return 1 instead of 2.
3. For zero litres and a positive reserve, both tests would pass. A `cbz` before the comparison can select the empty-tank result first.
4. `litres` and `reserve` are `unsigned`: a value with the top bit set is a large number, so use the unsigned condition for "below", `cc`. A signed condition gets one test wrong.
5. `cbz w0, .Lempty`, `cmp w0, w1`, `b.cc .Llow`, `mov w0, 0`, `ret`, then `.Llow:` `mov w0, 1`, `ret`, then `.Lempty:` `mov w0, 2`, `ret`.

*Feedback after a failed test.*

> A `litres` of 0 returns 1. Does the check for 0 come first?

> The run for zero litres continued into the next group of instructions instead of returning. Check whether it needs a `ret` or a branch after writing its result.

> The call with the top bit set fails. Is "below" read as unsigned?

> The returned value is wrong. Follow the instructions that ran and check where they last wrote `w0`. Do your tests select the required result for this input?

> An input was overwritten. Does a `mov` into `w0` run before the last test? It would replace `litres`, which is in `w0`.

## 6. Changing `bgt` to `bge`

The figure runs `describe` with `bgt .L9` changed to `bge .L9`, on `describe(10)`.

**What does it return?**

- `0`
- `2`
- `-2`
- the run stops with an error

*Shown after the answer is checked.*

`cmp w0, 10` with 10 leaves Z 1, so NZCV is 0110.
`gt` needs Z to be 0. Z is 1, so `gt` is no.
`ge` needs N to equal V. N and V are both 0, so `ge` is yes.

GCC's `bgt` is not taken, so `describe(10)` returns 0 in six instructions. With `bge`, the branch is taken. `describe(10)` then returns 2 in five instructions.

The boundary moved: 10 now returns 2. The values on either side did not change. `describe(12)` still returns 2, and `describe(9)` still returns 0.

## 7. Branches that test a register

Four branches test a register, not the flags.

- `cbz` goes when the register is 0.
- `cbnz` goes when the register is not 0.
- `tbz w0, 1, label` goes when bit 1 of `w0` is 0.
- `tbnz` goes when that bit is 1.

None of them reads or changes the flags. `bgt` reads them.

GCC did not use `cbnz`, `tbz` or `tbnz` in any listing here. So `service` is the course's own example, not GCC's. Its listing is below. Bit 1 of the warning word is the service-due bit, as Module 3 showed.

```
service:
        tbz     w0, 1, .Lno
        mov     w0, 1
        ret
.Lno:
        mov     w0, 0
        ret
```

`service(0x2a)` returns 1. `tbz` is not taken, and three instructions run.

`service(0x28)` returns 0. `tbz` is taken, and three instructions run.

*Closed note: An excerpt of GCC's maybe_beep*

GCC 16.1 at `-O1` compiled `void maybe_beep(unsigned litres) { if (litres == 0) beep(); }`. `beep` is another function. `void` means it returns nothing.

The listing below is an excerpt. It shows the first two instructions only.

```
maybe_beep:
        cbz     w0, .L17
        ret
```

The instructions from `.L17` run `beep`. They belong to a later module, so they are not shown here.

`maybe_beep(5)` runs two instructions: `cbz` is not taken, and `ret` follows. `maybe_beep(0)` sends the run to `.L17`, because `cbz` is taken. GCC put the part that runs `beep` after the `ret`, so the straight-line path is the one where `litres` is not 0.

*End of closed note.*

## 8. When GCC uses a branch

GCC 16.1 at `-O1` made different choices for different `if`s. In `warning_light`, the `if` became `cmp` and `cset`, with no branch. In `describe`, one `if` became a branch, for `gradient > 10`, and the other became a `csel`, for `gradient < -10`. Another function, `maybe_beep`, runs `beep` only when `litres` is zero. Its `if` became a branch, `cbz`. The optional note above shows the start of that listing.

`csel` chooses between register values. `cset` writes 0 or 1. Neither can decide whether another function runs. In `maybe_beep`, the branch decides whether execution reaches the instructions that run `beep`.

These examples show what GCC produced at this setting. They do not tell us why GCC chose each instruction.

## 9. Count the runs of `describe`

**Count the runs of `describe`**

For `describe`, give what it returns and how many instructions run, for gradients 11, −10 and −11. Enter results in decimal. The boxes are grouped by gradient.

Count only instructions that run. Labels are not instructions. Include `ret`.

Field labels: "`describe(11)` returns"; "instructions run for `describe(11)`"; "`describe(-10)` returns"; "instructions run for `describe(-10)`"; "`describe(-11)` returns"; "instructions run for `describe(-11)`".

1. `bgt` is taken only when `gt` is yes after `cmp w0, 10`.
2. Do not count instructions on the path the run skips. A taken `bgt` skips `cmn`, `mov w0, -2` and `csel`; otherwise the run skips `mov w0, 2` and `b .L7`.
3. After `cmn w0, #10`, `lt` is yes only when `w0` is below −10. −10 itself is not.
4. 11 is above 10. −11 is below −10. −10 is neither.
5. 2 in 5 instructions; 0 in 6; −2 in 6.

*Feedback after a wrong count.*

> Look at which branch was taken, and which instructions it skipped.

## 10. What you now know

- A label names a place in the code. It is not an instruction.
- A branch can change which instruction runs next.
- A conditional branch is taken only when its condition holds.
- A branch that is not taken lets the next instruction run.
- `cbz` and `tbz` test a register or one bit, not the flags.
- Different inputs can run different instructions.

Question: `service` is given `0x29`. Is `tbz` taken, what does `service` return, and how many instructions run?

*Closed note: Answer*

`0x29` is `0010 1001`. Bit 1 is 0, so `tbz` is taken. The run is `tbz`, `mov w0, 0` and `ret`: three instructions. (`.Lno:` is a label, not counted.) `service` returns 0.

*End of closed note.*

## 11. The model and the real processor

Many real processors start on later instructions before a branch is decided. The results are still those of one instruction at a time. The simulator runs one instruction at a time and gives the same results.

The arrows in the figure show the program's path, not the processor's timing.
