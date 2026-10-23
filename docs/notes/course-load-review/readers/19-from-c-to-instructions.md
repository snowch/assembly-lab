# Reader 19: From C to instructions

Module 10, course order 19 (zero based). Reviewed snapshot f1fdf35, built preview at `/assembly-lab/#/lesson/from-c-to-instructions`.

## Prerequisites and novelty

The learner has completed Modules 0–9, including unsigned wrapping, constants and widths, multiplication, comparisons, branches/loops, memory, calls and recursive frames. Entry-level C and reading paired C/assembly are already required. The earlier material is sufficient for the arithmetic and both construction tasks; the final cap combines familiar multiplication, unsigned comparison and control flow. No later compiler or optimisation lesson is assumed.

New mechanisms are the small browser compiler's fixed mapping of named variables and temporary expression values to registers, editing and recompiling C, and the separate C evaluator/A64 result check. The register assignments are explained before the first prediction. `movz` is explicitly explained and related to earlier constant construction. GCC versus the small compiler is qualified locally. I found no confirmed missing prerequisite that blocks an attempt.

The first actual attempt, “What does `trip_charge(6, 4)` return?”, asks for familiar arithmetic rather than requiring the learner to infer register allocation first. That is a reasonable entry into the new translation mechanism. Prediction-first alone is not evidence of overload here.

## Confirmed findings

### Low: opening the optional statement editor initially teaches its own recovery operation

Evidence: in the investigation, press “Build C from statements” from a fresh unlocked playground. The first source line is the copyright comment, selected by default. The editor says “This line cannot be loaded into the statement controls. Use Edit C text, or choose a statement type to build a replacement.” Below it are “Replacement statement”, “Variable to assign”, “Left value”, “Right value”, “Operation”, the numeric keypad and line-management controls. Source: `packages/views/src/CEditor.tsx`, initial `selected = 0`, `parseCStatement`, and template-mode controls. Reproduced at 375px dark; captured in `from-c-to-instructions-375-dark-template.png`.

The learner following “Try changing the fixed charge” now has to select an editable source line, understand replacement versus insertion, and filter unrelated fields before making the small expression change. This is optional interface-learning friction, not excessive ISA novelty or a blocked text-editor attempt. Smallest direction: enter statement mode with a representable executable source line selected, or require line selection before presenting the full replacement controls. Keep text mode available and do not split this lesson solely for this issue.

## Design recommendations, not confirmed overload

The post-run register bank labels `w0`, `w1`, `w2`, `w8`, `w9`, while the variable/temporary roles are explained earlier in “Assign registers and build expressions”. A small local role cue, valid for the current program and moment, could reduce recall when tracing the product into the local variable. This must distinguish a parameter's original value from reuse of `w0` for the return. I do not classify the five registers or nine-instruction listing themselves as overload: these are already familiar operations, and the generated moves are the subject of the lesson.

At phone width the paired listing intentionally scrolls horizontally as one piece. The current-instruction card repeats the relevant C line beside “Next”, “Back” and “Reset”, which substantially reduces the need to revisit that wide listing. Preserve that card. The editable source plus compiled C listing is some duplication, but serves two different states and does not justify removing the checked pairing.

## Treatments worth keeping

- A single small trip-charge calculation remains stable across listing, prediction, local compilation and direct assembly construction. This keeps new compiler behaviour separate from learning new arithmetic.
- The first playground remains locked until a prediction is committed; wrong choices still permit investigation. Feedback and generated execution follow the attempt.
- The failure experiment removes one source operation rather than introducing another algorithm. Its prediction and playground have an independent gate.
- Optional compiler-subset and GCC panels keep limitations and network comparison out of the main execution path. Local compilation works without the external service.
- The final task explicitly says the cap applies after unsigned wrapping. This is appropriate synthesis of earlier arithmetic rules, rather than several new mechanisms arriving together.
- The instruction just run and the next instruction are separately identified; register destinations say “Written”. Actual light and dark themes retain readable state distinctions.

## Coverage and limits

Read all ten sections, both challenge task descriptions, relevant source programs/data and `CompilerPlayground.tsx`, `CEditor.tsx`, compiler strings. Read repository review guidance and course-load brief. Used only earlier lessons from the parsed registry as prerequisites; did not use historical reader verdicts.

Fresh Playwright contexts at 375×900 and 1280×900, each light and dark. Actual body backgrounds were `rgb(243, 246, 245)` and `rgb(16, 22, 21)` respectively; no page-level horizontal overflow. In each matrix cell inspected initial state, committed both predictions using the first available choice, ran the first local playground and stepped once, and opened normal details. Additional 375px dark inspection ran four instructions and opened statement mode. Full-page initial/stepped/details screenshots and logs are under `/tmp/course-load-review/from-c-to-instructions-*`; focused figure/template captures show the representative mobile state.

Browser inspection included the second prediction's unlocked playground and the challenge interfaces but did not run the second playground, submit construction solutions, exhaust editor permutations, or exercise all hints/tests. Did not invoke GCC/Compiler Explorer, edit app files, rebuild, or make external compiler calls. No challenge answers are included in this note. No high or medium overload finding established in this bounded review.
