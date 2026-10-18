# Module 0 prediction timing review

Independent learner and technical review, 18 October 2026. Scope: the first prediction's
lead-in, question, caption, explanation and canonical-prose consistency check. The reviewer
did not draft or edit the lesson.

## Result

No unresolved findings in this change. The question now names the exact point in the run:
“After the first instruction runs, where is the value of `total` kept?” The caption names
that same point. The explanation distinguishes the value before the instruction, the value
after it, and the later arithmetic updates without implying that each update changes the
storage location. “In this function” correctly limits that claim to this recorded example.

One low-severity draft finding was accepted and checked in the final built page:
“The first instruction runs the C statement…” blurred the lesson's distinction between C
and the instructions compiled from it. The draft was changed to describe performing the
statement's addition. This resolves the precision issue without adding terminology.

## Prerequisites and accuracy

Read `CLAUDE.md`, `docs/style.md`, the front-page prerequisites, Module 0's preceding sections,
`TRIP_DISTANCE`, its facts tests, and `TracePrediction` independently. The model's
`first-write` measure examines the first instruction's write; the revised question asks
about that point. The recorded listing and existing trace checks support the explanation's
sequence of values and unchanged storage location.

The section assumes basic C variables, initialisation, arguments, addition and subtraction,
which the front page admits. The preceding section introduces compiler, instruction,
assembly language and listing; the prediction section defines register before using it.
The new wording introduces no further unexplained term. Reading the first instruction's
operands remains the intended prediction, followed by explanation and stepping.

Both style closing passes were applied to the changed section: the timing is explicit,
the C expression supplies a concrete operation, and the explanation states what changes.

## Built-page checks

Inspected the final production page at
`http://localhost:4282/assembly-lab/#/lesson/meet-the-machine`, in fresh Chromium contexts at
375 × 812 and 1280 × 800, with both light and dark themes. Read the final lead-in and inspected
screenshots of the prediction before and after commitment in all four configurations.

- Final wording “The first instruction performs the addition in…” was present in all four.
- Before commitment, no outcome or explanatory answer was rendered; the following stepper
  controls were absent. No new caption or lead-in reveals the register choice.
- After commitment, the model outcome and explanation appeared and the following stepper
  became available.
- Question, options, caption and explanation wrapped without clipping. No horizontal page
  overflow or page errors occurred in any configuration.
- The revised question stands alone: the learner need not infer the moment from the later
  feedback.

Browser observations are recorded in `/tmp/prediction-time-browser-review-final.json`;
eight inspected screenshots are `/tmp/prediction-{before,after}-{375,1280}-{light,dark}.png`.
These are local review artefacts, not repository assets.

## Consistency-test review

The managing session moved `predictTotal` from the list of captions intentionally absent
from canonical prose into the assertions requiring canonical prose. This is correct because
the revised caption is now recorded there. The total caption count remains seven; the four
other historical captions retain their absence checks. The change strengthens consistency
rather than weakening an assertion to accept different text.

The managing session reports 64 focused content checks and a successful final build, plus
18 prediction browser checks across the two widths. Those runs are separate from this
reviewer's four final-build browser inspections; this note does not claim a new full-suite
run.
