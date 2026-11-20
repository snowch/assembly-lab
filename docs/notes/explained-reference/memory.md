# Memory and address reference drafting

Copyright © 2026 Christopher Snow

## Scope and checked facts

This separate drafting pass covers the 15 load/store/address mnemonics in the browser catalog. It follows the checked brief, repository authoring rules and both passes of docs/style.md. No exercise tests, reference solutions, expected answers or hints were used.

Source inspection: `content/instruction-quick-reference.ts`; the official form links in `content/instruction-reference-catalog.ts`; `packages/machine/src/forms.ts` (`parseMem`, `memHandler`, `pairHandler`, `adrHandler`); register parsing and machine layouts. The prior catalog's architecture-source audit remains applicable. The browser assembler distinguishes a mapped address from a syntactically encodable memory expression.

The draft provides 59 form groups and 105 independent valid scenarios. Every previously declared syntax string remains present. Added explicit x-register scaled offsets, zero-/sign-extended w offsets and pair base-only forms, all with examples. Basic base and fixed-offset groups stay visible. Pre/post-index and register-offset groups are marked advanced. Special zero-register, SP, relocation and overlap rules sit in advanced notes.

## Representation decisions

Each example starts from its own mapped data and prepared registers. The displayed instruction is one actual instruction. x28 is reserved for the supplied return scaffold. All labels use the harness's namespaced local `.L` scheme.

Memory observations name `.Lvalue`, the location the demonstrated instruction accesses. Signed loads use negative prepared bytes and signed destination readings. Other examples use small positive data. Pair examples show both adjacent locations, including a w-register pair whose elements are four bytes wide. Separate before/after base observations distinguish no writeback, pre-index and post-index. ADR/ADRP use the shared computed label-address observation to distinguish an address from stored data and a full address from its page.

Explanations state mechanisms and preserved inputs. Values are computed by `computeReferenceExample`, not embedded as purported execution results. Operand ranges are parser/source claims. Rejected examples explain why a form is invalid without suggesting an exercise solution or a new instruction outside its allow-list.

## Checks and original corrections

- First standalone model pass executed all 105 scenarios successfully. It found two rejected-example diagnostic keys drafted as `operand.x`; inspection established the actual key is `operand.width`. Corrected those keys; the next complete pass confirmed every rejected example's first key.
- Final standalone model pass: 105 valid scenarios, all returned normally and every rejection matched its declared key.
- GNU assembler separately accepted all 105 generated scenario programs. This pass establishes syntax acceptance; full GNU/QEMU differential execution is owned by the shared model/corpus pass.
- Corrected a byte-offset explanation which had mechanically rendered “amount 0 or 0”. Byte accesses now state their sole accepted shift. Updated normal w-register load/store observations to read the four transferred bytes rather than eight.
- Added focused display-observation checks for signed loads, unchanged inputs, fixed/pre/post bases and both pair values. These pin the representation choices as well as source execution.

Final authorised refinement: byte and halfword stores now start with values whose higher bits do not fit the access size. The input remains intact while memory receives its low bits. The helper setup uses encodable MOVZ/MOVK instructions for the halfword case. A focused check pins both effects.

These checks do not demonstrate learning effectiveness. Independent learner/technical review and final rendered phone/desktop theme checks remain the managing session's separate evidence.

## Independent technical correction: load destination overlaps

The independent technical review found that the original general claims about an unchanged base were too broad. Non-updating address forms do not write an adjusted address back, but a valid load can name the base register, its matching w/x view, or an offset register as its destination. The loaded value then replaces that register. Pair loads have the same distinction when one destination is the base.

Corrected the base-only, fixed-offset, register-offset and pair rules to distinguish address calculation from the load's destination write. Example-specific unchanged-base descriptions now explicitly refer to the prepared example's distinct registers. Existing pre/post-index overlap precautions remain in place. Store rules retain their valid unchanged-register statements.

Added seven test-only model cases: base load, w/x alias, fixed offset, register offset, index destination, pair base and pair fixed offset. They demonstrate destination writes while memory stays unchanged. These are not displayed scenarios and do not alter the frozen native corpus. Focused memory tests now pass 11/11. Displayed programs, setups, data and watched states are unchanged by this prose correction.
