# Second course clarity review

The user approved changing the simulator sentence to identify the JavaScript program,
its loading with the page, and its execution in the browser. They requested a commit
and push, and a review of every chapter for other improvements in clarity.

Scope: apply that sentence change and keep its canonical prose in sync. Review all
24 lessons and the shared explanations they use. Record further suggestions and
reconcile the first review's 29 retained issues; this request does not require a
general rewrite. Baseline: `5cb518c`, with the prerequisites disclosure already live.

## Checked facts for the simulator sentence

- `apps/course/src/main.tsx` loads the React application and its course components.
- `apps/course/vite.config.ts` builds their TypeScript into browser JavaScript.
- `packages/views/src/trace.ts` imports and runs the local machine implementation.
- The simulator executes in the browser. The separate optional GCC comparison
  sends source to Compiler Explorer only on request.
- The surrounding Module 0 paragraph distinguishes simulated execution from
  GCC's recorded instructions. Keep those qualifications.
- No JavaScript programming knowledge is required of the learner.

Use the accepted sentence as the drafting constraint and follow `docs/style.md`.
It must be checked in the actual built page, on phone and desktop in both themes.

## Review process

Each fresh reader reviews one lesson, with the front-page prerequisites and only
earlier lessons as assumed knowledge. Read the whole prose, captions, hints,
feedback, notes and reflections. Look particularly for vague actors or locations,
ambiguous pronouns, unexplained terms, missing causal steps and overly compressed
technical English. Read for understanding before consulting the earlier review.

Inspect the built page at 1280 and 375 pixels in light and dark themes. State which
interactions were exercised; do not imply every possible test input was tried.
Each finding needs a source location, exact quotation, severity, concrete learner
effect and correction direction. Do not rewrite learner prose or reveal challenge
answers in reports. Then identify duplicates of retained/rejected earlier findings.
Record justified clean results without inventing improvements to fill a quota.

Independent sceptics challenge new findings and recheck the retained issue status.
The final report separates the implemented sentence, outstanding earlier findings,
new accepted findings and rejected suggestions. Every report links to its evidence.
