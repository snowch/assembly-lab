# Calculator consolidation: independent review

Reviewed 14 November 2026 by an independent Codex review session that did not author or edit the product change. Learner and technical passes are recorded separately below. The source, instructions and diff were read before the author brief. Browser capture began before the brief; the brief was opened while capture was finishing, before screenshot inspection. This is a sequencing limitation: the requested complete UI-before-brief order was not met.

## Scope and evidence

Reviewed the removals in `content/lessons/pacing-1-4.ts`, `four-bit-arithmetic.ts`, `constants-and-widths.labels.ts` and `packages/views/src/PredictionTools.tsx`, together with their changed unit and browser coverage. Read `AGENTS.md`, `CLAUDE.md`, the independent-review requirements in `docs/authoring.md`, `docs/style.md`, the relevant model/view code and `docs/sources.md`. The later brief agrees with the removal scope observed in source.

The browser was Chromium against the supplied final-build preview at `http://localhost:4204/assembly-lab/`. Each of the five routes was opened at 1280 and 375 pixels in both themes, in fresh browser contexts. Actual `html[data-theme]` was checked, rather than assuming the selected preference had applied. Screenshots, text captures, scripts and result records are outside the repository in `/workspace/output/inline-review/`.

## Learner review

No blocking or substantive learner finding was accepted within this change's scope.

The retained learning sequence still defines, demonstrates and practises the affected mechanisms:

| Route | Definition and demonstration retained | Learner action retained |
| --- | --- | --- |
| `one-pattern-three-readings` | Four bits per hex digit, with bit groups and their digits aligned | Change a bit, enter hexadecimal and clear the register pattern |
| `same-bits-two-readings` | Unsigned weights, the negative highest signed weight, complete small examples and the explicit bridge to a register width | Fresh small-pattern practice, gated exploration, fresh register-pattern transfer and the negative-pattern challenge |
| `four-bit-arithmetic` | Column addition, the carry outside the retained width and the inversion/add-one subtraction method | Reveal columns, reset them and attempt the separate fresh subtraction exercise |
| `building-constants` | A complete halves example, its instruction-by-instruction writes, and the arithmetic for finding the halves | Step/reset the example, use whole-number division and attempt the assembly challenge |
| `register-widths` | The relationship between the two register names, prediction before the halves view, and the separate address example | Commit a prediction, inspect the unlocked view and submit two independent graded register predictions |

An additional preparation bridge is unnecessary for these removals: the small examples and composition steps remain on the lesson pages. The removed programmer-calculator guides had their own optional tasks, but the main lesson practices and their gates remain. This is not a claim that the optional guide tasks themselves survive consolidation.

The revised caption reads, "Calculator in the header and Working notes are optional." Desktop shows the named Calculator control. Phone shows a calculator icon with the accessible name `Calculator`; the icon remains available in the header. The tool opened, calculated, closed and returned focus to its trigger on every reviewed route. No lesson direction was found that still requires the removed programmer panel or its old guide controls.

The remaining local `Calculator` disclosures in the readings and constant-building activities are formula helpers. In particular, the building-constants prose still says "you can use the calculator below", and that whole-number-division helper remains below it and works. Treating those specialised helpers as accidental programmer-panel duplicates was considered and rejected.

### Prerequisite assumptions

The reviewed material assumes the front-page prerequisites and earlier lessons: a bit can be set or clear, registers retain bit patterns, basic whole-number arithmetic, and the previously introduced instruction controls. Hexadecimal and its prefix are explained in the hexadecimal lesson; signed positional weights are defined and demonstrated before the small practice; the change from four to register-width positions is explicit; halves, the shift notation and optional `#` notation are explained before constant construction; the `w`/`x` relationship is explained before the register challenge.

The new caption adds no required technical prerequisite. Recognising the phone's calculator icon is a minor interface assumption, supported by its familiar symbol and accessible name. This review did not identify a newly untaught term caused by removing the duplicate panels. It was not a complete term audit of every pre-existing sentence in these lessons.

## Technical review

No blocking or substantive technical finding was accepted within the consolidation scope.

- The lesson-source diffs remove optional `programmer-calculator` figures and their helper/import. The named teaching figures remain mounted. Removing the extra constants `interactives` override falls back to the original construction section's interactives through the existing section spread; it does not remove the halves activity or its challenge.
- `PredictionTools` loses only its `ProgrammerCalculator` import and mount. Its notes storage key, handoff state, storage-failure handling, autosave, clear behaviour and unsaved-text retention are unchanged. The retained component has no grading callback or answer artifact.
- Fresh-browser checks found zero `.al-programmer-calculator` panels, exactly one header Calculator trigger, all expected teaching figures, no console/page errors and no page-level horizontal overflow across the 20 combinations. Opening the shared tool also caused no page overflow.
- Direct browser interaction checks passed in all four viewport/theme combinations for bit/hex editing, practice-gated exploration and reset, column reveal/reset, halves stepping/reset, the retained division helper and register-prediction commit/reload. The initial untouched register halves view was locked; committing a prediction opened it and survived reload.
- A separate direct browser check passed in all four combinations for calculator/answer/notes isolation, notes autosave and reload, restored failed grading, clearing graded work while keeping notes, and clearing notes while keeping an entered answer. Calculator work did not grade the challenge or unlock its independent prediction gate.
- Retained views still obtain register patterns and readings from the existing model paths (`RegisterReader`, `readings.ts`, the reading sequence and the halves stepper). The consolidation changes no Arm instruction, C rule, model operation or expected challenge answer. Consequently this review does not claim a fresh external-manual or GNU/QEMU validation of those unchanged semantics.

The changed browser tests preserve meaningful assertions about global scratch-state independence, notes, grading and navigation while removing selectors for controls that no longer exist. The notes persistence and storage-failure unit tests remain. The distinct arithmetic helpers still have their lesson data, rather than being silently replaced by the global bit calculator.

## Verification and limits

- Independent focused unit command: `npx vitest run packages/views/src/PredictionTools.test.tsx content/lessons/programmer-calculator.test.ts`. Result: **2 files, 10 tests passed**, exit 0.
- Independent browser matrix: `inspect.cjs`, **20 route/viewport/theme combinations passed**, exit 0. Evidence: `results.json` and the accompanying screenshots/text captures.
- Independent teaching interactions: `activities.cjs`, **4 viewport/theme combinations passed**, exit 0. Its first run failed on a review-harness assumption that reset would remove the half-mark elements. Source shows they remain with blank text. The corrected assertion checked blank text and the complete rerun passed; no product change was needed.
- Independent notes/answers interactions: `notes.cjs`, **4 viewport/theme combinations passed**, exit 0. Evidence: `notes.json`, `notes.log` and reset-state screenshots.
- A separate broad run of the three browser spec files was intentionally interrupted after the managing session reported its completed focused run. Its actual result was **7 passed, 1 interrupted, 28 not run**, exit 130. It is not recorded as a passing suite. Its external config used the supplied preview directly and did not start another server. Evidence: `playwright.log`.
- The managing session separately reported **12 focused browser tests passed** against the same final preview for consolidation, prediction scratch tools and navigation persistence. That result is reported evidence, distinct from this reviewer's direct runs.

No full-suite result is claimed here. Storage failure was exercised by the retained unit tests, not by browser fault injection. Browser interaction scripts checked all stated matrix combinations; visual screenshot inspection concentrated on the retained diagrams, phone layouts, header trigger, shared panel and register challenge. These checks support this narrow removal and persistence review, not a complete audit of the other concurrent calculator and flags changes.

There are no accepted product findings requiring a correction/checker cycle. The sequencing limitation at the start remains a review-process limitation for the managing session to assess.
