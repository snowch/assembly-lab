# Modules 0–4: published-route layout review

The separate drafting pass reviewed all 27 published routes in the exported `LESSONS`
catalogue, including section prose, visible figure lead/after text, optional notes and
challenge tasks. It also read the source lesson composition and `pacing-1-4.ts` before
editing. Source lessons are not assumed to be published pages: the pacing layer selects,
joins and splits their prose.

The aim is to let learners locate parallel inputs, rules and instruction order while
keeping explanations of mechanisms connected. Facts, examples, figures, prediction gates,
answers and prerequisites stay in their existing teaching order. No new activity or
heading is introduced. The arithmetic introduction uses the user's approved two-type
list, after the existing trip context.

This pass applies `CLAUDE.md`, `docs/style.md`, `docs/authoring.md`, the attention and state
checks in `.agents/skills/learning-design/SKILL.md`, and `docs/visual-language.md`. It is
an editorial review of source and exported published content. Browser verification and
independent review belong to the managing session; this record does not claim either or
novice validation.

| Published route | Decision | Reason |
| --- | --- | --- |
| `one-addition` | Keep | The introduction develops registers, instructions and memory in separate connected paragraphs. Operand roles already have a figure; fresh inputs already use bullets. |
| `adding-a-constant` | Keep | Each paragraph explains one immediate-operand rule or example. The short fresh-input task already lists its starting registers. |
| `tiny-function` | Change | List `add_ints`'s two C arguments beside their incoming registers so the correspondence can be scanned before the separate call. Keep compiler and return explanations connected. |
| `returning-to-caller` | Change | Number the challenge's caller → function → caller sequence. Keep the causal explanation of the return address and shared registers in paragraphs. |
| `subtraction-and-reuse` | Keep | Short explanations establish read-before-write and operand order; the diagrams carry the changing state. The fresh task already lists starting values. |
| `instructions-in-sequence` | Change | Number the two challenge instructions after the existing input list. This distinguishes the shared execution order from independent operations. |
| `meet-the-machine` | Change | List the three meanings of stepper marks after the named call. Keep Back/Reset and narrow-screen navigation in their own paragraphs. Incoming arguments and challenge roles already have lists. |
| `one-pattern-three-readings` | Keep | Hexadecimal digits build progressively from four bits to the whole register. The concrete examples need their connections, and the activity is a short two-action comparison of one editable pattern. |
| `same-bits-two-readings` | Keep | The current sequence puts each weight rule next to its computed figure and introduces fresh patterns explicitly. Splitting these short explanations into lists would separate cause from effect. |
| `four-bit-arithmetic` | Keep | Weights already use bullets; addition and inversion procedures already use numbered steps. The remaining prose explains why the arithmetic works. |
| `arithmetic-on-register-bits` | Change | Use the approved shared-width sentence, two bullets for the C type readings, and a separate explanation of bare `unsigned`. Preserve the preceding trip and four-bit context. Bounds already use parallel bullets. |
| `constants-and-widths` | Change | List the one-instruction and two-instruction compiler results under a common introduction. Keep the encoding-limit explanation and miniature constant examples connected. |
| `building-constants` | Change | List which half `movk` writes with and without `lsl 16`. Keep the example's state transition connected; division into halves is already numbered. |
| `register-widths` | Change | List the `x3` and `w3` views under an explicit same-register introduction. Retain the statement that they are not two registers and the subsequent write prediction. Preserve the reflection's positional pacing split. |
| `adding-and-the-flags` | Change | List what `add` and `adds` write before defining a flag. List the distinct C and V interpretation tests after the existing flag definitions. Keep carry propagation in prose; the four flag rules and challenge inputs already use lists. |
| `flags-and-overflow` | Change | Number the two operations whose flag ownership is being compared. Keep the supplied starting-register bullets and the following explanation of preserved flags. |
| `subtracting-and-the-tick-counter` | Change | List the two conditions required for the elapsed-time interpretation. List C's different meanings after addition and subtraction. Keep the wrap mechanism connected and existing counter-reading/task inputs as bullets. |
| `subtraction-flags-and-negation` | Change | List the two subtraction examples after saying each can be stepped. List the result/overflow/borrow flag roles in the paced explanation. Retain the derivation of the low bits and the counter qualification in prose. |
| `masks` | Change | List the four bit-to-warning meanings. Mask operation rules and independent trace operations already use bullets. Keep the explanation of why a mask leaves neighbouring bits alone connected. |
| `reading-and-writing-fields` | Change | List the two independent operations in the closing fresh-word question, retaining the instruction to restart from `0x47` for each. Existing field input roles use bullets; the failed clear experiment remains a single run. |
| `shifts` | Change | List GCC's `int` and `unsigned` choices under the shared expression, compiler and setting. Keep the reason for that difference in prose. Shift behaviour already uses bullets and the compact type comparison already uses a table. |
| `shifts-and-signed-division` | Keep | Independent challenge operations already use bullets with an explicit restart instruction. The correction sequence explains how one operand is formed and then consumed; retaining its connected paragraphs makes that dependency clear. |
| `compare-and-choose` | Change | List the four core condition rules with signedness explicit in each. Keep compare → condition → select explanation connected; the figure already represents those stages. |
| `conditions-and-boolean-results` | Keep | Conditions already appear in meaningful groups with bullets, and optional reference rules are separately listed. The Boolean example explains one complete compiler transformation, so prose and listings remain together. |
| `branches` | Change | List `describe`'s three return cases before the listing. Keep label definitions and the explanation of the actual chosen path connected. |
| `zero-and-threshold-branches` | Change | Number the task's explicitly ordered rules. Preserve the separate incoming-register bullets, allowed instructions and visible label guidance. The extracted `cbz` paragraph remains intact. |
| `register-and-bit-branches` | Change | List GCC's three named `if` examples so the learner can compare their choices. Keep the explanation of why reaching a function call requires a branch in prose. Register/bit branch rules already use bullets. |

Nineteen routes change; eight retain their existing layout after review. The changes are
22 local prose/task transformations across the source files and pacing copy. Each changed
source string is synchronised with its canonical prose record. Only the
`pacing-1-4.copy.ts` JSON block in the shared pacing record is edited by this pass.

Verification record:

- Initial focused run: nine test files, 118 passed and two failed. The failures were stale
  textual-shape checks: numbered-list markers were counted as machine facts, and a
  reflection assertion expected the old inline question.
- The numeric fact check now strips only line-leading ordered-list markers, retaining
  all checks on actual numeric claims. The reflection assertion checks both listed
  operations and the independent-start instruction while retaining the hidden-answer check.
- Final focused rerun: all nine test files passed, 120 tests passed (exit 0).

- Relevant fact/composition/link rerun: 12 test files passed, 424 tests passed (exit 0).
  This covered primitive/compiler arithmetic facts, comparison and branch traces, masks,
  published pacing composition, reminder links and C source associations.
- `git diff --check` passed. No browser checks were performed by this drafting agent.
