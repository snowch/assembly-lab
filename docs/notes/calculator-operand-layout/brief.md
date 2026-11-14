# Symmetric calculator operands

User-approved layout: a labelled Value A input and live decimal/hex readings, then matching Value B controls, a shared notation hint, and Operation with one Calculate button. Aligned bits and optional carries follow. Edit bits remains a separate tab for A.

## Checked facts and intended behaviour

- CalculatorWorkspace is the global header tool; inline ProgrammerCalculator lesson figures retain their scoped controls.
- The exact integer parser accepts decimal, 0x hex and 0b binary within the selected 32/64-bit word. Signed affects decimal interpretation, not the explicit bit pattern. All calculations and previews use that parser/model.
- Both inputs become live operand drafts. Valid inputs preview immediately; invalid/empty drafts must not show a previous value as their reading. Calculate validates both current inputs; Enter from either input is equivalent.
- Changing either input, operation, width or reading clears computed result/carries. Operation changes preserve the separate arithmetic B draft and decimal shift count.
- Pasting never changes width or truncates. Explicit Width button changes resize valid operands with upper zeros when widening and retained low bits when narrowing. Preserve malformed/oversized drafts for correction. This extends the existing explicit A resize to the symmetric B input.
- Bit toggles, clearing, half replacement and Use result as A update A's input and previews together. Invalid A cannot be edited as if it were a previous valid word; clearing remains a recovery action.
- Preserve coordinated-update work, including old format-to-prefix migration and exact large values. Revalidate old results against both current drafts; a pending changed A must not retain a stale result.

## Learning and review

The outcome is comparing the two operands and a deliberately calculated result in the same notation. Earlier bit-reading and flag explanations supply prerequisites. Keeping input previews apart from the calculated result avoids implying that typing executes an instruction. The screenshot motivates symmetry; no novice study is claimed.

Use docs/style.md; separate copy drafting by carry_copy. Independently review source/model and built phone/tablet/desktop in light/dark, including keyboard, invalid drafts, 32/64-bit bounds, shift count, signed decimal, mixed prefixes, bit editing, reuse, restoration and stale output. Keep existing meaningful tests and adapt them to the single Calculate flow.

## Initial verification

The first unit pass exposed test selectors matching both the new operand input and its named readout group. Tests now address textboxes by role; all 27 targeted workspace/carry/model tests passed. Initial browser checks found a stale expectation counting hidden as well as visible notation hints; the assertion now checks the single visible hint. No failure is erased by these reruns; final runs are recorded separately.

Independent review found a real stale-cache defect when a width/reading change made an invalid A draft valid before Calculate. Editing now derives from the validated live A, and settings synchronize the compatibility cache. A regression covers widening 0x100000000 before toggling bit 0 and making -1 valid with Signed. All 28 targeted unit tests pass after that fix. Shared selected-reading and hexadecimal definitions are visible once for both previews.
