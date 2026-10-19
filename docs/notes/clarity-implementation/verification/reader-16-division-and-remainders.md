# Reader/checker 16: Division and remainders

Independent read-only review of the final build at `http://localhost:4292/assembly-lab/#/lesson/division-and-remainders`. No lesson or application edits. No author self-assessment was read. The actual lesson/source and prerequisite passages were read before the audit summary and coverage plan.

## Verdict

**Accept the lesson16 corrections. No remaining accepted local issue or clear introduced regression found.**

- **M5, incoming narrow guarantee versus an executed write: fixed.** The challenge introduction now explicitly says, “The input contract guarantees only the distance in the low 32 bits, `w1`” and “Naming `w1` as the input does not mean an instruction has written it.” This separates what arrives from what an instruction changes. It appears immediately before the final exercise, visibly in both phone and desktop layouts. The first test's supplied full-width register value is consistent with the explained contract. Source: `content/lessons/division-and-remainders.prose.ts:40`; test setup in `division-and-remainders.ts` consumption cases. Evidence: `16-{375,1280}-{light,dark}-narrow.png`.
- **N15, division example/guidance order: fixed.** “GCC can also replace division by a constant with other arithmetic” now belongs to Generalisation, which contains the division-by-ten stepper. The exceptional assembly experiments belong to Explanation and the fuel calculation belongs to Challenge. The DOM order agrees with the source; the constant example no longer brackets unrelated fuel prose. Source: `division-and-remainders.prose.ts:36–40`, corresponding section definitions in `.ts`. Evidence: section order in `16-evidence.json`; constant screenshots.
- **Shared roles: correct for this lesson.** Both prediction cards say Prediction; exercise cards say Exercise; the division-parts illustration says Diagram; actual instruction steppers retain Stepped. The signed-division stepper is initially locked and opens only after checking the prediction. The changed-instruction prediction separately gates its stepper.
- **Hint headings: checked.** Both Common mistake hints describe mistakes; both Smaller example hints provide a concrete smaller calculation. The first three hints and unchanged starter feedback were opened in the phone/light browser. Remaining hint prose was read in source without reproducing solutions in this report.

## Actual browser coverage

Real Chromium via Playwright in fresh contexts at 375×900 and 1280×900, each in light and dark. Theme was set with the raw localStorage value and asserted on `html[data-theme]`. All four configurations checked initial prediction gating; submitted both predictions; advanced the signed quotient, signed remainder, unsigned quotient, both exceptional division experiments and the division-by-ten example; inspected the division-parts diagram; used Back in the constant example and checked its reset state; inspected the incoming-narrow-input explanation immediately above the final exercise. Screenshots record gated, constant, parts and narrow-input states. Visual inspection included phone light/dark narrow-input paragraphs and desktop light/dark examples. No page errors or horizontal document overflow occurred.

Separate phone/light checks ran both untouched exercise starters and opened their first three hints. No completed challenge solution was submitted. Not every instruction, possible answer, saved state or test outcome was exercised in all configurations. This is a targeted learner/fix review, not a substitute for the full automated suite.

## Prerequisites and assumed knowledge

Read the front-page prerequisite panel and relevant earlier explanations, particularly Constants and widths (register width and clearing the upper half on a write), Products and widths (widened products, casts, multiply/subtract and undefined signed C arithmetic), and the earlier signed-bit interpretation. Division terms and `/` versus `%` are defined locally. The distinction between the incoming narrow guarantee and an executed write is now supplied locally, so it does not rely on a later calling-convention lesson. No newly assumed untaught knowledge found in the changed material. I did not reread every word of lessons00–15; prerequisite checks focused on concepts used here.

## Evidence and limits

Scripts: `check16.cjs`, `check16-help.cjs`. Machine-readable configuration/order evidence: `16-evidence.json`. Screenshot prefixes: `16-375-light`, `16-375-dark`, `16-1280-light`, `16-1280-dark`. Help artifacts: `16-write-remainder-help.*`, `16-write-consumption-help.*`.

The first browser probe used an exact heading locator that omitted the heading's section label; it timed out during test navigation. The selector was corrected to the actual section, and the full four-configuration script then completed successfully. This was a probe issue, not an application finding. No build or test suite was run by this reader. Technical cross-checks used the recorded listings and test setup; no new hardware execution or standards audit was performed.
