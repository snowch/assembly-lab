# Operand-form and prerequisite review

26 October 2026, against source base `66bd1bc` and this change. Scope: all 31 published lessons, including optional A32, checked for instruction forms or notation first required inside a larger composition. This is a source survey with a separate sceptical technical pass, not a claim of whole-course browser review. The two changed ADD lessons receive independent built-page reviews; their outcomes are recorded on the pull request.

## Implemented bridges

- Constants and widths: one visible, computed `add` with a scaled immediate. Its local explanation distinguishes the written constant, the supplied value, the only permitted scaling amounts and the different rules for `mov`/`movk`. No general shift theory is assumed before Module 3.
- Shifts: one visible, computed `add` with a shifted register input, after standalone shifts and before the signed-division composition. The stored register value remains distinct from the formed operand. Existing division prediction provides the subsequent application.

Both examples stop after one instruction; the destination is unknown until Run. Neither needs a new chapter or an extra challenge. They link to the distinct official instruction-reference entries. GNU/QEMU comparisons and source checks are recorded in the validation note.

## Additional supported follow-ups

These are review findings, not changes silently included in this ADD implementation.

| Priority | Location and evidence | Smallest useful direction |
| --- | --- | --- |
| Medium | Masks and fields, investigation → `set_gear`: supplied AND/OR/EOR examples use literal masks. `fieldPlanExplain` says “OR joins the prepared word and the positioned gear”, but the register-source instruction first appears in the final writing hint. The learner must invent a new source form while combining masking and positioning. The shared `BitOpsFigure` supports a second input, but none of this lesson's introductory function configurations supplies one. | Demonstrate OR of two register values before the combined writer, preferably within the existing field-plan explanation. This is a source-form bridge; OR's per-bit meaning is already taught. |
| Medium, progression opportunity | Calls and returns: the first listing, prediction and stepper use `trip_report`, including a saved reserve and `x19`, alongside link-register and stack mechanics. Motivation/investigation define those mechanics, so this is not an absent-definition fault. The simpler complete returning caller `report_once` is currently practised later in construction. | Assess a small caller-first demonstration before adding preservation of a second live value. Reuse the existing example rather than add one activity per opcode. Reordering needs its own built learner review. |
| Low | Masks and fields: the literal-mask examples all fit. Unlike the earlier ADD/MOV material, the lesson does not acknowledge that logical-immediate masks have pattern constraints. Existing assembler rejection cases cover non-encodable patterns; the current field task's masks fit. | Add a short qualification and suitable reference with the register-source bridge. Source-check any architecture wording before drafting; do not teach the encoding algorithm here. |
| Low | From function to executable, startup explanation: `str xzr, [x0], #8` clears storage. Branches earlier defines `wzr`; the `xzr` spelling is not explicitly connected to that definition. Numbered `wN`/`xN` views do not alone explain the zero-register name. | Identify `xzr` locally as the 64-bit zero-register spelling. No extra activity is needed. |

The learner/source auditors proposed these findings independently; the technical sceptic confirmed the quoted prerequisite gaps and limited their scope. None is evidence that current arithmetic, compiler output or native startup is incorrect. In particular, the call example already defines its instructions and the field task uses encodable masks.

## Covered or rejected candidates

- `#` spelling: Putting it together explains its supplied `#50`; Constants and widths explicitly says the prefix is optional before later authored `#` forms. GNU accepts the earlier unprefixed constants. Consistent presentation can still be improved, but this is not an unexplained required syntax failure.
- MOV/MOVK: the sufficient single-instruction rule, assembler tester, alias explanation, half selection and small complete example precede the construction. A complete catalogue of immediate encodings is unnecessary.
- Flags and comparisons: ADD/ADDS and SUB/SUBS are contrasted; unchanged flags, NEG/NEGS, condition meanings, CSEL, conditional branches and zero/bit branches have local explanations and examples before combined tasks. No extra lesson per alias is justified.
- Loads, extensions and addressing: byte/halfword widths, sign/zero extension, array scaling, pre/post-index forms and `uxtw` are explained locally before use. The ADD extended-register form is distinct from the shifted-register form addressed here.
- Products and division: the extra MADD/MSUB input, widened products, high halves and remainder reconstruction are defined and supported by small computed examples before construction.
- Calls, compiler and overflow: pair memory operations and their updates are defined; MOVZ and compiler operand forms are local; unsigned-bound and signed-overflow conditions explain the flags they rely on.
- Native and optional A32: startup, host loading and physical firmware are distinguished; supplied UART/device code has an explicit first-pass boundary. A32's register names, conditional suffixes, wide constant forms and helper-call save/restore notation are local. Optional recordings are not presented as a live A32 machine.

## Coverage and limits

The early survey covered 16 IDs: `one-addition`, `adding-a-constant`, `tiny-function`, `subtraction-and-reuse`, `instructions-in-sequence`, `meet-the-machine`, `one-pattern-three-readings`, `constants-and-widths`, `adding-and-the-flags`, `subtracting-and-the-tick-counter`, `masks`, `shifts`, `compare-and-choose`, `branches`, `counting-up`, `counting-down`.

The late survey covered 15 IDs: `memory-and-addresses`, `loading-widths`, `array-addresses`, `zero-terminated-strings`, `products-and-widths`, `division-and-remainders`, `calls-and-returns`, `recursive-calls`, `from-c-to-instructions`, `compile-a-loop`, `c-and-overflow`, `checked-arithmetic`, `from-function-to-executable`, `debug-native-instructions`, `same-c-on-a32`. The initial late scope was the 14 lessons of Modules 6–12; optional A32 (numeric module 13) was then separately audited before claiming complete published coverage.

Evidence: independent source inventories `/tmp/operand-gaps-early.md` and `/tmp/operand-gaps-late.md`, plus `/tmp/operand-technical-final-review.md`. Read-only source coverage cannot establish phone discoverability or learner comprehension across all 31 lessons. Remaining findings need focused implementation and independent built-page checking; this review does not certify that the whole course is gap-free.

## Follow-up implementation

The user subsequently authorised all four remaining findings. Their implementation and verification record is [Four prerequisite follow-ups](../prerequisite-followups/validation.md). The original findings above are retained as the dated source-review evidence; final build/CI/deployment outcomes are recorded on the follow-up pull request.
