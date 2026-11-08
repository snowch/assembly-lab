# Arithmetic lesson focus: precommit validation

Process: checked teaching brief, separate prose draft (GPT-6.1 Sol, Medium), independent learner/UX review (GPT-6.1 Sol, High), independent technical review (GPT-6.1 Sol, Extra High). No unresolved review finding remains. This is a section deletion/reordering and local-copy change, with no new control or arithmetic model.

The general C-rules section and unused copy fields are removed. The retained return-rule prompt now accompanies the closing practical question. Result cards still distinguish a valid negative value, defined unsigned wrapping and the absence of an overrun warning. The original two calls, model-derived bit/contribution/sum displays, state gates and later C lesson are preserved.

Precommit checks:

- Root focused content/term/canonical/component run: four files, 38 tests passed.
- Root Module 2/8 vocabulary/prose checks: four files, 93 tests passed.
- Independent technical initial run: six files, 112 passed and two failed. Findings were stale expectations for the moved overflow introduction and the narrowed C-standard citation, plus a stale canonical design brief. The metadata assertion, narrow reference-only numeric exclusion and canonical brief were corrected. No term-gate or arithmetic-number assertion was removed.
- Final targeted fixes run: three files, 58 tests passed, independently confirmed. Separate sequence/provenance checks passed 17 tests. These focused reruns do not change the initial run's exit status.
- Existing production-browser comparison suite: all ten desktop/phone tests passed, including both prediction choices, independent result readings, preserved table/sums and restoration.
- Independent learner review inspected initial/committed/run/restored/reset states and the closing prompt/closed reasoning at 375px and 1280px in actual light/dark themes. No console errors or document overflow. Source-only prerequisite and later-module checks are distinguished in the report.
- Strict typecheck and production build passed. Final full check will re-run both against the committed tree. Formatting/whitespace and exact canonical copy checks passed in the relevant drafting/integration passes.
- Independent targeted GNU/QEMU comparison agreed for both recorded calls and all six instruction states; the later full CI real-tools/native jobs remain separate.

Full `npm run check` runs with stable committed HEAD before pushing. Full-suite outcomes, any intentional/environment interruption, exact-head CI, merge identity and public verification are recorded separately in the pull request. No full-suite or live result is claimed by these precommit checks. The unrelated untracked Pi sources brief is excluded.
