# Compact theme and instruction help

Copyright © 2026 Christopher Snow

## Checked facts and scope

- The header currently contains a labelled native theme selector with auto, light and dark values. Existing theme storage must remain intact.
- AssemblyEditor already assembles each edit against challenge.allowedConstructs and its introduced instruction list. ChallengeEditorProps includes the last verdict.
- The register parser accepts w0–w30/x0–x30, explicit zero and stack pointer names and documented aliases. Individual instruction forms restrict their use.
- The add/sub immediate form accepts 0–4095 or multiples of 4096 through 16773120. 4294966296 is not an encodable add immediate.
- The browser subset is available from subsetMnemonics(). Official form URLs already live in content/instruction-reference-catalog.ts.
- Platform ChallengeRunner renders blocked grader diagnostics. AssemblyEditor also renders the same assembly diagnostics, causing repetition after Run tests.
- platform/ must remain unchanged. Learner artifacts and prediction/hint gates must remain unchanged.

## Objective and prior knowledge

Help programmers find the browser-supported syntax and limits for an instruction without leaving their exercise. They know only the front-page prerequisites and the lessons before their current activity. Define reference notation and distinguish browser support from the complete Arm ISA. Default to the focused exercise's allowed instructions; make broader support an explicit choice. Never read or reveal solutions, expected answers or tests.

## Process and verification

Follow docs/style.md and the repository's separate draft and review requirements. Independent learner and technical reviews must check the built site. Verify phone and desktop, actual light and dark themes, keyboard/focus, overlay coordination, saved work, syntax examples and boundary errors. Record original failures separately from reruns. Functional checks do not establish learning effectiveness.
