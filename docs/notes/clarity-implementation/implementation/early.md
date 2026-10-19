# Implementation record: lessons 00–06

Drafted from the parent's accepted audit directions and the checked facts in `early-brief.md`. Read CLAUDE.md, docs/style.md and docs/authoring.md. Applied sentence and explanation passes; independent reader/checker verdict remains separate. Model/effort inherited; no override or claim of independent certification.

## Closure by finding

| Finding | Implementation | Evidence/check |
| --- | --- | --- |
| S1 early instances | All actual prediction cards and listing comparison use prediction. Adders use calculation. Challenges use exercise; register reader, constant tester, bit operations and shift selectors use experiment; counter ring, warning word, field reading and passive comparisons use diagram. Real steppers retain step guidance. | Lesson00–06 structure, shared role API agreed with shared_ui. Existing parsed lesson/prose/facts checks passed. |
| N1 caption moment | Opening fuel_used_wrong caption names the call and asks Next to see subtraction's write, without describing initial state as after-state. | `one-pattern-three-readings.labels.ts`, canonical module1. |
| N2 actual control | Module0 tells learner to press Show the bits for all four register patterns. | `meet-the-machine.prose.ts`, canonical module0. |
| M1/M2 subtraction mechanism | Complete sum now includes a; b is identified as the input subtracted. b=0 leaves a in low bits plus carry, not always zero. Reflection includes a too. | `subtracting-and-the-tick-counter.prose.ts`. New semantic check a=0,1,1000,MAX,b=0 verifies full sum, low result and carry from model. |
| N5 guidance placement | Investigation prose ends after ring explanation; subtraction mechanism is interactive lead directly above first adder. Canonical ring caption moved to the matching position. | `subtracting-and-the-tick-counter.ts`, schema lead retained; module2 prose coverage test includes lead. |
| L2 flag wording | Counterfactual says calculated new flag values rather than set the flags. | `adding-and-the-flags.prose.ts`, canonical module2. |
| S2 lesson support | Outline captions now distinguish register writes from flag value changes. Module0 stepping instructions and additions failure prose describe writes accurately. Module2 canonical shared status synced to was written. | Lesson labels/prose and docs0–3; shared UI owns actual marker change. |
| L5 inline instruction reference | Prediction caption and option name instruction rather than missing listing. Existing prediction prose already names the inline C/instruction correctly; no unnecessary extra listing added. | `masks.labels.ts`, canonical option in module3. |
| L6 displayed gear register | Own-solution introduction says register written, before/after, possibly w1 gear or w0 warning word. | `masks.prose.ts`, canonical module3. |
| L7 transfer example | Colour example identifies red, green and blue component fields and connects extraction to known ubfx, avoiding untaught shift noun. | `masks.prose.ts`, term gate passed. No new numeric example. |
| N7 one prediction input | maskView now uses same0xffffffff as committed prediction run. | `masks.ts`; regression executes configured input and checks same low-eight bits and only bit2 change. |
| N8 independent operations | Reflection explicitly starts each instruction separately with0x47. | `masks.prose.ts`, existing model expected answers unchanged. |
| M7 C/GCC guarantees | Negative signed right shift compiler choice/documentation separated from signed-left-shift cases where C gives no programme-behaviour guarantee. GCC negative-value extension identified, examples avoid it. Arithmetic fill meaning stated before term. | `shifts.prose.ts`, canonical module3; docs/sources.md GCC integer documentation reference; existing recorded listing/facts tests. |
| 06-N1 figure referent | Prediction explanation says current card shows asr changed bits; later selector shows both shift types/fill gap. | `shifts.prose.ts`, canonical module3. |
| M6 early hint ladders | Reviewed all14 early ladders. Updated second rung where it merely stated correct rule: module0 trace; additions flags; subtraction elapsed/borrow; masks field writing/independent results; shifts rounding/type selection. Other rung2 entries already identify mistaken expectation/action. Rung3 entries are concrete shorter operation/pattern examples; retained. | Canonical docs0–3 synchronized; all prose tests pass. |

N3 (grouped hex entry), N4 (visible before-run heading), N6 (phone temporal-label wrapping) and actual S2 UI behaviour belong to shared_ui. Earlier L1/L3/L4 already resolved; no regressions introduced intentionally. No platform code touched.

## Validation

- Targeted existing lesson prose/facts suites: **13 files, 344 tests passed**. Log `/tmp/course-clarity-implementation/early-tests.log`.
- Meaningful added regressions: masks configured input/view consistency and subtraction's full sum for subtracting zero from nonzero values.
- Prettier check of changed early structures/prose/labels and two facts tests passed.
- No build, whole-repository check, browser verdict, commit or push performed by this author. Root owns final integration and fresh independent browser/technical checking.
- After successful targeted run, C note wording was refined from no-result guarantee to no-programme-behaviour guarantee, and two passive mask comparisons received diagram roles. These final local edits require the root's final integration run; formatting already checked.
