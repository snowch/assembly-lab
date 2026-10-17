# Compiler listings for Module 5

Fetched 17 October 2026 from Compiler Explorer, ARM64 GCC 16.1.0
(`carm64g1610`), flags `-O1`. Each function was compiled separately. The
`compiler/` directory retains its submitted source, request and unmodified JSON response.
The submitted source begins with a copyright comment. The C shown below omits that
comment, and each `C` tag is the raw response source line minus one. Labels have no C tag.
Whitespace in assembly is normalised; instructions, operands and labels are unchanged.

The examples model a trip computer's dashboard brightness setting. One idle tick halves
its unsigned setting, rounding down. This is a chosen dimming policy, not a claim about
real display hardware. The interval example uses ordinary unsigned ordering of endpoints;
it does not calculate elapsed time across a counter wrap.

## dim_up

```c
unsigned dim_up(
    unsigned brightness, unsigned start,
    unsigned end)
{
    for (unsigned tick = start;
         tick < end;
         tick++)
        brightness >>= 1;
    return brightness;
}
```

```
dim_up:
  cmp w1, w2 C6
  bcs .L2 C6
.L3:
  lsr w0, w0, 1 C8
  add w1, w1, 1 C7
  cmp w2, w1 C6
  bne .L3 C6
.L2:
  ret C10
```

## dim_down

```c
unsigned dim_down(
    unsigned brightness, unsigned ticks)
{
    while (ticks != 0) {
        brightness >>= 1;
        ticks--;
    }
    return brightness;
}
```

```
dim_down:
  cbz w1, .L2 C4
.L3:
  lsr w0, w0, 1 C5
  subs w1, w1, #1 C4
  bne .L3 C4
.L2:
  ret C9
```

## dim_do

```c
unsigned dim_do(
    unsigned brightness, unsigned ticks)
{
    do {
        brightness >>= 1;
        ticks--;
    } while (ticks != 0);
    return brightness;
}
```

```
dim_do:
.L2:
  lsr w0, w0, 1 C5
  subs w1, w1, #1 C7
  bne .L2 C7
  ret C9
```

## dim_wrong

```c
unsigned dim_wrong(
    unsigned brightness, unsigned ticks)
{
    while (ticks >= 0) {
        brightness >>= 1;
        ticks--;
    }
    return brightness;
}
```

```
dim_wrong:
.L2:
  b .L2 C4
```

## Interpretation and boundaries

- `dim_up` guards before the body. Equal or descending endpoints execute no body.
  Its last iteration increments `end - 1` to `end`, including when `end` is `UINT_MAX`.
  The generated backedge tests equality because the first test already established
  `start < end`, and the counter advances by one.
- `dim_down` tests the zero count before the body. Its `subs` sets the flags used by
  `bne`, without a separate `cmp`.
- `dim_do` has no initial test. A zero count is decremented to `UINT_MAX`; this call
  takes 2³² body visits before the count reaches zero again. It is long but finite.
- Every unsigned `ticks` satisfies `ticks >= 0`. This GCC build emits a branch to
  itself for `dim_wrong`. C23 draft N3096 6.8.5 paragraph 4 allows implementations
  to assume termination for a nonconstant controlling expression when the loop has
  no listed observable operations. This output is therefore a fact about this GCC
  compilation, not a portable claim that every compiler must preserve that loop.
- The deliberately broken `DIM_DOWN_WRONG` assembly in `loops.listings.ts` is
  course-authored. It subtracts, then compares the resulting unsigned count with
  zero, overwriting the subtraction flags. `cmp w1, #0` always sets C, and `bcs`
  always takes its backedge. Its nontermination follows from that condition,
  not from reaching the simulator's step limit.
- The countdown construction reference exits when either ticks or brightness is
  zero. It gives the same returned brightness as `dim_down` but avoids unnecessary
  zero shifts. An arbitrary 32-bit brightness needs at most 32 shifts to reach zero.

## Source checks

C23 public draft N3096 (1 April 2023), downloaded from
<https://www.open-std.org/jtc1/sc22/wg14/www/docs/n3096.pdf> on 17 October 2026:

- 6.2.5 paragraph 11: unsigned range and arithmetic modulo 2ᴺ.
- 6.8.5 paragraph 3: repetition until the controlling expression compares equal to zero.
- 6.8.5 paragraph 4: restricted permission to assume termination.
- 6.8.5.1 paragraph 1: `while` tests before each body execution.
- 6.8.5.2 paragraph 1: `do` tests after each body execution.
- 6.8.5.3 paragraph 1: `for` initialisation, test, body and update order.

The A64 instruction behaviour is checked against GNU as 2.44 and QEMU 10.0.13 by
`scripts/real-tools/check.mjs` with the Module 5 corpus. Incomplete traces compare
only the requested prefix. They do not establish termination or nontermination.

## Rejected example

Repeated distance addition was tried first. At this setting GCC kept an empty
counter loop and replaced the accumulated result with `madd`. Multiplication is
outside the learner's prerequisites. Repeated shifts keep a meaningful loop body
using instructions already taught, and fit a dashboard setting in the trip computer.

A `dim_until_dark` C candidate is also retained in `compiler/`. GCC emits `ccmp` for
its combined condition. That instruction has not been introduced, so this candidate's
assembly is not shown or run by the lesson. The capstone's C describes the required
result; its reference assembly is course-authored and checked against QEMU.
