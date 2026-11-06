# Comparison stage validation

Copyright © 2026 Christopher Snow

## Scope

The user requested distinct source, prediction and execution groups on Arithmetic on register bits.
Call-enabled ListingCompare now has three stable sibling groups with short headings, thin rules
and spacing. The model, recorded listings, source associations, arguments, typed readings,
persisted slots and results renderer remain unchanged. The call directions are a separately
authored Markdown field beside the call controls. A disabled call button makes the next stage
visible before commitment; both its handler and the model result computation retain the gate.
The default comparison branch retains its original structure and behaviour.

## Checks

Focused tests passed: 54 across four files, including canonical prose, lesson composition,
model facts and call-state tests. TypeScript and the production build passed.

The prior full check for the course-wide layout revision passed 184 unit files and all 3203
tests, then was stopped during the browser stage because the new separation changes superseded
that build. Its log remains separate in /workspace/scratch/readability-layout/final-full-check.log.
This interrupted run is not claimed as a complete passing check.

The first focused browser run used an incorrect new geometry assertion: it measured the 16px
space between section boxes, ignoring the next section's 16px padding and 1px border. The
corrected assertion measures from the preceding section's bottom to the following heading and
requires at least 32px. The independent browser review measured that visible separation as
33px. No product CSS or tolerance was changed to obtain a pass. Original traces are retained.

The same initial browser run also exposed a test-only relative-locator error: its group filter
looked for the outer figure inside each group and matched nothing. It now selects the three
scoped, labelled stage groups directly. The first run was stopped after 9 assertion failures,
30 passes, one interruption and 46 tests not run. Neither issue required a product change.

The default comparison and paired-source renderer regressions passed all 44 tests in two files.
The independent review passed 36 state/configuration checks on the frozen production build;
see [review](review.md) for prerequisites, technical checks, screenshots and scope limits.

The final focused browser run passed all 86 tests across desktop and phone projects, including
360/375/416/1280px comparison layouts in both themes, prediction and call gates, matching and
non-matching choices, reset/restoration, numbered backlinks and the earlier readings activities.
The fresh exact `npm run check` was then started for the combined change.
