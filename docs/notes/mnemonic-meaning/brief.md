# Instruction-name meanings: learning and source brief

## User request and outcome

The user approved adding the missing reason for constructing a constant in two parts, then asked for memorable names and styling for movk and lsl, and an audit for other instruction names that would benefit. Continue through implementation, independent review, CI, merge and public verification under the session's established authorisation.

The outcome is to connect an instruction's spelling with the operation already taught, so a reader can select and explain it in a fresh task. A full instruction dictionary, new instructions, new controls and extra exercises are outside scope. Keep essential definitions visible at their first teaching; do not move an answer across an existing gate.

## Checked facts and preparation

- Loading a constant already explains that A64 instructions have 32 bits shared by the operation, operands and constant. It teaches that not every constant fits one mov, with a one-half sufficient rule and other accepted patterns. Building a constant needs a short local motivation, not a new encoding lesson.
- The actual assembler rejects mov w0,1000000. Its mov path tries MOVZ, MOVN and logical-immediate ORR patterns. Bits in both halves alone do not prove failure. Do not broaden the one-half sufficient rule into an if-and-only-if rule, introduce MOVN incidentally, or imply that every wide constant requires two instructions.
- The current worked program is mov w0,3; movk w0,2,lsl16; ret. A second mov writes all 32 bits of w0, losing the first part. In this w0 example, movk writes one 16-bit half and keeps the other. No new numerical example or answer is needed.
- Arm's full MOVK name is Move wide with keep. The keep association should describe retained bits, not imply memory movement or that an identical written half was not written.
- LSL means logical shift left. In movk, lsl16 places the immediate in the upper half; it is part of that instruction, not another instruction and not a shift of the value already in w0. Standalone immediate LSL is an alias of UBFM; retain later alias qualifications without introducing UBFM early.
- A source audit maps the current semantic explanations to their published first-teaching pages. Most instructions already have their effects defined; augment those definitions with a short name cue rather than repeating them. Existing AND/OR/exclusive OR, branch with link, load/store pair and ordinary arithmetic names are already sufficiently connected. BIC/MVN are not taught; do not add them in this task.
- Useful checked families for source confirmation: unsigned bitfield extract/bitfield insert; final s as a local flag-setting reminder; conditional select/set; compare-and-branch zero/nonzero; test-bit-and-branch zero/nonzero; signed-load size letters and signed/unsigned extension; signed/unsigned multiply long/high; move wide with zero.
- Do not generalise one letter across all instruction names: s in adds is flag setting, not the signed interpretation of sdiv or smull. High and long have the operand/result widths of their actual instruction. Word in extension names means the 32-bit source, not a generic register width.

Primary references and the final checked-name table are recorded with the technical audit. The official Arm DDI0602 2025-12 entries have been fetched under /tmp/mnemonic-arm with an exact URL manifest. Model-source references include packages/machine/src/forms.ts and run.ts. Existing facts tests pin the worked constant and field/width examples. No machine code, compiler listing, grading rules, allowed instruction set or new model state is changed.

## Learning route and styling

Use the repository learning-design workflow. The user reported a missing causal explanation; this is user feedback, not an observed novice performance study. The smallest complete example and fresh application already exist. Keep their route: motivation and name, visible mechanism, worked trace, independent task.

Use ordinary inline code for the instruction name and bold for its expanded meaning. This reuses existing accessible Markdown/theme styles. No tooltip, interactive badge, additional heading or glossary card is required. Parallel instruction families can keep their current bullets. Add names where the mechanism is already explained, not before a prediction if that would reveal its answer. Keep source snippets and effect qualifications intact.

Potential misconceptions to guard against: mov can load every constant; movk keeps all bits even in its selected half; lsl16 shifts old w0; all s letters mean signed; compare/test branch names imply a flags write; a widened result is the high half; load signed extends only when using x names. Scope each name to the existing local explanation.

## Authoring and validation

Obtain a separate Medium copy draft after fact checking. Edit under docs/style.md, then read the whole affected published route. Synchronise canonical module/pacing text. Audit notes distinguish unchanged clear definitions from accepted gaps and retain the rationale for deferred or rejected items.

Independent technical and prerequisite-qualified learner checks inspect the final built page, phone/desktop and actual light/dark. Cover each affected lesson with focused, separate reader checks, then replay relevant existing interactions/gates where prose placement could matter. No new tests solely mirror reversible wording; use existing canonical/vocabulary/facts/schema and browser/layout checks. All required CI and exact-commit Pages/live verification precede completion. No novice, physical-device or screen-reader user study is claimed. Do not edit platform/.

## Selected first-teaching changes

Use the existing semantic explanation in these twelve source files, covering sixteen published lessons:

- constants-and-widths.prose.ts / building-constants: the concrete one-mov failure reason, MOVK and LSL modifier.
- adding-and-the-flags.prose.ts / adding-and-the-flags: the trailing s as a local setting-flags cue after flag is defined.
- masks.prose.ts / reading-and-writing-fields: UBFX in fieldReading (rendered through props.intro), BFI only in gated afterPass; keep the standalone LSL mechanism.
- shifts.prose.ts / shifts: complete the existing logical/arithmetic names with left/right in the existing bullets.
- compare-and-choose.prose.ts / compare-and-choose and conditions-and-boolean-results: CSEL/CSET beside the existing select and 0/1 mechanisms.
- branches.prose.ts / zero-and-threshold-branches and register-and-bit-branches: CBZ/CBNZ/TBZ/TBNZ in their actual teaching definitions; retain no-flags qualification.
- memory-and-addresses.prose.ts / memory-and-addresses: LDR/STR in their existing memory-direction explanation.
- loading-widths.prose.ts / loading-widths and extending-register-values: register-load signed/size cues and the existing byte/word extension names; do not imply the s in signed loads means flag setting.
- array-addresses.prose.ts / traversing-arrays: UXTW meaning within the existing add operand extension explanation, not a new standalone instruction.
- products-and-widths.prose.ts / widening-products and reading-product-halves: long and high names, retaining exact 32/64/128-bit distinctions and alias qualifications.
- division-and-remainders.prose.ts / division-and-remainders: the signed/unsigned divide names within their existing paired explanation.
- from-c-to-instructions.prose.ts / from-c-to-instructions: MOVZ's zero cue at its own first teaching.

The source audit found AND/OR/exclusive OR, BL, pair transfers and ordinary arithmetic effects already clearly connected. Leave those alone; do not add routine expansions merely to make every instruction look the same. Unchanged condition-code definitions already explain the relevant flag tests. The native and A32 routes do not need a second glossary for earlier A64 names.

## Checked primary-name inventory

The independent technical review fetched the complete Arm DDI0602 2025-12 entries via documentation-service.arm.com. Its exact-URL manifest is /tmp/mnemonic-arm/manifest.json. MOVK is Move wide with keep; MOVZ is Move wide with zero. LSL/LSR/ASR are Logical shift left/right and Arithmetic shift right. UBFX/BFI are Unsigned bitfield extract and Bitfield insert. CSEL/CSET are Conditional select and Conditional set. CBZ/CBNZ compare and branch on zero/nonzero; TBZ/TBNZ test bit and branch if zero/nonzero. LDR/STR load/store register. Load B/H sizes are byte/halfword; SB/SH/SW are signed byte/halfword/word. SXTB/UXTB are Signed/Unsigned extend byte; SXTW/UXTW sign/unsigned extend word. SMULL/UMULL are Signed/Unsigned multiply long; SMULH/UMULH are Signed/Unsigned multiply high. SDIV/UDIV are Signed/Unsigned divide. See audit.md for the retained primary URLs and local source/model qualifications.
