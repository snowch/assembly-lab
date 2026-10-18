# Module 7 evidence

## Compiler records

GCC 16.1.0, Compiler Explorer ID `carm64g1610`, `-O1`, little-endian AArch64 Linux.
Three successful API responses and their exact requests are retained in `compiler/`.
`arrays.facts.test.ts` checks source text, instruction text, source-line mappings
and corpus equality. `listings.md` contains the C and tagged assembly.

## Model and QEMU

The trip fixture stores unsigned values 12, 25, 7 and 40. Index 2 accesses base+8
and returns 7. The missing-scale example accesses base+2 and loads bytes 00 00 19 00,
which form 0x00190000. Offset/pre-index/post-index runs pin both the loaded value
and the independent pointer result. Summation tests cover zero, one, three and four
entries, plus modulo-2^32 overflow.

The ASCII fixture is A-B-C, followed by zero, X, zero. Its first terminator is at
index 5. The correct scan returns 5; counting before the zero test returns 6.
An empty label returns 0. The incorrect loop returns 1. Digit zero has ASCII value
48 and is covered in marker-count tests. Bounded scan tests cover zero capacity,
an early terminator, and no terminator within the readable capacity.

Command run: `AL_TOOLS=/tmp/module5-evidence/tools node --experimental-strip-types
scripts/real-tools/check.mjs --corpus --corpus-dir /tmp/module7-corpus` (temporary
folder copied exactly the tracked `module7-*` corpus files).

Result: **14 programs, 41 calls, 481 instruction states compared, zero differences**.
The installed GNU assembler and QEMU were the same tools used for Modules 5–6.
No code example relies on a C out-of-bounds read; the deliberately incorrect scaled
load is explicitly course-authored assembly within the prepared memory region.

## Focused checks

`arrays.facts.test.ts`: 32 passed.
`module-7.test.tsx`: 15 passed (complete lessons, challenge references/negative
variants, actual model runs, gated figures and the post-index pointer/byte diagram).
The full repository suite and independent browser review are recorded separately
by the managing session before publication.
