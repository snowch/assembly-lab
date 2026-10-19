# Independent reader/checker: 00 Meet the machine

Reviewed the current built lesson at `http://localhost:4291/assembly-lab/#/lesson/meet-the-machine` on 18 October 2026. No lesson, application or test files edited. I did not author these changes or read author self-justification. I first read CLAUDE.md, docs/style.md, docs/authoring.md, the front-page prerequisite panel and this lesson's structure, prose, labels, hints and feedback; then reconciled the audit summary and coverage plan.

## Verdict

The accepted local fix holds. No new actionable clarity regression found in the requested scope.

- **N2 resolved.** `meet-the-machine.prose.ts`, investigation: “Press Show the bits to see all four registers as 32-bit patterns.” The built button is **Show the bits**, and pressing it reveals the four displayed registers' bits. **Hide the bits** restores decimal-only displays. Verified in all four configurations.
- **Prior L1 remains resolved.** Prediction asks “After the first instruction runs, where is the value of total kept?” Caption and surrounding setup name the same moment. After checking, the explanation separates the initial argument from the first result and later updates. The investigation stays locked until a prediction is checked; wrong predictions also unlock it as intended. No answer appears in the gated stepper.
- **Prior L3 pairing/theme correction remains effective in the observed states.** C and assembly are stacked as related groups on the phone and aligned side by side on desktop. The first executed instruction and corresponding C statement have visible highlights in light and dark; the next-instruction arrow is distinct. No page horizontal overflow in any tested configuration.
- **Prior L4 and shared S1 hold here.** Both predictions are labelled Prediction; both manual challenges are labelled Exercise. The actual instruction steppers retain Stepped. Its expanded note says “Each step runs one instruction in the simulator. Between steps, the simulated processor stays as the last instruction left it.” It does not introduce flags before teaching them.
- **Shared S2 holds locally.** Caption says an outlined register “was written by the last instruction”; executed state says “Written: w0” and “Not written: w1, w2, w3.” This describes writes accurately. This lesson's tested step changes its value; an unchanged-value write requires the separate shared-component probe and is not claimed here.
- The untouched subtraction starter still yields feedback describing reversed subtraction, without asserting that a branch or some other absent operation ran. Hint wording was read in source; the five contents match their heading functions for this lesson.

## Assumed untaught knowledge

No material unexplained prerequisite found within this changed lesson. The front page supplies small C functions, integer arguments/returns and binary/decimal conversion. Instruction, assembly language, listing, register, operand, program counter and memory are introduced in the lesson before the relevant tasks. The optional GCC note explains its compiler service, optimisation setting and command options locally; command continuation is explained too. The numeral embedded in the closing assembly exercise is explicitly explained before its listing. No later lesson was used to excuse a prerequisite gap.

## Browser coverage and limits

Actual Chromium, 375×900 and 1280×900, light and dark. Theme storage was set to the plain string and the resulting HTML `data-theme` verified. In each configuration checked initial prediction and gated investigation, submitted a wrong prediction, opened bits, stepped the first instruction, inspected written/not-written display and pairing, went Back, hid bits, and ran the unchanged construction starter to obtain failure feedback. Inspected screenshots of the executed figure in all four configurations. Also opened the front-page prerequisite disclosure and the Stepped model note in the browser.

Read all lesson prose, labels, hints and feedback in source. Did not execute every prediction option, every hint rung, successful construction submission, complete no-ret experiment or closing manual trace, and did not run the full automated suite. Those are outside this targeted correction check; no claim of exhaustive browser interaction coverage.

Evidence: `reader00-browser.cjs`, `reader00-browser.json`, `reader00-prerequisites.txt`, and `reader00-{pred,step}-{375,1280}-{light,dark}.png` beside this report. Evidence JSON includes the rendered prediction/initial/after/back states and starter feedback; it is internal evidence, not a learner-facing answer guide.
