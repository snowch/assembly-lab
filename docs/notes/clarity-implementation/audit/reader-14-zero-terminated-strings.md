# Reader 14: Strings and the zero byte

Read-only independent learner review. No prior review notes read. Target: lesson index 14, `zero-terminated-strings`. Read the complete target prose, labels, lesson setup (including both option sets, feedback, tasks, every hint and model note), recorded programs, shared memory prediction/stepper strings and components. Read CLAUDE.md, docs/style.md and docs/authoring.md; checked the front-page prerequisites and preceding-course definitions. The combined earlier-lesson dump was truncated, so prerequisite coverage was supplemented by targeted complete reads of memory, loading-widths, array-addresses and counting-down material; this is not an exhaustive reread of all earlier lessons.

Browser: actual served site at http://localhost:4290/assembly-lab/#/lesson/zero-terminated-strings. Fresh pages at 375 and 1280 CSS pixels, light and dark, height900. In all four configurations expanded the prediction badge, made a prediction, unlocked the steppers, ran three instructions of the moving-pointer example and opened the first construction hint. Inspected page text and representative screenshots; no exhaustive challenge solutions or all trace states. Document width matched viewport in all four. Screenshots: `/tmp/reader14-{375,1280}-{light,dark}-{prediction,step}.png`.

## Finding 1 — medium: prediction still presents stepping instructions above the question

- Exact visible text: `STEPPED`, then on expansion `Each step runs one instruction in the simulator. Between steps, the simulated processor stays as the last instruction left it.`, immediately above `What length does label_length return in x0?`.
- Source: `content/lessons/zero-terminated-strings.ts:23-25` creates both prediction figures with `kind: "memory-prediction"` and `timeModel: "steps"`, without a prediction role. Shared note: `packages/views/src/strings.ts:10-12`.
- State/setup: fresh lesson, before choosing/checking a prediction; open the first prediction figure's STEPPED disclosure. Reproduced at both widths and themes. The failure prediction uses the same helper.
- Learner effect: this is a multiple-choice prediction card with no step controls. The note describes an interaction that belongs to the following stepper, interrupts the immediate question and makes the badge look like an action or completion state. It repeats precisely the role/placement confusion the recent Module0 correction was intended to remove.
- Direction: apply the established prediction-role treatment to these prediction figures; keep the stepping explanation with the interactive that actually has Next/Back controls. Audit other prediction kinds for the same omitted role.

## Other checked lenses

The prediction explicitly asks what the function **returns**, so its observation moment is clear. Input address versus output count are separated in the task and first hint. Post-index prose explicitly says the read happens before the pointer advances. The memory snapshot after the first moving-pointer load shows the old address read and the advanced pointer, consistent with the prose. The complete C and paired excerpts are available. Multiple-source-association explanatory text is present. No additional substantive target-specific finding is forced.

## Assumed knowledge

No wholly unsupported prerequisite identified in the reviewed text. The front page includes array indexing and while loops. `memory-and-addresses.prose.ts:7-8` defines byte, address, pointer, dereference and const; its motivation defines bracketed memory access. `loading-widths.prose.ts:12` explains ldrb/zero extension. `array-addresses.prose.ts:18` explains post-index access before pointer advance; its motivation explains byte offsets/scaling. Module0 defines registers and operands; Module1 defines hexadecimal. ASCII, string and terminator are defined in this lesson's opening. `break` and capacity are defined in this lesson's optional “The C loop and its boundary” note; placement is less immediate than body text but there is an explicit definition before the listing, so I do not assert an absent-knowledge finding.
