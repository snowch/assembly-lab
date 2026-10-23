# Reader 10: Counting down, and knowing when to stop

Copyright © 2026 Christopher Snow

Module 5, second lesson; course position 10 (zero-based). Reviewed the shared build at commit f1fdf35. Scope: learning load, not a technical certification.

## Prerequisites and genuinely new work

Read the registry/data through this lesson in `/tmp/course-load-review/lessons.json`, plus this lesson's ten sections, labels, recorded programs, LoopPrediction, LoopFigure and StepperFigure implementations. Earlier teaching provides unsigned 32-bit wrap, `subs` and its flags, `lsr`, `cmp`, signed/unsigned branch conditions, labels and backward branches, `cbz`, and the editor/test/hint interaction. Immediately preceding Counting up supplies this same dimming setting, `brightness >>= 1`, iterations versus instructions, the initial test, body history and loop construction. The current lesson is consequently not introducing subtraction, shifting, branching and looping simultaneously.

New mechanisms are using subtraction's own flags for the countdown, testing after the body with a `do` loop, distinguishing a finite wrapped countdown from an always-true unsigned condition, and stopping when more work cannot alter the result. The initial C `while` and `ticks--` receive local explanations. The compiler setting is already explained in Module 0. No confirmed unexplained prerequisite blocking the main path was found. The optional C-standard note adds constant expressions and observable operations, explains them locally, and is not required for either exercise.

## Assessment

No confirmed high or medium learning-load finding. The first question, “Where does the branch get its flags?”, connects two previously practised mechanisms. “Subtracting already tells the processor whether the result is zero” supplies the needed bridge before the prediction. The first prediction asks for body repetitions in a familiar dimming loop; it does not require the learner to discover wrap, `do` semantics and optimisation together. A directly related countdown construction follows before those later complications.

The failure sequence introduces one concrete change, “GCC's dim_do listing has no initial cbz”, and gives an explicit trace budget before asking about termination within that trace. Its explanation separates the simulator's stopping point from program termination. The subsequent always-true condition is a second comparison case after that explanation, rather than another unexplained mechanism in the first task.

The final exercise, “stop as soon as either the count or the brightness is zero”, combines established zero tests, a known shift, and the now-practised countdown. The local explanation of why repeated shifts eventually remove all bits supports the new early-stop objective. This is appropriate synthesis. Neither the number of test cases nor asking for a prediction before stepping is evidence of overload.

## Interface evidence and optional directions

At 375px the ordinary countdown stepper occupies about 812px vertically once unlocked. Its paired listing scroll area has 302px available for 588px of content; initially the C is visible and assembly lies to the right. The page itself remains 375px wide. See `counting-down-375-light-step.png`; desktop uses the same information with more room. The status beside the controls repeats the executed and next instruction, which materially reduces the need to shuttle sideways to operate the stepper. Only two relevant registers are shown, with flags and an instruction count. There is no second write-register quiz or open read/write explanation competing with this task.

Design recommendation, not a confirmed defect: if a future shared compact register treatment is introduced, trial decimal-first state with optional bits for the ordinary positive countdown. Here the important relation is remaining count → Z → branch, whereas all 32 bit cells remain visible. Preserve the accessible bit view for the zero-count wrap investigation, where the representation helps. Current evidence does not establish that the bit cells substantially obstruct a reasonable attempt, so this is not ranked as a fix.

Design recommendation, not a prerequisite gap: retain the clear distinction between “GCC's recorded output” and “course-written loop”. The generalisation moves between a tiny compiler listing, a different assembly stepper and its history. Their distinct roles justify them, but this is the point to test with learners if later evidence shows source switching. No evidence here warrants removing the compiler comparison or creating another lesson.

## Treatments worth keeping

- Keep the same dimming problem across Counting up and Counting down: it makes the changed stopping mechanism the object of attention.
- Keep “Check your prediction above first” gates on both steppers and run histories. Initial-state inspection confirmed that outcome figures remain locked before committing; ordinary earlier prose teaches the rule without presenting the concrete prediction outcome.
- Keep the separation of initial zero-count protection, subtraction flags and the later early exit. Construction gives practice before the harder failure comparison.
- Keep the explicit warning “A trace that reaches its instruction limit, by itself, would not prove that.” The finite versus infinite distinction has a substantive purpose rather than being gratuitous novelty.
- Keep the summary history for small selectable runs: it carries brightness over iterations instead of requiring mental bookkeeping across the instruction trace.

## Browser coverage and limits

Used a fresh context for each 375/1280px × light/dark combination. System preference selected the theme; screenshots show the actual rendered palettes, and a separate computed-style check confirmed light background `rgb(243, 246, 245)` and dark background `rgb(16, 22, 21)` at phone width. Desktop screenshots likewise show their respective palettes. Initial full-page screenshots cover all ten sections and locked gates. In each combination committed both predictions, stepped the ordinary countdown five instructions, selected the last investigation run, stepped the zero-count `do` trace five instructions, stepped the course-written wrong loop four instructions, ran both unchanged starting exercises and opened their first hints, and opened normal details. A further fresh-context check exercised ordinary Next then Reset. No challenge solution was entered or reproduced here.

Artifacts: `/tmp/course-load-review/counting-down-browser.cjs`, `counting-down-browser.log`, `counting-down-measure.cjs`, `counting-down-measure.log`, and `counting-down-{375,1280}-{light,dark}-{initial,step,runs,do,wrong}.png`. Inspected representative phone light countdown and dark wrong-loop screenshots directly. Source-only: complete traces beyond these selected steps, successful exercise feedback, later hints/reference solutions, and all possible editor operations. No external compiler calls, rebuild, or production edits. Observations establish presentation and sequence, not measured learner performance; no overload claim is inferred from page length or representation count alone.
