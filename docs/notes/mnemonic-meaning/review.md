# Name-meaning implementation and review

## Final change

Add short bold expansions beside the existing instruction effects, using the existing Markdown and theme styles. Twelve prose sources serve sixteen published lessons. The constant-building introduction also explains the concrete rejected MOV constant and why another MOV loses the first part. No program, grader, challenge solution, compiler listing, machine behaviour or allowed-instruction set changes.

The earlier local LSL name genuinely introduces shift/logical-shift vocabulary. Move those vocabulary homes to the constants source and published Building a constant unit. The later shift lesson still teaches the general mechanism and newly introduces arithmetic shift. Standalone LSL permission remains at its original field lesson. Update the existing sequencing assertion to check that distinction; do not exempt the early name from the vocabulary rule.

The separate Medium drafting session supplied replacement pairs from the checked brief. The managing editor checked source accuracy, local scope, joins, whole published routes and both style passes. No new glossary, control, tooltip or diagram was needed.

## Separate reviews

- Initial High learning audit: source-only course inventory and definition/first-teaching placement, no copy authorship.
- Independent Extra High technical audit: official Arm DDI0602 entries plus existing model probes. Exact source URLs and the unchanged/rejected decisions are in audit.md.
- Fresh High reader per affected published lesson: prerequisite-qualified, one lesson only, actual phone/desktop and actual light/dark contexts. Findings and bounded interaction coverage are retained in the pull request's final review record. These are agent reviews, not a novice study or screen-reader validation.

The independent technical sweep checked all sixteen routes in 64 viewport/theme contexts, with 128 expanded-name assertions, actual themes and no document overflow or page errors. Representative screenshots were visually inspected; this is bounded browser evidence, not a full accessibility study.

The first completed readers found the local MOVK/LSL, flag-setting and conditional-select cues clear. The field reader checked that BFI's expansion remains behind its exercise gate in initial, failed, passed, cleared and restored states. A field heading referring to three results predates this change and is outside this name-meaning correction; it is recorded separately rather than changing the task's content.

## Validation record

- First focused unit invocation: 333 passed and 2 failed. Both failures were the real early shift/logical-shift vocabulary use; the vocabulary-home correction above resolves them. This original invocation remains a failed run.
- Full unit invocation after that correction: 188 files, 3,259 tests passed; no skips.
- TypeScript check and production build passed. The build retained its existing large-chunk advisory.
- Focused existing browser cases: 10 passed, 2 existing viewport-specific skips. They cover desktop typing, phone tapping, rejecting a second MOV, written/kept halves and the solution gate.
- Formatting and diff-whitespace checks passed for edited source.

A reader caught a change-induced placement regression: the pacing extraction still matched the old CBZ paragraph prefix. The selector now matches the instruction name; the existing branch-gate test checks the definition stays above the exercise and is removed from the task. Independent technical review accepted this as the smallest correction.

The pull request records required full CI results, exact merge/tree checks, Pages deployment and public verification when they complete. Do not infer those results from the focused checks above.
