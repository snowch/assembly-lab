// Copyright © 2026 Christopher Snow

// Lesson 1 of Module 4: the paragraphs, hints, tasks and notes, kept word for word from
// docs/notes/module-4/prose.md (the part under "# Lesson 1"). compare-and-choose.prose.test.ts holds every string
// here to that file, so a change of wording is made there first.

export const PROSE = {
  question:
    "The trip computer returns the larger of two gradients with `steeper_s`. `steeper_u` is the same function with `unsigned` arguments.\n\n" +
    "```c\nint steeper_s(int a, int b) { return a > b ? a : b; }\nunsigned steeper_u(unsigned a, unsigned b) { return a > b ? a : b; }\n```\n\n" +
    '`a > b ? a : b` means "`a` if `a` is greater than `b`, otherwise `b`".\n\nBoth are given the same two 32-bit patterns, `0xffffffff` and `1`. `steeper_s` returns 1, and `steeper_u` returns 4294967295.\n\n' +
    "Module 1 showed that one pattern can have two readings. `0xffffffff` is −1 signed and 4294967295 unsigned.\n\n" +
    "GCC 16.1 at `-O1` compiled `steeper_s` to three instructions (recorded listing):\n\n" +
    "```\nsteeper_s:\n        cmp     w1, w0\n        csel    w0, w1, w0, ge\n        ret\n```\n\n" +
    "`csel` puts one of two registers into `w0`. Which one depends on its last item, a test of the flags that `cmp` set.\n\n`steeper_u` also gets the same bits, and it gives a different answer.\n\n" +
    "**What does GCC change in its three instructions?**",

  motivation:
    "Module 2 showed that `subs` subtracts, writes the answer and records the four flags, N, Z, C and V. A decision often needs only the flags, not the answer. `cmp w1, w0` does the subtraction of `subs` and sets the same four flags, but it writes no register. This is a **compare**. `cmp` also takes a constant, as `subs` does: `cmp w0, 10`. `cmn w0, w1` does the same for addition. It gives the flags of `adds`, with no result, and Module 2's `add_overflows` used `cmn w0, w1`. The flags keep their values until another instruction records them, as Module 2 showed.",

  prediction:
    "The figure shows `steeper_s`'s three instructions from part 1, and runs `steeper_u` and `steeper_s` on `0xffffffff` and 1.",

  predictionQuestion: "**What does GCC change to make `steeper_u`'s three instructions?**",

  predictionExplain:
    "Only the last item of `csel` changes. In `steeper_u` the instruction is `csel w0, w1, w0, cs`, where `steeper_s` has `ge`. The `cmp w1, w0` and the `ret` are identical.",

  investigation:
    "Both listings (recorded). They differ in one item, the last item of `csel`: `ge` in `steeper_s`, `cs` in `steeper_u`.\n\n" +
    "```\nsteeper_s:\n        cmp     w1, w0\n        csel    w0, w1, w0, ge\n        ret\nsteeper_u:\n        cmp     w1, w0\n        csel    w0, w1, w0, cs\n        ret\n```\n\n" +
    "`w0` holds `a` and `w1` holds `b`. `cmp w1, w0` sets the flags of `w1` minus `w0`, so it compares `b` with `a`. `csel w0, w1, w0, ge` gives `w0` the value of `w1` if the answer to a yes-or-no question about the flags is yes. If the answer is no, `w0` keeps its own value. That question is a **condition**. The last item names it.\n\n" +
    "- `ge` asks about the signed reading: greater than or equal. It answers yes when N equals V.\n- `cs` asks about the unsigned reading: higher or same. It answers yes when C is 1, which is when the subtraction needed no borrow.\n\n" +
    "Because GCC compares `w1` with `w0`, `ge` and `cs` ask whether `b` is at least `a`. `csel` then picks `b` if so, and `a` if not. That is the larger one.\n\n" +
    "With `a` as `0xffffffff` and `b` as 1: `cmp w1, w0` is 1 minus `0xffffffff`, and it leaves NZCV 0000. That lists the four flags N, Z, C and V in that order, so all four are 0. `ge` is yes (N 0 equals V 0), so `w0` gets `w1`, which is 1. `cs` is no (C 0, a borrow), so `w0` keeps `0xffffffff`, which is 4294967295.\n\n" +
    "With `a` as 3 and `b` as 7: `cmp w1, w0` is 7 minus 3, and it leaves NZCV 0010. Both `ge` and `cs` are yes. Both functions return 7.\n\n" +
    "The compare is the same, and so are the flags. Only the condition differs, and it carries the type. The signed names are *greater* and *less*. The unsigned names are *higher* and *lower*.",

  construction: "`less_fuel` is a choice between two registers, as `steeper_u` was.",

  lessFuelTask:
    "Write `less_fuel(a, b)`, which returns the smaller of two `unsigned` litres values. Use only `cmp`, `csel` and `ret`. Five calls test it. In two of them, one value has the top bit set.\n\n" +
    "`a` arrives in `w0` and `b` in `w1`; the answer leaves in `w0`.",

  lessFuelHints: [
    "Compare the two, then let one `csel` choose between them.",
    "The values are `unsigned`, so use the unsigned pair of conditions.",
    "`csel w0, w0, w1, cc` would give `w0` when `cc` is yes and `w1` when it is no.",
    "`cc` is yes when C is 0, that is, when `w0` is lower than `w1` (also written `lo`). Compare `w0` with `w1`, in that order.",
    "`cmp w0, w1`, `csel w0, w0, w1, cc`, `ret`.",
  ] as const,

  failureExperiment:
    "The figure runs `steeper_u` with its last item changed from `cs` to `ge`, so the run is `cmp w1, w0`, `csel w0, w1, w0, ge` and `ret`, on `0x80000000` and 1.",

  failureQuestion: "**What does it return?**",

  failureExplain:
    "It returns 1. `cmp w1, w0` leaves NZCV 1001. `ge` is yes, because N and V are both 1, so `w0` gets `w1`, which is 1. The recorded `steeper_u`, with `cs`, returns 2147483648 here. C is 0, so `w0` keeps its value. With `ge`, the function reads the same bits as signed, where `0x80000000` is the smallest `int`.",

  explanation:
    "GCC prints the conditions `cs` and `cc`. Arm also writes them `hs` and `lo`, and the assembler accepts both.\n\n" +
    "Each name and the flags it reads, checked at all sixteen settings of the flags:\n\n" +
    "- `eq` equal: Z is 1. `ne` not equal: Z is 0. Either reading.\n- Unsigned: `cs` higher or same: C is 1. `cc` lower: C is 0. `hi` higher: C is 1 and Z is 0. `ls` lower or same: C is 0 or Z is 1.\n- Signed: `ge` greater than or equal: N equals V. `lt` less than: N differs from V. `gt` greater than: Z is 0 and N equals V. `le` less than or equal: Z is 1 or N differs from V.\n- `vs` (met in Module 2): V is 1.\n\n" +
    "In every setting of the flags, exactly one of each pair holds: `eq` and `ne`, `cs` and `cc`, `hi` and `ls`, `ge` and `lt`, `gt` and `le`.\n\n" +
    "After `cmp a, b`, `eq` means a = b, and `ne` means a ≠ b. `cs`, `cc`, `hi` and `ls` mean a ≥ b, a < b, a > b and a ≤ b, all unsigned. `ge`, `lt`, `gt` and `le` mean the same four relations, signed.\n\n" +
    "At equality, `cmp w0, w1` with 8 and 8 leaves NZCV 0110. Then `eq`, `ge`, `le`, `cs` and `ls` are yes, and `ne`, `gt`, `lt`, `hi` and `cc` are no. `gt` is `ge` with equality left out, which is why `gt` reads Z as well as N and V. `hi` is `cs` with equality left out, which is why it reads Z as well as C.\n\n" +
    "The signed pairs read V as well as N. Take `cmp w0, w1` with `0x7fffffff` and `0xffffffff`. It leaves NZCV 1001. N is 1, yet 2147483647 is not less than −1. The signed subtraction overflowed, so V is 1 too. N equals V, so `ge` is yes and `lt` is no. In the same compare, `cc` is yes, because unsigned, 2147483647 is lower than 4294967295, and `cs` is no. One compare, two answers.\n\n" +
    "A condition read after something other than `cmp` uses the flags that the instruction before it set. Lesson 2 shows one.",

  generalisation:
    "`bool` is a C type that holds 0 or 1. A comparison such as `litres < reserve` gives 1 if it is true and 0 if not.\n\nGCC 16.1 at `-O1` compiled `fuel_low`, `bool fuel_low(unsigned litres, unsigned reserve) { return litres < reserve; }`, to this (recorded listing):\n\n" +
    "```\nfuel_low:\n        cmp     w0, w1\n        cset    w0, cc\n        ret\n```\n\n" +
    '`cset w0, cc` writes 1 to `w0` when `cc` is yes, and 0 when it is no. `cc` is "lower", unsigned. Module 2\'s `cset w0, vs` worked the same way. `fuel_low(5, 8)` is 1 (NZCV 1000), `fuel_low(8, 8)` is 0 (NZCV 0110), and `fuel_low(0x80000000, 8)` is 0 (NZCV 0011). With the top bit set, `litres` is a large unsigned number. Each runs three instructions.\n\n' +
    "`warning_light` has an `if (litres < reserve) return 1;` followed by `return 0;`. GCC 16.1 at `-O1` compiled it to the same listing (recorded listing):\n\n" +
    "```\nwarning_light:\n        cmp     w0, w1\n        cset    w0, cc\n        ret\n```\n\n" +
    "The two instructions are the same as in `fuel_low`. For this `if`, GCC 16.1 at `-O1` needed nothing more. `warning_light(5, 8)` is 1, and `warning_light(8, 8)` is 0.\n\n" +
    "`downhill`, `bool downhill(int gradient) { return gradient < 0; }`, is recorded as:\n\n" +
    "```\ndownhill:\n        lsr     w0, w0, 31\n        ret\n```\n\n" +
    "There is no compare. The signed reading is negative exactly when the top bit is 1, and `lsr` by 31 moves the top bit to the bottom. `downhill(-3)` is 1, `downhill(4)` is 0, `downhill(0)` is 0, and `downhill(0x80000000)` is 1. Each runs two instructions.\n\n" +
    "Two more instructions exist in the architecture. No recorded listing in this module uses them, so this is not a claim about GCC's output. `tst w0, 2` sets the flags of `w0` AND 2 and writes no register. N is the top bit of that AND, Z is 1 when it is 0, and C and V are set to 0. With the warning word `0x2a`, `tst w0, 2` leaves NZCV 0000. With `0x28`, it leaves NZCV 0100, so Z is 1 when the service-due bit (bit 1) is clear. `ands w1, w0, 2` writes the AND to `w1` as well. With `0x2a`, `w1` is 2 and NZCV is 0000. `and` alone leaves the flags as they were. (Module 3: GCC wrote `service_due` as `ubfx x0, x0, 1, 1`.)",

  challenge: "This challenge reads four conditions after one `cmp`.",

  holdsTask:
    "`w0` holds `0xfffffffb` and `w1` holds 2. After `cmp w0, w1`, which of `ge`, `cs`, `lt` and `cc` are yes? Enter 1 for yes and 0 for no.",

  holdsHints: [
    "`cmp w0, w1` sets the flags of `w0` minus `w1`.",
    "`0xfffffffb` is −5 signed and 4294967291 unsigned. 2 is 2 either way.",
    "`ge` and `lt` use the signed reading; `cs` and `cc` use the unsigned reading.",
    "The flags are NZCV 1010. `ge` needs N equal to V; `cs` needs C to be 1.",
    "`ge` 0; `cs` 1; `lt` 1; `cc` 0.",
  ] as const,

  reflection:
    "- Why does `steeper_u` need no instruction that `steeper_s` lacks?\n- Which flag does `cs` read, and what does it say about the subtraction?\n- Why do `ge` and `lt` read V as well as N?",

  modelVsReality:
    "The simulator's conditions follow the architecture's, and its tests hold each one at all sixteen settings of the flags, checked against QEMU. `cmp` and `cmn` are names for `subs` and `adds` with the result thrown away. The course uses the names GCC prints. The simulator runs one instruction at a time.",
} as const;
