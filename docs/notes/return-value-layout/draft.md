# Returned-value layout: separate copy draft

Drafted in `/workspace/assembly-lab-return-values` from the checked-facts brief and supplied screenshot. Read `AGENTS.md`, `CLAUDE.md`, the current component and its tests, and the closing style passes in `docs/style.md`. No files in the original comparison/count worktree were touched.

Changed only the call-comparison string source and its exact canonical block, plus this drafting record. The managing session owns rendering, layout, model calculations, tests and independent reviews.

- The main heading follows the mock. `sameWeightsHeading` supplies a neutral alternative whenever the actual readings do not differ, including equal types or a clear highest bit.
- `bitWeights` explains that the lower 31 bits retain their positive weights. `topWeightDiffers` specifies the highest bit’s negative signed weight and positive unsigned weight, using the existing C type labels. This sentence is for differing return types; the weight rule remains true when the bit is clear.
- `sharedPattern(hex)` takes the computed hexadecimal pattern. It describes both returned patterns and the role of C return types without claiming that those types or values necessarily differ. Its hexadecimal span uses the project’s backtick convention and must render as code.
- `topBitState(top)` takes the computed highest bit and explains its contribution. A clear bit contributes zero even though the weight is still signed or unsigned; a set bit contributes its weight. No returned word or computed total is typed into the copy.
- `contributionHeading` labels the table’s numeric entries as contributions; the highest-bit row explicitly names bit 31. `sumsHeading` names the arithmetic below it. Reuse `signedType` and `unsignedType` for all type labels, including sum cards.
- Existing no-type-tag, no-overrun-warning, trip-context qualifications and reminder labels are unchanged. The managing session removed the unused `topBitValue` and `topBitWeight` keys when replacing their table rows, and kept the canonical source in sync.

Sentence pass: direct statements, no new jargon, no em dashes, no pasted example totals. Idea pass: the lower contribution stays the same, the top contribution follows its type’s weight, and the total comes from adding them. The table and stacked arithmetic must show those computed values; prose alone does not establish that the rendering does so.

This is a source drafting pass, not independent review or browser verification. Validation follows below.

Draft validation: `npx vitest run content/lessons/pacing-1-4.prose.test.ts` passed both tests, including exact call-comparison canonical-source agreement. Prettier check on the string file and `git diff --check` passed. No browser checks were performed in this drafting pass.
