# A two-argument integer function

Copyright © 2026 Christopher Snow

Checked 27 October 2026. The complete source, request, response and compiler metadata in this
directory were fetched from Compiler Explorer. Endpoint:
`https://godbolt.org/api/compiler/carm64g1610/compile`. Compiler metadata came from
`https://godbolt.org/api/compilers/c` and identifies `ARM64 GCC 16.1.0`, instruction set
`aarch64`. Flags: `-g -O1 -fno-verbose-asm`; filtered output omits directives, compiler-only
labels and comment-only lines. It retains the emitted instruction order and original debug
references. The response succeeded without stderr, timeout or truncation.

## Source and teaching associations

`add_ints.c` defines a two-parameter `int` function whose return expression adds its parameters.
GCC emits exactly `add w0, w0, w1` followed by `ret`. Both original source references name line 5,
the closing brace in the submitted file. The teaching C omits the copyright comment, so the
original references are retained as displayed C4. The checked `sourceLines` associations point
both instructions at the displayed return expression, C3. The ADD computes that expression;
RET performs its transfer back to the caller. No compiler output was invented or reordered.

The exported record is `ADD_INTS` in `content/lessons/two-argument-function.listings.ts`.

## Checked calling rule

[Arm AAPCS64, release 2025Q4](https://github.com/ARM-software/abi-aa/blob/2025Q4/aapcs64/aapcs64.rst),
issued 23 January 2026, was read for this example. General-purpose Registers defines the
32-bit W and 64-bit X names for the same general-purpose register bank. Parameter passing,
Stage A's NGRN initialisation and Stage C rule C.9 allocate these two small integral arguments
in order into the low bits of x0 and x1, selected here as w0 and w1. Result return uses the
same register allocation as a first argument of that type, hence w0 for this `int` result.
The source's C mapping identifies `int` as a signed word. These are calling-convention rules
for this target, not effects of RET and not a promise that every function preserves w1.

## Executed facts

The browser model receives the shown call with w0=7 and w1=5. After ADD it has w0=12 and w1=5;
only w0 is written. RET returns to the model's caller, writes neither register and leaves the
prepared result in w0. The caller can resume only after that return. The model supplies the
call; the lesson still does not expose the instructions that make it.

The GNU/QEMU corpus contains the worked call plus seven safe signed-int cases: zero values,
a negative result, independent zero inputs, another small positive pair and both signed
boundaries without signed overflow. The facts test derives the states from the model, checks
the raw compilation data and holds the corpus instructions to the actual emitted listing.

## Verification history

- First focused facts command: 2 passed, 8 failed. The newly written test used the wrong Trace
  accessor (`trace.final` rather than `trace.result.final`) and compared the parsed label's
  colon-free representation against the emitted colon-bearing label. These test-harness errors
  were corrected without changing product instructions or weakening the comparisons.
- Focused facts rerun: **10 passed**, 1 file, 2.41 seconds; `/tmp/two-args-facts-final.log`.
- GNU/QEMU differential: **1 program, 8 calls, 24 instruction states, zero differences**,
  0.1 seconds; `/tmp/two-args-native.log`. Command:

```sh
AL_TOOLS=/tmp/operand-addition-tools node --experimental-strip-types --disable-warning=ExperimentalWarning scripts/real-tools/check.mjs --corpus --only module0-add-ints
```

No physical processor was used. QEMU user-mode checks the actual assembled instructions;
this does not claim a physical call or external hardware test.
