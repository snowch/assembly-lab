# Independent learner review: defining preserved flags

Copyright © 2026 Christopher Snow. Reviewed 15 November 2026.

## Scope

Reviewer: independent Codex agent `/root/draft_control_memory`, using the parent session's inherited model and effort. The reviewer did not draft or edit this copy. Read `AGENTS.md`, `CLAUDE.md`, the style and authoring guidance, the actual published lesson composition, its prose and unchanged example before reading the change record.

Reviewed as a learner who completed Addition and its flags but has not read later lessons. This is a focused review of the objective, local definition and supporting introduction, plus the existing prediction and stepper. It does not replace the separate technical review or full repository checks.

## Initial copy judgement

The objective, “identify which instruction last updated N, Z, C and V”, describes a concrete task. Earlier work taught the flag meanings and single-addition checks; this lesson asks the learner to track which instruction supplied the current flags across two familiar operations.

“An instruction preserves the flags when it leaves their values unchanged” defines the term in the required introductory prose before the body example and the later Writing and preserving flags heading. The following sentences distinguish the destination register's new result from flags recording an earlier operation. The reminder explicitly distinguishes `add` from `adds` and says the latter updates all four.

The existing two-addition example supplies the necessary bridge. Its first addition establishes observable flags and its second writes a destination without replacing them. A smaller one-instruction example would need an artificial initial flag state. No extra worked answer or activity is needed for this copy change.

The repeated definition in the later short explanation is harmless recap. The first occurrence prepares the investigation; the second closes it with the lifetime rule and identifies the familiar preserving instructions. It is one sentence inside a short paragraph, rather than a second competing explanation. No supported repetition finding is raised.

The introduction supplies the general mechanism without giving the example's calculated flag values. Before submitting a prediction, feedback remained absent and the stepper remained locked. The visible options are possible answers, not revealed feedback.

## Built-page checks

Production preview: `http://127.0.0.1:4240/assembly-lab/#/lesson/flags-and-overflow`, Chromium through Playwright. Checked desktop 1440 × 1000 and phone 390 × 1000, each in actual light and dark themes: four independent fresh-page states.

In all four states:

- The new objective and required definition were visible, with the definition in ordinary prose outside a disclosure. The two definition paragraphs used 16px text. No measured visible main prose, list item or heading was below 11px. The phone introduction and desktop stepped state were also visually inspected in screenshots.
- The page had no horizontal overflow. The objective and definition wrapped legibly at phone width.
- Check your prediction began disabled; choosing an option did not unlock the stepper or reveal feedback. Submitting an intentionally incorrect prediction produced feedback and unlocked the existing stepper.
- Stepping the two additions showed a destination register write while all four flag values remained the same across the second instruction. The actual status said the destination was written and N, Z, C and V were not updated by `add`. The register write mark remained distinct from flag-change marks.
- No browser `pageerror` events were recorded.

Evidence is outside the repository at `/workspace/output/preserved-flags-definition-review/results.json`, with `*-intro.png` and `*-preserved.png` screenshots. The checks used the built interactive model; they are not a claim of a new GNU/QEMU execution, physical-phone study, screen-reader audit or measured novice-learning outcome. Full repository validation is owned by the separate check run.

## Verdict

No outstanding learner finding in the approved copy scope. The objective is clearer, preservation is defined before the investigation needs it, and the existing prediction gate and stepped result/flags distinction remain intact. No product edits were made by this reviewer.

## Final precision follow-up

The technical review subsequently identified an ambiguity in the initially reviewed definition: an instruction can write a freshly calculated flag value that happens to equal the old value. Equal before/after values alone do not establish preservation. The initial judgement above records the earlier wording; this follow-up assesses the final replacement independently.

Read the revised source and fresh production preview. The introduction and closing paragraph now define the instruction behaviour directly: “Preserving the flags means not writing to them. Their existing values stay unchanged.” The closing paragraph adds, “Every `adds` writes all four flags, even when a calculated flag value matches its old value.” This resolves the precision ambiguity in learner terms. It also matches the existing distinction between a register being written and a flag value changing. The context is the effect of an individual instruction, not a comparison of two arbitrary snapshots.

Repeated the focused browser check in fresh pages at desktop 1440 × 1000 and phone 390 × 1000, each in light and dark themes. All four rendered the new definition before the example; the final qualification was present in the short recap. Required definition text remained 16px and the page did not overflow horizontally. The prediction stayed locked until checking, and the stepped second instruction still wrote its destination without updating the flags. No browser page errors occurred. Evidence: `/workspace/output/preserved-flags-definition-review/precision-results.json` and `*-precision-intro.png`.

The repeated short definition remains useful preparation and recap. No outstanding learner finding remains for the final wording. The follow-up was limited to the changed copy and its nearby gate/step interaction; it does not claim a fresh full-suite or native execution run.
