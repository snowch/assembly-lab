# Register orientation in the opening

User approved adding: why arithmetic uses registers rather than directly accessing memory;
how many general-purpose registers AArch64 provides; x/w width relationship in a compact diagram;
official manual links; and a named link to the existing detailed width lesson.

## Checked facts and sources

- The simulator has 31 general integer register slots (`packages/machine/src/run.ts`). Its existing
  `parseRegName` maps x0–x30 and w0–w30 to the same register indices with widths 64 and 32.
  The new schematic queries that parser; it displays architecture metadata, no values or results.
- Arm's register description and AAPCS64 §6.1.1 confirm the qualified count and two names:
  https://support.arm.com/documentation/100069/0606/Overview-of-AArch64-state/Registers-in-AArch64-state
  https://github.com/ARM-software/abi-aa/blob/main/aapcs64/aapcs64.rst
- Arm instruction reference guide D2.7 describes ADD register operands and destination;
  https://documentation-service.arm.com/static/6245c734b059dc5ff9a8bdab .
  Arm A64 guide102374_0103_01_en §15 describes transfers between memory and general registers:
  https://documentation-service.arm.com/static/68cd1a81cccf2a5517018d62 .
- Official reference entry URLs were opened and redirect to support.arm.com:
  https://developer.arm.com/documentation/ddi0602/latest/
  https://developer.arm.com/documentation/ddi0487/latest/
  Web extraction of these landing pages supplied no body text; the technical claims above use
  readable official documents and the existing executable model instead.
- Constants and widths is Module1's second lesson. Its Two names, one register section retains the
  detailed write-to-w experiment. Only its stale claim that earlier figures showed solely32bits
  changes now that the opening contains a full-width schematic.

## Scope and review

Separate copy drafting and component implementation. Essential memory/width explanation stays
visible. References are optional source details; named follow-up points to the actual lesson.
One outer full-width frame contains the narrower view; do not imply two stores or an executed
write. No prediction result, instruction value or later write-clearing answer appears early.
The worked arithmetic still begins with its inputs already in registers.

The word constant is exempt only because it occurs in the linked future title Constants and
widths; a focused term-use test guards that reason. No arithmetic constant rule moves earlier.
Memory and AArch64 are now listed as introduced in the opening. No program/call is added.
Independent learner review of each affected lesson, technical/sceptic review and final built
checks follow. Preserve all failures/reruns separately in the PR validation record.

## Focused validation and review

The separate copy command initially passed15 checks and failed one numeric-pin assertion because
31 was newly stated. The managing session added a model-grounded count/width fact check and the
new value to the stated-number pin. Its first4-file run then had36passes/1failure: the vocabulary
gate caught constant in the title of the requested later-lesson link. The exemption is explicitly
limited to that title's purpose, with a test that it is the only occurrence. No constant arithmetic
rule is introduced early. The corrected4-file run passed38 checks; component-only run passed3.
These reruns do not change either initial command's failed exit status.

Focused Fundamentals browser run:40passed, no skips/failures. This includes the new schematic,
reference disclosure links and real follow-up navigation alongside all existing activities and
fresh challenges. Typecheck and production build passed. Independent opening reader checked
375/768/1280 in both actual themes; width reader and technical checker checked375/1280 in both.
No blocking findings. Full-check and CI results are recorded in the pull-request validation.
