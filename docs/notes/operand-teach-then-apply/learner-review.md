# Operand rule: independent learner review

Copyright © 2026 Christopher Snow

Reviewed the written brief, separately drafted investigation text and actual built first
stepper in Meet the machine. This review follows the user's newer teach-then-apply request,
which supersedes the earlier first-step question and optional-only operand diagram.
No app source was edited.

Used the current `index-BgRLQVGz.js` production build through a separate preview on port
4187. Fresh Chromium contexts covered 375 × 900 and 1280 × 900 in light and dark themes;
each actual rendered `data-theme` was confirmed. The focused probe's results are in
`/tmp/operand-apply-review.json`; screenshots are `/tmp/operand-apply-<width>-<theme>-*.png`.
This reviewer ran no full suite and does not claim physical-device coverage.

## Interaction and understanding

All four width/theme combinations passed these checks:

- The preceding prediction still gates the stepper. Its initial state has no register
  choice, diagram or destination-rule explanation. It names the next instruction and
  permits the first worked execution with Next.
- After that first execution, the short computed result and Written register card appear.
  The operand convention and Read → Add → Write diagram appear automatically, outside
  optional details. No disclosure must be opened to learn the rule.
- The worked diagram explains the instruction that just ran. The question after it names
  the *different next instruction*, the second addition. Document order places teaching
  and diagram first, then the question, then the compact navigation controls.
- An incorrect choice for the second addition produces concise negative feedback and
  that executed instruction's computed result. The next question names the subtraction.
  A correct choice for that subtraction produces positive feedback and its result.
  The earlier diagram is absent from these later states, keeping application steps brief.
- There is no destination question before `ret` or after return. Before `ret`, the next-
  instruction text names it. After return, Next is disabled, the status accurately says
  the function returned, and no displayed register is marked Written by `ret`.
- Back restores the appropriate worked/apply state without an old verdict. Back to the
  first execution restores its automatic diagram and next-addition question. Back to
  zero and Reset hide both diagram and choices, restoring the initial worked-step entry.
- Optional detailed reads/writes still open with Enter and retain summary focus. They close
  on movement. Opening them is independent of the automatic first-step diagram. Show the
  bits still switches the same register group after reset.

The changed prose introduces operands without teaching the first-operand destination order
before execution. It then directs the learner to run the first instruction, learn from its
result/diagram, and apply the rule to remaining arithmetic. No missing prerequisite or
confusing new term was found that prevents following that sequence. The first result is a
worked example, not an unanswered question that the new diagram accidentally reveals.

## Immediate first-action behaviour

Inspected real phone Next taps *before* manually scrolling to the new diagram. In both
phone themes, document scroll remained unchanged at 5432 px and the active element remained
Next. The new operand-rule paragraph was visible at viewport y = 639–723; the automatic
diagram began at y = 739. Its lower Write node continues below the 900 px viewport, so a
normal downward scroll is needed to read the complete diagram and following question.
The visible rule and upper diagram make the new explanation discoverable. There is no
forced page jump, lost focus or concealed-disclosure requirement.

The first state is necessarily taller than later application steps because it teaches the
operand convention. The controls follow the teaching and question; the user encounters the
worked explanation while moving down to the next action. Later states remove that diagram
and keep the short result, register cards, optional details, question and controls together.
This matches the latest requested progression rather than retaining the superseded design.

## Actual visual inspection

Visually inspected phone-light and phone-dark immediate-first-action screenshots,
phone-light full first state, phone-dark later and return states, desktop-light first
state and desktop-dark later state. The rule, arrows, Write marker and question remain
readable in both themes. The diagram is clearly an explanation of the completed first
instruction, while the lower question names the instruction to run next. The paired
listing retains separate executed and next-instruction treatments.

No horizontal page overflow occurred in any reviewed state: scroll/client widths were
375/375 and 1280/1280. The Next target measures 64 × 44 px. No page errors were observed.
No learner or visual blocker was found. Broader default-stepper and missing-ret behaviour
was outside this focused built-page review and belongs to the separate automated checks.
