# Putting it together: independent learner and built-page review

Reviewed 24 October 2026 by a reader who did not draft or implement the change.
Prerequisites: the front page and the four earlier Fundamentals lessons, without later chapters.
Build: http://localhost:4326/assembly-lab/#/lesson/meet-the-machine.

## Learner verdict

No blocking learner, interaction or layout issue found. The lesson now asks the learner to
combine and debug established operations rather than answer another isolated destination quiz.

“Now combine those mechanics” provides the transition from the four earlier lessons. The
incoming four arguments are explicitly associated with their four registers before the complete
function runs. “Follow the C variable total through the calculation” directs attention to the
new C-to-register relationship. The paired, highlighted listing demonstrates it without a
second static copy or a separate register-reuse test.

The fuel-used repair applies operand knowledge to editing; the missing-return experiment adds
execution through adjacent instructions in memory; the independent final trace combines the
skills with different inputs. Those retained tasks therefore have distinct purposes. Removing
the single-subtraction reflection question does not remove the independent final assessment.
A smaller complete example is unnecessary here because each operation, a complete tiny function
and a two-instruction dependency have already been demonstrated and practised separately.

## Presentation finding for sceptic assessment

Low severity: the visible category “PREDICTION” still appears above “Connect the operations to a
function”, although the section is now explanatory context with no prediction question or
control. It could suggest an activity is still expected there. Direction: omit that visual
category for this section, or use an appropriate visible role while preserving the required
underlying authoring section. This does not obstruct the directly accessible walkthrough.

## Prerequisite and wording check

- Registers, operand order, reuse, integer argument/result in w0, ret and the next-instruction
  marker are taught by the earlier four lessons; the shortened page can rely on them.
- The new multiple-argument register order is given explicitly before the walkthrough.
- Memory is defined as the place outside registers holding the program's instructions and
  values before the adjacent-function experiment uses it. The arrangement of these particular
  functions is explicit; the page does not claim arbitrary functions always lie together.
- GCC and its optimisation setting were explained in the earlier tiny-function lesson;
  this page names its recorded version/setting and retains detailed optional source notes.
  The no-optimisation setting is defined locally before comparison.
- The final trace defines the odometer's meaning and the number inside the last instruction.
  No later calling machinery, stack mechanism or untaught opcode is needed.

The sentence pass found no new jargon gap. The explanation pass found the combination bridge
adequate: the learner is prepared to follow the full function and attempt both retained tasks.
The required missing-return prediction has no outcome initially; selecting an option alone does
not open the experiment. Its result is revealed only after commitment. Fresh final fields start
empty and its worked answer is not supplied by the earlier walkthrough.

## Actual built-page checks

Real Chromium in six fresh contexts: 375, 768 and 1280 CSS pixels, light and dark. Verified actual
html[data-theme] in each context. Read the complete rendered lesson, checked source associations
and inspected full-page phone-light/tablet-dark screenshots plus the phone-dark walkthrough at
normal screenshot width. Complete seven-line C remains beside all four instructions at every
width. The phone listing scrolls within its own region; tablet and desktop panes fit. No page
horizontal overflow or page errors in any context.

In all six contexts checked:

- Removed static listing, argument reveal and introductory question are absent.
- The complete walkthrough starts immediately with enabled Next; step, Back and Reset work.
- Reload resets this shared stepper's local execution state, as established by its useState
  implementation; this is distinct from preserved prediction and challenge work.
- Both optional compiler notes remain on the walkthrough, initially closed; the source-line
  tags remain associated with their checked C statements.
- The missing-return experiment remains locked before commitment, unlocks afterwards and can
  execute the modified listing. Reload retains the committed prediction/unlocked gate, while
  the experiment's local switch/execution state returns to its initial setting.
- Both challenges remain mounted and the final trace starts with blank answer fields.
- The reflection has no isolated subtraction question or answer disclosure.

The reader did not submit exercise reference answers or rerun full-suite grading; that belongs
to the coordinating automated browser checks. No hardware or full-course audit is claimed here.
Evidence: /tmp/synthesis-reader.mjs, /tmp/synthesis-reader/report.json and screenshots/text under
/tmp/synthesis-reader/. The first reader script incorrectly expected shared stepper persistence
on reload and stopped; source inspection established the existing local-state contract, and the
corrected script passed all six contexts. That diagnostic was not a product regression.

## Accepted presentation correction: final built-page verification

The coordinating agent accepted the low-severity category finding. Scoped course CSS now hides
only this synthesis-context section's “PREDICTION” category, retaining its meaningful heading
and the authoring section. Independently checked the final rebuilt page at 375 and 1280 CSS
pixels in both actual themes: category hidden, “Connect the operations to a function” visible,
missing-return experiment's distinct category still visible, complete walkthrough listing still
present, and no page-level horizontal overflow. Four contexts passed; screenshots under
/tmp/synthesis-reader/heading-{width}-{theme}.png and script /tmp/synthesis-heading-check.mjs.
No product changes were made by this reviewer. The accepted finding is resolved.
