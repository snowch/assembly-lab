# Flag-preservation definition: independent technical review

Copyright © 2026 Christopher Snow

15 November 2026. Reviewed `fix/define-preserved-flags` independently; this reviewer did not draft the copy. Scope is the revised objective, local definition and corresponding canonical prose, with the unchanged example and prediction gate as evidence. Separate learner review and full-suite execution are not claimed here.

Read the published route construction in `pacing-1-4.ts`, its objective/reminder/intro in `pacing-1-4.copy.ts`, the generalisation in `adding-and-the-flags.prose.ts`, and their canonical records. The first section defines preservation before the prediction/example and the later “Writing and preserving flags” heading. The objective asks which instruction last updated NZCV. The prose distinguishes a destination result from the earlier flag-setting operation; it does not suggest clearing flags, retaining an instruction history inside them, or recomputing them from every new result.

Checked `SUM_FLAGS` and `SUM_CALL`, the facts tests and simulator `addWithCarry`: flag assignment occurs only when `setFlags` is true, and replaces N, Z, C and V together. The unchanged example has `adds w3, w2, w2`, then `add w0, w0, w1`, then `ret`. Read the repository source record and the ADD/ADDS/SUB shifted-register operation pseudocode in the Arm instruction text mirrored at `https://finkmartin.com/aarch64/{add,adds,sub}_addsub_shift.html`: ADD and SUB discard calculated NZCV; ADDS assigns `PSTATE.<N,Z,C,V>`. This supports the local preservation/update distinction. No fresh QEMU or physical-hardware execution was performed.

Independently ran `npx vitest run content/lessons/adding-and-the-flags.facts.test.ts`: exit 0, 42 tests passed. This focused result is separate from the managing session's wider checks.

In fresh desktop Chromium at the built preview on port 4240, the definition appeared in the first lesson section and the stepper was initially locked. After committing the prediction, the observed flags were initially 0000; the first step changed them to 1010; the next step kept 1010 while w0 changed from 2147483647 to 2147483648; `ret` kept 1010. Reset restored 0000 and the initial w0. No page errors occurred. This reviewer did not repeat the separate reader's phone/theme layout matrix.

The first browser probe exited 1 because its text-order assertion matched the explanation heading in navigation before the lesson body. A corrected assertion scoped to the first lesson section, followed by the full gate/step/reset probe, exited 0. This was a review-harness error, not a product finding; the failed probe's status is retained here.

No instruction, input, prediction answer, gate or challenge was changed by the reviewed patch. The initial focused pass found no discrepancy in the worked instruction sequence. The following additional definition check identified a precision issue that the first pass missed.

## Follow-up: a write need not change a bit

**Accepted P2 definition ambiguity.** “An instruction preserves the flags when it leaves their values unchanged” defines preservation only through numerical equality. The surrounding reminder says `adds` updates all four, but equal before/after bits cannot establish the absence of writes or identify the last writer. In the actual `SUM_FLAGS` example, ADDS writes Z = 0 and V = 0 even though both were already 0. `FlagsRow.tsx` outlines numerical changes (`was[i] !== value`), so an unoutlined bit is not evidence of preservation. Another already taught case, ADDS of 5 + 3 starting with NZCV = 0000, writes all four while leaving the complete pattern 0000.

Direction: define preservation as not writing the flags, with unchanged stored values as the consequence. The accepted correction is “Preserving the flags means not writing to them. Their existing values stay unchanged.” The generalisation must also distinguish writing a newly calculated value from changing its numerical bits. Apply the correction to both source definitions and their two canonical records. No model or figure change is required.

**Closed after independent final verification.** Read all four corrected source/canonical files. Both definitions now identify absence of writes first; the generalisation explicitly says ADDS writes all four even when a calculated flag value matches its old value. This resolves the equal-value counterexample without changing the instruction model, example inputs or figure markings.

Independently reran the 42 facts tests after the final copy correction: exit 0, all 42 passed. Against the newly built preview on port 4240, four fresh browser contexts (1440 and 390 pixels, light and dark) displayed the revised definition in the first section and the equal-value write qualification in the later explanation. The superseded definition was absent. In each context, the prediction still gated the stepper; committing unlocked it; actual flags were 0000 initially, 1010 after ADDS and unchanged through ADD and RET; Reset restored 0000. Requested themes matched the root theme attribute and rendered body backgrounds (light `rgb(247, 250, 248)`, dark `rgb(16, 27, 26)`). No technical finding remains.

The managing session separately reports its broad browser run on the preceding static build completed with 1,500 passes, 20 existing conditional skips and zero failures. That result supplies regression coverage for the unchanged runtime and preceding copy, not verification of the final revised definition. The final-source facts rerun and four-context new-build checks above provide this reviewer's independent closure for the final copy. This reviewer did not rerun or independently certify the broad suite.
