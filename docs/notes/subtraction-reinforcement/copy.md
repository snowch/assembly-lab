# Subtraction reinforcement: checked facts and draft

## Brief

- Objective: recognise the inversion-and-addition calculation within the returned subtraction bits before comparing the two C readings.
- Prior knowledge: `content/lessons/four-bit-arithmetic.prose.ts` teaches inverting the second input, adding one to construct its opposite, then adding that pattern to the first input. It also teaches keeping the available result bits. This reminder extends that preparation to the model's register width; it does not introduce another exercise.
- Model evidence: `packages/machine/src/run.ts`, `addWithCarry`, records `width`, the first input `a`, the inverted second input `b`, `carryIn`, and the retained `result`. `packages/machine/src/arith.test.ts` pins the subtraction trace as addition with an inverted second input and an incoming one.
- Checked example supplied by the managing session: for the independent calls with first input 3 and second input 5, the original second-input pattern is `00000000000000000000000000000101`; its inversion is `11111111111111111111111111111010`; adding one gives `11111111111111111111111111111011`; adding the first input gives `11111111111111111111111111111110`, or `0xfffffffe`.
- All displayed numbers, including the width, bit positions and added one, are supplied dynamically. No example values enter the new learner strings.
- Placement: visible after Call both functions, before the typed result cards. Reset removes this reminder with the call results. The existing prediction gate stays intact.
- Calculation: show the second input, inverted bits and the opposite constructed by addition. Then align the first input, opposite and result vertically. The engineer chooses the layout.
- Scope: this breaks down a single `sub` instruction. It does not execute separate inversion or addition instructions. No new stepping controls, carry diagram or claims about flags belong here.
- Link: `LessonLink` to `#/lesson/four-bit-arithmetic`, using its current title, “Arithmetic with four bits”. Lesson numbering is automatic.
- Style: follow `docs/style.md`: short direct statements, familiar terms already taught, local width qualification, a visible computed example, and no hard-coded numerical displays.

## Draft

The new nested `CALL_COMPARISON_STRINGS.subtraction` group provides:

- Heading: “Subtraction in bits”.
- Calculation note: “These rows break down a single `sub` instruction with {width} places. Keep the lowest {width} bits after each addition.”
- Row labels: “Second input: {value}”, “Invert every bit”, “Add {value}”, “Opposite pattern”, “First input: {value}” and “Result”. The input labels receive the original decimal operands dynamically.
- Bit-order note: “Bits run from {highBit} on the left to {lowBit} on the right.”
- Link lead: “For the smaller example, revisit”.
- Link title: “Arithmetic with four bits”.

The wording reuses “opposite pattern” from the prerequisite. The calculation note keeps the single-instruction qualification beside the diagram. The bit-order note uses dynamically supplied positions. The link points to the smaller worked example without requiring it to understand the visible reminder.

## Process and checks

- Separate copy agent drafted from the managing session's checked-fact brief. No model override was requested.
- Read `AGENTS.md`, `CLAUDE.md`, `docs/style.md`, `docs/authoring.md`, the prerequisite lesson prose and strings, and the subtraction trace implementation and test.
- Edited the new strings for sentence clarity, prerequisite vocabulary and numerical provenance. Read them in the call-comparison strings' context. Canonical UI-source text in `docs/notes/course-pacing-implementation/copy.md` is synchronised.
- Follow-up polish gives each input its local decimal value, names the inversion action, and marks `sub` as code for the `Prose` renderer. The retained-width qualification remains beside the calculation.
- Layout, browser checks and independent learner/technical review remain with the implementation workflow. This note does not claim beginner observation.
