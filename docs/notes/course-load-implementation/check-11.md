# Independent check 11: Memory and addresses

Copyright © 2026 Christopher Snow

## Verdict

No confirmed remaining finding in the reviewed change. The previous medium-severity phone mapping finding is closed in the built site at `http://127.0.0.1:4322/assembly-lab/#/lesson/memory-and-addresses`. No application change or build was made by this checker.

The exact labels “Addresses increase from left to right, then continue on the next row” and “Register bits: low → high, left to right” now accompany corresponding four-column groups on the phone as well as desktop. Every copied byte retains its source address and bit range. “Bits 0 to 31” and “Copied from memory” label the region once visually. The first memory row and destination row therefore share their grouping and direction; the former three-plus-one versus reverse two-by-two tracking problem is absent. Exact addresses remain readable in both themes. Direction for further work: preserve these matched groups and local ordering labels if this component changes.

## Prerequisites and sequence

Read AGENTS.md/CLAUDE.md, all ten lesson sections, local labels, challenge tasks and hint sequences, recorded memory listings, memoryTransferAt and memory CSS, Module 6 source/fact records and docs/sources.md. Reviewed preceding lesson prose and the entry requirements rather than crediting later memory lessons as prior teaching. Register read/write and reuse, hexadecimal significance, w/x views and clearing, return convention, paired listings, stepping and instruction editing are prior learning. Pointers are explicitly outside the entry requirements and are taught here: the question defines pointer declaration, dereferencing and const before the listing. Required prose defines bytes, addresses, brackets, endian significance and width before the first prediction. The investigation explains void and assignment through a pointer. No confirmed untaught prerequisite blocks the reviewed activities.

The first prediction combines address, width and endian significance, but its required preparation gives all three. The former suggestion for an extra rehearsal remains a design option, without observed evidence for a failure. The existing definitions, practice store, width failure prediction and copy task form a coherent sequence; no new severity is assigned.

## Browser evidence

Fresh independent contexts at 375×900 and 1280×900 in light and dark. Both actual `data-theme` and computed body backgrounds confirmed each theme (light rgb(243, 246, 245), dark rgb(16, 22, 21)). All four initial load captures were visually inspected. Script/log and captures: `/tmp/course-load-implementation/check11.cjs`, `check11.log`, `check11-{375,1280}-{light,dark}.png`.

In each context checked disabled initial commitment, locked derived walkthroughs, selection without unlock, commitment and first-load mapping; selecting alone retained the lock. Stepped the ordinary store and verified the following four bytes remained unchanged. Checked the later width prediction gate before commitment, then stepped the four-byte, byte and halfword stores and representative eight-byte load and store. The observed accessed/preserved bytes matched the prepared fixtures and recorded instruction widths. These are observed state checks, not a newly run differential test.

Back and Reset on the first load and ordinary store removed the derived transfer picture, returning to the unexecuted state. Current-operation status remained beside controls. Initial paired source is retained; on the phone its instructions remain in the contained sideways listing. No page horizontal overflow occurred in the exercised states. No captured page errors occurred after the script installed its pageerror listener (after initial navigation).

## Limits

Challenge tasks, hints and model/source references were read only; no solution was entered and no solution is reproduced here. Successful challenge grading, later hint gates, persistence/reload of committed work, keyboard-only use, screen readers, optional byte-bit expansion, every numerical input and all return-step states were not checked. Narrow/wide figures were exercised and their DOM states read in all four contexts; only the first-load figure received individual screenshot inspection in all four. External Arm/C source sites and QEMU were not rerun; technical source references were checked in the repository's recorded evidence. Full-suite results belong to the managing session. This is an interface and learning-sequence check, not a claim of measured novice completion time.
