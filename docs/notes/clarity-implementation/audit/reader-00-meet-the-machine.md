# Independent learner review: 00 Meet the machine

Reviewed the current built lesson at http://localhost:4290/assembly-lab/#/lesson/meet-the-machine. Read CLAUDE.md, docs/style.md, docs/authoring.md and the front-page Before you start prerequisite, then the complete lesson prose, labels, questions, options, feedback, hints and model notes. Did not consult earlier review notes. Read relevant shared prediction, listing, stepper and Module 0 strings. No repository edits.

## Coverage

Fresh Playwright browser contexts at 375 × 900 and 1280 × 900, both light and dark. Inspected initial lesson, both prediction commitments, first-step prediction failure feedback, complete four-instruction investigation, register bits toggle, initial subtraction challenge failure feedback, all five hints for both challenges, compiler details and reflection disclosure. Opened the challenge's Stepped note via its actual control at all four configurations. Reviewed screenshots of phone light completed stepper, phone dark bits, desktop light failed challenge, desktop dark completed stepper, and phone light expanded challenge note. Full-page captures and text dumps exist for all four configurations. Did not exhaustively exercise every wrong prediction option or edit and solve challenges; these strings were read in source. Did not verify persistence or offline transitions.

## Candidate findings

### 1. Low: stepping guidance is still attached to a challenge that asks for a manual trace

- Quote: “STEPPED”; expanded note: “Each step runs one instruction in the simulator. Between steps, the simulated processor stays as the last instruction left it.” Immediately below: “Without running the call …, give two values.”
- Source: content/lessons/meet-the-machine.ts:219 sets `timeModel: STEPS` for `trace-km`; packages/views/src/strings.ts:10–14 supplies the note and badge; content/lessons/meet-the-machine.prose.ts:104 supplies the task.
- Setup: Open the Stepped control above “Trace the call”, before answering. Reproduced at both widths in both themes.
- Learner effect: The explanation appears to describe how to operate this card, but it contains no stepping controls and asks the learner to work without running the call. This is the same guidance-placement problem now resolved for prediction cards, at a different interaction role.
- Direction: Give this card guidance appropriate to a manual-trace challenge, and keep simulator stepping instructions attached to actual steppers. Its simulator-backed grading need not determine the visible activity label.
- Evidence: /tmp/reader00-trace-note-375-light.png and /tmp/reader00-trace-note-1280-dark.png.

### 2. Low: the prose describes a register interaction the figure does not provide

- Quote: “You can open a register to see its 32 bits.”
- Source: content/lessons/meet-the-machine.prose.ts:52. Actual control text is “Show the bits” in packages/views/src/strings.module0.ts:53.
- Setup: Investigation stepper unlocked. Registers are cards; one shared “Show the bits” control changes all four displays together. Reproduced at both widths in both themes.
- Learner effect: “Open a register” suggests tapping one register card. The useful action is a separate shared button. This is a minor control-to-prose mismatch, not a problem with the bits explanation.
- Direction: Describe the actual visible control and that it switches the register display, rather than implying each register opens individually.
- Evidence: /tmp/reader00-bits-375-dark.png, /tmp/reader00-step-375-light.png.

## Unsupported assumed knowledge

None found that prevents the intended tasks. The prerequisite explicitly requires binary/decimal conversion and basic C functions. The lesson defines instruction, assembly language, listing, register, program counter, operands and memory where used; explains argument placement; explains the colon after a function label and the `#` constant syntax; and defines GCC/Compiler Explorer and each compiler option in its optional note. The first prediction precedes the operand-order explanation, but is explicitly a prediction followed by feedback and investigation, so I did not treat that sequence as an unexplained prerequisite.

## Recent fixes that work

The first prediction now states “After the first instruction runs”, distinguishing the execution moment. Its explanation separates the previous register value from the new result and later updates. Prediction cards no longer display the stepping disclosure. C statements are visibly paired with their related instructions, and the lesson explains the optional raw GCC references. No new ambiguous question timing or value-versus-location problem was found in this lesson.
