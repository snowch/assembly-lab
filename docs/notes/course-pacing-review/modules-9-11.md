# Modules 9–11 pacing review

Copyright © 2026 Christopher Snow

Review only, 30 October 2026. No lesson changes or exercise solutions are proposed here.

The clearest candidates for separate stopping points are **Calls, returns and the stack**
and **Conversions and checked arithmetic**. The other four pages have connected investigations
that justify a longer page than an individual Module 0 mechanic. Neither page height nor the
ten-section pattern is sufficient evidence for a split.

## Ranked findings

### 1. Medium: checked-arithmetic changes learning goals after its first exercise

**Page/sections:** Conversions and checked arithmetic; investigation, construction, then
failure experiment and explanation.

The construction says, “Decide whether fuel fits in one unsigned byte before narrowing it.”
The next section starts, “This course-written assembly attempts to report signed addition
overflow.” The subsequent explanation introduces `<stdckdint.h>`, `ckd_add`, `_Bool`, an output
pointer and a two-part result contract. These are two independently assessable goals: preserve
a value across a conversion, and implement an arithmetic operation that stores bits while
returning a status. The checked-add example does not need the preceding promotion or mixed
comparison examples. The shared trip setting does not make them one investigation.

Before reaching the first exercise, the learner also moves from narrowing to integer promotion
and then to mixed signed/unsigned comparison. The transition explicitly says, “Mixed signed and
unsigned arithmetic has another conversion rule.” Those two investigations interrupt the
direct route from “A conversion is not itself a range check” to the byte-range exercise.

**Smallest useful direction:** give the conversion/range-check block its own completion point,
and start checked addition at the current failure experiment with its own short purpose and
contract. Retain the wrong-flag experiment, stored bytes and final checked-add task together.
Bring the byte-range exercise directly after narrowing, then treat promotion/mixed comparison
as the next related conversion investigation. Do not split the addition trace into arithmetic,
store and report pages; seeing their interaction is its purpose.

Trim the repeated byte-conversion introduction before adding pages. Module 6's
`loading-widths.prose.ts:47` already explains casts, the two byte conversions and GCC's `sxtb`
and `and` choices; its following detail explains out-of-range signed conversion. This is a
retrieval/application opportunity, not four wholly new concepts. Keep the compiler-specific
qualification available locally.

**Rendered evidence:** at 375 pixels the two promotion/comparison steppers sit between the
narrowing prediction and byte-range exercise; after commitment these become two complete
instruction/register panels. The checked-add block then opens a separate memory/flags view.
At 1280 pixels this remains a change of task, despite the more compact layout. Both themes show
the same sequence. Source: `checked-arithmetic.prose.ts:18`, `:20`, `:31`, `:36`, and the activity
ordering in `checked-arithmetic.ts`.

### 2. Medium: calls-and-returns postpones the first small construction until after the larger frame

**Page/sections:** Calls, returns and the stack; motivation through construction.

The opening is already a helpful smaller example: “It calls `half_distance` and returns the
helper’s result unchanged.” But before its first step, the learner meets the link register,
stack pointer, calling convention, stack frame, alignment, frame pointer, paired saves and
paired restores. Then “Now follow `trip_report`, which keeps a reserve across the helper call”
adds a larger frame, `x19` preservation, full-width preservation and public-boundary rules.
Only afterwards does the page ask, “Write a function that calls the helper and then adds one.”
That task principally consolidates the smaller call mechanism the learner has just left.

The burden is keeping two frame layouts and two responsibilities active before attempting the
first simpler construction. It is not that stack frames can be explained without their save
and restore instructions. Those belong together.

**Smallest useful direction:** move the small construction and overwritten-link experiment
next to the small returning-call trace, giving that goal a conclusion. The strongest page
boundary is then before the reserve-preservation example. A first page can establish a call
that resumes and returns; a second can establish keeping another live value across a helper
that is allowed to change argument registers. Move the associated explanation with each goal,
rather than cutting the existing sections in half. Keep alignment and restoration rules with
the first stack use, and retain the larger frame's diagram beside its explanation.

**Rendered evidence:** the first Next is initially at approximately page y=3447 at 375 pixels
and y=2319 at 1280. The opening contains six prose paragraphs and the figure adds three before
its listing and controls. The basic construction starts only after the report's listing,
prediction and preservation investigation. These measurements describe navigation burden,
not reading time: the revised Module 0's One addition also places its first Run well down the
page, around y=2494 on the phone. The substantive distinction is the stacked decisions and
delayed consolidation. Actual light/dark screenshots confirm readable stack slots and a useful
first stepped frame, so removing that diagram would worsen the lesson. Source:
`calls-and-returns.prose.ts:11`, `:15`, `:23`, `:25`; activity ordering in
`calls-and-returns.ts`.

### 3. Low: from-c-to-instructions inserts optional service administration before its closing C task

**Page/section:** From C to instructions; generalisation, “Inspect a second compiler deliberately”.

The useful principle “Compare compiler output by following the values and the paths that run”
is followed by “If you choose the GCC comparison, the page sends the current C source only
after you press the button.” Privacy, attribution, caching, failure behaviour and unsupported
instructions then occupy the route to the capped-charge exercise. That exercise does not use
the service. The browser playground already presents Compare with GCC as a closed detail.

**Smallest direction:** keep the comparison principle and local-compiler limitations in the
main sequence, and place the service-specific guidance with that optional panel. Preserve the
disclosure before its send button. This is a local trim/repositioning, not a reason for another
page. The register-allocation explanation, source edit, equivalent assembly and final C task
make a coherent translation lesson. Source: `from-c-to-instructions.prose.ts:38`.

### 4. Low: c-and-overflow teaches general addition bounds before an increment-only task

**Page/section:** C overflow and machine results; explanation, “Check the operands before adding”.

The explanation moves from checking operands to “For a positive `b`, the sum is too large when
`a > INT_MAX - b`” and the separate negative-operand case. It then narrows back to “The one-step
increment needs only the upper-bound check.” The learner has to distinguish two general bound
subtractions and their branch conditions before returning to the one-operand task actually
being practised. There is no general signed-add exercise on this page to consolidate them.

**Smallest direction:** retain the check-before-operation principle and increment reasoning in
the main sequence; offer the general two-operand derivation as a clearly scoped extension.
The parser/minimum-value material is already optional and need not be deleted. Keep the direct
A64 experiment, ordinary compiler output and wrapping-option comparison together: the
distinction between those contracts is the lesson's core. Source: `c-and-overflow.prose.ts`,
`explanation` and `generalisationNote`.

## Module-by-module disposition

| Module/page | Disposition | Retain and why |
| --- | --- | --- |
| 9: Calls, returns and the stack | Two goals merit a stopping point; reorder before any split. | Small returning-call trace, broken-link experiment, and later deliberate reserve preservation. Saving return state and keeping application data are different responsibilities. |
| 9: Recursive calls and separate frames | Retain one page. | Base case, progress, pending work, frame unwinding and the failure to reduce the argument explain one recursive mechanism. The final count changes what must survive a call while reusing that mechanism. |
| 10: From C to instructions | Retain; local optional-panel trim. | A source value through working registers, a real edit and equivalent assembly establish translation. The capped C task applies earlier comparisons and unsigned wrapping. No additional language feature requires an independent page. |
| 10: Compile a loop and follow its branches | Retain; no restructuring needed. | Condition/body/update, empty case, boundary edit, wrapping counter and valid repeated shifts all test the consequences of how a loop repeats and stops. Earlier Modules 3 and 5 supply shifts and loops; C loops are also a front-page prerequisite. |
| 11: C overflow and machine results | Retain; trim the general two-operand detour from the required route. | The apparently removed addition, direct machine addition and changed compiler contract must be compared nearby. The limit-test construction feeds the guarded-increment task. |
| 11: Conversions and checked arithmetic | Prefer two pages after shortening recap. | First conclude conversion/range checking; then teach the stored-result/status contract through one connected memory/flags experiment and task. Keep formatting and sanitizer material optional. |

The recursive page does repeat the same successful run in two full stack steppers. Its transition
is explicit: “This figure starts at the deepest point … Use Back … or Next”. Source sets the
second to `initialStep: 22`, whereas the first starts before execution. The built second view
shows the separate active frames. I therefore do **not** treat it as an accidental duplicate or
recommend another recursion page. If later consolidation is wanted, a deepest-point shortcut in
one trace could preserve both uses; simply removing the second diagram would lose the local
stack explanation. This is an optional design direction, not a ranked defect.

## Prerequisite assessment

Read the front-page Before you start, the published lesson ordering, the Module 0 fundamentals
and synthesis, and targeted earlier prose for byte conversions and division/C limits. This
review treats ordinary `if`/loops/arrays and `int`/`unsigned` as known, not as new Module 10
content. Module 6 already supplies addresses, pointer notation, byte widths, sign extension
and casts. Module 8 already distinguishes a machine operation from undefined C cases. Module 9
introduces the stack/call vocabulary locally; recursion follows it. Module 10's important new
load is operating and interpreting the local compiler, not learning C loops afresh. Module 11
explains the library names and boolean contract where used. No additional prerequisite blocker
was established in this pass. This was targeted prerequisite checking, not a fresh audit of all
earlier pages.

## Browser and source limits

- Used the existing production preview at `http://localhost:4411/assembly-lab/`, via Chromium.
  Loaded all six assigned routes plus One addition at 375×812 and 1280×812 in light and dark.
  Confirmed `html[data-theme]` and distinct computed body backgrounds: light
  `rgb(243, 246, 245)`, dark `rgb(16, 22, 21)`.
- Inspected rendered section order and initial controls on every assigned page in all four
  width/theme combinations. Captured representative opening and section screenshots of
  calls-and-returns, from-c-to-instructions and checked-arithmetic in all four combinations;
  visually inspected selected opening/action/transition captures covering all four combinations.
  Also visually inspected active
  recursive, loop and overflow-comparison captures at selected phone/desktop themes.
- Committed each page's predictions in all four combinations to expose the gated figures.
  Ran each Module 10 main playground locally and advanced its first instruction. Advanced the
  small call's first instruction and the first successful steppers elsewhere; inspected the
  recursive investigation's prepared deepest state and the checked-add failure view's initial
  registers/flags/memory. No document horizontal overflow was measured in these initial or
  sampled active states. This is a pacing observation, not a complete layout/accessibility test.
- Read all six lesson `.ts`, `.prose.ts`, `.labels.ts` files; shared calls, local-compiler and
  C-boundaries listings; the small-call bridge; and Module 10 recorded course compilation data.
  The compiler panel's `strings.compiler.ts` was also read. Hints, tests and reference data
  were read for task scope, but their solutions are not repeated
  here. All optional lesson prose was read in source; optional details were not all expanded in
  the browser.
- Did not solve challenges, reveal their full answers in the browser, run their test cases,
  exhaustively step traces, test reset/restoration, edit C, send code to Compiler Explorer or
  open external recordings. The post-success safe-increment listing remained gated and was
  read in source only. GCC panel internals and formatter/sanitizer examples were source-only.
  No test suite was run: this change adds review notes only.
- Supporting captures and measurements are temporary under `/tmp/pacing-9-11-browser/`;
  `initial.json` and `active.json` record the sampled geometry/states. Geometry changes after
  commitments, so the initial positions above should not be interpreted as finished-page sizes
  or learner completion times.
