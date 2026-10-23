# Reader 21: C overflow and machine results

Module 11; course position 21 (zero-based registry position, after Compile a loop and follow its branches). Snapshot f1fdf35. Independent bounded learning-load review; no course edits or challenge solutions.

## Prerequisites and novelty

I used the entry assumptions and only preceding entries in `/tmp/course-load-review/lessons.json`. The learner has practised 32-bit signed/unsigned readings, hexadecimal, overflow flags, `mov`, `cmp`, `cset`, branches, and writing/testing assembly. Module 8 already contrasts defined A64 exceptional division with undefined C expressions and says to check before the operation. Module 10 has already made compiler translation and limited compiler guarantees explicit. Undefined behaviour versus instruction results is therefore a reinforced distinction, not an entirely new mechanism here.

New work is reasoning from the set of defined signed-C inputs to a compiler removing a calculation; comparing that contract with GCC's `-fwrapv`; names supplied by `<limits.h>`; and applying a guard to an increment, then naming saturation. The optional parser note adds a transfer case rather than a required parser implementation. Extra branch-preserving compiler options are explained locally as a listing choice, not something learners must operate.

No confirmed untaught prerequisite blocks the first task. `INT_MIN`, `INT_MAX`, `#include`, undefined behaviour, `-fwrapv`, and saturation receive local explanations. The initial compiler-record detail is optional, but essential signed-overflow semantics are in the main motivation before the first prediction.

## Overall judgement

The instructional sequence is appropriately sized for this position. The opening puzzle uses a short recorded listing. Motivation explains the language rule before the learner predicts a familiar two-instruction A64 run. The construction isolates the boundary predicate; the final exercise adds the previously practised branch/add structure. This is useful synthesis, not several unpractised machine mechanisms bundled together. I found no high-severity learning-load issue.

## Confirmed finding

### Medium: the compiler-contract comparison hides the very instructions being compared

Evidence: “Compare two compiler contracts” and “Compare the recorded ordinary and -fwrapv compilations.” At `#ix-compare-increment-options`, both sides repeat the same complete C source. At 375px the initial view of each side displays the C pane and hides the instruction pane entirely to the right; at 1280px each side clips the right portion of its instructions. The learner must independently pan two containers while remembering which contract and sequence belongs to which side. This adds visual tracking to the intended language-rule comparison.

Reproduction: fresh context; scroll to investigation; inspect before any interaction, then horizontally scroll each listing. Reproduces in actual light and dark at both widths. Measured `.al-listing` client/scroll widths: 315/588 at 375px and 463/588 at 1280px. The page itself stays within viewport width. Evidence: `/tmp/course-load-review/c-and-overflow-{375,1280}-{light,dark}-comparison.png`, corresponding `-comparison-scrolled.png`, and `c-and-overflow-measure.log`. Implementation: `packages/views/src/interactives/ListingPairFigure.tsx` renders two independent `ListingView`s, each with identical C; `packages/views/src/bits.css` arranges their sides.

Smallest direction: first use the available width to show each compiler contract's instructions clearly, retaining the required complete C/instruction pairing and contained scroll. Consider stacking the two contract panes at desktop too, and a clearly discoverable or coordinated horizontal comparison at phone width. Do not remove the checked source associations or move assembly beneath C merely to fit. This is a comparison-layout issue, not a reason to split the lesson's mechanisms.

## Design recommendations, not additional confirmed overload findings

- The failed first construction displays five full mismatch cards before the first hint. At 375px, `Run tests` on the untouched starter followed by “Show hint (1 of 5)” puts the hint well below the editor. A compact test summary with one expanded mismatch could shorten repair travel. This is a bounded observation from one starter attempt; I did not establish that it impedes normal revision, so it is not ranked as a separate confirmed medium finding.
- The two-operand signed bound formulas in “Check the operands before adding” go beyond the one-step increment. They are explained and immediately narrowed back to the task. If learner testing finds this transfer paragraph difficult, move its general formula behind a disclosure; there is currently no evidence that it blocks the increment task.

## Treatments worth keeping

- “This executes A64 directly. It is not an execution of the original C expression.” keeps the source-language and machine experiments distinct at the exact switch in activity.
- The short assembly prediction reuses familiar bit/flag knowledge; its associated stepper is locked until commitment. After one step, the whole short listing, status, one register and flags fit together at phone width. No full-function/state-panel competition appeared here.
- “First write the limit test on its own” provides a genuine intermediate construction before safe increment. The final recorded branch listing stays locked behind the final exercise, preserving an attempt.
- `-fwrapv` is explicitly an extra guarantee and explicitly does not fix all undefined operations. The optional minimum-value/parser transfer example stays closed initially.
- Worked recordings, predictions, construction and final exercise carry distinct labels. The lesson does not need a universal one-opcode-per-lesson redesign.

## Coverage and limits

Read all ten sections, objectives, model-versus-reality note, all lesson props, both challenge tasks/hint sequences, recorded-program definitions in `c-boundaries.listings.ts`, and relevant `RunPrediction`, `StepperFigure` and `ListingPairFigure` implementations. Challenge references were inspected only to understand gating; no solution is reproduced here.

Browser: four fresh contexts, 375×900 and 1280×900, system light/dark. Actual theme verified by computed `--bg` (`#f3f6f5` and `#101615`) and viewed screenshots, rather than assuming a requested preference. Initial full-page captures cover all sections. In each context I committed both predictions, advanced each unlocked stepper once, opened normal visible details (compiler/C note, parser note, reflection answer and runtime notes), ran the untouched first challenge starter, opened its first hint, and inspected both compiler comparison panes before and after horizontal scrolling. Initial and representative post-interaction captures are under `/tmp/course-load-review/c-and-overflow-*`; browser text and measurements are in the corresponding logs.

I did not solve either challenge, unlock the final passed-challenge listing in the browser, exhaustively step the wrapping run, test reset/persistence, use tap editing, or call external compiler services. The final listing's contents/gate and later hint behaviour are source-only. No learner timing or retention study was performed; novelty and tracking judgements are analytic, not measured cognitive-load outcomes.
