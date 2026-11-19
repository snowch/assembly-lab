# Independent technical review

Copyright © 2026 Christopher Snow

Reviewed on 2026-11-19 by a session that did not author the implementation or catalog.
Scope: the brief, current diff, instruction catalog, machine parser and built course.

## Findings and corrections

1. **Medium, scope wording.** Under “All browser instructions”, the single-exercise context
   originally said “Allowed in: Write elapsed”. That could imply that the whole list was allowed.
   Smallest correction: make the context neutral and keep each unavailable entry's explicit warning.
   Accepted correction: “Exercise: Write elapsed”. Independently verified in the rebuilt drawer
   with All selected, at 375 and 1280 pixels in actual light and dark themes.

No remaining blocking technical finding was found in the reviewed scope.

The parent reported a phone focus restoration fault and a 42-pixel inner select target in its
first focused run. These were independently checked after correction: native select bounds are
44 × 44 pixels, and both Close and Escape restore the exact editor help button at both viewport
widths and in both themes. The reference closes its native modal before the shell focuses the
background trigger. The native theme selector still retains its existing storage and change logic.

## Source review

- Checked catalog families against `packages/machine/src/forms.ts` and `regs.ts`: matching widths,
  stack-pointer versus zero-register restrictions, add/sub magnitude bounds and negative aliases,
  logical immediate restrictions, shift and field bounds, memory sizes/offsets/writeback,
  address and branch ranges, and flags written versus retained.
- The catalog covers the actual `subsetMnemonics()` list. The examples and boundary tests check
  useful accept/reject cases rather than merely testing displayed strings.
- Official links reuse the existing checked form catalog. Other supported names link to the
  official Base Instructions index. The fallback URL returned HTTP 200 during this review.
- The drawer's filtering uses `allowedConstructs` for the selected/focused assembly exercise.
  “All browser instructions” changes lookup scope, not the assembler's allow-list. The provider
  sends only exercise IDs and optional instruction names; no submitted code, hints, expected
  answers or reference solutions enter the lookup request.
- `isWritten` reads the public grader kind to identify assembly editors; the UI does not inspect
  grader cases or solutions. Current lesson data is already available to the course renderer.
- The duplicate-diagnostic change suppresses a local copy only when the current diagnostic lines
  exactly equal the blocked verdict. Text/tap invalid-state indicators remain. Unrelated and
  changed blocked errors are covered separately. Platform code is unchanged.
- Calculator remains mounted under its original handoff scope. The shell makes reference and
  calculator open states mutually exclusive without resetting calculator values or lesson work.

## Independent functional checks

The final built site at `http://localhost:4173/assembly-lab/` was checked at 375 × 812 and
1280 × 812 in actual light and dark themes. Confirmed root `data-theme` in all four combinations.

- Filled the elapsed exercise with the reported invalid add immediate, ran tests and counted
  exactly one visible diagnostic containing the rejected immediate and allowed bound.
- Opened the exact `Syntax for add` button, checked drawer context, switched to All, and searched
  `b.eq`. The lookup returned `b.cond` only. The exact add entry appears before substring matches.
- Checked native theme select bounds of 44 × 44 in each combination.
- Checked both Close and Escape return focus to the exact opening editor button, including the
  phone modal. Opening focused Search instructions; the phone drawer uses native modal behaviour.
- Captured screenshots in `/tmp/reference-tech-375-light.png`,
  `/tmp/reference-tech-1280-light.png`, `/tmp/reference-tech-375-dark.png` and
  `/tmp/reference-tech-1280-dark.png`. Inspected phone and desktop rendering. No page horizontal
  overflow was observed in any combination.
- Earlier desktop dark checks also verified an entry can be opened manually, All scope is
  searchable and the phone drawer remains within the viewport.

Independent commands:

- `npx vitest run content/instruction-quick-reference.test.ts packages/views/src/AssemblyEditor.instruction-help.test.tsx`
  passed: 2 files, 98 tests. Output: `/tmp/reference-tech-unit.log`.
- `AL_TOOLS=/workspace/native-tools node --experimental-strip-types --disable-warning=ExperimentalWarning scripts/real-tools/check.mjs --corpus --only quick-reference-examples`
  passed: 1 program, 100 calls, 914 instruction states, zero differences. Output:
  `/tmp/reference-tech-native.log`.

## Initial attempts and limits

An initial review script tried to fill the second array exercise before its prerequisite gate
was passed and timed out. Inspection confirmed that only the first exercise's textarea was
mounted; the script's assumption was wrong. A second attempt overlapped a production rebuild
and timed out waiting for the theme control. Neither attempt established a production failure.
The later four-combination rerun above passed after the build finished. These unsuccessful
commands remain distinct from the passing rerun.

This review did not run the complete browser suite. It did not test a screen reader, Safari,
physical mobile browsers, offline service-worker update handoff, every arbitrary operand
combination, or actual learner understanding. The native corpus checks the displayed snippets
in supplied safe contexts; it does not establish all architecture overlap behaviours. Full-suite
and release/live verification results belong in the parent record. Functional checks and agent
review do not prove learning effectiveness.
