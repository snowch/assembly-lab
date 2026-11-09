# Reminder links: Modules 0–4

## Scope and drafting brief

Reviewed all 27 published lessons in Modules 0–4, in published order, from the rendered lesson-data export at `/workspace/scratch/reminder-links/lessons.json`. This pass inspected source and lesson data, not a browser. Independent learner, technical and browser review remains separate.

Outcome: when a lesson composes an earlier mechanism, the learner can recall the relevant rule locally and return to its explanation or practice. The reminder must preserve the current lesson’s essential explanation and prediction gates. No controls or activities change in this pass.

Checked facts come from existing published explanations: input reads precede destination writes; the following instruction reads the resulting state; signed and unsigned readings share bits; `mov` replaces a destination value; AND clears at zero mask bits and OR sets at one mask bits; `add` preserves flags and `adds` writes them; addition passes carries left; subtraction’s C means no unsigned borrow and V means signed overflow; conditions read flags; `asr` copies the old top bit and `lsr` supplies zeros. The destination pages already define and demonstrate these facts. Reminder links supply retrieval routes, not missing instruction semantics or exercise answers.

A likely misconception is that a printed negative mask is an instruction to subtract, or that a new arithmetic result necessarily has new flags. These are hypotheses about retrieval difficulty, not observed learner findings. Existing mask and stale-flag activities can reveal them. No claim of novice learning validation is made.

## Lesson-by-lesson decisions

Existing links below include forward and optional references; they are recorded without counting them as prerequisite reminders. All accepted new links point to earlier published lessons. A direct predecessor link is kept only where it retrieves a mechanism now composed with a new one.

| Module | Published lesson | Existing lesson links | Decision and reason |
| --- | --- | --- | --- |
| 0 | `one-addition` | `register-widths` (forward) | No backward link: the first lesson defines registers, instructions and operands locally. |
| 0 | `adding-a-constant` | None | No new link: one constant operand is introduced beside the complete addition; the operand rule remains local. |
| 0 | `tiny-function` | None | No new link: arguments, result register and return are explained in the first complete functions. |
| 0 | `returning-to-caller` | `calls-and-returns` (forward) | No new link: the opening recalls the immediately preceding function and its result in `w0`, then teaches the call route locally. |
| 0 | `subtraction-and-reuse` | None | No new link: the opening repeats the read-before-write rule before teaching subtraction order. |
| 0 | `instructions-in-sequence` | None | No new link: its small complete addition/subtraction sequence explicitly teaches carrying state forward. |
| 0 | `meet-the-machine` | None | Added `instructions-in-sequence`: recall that each instruction uses the previous state before tracing a longer compiled function. |
| 1 | `one-pattern-three-readings` | None | No new link: hexadecimal is first taught here; its bit groups and digit mapping stay visible. |
| 1 | `same-bits-two-readings` | `twos-complement` (optional appendix) | No new link: the reading sequence defines, demonstrates and practises bit weights locally, including the bridge to register width. |
| 1 | `four-bit-arithmetic` | `adding-and-the-flags` (forward) | No new link: the small-width calculation and retained low bits are explicitly taught before the register-width application. |
| 1 | `arithmetic-on-register-bits` | `c-and-overflow` (forward) | No new prerequisite link: the opening recalls the earlier four-bit subtraction and states both C widths/types locally; the worked returned-bit calculation is handled in the separate arithmetic change. |
| 1 | `constants-and-widths` | None | No new link: the local explanation already maps hexadecimal digits onto the two halves used by `mov`. |
| 1 | `building-constants` | None | Added `constants-and-widths`: recall whole-value replacement by `mov` before combining it with `movk`’s partial replacement. |
| 1 | `register-widths` | `c-integer-types` (optional appendix) | The register-width relocation adds a reference after the existing recap. Both register views and the effect of a `w` write remain taught locally; no required explanation moves behind the link. |
| 2 | `adding-and-the-flags` | None | Added `same-bits-two-readings`: retrieve how signed and unsigned values come from the same bits before separating their range checks. |
| 2 | `flags-and-overflow` | None | Added `adding-and-the-flags`: recall `add`/`adds` flag behaviour before tracking which operation the displayed flags describe. |
| 2 | `subtracting-and-the-tick-counter` | None | No new link: local counter arithmetic and the wrap limit explain the elapsed-time calculation; a generic flags link would not support that task. |
| 2 | `subtraction-flags-and-negation` | None | Added `adding-and-the-flags`: retrieve column carries before explaining subtraction through the adder. |
| 3 | `masks` | None | Added `same-bits-two-readings`: recall that a negative printed mask names the same bits under a different reading. No mask prediction result is given. |
| 3 | `reading-and-writing-fields` | None | Added `masks`: retrieve the AND/OR preservation rules before composing them to replace a field and preserve surrounding warnings. |
| 3 | `shifts` | None | Added `same-bits-two-readings`: recall the top bit’s signed contribution before comparing right-shift fill rules. |
| 3 | `shifts-and-signed-division` | None | Added `shifts`: retrieve the two right-shift fill rules before comparing them with C division and the compiler correction. |
| 4 | `compare-and-choose` | None | Added `subtraction-flags-and-negation`: recall C/no-borrow and V/signed-overflow before interpreting the flags written by `cmp`. |
| 4 | `conditions-and-boolean-results` | None | Added `compare-and-choose`: recall that a condition selects a signed or unsigned flag rule before extending the rules and producing Boolean results. |
| 4 | `branches` | None | Added `conditions-and-boolean-results`: retrieve condition rules before using a condition to change the execution route. |
| 4 | `zero-and-threshold-branches` | None | No new link: construction retains the conditional-branch rules and provides `cbz`’s definition locally; another immediate-predecessor link would repeat those instructions. |
| 4 | `register-and-bit-branches` | None | Added `masks`: retrieve the warning bit assignments before following the service-bit branch; the branch instruction definitions stay local. |

## Implementation and checks

The drafting pass adds thirteen reminders: twelve in `pacing-1-4.copy.ts`, joined beside the relevant retained section in `pacing-1-4.ts`, and one in the Module 0 synthesis prose. Canonical prose is synchronised in the Module 0 record and the `pacing-1-4.copy.ts` JSON block. No legacy lesson explanation is replaced. The arithmetic comparison’s `workedReadings` option is enabled for the separate worked-calculation change.

The initial focused run, before synchronising the pacing canonical record, returned exit 1: Module 0 prose/facts passed (40 tests); the pacing canonical test failed on the pending copy synchronisation. Later reruns do not change that initial result. The next focused run returned exit 1: canonical pacing and Module 0 prose passed; Fundamentals caught “carrying” as a premature occurrence of the later term “carry”. The reminder now says “using those values in the next instruction”. The final rerun of those three files passed all 27 tests. A separate focused run of pacing structure and Module 0 facts passed all 31 tests. `git diff --check` and focused Prettier checks passed. No browser checks were performed in this drafting pass.
