# Independent technical sceptic review

Copyright © 2026 Christopher Snow

Independent reviewer, separate from copy and component authors. Applied `AGENTS.md`, `CLAUDE.md`, `docs/authoring.md`, `docs/style.md`, the visual-language rules and `.agents/skills/learning-design/SKILL.md`. This is technical and agent review, not a novice study.

## Source review

Read the changed copy, lesson composition, `ListingCompare`, its call tests, and all three audit tables against `scratch/reminder-links/lessons-final.json`. The tables contain exactly 75 unique published routes: 27, 22 and 26, with no omission or extra route. The decisions justify retained local teaching as well as additions. Checked the target explanations, not only route existence: state propagation, bit weights and the 32-bit bridge, whole/partial replacement, w/x aliases, carry and overflow, masks, shift fill, condition selection, initial loop tests, extension, widening, product halves, quotient, saved values and native build/capture provenance are covered by their targets. Added prerequisite routes precede their uses. Existing forward references are unchanged. Required explanations and exercise directions remain local; additions do not remove controls or prediction gates.

The returned word comes from `traceOf` and `wValue`, not a copy constant. Its lower contribution is word modulo 2^31 and its top bit is floor(word / 2^31). The signed sum subtracts top × 2^31; the unsigned sum adds it. For the actual 3,5 call the model word is 0xfffffffe: 2147483646 − 2147483648 = −2 and 2147483646 + 2147483648 = 4294967294. The tests also use 8,2 and restored 7,2, so the top-zero path and changed-input recomputation are covered. Results and explanation share the call gate; reset removes both and retaining only the action in storage recomputes from current inputs. The opt-in avoids adding the explanation to unrelated comparisons.

The local C bounds distinguish a valid negative signed result from signed overflow and unsigned wrapping. Both parameter and return types are visible. “Each function’s return type tells you which reading gives its C return value” is a reading statement, not a claim that return type alone determines expression arithmetic; nearby text names parameter types and explicitly denies a register type tag. No new claim treats changing a reading as instruction execution.

## Findings and challenge of independent review

No blocking technical finding. The independent review’s no-blocker conclusion survives these checks. Reject requiring another complete subtraction walkthrough: the earlier four-bit arithmetic already teaches that mechanism and the new calculation supplies the actual 32-bit reading bridge. Reject requiring links on every route or rejecting pre-existing forward references: neither follows the prerequisite audit brief. No evidence establishes novice learning effectiveness.

Minor navigation wording: the added native startup reminder labels `calls-and-returns` “Calls and returns”, while the published title is “Saving a return address”. The destination and concept were correct. The managing session corrected the label to “Saving a return address” in both `pacing-10-a.copy.ts` and its canonical JSON record; independently verified in source. This resolves the finding. It does not affect the worked-result component checked in the browser.

## Built-site check

Checked final preview at port 4341, build `fab13872fa93a6b020488475940ee025c0d77be28b2517112e81391ca4ff944d`, in Chromium at 375 × 812. Both actual light and dark rendering were confirmed from computed body colours (light rgb(243,246,245), dark rgb(16,22,21)). After committing the prediction and calling both functions, both computed equations and local unsigned explanation appeared. The explanation occupied x=29..346; document width was 375 and no explanation descendant extended beyond the viewport. Reset calls removed the worked explanation in both themes. Screenshots: `scratch/reminder-links/technical-phone-light.png` and `technical-phone-dark.png`.

This reviewer checked phone rendering; desktop and wider reminder-page browser coverage belong to the separate learner reviewer. Source review covers all 75 decisions. No assistive-technology or novice study was performed. Full-suite results belong to the managing session; no independent full-suite run is claimed here.

## Follow-up test expectation review

Independently inspected the full-suite stale expectation correction in `one-pattern-three-readings.test.tsx`. Its only change adds `workedReadings: true` to the existing strict `toEqual` expectation, matching the reviewed lesson configuration in `pacing-1-4.ts`. It retains exact argument values, both C reading types, lesson order, term introductions, challenge placement and activity identity assertions; it also now pins the intended opt-in. No assertion was removed or weakened and no product code changed. The managing session owns the rerun result.
