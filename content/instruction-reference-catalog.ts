// Copyright © 2026 Christopher Snow

// Official Arm DDI0602 2026-09 entries. Each URL comes from the edition's
// Base Instructions index and has a separately checked instruction body.
// Evidence and the forms covered: docs/notes/lesson-instruction-references/catalog-sources.md.

export interface InstructionReference {
  readonly mnemonic: string;
  readonly label: string;
  readonly url: string;
}

/** Exact instruction forms used by the browser course; aliases retain their own entries. */
export const INSTRUCTION_REFERENCE_CATALOG = {
  "add-register": {
    mnemonic: "add",
    label: "ADD (shifted register)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/ADD--shifted-register---Add-optionally-shifted-register-?lang=en",
  },
  "add-immediate": {
    mnemonic: "add",
    label: "ADD (immediate)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/ADD--immediate---Add-immediate-value-?lang=en",
  },
  "add-extended-register": {
    mnemonic: "add",
    label: "ADD (extended register)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/ADD--extended-register---Add-extended-and-scaled-register-?lang=en",
  },
  "sub-register": {
    mnemonic: "sub",
    label: "SUB (shifted register)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/SUB--shifted-register---Subtract-optionally-shifted-register-?lang=en",
  },
  "sub-immediate": {
    mnemonic: "sub",
    label: "SUB (immediate)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/SUB--immediate---Subtract-immediate-value-?lang=en",
  },
  "adds-register": {
    mnemonic: "adds",
    label: "ADDS (shifted register)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/ADDS--shifted-register---Add-optionally-shifted-register--setting-flags-?lang=en",
  },
  "adds-immediate": {
    mnemonic: "adds",
    label: "ADDS (immediate)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/ADDS--immediate---Add-immediate-value--setting-flags-?lang=en",
  },
  "subs-register": {
    mnemonic: "subs",
    label: "SUBS (shifted register)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/SUBS--shifted-register---Subtract-optionally-shifted-register--setting-flags-?lang=en",
  },
  "subs-immediate": {
    mnemonic: "subs",
    label: "SUBS (immediate)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/SUBS--immediate---Subtract-immediate-value--setting-flags-?lang=en",
  },
  neg: {
    mnemonic: "neg",
    label: "NEG (shifted register)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/NEG--shifted-register---Negate--shifted-register---an-alias-of-SUB--shifted-register--?lang=en",
  },
  negs: {
    mnemonic: "negs",
    label: "NEGS",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/NEGS--Negate--setting-flags--an-alias-of-SUBS--shifted-register--?lang=en",
  },
  "mov-register": {
    mnemonic: "mov",
    label: "MOV (register)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/MOV--register---Move-register-value--an-alias-of-ORR--shifted-register--?lang=en",
  },
  "mov-wide-immediate": {
    mnemonic: "mov",
    label: "MOV (wide immediate)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/MOV--wide-immediate---Move-wide-immediate-value--an-alias-of-MOVZ-?lang=en",
  },
  "mov-inverted-wide-immediate": {
    mnemonic: "mov",
    label: "MOV (inverted wide immediate)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/MOV--inverted-wide-immediate---Move-inverted-wide-immediate-value--an-alias-of-MOVN-?lang=en",
  },
  "mov-bitmask-immediate": {
    mnemonic: "mov",
    label: "MOV (bitmask immediate)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/MOV--bitmask-immediate---Move-bitmask-immediate-value--an-alias-of-ORR--immediate--?lang=en",
  },
  "mov-sp": {
    mnemonic: "mov",
    label: "MOV (to/from SP)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/MOV--to-from-SP---Move-register-value-to-or-from-SP--an-alias-of-ADD--immediate--?lang=en",
  },
  movk: {
    mnemonic: "movk",
    label: "MOVK",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/MOVK--Move-wide-with-keep-?lang=en",
  },
  movz: {
    mnemonic: "movz",
    label: "MOVZ",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/MOVZ--Move-wide-with-zero-?lang=en",
  },
  "and-register": {
    mnemonic: "and",
    label: "AND (shifted register)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/AND--shifted-register---Bitwise-AND--shifted-register--?lang=en",
  },
  "and-immediate": {
    mnemonic: "and",
    label: "AND (immediate)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/AND--immediate---Bitwise-AND--immediate--?lang=en",
  },
  "orr-register": {
    mnemonic: "orr",
    label: "ORR (shifted register)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/ORR--shifted-register---Bitwise-OR--shifted-register--?lang=en",
  },
  "orr-immediate": {
    mnemonic: "orr",
    label: "ORR (immediate)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/ORR--immediate---Bitwise-OR--immediate--?lang=en",
  },
  "eor-register": {
    mnemonic: "eor",
    label: "EOR (shifted register)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/EOR--shifted-register---Bitwise-exclusive-OR--shifted-register--?lang=en",
  },
  "eor-immediate": {
    mnemonic: "eor",
    label: "EOR (immediate)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/EOR--immediate---Bitwise-exclusive-OR--immediate--?lang=en",
  },
  "ands-immediate": {
    mnemonic: "ands",
    label: "ANDS (immediate)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/ANDS--immediate---Bitwise-AND--immediate---setting-flags-?lang=en",
  },
  "tst-immediate": {
    mnemonic: "tst",
    label: "TST (immediate)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/TST--immediate---Test-bits--immediate---an-alias-of-ANDS--immediate--?lang=en",
  },
  ubfx: {
    mnemonic: "ubfx",
    label: "UBFX",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/UBFX--Unsigned-bitfield-extract--an-alias-of-UBFM-?lang=en",
  },
  bfi: {
    mnemonic: "bfi",
    label: "BFI",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/BFI--Bitfield-insert--an-alias-of-BFM-?lang=en",
  },
  "lsl-immediate": {
    mnemonic: "lsl",
    label: "LSL (immediate)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/LSL--immediate---Logical-shift-left--immediate---an-alias-of-UBFM-?lang=en",
  },
  "lsr-immediate": {
    mnemonic: "lsr",
    label: "LSR (immediate)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/LSR--immediate---Logical-shift-right--immediate---an-alias-of-UBFM-?lang=en",
  },
  "asr-immediate": {
    mnemonic: "asr",
    label: "ASR (immediate)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/ASR--immediate---Arithmetic-shift-right--immediate---an-alias-of-SBFM-?lang=en",
  },
  "cmp-register": {
    mnemonic: "cmp",
    label: "CMP (shifted register)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/CMP--shifted-register---Compare--shifted-register---an-alias-of-SUBS--shifted-register--?lang=en",
  },
  "cmp-immediate": {
    mnemonic: "cmp",
    label: "CMP (immediate)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/CMP--immediate---Compare--immediate---an-alias-of-SUBS--immediate--?lang=en",
  },
  "cmn-register": {
    mnemonic: "cmn",
    label: "CMN (shifted register)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/CMN--shifted-register---Compare-negative--shifted-register---an-alias-of-ADDS--shifted-register--?lang=en",
  },
  "cmn-immediate": {
    mnemonic: "cmn",
    label: "CMN (immediate)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/CMN--immediate---Compare-negative--immediate---an-alias-of-ADDS--immediate--?lang=en",
  },
  csel: {
    mnemonic: "csel",
    label: "CSEL",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/CSEL--Conditional-select-?lang=en",
  },
  cset: {
    mnemonic: "cset",
    label: "CSET",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/CSET--Conditional-set--an-alias-of-CSINC-?lang=en",
  },
  b: {
    mnemonic: "b",
    label: "B",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/B--Branch-?lang=en",
  },
  "b-cond": {
    mnemonic: "b.cond",
    label: "B.cond",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/B-cond--Branch-conditionally-?lang=en",
  },
  bl: {
    mnemonic: "bl",
    label: "BL",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/BL--Branch-with-link-?lang=en",
  },
  ret: {
    mnemonic: "ret",
    label: "RET",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/RET--Return-from-subroutine-?lang=en",
  },
  cbz: {
    mnemonic: "cbz",
    label: "CBZ",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/CBZ--Compare-and-branch-on-zero-?lang=en",
  },
  cbnz: {
    mnemonic: "cbnz",
    label: "CBNZ",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/CBNZ--Compare-and-branch-on-nonzero-?lang=en",
  },
  tbz: {
    mnemonic: "tbz",
    label: "TBZ",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/TBZ--Test-bit-and-branch-if-zero-?lang=en",
  },
  tbnz: {
    mnemonic: "tbnz",
    label: "TBNZ",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/TBNZ--Test-bit-and-branch-if-nonzero-?lang=en",
  },
  "ldr-immediate": {
    mnemonic: "ldr",
    label: "LDR (immediate)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/LDR--immediate---Load-register--immediate--?lang=en",
  },
  "ldr-register": {
    mnemonic: "ldr",
    label: "LDR (register)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/LDR--register---Load-register--register--?lang=en",
  },
  "str-immediate": {
    mnemonic: "str",
    label: "STR (immediate)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/STR--immediate---Store-register--immediate--?lang=en",
  },
  "strb-immediate": {
    mnemonic: "strb",
    label: "STRB (immediate)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/STRB--immediate---Store-register-byte--immediate--?lang=en",
  },
  "strh-immediate": {
    mnemonic: "strh",
    label: "STRH (immediate)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/STRH--immediate---Store-register-halfword--immediate--?lang=en",
  },
  "ldrb-immediate": {
    mnemonic: "ldrb",
    label: "LDRB (immediate)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/LDRB--immediate---Load-register-byte--immediate--?lang=en",
  },
  "ldrb-register": {
    mnemonic: "ldrb",
    label: "LDRB (register)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/LDRB--register---Load-register-byte--register--?lang=en",
  },
  "ldrsb-immediate": {
    mnemonic: "ldrsb",
    label: "LDRSB (immediate)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/LDRSB--immediate---Load-register-signed-byte--immediate--?lang=en",
  },
  "ldrh-immediate": {
    mnemonic: "ldrh",
    label: "LDRH (immediate)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/LDRH--immediate---Load-register-halfword--immediate--?lang=en",
  },
  "ldrsh-immediate": {
    mnemonic: "ldrsh",
    label: "LDRSH (immediate)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/LDRSH--immediate---Load-register-signed-halfword--immediate--?lang=en",
  },
  "ldrsw-immediate": {
    mnemonic: "ldrsw",
    label: "LDRSW (immediate)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/LDRSW--immediate---Load-register-signed-word--immediate--?lang=en",
  },
  sxtb: {
    mnemonic: "sxtb",
    label: "SXTB",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/SXTB--Signed-extend-byte--an-alias-of-SBFM-?lang=en",
  },
  uxtb: {
    mnemonic: "uxtb",
    label: "UXTB",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/UXTB--Unsigned-extend-byte--an-alias-of-UBFM-?lang=en",
  },
  sxtw: {
    mnemonic: "sxtw",
    label: "SXTW",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/SXTW--Sign-extend-word--an-alias-of-SBFM-?lang=en",
  },
  mul: {
    mnemonic: "mul",
    label: "MUL",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/MUL--Multiply--an-alias-of-MADD-?lang=en",
  },
  madd: {
    mnemonic: "madd",
    label: "MADD",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/MADD--Multiply-add-?lang=en",
  },
  smull: {
    mnemonic: "smull",
    label: "SMULL (32-bit)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/SMULL--32-bit---Signed-multiply-long--an-alias-of-SMADDL-?lang=en",
  },
  umull: {
    mnemonic: "umull",
    label: "UMULL (32-bit)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/UMULL--32-bit---Unsigned-multiply-long--an-alias-of-UMADDL-?lang=en",
  },
  smulh: {
    mnemonic: "smulh",
    label: "SMULH",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/SMULH--Signed-multiply-high-?lang=en",
  },
  umulh: {
    mnemonic: "umulh",
    label: "UMULH",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/UMULH--Unsigned-multiply-high-?lang=en",
  },
  msub: {
    mnemonic: "msub",
    label: "MSUB",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/MSUB--Multiply-subtract-?lang=en",
  },
  sdiv: {
    mnemonic: "sdiv",
    label: "SDIV (quotient)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/SDIV--quotient---Signed-divide-?lang=en",
  },
  udiv: {
    mnemonic: "udiv",
    label: "UDIV (quotient)",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/UDIV--quotient---Unsigned-divide-?lang=en",
  },
  stp: {
    mnemonic: "stp",
    label: "STP",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/STP--Store-pair-of-registers-?lang=en",
  },
  ldp: {
    mnemonic: "ldp",
    label: "LDP",
    url: "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/LDP--Load-pair-of-registers-?lang=en",
  },
} as const satisfies Readonly<Record<string, InstructionReference>>;

export type InstructionReferenceKey = keyof typeof INSTRUCTION_REFERENCE_CATALOG;
