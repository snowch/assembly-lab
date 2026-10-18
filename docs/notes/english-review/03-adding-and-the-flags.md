# English review: Adding, and the four flags

<!-- Copyright © 2026 Christopher Snow -->

Reviewed 18 October 2026. Review only; no course content changed. Read against
`CLAUDE.md` and `docs/style.md`, assuming completion of the front-page prerequisites
and the three preceding lessons, with no later lessons available.

## Findings

### 1. “Set the flags” changes a previously defined meaning

- **Severity:** Medium.
- **Exact quote:** “Had `add` set the flags”
- **Location:** `content/lessons/adding-and-the-flags.prose.ts:70`, prediction explanation in “Running add instead of adds”.
- **Learner effect:** Here “set” means calculate and write the flags, including flags whose values would be zero. The learner has explicitly been taught that setting a bit means making it 1, and this lesson defines a flag as a bit. Reading the phrase with that taught meaning makes the following mixed flag values seem contradictory. It also blurs the lesson's central distinction between writing flags and leaving them unchanged.
- **Earlier-definition check:** `content/lessons/one-pattern-three-readings.prose.ts:31` says “to set a bit is to make it 1, and to clear it is to make it 0.” The current lesson's motivation (`adding-and-the-flags.prose.ts:14`) defines a flag as a single bit. Nothing before this point gives “set the flags” a separate meaning.
- **Direction:** Keep the previously taught meaning of “set”; distinguish calculating/writing the four flags from giving an individual flag the value 1.

### 2. “Result does not fit” refers ambiguously to a sum and its stored bits

- **Severity:** Medium.
- **Exact quote:** “V = 1: the carries differ (1 in, 0 out), so the signed result does not fit”
- **Location:** `packages/views/src/strings.arith.ts:92`, the completed investigation adder's final explanation. The same ambiguity recurs in the reflection explanation at `content/lessons/adding-and-the-flags.prose.ts:105`.
- **Learner effect:** The drawing labels the kept 32 bits as the answer, while the prose repeatedly calls those bits the result. Their signed reading is necessarily inside the signed range. “The signed result does not fit” then appears to say that this displayed reading is outside that range. The intended referent is the full mathematical sum of the signed inputs before only 32 bits are kept. A beginner can miss the distinction and mistake overflow for an invalid bit pattern rather than loss of the intended sum.
- **Earlier-definition check:** `one-pattern-three-readings.prose.ts:63` gives a signed and unsigned reading for every 32-bit pattern. Its prediction explanation (`:21`) explicitly distinguishes a sum needing more bits from the bits kept. This lesson's motivation (`adding-and-the-flags.prose.ts:13`) likewise makes the distinction clearly, but the later “result” wording collapses it.
- **Direction:** Keep the full mathematical sum and the stored result's reading distinct wherever a caption or explanation says something does or does not fit. Retain the existing distinction from the motivation beside the figure's conclusion.

## Coverage

Read the complete lesson data, prose and labels, including all objectives, ten
sections, both predictions and their explanations, both expandable details, both
challenge tasks, all five hints for each challenge, the unlocked follow-up note,
reflection answer and model-versus-reality note. Read `strings.arith.ts`, the
applicable shared figure strings and `grader-arith.ts` for the feedback that the
lesson mounts. Checked the earlier prose and front-page “Before you start” panel.

In the browser, checked initial and answered prediction states, both expandable
notes, wrong flag feedback, all ten hints, the first adder's individual-column,
group-of-four and completed states, the unlocked follow-up adder, and all steps of
the failure experiment. Read both successful and unsuccessful prediction feedback.
The numerical challenge's validation and failure strings were read in source;
no claim is made that every invalid-input branch was exercised in the browser.
No challenge answers are recorded in this review.

## Assumed knowledge

The front page supplies binary/decimal conversion, basic arithmetic, and small C
functions with `int`, `unsigned`, arguments and `return`. Earlier lessons explain
registers, operands and their order, `add`, `sub`, `ret`, function arguments/results,
GCC and `-O1`, hexadecimal and `0x`, bit positions and the top bit, signed/unsigned
readings and their ranges, set/clear, `w`/`x` widths and keeping only 32 result bits.
Those are justified prerequisites here.

The page introduces flag, adder, carry and signed overflow itself. The optional GCC
note explains the builtin's purpose, its function label and the role of its returned
value; it expressly defers the two unfamiliar instructions. No additional
unexplained prerequisite is needed to carry out this lesson's tasks. Finding 1
concerns an incompatible reuse of taught vocabulary, rather than missing prior
knowledge.

## Browser evidence

Used Chromium through Playwright against the existing build at
`http://localhost:4220/assembly-lab/#/lesson/adding-and-the-flags`, at 1280 × 900 and
375 × 900, in light and dark themes. All four combinations were exercised; no
horizontal document overflow was observed. Read rendered text and inspected full-page
captures plus viewport captures. Narrow wrapping did not introduce an additional
clarity finding.

Temporary evidence (outside the repository):

- `/tmp/english03-{1280,375}-{light,dark}.txt`: rendered text with expanded details, all hints and wrong flag feedback.
- `/tmp/english03-{1280,375}-{light,dark}.png`: corresponding full-page screenshots.
- `/tmp/english03-{1280,375}-{light,dark}-{Carries,Running,What}.png`: viewport screenshots after successful predictions, unlocked follow-up addition and stepping the failure experiment.
- `/tmp/english03.cjs` and `/tmp/english03-detail.cjs`: browser scripts.

No rebuild, full test suite or course edits were performed.
