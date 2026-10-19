# Independent reader/checker: lesson 23, The same C on 32-bit Arm

Verdict: **accepted corrections verified; no actionable regression found in this review's scope.**

Read-only review of final production preview `http://localhost:4292/assembly-lab/#/lesson/same-c-on-a32`, 2026-10-18. Reviewer did not author the changes. Read CLAUDE, style and authoring requirements, then the lesson's prose, labels, structure, hints, feedback and recorded listings before consulting the audit summary/verification coverage plan. No author justification was used.

## Findings and correction checks

No new severity-rated finding.

- **N20, predict before running: fixed.** `same-c-on-a32.prose.ts:13` now says “Predict the result … After checking your prediction, run the A64 version in the stepper below.” In all four browser configurations, the initial investigation figure displayed “Check your prediction above first” and had no Next control. Checking the prediction unlocked the real A64 stepper. Its Next sequence executed the listing and Reset returned to the initial instruction. The revised instruction matches that order without weakening the prediction gate.
- **Immediate prerequisite: satisfied.** `from-c-to-instructions.prose.ts:11` defines “An immediate is a constant written in an instruction” before this lesson's explanation uses “16-bit immediate”. The learner is not asked to infer a new meaning from the service-marker listing.
- **Shared role guidance: fixed here.** Recorded listing pairs are Diagram, both question figures are Prediction, written-answer tasks are Exercise, and real simulator figures remain Stepped. The prediction no longer carries irrelevant instruction-step guidance. The static A32 record and executable A64 version remain explicitly distinguished.
- **Before-run register identity: fixed here.** “Registers before the run” is visibly present before and after checking the numerical prediction in all configurations. The unchanged input cards therefore no longer appear to be the output of the completed run.
- **Pairing and state visibility retained.** Real recorded output remains paired with C. In checked desktop views it is side by side; at phone width each C group is above its associated instructions. Stepping preserves related C/instruction highlighting and a readable current/next status beside the controls. No page-level horizontal overflow or page exception occurred in the exercised states.

## Prerequisites and assumed knowledge

The front page supplies small C functions, unsigned inputs, returns, conditionals, loops and arrays. I checked relevant earlier definitions rather than rereading all 23 previous lessons: constants-and-widths for register-width views, hexadecimal halves, movk, optional # and void; compare-and-choose for the C conditional expression and unsigned conditions; calls-and-returns for link register, leaf function, calling convention, stack and helper calls; from-c-to-instructions for immediate. These cover the knowledge needed here.

The lesson itself explains execution state, A32 register names, conditional instruction suffixes, the relevant return form, constant instructions, and why a helper call replaces division for this recorded target. Optional details explain the new A32 save/restore syntax and its stack alignment when examined. “Mnemonic” is locally anchored by the preceding instruction-name request and the explicit instruction-versus-register distinction; I found no blocking untaught term in this scope. The C conditional expression is already explained in compare-and-choose, so its use here is not a new prerequisite.

## Actual browser coverage and limits

Real Chromium through Playwright, fresh context at 375×900 and 1280×900 in light and dark. Theme stored as raw `assembly-lab:v1:theme` string and asserted against `html[data-theme]`.

For every configuration: initial prediction and gate; numerical prediction checked with an incorrect option; newly unlocked A64 limit stepped to completion then reset; A32 syntax prediction checked with an incorrect option; both answer tasks submitted empty to expose failure feedback; all five hints opened for each task; A64 average stepped to completion; A32 saved-register detail opened; paired listings inspected/captured. Prose, labels, tasks, hints and explanations were read from source and rendered text. Representative screenshots were visually inspected across all four configurations.

Not an exhaustive check of every input or saved-state restoration. I did not submit successful challenge solutions, independently execute A32, or rerun unit/browser suites; those are outside this one-lesson reader task. This verdict concerns clarity and the accepted corrections, not a new architecture certification.

Evidence: `23-evidence.json`; `23-{375,1280}-{light,dark}-{initial,gate,after-step,paired}.png`; reproduction script `check23.cjs`, all in this directory. Screenshots may contain the normal instructional output but this report does not disclose challenge solutions.
