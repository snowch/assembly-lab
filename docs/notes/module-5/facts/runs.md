# Module 5 checked run facts

Checked 17 October 2026 by `content/lessons/loops.facts.test.ts`. All counts below
come from the simulator. An iteration is one execution of the `lsr` in the body;
an instruction count includes guards, backedges and `ret`.

| Program and arguments | Result | Body visits | Instructions |
| --- | --- | --- | --- |
| `dim_up(128, 2, 5)` | 16 | 3 | 15 |
| `dim_up(128, 2, 3)` | 64 | 1 | 7 |
| `dim_up(128, 2, 4)` | 32 | 2 | 11 |
| `dim_up(128, 0, 0)` | 128 | 0 | 3 |
| `dim_up(128, 5, 2)` | 128 | 0 | 3 |
| `dim_up(128, 4294967292, 4294967295)` | 16 | 3 | 15 |
| `dim_up(128, 4294967295, 4294967295)` | 128 | 0 | 3 |
| `dim_up(0xffffffff, 0x7ffffffe, 0x80000001)` | 0x1fffffff | 3 | 15 |
| `dim_up` with backward `bne` changed to `beq`, `(128, 2, 5)` | 64 | 1 | 7 |
| `dim_down(128, 3)` | 16 | 3 | 11 |
| `dim_down(128, 0)` | 128 | 0 | 2 |
| `dim_down(0xffffffff, 31)` | 1 | 31 | 95 |
| `dim_down(0xffffffff, 32)` | 0 | 32 | 98 |
| Course countdown capstone, `(0xffffffff, 0xffffffff)` | 0 | 32 | 131 |
| Course countdown capstone, `(0, 0xffffffff)` | 0 | 0 | 3 |

For the three-iteration example, brightness changes from 128 to 64, then 32,
then 16. The backward branch is taken twice, then not taken. A backward branch
count is therefore not the same as a body-visit count.

In `dim_down(128, 3)`, `subs` leaves counts 2, 1 and 0, with NZCV respectively
0010, 0010 and 0110. The branch tests Z from that same `subs`; there is no
intervening flag-writing instruction.

For `dim_do(128, 0)`, the first decrement writes 0xffffffff (4294967295), with
NZCV 1000. A 12-instruction prefix contains four body visits and reaches the
step limit. Modulo 2³², repeatedly decrementing zero reaches zero again first
after 2³² decrements. The complete run is therefore finite, but is not simulated
in the lesson or its tests.

The deliberately broken assembly subtracts, then compares the count with zero.
For an initial count of 1, successive subtraction flags are 0110, 1000 and 1010;
the following compare replaces them with 0110, 1010 and 1010. C is always set by
unsigned comparison with zero, so `bcs` never exits. That reasoning establishes
nontermination for this assembly. The finite trace only illustrates it.

The real GCC `dim_wrong` listing contains a branch to its own label. Its
12-instruction prefix leaves brightness unchanged and executes the same branch
12 times. The claim is about that recorded output. See `../listings.md` for the
C rule that prevents making the same claim about every compiler.

The capstone exits when brightness is zero as well as when its count is zero.
Every logical shift right removes one possible set-bit position. At most 32
body visits reach zero for a 32-bit brightness. The checks therefore cover a
full `UINT_MAX` count without billions of simulated iterations.

## Real-tool checks

- `AL_TOOLS=/tmp/module5-evidence/tools`: GNU as 2.44, QEMU 10.0.13.
- Module 5 corpus: 10 programs, 42 calls, 1110 instruction states compared,
  zero differences, including prefixes for the zero-count `do` and broken loops.
- `loops.facts.test.ts`: 43 tests passed before lesson integration.
- The corpus contains the shown GCC programs, modified examples, construction
  references and common starting point. The rejected `ccmp` candidate is evidence
  in `compiler/` only; its assembly is not shown or run by the lesson.
