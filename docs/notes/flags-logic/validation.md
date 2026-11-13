# Optional flag logic implementation and verification

The optional disclosure in section 04 follows the existing selected four-bit comparison. Opening it does not create another experiment or reveal any later prediction/challenge answer. Changing the comparison updates the diagram from the same `FlagsModel` while preserving the disclosure and button focus. Reload restores the comparison and closes the optional disclosure. Grading, storage format and model arithmetic are unchanged.

## Source and copy

The connected full-adder, XOR and NOR geometry is adapted from Christopher Snow's [Bit Lab AluCircuit.tsx at 659ec31dd8e52b8a067c6acbf15cce841f47f004](https://github.com/snowch/bit-lab/blob/659ec31dd8e52b8a067c6acbf15cce841f47f004/apps/course/src/AluCircuit.tsx), as requested by the user. The author's copyright is retained; the repository licence is unchanged. This addition-only adaptation uses Assembly Lab's existing computed columns and flags. It imports no second ALU engine, iframe, editable input state or remote runtime dependency.

`strings.logic.ts` is the canonical, separately drafted copy for the new component. `strings.ts` uses its disclosure/link labels and `logic.ts` uses the same copy for its diagram, descriptions and explanation, so no second prose transcription can drift. The existing carrying-exercise and Bit Lab links are retained. The optional drawing is explicitly a four-bit teaching model, with a local qualification about actual Arm implementations and this lesson's 32-bit instruction.

The new V explanation connects the same-sign input/different-result-sign-bit overflow condition to unequal top carries. It covers both directions, including negative sums whose retained signed result is zero. XOR and NOR are defined in the disclosure. The user's NAND confusion is addressed directly in chat; the course introduces the two gates it actually draws.

## Review-driven revisions

The first immutable candidate's diagram shrank to approximately 12.2px signal labels at 320px, and its V intuition followed all four flag rules. Independent learner review identified those readability/placement faults. The revision keeps the diagram at least 360px wide inside a named, focusable horizontal scroll region, with 18px signal labels, and places V/why beside it on wide content or directly after it on narrow content. N/Z/C rules follow. Page-level overflow is not used to expose the drawing.

Independent technical geometry checks found the inherited XOR input wires ended slightly short of the body curve. Their endpoints now extend to the actual gate. The SVG viewBox has top/bottom room for complete text inside the scroll viewport. The C output has its own upward tap and clear label. A fractional container threshold showed a scroll cue at the rounded 360px fitting boundary; a whole-pixel threshold corrects that direction mismatch.

The parent expanded candidate-3 flags command exited 1: 30 existing cases passed and four new cases failed because the C label and carry digit's text bounding boxes touched. The final revision moves that label further up, retaining the positive-gap assertion. Independent final checks measure at least 9px separation. Earlier passes, that failed command and final reruns remain separate evidence. Review harness attempts before server readiness or before entering keyboard modality are identified in the independent reports, not treated as product failures or passes.

## Focused checks

- Exhaustive new unit coverage checks all 256 four-bit input pairs: every drawn column, bit, carry and flag agrees with the course model. An independent signed-range calculation and sign-bit condition both agree with the XOR/top-carry result, including all four carry combinations. Real-width models are rejected by this miniature renderer.
- Final focused unit/integration command: four files, 81 passed, exit 0. This covers the new renderer, existing state/gates, lesson rendering and recorded arithmetic facts. Strict TypeScript passes.
- Independent learner and technical final built checks use candidate 5 at port 4504, build `6f38aed81e5863aa5699419d47b2e0d5fac2060650571ec49533e4fc1fc34d31`. They cover closed/open, all comparisons, restore, keyboard scroll/focus, actual light/dark, phone/tablet/desktop and gate preservation. Technical checks also cover fallback fonts and wire geometry; see adjacent reports for exact scope and limits.

The final expanded flags browser command passes 34/34, exit 0, with no skips. It covers both desktop/phone projects and both themes, all selected examples at four widths, readable/contained signal labels, separate C/carry text, useful scroll directions, native keyboard opening/closing and scrolling, V placement, restore and gate preservation. The earlier failed command remains a separate result.

The full committed-source check, exact-head CI, merge and public deployment are pending at this focused-review stage. Their results will be recorded in the PR after they run. The focused immutable build predates the implementation commit and is not a final committed-source/full-suite verdict.

## CI keyboard-sequence correction

The first full local check on `bb6f859fc05a9d9040e8521a2864d8370fefb63a` passed, exit 0: 3,474 unit/integration tests and 1,479 browser passes, with 21 intentional skips. PR CI run 43449708734 instead failed the new phone keyboard test in both themes: after a single ArrowRight, a scripted jump to the right edge and an immediate ArrowLeft, the scroll position remained 61px. That failed run had 1,477 browser passes and 21 skips; it is not replaced by the local pass.

Independent CPU-throttled trials reproduced the original sequence's stuck reversal. The same region then reached both ends with normal repeated keys. The regression now focuses the region explicitly, uses only native key presses, waits for the right edge before reversing, then checks the exact left edge. This strengthens the assertion from partial movement to complete keyboard access and removes the mixed programmatic/native sequence. Product rendering, copy, calculation and state code are unchanged in this correction. Independent reproduction, final focused reruns and final-head full checks are recorded separately in the adjacent review and PR.

The exact revised test passed 20 repeated parent-run cases, exit 0 (both projects and themes, five repetitions). The independent technical reviewer passed 12 fresh mobile trials of the same eight-key/50ms sequence under four-times CPU throttling, and confirmed a blocked-keyboard negative control fails the new endpoint check. The managing session's six old-sequence probes did not reproduce the fault; the independent paired trials did. These focused results do not change the failed original CI conclusion.
