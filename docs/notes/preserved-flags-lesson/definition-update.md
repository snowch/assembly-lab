# Define flag preservation before using the term

Copyright © 2026 Christopher Snow. Updated 15 November 2026.

## Approved scope and checked facts

The user approved replacing the published objective with “Identify which instruction last updated N, Z, C and V.” The published pacing copy uses a lower-case initial verb to match its neighbouring objectives. The user also approved the local definition: “An instruction preserves the flags when it leaves their values unchanged.”

The unchanged `SUM_FLAGS` example executes `adds w3, w2, w2`, then `add w0, w0, w1`. The model's `addWithCarry` writes NZCV only when `setFlags` is true. Existing `adding-and-the-flags.facts.test.ts` cases check that `adds` overwrites all four flags and that `add` preserves both all-set and mixed initial flag patterns. They also distinguish updating the destination from updating the flags. The unchanged listing and its GNU/QEMU corpus remain the source of the example; this wording change does not claim a fresh native execution.

## Copy changes

The published `flags-and-overflow` introduction defines preservation before the prediction/example and the later “Writing and preserving flags” heading. It distinguishes `add`'s destination result from NZCV describing the earlier flag-setting instruction. Its reminder explicitly says `adds` updates all four.

The canonical unsplit source's short flag-lifetime explanation uses the same definition and terminology. Its first custom lesson's motivation and objective list are unchanged. The existing Module 2 prose record and the pacing-copy JSON mirror are synchronised. No arithmetic, program, inputs, prediction gate, option values, challenge, rendering code or flags model changed.

A separate drafting agent made this focused copy pass under the source course's authoring and style instructions. Independent learner and technical review belong to the parent session; this note is not their verdict.

## Checks

- Four focused suites passed: `adding-and-the-flags.facts.test.ts`, `adding-and-the-flags.test.tsx`, `module-2.prose.test.ts` and `pacing-1-4.prose.test.ts`. Result: 91 tests passed, zero failed.
- The touched TypeScript files were formatted with the repository's Prettier. Markdown retains its existing line-break convention.
- The first complete check was cancelled during type checking when the parent requested a final clarity edit. Its formatting, copyright and platform-copy stages had passed. It is not reported as a complete pass. The final copy splits the new destination result and earlier flags into two plain sentences. A fresh complete `npm run check` follows that edit; source stays uncommitted for independent review.

## Final-source complete coverage

The final-source complete check passed formatting, copyright, unchanged platform-copy verification, strict TypeScript, all 207 unit/integration suites (3,556 tests), and production build. Its browser stage announced 1,520 tests with the configured single worker. The parent authorised a local execution-concurrency change after observing the host's four-CPU quota and the existing CI recipe's roughly 43-minute runtime. That single-worker browser phase was cancelled after 126 completed passes and no reported assertion failure. This cancelled command is not claimed as a complete `npm run check` pass.

The same complete browser suite was rerun separately with `npx playwright test --workers=4` and a fresh `AL_PORT`. Every test, assertion and retry setting is retained. Repository/CI configuration is unchanged. Its completed result appears below; the earlier passed validation stages remain recorded separately.

## Independent precision correction during browser coverage

The independent technical reviewer found that equal old/new values alone do not distinguish preservation from a write. ADDS can write a value identical to the old flag bit. The parent accepted the precise definition: “Preserving the flags means not writing to them. Their existing values stay unchanged.” Both definition locations and both canonical mirrors now use it. The flag-lifetime paragraph also explicitly says ADDS writes all four flags even when a calculated flag value matches its old value. No instruction, runtime or prediction-gate change follows from this correction.

This source-only correction was made while the complete four-worker browser suite was running against the preceding production build. That build was deliberately not rebuilt or mutated during coverage. Final source/fact/parity checks, a fresh production build and focused rendered-page verification must therefore follow that suite; its complete runtime coverage must not be relabelled a check of the final definition wording.

The parent then noted that fresh browser workers can import source copy while testing the built site. The four canonical source files were therefore restored to the preceding owned copy during the current suite, with the complete precision correction held separately in `/tmp/arm-preserved-flags-precision.patch`. The brief source-edit window is recorded rather than claimed absent. The correction will be applied after this run finishes, followed by the final focused checks and build. No test or runtime was changed.

## Final results

The complete same-coverage four-worker browser run finished successfully: **1,500 passed, 20 existing conditional skips, zero failures**, out of 1,520 declarations, in 20.1 minutes. No assertion, retry setting, test declaration or CI configuration changed. This result is separate from the cancelled single-worker command and applies to the preceding production wording/build.

After that complete run exited, the held four-file precision correction was applied. Final-source formatting and diff checks passed. The four focused source/fact/parity suites passed again: **91 tests**, zero failures. A fresh production build passed in 6.64 seconds, retaining only the existing bundle-size warning. The final build is available for the parent's independent learner/technical rendered closure at phone/desktop widths in both themes. These focused final-wording checks do not relabel the earlier complete browser run as a test of text it did not contain.

## Final independent closure

Both independent reviewers closed the final wording on the fresh production build in four desktop/phone, light/dark states. The technical reviewer additionally reran all 42 focused facts checks. Their separate records describe the accepted write-versus-value-change distinction and actual gate/step/reset observations. A final strict TypeScript check also passed after the precision correction. No finding remains in the approved copy scope.
