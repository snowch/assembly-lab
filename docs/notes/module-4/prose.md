# Module 4: Compare and branch (lesson text)

Drafted by Haiku from the fact brief `brief.md` beside this file, 16 October 2026; every number
checked against the course's simulator (runs recorded with the brief) and the recorded GCC 16.1
`-O1` listings in `listings.md`. Two sentences of provenance meant for the checker were removed.
This file is the lesson's words: the lesson files keep them word for word.

# Lesson 1: Compare, and the condition that carries the type

## 0. Objectives
- say what `cmp` leaves behind, and which flags each condition reads;
- tell the signed conditions from the unsigned ones;
- build `less_fuel` from `cmp` and `csel`.

## 1. What does GCC change for `unsigned`?

The trip computer returns the larger of two gradients with `steeper_s`. `steeper_u` is the same function with `unsigned` arguments.

```c
int steeper_s(int a, int b) { return a > b ? a : b; }
unsigned steeper_u(unsigned a, unsigned b) { return a > b ? a : b; }
```

Both are given the same two 32-bit patterns, `0xffffffff` and `1`. `steeper_s` returns 1, and `steeper_u` returns 4294967295.

Module 1 showed that one pattern can have two readings. `0xffffffff` is −1 signed and 4294967295 unsigned.

GCC 16.1 at `-O1` compiled `steeper_s` to three instructions (recorded listing):

```
steeper_s:
        cmp     w1, w0
        csel    w0, w1, w0, ge
        ret
```

`steeper_u` also gets the same bits, and it gives a different answer.

**What does GCC change in its three instructions?**

*The C of both functions, `steeper_s`'s three instructions, and what each function returns for `0xffffffff` and 1.*

## 2. Why a decision needs the flags

Module 2 showed that `subs` subtracts, writes the answer and records the four flags, N, Z, C and V. A decision often needs only the flags, not the answer. `cmp w1, w0` does the subtraction of `subs` and sets the same four flags, but it writes no register. This is a **compare**. `cmp` also takes a constant, as `subs` does: `cmp w0, 10`. `cmn w0, w1` does the same for addition. It gives the flags of `adds`, with no result, and Module 2's `add_overflows` used `cmn w0, w1`. The flags keep their values until another instruction records them, as Module 2 showed.

## 3. Predict the change in `steeper_u`

The figure shows `steeper_s`'s three instructions from part 1, and runs `steeper_u` and `steeper_s` on `0xffffffff` and 1.

**What does GCC change to make `steeper_u`'s three instructions?**

- `cmp` becomes an instruction made for unsigned values.
- The operands of `cmp` change.
- Only the last item of `csel` changes.
- `csel` becomes a different instruction.

*Shown after the answer is checked.*

Only the last item of `csel` changes. In `steeper_u` the instruction is `csel w0, w1, w0, cs`, where `steeper_s` has `ge`. The `cmp w1, w0` and the `ret` are identical.

## 4. What the last item of `csel` asks

Both listings (recorded). They differ in one item, the last item of `csel`: `ge` in `steeper_s`, `cs` in `steeper_u`.

```
steeper_s:
        cmp     w1, w0
        csel    w0, w1, w0, ge
        ret
steeper_u:
        cmp     w1, w0
        csel    w0, w1, w0, cs
        ret
```

`w0` holds `a` and `w1` holds `b`. `cmp w1, w0` sets the flags of `w1` minus `w0`, so it compares `b` with `a`. `csel w0, w1, w0, ge` gives `w0` the value of `w1` if the answer to a yes-or-no question about the flags is yes. If the answer is no, `w0` keeps its own value. That question is a **condition**. The last item names it.

- `ge` asks about the signed reading: greater than or equal. It answers yes when N equals V.
- `cs` asks about the unsigned reading: higher or same. It answers yes when C is 1, which is when the subtraction needed no borrow.

Because GCC compares `w1` with `w0`, `ge` and `cs` ask whether `b` is at least `a`. `csel` then picks `b` if so, and `a` if not. That is the larger one.

With `a` as `0xffffffff` and `b` as 1: `cmp w1, w0` is 1 minus `0xffffffff`, and it leaves NZCV 0000. That lists the four flags N, Z, C and V in that order, so all four are 0. `ge` is yes (N 0 equals V 0), so `w0` gets `w1`, which is 1. `cs` is no (C 0, a borrow), so `w0` keeps `0xffffffff`, which is 4294967295.

With `a` as 3 and `b` as 7: `cmp w1, w0` is 7 minus 3, and it leaves NZCV 0010. Both `ge` and `cs` are yes. Both functions return 7.

The compare is the same, and so are the flags. Only the condition differs, and it carries the type. The signed names are *greater* and *less*. The unsigned names are *higher* and *lower*.

*`steeper_s` and `steeper_u` side by side; the one item that differs is marked.*

## 5. Choosing the smaller of two values

`less_fuel` is a choice between two registers, as `steeper_u` was.

**Write `less_fuel`**

Write `less_fuel(a, b)`, which returns the smaller of two `unsigned` litres values. Use only `cmp`, `csel` and `ret`. Five calls test it. In two of them, one value has the top bit set.

`a` arrives in `w0` and `b` in `w1`; the answer leaves in `w0`.

1. Compare the two, then let one `csel` choose between them.
2. The values are `unsigned`, so use the unsigned pair of conditions.
3. `csel w0, w0, w1, cc` would give `w0` when `cc` is yes and `w1` when it is no.
4. `cc` is yes when C is 0, that is, when `w0` is lower than `w1` (also written `lo`). Compare `w0` with `w1`, in that order.
5. `cmp w0, w1`, `csel w0, w0, w1, cc`, `ret`.

## 6. Running `steeper_u` with `ge`

The figure runs `steeper_u` with its last item changed from `cs` to `ge`, so the run is `cmp w1, w0`, `csel w0, w1, w0, ge` and `ret`, on `0x80000000` and 1.

**What does it return?**

- `2147483648`
- `1`
- `0`
- the run stops with an error

*Shown after the answer is checked.*

It returns 1. `cmp w1, w0` leaves NZCV 1001. `ge` is yes, because N and V are both 1, so `w0` gets `w1`, which is 1. The recorded `steeper_u`, with `cs`, returns 2147483648 here. C is 0, so `w0` keeps its value. With `ge`, the function reads the same bits as signed, where `0x80000000` is the smallest `int`.

## 7. What each condition reads

GCC prints the conditions `cs` and `cc`. Arm also writes them `hs` and `lo`, and the assembler accepts both.

Each name and the flags it reads, checked at all sixteen settings of the flags:

- `eq` equal: Z is 1. `ne` not equal: Z is 0. Either reading.
- Unsigned: `cs` higher or same: C is 1. `cc` lower: C is 0. `hi` higher: C is 1 and Z is 0. `ls` lower or same: C is 0 or Z is 1.
- Signed: `ge` greater than or equal: N equals V. `lt` less than: N differs from V. `gt` greater than: Z is 0 and N equals V. `le` less than or equal: Z is 1 or N differs from V.
- `vs` (met in Module 2): V is 1.

In every setting of the flags, exactly one of each pair holds: `eq` and `ne`, `cs` and `cc`, `hi` and `ls`, `ge` and `lt`, `gt` and `le`.

After `cmp a, b`, `eq` means a = b, and `ne` means a ≠ b. `cs`, `cc`, `hi` and `ls` mean a ≥ b, a < b, a > b and a ≤ b, all unsigned. `ge`, `lt`, `gt` and `le` mean the same four relations, signed.

At equality, `cmp w0, w1` with 8 and 8 leaves NZCV 0110. Then `eq`, `ge`, `le`, `cs` and `ls` are yes, and `ne`, `gt`, `lt`, `hi` and `cc` are no. `gt` is `ge` with equality left out, which is why `gt` reads Z as well as N and V. `hi` is `cs` with equality left out, which is why it reads Z as well as C.

The signed pairs read V as well as N. Take `cmp w0, w1` with `0x7fffffff` and `0xffffffff`. It leaves NZCV 1001. N is 1, yet 2147483647 is not less than −1. The signed subtraction overflowed, so V is 1 too. N equals V, so `ge` is yes and `lt` is no. In the same compare, `cc` is yes, because unsigned, 2147483647 is lower than 4294967295, and `cs` is no. One compare, two answers.

A condition read after something other than `cmp` uses the flags that the instruction before it set. Lesson 2 shows one.

*Two values you choose, the flags `cmp` leaves, and each condition beside whether it holds.*

## 8. What GCC does with the same two instructions

GCC 16.1 at `-O1` compiled `fuel_low`, `bool fuel_low(unsigned litres, unsigned reserve) { return litres < reserve; }`, to this (recorded listing):

```
fuel_low:
        cmp     w0, w1
        cset    w0, cc
        ret
```

`cset w0, cc` writes 1 to `w0` when `cc` is yes, and 0 when it is no. `cc` is "lower", unsigned. Module 2's `cset w0, vs` worked the same way. `fuel_low(5, 8)` is 1 (NZCV 1000), `fuel_low(8, 8)` is 0 (NZCV 0110), and `fuel_low(0x80000000, 8)` is 0 (NZCV 0011). With the top bit set, `litres` is a large unsigned number. Each runs three instructions.

`warning_light` has an `if (litres < reserve) return 1;` followed by `return 0;`. GCC 16.1 at `-O1` compiled it to the same listing (recorded listing):

```
warning_light:
        cmp     w0, w1
        cset    w0, cc
        ret
```

The two instructions are the same as in `fuel_low`. For this `if`, GCC 16.1 at `-O1` needed nothing more. `warning_light(5, 8)` is 1, and `warning_light(8, 8)` is 0.

`downhill`, `bool downhill(int gradient) { return gradient < 0; }`, is recorded as:

```
downhill:
        lsr     w0, w0, 31
        ret
```

There is no compare. The signed reading is negative exactly when the top bit is 1, and `lsr` by 31 moves the top bit to the bottom. `downhill(-3)` is 1, `downhill(4)` is 0, `downhill(0)` is 0, and `downhill(0x80000000)` is 1. Each runs two instructions.

Two more instructions exist in the architecture. No recorded listing in this module uses them, so this is not a claim about GCC's output. `tst w0, 2` sets the flags of `w0` AND 2 and writes no register. N is the top bit of that AND, Z is 1 when it is 0, and C and V are set to 0. With the warning word `0x2a`, `tst w0, 2` leaves NZCV 0000. With `0x28`, it leaves NZCV 0100, so Z is 1 when the service-due bit (bit 1) is clear. `ands w1, w0, 2` writes the AND to `w1` as well. With `0x2a`, `w1` is 2 and NZCV is 0000. `and` alone leaves the flags as they were. (Module 3: GCC wrote `service_due` as `ubfx x0, x0, 1, 1`.)

## 9. Read four conditions after one `cmp`

This challenge reads four conditions after one `cmp`.

**Read four conditions after one `cmp`**

`w0` holds `0xfffffffb` and `w1` holds 2. After `cmp w0, w1`, which of `ge`, `cs`, `lt` and `cc` are yes? Enter 1 for yes and 0 for no.

Field labels: "`ge`"; "`cs`"; "`lt`"; "`cc`".

1. `cmp w0, w1` sets the flags of `w0` minus `w1`.
2. `0xfffffffb` is −5 signed and 4294967291 unsigned. 2 is 2 either way.
3. `ge` and `lt` use the signed reading; `cs` and `cc` use the unsigned reading.
4. The flags are NZCV 1010. `ge` needs N equal to V; `cs` needs C to be 1.
5. `ge` 0; `cs` 1; `lt` 1; `cc` 0.

## 10. Looking back

- Why does `steeper_u` need no instruction that `steeper_s` lacks?
- Which flag does `cs` read, and what does it say about the subtraction?
- Why do `ge` and `lt` read V as well as N?

## 11. The model and the real processor

The simulator's conditions follow the architecture's, and its tests hold each one at all sixteen settings of the flags, checked against QEMU. `cmp` and `cmn` are names for `subs` and `adds` with the result thrown away. The course uses the names GCC prints. The simulator runs one instruction at a time.

# Lesson 2: Branches, and the run that skips

## 0. Objectives
- follow a run that skips instructions, and say how many ran;
- say what a branch, a label, taken and not taken mean;
- build `fuel_warning` from `cmp`, `cbz` and branches.

## 1. Which instruction runs next?

The trip computer's `describe` returns 2 when the gradient is above 10, −2 when it is below −10, and 0 otherwise. It is the C function:

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

GCC 16.1 at `-O1` made eight instructions (recorded listing):

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

Every listing so far ran from its first instruction to its `ret`, in order. This one has two names that end in a colon, `.L7:` and `.L9:`, and two instructions that use them, `bgt .L9` and `b .L7`.

**How does the processor decide which instruction runs next?**

The figure puts each instruction beside the C line GCC recorded for it. `cmp` and `bgt` sit beside `if (gradient > 10)`. `cmn`, `mov w0, -2` and `csel` sit beside `return 0;`. `.L7:` and `ret` sit beside the closing brace `}`. `mov w0, 2` and `b .L7` sit beside `return 2;`. No instruction is recorded against `if (gradient < -10)` or `return -2;`.

*`describe` in C and the eight instructions GCC made from it. Each instruction sits beside the C line GCC recorded for it.*

## 2. Why a function needs to skip instructions

A C `if` runs some statements and not others. `describe` returns different numbers for different gradients, so not every instruction can run every time. Until now, each instruction ran after the one before it. A function that decides needs an instruction that changes which one runs next.

## 3. Predict how many instructions run

The figure runs `describe(15)` on the listing from part 1.

**How many instructions run before the function returns?**

- 5
- 8
- 6
- 3

*Shown after the answer is checked.*

The answer is 5. The run is `cmp w0, 10`, `bgt .L9`, `mov w0, 2`, `b .L7` and `ret`. The three instructions between `bgt .L9` and `.L7` (`cmn`, `mov w0, -2` and `csel`) did not run. `describe(15)` returns 2.

## 4. How a branch chooses its path

A **branch** is an instruction that can change which instruction runs next. A **label** is a name for the place of an instruction: `.L9:` names the `mov w0, 2` under it. A branch names the label it goes to.

`b .L7` always goes to `.L7`. `bgt .L9` goes to `.L9` only if the condition `gt` is yes, read from the flags exactly as `csel` read them in Lesson 1. When a branch goes to its label, it is **taken**. When it does not, the next instruction runs, and the branch is **not taken**. GCC writes `bgt`. Arm writes `b.gt`, which is the same instruction, and the course's assembler accepts both.

- `describe(15)`: `cmp w0, 10` leaves NZCV 0010. `gt` is yes, since Z is 0 and N equals V, so `bgt` is taken to `.L9`. Then `mov w0, 2`, `b .L7` (taken) and `ret`. The result is 2, in five instructions.
- `describe(10)`: `cmp w0, 10` leaves NZCV 0110. `gt` is no, since Z is 1, so `bgt` is not taken. The run goes down the listing: `cmn`, `mov`, `csel` and `ret`. The result is 0, in six instructions.
- `describe(-15)`: `cmp w0, 10` leaves NZCV 1010, so `bgt` is not taken. `cmn w0, #10` leaves NZCV 1000. The result is −2 (`0xfffffffe`), in six instructions.
- `describe(0)`: `cmp` leaves NZCV 1000, and `cmn` leaves NZCV 0000. The result is 0, in six instructions.

`cmn w0, #10` sets the flags of `w0` plus 10. After it, `lt` is yes exactly when `w0` plus 10 is below 0, that is, when `w0` is below −10. It is the same test as comparing with −10. GNU as itself turns `cmp w0, -10` into `cmn w0, 10`, and the simulator gives the same flags for both. GCC prints `cmp w0, 10` without `#` and `cmn w0, #10` with it. Both forms are accepted.

`mov w0, -2` sits between `cmn` and `csel` and leaves the flags alone, so `csel` still reads `cmn`'s flags. `csel w0, w0, wzr, lt` gives `w0` (now −2) when `lt` is yes, and `wzr` when it is no. `wzr` is a register name that always reads as 0. Both paths end at the one `ret` under `.L7`: the first by falling through from `csel`, and the second by `b .L7`.

*`describe` with an arrow from each branch to its label, for the gradient you choose. The instructions that did not run are greyed.*

## 5. Three outcomes from two tests

`fuel_warning` has three outcomes, and you choose the tests and their order.

**Write `fuel_warning`**

Write `fuel_warning(litres, reserve)`. It returns 2 when `litres` is 0, 1 when `litres` is below `reserve`, and 0 otherwise. Both are `unsigned`. Use only `cmp`, a branch with a condition, `cbz`, `b`, `mov` and `ret`. Five calls test it: one with `litres` equal to `reserve`, and one with the top bit of `litres` set.

`litres` arrives in `w0` and `reserve` in `w1`; the answer leaves in `w0`. `cbz w0, label` goes to the label when `w0` is 0. It neither reads nor changes the flags: with flags 0000 or 1111, they stay the same.

1. Two questions need two tests: is `litres` 0, and is it below `reserve`. Ask the empty one first.
2. Ask "below `reserve`" first and `litres` 0 also passes it, so it returns 1, not 2.
3. `cbz w0, label` goes to the label when `w0` is 0. `cmp w0, w1` sets the flags of `litres` minus `reserve`.
4. `litres` and `reserve` are `unsigned`: a value with the top bit set is a large number, so use the unsigned condition for "below", `cc`. A signed condition gets one test wrong.
5. `cbz w0, .Lempty`, `cmp w0, w1`, `b.cc .Llow`, `mov w0, 0`, `ret`, then `.Llow:` `mov w0, 1`, `ret`, then `.Lempty:` `mov w0, 2`, `ret`.

## 6. Changing `bgt` to `bge`

The figure runs `describe` with `bgt .L9` changed to `bge .L9`, on `describe(10)`.

**What does it return?**

- `0`
- `2`
- `-2`
- the run stops with an error

*Shown after the answer is checked.*

It returns 2, in five instructions. `cmp w0, 10` leaves NZCV 0110. `ge` is yes when N equals V, and both are 0, so the branch is taken. `gt` also needs Z to be 0, and Z is 1, so GCC's `bgt` is not taken and `describe(10)` returns 0. With `bge`, `describe(11)` still returns 2, and `describe(9)` still returns 0.

## 7. Branches that test a register

`cbz w0, .L17` goes to `.L17` when `w0` is 0, and `cbnz` goes when it is not 0. Neither reads nor changes the flags. `tbz w0, 1, label` goes to the label when bit 1 of `w0` is 0, and `tbnz` goes when it is 1. No recorded listing in this module uses `cbnz`, `tbz` or `tbnz`, so none of them is shown as GCC's output. The course's own example, which is not GCC's, is:

```
service:
        tbz     w0, 1, .Lno
        mov     w0, 1
        ret
.Lno:
        mov     w0, 0
        ret
```

`service(0x2a)` returns 1. Bit 1 is set, so `tbz` is not taken, and three instructions run. `service(0x28)` returns 0. `tbz` is taken, and three instructions run.

GCC's `maybe_beep`, from `void maybe_beep(unsigned litres) { if (litres == 0) beep(); }`, is shown here as an excerpt: its first two instructions only (recorded listing):

```
maybe_beep:
        cbz     w0, .L17
        ret
```

The instructions from `.L17` run `beep`. They belong to a later module, so they are not shown. `maybe_beep(5)` runs two instructions: `cbz` is not taken, and `ret` follows. `maybe_beep(0)` sends the run to `.L17`, because `cbz` is taken. GCC put the part that runs `beep` after the `ret`, so the straight-line path is the one where `litres` is not 0.

## 8. When GCC uses a branch

In Lesson 1, GCC 16.1 at `-O1` turned the `if` in `warning_light` into `cmp` and `cset`, with no branch. In `describe`, it used one branch, for `gradient > 10`, and a `csel` for `gradient < -10`. In `maybe_beep`, it used a branch, `cbz`. This is what one compiler did at one level: GCC 16.1 at `-O1`. `csel` and `cset` choose between values in registers. Running `beep` is not a value in a register, so `maybe_beep` needs a branch. That reasoning comes from what `csel` does. It is not a claim about why GCC chose the branch.

## 9. Count the runs of `describe`

This challenge counts the instructions in three runs of `describe`.

**Count the runs of `describe`**

For `describe`, give what it returns and how many instructions run, for gradients 11, −10 and −11. Enter results in decimal.

Field labels: "`describe(11)` returns"; "instructions run for `describe(11)`"; "`describe(-10)` returns"; "instructions run for `describe(-10)`"; "`describe(-11)` returns"; "instructions run for `describe(-11)`".

1. `bgt` is taken only when `gt` is yes after `cmp w0, 10`.
2. A run that takes `bgt` skips `cmn`, `mov w0, -2` and `csel`. A run that does not take it skips `mov w0, 2` and `b .L7`.
3. After `cmn w0, #10`, `lt` is yes only when `w0` is below −10. −10 itself is not.
4. 11 is above 10. −11 is below −10. −10 is neither.
5. 2 in 5 instructions; 0 in 6; −2 in 6.

## 10. Looking back

- What decides whether a branch is taken?
- Why does `describe(10)` run six instructions and `describe(15)` run five?
- Why must `fuel_warning` test for 0 before it tests against the reserve?

## 11. The model and the real processor

Many real processors start on later instructions before a branch is decided. The results are still those of one instruction at a time. The simulator runs one instruction at a time and gives the same results.

The arrows in the figure show the program's path, not the processor's timing.
