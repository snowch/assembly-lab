# Header calculator validation

Scope: shared header tool; existing lesson calculators retain their preset guides and grading.

## Focused commands before full check

- `npm run typecheck`: passed before independent final review.
- `npx vitest run packages/views/src/ProgrammerCalculator.test.tsx`: 10 passed.
- Candidate 1 header browser tests: 6 passed.
- Candidate 2 header plus existing lesson calculator browser tests: command failed,
  17 passed, 10 failed, 1 skipped. All failures found the compact brand's zero font size.
  Corrected source to a real hidden span with the brand's explicit accessible name; did not
  weaken the design checks.
- Candidate 3 rerun of those tests: 27 passed, 1 skipped. The skip is the existing
  fine-pointer desktop bit-row case in the phone project.
- Candidate 4 final focused rerun: 27 passed, 1 existing skip. Final full results follow
  in the pull request so the source tree can remain fixed during `npm run check`.

## Review corrections

- Accepted learner finding: Close had poor dark-theme contrast and a small target.
  Applied theme tokens and a minimum 44-pixel height; independently verified in both themes.
- Accepted learner finding: global tool exposed readings before Module 1 teaches them.
  Added separately drafted definitions beside decimal/hex readouts and the width controls.
- Managing visual pass: shortened the initial explanation and moved persistence guidance below
  the controls, bringing entry into the first phone screen. Close remains sticky when scrolling.
- Independent reviews and final candidate details are in `learner-review.md` and
  `technical-review.md`. The original copy and subsequent compact draft are in `copy.md`.

Ordinary refresh resets transient calculator work, as in existing figures. Closing the panel,
client-side route changes and coordinated update snapshots preserve scratch state. No durable
calculator storage or platform changes were added. A seeded update envelope checks restoration;
existing whole-app update tests cover the service-worker lifecycle.
