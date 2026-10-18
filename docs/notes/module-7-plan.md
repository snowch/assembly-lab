# Module 7: Arrays, strings and pointers

Two lessons continue the trip computer from Module 6: `array-addresses` and
`zero-terminated-strings`. The first connects a trip's element index to its byte
address, then separates offset selection from pointer writeback. The second scans
ASCII trip labels, comparing a valid terminated scan with a bounded scan.

## Reuse and new work

Reuse `memory-stepper` for moving x registers, changed-register markers and loaded
byte highlighting. Reuse `memory-prediction`, the memory-aware run-registers grader,
and the tap editor. No new machine instruction or visual component is required.
The tap editor must retain scaled register offsets and pre-/post-index forms as a
single address operand. Branch labels must be supplied for each written loop.

## Instructions

Both lessons add no mnemonic. New forms of existing loads cover scaled register
indexing, pre-index and post-index. The compiled summation's extended ADD uses
`uxtw 2`, explained as zero-extension followed by a two-place shift.

## Checks and evidence

Exact GCC 16.1.0 `carm64g1610` requests and responses at `-O1` live under
`module-7/compiler/`; source mappings omit the submitted copyright line in the
learner listing. Course-authored assembly is marked separately. Three compiler
listings and eleven authored/reference/starting programs are in the real-tools
corpus. Tests pin memory addresses, final registers, empty cases, unsigned wrap,
ASCII zero versus digit zero, and boundaries on every bounded read.

The checking brief is `module-7/brief.md`. Every lesson has ten sections and two
written challenges. Independent learner and technical reviews remain required
before publication, followed by the repository's complete check command.
