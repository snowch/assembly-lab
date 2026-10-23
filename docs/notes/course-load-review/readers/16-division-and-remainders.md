# Division and remainders: independent learning-load reader

- Assignment order: 16 (zero-based registry position; seventeenth lesson), Module 8, second lesson of that module.
- Snapshot: built commit f1fdf35, `http://localhost:4210/assembly-lab/#/lesson/division-and-remainders`.
- Verdict: no confirmed high or medium overload finding in this bounded review. The first attempt isolates signed division; the final exercise appropriately combines previously practised width, product and register skills with division. One optional sequencing recommendation follows; it is not a demonstrated blocker.

## Prerequisites and actual novelty

Read the ten sections, lesson data/prose/labels, recorded programs in `content/lessons/products.listings.ts`, `MemoryPrediction.tsx`, `MemoryStepper.tsx` and `ProductHalves.tsx` (including `DivisionParts`). Prerequisite comparison used only earlier entries in `/tmp/course-load-review/lessons.json`.

Earlier lessons establish signed/unsigned bit readings and hexadecimal, `w`/`x` register views and clearing on a `w` write, GCC settings, constant construction, shifts, branches, loops, and memory. Most importantly, the immediately preceding Products and their widths teaches `msub`, widened multiplication, full products and casts before multiplication. Thus remainder reconstruction does not introduce multiplication-subtraction and division together. The remainder word itself already appears in Constants and widths.

New here: dividend/divisor/quotient vocabulary; `sdiv` versus `udiv`; signed rounding towards zero and remainder sign; deriving remainder using a quotient in a temporary register; A64 exceptional division results versus C's undefined operations; recognising a recorded constant-division transformation. The final exercise additionally introduces an explicit incoming-value contract that leaves the upper half unspecified. It explains the required distinction locally: “Naming `w1` as the input does not mean an instruction has written it.”

No confirmed unexplained prerequisite gap. This is not a claim that every earlier interaction was replayed; prerequisite checking was from earlier lesson text/data.

## First task and attention demands

“Which hexadecimal quotient does it return?” requires applying the just-taught rounding rule and a familiar signed hexadecimal representation. The two-instruction example adds no unfamiliar control flow, memory or product width. Explaining the rule before asking for its application is appropriate teaching, not answer leakage. Committing an incorrect prediction reveals feedback and unlocks the walkthroughs, so progress does not require guessing the expected option.

“Recover the remainder” places a three-register stepper, grouping diagram and positive unsigned example in sequence. The figure count is not itself excessive: each has a distinct purpose, the program is short, and the familiar `msub` has a specific register-preservation role. At 375px the paired C/instructions listing scrolls inside its container, with the register summary and status below; at 1280px the two panes remain visible together. The arithmetic stepper omits unrelated memory and flags. This is substantially less competing state than a general-purpose machine dashboard.

## Confirmed findings

None at the brief's severity threshold. No claim is made that absence of findings proves absence of learner difficulty.

## Optional design recommendation, not confirmed overload

**Low priority: offer a focused rehearsal of the incoming upper-half contract before the final editor.** Exact evidence: “Before dividing with `x` registers, clear that upper half: a write to `w1`, even one that copies `w1` to itself, does this.” This is the first explicit distinction found in earlier-versus-current lesson text between an argument being specified through `w1` and an actual instruction writing `w1`. The final task also asks the learner to preserve a wide product, choose the division width, interpret units and handle zero distance. Those other mechanisms have been practised, and the new contract is clearly taught, so calling this high overload would overstate the evidence. A small optional inspect/compare of the incoming register halves would make that one new distinction concrete before synthesis; no new lesson or full solution is needed. Source evidence: final prose and the `write-consumption` test setup in `content/lessons/division-and-remainders.ts` deliberately exercise an unspecified upper half. Browser evidence: final challenge initial and default-attempt screenshots listed below.

## Treatments to keep

- The signed quotient attempt comes before the remainder reconstruction and is small enough to inspect directly.
- The later wrong-instruction experiment changes signedness while keeping the subtraction familiar, isolating the decision being tested.
- “Separate C rules from instruction results” explicitly labels assembly-only exceptions. These are demonstrations after the first construction task, not additional rules needed before the first attempt.
- Constant division uses familiar constant-building, widening and shifting. “The instruction sequence is this compiler's choice, not a timing claim” bounds the expectation. Do not demand derivation of the multiplier as an extra prerequisite; the page asks for inspection.
- “Written” and a nearby “Ran … Next …” status distinguish execution from value interpretation. The final exercise's width requirements are meaningful synthesis immediately after the product lesson.
- Default-code test runs and the first hint are explicit later actions; feedback does not fill the initial editor state with test matrices.

## Browser evidence and limits

Fresh Playwright contexts at 375×900 and 1280×900, light and dark system preferences. Actual root backgrounds verified as `#f3f6f5` and `#101615`, respectively; screenshots visually confirm rendered themes. Document width did not exceed viewport in the four initial contexts.

In all four contexts inspected initial page; committed first prediction with a nonmatching choice; stepped signed quotient once; stepped signed remainder through subtraction; stepped unsigned quotient once; inspected unlocked grouping diagram; committed wrong-instruction prediction with a nonmatching choice and stepped its quotient; stepped each exceptional division example once; stepped constant-division example once; opened normal disclosures; inspected both challenge editors; ran their provided default code and opened only the first hint; exercised Back and Reset on the remainder stepper (reset `data-k=0`). All ten sections were read. No external compiler requests, app edits or rebuilds.

Artifacts: `/tmp/course-load-review/division-and-remainders-browser.cjs`, `division-and-remainders-browser.log`, `division-and-remainders-post.cjs`, `division-and-remainders-post.log`; screenshots use `division-and-remainders-{375|1280}-{light|dark}-` with `initial`, `step-signed-remainder`, `diagram`, `challenge`, and `write-consumption-attempt` among their suffixes. Phone screenshot inspection confirmed contained listing scroll and readable register cards; desktop screenshot inspection confirmed paired source/instruction visibility. Screenshots of default test feedback contain computed results and are evidence artifacts, not reproduced as challenge answers here.

Limits: did not solve either construction exercise, progress through later hints, test custom code, finish every demonstration, reload saved work, or test keyboard/screen-reader operation. Constant sequence after its first instruction and the second instruction of each exceptional example were source-reviewed rather than executed in this pass. No timing or accuracy claims beyond the review's learning-load scope.
