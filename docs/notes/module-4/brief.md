# Brief: draft Module 4's two lessons from facts, a part at a time

Same rules as before: every fact used, none added, no meaning changed; numbers, registers,
instruction and C text exactly as given. Read the style rules in
`/tmp/claude-0/-home-user/7d96cd44-305c-57f1-92b2-23ddaca03a5e/scratchpad/al/style-body.md` first.
British English, plain words, about twenty words a sentence, active voice, "you", no em dashes, no
marketing, no "in this lesson we will". Code in backticks. Captions and the line "Shown after the
answer is checked" in italics; the explanation after that line in plain type. Hints as a plain
numbered list (no "concept:" labels). Headings are labels that say what the section holds, not
generic words such as "Motivation".

Read what the reader already has first:
`/home/user/assembly-lab/docs/notes/module-0/prose.md`, `docs/notes/module-1/prose.md`,
`docs/notes/module-2/prose.md`, `docs/notes/module-3/prose.md` (all under
`/home/user/assembly-lab/`). The reader knows registers, `w` and `x` names, hexadecimal, the
unsigned and signed readings, the top bit, constants, the four flags N, Z, C and V, carry,
overflow, borrow, wrap, **mask**, **field**, **shift**, **logical shift**, **arithmetic shift**,
and AND, OR, exclusive OR and NOT.

The reader's instructions: `mov`, `movk`, `add`, `sub`, `adds`, `subs`, `neg`, `negs`, `and`,
`orr`, `eor`, `lsl`, `lsr`, `asr`, `ubfx`, `bfi`, `ret`, and a shift written inside an operand
(`add w0, w0, w0, lsr 31`). The reader has seen, once, with the words "a later module explains":
`cmn w0, w1` and `cset w0, vs` (Module 2's `add_overflows`). The reader does NOT know `bic` or
`mvn` (Module 3's plan lists them, its lessons never use them), `orn`, `eon`, or any load or store.
The reader has met `#50` as "the number 50 written inside the instruction" (Module 0), so `#10` is
not new. The reader has not met `wzr`, a label, or any instruction that changes which instruction
runs next.

How to read the numbers. "NZCV 0010" means the flags after that `cmp` are N 0, Z 0, C 1, V 0, in
that order. Every number below was produced by running the course's own simulator on the recorded
GCC 16.1 `-O1` listings or on the course's own programs. Copy listings character for character;
never reorder, repair or add an instruction to a listing. Listings are shown without the C-line
column. A function is GCC's only where it is marked as a recorded listing.

Four words that mean two things, so use each in one sense only:
- *condition*: only the yes-or-no question about the four flags, as Lesson 1 defines it. For the
  test inside a C `if`, say "the `if`'s test", never "condition".
- *word*: only the warning word (Module 3). Never call part of an instruction a word. Say "item"
  or "name" (for example, "the last item of the instruction").
- *label*: only an assembly label (Lesson 2). The line "Field labels:" stays as in Module 3; use
  neither "label" nor "labelled" anywhere else.
- *call*: only in "Five calls test it", as in Modules 2 and 3. Never for running a function from
  inside a function.

**Terms.** Lesson 1 introduces: *compare* (the `cmp` instruction and what it does), *condition*,
and the pairs' names: *greater* and *less* for the signed reading, *higher* and *lower* for the
unsigned reading (plain English first). Lesson 2 introduces: *branch*, *label*, *taken* and *not
taken* (plain English first), and the register name `wzr`.
Never use, in either lesson: jump, goto, call (as above), link register, stack, program counter,
pipeline, speculation, sign extension, two's complement, encoding, opcode, mnemonic, immediate,
barrel shifter, loop. In Lesson 1 also never use: branch, label, taken, `b`, `bgt`, `cbz`, `tbz`,
`wzr`. Each new term arrives in the part that defines it (in bold below) and is not used before
that part: Lesson 1's *compare* in part 2, *condition* and the pair names in part 4; Lesson 2's
*branch*, *label*, *taken*, *not taken* and `wzr` in part 4. `bic`, `mvn` and `bl` never appear.

Write to `/tmp/claude-0/-home-user/7d96cd44-305c-57f1-92b2-23ddaca03a5e/scratchpad/al/drafts/m4.md`,
`# Lesson 1` with parts `## 0.` to `## 11.`, then `# Lesson 2` the same.

# Lesson 1: Compare, and the condition that carries the type

## 0. Objectives
- say what `cmp` leaves behind, and which flags each condition reads;
- tell the signed conditions from the unsigned ones;
- build `less_fuel` from `cmp` and `csel`.

## 1. Question (title a question)
- The trip computer returns the larger of two gradients with `steeper_s`. `steeper_u` is the same
  function with `unsigned` arguments.
- The C: `int steeper_s(int a, int b) { return a > b ? a : b; }` and
  `unsigned steeper_u(unsigned a, unsigned b) { return a > b ? a : b; }`.
- Both get the same two 32-bit patterns, `0xffffffff` and `1`. `steeper_s` returns 1.
  `steeper_u` returns 4294967295.
- Module 1: one pattern, two readings (`0xffffffff` is −1 signed and 4294967295 unsigned).
- GCC 16.1 at `-O1` compiled `steeper_s` to three instructions (recorded listing):
  ```
  steeper_s:
          cmp     w1, w0
          csel    w0, w1, w0, ge
          ret
  ```
- The question: `steeper_u` also gets the same bits and gives a different answer. What does GCC
  change in its three instructions?
- Do not say what `cmp`, `csel` or `ge` do here, and do not show `steeper_u`'s instructions.
- Caption: the C of both functions, `steeper_s`'s three instructions, and what each function
  returns for `0xffffffff` and 1.

## 2. Why a decision needs the flags (label; one paragraph)
- Module 2: `subs` subtracts, writes the answer and records the flags N, Z, C and V. A decision
  often needs only the flags, not the answer.
- `cmp w1, w0` does the subtraction of `subs` and sets the same four flags, but writes no register.
  This is a **compare**. (Checked: the flags of `cmp` equal the flags of `subs` on nine pairs of
  values, and `cmp` wrote no register.)
- `cmp` also takes a constant, as `subs` does: `cmp w0, 10`.
- `cmn w0, w1` does the same for addition: the flags of `adds`, no result. Module 2's
  `add_overflows` used `cmn w0, w1`.
- The flags keep their values until another instruction records them (Module 2).
- Do not use *condition* here.

## 3. Prediction (label; a sentence; a question; four options; an explanation)
- The figure shows `steeper_s`'s three instructions from part 1, and runs `steeper_u` and
  `steeper_s` on `0xffffffff` and 1.
- Question: what does GCC change to make `steeper_u`'s three instructions?
- Options (in this order): `cmp` becomes an instruction made for unsigned values; the operands of
  `cmp` change; only the last item of `csel` changes; `csel` becomes a different instruction.
- Correct: only the last item of `csel` changes.
- Explanation: Only the last item of `csel` changes. In `steeper_u` the instruction is
  `csel w0, w1, w0, cs`, where `steeper_s` has `ge`. The `cmp w1, w0` and the `ret` are identical.
  Do not use *condition* in the explanation.

## 4. Investigation (label; three short paragraphs; the second may be a list; a caption)
- Both listings (recorded). They differ in one item, the last item of `csel`: `ge` in `steeper_s`,
  `cs` in `steeper_u`.
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
- `w0` holds `a` and `w1` holds `b`. `cmp w1, w0` sets the flags of `w1` minus `w0`: it compares
  `b` with `a`.
- `csel w0, w1, w0, ge`: `w0` gets `w1` if the answer to a yes-or-no question about the flags is
  yes, and keeps its own value if it is no. Call the question a **condition**. The last item names
  it.
- `ge` asks about the signed reading: greater than or equal. It answers yes when N equals V.
  `cs` asks about the unsigned reading: higher or same. It answers yes when C is 1, which is when
  the subtraction needed no borrow.
- Because GCC compares `w1` with `w0`, `ge` and `cs` ask whether `b` is at least `a`. `csel` then
  picks `b` if so and `a` if not: the larger one.
- With `a` as `0xffffffff` and `b` as 1: `cmp w1, w0` is 1 minus
  `0xffffffff`; NZCV 0000. `ge` is yes (N 0 equals V 0), so `w0` gets `w1`, which is 1. `cs` is no
  (C 0, a borrow), so `w0` keeps `0xffffffff`, which is 4294967295.
- With `a` as 3 and `b` as 7: `cmp w1, w0` is 7 minus 3; NZCV 0010. Both `ge` and `cs` are yes. Both
  functions return 7.
- The compare is the same and so are the flags. Only the condition differs, and it carries the
  type: the signed names are *greater* and *less*; the unsigned names are *higher* and *lower*.
- Caption: `steeper_s` and `steeper_u` side by side; the one item that differs is marked.

## 5. Construction (label; one paragraph; challenge title; task; five hints)
- Challenge: write `less_fuel(a, b)`, which returns the smaller of two `unsigned` litres readings.
  Use only `cmp`, `csel` and `ret`. Five calls test it; in two of them one reading has the top bit
  set.
- `a` arrives in `w0` and `b` in `w1`; the answer leaves in `w0`.
- The paragraph says the function is a choice between two registers, as `steeper_u` was.
- Hints:
  1. Compare the two, then let one `csel` choose between them.
  2. The readings are `unsigned`, so use the unsigned pair of conditions.
  3. `csel w0, w0, w1, cc` would give `w0` when `cc` is yes and `w1` when it is no.
  4. `cc` is yes when C is 0, that is, when `w0` is lower than `w1` (also written `lo`). Compare
     `w0` with `w1`, in that order.
  5. `cmp w0, w1`, `csel w0, w0, w1, cc`, `ret`.
- For the checker, not the prose: reference `cmp w0, w1` / `csel w0, w0, w1, cc` / `ret`. Tests
  (a, b, result), with the NZCV of `cmp w0, w1`: (3, 7, 3) NZCV 1000; (7, 3, 3) NZCV 0010;
  (5, 5, 5) NZCV 0110; (`0x80000000`, 1, 1) NZCV 0011; (1, `0x80000000`, 1) NZCV 1001. The
  reference passes all five in three instructions. The same program with `lt` in place of `cc`
  fails the last two (it returns `0x80000000` for both). The starting point `less_fuel: ret` fails
  (7, 3), (`0x80000000`, 1).

## 6. Failure experiment (label; one paragraph; a question; four options; an explanation)
- The figure runs `steeper_u` with its last item changed from `cs` to `ge`:
  `cmp w1, w0`, `csel w0, w1, w0, ge`, `ret`, on `0x80000000` and 1.
- Question: what does it return?
- Options (in this order): `2147483648`; `1`; `0`; the run stops with an error.
- Correct: `1`.
- Explanation: `1`. `cmp w1, w0` leaves NZCV 1001. `ge` is yes because N and V are both 1, so
  `w0` gets `w1`, which is 1. The recorded `steeper_u`, with `cs`, returns 2147483648 here: C is 0,
  so `w0` keeps its value. With `ge`, the function reads the same bits as signed, where
  `0x80000000` is the smallest `int`.

## 7. What each condition reads (label; two short paragraphs, and a list; a caption)
- GCC prints the conditions `cs` and `cc`; Arm also writes them `hs` and `lo`. The assembler
  accepts both. Say this once.
- Names and the flags each reads (checked on all sixteen settings of the flags):
  - `eq` equal: Z is 1. `ne` not equal: Z is 0. Either reading.
  - Unsigned: `cs` higher or same: C is 1. `cc` lower: C is 0. `hi` higher: C is 1 and Z is 0.
    `ls` lower or same: C is 0 or Z is 1.
  - Signed: `ge` greater than or equal: N equals V. `lt` less than: N differs from V. `gt` greater
    than: Z is 0 and N equals V. `le` less than or equal: Z is 1 or N differs from V.
  - `vs` (met in Module 2): V is 1.
- In every setting of the flags, exactly one of each pair holds: `eq` and `ne`, `cs` and `cc`,
  `hi` and `ls`, `ge` and `lt`, `gt` and `le`.
- After `cmp a, b` these give: `eq` a = b; `ne` a ≠ b; `cs` a ≥ b, `cc` a < b, `hi` a > b,
  `ls` a ≤ b, all unsigned; `ge`, `lt`, `gt`, `le` the same four relations, signed. (Checked on
  2890 results from 17 × 17 pairs of patterns: no disagreement.)
- At equality: `cmp w0, w1` with 8 and 8 leaves NZCV 0110. Then `eq`, `ge`, `le`, `cs` and `ls`
  are yes; `ne`, `gt`, `lt`, `hi` and `cc` are no. `gt` is `ge` with equality left out, which is
  why `gt` reads Z as well as N and V. `hi` is `cs` with equality left out, which is why it reads Z
  as well as C.
- Why the signed pairs read V as well as N: `cmp w0, w1` with `0x7fffffff` and `0xffffffff` leaves
  NZCV 1001. N is 1, yet 2147483647 is not less than −1. The signed subtraction overflowed, so V is
  1 too. N equals V, so `ge` is yes and `lt` is no. In the same compare, `cc` is yes (unsigned,
  2147483647 is lower than 4294967295) and `cs` is no. One compare, two answers.
- Say that a condition read after something other than `cmp` means what the instruction before it
  set; Lesson 2 shows one.
- Caption: two values you choose, the flags `cmp` leaves, and each condition beside whether it
  holds.

## 8. What GCC does with the same two instructions (label; three short paragraphs)
- `fuel_low`, `bool fuel_low(unsigned litres, unsigned reserve) { return litres < reserve; }`
  (recorded listing):
  ```
  fuel_low:
          cmp     w0, w1
          cset    w0, cc
          ret
  ```
  `cset w0, cc` writes 1 to `w0` when `cc` is yes and 0 when it is no. `cc` is "lower", unsigned.
  Module 2's `cset w0, vs` worked the same way. `fuel_low(5, 8)` is 1 (NZCV 1000);
  `fuel_low(8, 8)` is 0 (NZCV 0110); `fuel_low(0x80000000, 8)` is 0 (NZCV 0011): with the top bit
  set, `litres` is a large unsigned number. Each runs three instructions.
- `warning_light`, an `if (litres < reserve) return 1;` followed by `return 0;` (recorded listing):
  ```
  warning_light:
          cmp     w0, w1
          cset    w0, cc
          ret
  ```
  The same two instructions as `fuel_low`. For this `if`, GCC 16.1 at `-O1` needed nothing more.
  `warning_light(5, 8)` is 1 and `warning_light(8, 8)` is 0.
- `downhill`, `bool downhill(int gradient) { return gradient < 0; }` (recorded listing):
  ```
  downhill:
          lsr     w0, w0, 31
          ret
  ```
  No compare: the signed reading is negative exactly when the top bit is 1, and `lsr` by 31 moves
  the top bit to the bottom. `downhill(-3)` is 1, `downhill(4)` is 0, `downhill(0)` is 0,
  `downhill(0x80000000)` is 1; each runs two instructions.
- Two more instructions, architecture only: no recorded listing in this module shows GCC using
  them, so do not say GCC emits them. `tst w0, 2` sets the flags of `w0` AND 2 and writes no
  register: N from the top bit, Z, and C and V set to 0. With the warning word `0x2a`, `tst w0, 2`
  leaves NZCV 0000; with `0x28`, NZCV 0100, so Z is 1 when the service-due bit (bit 1) is clear.
  `ands w1, w0, 2` writes the AND to `w1` as well; with `0x2a`, `w1` is 2 and NZCV is 0000. `and`
  alone leaves the flags as they were. (Module 3: GCC wrote `service_due` as `ubfx x0, x0, 1, 1`.)

## 9. Challenge (label; a sentence; challenge title; task; field labels; five hints)
- Task: `w0` holds `0xfffffffb` and `w1` holds 2. After `cmp w0, w1`, which of `ge`, `cs`, `lt` and
  `cc` are yes? Enter 1 for yes and 0 for no.
- Field labels: "`ge`"; "`cs`"; "`lt`"; "`cc`".
- Hints:
  1. `cmp w0, w1` sets the flags of `w0` minus `w1`.
  2. `0xfffffffb` is −5 signed and 4294967291 unsigned. 2 is 2 either way.
  3. `ge` and `lt` use the signed reading; `cs` and `cc` use the unsigned reading.
  4. The flags are NZCV 1010. `ge` needs N equal to V; `cs` needs C to be 1.
  5. `ge` 0; `cs` 1; `lt` 1; `cc` 0.
- For the checker: with the values swapped (`w0` 2, `w1` `0xfffffffb`), NZCV is 0000 and the
  answers are `ge` 1, `cs` 0, `lt` 0, `cc` 1. Do not use that pair anywhere in the prose.

## 10. Looking back (three questions)
- Why does `steeper_u` need no instruction that `steeper_s` lacks?
- Which flag does `cs` read, and what does it say about the subtraction?
- Why do `ge` and `lt` read V as well as N?

## 11. The model and the real processor
- The simulator's conditions follow the architecture's, and its tests hold each one at all sixteen
  settings of the flags, checked against QEMU. `cmp` and `cmn` are names for `subs` and `adds`
  with the result thrown away; the course uses the names GCC prints. The simulator runs one
  instruction at a time.

# Lesson 2: Branches, and the run that skips

## 0. Objectives
- follow a run that skips instructions, and say how many ran;
- say what a branch, a label, taken and not taken mean;
- build `fuel_warning` from `cmp`, `cbz` and branches.

## 1. Question (title a question)
- The trip computer's `describe` returns 2 when the gradient is above 10, −2 when it is below −10,
  and 0 otherwise. It is the C function:
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
- GCC 16.1 at `-O1` made eight instructions (recorded listing):
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
- Every listing so far ran from its first instruction to its `ret`, in order. This one has two
  names that end in a colon, `.L7:` and `.L9:`, and two instructions that use them, `bgt .L9` and
  `b .L7`.
- The question: how does the processor decide which instruction runs next?
- Do not define *branch*, *label*, *taken*, `wzr`, `bgt` or `b` here.
- The C line GCC recorded for each instruction: `cmp` and `bgt`, `if (gradient > 10)`; `cmn`, `mov
  w0, -2` and `csel`, `return 0;`; `.L7: ret`, the closing brace `}`; `mov w0, 2` and `b .L7`,
  `return 2;`. No instruction is recorded against `if (gradient < -10)` or `return -2;`.
- Caption: `describe` in C and the eight instructions GCC made from it. Each instruction sits beside
  the C line GCC recorded for it.

## 2. Why a function needs to skip instructions (label; one paragraph)
- A C `if` runs some statements and not others. `describe` returns different numbers for different
  gradients, so not every instruction can run every time.
- Until now each instruction ran after the one before it. A function that decides needs an
  instruction that changes which one runs next.
- Do not use *branch*, *label* or *taken* here.

## 3. Prediction (label; a sentence; a question; four options; an explanation)
- The figure runs `describe(15)` on the listing from part 1.
- Question: how many instructions run before the function returns?
- Options (in this order): 5; 8; 6; 3.
- Correct: 5.
- Explanation: 5. The run is `cmp w0, 10`, `bgt .L9`, `mov w0, 2`, `b .L7` and `ret`. The three
  instructions between `bgt .L9` and `.L7` (`cmn`, `mov w0, -2` and `csel`) did not run.
  `describe(15)` returns 2. Do not use *branch*, *taken* or *label* in the explanation.

## 4. Investigation (label; three short paragraphs and a list; a caption)
- A **branch** is an instruction that can change which instruction runs next. A **label** is a name
  for the place of an instruction: `.L9:` names the `mov w0, 2` under it. A branch names the label
  it goes to.
- `b .L7` always goes to `.L7`. `bgt .L9` goes to `.L9` only if the condition `gt` is yes, read
  from the flags exactly as `csel` read them in Lesson 1. When a branch goes to its label it is
  **taken**. When it does not, the next instruction runs and it is **not taken**.
- GCC writes `bgt`. Arm writes `b.gt`, the same instruction. The course's assembler accepts both.
- `describe(15)`: `cmp w0, 10` leaves NZCV 0010. `gt` is yes (Z is 0, N equals V), so `bgt` is
  taken to `.L9`. `mov w0, 2`, `b .L7` (taken), `ret`. Result 2 in five instructions.
- `describe(10)`: `cmp w0, 10` leaves NZCV 0110. `gt` is no (Z is 1), so `bgt` is not taken, and
  the run goes down the listing: `cmn`, `mov`, `csel`, `ret`. Result 0 in six instructions.
- `describe(-15)`: `cmp w0, 10` leaves NZCV 1010; `bgt` is not taken. `cmn w0, #10` leaves
  NZCV 1000. Result −2 (`0xfffffffe`) in six instructions. `describe(0)`: `cmp` NZCV 1000,
  `cmn` NZCV 0000, result 0 in six.
- `cmn w0, #10` sets the flags of `w0` plus 10. After it, `lt` is yes exactly when `w0` plus 10
  is below 0, that is, when `w0` is below −10. It is the same test as comparing with −10. (GNU as
  itself turns `cmp w0, -10` into `cmn w0, 10`; the simulator gives the same flags for both.) GCC
  prints `cmp w0, 10` without `#` and `cmn w0, #10` with it; both are accepted.
- `mov w0, -2` sits between `cmn` and `csel` and leaves the flags alone, so `csel` still reads
  `cmn`'s flags.
- `csel w0, w0, wzr, lt` gives `w0` (now −2) when `lt` is yes and `wzr` when it is no. `wzr`
  always reads as 0.
- Both paths end at the one `ret` under `.L7`: the first by falling through from `csel`, the
  second by `b .L7`.
- Caption: `describe` with an arrow from each branch to its label, for the gradient you choose. The
  instructions that did not run are greyed.

## 5. Construction (label; one paragraph; challenge title; task; five hints)
- Challenge: write `fuel_warning(litres, reserve)`. It returns 2 when `litres` is 0, 1 when
  `litres` is below `reserve`, and 0 otherwise. Both are `unsigned`. Use only `cmp`, a branch
  with a condition, `cbz`, `b`, `mov` and `ret`. Five calls test it: one with `litres` equal to
  `reserve`, and one with the top bit of `litres` set.
- `litres` arrives in `w0` and `reserve` in `w1`; the answer leaves in `w0`.
- The paragraph says the function has three outcomes and that you choose the tests and their order.
- `cbz w0, label` goes to the label when `w0` is 0, and neither reads nor changes the flags
  (checked: flags 0000 stay 0000, flags 1111 stay 1111).
- Hints:
  1. Two questions need two tests: is `litres` 0, and is it below `reserve`. Ask the empty one
     first.
  2. Ask "below `reserve`" first and `litres` 0 also passes it, so it returns 1, not 2.
  3. `cbz w0, label` goes to the label when `w0` is 0. `cmp w0, w1` sets the flags of `litres`
     minus `reserve`.
  4. `litres` and `reserve` are `unsigned`: a value with the top bit set is a large number, so
     use the unsigned condition for "below", `cc`. A signed condition gets one test wrong.
  5. `cbz w0, .Lempty`, `cmp w0, w1`, `b.cc .Llow`, `mov w0, 0`, `ret`, then `.Llow:` `mov w0, 1`,
     `ret`, then `.Lempty:` `mov w0, 2`, `ret`.
- For the checker, not the prose. Gate: `cmp`, `b.cond`, `cbz`, `b`, `mov`, `ret`. Tests
  (litres, reserve, result): (0, 10, 2); (9, 10, 1); (10, 10, 0); (200, 10, 0); (`0x80000000`, 10, 0).
  NZCV of `cmp w0, w1` where it runs: 9 vs 10 is 1000; 10 vs 10 is 0110; 200 vs 10 is 0010;
  `0x80000000` vs 10 is 0011. The reference above passes all five (three instructions for
  (0, 10), five for the others). A second reference using `b.cs` and two `b` instructions to a
  shared `ret` also passes (three instructions for (0, 10), six for the others). The wrong
  solution with the signed `b.lt` in place of `b.cc` passes four and fails the fifth: it returns 1
  for (`0x80000000`, 10). `b.ls` fails (10, 10), returning 1; testing `cmp` before `cbz` fails
  (0, 10), returning 1. The starting point `mov w0, 0` / `ret` fails the first two. The gate
  rejects `cset`, `csel`, `tbz` and `bl` with the "not met yet" message.

## 6. Failure experiment (label; one paragraph; a question; four options; an explanation)
- The figure runs `describe` with `bgt .L9` changed to `bge .L9`, on `describe(10)`.
- Question: what does it return?
- Options (in this order): `0`; `2`; `-2`; the run stops with an error.
- Correct: `2`.
- Explanation: 2, in five instructions. `cmp w0, 10` leaves NZCV 0110. `ge` is yes when N equals
  V, and both are 0, so the branch is taken. `gt` also needs Z to be 0, and Z is 1, so GCC's
  `bgt` is not taken and `describe(10)` returns 0. With `bge`, `describe(11)` still returns 2 and
  `describe(9)` still returns 0.

## 7. Branches that test a register (label; two short paragraphs)
- `cbz w0, .L17` goes to `.L17` when `w0` is 0; `cbnz` goes when it is not 0. Neither reads or
  changes the flags.
- `tbz w0, 1, label` goes to the label when bit 1 of `w0` is 0; `tbnz` when it is 1. No recorded
  listing in this module shows `cbnz`, `tbz` or `tbnz`; do not say GCC emits them. The course's own
  example, not GCC's:
  ```
  service:
          tbz     w0, 1, .Lno
          mov     w0, 1
          ret
  .Lno:
          mov     w0, 0
          ret
  ```
  `service(0x2a)` returns 1: bit 1 is set, `tbz` is not taken, three instructions. `service(0x28)`
  returns 0: `tbz` is taken, three instructions.
- GCC's `maybe_beep`, from `void maybe_beep(unsigned litres) { if (litres == 0) beep(); }`. Show
  only its first two instructions, as an excerpt, and say it is an excerpt (recorded listing):
  ```
  maybe_beep:
          cbz     w0, .L17
          ret
  ```
  The instructions from `.L17` run `beep` and belong to a later module; say that and do not show
  them. `maybe_beep(5)`: `cbz` is not taken and `ret` follows, two instructions. `maybe_beep(0)`:
  `cbz` is taken to `.L17`. GCC put the part that runs `beep` after the `ret`, so the straight-line
  path is the one where `litres` is not 0.

## 8. When GCC uses a branch (label; one paragraph)
- In Lesson 1, GCC 16.1 at `-O1` turned the `if` in `warning_light` into `cmp` and `cset`, with
  no branch.
- In `describe` it used one branch, for `gradient > 10`, and a `csel` for `gradient < -10`.
- In `maybe_beep` it used a branch (`cbz`).
- This is what one compiler did at one level; say so, and do not say why GCC chose.
- `csel` and `cset` choose between values in registers. Running `beep` is not a value in a
  register, so `maybe_beep` needs a branch. (This is reasoning from what `csel` does, not a claim
  about GCC.)

## 9. Challenge (label; a sentence; challenge title; task; field labels; five hints)
- Task: for `describe`, give what it returns and how many instructions run, for gradients 11, −10
  and −11. Enter results in decimal.
- Field labels: "`describe(11)` returns"; "instructions run for `describe(11)`";
  "`describe(-10)` returns"; "instructions run for `describe(-10)`"; "`describe(-11)` returns";
  "instructions run for `describe(-11)`".
- Hints:
  1. `bgt` is taken only when `gt` is yes after `cmp w0, 10`.
  2. A run that takes `bgt` skips `cmn`, `mov w0, -2` and `csel`. A run that does not take it
     skips `mov w0, 2` and `b .L7`.
  3. After `cmn w0, #10`, `lt` is yes only when `w0` is below −10. −10 itself is not.
  4. 11 is above 10. −11 is below −10. −10 is neither.
  5. 2 in 5 instructions; 0 in 6; −2 in 6.
- For the checker: `describe(11)` is 2 in five, `cmp` NZCV 0010, `bgt` taken. `describe(-10)` is 0
  in six, `cmp` NZCV 1010, `cmn` NZCV 0110. `describe(-11)` is −2 in six, `cmp` NZCV 1010, `cmn`
  NZCV 1000. Do not use these three gradients anywhere else in the prose.

## 10. Looking back (three questions)
- What decides whether a branch is taken?
- Why does `describe(10)` run six instructions and `describe(15)` run five?
- Why must `fuel_warning` test for 0 before it tests against the reserve?

## 11. The model and the real processor
- Many real processors start on later instructions before a branch is decided. The results are
  still those of one instruction at a time. The simulator runs one instruction at a time and gives
  the same results.
- The arrows in the figure show the program's path, not the processor's timing.
