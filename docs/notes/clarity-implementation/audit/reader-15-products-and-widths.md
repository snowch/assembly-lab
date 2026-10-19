# Independent learner review: Products and their widths (lesson 15)

Read-only review of current lesson source and built site at http://localhost:4290/assembly-lab/#/lesson/products-and-widths. No prior review notes read. Read CLAUDE.md, style/authoring guidance, front-page prerequisites, course order, relevant preceding definitions, all target prose/labels/options/hints/model notes and relevant shared prediction/stepper/product strings and components. Prerequisite reading focused on passages relevant to this lesson; I did not re-exercise every earlier lesson.

## Findings

### 1. Medium: predictions still present stepping instructions above the question

- Quote: **“STEPPED”**, followed on expansion by **“Each step runs one instruction in the simulator. Between steps, the simulated processor stays as the last instruction left it.”** This appears immediately above **“What hexadecimal result does w0 hold?”**
- Source: `content/lessons/products-and-widths.ts:7-12` assigns the steps time model without a figure role; prediction factory at lines 26-44 also supplies no prediction role. Shared note is `packages/views/src/strings.ts:10-13`; rendering rule is `platform/lesson-runtime/src/LessonView.tsx:68-79`.
- Setup: fresh page, expand Stepped badge on first prediction without checking an answer. Observed badge on both prediction cards at all four configurations; expanded first badge directly on phone light. Screenshot `/tmp/course-clarity-audit/15-prediction-note.png`.
- Learner effect: the card offers answer choices and Check your prediction, but guidance describes a step action that belongs to the following, separately locked stepper. This repeats the placement problem in the user's recent screenshot and makes prediction and investigation controls harder to distinguish.
- Direction: apply the existing prediction-role treatment to these prediction figures; keep the simulator stepping explanation with the stepper. No simulator change needed.

### 2. Low: fourth construction hint has no named instruction as its referent

- Quote: **“Its operands are destination, first factor, second factor and value to add.”**
- Source: `content/lessons/products-and-widths.prose.ts:27` (`writeHints[3]`).
- Setup: Write scaled_total, reveal hints 1 through 4. Screenshot `/tmp/course-clarity-audit/15-fourth-hint.png`.
- Immediate context: prior hints discuss multiplying then adding, the total, and a numerical example. None names an instruction for “Its” to refer to. The editor also allows separate multiplication and addition as well as a combined instruction.
- Learner effect: someone needing this hint must infer which instruction has the stated four-operand form; the hint assumes precisely the choice it should help them make.
- Direction: name the instruction whose operand order is being described, without changing the task or revealing the final sequence earlier.

## Timing and prerequisite assessment

No unsupported prior knowledge found in the reviewed lesson. Earlier teaching supports the main terms:

- `meet-the-machine.prose.ts:54`: “An instruction's parts after its name are its operands.”
- `one-pattern-three-readings.prose.ts:24-28`: hexadecimal grouping/prefix and unsigned/signed readings.
- `memory-and-addresses.prose.ts:11-14`: target integer widths, unsigned type names and w/x views of one register, including clearing upper bits.
- `loading-widths.prose.ts:14,47`: sign extension and a C cast as a requested conversion.
- `meet-the-machine.prose.ts:16`: GCC and the -O1 optimisation setting.
- Target lesson itself defines product/high half and explains the new multiplication instructions before their exercises.

I did not report the first prediction question as missing its execution moment: its immediately preceding sentence says the multiplication writes w0 and its caption says to predict the product's low bits. In this two-instruction example, the multiplication result and returned register value are the same. Later failure question explicitly asks what the program returns. Nor did I report w0/x0 as unexplained separate registers: the prior lesson definitions and the current motivation explain their relationship.

## Browser coverage and limits

Chromium at 375×900 and 1280×900, each light/dark. Fresh contexts; read full rendered initial page text, saved full-page screenshots, visually inspected paired-listing/first-step screenshots in all four configurations. Committed both predictions, unlocked the dependent figures and stepped the first multiplication once in every configuration. Confirmed source/instruction highlighting and register changes; no horizontal document overflow. Phone light additionally expanded the prediction model note and revealed four construction hints. All target hint and feedback strings were read in source; no challenge solution was entered and no exhaustive input testing was performed. Review does not claim a technical Arm/C audit or pixel-by-pixel inspection of every full-page screenshot.

Evidence: `/tmp/course-clarity-audit/15-{375,1280}-{light,dark}.png`, corresponding `.txt` initial-page captures and `-step.png` detail captures; the two finding-specific screenshots named above.
