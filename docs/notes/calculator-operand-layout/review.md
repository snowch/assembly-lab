<!-- Copyright © 2026 Christopher Snow -->

# Independent review: symmetric calculator operands

Reviewer: separate `carry_review` agent, which did not implement or draft this layout. Inspected actual source and the initial built UI before the author's brief. Used separate learner/interface and technical passes under repository authoring/learning-design guidance. No product or test edits made. Other lesson changes on the branch have separate reviews.

## Learner and interface pass

Value A and Value B now have matching labelled inputs and decimal/hex previews. Valid text previews immediately; empty or malformed text shows Unavailable rather than an earlier word. One shared notation note explains the two prefixes and decimal default. Operation and one Calculate button follow the operands; there is no A Apply action. Enter from either input calculates. Typing previews operands but does not present a calculated result or imply instruction execution.

Edits to A or B clear the result and optional carry summary. Edit bits explicitly edits A, and invalid A hides/disables its previous word while retaining Clear bits as recovery. Bit toggles, half replacement, clearing and Use result as A synchronize the input and previews. Shift left has a separately named decimal count rather than a misleading second-word preview.

The initial layout had removed the prior local signed/unsigned and hexadecimal definitions. That was an accepted prerequisite regression: the global header can be opened before the relevant lessons. Final copy restores one shared selected-reading/hex definition near settings rather than repeating it beside both previews. Width guidance now accurately says explicit Width changes resize valid A **and B**, while entry itself does not change width or discard bits and invalid drafts remain available for correction.

No new unexplained prerequisite remains after that correction. Earlier course lessons provide deeper bit-reading/carry preparation; the header supplies local syntax, selected-reading, resize and scratch-work guidance. No novice study was performed.

## Built checks and accepted defect

Initial asset `index-DmMVVQEn.js` contained a real state-consistency defect. Starting at unsigned 32 bits, entering `0x100000000` was invalid. Selecting 64 bits made the preview correctly show 4,294,967,296, but Edit bits showed bit 32 clear; toggling bit 0 replaced A with 1 rather than 4,294,967,297. The preview used the now-valid live draft while the editor used an older compatibility cache.

The correction synchronizes the cache with the newly valid draft on settings changes and derives editor/inspector/half values from validated live A. Final asset `index-DitP2uam.js` independently passed eight Chromium contexts: 320/375/834/1280px, light/dark. Every context directly rechecked that widening case without Calculate: bit 32 is set and toggling bit 0 produces 4,294,967,297. The related reading transition is also verified: an unsigned-invalid −1 becomes valid under Signed, and toggling bit 0 produces −2 without an intervening calculation.

The same eight-context pass verified live A/B previews, unavailable invalid/empty previews, one Calculate/no Apply, Enter, input/operation result invalidation, stale carry removal, explicit narrowing/widening of both operands, preservation of invalid drafts, exact 64-bit overflow, reuse, decimal shift counts/errors, bit/half synchronization, keyboard selection/disclosures and close/reopen/route persistence. The shared prefix note is visible once in Calculate view. Matching input widths and aligned bit columns were measured; no page/dialog overflow or page errors occurred. Final phone-light and desktop-dark top captures were inspected.

## Technical pass

`workspaceCalculation` validates current A text before current B/count and computes from those parsed values. It no longer calculates with a separately loaded A. Independently checked 200 boundary combinations against separate BigInt expectations: 32/64 bits, both readings, add/subtract, preserving exact full results and modulo-width retained patterns. Each case deliberately supplied a different compatibility-cache pattern; the calculation correctly used current A/B. Invalid A/B reject rather than using that cache.

The existing parser still distinguishes decimal range from raw prefixed patterns. Paste does not infer width, extend a sign from text length or truncate an entry. Explicit Width changes resize valid A/B patterns; `workspaceEntryForSettings` preserves invalid drafts. Reading changes preserve fitting patterns while translating decimal readings. The settings transition now also synchronizes the compatibility cache when a formerly invalid draft becomes valid. Editor actions use the validated live pattern, preventing another consumer from reviving stale cached bits.

Trace invalidation remains separate from previewing. Invalid edits cannot retain old result/carry numbers; valid previews alone do not create a trace. A result reused as A updates its input and clears the previous trace. Existing carry computation, prefix parsing, alignment and mathematical models remain the same. At this review’s calculator-layout scope, contextual lesson calculators retained their separate controls. Their later user-authorised consolidation is covered by a separate review; specialised formula helpers remain. No CPU instruction, physical circuit or hardware execution claim is added.

## Handoff verification

Independently seeded five browser one-shot handoff fixtures. An old empty draft retains its formerly loaded value by converting it into explicit current A text. An old changed A draft becomes authoritative and invalidates the old trace. Legacy Hex `10` and Hex `0b10` retain their meanings as `0x10` and `0x0b10`; their old result is rejected when its A differs from the current draft. A new live empty field remains empty/unavailable instead of restoring an old value. Matching current source metadata regenerates the correct result and overrides supplied output fields. Storage is consumed after restoration.

These are actual browser seed/codec checks, not an end-to-end service-worker upgrade transaction. Source inspection covers the unchanged handoff mechanism and the new `entryMode: "live"` migration distinction.

## Findings and challenged concerns

- **Medium, editor/cache inconsistency after settings make A valid. Accepted and corrected.** Evidence and numerical reproduction are recorded above and in `probe.json`; all eight final contexts verify the width and reading edge cases. No remaining stale-word editor path was identified.
- **Medium, removed local reading/hex definitions. Accepted and corrected.** One shared definition preserves preparation without duplicating every preview. Final source and built captures confirm it.
- Rejected: a valid input preview is an already calculated result. The result remains explicitly uncalculated until Calculate/Enter and is cleared by subsequent edits.
- Rejected: explicit width narrowing should leave every valid B unchanged. The approved symmetric model resizes both valid words; malformed or oversized drafts remain available. Guidance now states that distinction.
- Rejected: legacy matching results should survive a changed A draft. Under live-input semantics that would display a result for a different current operand. The migration correctly invalidates it.
- Rejected: invalid A should silently expose/edit its previous valid word. Unavailable previews and disabled editor controls are consistent with current input authority; Clear bits provides an explicit recovery action.

No remaining blocking learner/interface or technical finding identified.

## Evidence and limits

Scripts, captures and JSON are under `/workspace/output/calculator-operand-layout-review/`: `probe.json` retains the original defect; `browser.json` records the eight final contexts, geometry and asset; `model.json` records the 200 independently expected cases; `handoff.json` records the five fixtures. `*-top.png` captures show the final shared guidance and symmetric operands.

Repository focused/full checks and publishing remain the managing session's responsibility. This reviewer did not run the full suite. No novice, screen-reader-user, zoom/high-contrast or physical-device test was performed. Expert review and browser/model checks do not establish learning effectiveness or complete accessibility conformance.
