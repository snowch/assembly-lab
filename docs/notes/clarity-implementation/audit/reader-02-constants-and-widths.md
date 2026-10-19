# Independent learner review: 02 Constants and widths

Read-only review of the lesson at `http://localhost:4290/assembly-lab/#/lesson/constants-and-widths`. No earlier review notes consulted. Read CLAUDE.md, docs/style.md, docs/authoring.md, front-page prerequisites, earlier lesson 00/01 prose, the complete current lesson prose/labels/structure, and component strings/implementations for its predictions, tester, steppers and challenge feedback.

## Coverage

Actual Chromium inspection at 375×900 and 1280×900, each in light and dark themes. At all four configurations I read the rendered initial and expanded page, opened lesson details/compiler references, checked both predictions, tried accepted/rejected/malformed number inputs, stepped all three available example steppers forward to the end and back, ran the initial challenges and opened all five hints on each. Separately opened the prediction's Stepped badge at all four configurations and captured it. No page horizontal overflow in those states. Reviewed screenshots of phone pairing, phone prediction guidance, phone dark invalid input, and desktop dark width figure. The passing learner-solution stepper was read in source but not unlocked in this browser pass; saved/reloaded challenge persistence and exhaustive tap-editor operation were not tested.

## Findings

### 1. Medium: stepping guidance still precedes predictions that have no step controls

**Quote:** “STEPPED” opens “Each step runs one instruction in the simulator. Between steps, the simulated processor stays as the last instruction left it.” directly above “Which number does the rule above guarantee will fit in one `mov` to `w0`?”

**Sources:** `content/lessons/constants-and-widths.ts:82` (predict-fits interactive), `content/lessons/constants-and-widths.ts:160` (predict-width interactive), `packages/views/src/strings.ts:10` (model note). Both predictions retain `timeModel: STEPS` without a prediction role. The tester at `constants-and-widths.ts:105` also uses this badge despite having no step controls.

**State/setup:** Fresh lesson, open the Stepped control above predict-fits before choosing an option. Reproduced at all four viewport/theme configurations. The same lesson also has actual Next/Back steppers.

**Learner effect:** The explanation concerns a control the prediction does not offer. On the phone it inserts a substantial unrelated block between caption and question. For predict-fits the checked operation is assembling candidate constants, making the simulator-step explanation particularly misplaced. It repeats the same guidance-placement problem recently corrected in Module 0.

**Direction:** Apply the prediction role consistently to these prediction cards; keep stepping help associated with actual stepping figures. Review the tester's role separately instead of treating every model-backed figure as something the learner steps.

**Evidence:** `/tmp/course-clarity-audit/02-375-light-prediction-badge.png`, corresponding 1280/light/dark captures.

### 2. Low: copying the lesson's spaced hexadecimal notation produces an unhelpful input error

**Quotes:** “Here are three of the four in hexadecimal, with a space between the halves.” Later the tester says “Type a whole number, in decimal or in hexadecimal with `0x` in front.” when the learner uses that displayed notation.

**Sources:** `content/lessons/constants-and-widths.prose.ts:24` (spaced notation), `content/lessons/constants-and-widths.prose.ts:44` (further spaced examples), `packages/views/src/strings.ts:124` (error instruction), `packages/views/src/interactives/ConstantTester.tsx:26` (syntax accepts no internal spaces).

**State/setup:** Check the preceding prediction to unlock Trying a number. Copy one of the hexadecimal values, including its space, from the preceding prose into the input. Reproduced all four viewport/theme configurations. It produces the format message rather than an assembly-fit result.

**Learner effect:** The learner has followed the lesson's notation and the input appears to meet the message's stated requirements. The feedback does not say that the space is the problem, so a syntax restriction can be mistaken for a problem with the number or understanding of hexadecimal.

**Direction:** Explain that spaces separate halves only in the explanatory display and must be omitted when typing, or accept the displayed grouping in this teaching input. If keeping the strict syntax, make the error identify the separator requirement.

**Evidence:** `/tmp/course-clarity-audit/02-375-dark-tester.png`; input/result logs at `/tmp/course-clarity-audit/02-375-light-tester.txt` and the other configurations.

## Assumed knowledge

The unsupported assumption in finding 2 is the distinction between display grouping and accepted input syntax. No additional substantive missing prerequisite found. Earlier lesson 01 explains hexadecimal, signed/unsigned readings and set/clear. Lesson 00 explains operands, return conventions and the compiler's `-O1` setting. This lesson explains `void` at line 11, assembler at lines 31–32, `lsl 16` operationally at line 43, remainder at line 45, optional `#` at line 46, the relationship between w/x names at lines 61–62, `long` at line 72 and the unsigned suffix at line 74.

## Strengths / no finding

The width prediction explicitly names the instruction after which the value is requested; the final task explicitly says “after all four”. The w/x description states these are two names of the same register, and the figure encloses the lower-width name within the full register. The visible status text distinguishes the instruction just run from the one next. C is paired with its related instructions. The limited single-mov rule is explicitly described as incomplete, so I do not treat the presence of additional accepted patterns as a contradiction.
