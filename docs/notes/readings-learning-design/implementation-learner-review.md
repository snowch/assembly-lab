# Reading the bits: implementation learner review

3 November 2026. Independent learner and interaction review of the production build at
`http://localhost:4173/assembly-lab/#/lesson/same-bits-two-readings`.

Reviewer: separate Codex agent, using the managing session's inherited model and effort.
The reviewer did not write or edit the application. This is an expert review with browser
checks, not a novice session or evidence that the teaching sequence produces learning.
The earlier brief reviews likewise were planning reviews, not novice testing.

## Decision

Keep the visible worked sequence, small fresh practice, explicit width bridge, separate
register task and retained construction exercise. Their teaching jobs are distinct. The
required route teaches the signed rule without opening exploration or Appendix B.

The initial built-page pass found a blocking dark-theme field contrast fault and a minor
validation-message fault. Both were corrected and independently verified in the rebuilt
preview. No learner/UX blocker remains in the reviewed states. Novice transfer remains
unobserved.

## Findings

### L1. High: written answers are barely readable in dark theme

Location: both new task forms, numeric inputs and written explanations.

In the actual rendered dark theme at 320, 375 and 1280 pixels, populated inputs and
textareas had foreground `rgb(232, 238, 237)` and background `rgb(255, 255, 255)`.
The computed contrast is approximately 1.17:1. This was visible in the submitted transfer
task, where the learner must reread an explanation to compare it with the feedback.
Empty fields alone did not reveal the fault. Light-theme fields were readable.

Correction direction: set explicit token-based foreground and background colours on the
new input and textarea styles. Verify populated, submitted and restored fields in the
actual light and dark themes, including focus. Reported immediately to the managing agent.

Status: accepted and corrected. The rebuilt page gives all seven new numeric/explanation
fields explicit token colours. Across all three widths, populated and restored dark fields
now use `rgb(232, 238, 237)` on `rgb(23, 30, 29)`, approximately 14.42:1 contrast. Light fields
use `rgb(16, 26, 24)` on white, approximately 17.75:1. Populated screenshots confirm the
readability improvement. Focus is visible with a 2-pixel token-coloured outline.

### L2. Low: explanation validation reports a numeric-format problem

Location: the small-pattern task, `Check readings`; the transfer form uses the same path.

With valid decimal numeric readings and a whitespace-only explanation, the page displays:
“Enter decimal whole numbers. A minus sign and commas between groups of three digits are
accepted.” The numeric fields are valid; the explanation is missing. Native `required`
validation handles an empty explanation, but spaces reach the shared custom validity check.

Correction direction: identify incomplete explanations as a possible cause, or give a
field-specific error. This is a recovery-message issue, not an assessment-answer leak.

Status: accepted and corrected. In the rebuilt page the same whitespace-only submission
now displays “Enter decimal whole numbers and complete each explanation.” The remaining
sentence explains the accepted number notation. Invalid submission still withholds worked
answers, and completing the explanation permits normal numeric feedback.

## Teaching and assessment review

- **Defined:** set/clear and contribution versus positional weight are stated before the
  first diagram. Unsigned weights are positive; two's complement changes only the highest
  weight. The page explicitly says changing the reading does not rewrite a bit.
- **Demonstrated:** a complete four-position unsigned before/after calculation includes
  zero contributions. The signed comparison keeps one pattern fixed, supplies both weight
  rows and full sums, and explicitly rejects negating the lower-bits total. A clear-highest
  comparison is also visible. No optional interaction is needed to encounter these facts.
- **Practised:** the small task supplies a different pattern, two numeric entries and an
  explanation prompt about highest and lowest set contributions. Totals are absent before
  submission. Incorrect and correct submissions both provide worked sums and rule feedback.
- **Bridged:** “The w0 register view has 32 bits. Its highest position is bit 31, rather
  than bit 3 in our small example.” The new highest-only pattern supplies grouped decimal
  weights and sums including the zero lower contribution. The subsequent prose explicitly
  identifies a new pattern at a new width and distinguishes it from extending the miniature.
- **Applied:** the separate register task supplies the two relevant weights, permits a
  calculator, asks whether the interpretation changes stored bits, and asks what clearing
  the highest bit does to readings, weight and contribution. The exact task totals appear
  only after submission. The result clearly states that only numeric readings are checked
  automatically and written explanations require comparison with model feedback.
- **Constructed:** `make-minus-three` remains a separate exercise under “Make a negative
  number”. It requires constructing a pattern and supplying its other reading. The worked
  teaching examples do not reveal its solution. Its initial, failed, passed, restored and
  cleared states remain usable. The old duplicate `two-readings-each` exercise and the old
  explorer prediction are absent from the rendered lesson.

The small example reduces the initial arithmetic burden enough to display a complete
contribution calculation compactly. Its extra width bridge has a clear teaching job and
is explicit in this implementation. Whether beginners transfer the rule successfully
remains unobserved. The construction task adds a distinct production demand after the
reading tasks; whole-page length and effort should be observed in the formative session.

The headings and exercise captions expose the required route before any previous task is
completed. The appendix and exploration follow the required tasks. The optional exploration
requires an attempted, valid small-pattern submission, rather than a correct guess.

## Browser evidence

Chromium via Playwright, against the running production preview, with fresh browser pages
for each width/theme pair. Both requested preference and actual rendered theme were checked:
light body background `rgb(243, 246, 245)`; dark `rgb(16, 22, 21)`.

| Checks | 320 light/dark | 375 light/dark | 1280 light/dark |
| --- | --- | --- | --- |
| Initial required diagrams and tasks visible without optional clicks | Checked | Checked | Checked |
| Wrong and correct numeric submissions; explanation feedback disclaimer | Checked | Checked | Checked |
| Editing hides prior feedback; task retry clears only its own answers | Checked | Checked | Checked |
| Transfer response and feedback survive reload | Checked | Checked | Checked |
| Exploration changes/reset preserve independent transfer state | Checked | Checked | Checked |
| Retained construction wrong/correct, restored pass, confirmed clear | Checked | Checked | Checked |
| Keyboard disclosure, exploration bit toggle/reset, construction submission | Checked | Checked | Checked |
| No page horizontal overflow initially and with submitted feedback | Checked | Checked | Checked |

The full keyboard path through small-pattern fields, explanation and submission was also
checked at 320 pixels using focus, Tab, typing and Enter, including invalid numeric input
and recovery. The exploration bit's `aria-pressed` state changes with Space. Submission
feedback is exposed in a polite status region. Labels are attached to the task inputs and
textareas. A focused input had a visible 3-pixel outline. No visible main-content button or
summary measured below 24 pixels high at 375 pixels.

For all six initial configurations, the document scroll width exactly matched the viewport
width. Required buttons, fields and diagram code had no measured offscreen horizontal bounds.
The diagram widths were 288, 343 and 992 pixels respectively. Large weights and feedback
sums wrap within their containers. Screenshots of all initial teaching stages and submitted
transfer feedback were captured under `/tmp/readings-*`; these are temporary review evidence,
not committed course assets. The blocking colour finding was made from populated screenshots
and confirmed through computed styles, rather than inferred from source.

One exploratory browser harness was stopped after it used a nonexistent verdict selector;
it yielded no pass result. A corrected focused harness checked all six configurations and
completed successfully. These are focused review checks, not the repository's educational
suite or full application test run.

After the corrections, a separate final harness passed all six width/theme configurations.
It rechecked whitespace-only explanation recovery, correct submissions in both tasks,
restoration of populated fields and feedback, actual rendered theme, computed field contrast,
visible focus, per-task retry isolation and no horizontal overflow. It also checked the
saved-response note's new measure: 576 pixels on desktop and contained at phone widths.
Final populated screenshots are `/tmp/readings-final-*-populated.png`; 320/375 dark and
1280 light were visually inspected. The earlier exploration and retained-construction
checks apply unchanged: the final source changes affect only the new controls' styling,
their validation copy and the saved-response note width.

## Preparation and evidence limits

Read `CLAUDE.md`, `docs/authoring.md`, `docs/style.md`, the local learning-design skill and
the learning-design brief. Inspected `ReadingSequence.tsx`, `strings.reading-sequence.ts`,
`reading-sequence.ts`, `pacing-1-4.ts`, the retained exercise's source, and the prerequisite
panel in `apps/course/src/strings.ts`. Compared the approved small mock's structure in source;
the production page, rather than the mock, is the browser evidence above.

The course explicitly requires small binary place values, basic arithmetic and elementary
C including `int` and `unsigned`. Earlier lessons introduce hexadecimal, registers and
the 32-bit `w0` view. The new lesson supplies the weights rather than requiring memorised
large powers of two. No additional tool name, compiler flag, instruction syntax or C
feature is needed on this required route.

Addition involving negative numbers remains an assumed arithmetic skill. The complete
worked negative sum provides local support but does not establish that a beginner can
perform that arithmetic independently. As the brief requests, distinguish an arithmetic
slip from a representation misconception in a novice session. No new blocking prerequisite
gap was established by this review.

No screen reader, browser zoom, high-contrast/forced-colour mode, speech input, non-Chromium
browser or physical phone was tested. Status-region presence is source/DOM evidence, not
confirmation of spoken announcements. No claim of complete accessibility is made. The
review did not independently re-establish Arm/C facts, run differential checks, run the
full automated suite or deploy the site. No human learner's first attempt or transfer was
observed, so the implementation must not be described as novice-validated.
