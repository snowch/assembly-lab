# Module 9 compiler and execution evidence

`compiler/report.c` and `compiler/fade-sum.c` are original trip-computer examples compiled through
Compiler Explorer's `carm64g1610` endpoint (GCC 16.1.0) with `-O1 -fno-inline`. The additional option
keeps calls visible by preventing inlining. Full requests and responses are adjacent to each source.
The page removes only the copyright line from C and adjusts source mappings by one. No compiler
instructions are rewritten. `calls.facts.test.ts` checks the source, flags, instructions and mappings.

`half_distance` is a leaf; `trip_report` saves x29/x30, establishes x29, saves x19 and keeps its reserve
argument in w19 across the call. Restoring full x19 preserves the caller's upper bits as well as its
low half. The compiler allocates 32 bytes: saved x29 and x30 occupy the first 16; saved x19 occupies
8 more; the final 8 bytes maintain stack alignment.

`fade_sum` allocates its frame even for the zero base case. At brightness 7, its four invocations
receive 7, 3, 1 and 0. The peak is 128 bytes, first reached after instruction 22. The result is 11
after 48 instructions. At UINT_MAX, unsigned accumulation wraps to 4294967262. This is defined
unsigned arithmetic, not signed overflow. The zero call returns in 9 instructions; the largest
32-bit input takes 425 instructions and 33 invocations.

The remaining listings are explicitly authored assembly, not purported compiler output:

- `report_once` calls the helper, adds one, and saves/restores the incoming link and frame pointer.
- `trip_report`'s exercise helper deliberately clears w1. A caller may not assume w1 survives.
- `lit_count` recursively counts nonzero brightness values, adding one after the child returns.
- Missing-link, reversed-base-case and unchanged-argument variations expose specific failures.

Every displayed program and starting/reference artifact appears in `scripts/real-tools/corpus/`.
Three additional wrapper programs initialise nonzero 64-bit x19/x29 values before calling the
reference functions. GNU as and QEMU compare every instruction's registers, flags, PC and SP with
our model, including nested returns. The wrapper restores its own caller's saved state. Bounded
prefix records cover unsafe examples; a prefix does not assert eventual return or nontermination.

Focused differential validation: **13 programs, 65 calls, 3,176 instruction states, 0 differences**.
GNU as and QEMU are provided by `/tmp/module5-evidence/tools`. Command:

```
AL_TOOLS=/tmp/module5-evidence/tools node scripts/real-tools/check.mjs --corpus --corpus-dir /tmp/module9-corpus
```

The temporary corpus directory contained exact copies of all `module9-*` repository corpus files.

# ABI source

Arm AAPCS64 2025Q4, retrieved from its release tag:
https://raw.githubusercontent.com/ARM-software/abi-aa/2025Q4/aapcs64/aapcs64.rst

Relevant headings: General-purpose Registers; The Stack; Universal stack constraints; Stack
constraints at a public interface; The Frame Pointer; Subroutine calls. These establish preserved
registers, full 64-bit preservation, active-stack bounds, SP alignment and BL's link semantics.
Frame-chain policy is platform-specific. The lessons do not claim that every function needs a frame
pointer or a stack allocation. `ret`'s default x30 target is also executed in QEMU in all examples.

The model omits caches, unwinding, asynchronous exceptions, pointer authentication, vector state and
platform stack growth. The figure displays allocations reconstructed from actual SP writes and
bytes reconstructed from stores. It does not infer a universal stack-frame layout from this GCC run.
