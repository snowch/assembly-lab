# Independent learner review: lesson 10, counting-down

Reviewed current repository and built page at http://localhost:4290/assembly-lab/#/lesson/counting-down. Read CLAUDE.md, docs/style.md and docs/authoring.md, front-page prerequisites, earlier lessons in index order, and all target prose, labels, options, feedback, model notes and both hint ladders. No earlier review notes read. Review is observational; no repository changes.

## Finding 1 — Low: both predictions still offer stepping guidance before the question

Quote: “STEPPED” / “Each step runs one instruction in the simulator. Between steps, the simulated processor stays as the last instruction left it.”

Sources: content/lessons/counting-down.ts:75–78 and :156–159 (loop-prediction entries supply timeModel but no prediction role); packages/views/src/strings.ts:10–13 (shared words).

Setup/state: fresh learner, before checking either prediction. Open the badge above “Predict how many dimming operations dim_down(128, 3) runs.” The note appears before the listing and question, although this figure offers a choice and Check your prediction, not Next. The failure prediction has the same structure. Confirmed browser and source; screenshot /tmp/course-clarity-audit/10-badge-375-light.png.

Learner effect: the badge explains an action unavailable in this figure and gives the prediction the same role as the stepper that follows. This is the same guidance-location issue as the recent introductory lesson improvement.

Direction: assign these two figures the prediction role, keeping stepping help on actual steppers. No new wording or challenge solution needed.

## Considered but not raised

The final task says “within the simulator's instruction limit” without stating a number, whereas the failure trace explicitly uses 20 instructions. The failure prose clearly limits that number to “this trace”; the task's explicit stopping conditions supply an actionable requirement. This does not justify a second substantive finding by itself.

The countdown prediction already identifies both its call and endpoint (“before the function returns”). The failure prediction identifies the call and the 20-instruction trace. No missing execution point equivalent to the former total question found.

## Unsupported assumed knowledge

None that blocks the target lesson's mechanism or exercises. Definition evidence:

- Registers, operands and ordered argument registers: meet-the-machine, Prediction/Investigation/Explanation.
- Widths, hexadecimal and unsigned range: one-pattern-three-readings and constants-and-widths.
- Subtraction flags and wrapping: subtracting-and-the-tick-counter, Investigation/Explanation/Generalisation.
- Logical shift and dropping a remainder: shifts, Investigation.
- Conditions including ne/cs: compare-and-choose, Explanation; branches introduces labels, branch spelling variants and cbz.
- Loop, body, iteration, and instruction count versus iteration count: counting-up, Motivation and Investigation.
- >>= is explicitly expanded in counting-up's opening; ticks-- is defined in this lesson's opening.
- do is beyond the front-page prerequisites but is explained before its listing in Failure experiment.
- GCC and -O1: meet-the-machine compiler details and Generalisation. This lesson explicitly refers back to Module 0.
- Optional standards note distinguishes the variable-based condition from a constant expression and explains observable operations through input/output. It does not require the reader to implement or classify other C expressions.

## Browser coverage

375×900 and 1280×900, light and dark selected through the Theme control. Initial full-page captures inspected for overall layout; targeted screenshots inspected in all four configurations. No horizontal page overflow in initial measurements. Read the built page before and after checking both predictions with deliberately incorrect choices, stepped the first example twice, ran the construction starting program, opened its first hint and opened the C-standard note in each configuration. Read remaining hints and feedback in source rather than solving every exercise. No claim of exhaustive challenge validation.

Paired C and assembly remain readable and the highlighted operation, controls, register values and flags are visible together in the sampled stepping state. Dark and light themes preserve the grouping.

Evidence: /tmp/course-clarity-audit/10-step-{375,1280}-{light,dark}.png; /tmp/course-clarity-audit/10-open-{375,1280}-{light,dark}.txt; full-page /tmp/course-clarity-audit/10-{375,1280}-{light,dark}.png. Generic hint headings and shared loop history strings were reviewed; the history explicitly distinguishes the initial value from values after each dimming operation.
