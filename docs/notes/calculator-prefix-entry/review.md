<!-- Copyright © 2026 Christopher Snow -->

# Independent review: prefix-based calculator entry

Reviewer: separate `carry_review` agent, which did not implement or draft the change. Inspected the actual diff and initial built UI before the new brief. Applied the repository authoring and learning-design guidance in separate learner/interface and technical passes. No product edits made.

## Learner and interface pass

Both format dropdowns are removed from the global workspace. Decimal is the default; the local hint names `0x` and `0b`, explains that binary uses 0 and 1, and permits case-insensitive prefixes and digit separators. The existing local signed/unsigned and hexadecimal definitions remain. No guessing from a string containing only 0/1 is required: unprefixed digits retain their decimal meaning.

Width help distinguishes fitting patterns, upper-zero filling and rejected oversized entry. It says entry does not change Width or discard bits. Its final sentence explicitly names the loaded A as the value resized by the Width buttons. This distinction matters because pending A/B text is preserved rather than silently truncated. A decimal reading remains distinct from a prefixed raw pattern: decimal follows the selected signed/unsigned range, while a raw pattern can set the sign bit.

The familiar Apply action still loads A explicitly. B can use its own notation, and Calculate preserves the two inputs and retained result. Changing B invalidates the old result. Invalid A entry preserves the loaded A; keeping a previous result for that unchanged A is appropriate until Apply succeeds.

Final Chromium checks covered 320/375/834/1280px in light/dark, asset `index-NkHMGWeF.js`. Used actual clipboard writes and keyboard paste into both operands in all eight contexts, plus Enter to Apply/Calculate. Verified mixed hexadecimal/binary input, unprefixed decimal, upper-case prefixes, separators, decimal signed-range errors, short patterns at 64 bits, oversized patterns at 32 bits, leading-zero excess, malformed forms and close/reopen preservation. No page/dialog overflow or page errors occurred. Phone-light top and desktop-dark error captures were inspected. Helpers and local errors remain readable; the operation control is the only dropdown in Calculate view.

No new unexplained prerequisite or blocking interface finding remains. Earlier binary/hex and signed-reading lessons still provide deeper preparation, while the header supplies the syntax and interpretation guidance needed locally. This is expert review, not a novice study.

## Technical pass

`calculatorParseEntry` adds prefix dispatch beside the unchanged explicit-format parser. Decimal and hexadecimal use that existing parser. Binary accepts only 0/1 after its prefix, removes redundant leading zeros, bounds significant length before BigInt conversion and returns an unsigned pattern. No floating-point conversion, width inference or paste-length sign inference is introduced.

Independently bundled the actual new parser/workspace helpers and checked 384 boundary cases against separately computed BigInt expectations: the primitive's 4/32/64 widths, both readings, decimal minima/maxima and out-of-range neighbours, hex/binary significant values, uppercase and leading-zero/separator variants. The header itself still offers only 32/64 bits. Separately checked malformed/unsupported forms and 100,000-character binary, hex and decimal inputs; oversized significant values reject, while redundant zero padding remains valid. These are arithmetic/parser checks, not an Arm/C execution claim.

Browser checks demonstrate the key width distinction: 32 ones with `0b` at Signed 64 bits become positive 4,294,967,295, while unprefixed 32 ones are an oversized decimal value. A raw full-width 32-bit pattern can read as −1; the equivalent positive decimal literal is rejected in Signed 32 mode. An oversized A/B paste neither changes Width nor discards bits. A separately requested width narrowing resizes loaded A and leaves oversized pending drafts intact for validation. Leading zero padding does not make an otherwise fitting value oversized.

`workspaceEntryForSettings` preserves prefixed text. For a valid decimal draft it translates the existing pattern into the new reading only when that pattern fits; oversized or invalid drafts stay available for correction. Result traces are cleared on settings changes and when B changes. Existing shift amounts and half-editor values still use the explicit decimal parser; this change does not reinterpret them as word-sized operands.

## Migration and compatibility

The new `entryNotation: "prefix"` marker distinguishes new drafts from old selector metadata. Legacy Hex drafts are made explicit with `0x`, including bare `10`. A legacy Hex-mode `0b10` is preserved as `0x0b10`, retaining hexadecimal 2,832 rather than becoming binary 2. Already explicit hex stays explicit; new prefix-schema drafts ignore obsolete format metadata.

Independently seeded valid one-shot browser handoffs for legacy selected-Hex and new prefix-schema state. Legacy A draft `10` restores as `0x10` and applies as 16; legacy B `0b10` restores as `0x0b10`, with the correctly recomputed source/result trace. In the new schema, bare A `10` remains decimal and B `0b10` remains binary. Supplied stale output numbers are recomputed, and the one-shot snapshot is consumed. These browser seed tests do not claim an end-to-end service-worker upgrade test.

The explicit-format contextual lesson calculator is unchanged in source. In the built register-width lesson, its existing Entry format selector still accepts bare `10` in Hexadecimal mode and produces pattern 16. The unchanged explicit parser also independently retains its prior `0b10`-as-hex behaviour when Hex is selected. No contextual lesson UI was converted to prefix entry.

## Findings and challenged concerns

- **Low, initial width-helper ambiguity. Accepted and corrected before final evidence.** The initial generic “Width buttons keep low bits” sentence could imply that a pending B draft is truncated. The final copy names the loaded A. Source and browser checks confirm the distinction between resized A and preserved drafts. Binary's local 0/1 definition was also retained in the final hint.
- Rejected: the length of a pasted binary string should choose 32/64 bits or its sign. Significant-value fit and the selected width govern storage; the existing selected reading governs interpretation. Automatic width/sign inference would contradict the requested policy.
- Rejected: any 64-character binary paste must fail at 32 bits. Redundant leading zeros carry no nonzero bit above the selected width. The numeric-fit check correctly accepts those cases and rejects significant upper bits.
- Rejected: changing reading must leave every valid decimal draft's text unchanged. Translating a fitting existing pattern preserves its bits; prefixed drafts remain textually unchanged. Oversized and invalid drafts are not truncated.
- Rejected: legacy Hex `0b10` should acquire its new binary meaning during migration. That would change pending work from 2,832 to 2. The migration explicitly preserves its old meaning.

No remaining blocking learner/interface or technical finding identified.

## Evidence and limits

Evidence/scripts/screenshots are in `/workspace/output/calculator-prefix-review/`: `browser.json`, `model.json`, `migration.json` and associated scripts. The initial copy inspection used asset `index-DAwRwNew.js`; final clipboard/error/layout checks and migration use `index-NkHMGWeF.js` after the helper clarification. The first compatibility harness counted the legacy selector immediately after opening its deferred disclosure and saw zero before it mounted. The original is retained as `migration-first.cjs`; waiting for the real selector corrected the harness, and the actual selector/pattern check passed. This does not relabel the original command as passing.

The managing session owns repository focused/full checks and publishing results. This reviewer did not run the full suite. No novice study, screen-reader-user test, real-device clipboard test or zoom/high-contrast review was performed. Browser clipboard, keyboard, parser and interface checks do not establish learning effectiveness or complete accessibility conformance.
