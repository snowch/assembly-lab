# Pacing review: Modules 5–8

Review only, 30 October 2026. No course content changed and no exercise answers recorded here.

The clearest split is **array element selection versus traversal** in Module 7. Modules 6 and 8
also place useful but separable material between a mechanism and the task that consolidates it.
Moving those extensions is a smaller first step than turning every section into a page. Module 5
can retain its two-page structure; its second page needs less repeated presentation.

## Basis and limits

Read `CLAUDE.md`, `docs/style.md`, the review brief, the relevant prerequisite order in
`docs/plan.md` and `content/lessons/index.ts`, and the current Module 0 structure in
`fundamentals.ts`. Read all eight assigned lessons' `.ts`, `.prose.ts` and `.labels.ts` files,
including tasks, allowed instructions, hints, test cases and figure gates. Read their four
shared listing files: `loops.listings.ts`, `memory.listings.ts`, `arrays.listings.ts` and
`products.listings.ts`. This is a pacing review, not a fresh ISA/C accuracy audit.

Used the existing production preview at `http://localhost:4411/assembly-lab/`, headless Chromium.
All eight pages and `one-addition` were loaded at **375 × 812** and **1280 × 800**, in both
themes. Confirmed the actual `html[data-theme]` and computed body backgrounds: light
`rgb(243, 246, 245)` and dark `rgb(16, 22, 21)`. Extracted the initial rendered text and section
positions; checked both prediction gates on each assigned page to expose its dependent figures.
The answers chosen for that inspection were arbitrary first options, not submitted exercise
solutions.

Visually inspected screenshots of these representative affected sections in **all four
width/theme combinations**:

| Page | Section inspected visually |
| --- | --- |
| `counting-down` | “Why unsigned counts cannot go below zero”, including the preceding while/do explanation |
| `loading-widths` | “Extend bits already in a register”, including its join from the gradient experiment |
| `array-addresses` | “Move through the array”, including the grouped memory bytes above it |
| `products-and-widths` | “Read both halves of a product”, including its join from the `msub` example |
| `division-and-remainders` | “Calculate fuel consumption”, including its join from division by ten |

Also visually compared `one-addition`'s “Run one addition” at phone/light and desktop/dark.
The other three assigned pages (`counting-up`, `memory-and-addresses`,
`zero-terminated-strings`) had rendered DOM/text and gate inspection at all four combinations;
their screenshots were captured but not visually reviewed. Their retain recommendations rest
principally on whole-source reading and rendered text, not complete visual traversal.

Additional interaction sampling was **phone/light only**: advanced one instruction and reset
the loading comparison, the addressing comparison, the product-halves stepper, the signed
remainder stepper and the do-loop stepper. Selected all six load-comparison cases and all three
addressing cases at the retained step. Did not trace every instruction, finish challenges,
open every optional detail/hint, check saved/restored work, or run the educational/full test
suites. These are review observations, not verification of course correctness or persistence.
Temporary screenshots, rendered text, scripts and measurements are under `/tmp/pacing-5-8/`.

The initial phone page heights ranged from about 10,000 to 12,000 pixels; committing predictions
expanded them to about 13,700–17,100 pixels. `one-addition` was about 4,200 pixels. These figures
include controls, listings and spacing and measure neither reading time nor cognitive load.
Notably, the cohesive `counting-up` was taller initially than several pages with stronger
structural findings. Length alone would rank the pages wrongly.

## Ranked findings

### 1. Medium: the mixed-record task follows a second lesson about register conversion

**Module 6, `loading-widths`, “Extend bits already in a register” and “Choose the width needed
by the next operation”.** The transition is “Extension can also work on bits already in a
register.” It moves from load interpretation into `sxtb`, `uxtb`, C casts, GCC's use of `and`,
then `sxtw` and an extended `add`. The page subsequently changes direction again: “For a record
containing several fields, choose the right load for each field.” See
[`loading-widths.prose.ts`](../../../content/lessons/loading-widths.prose.ts), `explanation` and
`generalisation`; [`loading-widths.ts`](../../../content/lessons/loading-widths.ts) mounts a
compiler listing and four separate register-operation steppers across these sections.

The learner has already predicted, compared, written and broken a signed load. To reach the
mixed-record consolidation they must now distinguish memory extension from register extension,
learn cast syntax, follow an alternative compiler lowering and change to mixed-width arithmetic.
The record exercise uses loads, offsets and address preservation; none of those four new
register-operation steppers is required by its allowed-instruction list. This is a separate goal,
not merely a long explanation of the same load. On a phone, the new cast explanation occupies
most of the inspected viewport before even its first listing appears.

**Smallest correction:** keep the load comparison, gradient task, wrong-load experiment,
byte-offset introduction and record task on the direct route. Move the register-conversion
sequence after the record task as an explicit extension, or to a short subsequent page before
later code needs it. Keep the six-case load comparison together: switching one view is useful
controlled comparison, not six lessons. Preserve the local distinction between extension into
`w0` and clearing the top of `x0`. Keep the cast qualification beside any moved cast example.

### 2. Medium: array selection and pointer traversal are interleaved before either has a stopping point

**Module 7, `array-addresses`, investigation through generalisation.** “The three loads use
different rules for updating the pointer” introduces offset, pre-index and post-index forms
before “Choose an element by scaling its index to a byte offset” returns to the indexed-load
exercise. After the missing-scale experiment, “C pointer arithmetic uses the pointed-to type”
starts a further sequence: `*trips++`, `+=`, extended `add`, end-address calculation, reuse of
the count register, and GCC replacing a countdown with a pointer comparison. See
[`array-addresses.prose.ts`](../../../content/lessons/array-addresses.prose.ts), `investigation`,
`construction`, `explanation` and `generalisation`.

Selection asks “which element?”, while traversal adds “where does the next access start, and
when must it stop?”. Both are worthwhile. The burden is switching into pointer-update rules,
back to scale selection, then into traversal plus compiler transformation on the same completion
unit. The rendered “Move through the array” section confirms that the five connected explanatory
paragraphs precede the compiled-loop figure; on a phone the first two already fill the visible
section of the screenshot. The address-grouped memory diagram is useful and should stay.

**Smallest correction:** first reorder the three-mode comparison to the traversal material.
**Useful split:** close an element-selection page after the indexed-load exercise and
missing-scale experiment; begin a traversal page with the offset/pre/post comparison, then
pointer arithmetic, the complete compiled sum trace, stopping rules and sum task. The latter
remains one integrated investigation. Do not split the end-address explanation away from its
compiled listing or create separate pages for each addressing form. This is the strongest
candidate here for Module 0's one-mechanism-per-page treatment.

### 3. Medium: the product page changes to 128-bit results before assessing its 64-bit goal

**Module 8, `products-and-widths`, “Read both halves of a product”.** The transition is “A
product of two 64-bit inputs can need 128 bits.” It follows the widening multiplication and
`msub` examples, introduces high-half selection, and mounts both a stepper and completed-halves
diagram. The next exercise returns to a full product of **32-bit** inputs. See
[`products-and-widths.prose.ts`](../../../content/lessons/products-and-widths.prose.ts),
`explanation`, `generalisation` and `finalTask`; the final task permits widening multiplication
but does not require high-half instructions.

The signed/unsigned high-half comparison directly serves the course thesis, so it should remain.
Its current position asks the learner to leave a newly established 32-to-64-bit mechanism,
reason about a second result-width boundary, and then return to the earlier mechanism to finish.
The screenshot confirms the 128-bit topic appears as the next required section, with no
intervening consolidation of widening multiplication.

**Smallest correction:** put the wide-product task immediately after the late-widening
experiment and signed/unsigned widening comparison. Follow it with the product-halves sequence
as an extension or separate short page. Retain its stepper and completed comparison together;
they expose process and result. Keep `madd` with the scaled-total task. `msub` can remain a short
bridge into the next lesson, or move immediately before remainder construction; do not duplicate
its full introduction in both places. No need to split narrow multiplication from the
late-widening experiment: the latter explains why the former is insufficient.

### 4. Medium: division by a constant interrupts the route into the synthesis task

**Module 8, `division-and-remainders`, “Division by a constant” to “Calculate fuel consumption”.**
“GCC can also replace division by a constant with other arithmetic” starts a recorded
multiply-and-shift example. The next section changes goal: “An average can overflow before its
division, even if the final quotient fits.” That section introduces unit scaling, a function
contract for zero distance, and the distinction between a promised incoming `w1` value and an
instruction having cleared the upper half of `x1`. See
[`division-and-remainders.prose.ts`](../../../content/lessons/division-and-remainders.prose.ts),
`generalisation` and `challengeIntro`.

The constant-divisor listing is not needed to construct this variable-divisor result. It asks
the learner to inspect another compiler strategy just before applying widening multiplication
and division together. The capstone introduction is substantive: in the initial phone render,
its challenge section occupied roughly 1,770 pixels, including its editor. Its incoming-register
qualification is essential to the exercise tests; trimming it to make the page shorter would
make the task less teachable.

**Smallest correction:** move the constant-divisor example after the consumption task as a
clearly separate compiler investigation. Preserve quotient prediction, remainder derivation,
signedness failure and C-versus-instruction edge experiments as a connected core. A separate
consumption application page is a defensible secondary split after that core, because it has
its own inputs, contract and width planning. It is less urgent than removing the intervening
constant-divisor detour; avoid splitting the capstone's unit explanation from its exercise.

### 5. Low: countdown failures receive repeated complete views before the final improvement

**Module 5, `counting-down`, failure experiment and generalisation.** “A different mistake is
to use `while (ticks >= 0)` with unsigned `ticks`” changes from the missing entry test to an
always-true comparison, followed by “The stepper below runs course-written assembly.” The
failure section has a prediction, stepper and loop-runs figure for one do-loop input; the
generalisation adds GCC's listing plus another stepper and loop-runs figure for one wrong
comparison input. See [`counting-down.ts`](../../../content/lessons/counting-down.ts),
`failureExperiment` and `generalisation`, and
[`counting-down.prose.ts`](../../../content/lessons/counting-down.prose.ts), `generalisation` and
`wrongComparison`.

These errors are not equivalent: one makes a finite run unexpectedly long, while the other
never reaches its exit. Keep that distinction and the trace-limit qualification. The smaller
pacing issue is showing two full representations of each single-input failure before asking
for useful early stopping. Unlike the three selectable working runs, these single-case bars
add little choice. This was the tallest unlocked phone page in this sample, but the finding is
about duplicated presentation, not that ranking.

**Smallest correction:** prefer one main trace per failure; make its companion single-run bar
secondary or omit it if the trace already carries the count/brightness evidence. Keep the C
standard note optional and local to the compiler listing. Retain the two existing Module 5
pages: subtraction flags, the missing-first-test error and useful early stopping form a
connected countdown investigation. Splitting every error would weaken that comparison.

## Module dispositions and content to retain

| Module | Disposition | Retain / trim direction |
| --- | --- | --- |
| 5 Loops | **No page restructuring required.** | Retain `counting-up` as one complete route from first test to repeated branch, mutation and fresh-run counting. Its counting exercise reuses one mechanism rather than introducing a new topic. Retain `counting-down`'s contrast between finite wraparound and an always-true condition; reduce repeated failure views as above. |
| 6 Loads, stores and widths | **Retain first page; shorten the second page's direct route.** | `memory-and-addresses` introduces several terms, but address, brackets, byte order and destination width all explain one transfer. Its load/store, neighbouring-byte failure and copy task are connected. Keep the computed byte diagrams, source-address overwrite warning and memory-validity limits. Reposition register-only extension in `loading-widths`; preserve the mixed-record capstone intact. |
| 7 Arrays, strings and pointers | **Split array selection from traversal; retain the strings page.** | Move rather than repeat the addressing comparison. Keep `zero-terminated-strings`' bounded/unbounded distinction, zero capacity, empty string, terminator-order mutation and marker task together: they all exercise the same stopping-rule question. ASCII `0` versus zero and byte count versus character count are short necessary limits, not removable tangents. |
| 8 Multiply and divide | **Reorder extensions before adding more mandatory pages.** | Consolidate widening before 128-bit halves; put constant division after the consumption task. Preserve the signed-versus-unsigned examples and C/architecture qualifications. Consider a separate fuel-consumption application only as the second step, keeping its complete contract and exercise together. |

Module 0 provides frequent completion and navigation points after a mechanism and fresh-input
practice. That is the transferable benefit. It does not imply that the eight pages here should
share its section count, pixel height or instruction count. The selective changes above create
stopping points at different learner goals while retaining the traces and experiments whose
comparisons do useful work.
