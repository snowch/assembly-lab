# Returned-bit reference validation

The repository learning-design workflow was applied to this presentation change. A separate
GPT-6.1 Sol agent drafted the labels at Medium effort; independent learner/UX and technical
reviews used High and Extra High effort respectively. The reviews and drafting record are
beside this file. No human novice study or complete assistive-technology evaluation is claimed.

The existing subtraction strip remains the arithmetic result. The repeated read-only strip
uses the same computed word and serves as a local reference for the interpretation below it.
The dotted highest-bit mark has a matching labelled key, without arrows or new controls.
The old hex-only callout was replaced. The clear/set qualification, table and sums remain.

Checks before full CI:

- Strict TypeScript passed.
- Initial focused unit and canonical-copy run: 2 files, 14 tests passed.
- After the independent learner review's stale “appear once” finding was corrected by the
  drafting agent, the focused component, lesson and canonical-copy run passed 3 files,
  24 tests. The correction removes only the obsolete display count.
- Production build passed on committed source `a7bff2d`.
- Focused production-browser suites passed 70 tests on desktop and phone, including
  layouts at 360, 375, 416 and 1280 pixels, both themes, prediction gates, run/reset,
  restoration, unchanged paired listings and subsequent lesson exercises.
- A separate browser script checked 320, 375, 640 and 1280 pixels in both actual themes:
  both model-result strips match; the new strip marks only bit 31; it has no controls;
  labels, table and sums remain; no reference/page overflow or browser errors occurred;
  reload restores the reference and reset removes it. Evidence and screenshots are in
  `/workspace/scratch/returned-reference-browser.json` and adjacent images.
- Component cases compare both displays against the simulator for negative, positive and
  zero results, and check changed-input restoration, equal C types, differing results,
  fault results and opt-in behaviour. No simulator, C rule or recorded listing changed.

The final committed head will remain stable through the exact full `npm run check` and CI.
The pull request will record those complete results separately from these focused checks,
including any failures, skips or interrupted redundant local run, and identify the merged
and publicly deployed commit. Final-build verification will include the corrected intro.
