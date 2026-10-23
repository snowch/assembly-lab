# Independent check 14: Strings and the zero byte

Checked the final production site at `http://127.0.0.1:4322/assembly-lab/#/lesson/zero-terminated-strings` after the managing session's explicit browser GO. Review only: no application edits or build.

## Verdict and evidence

No new blocking finding in the bounded check. Both accepted reader findings are addressed.

- **Previous low severity prerequisite placement: closed.** “In the C loop, `break` exits the nearest enclosing loop” is visible in the opening prose before the first paired listing, with the optional boundary note closed. Verified in all four fresh contexts. The definition no longer requires discovering a disclosure.
- **Previous medium severity phone tracking burden: closed for the representative states checked.** The addressed byte grid is now compact: eight bytes occupy two rows at 375px, with the current read distinguished by a dashed border and a “Read by this instruction” legend. Other bytes share “Other bytes: not accessed”; repeated visible per-byte explanations are gone. At the first bounded load, the selected byte's address and value match the transfer's source and loaded register, while the counter remains visible in the register summaries. The phone controls-to-final-byte span is about 613px; the register summaries, full byte grid and controls can fit together in a 900px viewport when that region is brought into view. The transfer detail follows the grid and remains available. This removes the original repeated travel between controls and later memory rows. The full figure remains tall because it includes the paired source; that is not a new fault in this check.

Prediction remains locked after choosing an option and unlocks only after Check. Committing an incorrect choice also unlocks investigation. The first load identifies one addressed byte; the following zero-test instruction clears the current-read marking rather than claiming another read. Later bounded states advance through successive addresses. Back moved the checked state back one instruction; Reset restored step zero and removed load marking. The empty and no-zero-within-capacity examples both reached a normal return within the bounded exercise. The separate failure prediction retained its gate and its stepper ran representative load/count/branch states after commitment. No challenge answer is recorded here.

## Prerequisites and direction

Read all ten sections, labels, task requirements and lesson configuration, alongside the preceding array-address lesson, registry order and MemoryStepper/model-view source. The learner can reuse byte loads, register widths, zero and conditional branches, counted loops, indexed addressing, post-index pointer updates and empty-case checks from earlier lessons. `-O1` and GCC are introduced earlier in Meet the machine. The page defines ASCII, string, terminator and `break` locally. I found no additional unexplained prerequisite in this bounded pass. No further implementation direction is required by these observations.

## Browser coverage and limits

Four fresh, sequential contexts: 375×900 and 1280×900, each in actual light and dark themes. Body colours were respectively `rgb(243, 246, 245)` and `rgb(16, 22, 21)`. Checked initial state, selection before commit, committed prediction, twelve bounded instructions, Back, Reset, empty-string completion, bounded missing-terminator completion, failure commit and five failure instructions. No page horizontal overflow or browser page errors occurred. Visually inspected phone screenshots of the selected-byte grid and control/register region; screenshots were also captured in all four combinations. The grid retains readable addresses, values and read meaning in both themes.

Evidence: `/tmp/course-load-check/check14.mjs`, `check14.json`, `check14.log`, `check14-375-light.png`, corresponding dark/desktop captures, and the focused `check14-geometry.mjs` / `check14-cells.png`. The initial evidence script encountered a null transfer panel at a non-memory instruction; it was corrected to allow absent transfer panels and the complete four-context run then finished successfully. The focused geometry observation was at an actual load.

Did not submit challenge code, reveal hints/solutions, run external GCC, test restored progress, exhaust the normal/failure traces, or run automated suites. Full-suite results belong to the managing session. These observations are a bounded independent learner/checker review, not measured novice usability evidence.
