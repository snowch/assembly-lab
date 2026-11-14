<!-- Copyright © 2026 Christopher Snow -->

# Core A64 instruction reference catalogue

Checked 14 November 2026 against Arm's *Arm A-profile A64 Instruction Set Architecture*,
DDI0602, edition 2026-09. This source record covers the browser course's core A64 entries.
The optional A32, floating-point and native-only entries have their own source record.

## URL and content evidence

The official [edition root](https://documentation-service.arm.com/documentation/ddi0602/2026-09)
identifies this document and edition. The official
[Base Instructions index](https://documentation-service.arm.com/documentation/ddi0602/2026-09/Base-Instructions)
contains each exact relative href used below. Each catalogue URL preserves that path and query
on Arm's public `support.arm.com` viewer. No instruction slug was derived from a remembered
2025-12 URL or constructed from a title.

All 70 shipped entries returned HTTP 200 from both the documentation-service entry and the public
viewer. Those are separate checks. The public viewer response is an HTML application shell;
its HTTP status alone does not prove an instruction exists or that a browser rendered its content.
For the content check, each official documentation-service response was decoded from its
base64 `content` field. Its instruction heading matches the index label in the table, and its
instruction description and operand forms were read. The full `label` also identifies the
operation and, where applicable, its alias target. This checks the link destination and taught
form, not every architectural rule or extension that the full entry documents.

Raw evidence is retained outside the repository at
`/workspace/output/instruction-catalog/`: `base-index.json`, `index-links.json`, `manifest.json`,
`<key>.json` (official entry response) and `<key>.html` (decoded body).
The manifest records both URL statuses, final URLs, content types, exact labels/headings,
UTC request times, response/body SHA-256 hashes and description excerpts.
It also contains two successfully probed register forms, ANDS and TST, omitted from this
catalogue because the current course teaches their immediate forms only.
The per-entry decoded-body hashes below make the retained content identifiable.

New-edition details matter: the 2026-09 widening entries are **SMULL (32-bit)** and
**UMULL (32-bit)**, and the division entries are **SDIV (quotient)** and **UDIV (quotient)**.
Their paths differ from the older entries. All four were fetched and read directly in this edition.

## Taught forms checked against the lessons

The catalogue covers every mnemonic in `content/lessons/introduced.ts` (`TAUGHT`). The lesson
mapping determines when a particular form enters a References disclosure. A supported mnemonic
alone does not make every architectural form taught.

- `fundamentals.prose.ts`, `constant-addition.prose.ts` and the primitive listings distinguish
  register ADD/SUB from immediate ADD. The unshifted register spelling belongs to Arm's
  **shifted register** entry because its shift is optional.
- `constants-and-widths.prose.ts` and the constant/register-width listings show MOV wide,
  inverted-wide and bitmask constants, including the optional patterns, and MOVK.
  MOV of an ordinary register has its own ORR alias. `from-c-to-instructions.prose.ts` explicitly
  teaches MOVZ. `calls-and-returns.prose.ts` and `calls.listings.ts` show `mov x29, sp`, which
  belongs to the separate **MOV (to/from SP)** ADD alias.
- `adding-and-the-flags.prose.ts`, `subtracting-and-the-tick-counter.prose.ts`, the Module 2
  listings and the negation material teach ADDS/SUBS, NEG and NEGS. The loop lessons use
  immediate SUB/SUBS; `c-and-overflow.prose.ts` shows immediate ADDS.
- `masks.prose.ts` and `logic-shifts-masks.listings.ts` teach immediate AND/ORR/EOR, permit
  register masks, and show register ORR. UBFX and BFI retain their alias entries. The field
  and shift lessons use immediate LSL/LSR/ASR; no standalone register-count shift is taught.
  ADD's optional shifted register input uses the ADD register entry, not a separate shift
  instruction entry. Similarly, `lsl` within MOVK is an operand option, not a standalone LSL.
- `compare-and-choose.prose.ts` and its listings teach register and immediate CMP,
  register CMN, CSEL and CSET. `branches.prose.ts` and `branches.listings.ts` explicitly add
  immediate CMN (`cmn w0, #10`). The condition lesson's course-written TST and ANDS examples
  use immediate masks.
- The branch lessons distinguish unconditional B, conditional B.cond, CBZ/CBNZ and TBZ/TBNZ.
  Condition suffixes share Arm's B.cond entry. Fundamentals teach BL and RET before the
  later complete call-frame examples.
- `memory-and-addresses.prose.ts`, `loading-widths.prose.ts` and `memory.listings.ts` show
  immediate LDR/STR, byte and halfword stores, and zero/sign-extending loads. Address
  `[x0]` is the immediate entry with a zero offset. Narrow load/store suffixes each have
  their own entry. Register extension examples teach SXTB, UXTB and SXTW.
- `array-addresses.prose.ts` and `arrays.listings.ts` add LDR register offsets, optional scaling,
  and immediate offset/pre-index/post-index addressing. All three immediate addressing modes
  are in Arm's single LDR immediate entry. The end-address instruction
  `add x3, x0, w1, uxtw 2` belongs to ADD extended register: `uxtw` here is its operand option.
  The string/array listings add LDRB register offsets and immediate post-index LDRB.
- `products-and-widths.prose.ts`, `division-and-remainders.prose.ts` and `products.listings.ts`
  teach MUL/MADD, the signed/unsigned widening and high-half products, MSUB and SDIV/UDIV.
  Alias entries are used for MUL, SMULL and UMULL rather than linking only their parent
  instructions.
- `calls-and-returns.prose.ts` and `calls.listings.ts` teach STP pre-index and LDP post-index;
  each Arm entry covers the pair instruction's addressing modes in one place.

These files were read in source for this catalogue pass. This pass does not claim a browser
interaction or layout check, which belongs to the independent integration review.

## Checked official destinations

Every row has API content HTTP **200**, a matching decoded heading, and viewer HTTP **200**.
The linked title is the exact index/heading label. The long hash is the decoded entry body's SHA-256.

| Key | Official entry | Decoded body SHA-256 |
| --- | --- | --- |
| `add-register` | [ADD (shifted register)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/ADD--shifted-register---Add-optionally-shifted-register-?lang=en) | `26c779200e92155a4bedb3320d2884298ce979963177418e6675909361058ed0` |
| `add-immediate` | [ADD (immediate)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/ADD--immediate---Add-immediate-value-?lang=en) | `d0d27650e8d344ed8c3e5cbdb7437818d3793d23e0c759a0d9b7d8c3dee70c26` |
| `add-extended-register` | [ADD (extended register)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/ADD--extended-register---Add-extended-and-scaled-register-?lang=en) | `a3fa64d9c365652d99591eaf7a701b1077428090fb2a9f9642b67dc64e526594` |
| `sub-register` | [SUB (shifted register)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/SUB--shifted-register---Subtract-optionally-shifted-register-?lang=en) | `6794b56db6bc1c19360efc608ed2043071530b29cab37ffa505f6675e081a781` |
| `sub-immediate` | [SUB (immediate)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/SUB--immediate---Subtract-immediate-value-?lang=en) | `4a4cb4d5f2ebb80ec4a49bdfadd39c597a8e42e20a9127c820ccda3d719223fc` |
| `adds-register` | [ADDS (shifted register)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/ADDS--shifted-register---Add-optionally-shifted-register--setting-flags-?lang=en) | `278f6140f136c94e22e796a7d7d8ed8d1a34cd1b799bbe2ec1d6b4f4c699c31c` |
| `adds-immediate` | [ADDS (immediate)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/ADDS--immediate---Add-immediate-value--setting-flags-?lang=en) | `7697392d73000c62952c1ef417907e30b2ec8b8bbd4d754821ff0c127188472b` |
| `subs-register` | [SUBS (shifted register)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/SUBS--shifted-register---Subtract-optionally-shifted-register--setting-flags-?lang=en) | `7b8a09345be0cc1facede9cf053baf6c9e078c719f77123e6f425386617ce977` |
| `subs-immediate` | [SUBS (immediate)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/SUBS--immediate---Subtract-immediate-value--setting-flags-?lang=en) | `98d1026df723e6cc10b300f86aba905f1b0085bf9cfe2f909acff153928bfcb4` |
| `neg` | [NEG (shifted register)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/NEG--shifted-register---Negate--shifted-register---an-alias-of-SUB--shifted-register--?lang=en) | `4588f2dba5c978c7c654cac71fee5a26c985ad3d178be54bba4a950c0ec96424` |
| `negs` | [NEGS](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/NEGS--Negate--setting-flags--an-alias-of-SUBS--shifted-register--?lang=en) | `fa74a21bcbcfb0d9489b908573439ba5e5fe1a5a9ff90d3faf10c956b30a8f96` |
| `mov-register` | [MOV (register)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/MOV--register---Move-register-value--an-alias-of-ORR--shifted-register--?lang=en) | `22324762a4993c6a90269d475bc9bb970eb47ae0b39a11ff361c7d503207f01f` |
| `mov-wide-immediate` | [MOV (wide immediate)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/MOV--wide-immediate---Move-wide-immediate-value--an-alias-of-MOVZ-?lang=en) | `cd87fecc34a42228f99cce8fd7264d19a8936f8dd6734a072759dc9663844183` |
| `mov-inverted-wide-immediate` | [MOV (inverted wide immediate)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/MOV--inverted-wide-immediate---Move-inverted-wide-immediate-value--an-alias-of-MOVN-?lang=en) | `8b883496cd55ea1939ce5fe004289f1446f5a8001d15ed7c5b94d2e3931103d5` |
| `mov-bitmask-immediate` | [MOV (bitmask immediate)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/MOV--bitmask-immediate---Move-bitmask-immediate-value--an-alias-of-ORR--immediate--?lang=en) | `ebefa8499bb261a32bb3e12a630a9c40398f67e638a01c67bea6cc1c7b7e670f` |
| `mov-sp` | [MOV (to/from SP)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/MOV--to-from-SP---Move-register-value-to-or-from-SP--an-alias-of-ADD--immediate--?lang=en) | `07817ba8109092e19c6bba1a5d1d725f471a723251a25bcdf52d85ea3e1c32c8` |
| `movk` | [MOVK](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/MOVK--Move-wide-with-keep-?lang=en) | `104eb4158bc32b931e5fc3fa80257e34748e51a751ecefb9e983b92f335924b4` |
| `movz` | [MOVZ](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/MOVZ--Move-wide-with-zero-?lang=en) | `bba264a3955dd722bd426575da32971ef4b8cbc4606772cf4504081631cfe5ca` |
| `and-register` | [AND (shifted register)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/AND--shifted-register---Bitwise-AND--shifted-register--?lang=en) | `ba69b1354ee5943f18b655389bf9c5bb5a387456599c4df784316035a48f42c1` |
| `and-immediate` | [AND (immediate)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/AND--immediate---Bitwise-AND--immediate--?lang=en) | `1cf7e8ff915b714ee69c13f58167ab1faa32df9434658d9d68a3373b52ae83d8` |
| `orr-register` | [ORR (shifted register)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/ORR--shifted-register---Bitwise-OR--shifted-register--?lang=en) | `947f2adb9fe7bcecd1fe22ba630a89c5bd0845057952f8686368ad47e7cb3875` |
| `orr-immediate` | [ORR (immediate)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/ORR--immediate---Bitwise-OR--immediate--?lang=en) | `e23bf121fce4b49a971b0d2e4f181bade632a3282ca8cca4c9702fc93a7dc76e` |
| `eor-register` | [EOR (shifted register)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/EOR--shifted-register---Bitwise-exclusive-OR--shifted-register--?lang=en) | `c64d9b9ac5222bc6884a2e3de918586a277b4212d95e5d8885f4ef899f01b2d4` |
| `eor-immediate` | [EOR (immediate)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/EOR--immediate---Bitwise-exclusive-OR--immediate--?lang=en) | `db476926037b8418330a4df25e8c1cc3809402a1ff640c1ad0e24471fcba92de` |
| `ands-immediate` | [ANDS (immediate)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/ANDS--immediate---Bitwise-AND--immediate---setting-flags-?lang=en) | `fe2295ba06017b580cbc9277af89c7ace18e0e9af04ef49c851b2ca88581749d` |
| `tst-immediate` | [TST (immediate)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/TST--immediate---Test-bits--immediate---an-alias-of-ANDS--immediate--?lang=en) | `1ae266383ff804465929a516ca777f6a92262939973610c7c5333c5e0a9d1d82` |
| `ubfx` | [UBFX](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/UBFX--Unsigned-bitfield-extract--an-alias-of-UBFM-?lang=en) | `11ca12c1878d6f6598ce6733e9bf67988b438502c5dfc0152e734aeaa89a4bba` |
| `bfi` | [BFI](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/BFI--Bitfield-insert--an-alias-of-BFM-?lang=en) | `e9d837b6bc0ae3f89a0487d901417c61eb8d40c3b837f8272c8427e10d446d30` |
| `lsl-immediate` | [LSL (immediate)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/LSL--immediate---Logical-shift-left--immediate---an-alias-of-UBFM-?lang=en) | `be66c6c54de877eba019550067bf91dfe9558204ac4fa9ab3fe7e56f4a67cdaa` |
| `lsr-immediate` | [LSR (immediate)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/LSR--immediate---Logical-shift-right--immediate---an-alias-of-UBFM-?lang=en) | `d9b30700fa2d860dcab2050f5ef7e1c6753006cb58b1b50e8aad98a922d170da` |
| `asr-immediate` | [ASR (immediate)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/ASR--immediate---Arithmetic-shift-right--immediate---an-alias-of-SBFM-?lang=en) | `7ba609a47b32c6a0ed9ab723538dbd97dd272e5d3b11a3e3919b7c1b2c901685` |
| `cmp-register` | [CMP (shifted register)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/CMP--shifted-register---Compare--shifted-register---an-alias-of-SUBS--shifted-register--?lang=en) | `f0b28d1e55b74b2d8f3bc325440201599ffc4773a5480b6faf36125b83f37670` |
| `cmp-immediate` | [CMP (immediate)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/CMP--immediate---Compare--immediate---an-alias-of-SUBS--immediate--?lang=en) | `02c6d746a243fae1b55683d24f42f49beea2dc44e999812cdf8470be82fd714a` |
| `cmn-register` | [CMN (shifted register)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/CMN--shifted-register---Compare-negative--shifted-register---an-alias-of-ADDS--shifted-register--?lang=en) | `758735496206cbde8aaa942762d3ce7f3342d61bdfe018ff77ddf27c7322cc8d` |
| `cmn-immediate` | [CMN (immediate)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/CMN--immediate---Compare-negative--immediate---an-alias-of-ADDS--immediate--?lang=en) | `0b009a939ef6368a4126fdc577d1ced691b7281289365005601402ab79c6f93d` |
| `csel` | [CSEL](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/CSEL--Conditional-select-?lang=en) | `6b6eb8b35de935933bba69f878b5763aef1027f75f88d2e5b951729d6ea02dc9` |
| `cset` | [CSET](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/CSET--Conditional-set--an-alias-of-CSINC-?lang=en) | `9c10e2b7178f1750c4342744cd23dfc1e75e84eff8a7d427382bac45b1840b06` |
| `b` | [B](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/B--Branch-?lang=en) | `c1fba8f03527f2df901a7851768e41d244e64401e73b388579a33853184776ac` |
| `b-cond` | [B.cond](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/B-cond--Branch-conditionally-?lang=en) | `a7b2dd473a8e8644c615507ac0eeb156ed0eaba43f77077dfd009a9f9975c620` |
| `bl` | [BL](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/BL--Branch-with-link-?lang=en) | `914df30baf33ca0d2cbbf25a9a05a81bf65d5860fc320830f8906cbee765baa5` |
| `ret` | [RET](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/RET--Return-from-subroutine-?lang=en) | `e453ad9150242b52225b78e5cbacd3de0b4b9ae4f522f6c39c0fd85e2df93947` |
| `cbz` | [CBZ](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/CBZ--Compare-and-branch-on-zero-?lang=en) | `a75785ac372fb4e3caaf79404551af7fc00e9db431e7cae6e2993852ee9dd26c` |
| `cbnz` | [CBNZ](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/CBNZ--Compare-and-branch-on-nonzero-?lang=en) | `1fe433f69e85fa5a435dd85ee284027742a71dfd44c9b427aea249da15ac9806` |
| `tbz` | [TBZ](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/TBZ--Test-bit-and-branch-if-zero-?lang=en) | `fc94d11e42ebe71079c6d210b255f7e0b5400176e6af077530275a826d5cf1c0` |
| `tbnz` | [TBNZ](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/TBNZ--Test-bit-and-branch-if-nonzero-?lang=en) | `796b40cdf9e10e0360327f237ca00c48044d26e2d897edb31dd72e7185aff018` |
| `ldr-immediate` | [LDR (immediate)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/LDR--immediate---Load-register--immediate--?lang=en) | `3199813d6fbd617666fa0e2564a0651dcc6238448630ff3999e5a9f00bfd2b78` |
| `ldr-register` | [LDR (register)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/LDR--register---Load-register--register--?lang=en) | `60af41b3aa537483c9afdf0473b74f19a7674b0c74f1361977837da4da3ec823` |
| `str-immediate` | [STR (immediate)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/STR--immediate---Store-register--immediate--?lang=en) | `07c7241bf0e040606ded3b6b468ab8e0d876d8c5039b2d48c268d533fc6fdf7a` |
| `strb-immediate` | [STRB (immediate)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/STRB--immediate---Store-register-byte--immediate--?lang=en) | `702c34ec3d10fbf988c7af1145505ec34029cfdb0a3af71ac08d7a23940b4f98` |
| `strh-immediate` | [STRH (immediate)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/STRH--immediate---Store-register-halfword--immediate--?lang=en) | `7c33cf6a074deeda8edb5e36f6b756787ab826944959583e141e4e6c98828369` |
| `ldrb-immediate` | [LDRB (immediate)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/LDRB--immediate---Load-register-byte--immediate--?lang=en) | `7dd402a44d5eaa38f0ebdbf0c815c0d980d3ea19c00bf05d37cb02f74484ce39` |
| `ldrb-register` | [LDRB (register)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/LDRB--register---Load-register-byte--register--?lang=en) | `9c8d66304328372b5643795b9661c9cead09d27ff4f856daf21fdfddcfae3b6b` |
| `ldrsb-immediate` | [LDRSB (immediate)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/LDRSB--immediate---Load-register-signed-byte--immediate--?lang=en) | `b0577f0c13d21af344242a3f9bb530d289c9e0cd629b88431df2c43e97e9f691` |
| `ldrh-immediate` | [LDRH (immediate)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/LDRH--immediate---Load-register-halfword--immediate--?lang=en) | `35aab93bea01553b725d7c7212c3e7e452cdbb732dafe2da2f365c0cd1029d6c` |
| `ldrsh-immediate` | [LDRSH (immediate)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/LDRSH--immediate---Load-register-signed-halfword--immediate--?lang=en) | `91942cc2da827e1f9279a528cbabb2ddab73ff46705fa08f3a4e28c2e26ad543` |
| `ldrsw-immediate` | [LDRSW (immediate)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/LDRSW--immediate---Load-register-signed-word--immediate--?lang=en) | `728845e28f0d44b6eb81c53f119001af16e25a55db33f57eb50c7b1461b71633` |
| `sxtb` | [SXTB](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/SXTB--Signed-extend-byte--an-alias-of-SBFM-?lang=en) | `a44b46c4b793c7e77b13e42760644f468492cb22cac487fe086df29a75e92c43` |
| `uxtb` | [UXTB](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/UXTB--Unsigned-extend-byte--an-alias-of-UBFM-?lang=en) | `d06e2afb1a4949d249862fd3cebc9b2d3a295112f429a6c5c46b551b8fb4b710` |
| `sxtw` | [SXTW](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/SXTW--Sign-extend-word--an-alias-of-SBFM-?lang=en) | `90efbfc3546a647fecf3f449a118199938d9c9e0f8b8c5fa7969c5a4531f39f7` |
| `mul` | [MUL](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/MUL--Multiply--an-alias-of-MADD-?lang=en) | `70ec789931a9e1cd743fe811630b73938e4806b34941a5085a8623fef497b0e4` |
| `madd` | [MADD](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/MADD--Multiply-add-?lang=en) | `5d29f2981d3049fdf52d4a5faccafe406e90c063f52d14c5b4e62987c09204be` |
| `smull` | [SMULL (32-bit)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/SMULL--32-bit---Signed-multiply-long--an-alias-of-SMADDL-?lang=en) | `c6490bc76526c58d303e23072cfadc98f69eb6f6cefeef9f801ce54b1a4f8569` |
| `umull` | [UMULL (32-bit)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/UMULL--32-bit---Unsigned-multiply-long--an-alias-of-UMADDL-?lang=en) | `d0784aaacd3322a871345e2dbee40c50667b5abbc4c4762e6e4614cf50f655ca` |
| `smulh` | [SMULH](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/SMULH--Signed-multiply-high-?lang=en) | `ce1996d802a1bf41123ce7f5a8f26c09e778d2ac100605893f9b5a2ff129a649` |
| `umulh` | [UMULH](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/UMULH--Unsigned-multiply-high-?lang=en) | `9f775d2a22dbb1cae3084ef3388af0456da84eac5b002a5942a1e4bbd98e1faf` |
| `msub` | [MSUB](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/MSUB--Multiply-subtract-?lang=en) | `c26042ebb29c5c9c3356eaf4ebac1513682fba0572c12c675f05c62bc5c03ed7` |
| `sdiv` | [SDIV (quotient)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/SDIV--quotient---Signed-divide-?lang=en) | `83f5e17d766505c37befce3f3b603f3691a889f9be909c884822561cc761e309` |
| `udiv` | [UDIV (quotient)](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/UDIV--quotient---Unsigned-divide-?lang=en) | `c58008e13614608a21848191a05b979cff093a5fae264b07fdb0fa33963fdc6f` |
| `stp` | [STP](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/STP--Store-pair-of-registers-?lang=en) | `7e17ba04e8aded73966cfbb0ae68965d8d5a34b0aecd44d9b4d008ee1775dff3` |
| `ldp` | [LDP](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/LDP--Load-pair-of-registers-?lang=en) | `8a584a8d8c89318caab5cfbdbd7b4488a5c9efcca70fe02bac85a681653a9e2b` |
