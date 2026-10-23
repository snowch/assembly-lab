# Masks and fields: independent learning-load review

Module 3, first lesson; course position 6 (zero-based order 5). Snapshot and scope follow `../brief.md`. Reviewed all ten sections, lesson/challenge definitions, recorded programs, and the relevant warning-word, prediction/mask, bit-operations, field-reading, solution-stepper, BFI comparison, clear comparison and word-stepper views. No production changes or compiler requests.

## Starting knowledge and actual novelty

Entry requirements (`apps/course/src/strings.ts:33–48`) supply binary/decimal conversion and small C functions with `int`, `unsigned`, arguments and `return`. Earlier lessons supply register operands, return conventions, assembly editing/testing, hex, signed versus unsigned readings, set/clear terminology, 32/64-bit register views, constants, `movk` placement, carries/flags, wrap and subtraction. Those are legitimate reuse, not new burdens here. The first prediction asks about a negative-looking constant, an appropriate application of already taught signed bit readings.

New mechanisms are independent bitwise AND/OR/XOR, complement, their C notation, masks chosen to preserve selected bits, fields as multi-bit values, standalone `lsl`, C right shift, `ubfx` extraction, and composing a field replacement while retaining surrounding bits and restricting the source width. `bfi` arrives after success. Symbolic names are explained locally; `u` and `-O1` were taught earlier. I found no firm missing external prerequisite. The issue is how much new application precedes practice, rather than unexplained jargon or the number of instructions alone.

## Confirmed findings

### Medium: the first logic experiment comes after the field-reading detour

Evidence: the investigation says “The figure combines a word and a mask with the instruction you choose”, then introduces “A run of bits that together hold one number is called a **field**”, `lsl`, `ubfx`, C `>>`, and the reason the listing uses `x0`, before rendering that figure (`content/lessons/masks.prose.ts:37–49`; `masks.ts:103–137`). Reproduce: fresh page, commit the first prediction, read the investigation in normal order to “A word and a mask, combined bit by bit.”

The learner has just met the three rules. To reach their first experiment applying them they must hold those rules while following a second mechanism: selecting, repositioning and reading a multi-bit field through a compiler-combined instruction. At 375px this is an extended scroll away from the rule list; selecting `toggle_lights` in the figure then returns to a simpler one-bit question. The figure's inline rule helps recover context, so this is avoidable switching, not a blocked task.

Smallest direction: put the three-operation experiment directly after the three rules/complement explanation; place field/shift/extraction prose immediately beside its field-reading diagram afterwards. Keep these related operations together in the lesson.

### Medium: first field-writing attempt combines several unpractised applications

Evidence: “Use only `and`, `lsl`, `orr` and `ret`”, “In one of them, `g` is 13, which is larger than 7”, and “Every bit outside bits 4 to 6 must stay unchanged” (`masks.prose.ts:51–55`). The visible editor starts with only `ret`. Before this the learner has seen one-bit logic rules and a worked field read; they have not stepped a field-writing sequence. Its decomposition is introduced in the optional first hint (`:57`), while width containment is elaborated in later hints and the post-pass comparison (`:58–69`). The failure experiment demonstrating why clearing matters follows the construction (`:71–77`).

Competing tasks: invent a decomposition, choose a multi-bit preservation mask, restrict a second argument, move its surviving bits, choose safe register updates, combine the values and debug against four cases. Earlier editing experience helps with the editor, but does not practise this new composition. Running the initial `ret` produces useful test feedback and unlocks the learner's own stepper, but that stepper can only show the undeveloped attempt. Hints make progress possible; this is a substantial first synthesis leap, not a claim that every learner is blocked.

Smallest direction: provide a brief field-write decomposition/visual attempt before this unrestricted construction, initially with an in-range source. Then retain this task's out-of-range case as the explicit extension testing source-width containment. Alternatively guide the first construction through subgoals without supplying the completed program. Preserve the later broken-clear investigation and post-success compiler comparison.

### Low: phone investigation gives the tiny full-width row priority over the active columns

Evidence: “A word and a mask, combined bit by bit”, “Higher bit”, “Lower bit”, and “Bit 0: input 1, mask 0, result 1.” In the 375px post-commit experiment, all 32 bits fit in roughly 300px; each digit occupies a very narrow cell. The meaningful low bits and the changed marker sit at the far right. The learner must correlate these small columns with the separate numeric values, column readout and semantic table. Reproduce: commit the first prediction, select `toggle_lights`, set the input to `0x35`, press Higher bit once. See `masks-375-light-investigate.png` and dark equivalent. There is no page overflow; the readout/table remain usable, so this is not a high-severity accessibility verdict.

Smallest direction: give the active low byte the readable cell treatment already used by the prediction's mask view, retaining full-width inspection as an explicit detail. Keep column selection and the semantic table as useful alternative access routes.

## Treatments worth keeping

- The first negative-mask prediction combines one new AND operation with familiar signed/unsigned interpretation. It does not require field writing. Feedback shows the actual bit pattern and explains why the negative spelling is not subtraction.
- `ProbePrediction` gates results and `BitOpsFigure` until commitment. The mask view uses a large low-byte diagram and an optional “Show all 32 bits”; this provides a useful model for the phone experiment. Explaining the rule before applying it is not itself a spoiler.
- In the experiment, selecting a function updates the local rule, C, instruction and result together. Before/after labels and a changed-bit mark reduce bookkeeping. The semantic table confirms whether unrelated warnings/gear survived.
- The field-reading diagram makes selected bits and their relocated result visible. The `x0` explanation correctly reconnects familiar width knowledge.
- The learner's solution stepper unlocks on a run, not only success, so partial attempts can be investigated. Its low-byte-first display and optional full-width detail are sound staging. GCC's `bfi` comparison waits for a passed construction and therefore adds an alternative implementation after the learner has built a mechanism.
- The final three-result task explicitly says each instruction starts from the original input. These are reasonable transfer applications, not three simultaneous new mechanisms.

## Browser evidence and limits

Own script `/tmp/course-load-review/masks-browser.cjs`; log and screenshots share the `masks-` prefix. Fresh contexts at 375×900 and 1280×900, each with light/dark preference. Observed body backgrounds confirm actual light (`rgb(243, 246, 245)`) and dark (`rgb(16, 22, 21)`) rendering. Initial widths matched the viewport with no page horizontal overflow.

In all four combinations exercised: initial page/gates; first prediction committed with a deliberately incorrect choice; compiler disclosure; operation changed to `toggle_lights`, input edited, bit selected; full-width prediction disclosure; `gear_of` selection; initial `ret` run and first hint; unlocked own-code stepper advanced through return; failure prediction committed. Screenshots include initial, committed, investigation and attempt states. Read all ten rendered sections through the initial page text and full-page captures; inspected representative phone investigation and desktop dark prediction images visually.

Post-success BFI comparison and a nontrivial successful learner program were source-reviewed only. I did not submit a solution, exhaust hints, test every bit/input, evaluate persistence/reset restoration, or measure learning outcomes. The teaching directions are design recommendations grounded in the confirmed sequence; effectiveness requires a learner trial. No challenge answers are included in this note.
