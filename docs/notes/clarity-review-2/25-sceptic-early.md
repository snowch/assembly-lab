<!-- Copyright © 2026 Christopher Snow -->

# Independent sceptic: lessons 00–10

18 October 2026. Assessed the eleven fresh reader reports against the current source,
lesson wiring, relevant model/view code, preceding teaching and front-page
prerequisites. Read `CLAUDE.md`, `docs/style.md` and [the brief](brief.md). This is a
sceptic assessment, not a second full interaction test of eleven lessons. No course
text was changed. Model and effort were inherited without overrides.

**Disposition:** retain the existing issues **M1, M2, M4, M6, M7 and L1–L11**.
Accept **06-N1 as one new low issue**. Merge the supported additional hint locations
into M6; reject one proposed extra occurrence. The earlier three rejected early
suggestions remain rejected. The approved simulator sentence passes.

## New issue accepted

### 06-N1, low: the shift prediction promises fill marks it does not show

Source: `content/lessons/shifts.prose.ts:30`:

> The figure marks the filled top bit in each case.

Independently submitted the prediction in the immutable built preview at 1280 and
375 pixels, light and dark. The current prediction card shows one operation's
before/after rows. Its outlines mark changed low bits, not the filled top bit. It
does not display a second operation's result row. This matches
`packages/views/src/interactives/ProbePrediction.tsx`, whose result row uses
`marks={{ changed: differing(...) }}`. The separate investigation's `ShiftFigure.tsx`
uses `fill` marks and selectable operations.

The strongest defence is that “the figure” could mean the following investigation.
That interpretation still requires the learner to leave the enclosing prediction
card, find a different figure and select its other operation. The sentence supplies
none of that direction. It causes a concrete search for absent marks, so it survives
as a low referent issue. Smallest fix: identify the intended figure and necessary
selection, or limit the description to what this prediction card actually marks.
No extra diagram or change to shift semantics is required.

See [reader 06](06-shifts.md). Independent evidence:
`/tmp/clarity2-sceptic-early.cjs`,
`/tmp/clarity2-sceptic-early-browser.json`, and
`/tmp/clarity2-sceptic-shifts-{1280,375}-{light,dark}.png`. Visually inspected the
independent desktop light capture; the four browser records confirm the same
card content in each configuration.

## Existing medium issues

- **M1 retained.** `subtracting-and-the-tick-counter.prose.ts:42,100` says “the
  second operand, its bits changed” and “an addition of the second operand”. The
  defence that this means the second mathematical input fails against the course's
  explicit convention: Module 0 says “An instruction's parts after its name are
  its operands” and “It subtracts its third operand from its second.” A learner
  using that definition identifies the wrong input here. Name the subtracted
  input consistently. [Reader 04](04-subtracting-and-the-tick-counter.md).
- **M2 retained.** The same lesson at line 41 calls the calculation involving only
  inverted `b` and the carry-in “the full sum”. Its earlier worked addition includes
  the first input; its reflection at line 100 omits that input again. The later
  explanation, “The adder adds `now` to `then` with every bit changed, plus 1”, is
  correct but cannot remove the intervening contradiction. Distinguish the
  intermediate quantity from the full addition, and include the first input in
  the reflection. This remains separate from the operand-name problem.
- **M4 retained.** `compare-and-choose.prose.ts:74`: “Equal values give the wrong
  one.” The following source-selection question can imply that changing between
  equal inputs repairs the result. `chooseLessFuel` in
  `packages/views/src/grader-feedback.ts` selects the message when the original
  arguments are equal; it does not establish that the selected registers still
  contain those arguments. Direct the learner to the failed result and actual
  source contents. The reader independently reproduced the message, and the grader
  condition confirms its scope. [Reader 07](07-compare-and-choose.md).
- **M7 retained.** `shifts.prose.ts:19`: “leaves the result … to the implementation”,
  “leaves some left shifts undefined, a negative value among them”, and “GCC
  defines them”. Previous teaching identifies GCC but does not explain these two
  different C guarantees. Knowing that GCC is a compiler does not tell the learner
  the difference between a documented choice and an operation for which C supplies
  no guarantee. Identify the actor and the difference briefly; attach the
  negative-input condition to the shift operation. Preserve the C/GCC distinction.
  [Reader 06](06-shifts.md).
- **M6 retained as one shared issue.** Fixed hint headings are “Common mistake” and
  “Smaller example” (`platform/lesson-runtime/src/strings.ts:122`). “Put a label
  before the shift so a branch can repeat it” (`counting-down.prose.ts:31`) gives
  the correct action under the former. The following rung supplies another action
  for the current program under the latter. A learner seeking help can interpret
  recommended actions as mistakes. Make the affected hints fulfil their headings,
  or use an accurate heading through a supported mechanism. Do not edit the
  platform copy. [Reader 10](10-counting-down.md).

Supported additional M6 locations in this group are:

| Lesson/source | Evidence under “Common mistake” | Decision |
| --- | --- | --- |
| `meet-the-machine.prose.ts`, `traceHints[1]` | “A register no instruction writes keeps the value it arrived with.” | Correct rule without identifying the mistake; low locally. |
| `subtracting-and-the-tick-counter.prose.ts:93` | A correct unsigned comparison stated without identifying the mistaken assumption. | Low locally; merge. |
| `masks.prose.ts:58` | “Bits outside 4 to 6 must stay unchanged.” | Correct requirement under the wrong heading; low locally. |
| `shifts.prose.ts:46,83` | Correct rounding rules; “A left shift is the same for both types.” | Merge; the latter is especially easy to read as the belief to avoid. |
| `compare-and-choose.prose.ts:61` | “The values are `unsigned`, so use the unsigned pair of conditions.” | Low locally; the imperative helps recover the meaning but does not name a mistake. |
| `counting-up.prose.ts:35` | “Use an unsigned comparison between `start` and `end`.” | Merge; its next rung is also a current-program instruction under “Smaller example”. |
| `counting-down.prose.ts:69` | “Check the tick count before the first shift.” | Merge; its next rung is again advice rather than a smaller example. |

**Reject the additional masks line 94 occurrence.** “Each result starts from
`0x2a`, not from the one before” directly identifies the incorrect chaining
assumption. The heading can naturally introduce this correction; it does not need
a formulaic “The mistake is …” prefix. This is comparable to the accepted useful
hint “Do not expect two different numbers from every pattern” in lesson 01.
Retaining masks line 58 does not require retaining every second hint in that
chapter. This exclusion changes neither M6's status nor the course-wide issue count.

The table records this review's supported examples, not a claim that every other
hint ladder has been certified against its heading. M6's repair should review all
ladders together.

## Existing low issues

| ID | Source and quoted evidence | Sceptic decision and smallest direction |
| --- | --- | --- |
| L1 | `meet-the-machine.prose.ts:38–39`: “Before you step through” / “Where does the processor keep `total`?” | Retain low. The option mentioning the first sum helps, so the prediction is answerable. Its execution point should still be stated before the choices. |
| L2 | `adding-and-the-flags.prose.ts:70`: “Had `add` set the flags”. | Retain low. Earlier “to set a bit is to make it 1” makes this collective use inconsistent. The mixed values following rescue the meaning; use the established writing/updating language. |
| L3 | `meet-the-machine.labels.ts:36`: “the dark line-number chip”. | Retain. Inspected the current reader's phone dark screenshot: the selected marker is bright turquoise, while other interiors are dark. Identify a property that survives theme changes. |
| L4 | `packages/views/src/strings.ts:11`: “registers, flags or memory”. | Retain once, not once per early chapter. Registers and memory are introduced in Module 0; flags first get “a single bit that is either 0 or 1” in Adding and the flags. The front page merely names them. Identify flags minimally or constrain the early note's vocabulary. |
| L5 | `masks.labels.ts:69`: “the constant in the listing”. | Retain low. The inline C and instruction are present at `masks.prose.ts:25–28`; essential code is not missing. The mounted prediction has no separate listing. Refer accurately to the inline instruction; no new listing needed. |
| L6 | `masks.prose.ts:65`: “the figure shows the word after each one”. | Retain. The task distinguishes warning word from gear; the stepper may show a gear intermediate written to another register. Describe the displayed written register/value. |
| L7 | `masks.prose.ts:83`: “Status words, packed dates and colours”. | Retain low. The warning-word mechanism is taught, but none of these three application representations is supplied by prerequisites or earlier lessons. Name the component values in one application to make the generalisation usable. |
| L8 | `compare-and-choose.prose.ts:125`: “This is not a claim about GCC's output.” | Retain. The nearest antecedent is explicitly a claim about GCC's output. Name the scope of the qualification. |
| L9 | `branches.prose.ts:71`: “the next block” / “Does every block end …”. | Retain. Its local label definition names an instruction's position, not a block's boundaries. Earlier C knowledge does not establish an assembly grouping. Name the labelled instruction groups or identify their boundaries. |
| L10 | `counting-up.prose.ts:74`: “one trace”. | Retain low. Context explains the limit but not the noun. Earlier “the call to trace” is a verb. Identify the execution record or use established run vocabulary at this first use; merge Counting down's continued uses. |
| L11 | `counting-down.prose.ts:60–61`: “assume termination” / “need not preserve a never-ending run”. | Retain low. The note does already explain input/output and says that `dim_wrong` changes only local variables. Reject any claim that its conditions have no local grounding. The remaining gap is the practical consequence for generated instructions; make that consequence concrete without promising a particular compiler output. |

The individual source/context records are [00](00-meet-the-machine.md),
[01](01-one-pattern-three-readings.md), [02](02-constants-and-widths.md),
[03](03-adding-and-the-flags.md), [04](04-subtracting-and-the-tick-counter.md),
[05](05-masks.md), [06](06-shifts.md), [07](07-compare-and-choose.md),
[08](08-branches.md), [09](09-counting-up.md) and [10](10-counting-down.md).

## Previous rejections and independent prerequisite pass

- **Constants hint, E02-1: remains rejected.** Before “whose bits fall in one
  16-bit half”, the motivation explicitly says “whose set bits all fall in one
  16-bit half” and immediately qualifies that as an incomplete sufficient rule.
  Its concrete example and prediction repeat the set-bit criterion. The claimed
  missing distinction has already been taught; adding one word is optional polish.
- **“The signed result does not fit”: remains rejected.** Adding and the flags
  first says “If the sum of the two numbers is outside the signed or unsigned
  range, those bits cannot represent that sum under that reading.” The prediction
  then demonstrates that distinction. A later short caption need not repeat the
  distinction between the arithmetic sum and the kept bits.
- **“No result is shown until the word can be read”: remains rejected.** The
  neighbouring invalid-input message explicitly says “Type a whole number, or a
  hexadecimal number starting with 0x”. It gives the required recovery action.

Made a separate assumed-knowledge pass through current early prose, rather than
accepting the readers' clean verdicts alone. The front page supplies small C
functions, arguments, `return`, `if`/`else`, `for`/`while`, arrays and binary
conversion. Module 0 identifies GCC and its optimisation settings; Module 1
introduces hexadecimal, set/clear, widths, constants, the assembler and remainder.
Later early lessons define their new arithmetic terms, mask/field, shift rules,
conditions, labels and loop/body/iteration before requiring them. Local explanations
supply `void`, `long`, suffix `u`, `?:`, `bool`, compound shift assignment and
increment/decrement. A learner need not already know those C features.

No additional prerequisite finding survived beyond the retained gaps above.
In particular, the optional `maybe_beep` excerpt explicitly says “the first two
instructions only” and explains the branch's other destination; omitted call
instructions are not silently required for that example. JavaScript in the new
sentence names the program's language without asking the learner to write it.

## Changed sentence and process records

The [brief](brief.md) accurately identifies the narrow implemented change and the
separate review scope. `apps/course/src/main.tsx` imports and mounts the browser app;
`apps/course/vite.config.ts` uses Vite's React build; `packages/views/src/trace.ts`
imports and calls the local machine's `assemble`, `run` and `stateAfter`. The optional
external GCC request is separately initiated by the comparison button in
`CompilerPlayground.tsx`. These support the brief's factual claims.

The [drafting record](simulator-sentence.md) correctly records the replacement and
its limits. The approved sentence is identical in `meet-the-machine.prose.ts` and
`docs/notes/module-0/prose.md`. The following prose still says that the instructions
are GCC's real output and their running is imitated. Independently read the rendered
paragraph at both widths and themes using the browser script above. It accurately
identifies the program, its loading and its execution location, without adding a
programming prerequisite. **Pass.** The drafting record correctly leaves browser
verification to independent reviewers instead of claiming it for the drafting pass.

This sceptic run did not rerun the canonical tests or the full suite. Reader 00's
separate test and four-configuration evidence remain attributed to that reader.
Other retained placement/interaction findings rely on the fresh readers' stated
browser coverage plus independent source checks; they are not presented as eleven
new exhaustive traversals by this sceptic.
