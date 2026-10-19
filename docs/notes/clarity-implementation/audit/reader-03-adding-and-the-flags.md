# Independent learner review: 03 Adding, and the four flags

Reviewed read-only on 2026-10-18. No previous review notes read. Read CLAUDE.md, docs/style.md, docs/authoring.md, front-page Before you start, and the prose/labels of all three earlier lessons in content/lessons/index.ts. Read all target prose, labels, options, hints, model note and relevant shared renderer/feedback strings.

Actual preview: http://localhost:4290/assembly-lab/#/lesson/adding-and-the-flags. Chromium at 375 and 1280 CSS pixels, light and dark system preference, fresh browser contexts. At each combination: committed both predictions; advanced adder one column and group, used Back and Show all; submitted incorrect flags, revealed all hints, passed challenge to inspect unlocked adder; ran failure stepper Next/Back/Reset; submitted incorrect overflow attempt and revealed all hints; opened disclosures. No horizontal page overflow. Screenshots inspected for phone adder, expanded one-column note and desktop completed prediction; remaining four-theme figure screenshots captured. This was a clarity review, not exhaustive interaction/accessibility testing.

## Candidate 1 — Medium: column exploration claims to execute instructions

Exact quote on the Investigation adder's expanded Stepped badge: “Each step runs one instruction in the simulator. Between steps, the simulated processor stays as the last instruction left it.” (packages/views/src/strings.ts:11; attached by content/lessons/adding-and-the-flags.ts:95, also :116).

The immediate prose instead says “You can step through the figure one column at a time” (content/lessons/adding-and-the-flags.prose.ts:26). Reproduce: commit the first prediction, open the Investigation adder's Stepped badge, press Next column once. The display shows Column 0 and one result bit; the flags remain dashes. The same instruction's other columns remain unfinished. This control demonstrably reveals arithmetic inside a single addition, rather than executing another instruction.

Learner effect: the repeated generic guidance gives two different meanings to a step and can suggest one addition takes 32 architectural instructions, or that these partial bits are intermediate register states. The final model note correctly distinguishes arithmetic drawing from circuitry, but arrives much later.

Direction: give this figure guidance appropriate to exploring one instruction's arithmetic, and distinguish its column reveal from the instruction stepper. Apply to both adders. Do not count the remaining generic prediction badges as a separate finding here.

Evidence: /tmp/course-clarity-audit/reader03-one-column-note-375.png and reader03-one-column-note-1280.png; text reader03-one-column-375.txt. This is also confirmed by AdderFigure.tsx using its local `done` column index.

## Candidate 2 — Low: completed prediction leaves its displayed registers without a visible time label

Exact feedback begins “The simulator ran the addition.” (packages/views/src/strings.arith.ts:114). After Check your prediction, the same figure still displays its initial `w0` and `w1` values. The source identifies them as “Registers before the run” (strings.arith.ts:111), but this is only the aria-label at packages/views/src/interactives/RunPrediction.tsx:125; it is not visible. The rendered rows always use `data.call.args` (:130).

State: first prediction after committing any choice; also applies to the second run-prediction. The surrounding prose clearly supplies the addition inputs, so this is a small display clarification, not a missing prerequisite or an incorrect result. Nevertheless, after the figure says it ran, the visually unqualified register display continues to look like the resulting machine state. On phones the register rows and outcome are separated by the choices.

Direction: visibly distinguish these retained inputs as before-run values, or show before/after states after commitment. Keep the initial prediction gate.

Evidence: /tmp/course-clarity-audit/reader03-prediction-complete-1280.png and reader03-prediction-complete-375.png. Underlying values are correct; no model change suggested.

## Unsupported assumed knowledge

No additional substantive unsupported prerequisite found. Prior lessons teach registers/operands/return, hexadecimal, signed versus unsigned readings, top bit and set/clear, w/x naming, constants and compiler -O1. This lesson defines flag in Motivation; defines adder, the carry mechanism, and each flag before the flag exercise; defines signed overflow before its closing challenge. The optional GCC detail explains the builtin's purpose and explicitly defers the displayed cmn/cset syntax; neither is needed to solve this lesson's tasks. QEMU and architecture are explained in the model note. Front-page binary conversion plus this lesson's column rule supports the arithmetic.

No new C/source association issue observed: principal figures are intentionally assembly-only; the optional GCC snippet has no adjacent C requiring paired statements. No claim that all current-state ambiguity is resolved by correct arithmetic.
