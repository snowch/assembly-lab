<!-- Copyright © 2026 Christopher Snow -->

# English review: Meet the machine (Module 0)

Reviewed 18 October 2026. Review only; no course content changed. Read as a learner with the front page's “Before you start” knowledge and no later lessons. Severity: medium means a meaningful misunderstanding or obstacle; low means a local ambiguity or unnecessary knowledge burden.

## Findings

### 1. Medium: the first prediction does not specify when to inspect the value

**Exact text:** “Before you step through, commit to an answer.” (`content/lessons/meet-the-machine.prose.ts:34`), followed by “**Where does the processor keep `total`?**” (`content/lessons/meet-the-machine.prose.ts:35`). One option uses “now” (`content/lessons/meet-the-machine.labels.ts:47`).

**Learner effect:** The surrounding paragraph describes the argument registers on entry, but the check actually runs the first instruction. Before checking, neither the question nor the caption identifies that future point. A reader can interpret the question as asking about entry, the first assignment, or the whole calculation. The check's feedback supplies the missing time point only afterwards. This is visible in all four browser configurations, with the investigation figure still locked.

**Correction direction:** Specify the point in execution the prediction concerns before the choices. Keep the predicted location and value for the learner to infer.

### 2. Low: the caption's colour reference fails in the dark theme

**Exact text:** “The lit C line and the dark line-number chip mark the instruction that just ran; the arrow marks the next one.” (`content/lessons/meet-the-machine.labels.ts:36`).

**Learner effect:** In the dark theme the chip marking the instruction that just ran is bright turquoise, while the other chips have dark interiors. The wording can send the learner to the wrong marker precisely when they are learning to distinguish the instruction just executed from the next one. “Chip” is also not otherwise identified, though its adjacency to the line numbers makes it recoverable.

**Correction direction:** Identify the selected line-number marker by a theme-independent property or explicit emphasis, and use a familiar description of the marker. Preserve the distinction between the last and next instruction.

### 3. Low: the shared simulator note introduces “flags” without explanation

**Exact text:** “An instruction can read or change registers, flags or memory.” (`packages/views/src/strings.ts:11`). It appears under “How the simulator steps” and in each figure's opened Stepped note.

**Learner effect:** Module 0 explains registers and memory, but never tells the beginner what flags are. The front-page introduction also mentions “the flags” (`apps/course/src/strings.ts:20`) without defining them. A learner can follow this lesson without that knowledge, but the note sounds like an explanation of the model while leaving one of its three kinds of state unidentified.

**Correction direction:** Tailor this note to the state introduced here, or provide a minimal plain-English identification before using the term. Do not require a later lesson to make the note intelligible.

## Coverage and clean sections

Read all ten sections, objectives, titles, captions, listing labels and C, both initially closed listing notes, both prediction questions and every choice, all prediction feedback and explanations, both challenge tasks, both sets of five hints, challenge-specific feedback, the closed reflection answer, the shared simulator note and the model-versus-reality note. Read the lesson wiring to check what is actually shown and when. Also read `CLAUDE.md`, all of `docs/style.md`, the front-page prerequisite panel and its readiness example.

No additional actionable English findings in:

- Question and motivation: the trip calculation, compiler, instruction, assembly language and listing receive concrete explanations.
- Compiler and line-number notes: the compiler settings and unusual source-line mapping are explained locally; the qualifications about version and settings remain clear.
- Investigation prose and step feedback: simulator, program counter and operands have immediate explanations; read/write effects reinforce the mechanism.
- Construction: the incorrect fuel calculation, intended result, edit instructions, five hints and reversed-order feedback give a coherent progression.
- Failure experiment and explanation: adjacent functions in memory, removing the return instruction and continuing into the following function are explained together. The wrong-choice feedback directs inspection rather than introducing unrelated terminology.
- Generalisation: the comparison describes where values are kept at each compiler setting rather than merely naming the settings.
- Challenge: odometer and trip timing are explicitly distinguished; the constant syntax is explained. The fields identify the point in execution to report. All five hints and both field-feedback messages are understandable.
- Reflection and hardware note: the closing question has a clear initial state and asks for a clear final state; the note states the simulation's simplifying assumption.

## Prerequisite audit

The allowed background is small C functions with integer arguments and return, conditionals, loops and indexed arrays, plus binary/decimal conversion (`apps/course/src/strings.ts:27–38`). The readiness example also demonstrates local integer declaration, assignment, addition and function calls (`:40–52`). This lesson's use of those forms is therefore supported; no pointers, structs or library knowledge is required.

Introduced here before it must support the learner's reasoning: instruction, GCC as a C compiler, assembly language and listing (`meet-the-machine.prose.ts:10–11`); registers and argument placement (`:33–34`); simulator/model, register bit view, program counter and operands (`:48–51`); return behaviour (`:56`, then `:93`); memory (`:77`); the immediate-number syntax (`:100`). The listing caption identifies the colon-terminated function label (`meet-the-machine.labels.ts:34`). The compiler note explains the effect of the optimisation setting (`meet-the-machine.prose.ts:16–18`), and the generalisation independently describes the practical difference (`:97`). Arm is a processor name, not a tool the learner must know how to use. The 32-bit view is explicitly identified as part of each register, with further detail deferred; this does not obstruct the decimal arithmetic here.

Unexplained assumed term found: **flags**, finding 3. No claim here depends on a later lesson's definition.

## Browser evidence

Used the actual built page at `http://localhost:4220/assembly-lab/#/lesson/meet-the-machine`, Chromium via the repository's Playwright installation, at 1280 × 900 and 375 × 900, each in light and dark colour schemes. Ten lesson sections rendered in each. Opened all native closed notes. In each configuration checked every prediction choice, unlocked both steppers, stepped the trip function, ran the initial failing challenges, revealed all five hints for each challenge, and stepped the removal experiment with its switch both off and on. Read the resulting feedback and flow labels. Source review covered challenge feedback not triggered by empty answer fields. No rebuild or full test suite was run.

Temporary evidence (not committed): `/tmp/english00-{1280,375}-{light,dark}.txt` and matching full-page screenshots; `/tmp/english00-states-{1280,375}-{light,dark}.txt` for interactive text; `/tmp/english00-step-{1280,375}-{light,dark}.png` for the final removal-experiment figures. The latter were visually inspected in all four configurations. The dark screenshot confirms the bright selected line-number marker underlying finding 2. No viewport-specific English issue beyond that theme-dependent reference was found.
