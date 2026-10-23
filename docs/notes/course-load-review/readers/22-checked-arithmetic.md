# Conversions and checked arithmetic

Review assignment 22; Module 11, lesson order 1 within module; registry index 22 (zero-based), twenty-third lesson overall. Reviewed the shared built preview and current source without changing app files.

## Prerequisites and novelty

The learner has completed all registry lessons through `c-and-overflow`, including byte loads, casts, sign/zero extension and out-of-range GCC conversion behaviour in `loading-widths`; unsigned/signed flags and comparisons; `cset`; addressed stores and little-endian memory; function return conventions; local compilation; and the preceding lesson's C signed-overflow and C23/compiler-setting distinctions. This is not a first encounter with narrowing or with the four instructions needed for the final synthesis.

New rules are integer promotion before arithmetic; conversion for this target's mixed `int`/`unsigned int` comparison; the checked-add destination-plus-status contract and its C23 spelling; formatted output's argument-type contract; and optional sanitizer/recovery behaviour. `_Bool`, `printf`, format strings and sanitizer are explained locally. No confirmed unexplained prerequisite blocks an attempt. Header/include syntax appears in the illustrative checked-add C, without an explanation of `#include`; recognising that syntax is not required by either assembly exercise, so this is a minor assumed-knowledge limit rather than a load finding.

The first prediction asks for a returned register bit pattern after a cast. This reuses the already taught low-byte selection and sign extension, with explicit inputs and a two-instruction listing. It does not require several new mechanisms. The first construction reuses unsigned comparison to protect a range. The final construction combines previously practised arithmetic flags, store width, memory preservation and boolean reporting under a newly explained contract; this is appropriate synthesis.

## Confirmed finding

**Medium, interface tracking on phone: the post-store memory view separates the evidence from the controls and repeats byte correspondence.** Reproduce at 375px: commit the prediction headed “Predict the overflow report from the wrong flag”, then press `Next` twice in “Inspect the stored sum, unchanged neighbouring bytes and returned flag.” The figure has the assembly/control/status block, three register summaries, four flags, eight individually addressed memory cards, then a second four-card register-to-memory correspondence. Each memory card repeats “Written by this instruction” or “Not accessed by this instruction”; written cards also name their bit ranges. The complete captured figure is about 1,725px high at a 900px viewport. The lower correspondence and the stepping controls cannot be seen together.

Evidence: `/tmp/course-load-review/checked-arithmetic-375-light-step-wrong-overflow.png`, matching dark screenshot; `packages/views/src/interactives/MemoryStepper.tsx:128` (flags), `:134` (memory cards), `:218` (additional transfer view). The learner must retain the arithmetic flags while scrolling through the store's byte evidence, then scroll back to advance to boolean reporting. Width is contained and labels remain readable; the issue is avoidable switching, not unreadability or an excessive number of new instructions. Smallest direction: keep compact destination-slot and neighbouring-slot summaries with flags/status, and disclose the already familiar per-byte transfer correspondence on demand. Preserve explicit widths and untouched-neighbour evidence. Desktop reduces this cost substantially.

## Design recommendations, not confirmed overload

- Consider placing the final checked-add attempt immediately after “Return a checked-add result and its status”, before the `printf` discussion. Currently “Choose checks for the required property” introduces a separate output contract and a two-stage cast example between explanation and the checked-add task. This requires a topic switch and later resumption, but both topics are explained and no observed first-attempt block establishes that the interlude is excessive.
- The investigation presents promotion and mixed signed/unsigned comparison together, each with a separate short worked stepper. A small learner classification/check between them could test the distinction. Lack of such a check is not itself overload: the machine mechanisms are familiar and each source rule is stated before its listing.

## Keep

- “A conversion is not a range check” gives the first exercise a concrete purpose and distinguishes information loss from arithmetic overflow.
- Both predictions gate the related executions; feedback and later steppers use matching inputs. Committing any option unlocks inspection, so a wrong attempt does not obstruct learning.
- The final task explicitly separates stored sum bits from the returned report and says to store before reusing the result register. This names the actual tracking problem instead of assuming the learner will infer it.
- The wrong-flag experiment is a useful controlled failure: an existing carry-versus-overflow distinction is applied to a two-output contract. It does not introduce an unrelated opcode family.
- Optional warning/sanitizer material states the simulator boundary and does not demand external execution. Neither prediction-first design nor the page's length alone is evidence of overload.

## Coverage and limits

Read all ten sections, all ordinary disclosures, objectives, model-versus-reality note, both challenge tasks, recorded programs, and relevant implementations: `RunPrediction`, `MemoryPrediction`/`PredictionBox`, `StepperFigure`, `MemoryStepper`, `ListingPairFigure`. Prerequisite checks used earlier lesson data/source, particularly `loading-widths` and `c-and-overflow`, and the front-page entry panel.

Browser checks used four fresh Playwright contexts, widths 375 and 1280, system light and dark. Computed `--bg` confirmed rendered light `#f3f6f5` and dark `#101615`; no page-level horizontal overflow in the initial states. Captured initial full page; both committed predictions; first executed instruction in narrowing, promotion and mixed-comparison steppers; the wrong-overflow stepper after the store; both initial challenge editors; both starter `Run tests` feedback states with the first hint opened; and ordinary disclosures. Artifacts/scripts/logs are `/tmp/course-load-review/checked-arithmetic-*`. Screenshots inspected directly include phone light post-store and phone dark promotion; other widths/themes were exercised and captured, with layout/theme evidence recorded by script.

No valid challenge solution was entered, and no challenge answer is recorded here. Did not exhaust all instructions, alternative inputs, hint progression, editor modes, reset/restoration, accessibility navigation or optional external links. No compiler-service calls, rebuild, or app edits. Findings concern the bounded reviewed states, not measured learner performance.
