# Instruction-name audit

Checked against Arm DDI0602, 2025-12, and the existing simulator examples. No new executable instruction, example, state, permission or exercise answer was added.

## Accepted

See brief.md for the twelve source files and sixteen published lessons. Add expanded names within the existing effect definitions. Construction also explains the concrete one-instruction failure and the overwrite that makes MOVK necessary. BFI remains after the existing exercise gate.

## Unchanged or rejected additions

AND, OR and exclusive OR, branch with link, load/store pairs and ordinary arithmetic already connect names and effects. Condition-code definitions already give their flag tests. No dictionary or repeated native/A32 glossary is needed. BIC and MVN are supported by the machine but not taught here; introducing them would expand the task. Bits in both halves do not by themselves rule out a MOV alias. Keep that qualification and the local 32-bit width.

## Primary-source inventory

- [ADDS (extended register): Add extended and scaled register, setting flags.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/ADDS--extended-register---Add-extended-and-scaled-register--setting-flags-?lang=en)
- [ANDS (immediate): Bitwise AND (immediate), setting flags.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/ANDS--immediate---Bitwise-AND--immediate---setting-flags-?lang=en)
- [ASR (immediate): Arithmetic shift right (immediate): an alias of SBFM.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/ASR--immediate---Arithmetic-shift-right--immediate---an-alias-of-SBFM-?lang=en)
- [B: Branch.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/B--Branch-?lang=en)
- [BIC (shifted register): Bitwise bit clear (shifted register).](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/BIC--shifted-register---Bitwise-bit-clear--shifted-register--?lang=en)
- [BL: Branch with link.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/BL--Branch-with-link-?lang=en)
- [CBNZ: Compare and branch on nonzero.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/CBNZ--Compare-and-branch-on-nonzero-?lang=en)
- [CBZ: Compare and branch on zero.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/CBZ--Compare-and-branch-on-zero-?lang=en)
- [CMN (extended register): Compare negative (extended register): an alias of ADDS (extended register).](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/CMN--extended-register---Compare-negative--extended-register---an-alias-of-ADDS--extended-register--?lang=en)
- [CMP (extended register): Compare (extended register): an alias of SUBS (extended register).](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/CMP--extended-register---Compare--extended-register---an-alias-of-SUBS--extended-register--?lang=en)
- [CSEL: Conditional select.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/CSEL--Conditional-select-?lang=en)
- [CSET: Conditional set: an alias of CSINC.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/CSET--Conditional-set--an-alias-of-CSINC-?lang=en)
- [EOR (immediate): Bitwise exclusive-OR (immediate).](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/EOR--immediate---Bitwise-exclusive-OR--immediate--?lang=en)
- [LDP: Load pair of registers.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/LDP--Load-pair-of-registers-?lang=en)
- [LDR (immediate): Load register (immediate).](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/LDR--immediate---Load-register--immediate--?lang=en)
- [LDRB (immediate): Load register byte (immediate).](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/LDRB--immediate---Load-register-byte--immediate--?lang=en)
- [LDRH (immediate): Load register halfword (immediate).](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/LDRH--immediate---Load-register-halfword--immediate--?lang=en)
- [LDRSB (immediate): Load register signed byte (immediate).](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/LDRSB--immediate---Load-register-signed-byte--immediate--?lang=en)
- [LDRSH (immediate): Load register signed halfword (immediate).](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/LDRSH--immediate---Load-register-signed-halfword--immediate--?lang=en)
- [LDRSW (immediate): Load register signed word (immediate).](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/LDRSW--immediate---Load-register-signed-word--immediate--?lang=en)
- [LSL (immediate): Logical shift left (immediate): an alias of UBFM.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/LSL--immediate---Logical-shift-left--immediate---an-alias-of-UBFM-?lang=en)
- [LSR (immediate): Logical shift right (immediate): an alias of UBFM.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/LSR--immediate---Logical-shift-right--immediate---an-alias-of-UBFM-?lang=en)
- [MADD: Multiply-add.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/MADD--Multiply-add-?lang=en)
- [MOV (bitmask immediate): Move bitmask immediate value: an alias of ORR (immediate).](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/MOV--bitmask-immediate---Move-bitmask-immediate-value--an-alias-of-ORR--immediate--?lang=en)
- [MOV (inverted wide immediate): Move inverted wide immediate value: an alias of MOVN.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/MOV--inverted-wide-immediate---Move-inverted-wide-immediate-value--an-alias-of-MOVN-?lang=en)
- [MOV (wide immediate): Move wide immediate value: an alias of MOVZ.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/MOV--wide-immediate---Move-wide-immediate-value--an-alias-of-MOVZ-?lang=en)
- [MOVK: Move wide with keep.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/MOVK--Move-wide-with-keep-?lang=en)
- [MOVN: Move wide with NOT.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/MOVN--Move-wide-with-NOT-?lang=en)
- [MOVZ: Move wide with zero.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/MOVZ--Move-wide-with-zero-?lang=en)
- [MSUB: Multiply-subtract.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/MSUB--Multiply-subtract-?lang=en)
- [MUL: Multiply: an alias of MADD.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/MUL--Multiply--an-alias-of-MADD-?lang=en)
- [MVN: Bitwise NOT: an alias of ORN (shifted register).](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/MVN--Bitwise-NOT--an-alias-of-ORN--shifted-register--?lang=en)
- [ORR (immediate): Bitwise OR (immediate).](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/ORR--immediate---Bitwise-OR--immediate--?lang=en)
- [RET: Return from subroutine.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/RET--Return-from-subroutine-?lang=en)
- [SDIV: Signed divide.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/SDIV--Signed-divide-?lang=en)
- [SMULH: Signed multiply high.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/SMULH--Signed-multiply-high-?lang=en)
- [SMULL: Signed multiply long: an alias of SMADDL.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/SMULL--Signed-multiply-long--an-alias-of-SMADDL-?lang=en)
- [STP: Store pair of registers.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/STP--Store-pair-of-registers-?lang=en)
- [STR (immediate): Store register (immediate).](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/STR--immediate---Store-register--immediate--?lang=en)
- [STRB (immediate): Store register byte (immediate).](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/STRB--immediate---Store-register-byte--immediate--?lang=en)
- [SUBS (extended register): Subtract extended and scaled register, setting flags.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/SUBS--extended-register---Subtract-extended-and-scaled-register--setting-flags-?lang=en)
- [SXTB: Signed extend byte: an alias of SBFM.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/SXTB--Signed-extend-byte--an-alias-of-SBFM-?lang=en)
- [SXTW: Sign extend word: an alias of SBFM.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/SXTW--Sign-extend-word--an-alias-of-SBFM-?lang=en)
- [TBNZ: Test bit and branch if nonzero.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/TBNZ--Test-bit-and-branch-if-nonzero-?lang=en)
- [TBZ: Test bit and branch if zero.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/TBZ--Test-bit-and-branch-if-zero-?lang=en)
- [TST (immediate): Test bits (immediate): an alias of ANDS (immediate).](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/TST--immediate---Test-bits--immediate---an-alias-of-ANDS--immediate--?lang=en)
- [UBFX: Unsigned bitfield extract: an alias of UBFM.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/UBFX--Unsigned-bitfield-extract--an-alias-of-UBFM-?lang=en)
- [UDIV: Unsigned divide.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/UDIV--Unsigned-divide-?lang=en)
- [UMULH: Unsigned multiply high.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/UMULH--Unsigned-multiply-high-?lang=en)
- [UMULL: Unsigned multiply long: an alias of UMADDL.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/UMULL--Unsigned-multiply-long--an-alias-of-UMADDL-?lang=en)
- [UXTB: Unsigned extend byte: an alias of UBFM.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/UXTB--Unsigned-extend-byte--an-alias-of-UBFM-?lang=en)
- [ASRV: Arithmetic shift right variable.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/ASRV--Arithmetic-shift-right-variable-?lang=en)
- [BFI: Bitfield insert: an alias of BFM.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/BFI--Bitfield-insert--an-alias-of-BFM-?lang=en)
- [CSINC: Conditional select increment.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/CSINC--Conditional-select-increment-?lang=en)
- [LSLV: Logical shift left variable.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/LSLV--Logical-shift-left-variable-?lang=en)
- [LSRV: Logical shift right variable.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/LSRV--Logical-shift-right-variable-?lang=en)
- [NEG (shifted register): Negate (shifted register): an alias of SUB (shifted register).](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/NEG--shifted-register---Negate--shifted-register---an-alias-of-SUB--shifted-register--?lang=en)
- [NEGS: Negate, setting flags: an alias of SUBS (shifted register).](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/NEGS--Negate--setting-flags--an-alias-of-SUBS--shifted-register--?lang=en)
- [SBFM: Signed bitfield move.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/SBFM--Signed-bitfield-move-?lang=en)
- [SMADDL: Signed multiply-add long.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/SMADDL--Signed-multiply-add-long-?lang=en)
- [UBFM: Unsigned bitfield move.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/UBFM--Unsigned-bitfield-move-?lang=en)
- [UMADDL: Unsigned multiply-add long.](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Base-Instructions/UMADDL--Unsigned-multiply-add-long-?lang=en)

## Evidence limits

Technical audit used official entries and source/model probes; the initial learning audit read source only. Final built-page review and check results are recorded separately. Agent reviews are not a novice learning study.
