# Validation record

Copyright © 2026 Christopher Snow

## Coverage and source fidelity

The course-wide content counts below describe commit `7838858`, before the subsequent comparison-stage UI change. That follow-up and its separately authored strings are recorded in [comparison-stage validation](../comparison-stages/validation.md).

Audited all 75 published lesson routes exactly once:27 early,22 middle,26 late; recorded change/no-change reasons. The exported final course has 52 changed lesson objects and 23 retained. The course plan was retained after review; Where next was reformatted. All 77 routes therefore have decisions.

Independent recursive baseline/final comparison found only 70 changed string leaves:65 prose,4 tasks,1 figure intro. Lesson/section/interactive counts and ordering, module positions, programs, original compiler references, checked sourceLines, model inputs, tests, hints, answers and gate identifiers are unchanged. Five interim native pacing-boundary issues were corrected and verified in the final exported objects, with regression assertions for complete lists, terminal guidance and command blocks.

## Focused and browser evidence

Author checks passed: early 120 prose/canonical and 424 facts/composition/link tests; middle 140 tests across 11 files; late focused passes of 102,60 and 36 tests plus tsc; ancillary 13 tests across 3 files. These sets overlap and are not summed. Initial stale assertion failures and fixes remain documented in the author inventories.

Independent source verification passed 106 tests in 2 files. Browser audit passed 308 rendered states (all 77 routes at 375/1280 widths in both actual themes), with zero reported geometry/theme/reference/Markdown/runtime issues. Sampled prediction/execute/reset/reload and disclosure interactions passed in all four combinations. Visually inspected 48 screenshots, including the primary type bullets and corrected native groups. Full state spaces, hardware tools and assistive technology were not exhaustively exercised; no novice learning study is claimed.

## Full-suite record

The first exact npm run check passed format, copyright, platform integrity and types, then its unit stage passed 3200 tests and timed out in 3 of 3203 tests (181 files passed,3 failed). The unchanged component/interaction tests ran concurrently with the large browser review. Two affected files were rerun serially without that browser load:72 tests passed. The remaining reader file and a fresh exact check were then started with unchanged timeout/layout thresholds; their results are separate from the original failed run. No timeout or assertion tolerance was increased. Fresh CI remains the merge gate.

The third affected file passed all 32 tests in its focused serial rerun. The original full-run timeouts remain recorded above; no component or test code was changed to obtain these focused passes.

The fresh exact-check run passed all 184 unit/integration files and all 3203 tests, built successfully, and proceeded to its full educational browser suite. Fresh CI on the final commit remains the merge gate; this success does not alter the earlier timeout run.

The local browser continuation of that successful unit/build run was stopped when the user requested comparison-stage separation. A fresh exact check covers the combined final change; its result is recorded with the comparison-stage validation. No complete browser pass is claimed for the interrupted run.
