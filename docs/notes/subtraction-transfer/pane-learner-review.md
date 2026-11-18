# Elapsed-ticks pane: independent learner review

Copyright © 2026 Christopher Snow

## Scope and method

Independent reviewer using the session model, with no model override. I did not draft or implement the pane. Reviewed only the published lesson route `#/lesson/subtracting-and-the-tick-counter`, served from the production build at `http://localhost:4430/assembly-lab/`. Read `CLAUDE.md`, `docs/authoring.md`, `docs/style.md`, the earlier four-bit arithmetic prose and the actual earlier arithmetic/flags pages before assessing the complete current page. I formed the findings before reading the implementation brief.

The final four browser combinations used Chromium at 1280×900 and 375×900, each in actual light and dark themes. The checked build loaded `index-fdbzojOZ.js`. Screenshot inspection covered all four pane captures and a normal phone viewport. This is an agent review and functional browser check, not observation of a novice learning unaided.

## Preparation and essential route

The learner needs binary place values and unsigned readings, retaining a fixed number of bits, inversion followed by adding one, and the operand/return roles of `sub` and `ret`. Earlier Arithmetic with four bits defines the inversion rule, demonstrates it in a complete example and asks the learner to apply it to a fresh pair. Earlier real-register arithmetic supplies the 32-bit width bridge. Those prerequisites are practised, rather than merely named.

The new pane now introduces the small counting context before using it: the counter stores a count, a tick adds one, and advancing beyond its largest value stores zero. Its earlier/later labels identify which input is inverted and which is added afterwards. All three arithmetic stages are visible together with their input and result patterns. The timeline gives the count interpretation. The bound on elapsed time, the one-`sub` distinction and the explicit change to 32 bits are visible without opening a disclosure.

The pane precedes the original 32-bit prediction and circle. The new small worked pair is explicitly a teaching example; it does not disclose the original prediction's result. After commitment, the original ring connects its own readings and retained-width result before the function-writing task. The existing fresh function tests and closing reflection remain the application route. No further smaller example or extra ticking control is needed for this reminder.

## Findings and verification

### Accepted, low: counter context arrived after first use

The initial pane used “ticks” and “counter advances normally” before the next section first explained “Each count is a tick.” I checked the actual earlier four-bit/arithmetic/flags pages; they did not provide this counting-context definition. The mathematical rule was followable, but its elapsed-time interpretation depended on a later definition.

Correction direction: introduce the tick/increment behaviour with the small counter, before interpreting its result as elapsed time. The final pane now says the counter stores a count, “Each tick adds one,” and explains the return to zero. Verified in all four final browser combinations. Resolved.

### Accepted, medium: the new pane's stylesheet did not load

The initial build displayed small inline operation codes and stacked input groups. Its computed input-group display was `block` and step-label display was `inline`, despite the new stylesheet specifying `flex` and `block`. The stylesheet import was after ordinary rules at the end of `views.css`, where CSS ignores it.

Correction direction: move the import beside the other imports before style rules and rebuild. The final build has the intended computed styles, separate larger operation codes, a distinct retained-result boundary and responsive input groups. Inspected light/dark desktop/phone screenshots; the normal phone viewport keeps all three arithmetic operations readable without sideways scrolling. Resolved.

### Rejected: showing the reminder would bypass the original prediction

The reminder uses a separately identified small counter and announces the move to the real width. The original ring and its result summary are absent behind their existing lock until the learner commits a prediction. Showing the worked reminder therefore does not expose the later question's answer. No gate change is needed.

No remaining material learner-flow finding in this page after the two corrections above.

## Functional checks and limits

- All four final width/theme combinations passed. Actual theme attributes and rendered colours were checked.
- The reminder precedes both the prediction and ring in reading order. The original ring summary is absent before commitment and visible afterwards; its unrelated C row stays absent on this elapsed route.
- Keyboard Space selects a prediction and Enter commits it. The commit operation produced zero scroll displacement in all four combinations. The existing commit button becomes disabled after submission; I do not claim that a disabled button retains focus.
- The original writing exercise accepts the flag-setting subtraction equivalent on all its calls. The code and committed prediction survive reload. This checks compatibility of saved work, not learning effectiveness.
- No page exceptions or document-level horizontal overflow occurred.
- Two initial review-harness runs exited unsuccessfully because my assertions assumed retained focus on the disabled commit button and a generic success-message wording. I corrected the harness to the existing actual interaction and custom grader wording. These were harness mistakes, not source fixes; the final four-combination run exited successfully.

Artifacts: `/tmp/counter-pane-learner-results.json`, `/tmp/counter-pane-learner-{1280,375}-{light,dark}.png`, and `/tmp/counter-pane-learner-phone-natural.png`.

No screen-reader session or novice formative study was conducted. This review supports the clarity of the inspected route and the observed interface behaviour; it does not establish learning effectiveness.
