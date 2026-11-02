# Verification

The implementation uses the supplied mock's compact bit grid and contribution calculation. The initial reading starts with only bit 0 set. Readings remain discoverable, with local directions and independent prediction commitment.

## Initial findings and exact outcomes

- Separate Medium draft; High UI implementation; root content/browser-test integration. Independent High learner and Extra High technical/sceptic reviewers use actual rendered phone/desktop and light/dark states.
- First focused UI command: five passed, three failed due ambiguous duplicate text queries; narrowed selectors without changing behavior. Rerun UI/handoff/canonical: 17 passed. Marker/sign follow-up: eight component tests passed. Later preset/navigation changes: 19 focused tests passed.
- Root content-focused run: 44 passed, one failed because the expected set of literal hexadecimal values still included the removed all-ones introductory value. Removed that stale inventory entry; model arithmetic assertions remain.
- First browser selection intentionally interrupted to fix measured problems: exit 130; one passed, three failed, one interrupted, 125 not run. Missing positive sign, 1px document overflow at 320 and 4px panel overflow at 390 were observed. The interrupted test awaited the absent top-bit marker. Restored the marker, explicit signs and corrected the scoped numeric layout; no tolerance was relaxed.
- Independent review found missing onward directions, an early prediction entry before its prerequisites, and a top-bit preset that silently reset the selected reading. Added local directions, moved the still-visible prediction entry after exploration and made both bit presets preserve the chosen reading. Only Reset restores Unsigned.
- Technical review's first focused run passed 73 tests across seven files. It also found numeric-cell overflow in a 320px all-ones Compare case even when the whole page did not overflow. UI measurements include that case; final rendered review checks it separately.

Final build, browser reruns, full local/CI and deployment outcomes will be recorded in the pull request. Interrupted runs are not counted as full passes. Independent notes record what was checked in a browser and what was read/tested only in source.

## Second browser selection

The 130-case focused browser rerun exited 1: 126 passed and four failed. Three phone failures found the appendix link was only 23px tall. The desktop all-ones case lost a click on bit 30: focus changed conditional guidance above the grid and moved the target before mouseup. This is a product interaction defect, not a test timing problem. The correction moves that conditional guidance below the grid and gives the appendix link a 44px minimum tap target. The full-sum arithmetic and wrapping themselves did not fail.

The corrected targeted browser run exited 0: all 18 cases passed (desktop/phone, light/dark, 320/390/1280px numeric-cell checks and the previously failing used/full-sum cases). The follow-up component/handoff/canonical run passed all 19 cases. Build 4 passed.
