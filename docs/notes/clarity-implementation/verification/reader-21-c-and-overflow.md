# Independent reader/checker: lesson 21, C overflow and machine results

Verdict: accepted corrections verified; no remaining finding or clear introduced regression identified in the reviewed states. Read-only review of the final production app at http://localhost:4292/assembly-lab/#/lesson/c-and-overflow. No course edits.

## Independent reading and prerequisites

Read CLAUDE.md, docs/style.md, docs/authoring.md, the full lesson prose/labels/structure (including both five-rung hint ladders and the model note), and the rendered page before checking the audit summary and verification coverage plan. No author justification consulted. Relevant prerequisite checks used the front-page “Before you start” panel, earlier signed/unsigned and hexadecimal explanations, the comparison/condition lesson, shifts, and lessons 19–20 on compiler translation and its limited source-language model; did not reread every previous lesson end to end.

No unsupported prerequisite identified. The front page permits small functions, conditions, integer arguments and returns. Prior lessons introduce register widths, signed readings, flags, comparisons, compiler optimisation settings and stepping. This lesson explains the limits header and names, undefined behaviour, the wrapping compiler option, branch-preserving options, saturation and text parsing locally. The optional compiler details expand the precise language-version selection; the main mechanism does not depend on opening them. “Compiler contracts” is immediately explained through the extra guarantee in the following paragraph.

## Accepted fixes checked

- **Shared roles:** both prediction figures visibly say “PREDICTION”; the real instruction steppers retain “STEPPED”. Written tasks say “EXERCISE” and recorded listings say “DIAGRAM”. The prediction badges no longer offer the instruction-step disclosure. This resolves the original lesson21 finding.
- **Initial versus completed state:** both prediction cards visibly label their input registers “Registers before the run”, before and after checking. Outcome feedback names the run’s end. No implication that the unchanged input display is the final register state remains.
- **Gates:** both steppers are initially locked, unlock only after the corresponding prediction is checked, and advance one instruction on Next. The final recorded listing remains locked after running the incomplete starter, as required.
- **Hints:** opened all five rungs of both tasks. Each common-mistake rung describes an actual incorrect approach; each smaller-example rung gives a concrete input and consequence. The later rungs progress to partial and complete help. No rung-label mismatch found; no answers reproduced here.
- **Paired code:** initial and stepped figures retain the visible C/assembly relationship; related source and executed instruction are highlighted together in the sampled step. Desktop uses paired columns and phone uses stacked related groups. No reordered compiler output observed.

## Browser evidence and limits

Real Chromium through Playwright at 375×900 and 1280×900, each with light and dark theme. Set `assembly-lab:v1:theme` to the raw theme string and asserted the HTML `data-theme` value for every run.

In **each configuration**: loaded the initial lesson; verified both prediction gates; selected/check-tested an option in both predictions; verified the persistent visible initial-register label; advanced each newly unlocked stepper once; ran the unchanged starter for both exercises; opened all ten hints; verified the final listing remained gated; opened the optional text-parser explanation. No page errors or horizontal document overflow were recorded. Screenshots captured before/after predictions, stepped figures and expanded challenge feedback/hints. Visually examined representative screenshots across all four configurations.

Evidence directory: `/tmp/course-clarity-implementation/reviews/reader21-artifacts/`. `results.json` records themes, layout checks, visible roles, stepped states and interaction text. Representative visual evidence: `375-light-predict-machine-increment-after.png`, `375-dark-step-wrap-increment.png`, `1280-dark-predict-wrap-increment-before.png`. Exercise screenshots retain the actual expanded hint UI; this report deliberately does not reproduce challenge answers.

Limits: no successful challenge solution entered; no exhaustive arbitrary-input or saved-progress testing; no full-suite, build or new architecture/standard conformance test performed. The unchanged C-overflow argument was read for comprehension and consistency with the earlier course, rather than independently re-proved against every language-standard clause. These limits do not prevent checking the accepted shared-role and hint corrections assigned to this lesson.
