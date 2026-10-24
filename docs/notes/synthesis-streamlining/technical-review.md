# Independent technical and sceptic review

Reviewer: synthesis_technical, separate from copy, lesson structure and browser-test authors.
Date: 24 October 2026. Scope: Putting it together, its retained programs/calls, shared StepperFigure
options and migrated source/content/browser assertions. No product files edited by this reviewer.

## Source review

No blocking semantic issue found in the reviewed diff.

- The prior four Fundamentals lessons already define and practise arithmetic operand roles,
  read-before-write reuse, argument/result placement and return, and carrying a computed state
  into the next instruction. Removing the opening first-write question and the isolated final
  subtraction question does not remove either mechanism's first demonstration or practice.
- The synthesis still makes its additional four-argument mapping explicit before execution.
  It connects the C variable to the register updated by this particular compiled function.
  The complete paired stepper retains checked C associations and all four real instructions.
- The worked run now opens directly. This is not a weakened retained prediction: predict-total
  itself is removed, while the genuinely new missing-return prediction still gates step-no-ret.
  The removed static listing is consolidated into the existing executable complete listing.
- The missing-return example explicitly introduces memory and the adjacent function layout.
  It uses the same input call and the checked modified listing; arithmetic result and neighbouring
  instruction effects come from the model. Its invitation and precommit content do not reveal
  the outcome. Existing feedback and gated explanation remain tied to that run.
- fuel_used still requires repairing instructions, rather than merely recalling an operand rule.
  The final fresh-input trace still combines a complete function, ordered calculations and a
  register left untouched. Tasks, allowed constructs, call cases, references and hints remain
  unchanged. No fresh challenge answer was added to the surrounding teaching text.
- Existing program/listing/sourceLines records are unchanged. Compiler version and optimisation
  qualifications remain local. The recorded unoptimised instruction-count comparison remains
  checked by meet-the-machine.facts.test.ts; no new compiler or architecture claim was invented.

## Shared component and test review

The new StepperFigure properties default to showCompilerLines=false and notes=[]. Other stepper
uses therefore retain their prior markup and model behaviour. Only the synthesis opts into these
properties. The renderer delegates source pairing and raw compiler references to the existing
ListingView, and notes use the same closed details/Prose pattern as ListingFigure. Moving those
notes does not turn recorded compiler output into a live compiler or hardware run.

Migrated tests preserve source associations, raw-reference disclosure, closed note keyboard use,
model state after stepping, local scroll/focus behaviour, persistence/reset, editor and trace
challenge correctness, failure prediction commitment and the missing-return gate. Replacement
assertions directly check the removed UI is absent and the first complete function can run
without a prerequisite quiz. Removed fact tests were specific to the retired closing question,
not the remaining programs' simulator or corpus checks.

## Sceptic decisions

Rejected: retaining the final trace contradicts removal of repeated elementary tests. It is the
independent integration task after a worked multi-operation function and a repair/failure
experiment. It exercises composition rather than adding another stand-alone operation quiz.

Rejected: losing the argument diagram loses the four-argument rule. The ordered names/registers
remain explicit directly before the complete listing; the worked stepper shows their initial
values. No new width or calling-machine detail is assumed to justify that mapping.

Rejected: removing the total gate exposes an answer prematurely. There is no longer a total
prediction to answer. Its register relationship is part of the worked example; the two fresh
challenges and new failure prediction retain their own disclosure boundaries.

## Verification scope

Source and executable-record inspection is complete. A focused independent test command and
final built-page checker are in progress; their results will be appended separately. This review
is not a full-suite result, a new GNU/QEMU execution or a hardware-test claim.

### Focused executable check

Independent command:
`npx vitest run content/lessons/meet-the-machine.test.tsx content/lessons/meet-the-machine.prose.test.ts content/lessons/meet-the-machine.facts.test.ts content/source-links.test.ts packages/views/src/module0.test.tsx`
completed successfully: 5 files, 169 tests, zero failures/skips. This is separate from the full
repository check and does not replace it.

### Accepted review findings

A preliminary browser checker wrongly expected a completed stepper position to persist through
reload and observed its initial state instead. Source inspection confirmed `k`, `removed` and
`bitsShown` are existing local useState values, while prediction commitments use the lesson store.
The new browser tests/readers must check reset-on-reload for those local controls and saved
commitments separately. Adding a persistence feature would expand this request unnecessarily.
A second preliminary script then attempted Reset at an already initial position, where it is
correctly disabled; the script was corrected to step before testing Reset. These preliminary
checker failures are not reported as successful product tests.

The reader's stale “Prediction” category finding is supported: the context section no longer
asks a prediction. The smallest supported fix is to hide that one category label while retaining
its descriptive section heading, the ten-section authoring structure and the genuine missing-ret
prediction label. No replacement repeated quiz or shared schema change is needed.

### Final built-page verification

Final stable build at http://localhost:4326/assembly-lab/ checked in real Chromium at 375 and
1280 CSS pixels, both actual light and dark themes (four fresh contexts). The corrected final
checker completed successfully in every context. Independently inspected screenshots of the
phone dark and desktop light complete walkthrough; source pairing, controls, current registers
and optional notes are readable without page overflow.

Verified directly executable initial stepper; seven complete C lines beside four instructions;
checked teaching associations versus the separate recorded compiler references; both closed
notes opening and closing; model register values after all four steps; no write indication for
the return; local execution resetting on reload; explicit step/reset controls; the missing-return
figure remaining locked through merely selecting a prediction and opening only after commitment;
the modelled fall-through run reaching its return; the removed opening figures and final answer
disclosure staying absent; and no browser errors/page-level overflow. The stale context category
label is hidden in the final built page while the section's descriptive heading remains.

A sibling rendered stepper, run-fuel-used in Same bits, two readings, retained no optional compiler
reference disclosure or notes in all four contexts. Combined with schema defaults and source-use
inspection, this supports the narrow default-off change; this is not a browser audit of every
later stepper.

Evidence: `/tmp/synthesis-technical-browser.mjs`, final output
`/tmp/synthesis-technical-browser-final-build.log`, observations
`/tmp/synthesis-technical-browser.json`, screenshots
`/tmp/synthesis-technical-{375,1280}-{light,dark}.png`. The preliminary assumption failures above
remain separately recorded and are not overwritten by this successful final run. No blocking
technical or sceptic finding remains in the reviewed change.
