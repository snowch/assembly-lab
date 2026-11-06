# Comparison stages: checked copy brief

- Outcome: inspect the two C functions, predict whether their recorded instructions differ,
  then call both and compare the returned bits and their C values.
- Preparation: signed and unsigned readings and the earlier four-bit subtraction are already
  taught. No new technical term or calculation is introduced by this copy.
- Source checks: `content/lessons/pacing-1-4.ts` supplies independent calls with arguments
  `[3, 5]`, signed and unsigned return readings, and the existing worked calculation.
  `content/lessons/module-1.listings.ts` records both trip functions and their source links.
- Interaction checks: `ListingCompare.tsx` makes both C sources available before prediction,
  reveals the assembled comparison after prediction, and enables calls only after prediction.
  Returned values and calculations come from the existing model and type choices.
- Copy: the three headings are “Inspect the functions”, “Predict the instructions” and
  “Call and compare”. The call guidance moves out of prediction feedback into
  `COPY.arithmeticBits.callIntro`, passed as `callComparison.intro`. It names the prediction
  prerequisite and the visible call control without revealing instructions or results.
- Placement: headings and call guidance must be visible before prediction. Call controls remain
  unavailable until prediction is checked. Feedback explains the instructions inside the
  prediction stage; call results belong with the call controls.
- Process: a separate copy agent drafted these strings from the managing agent’s checked facts,
  then read them against `docs/style.md` and `docs/authoring.md`. Sentence pass: short active
  directions, control name preserved, no new numbers. Idea pass: the headings expose the three
  activities and the call guidance gives the next action and comparison to make.
- Canonical strings: `docs/notes/course-pacing-implementation/copy.md` records both the exact
  lesson-copy JSON and the exact call-comparison UI source. Independent review and rendered
  browser verification belong to the implementation check; this pass inspected source only.
