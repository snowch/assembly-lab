# Compact stack/frame implementation

Scope: the shared `StackStepper`, used in calls/returns and recursion. No machine, recorded program, calling convention or challenge changes.

## Checked fact brief and drafting

- `stackFrames(trace, k)` reconstructs active allocations and invocation ordinals from SP writes and call/return steps. It derives saved-register slot addresses/sizes from actual stores and values from memory, including zero values.
- `stackReturnTarget` reads actual current x30. It maps an instruction only when that address belongs to the listing.
- Frame bounds come from SP allocations. Inclusive visible byte ranges end at `top - 1`. Slot ranges end at `address + size - 1`.
- Stores and loads provide byte address ranges. Summary access marks use intersection with the last executed operation, independently of whether stored values changed.
- Releasing a frame removes it from the active allocation view without claiming the bytes were erased.

This separate drafting/implementation agent wrote the new labels from these facts, preserving the existing saved-register and frame wording. New copy is in `strings.stack.ts` and the canonical Module 9 figure-interface appendix. Dynamic range messages are included in the bidirectional canonical-copy test. No new numerical result or example program was introduced.

## Change

Each frame now defaults to an addressed diagram of its saved register values and remaining frame space, under its invocation identity and bounds. Individual byte cells remain available in a separate native disclosure per frame. The compact summaries carry last-instruction read/write marks and exact memory values; a zero saved value is still rendered. The listing, current instruction status, return target, register bank, slider, prediction lock, deepest-point preset and Reset behaviour remain intact.

The previous representation repeated 32 individually addressed byte cells per invocation. The new primary view makes the saved values available simultaneously; the full byte inspection is secondary. No data is removed from the full inspection. Frame and slot groups remain spatial, with boundaries and address ranges; no table replaces the stack diagram.

## Verification

Initial focused command: `npx vitest run packages/views/src/stackFigures.test.tsx packages/views/src/stack.test.ts` failed two existing broad selectors because summary cards now also carry access attributes. The byte assertions were scoped to `.al-stack-bytes`, preserving their exact byte counts and values; they were not weakened or removed.

Focused rerun: `npx vitest run packages/views/src/stackFigures.test.tsx packages/views/src/stack.test.ts content/lessons/module-9.prose.test.ts` passed 16 tests in three files. These checks cover frame identities/values/byte contents, initially closed byte disclosures with visible saved summaries, incoming return-address storage, store reversal, release, bounded recursion, return targets, and canonical copy. The final equivalent rerun after removing a redundant native-disclosure manipulation also passed all 16 tests.

The existing educational Module 9 checkpoint test now also checks that summaries remain visible with byte details initially closed, that the first frame’s byte detail opens/closes, and that disclosure does not change instruction position. These browser additions have not yet been run.

No production build or browser check was run by this author, per shared-workspace coordination. Independent built-site checks must exercise phone/desktop light/dark, deepest-point preset, Next/Back/Reset, exact saved state and opening/closing byte disclosures. Layout reduction and independent approval remain to be established there.


## Follow-up after independent phone review

The initial compact cards still left a four-frame comparison too tall. The follow-up keeps the parent's controls/status relocation and turns saved-slot summaries into narrow frame bands. Each slot has a byte offset from its frame's visible first address, saved-register identity and exact value on one row. Frame address bounds remain visible; exact full slot ranges remain in the accessible name/title and individual-byte inspection. A single visible offset key explains the local coordinates. The offset arithmetic comes directly from the existing frame/slot addresses; no frame layout is inferred. Reduced spacing and 12px summary text (11px offset text) retain 44px disclosure targets. No new trace/example programme is introduced.

The follow-up's focused test rerun covers the same 16 cases. Built phone/desktop/theme reinspection remains with the independent checkers; no claim about the achieved browser height is made by this author.
