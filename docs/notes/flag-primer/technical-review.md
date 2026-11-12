# Four-bit flag primer: independent technical review

Reviewed 12 November 2026 in `/workspace/assembly-lab-mov-width`, against the built lesson at `http://localhost:4382/assembly-lab/#/lesson/adding-and-the-flags`. This reviewer did not author or edit production code. Repository instructions, `docs/authoring.md`, `docs/style.md`, `docs/sources.md` and the relevant visual guidance were read. The managing session records this separate reviewer's configuration as GPT-6.1 Sol, extra-high effort, fresh context (`fork_turns: none`).

## Verdict and findings

The final reviewed implementation has no observed arithmetic, flag semantics, answer-gate, persistence or layout defect. The miniature is correctly identified as a teaching calculation and does not claim to execute a four-bit Arm instruction. Browser checks passed at desktop and phone widths in both actual rendered themes.

1. **Medium, corrected and independently verified: required numerical-provenance check needed the new four-bit bounds.** `content/lessons/adding-and-the-flags.facts.test.ts:478` failed because its approved decimal-number map lacked 15 and 7 from the new, correct prose “The unsigned range is 0 to 15; the signed range is −8 to 7.” The command running the primer, existing lesson facts and prose tests exited 1: 78 tests passed, one failed. This was a required-check regression, not an incorrect learner-facing bound. Direction: add the bounds with provenance and assert them against the four-bit reading model, preserving the existing check. The managing agent added the provenance entries and model assertions for `0111` signed 7, `1000` signed −8 and `1111` unsigned 15. This reviewer read those changes and independently reran the exact failed command: all three files and 79 tests passed, exit 0.

2. **Low, corrected: exact practice facts were not pinned.** The original focus test checked the five NZCV strings, while feedback stated the specific inputs and sums. A different pair with the same flags could have disagreed with that static feedback. Direction: pin the chosen practice inputs, signed operands/sum, unsigned sum and retained readings. The managing agent added `pins the numerical facts used by the practice feedback` in `packages/views/src/flag-primer.test.ts:37`; this reviewer read it and confirmed it passed in the focused run. It fixes this guard gap without changing production behaviour.

The managing agent also reported a native form-reset versus controlled-radio race in an earlier build. This reviewer did not independently reproduce that original failure. The final `onReset` calls `preventDefault()`. The final build independently passed Clear after restored correct answers, immediate DOM/store checks and a second reload in all four browser configurations.

## Arithmetic and architecture evidence

The official source artifacts already retrieved into `/workspace/scratch/nzcv-mock` were read directly:

- Arm DDI0602, 2025-12, ADDS shifted-register operation: `AddWithCarry{datasize}` receives carry-in zero and its NZCV result is assigned to `PSTATE.[N,Z,C,V]`. Its operand width is `32 << UInt(sf)`.
- Arm DDI0602, 2025-12, ADD shifted-register operation: the arithmetic result is written, but the returned flags are discarded.
- Arm DDI0602, 2025-12, `shared/functions/integer/AddWithCarry`: N is the retained top bit, Z tests all retained bits, C reports failure of the retained unsigned reading to equal the exact unsigned sum, and V reports failure of the retained signed reading to equal the exact signed sum.
- Arm DDI0601, 2025-12, NZCV register: N/Z/C/V appear at bits 31/30/29/28, supporting the conventional order.

Artifact request URLs are recorded in `sceptic-arm-requests.json`. SHA-256 of the reviewed HTML:

| Artifact | SHA-256 |
| --- | --- |
| `sceptic-arm-adds.html` | `6508622bdfcb00f864a153de97816c3ee84d74443d83bd5b9ac3fe81ee883003` |
| `sceptic-arm-add.html` | `0a212de88497d31521d51c41f01d71f27ae57b499e63e626b0ae3672c950b030` |
| `sceptic-arm-integer.html` | `5f38bd31c530e116ca2a3c8ad7f1f31232e448f22b10ff2f4cdd0230a94e81fe` |
| `sceptic-arm-nzcv.html` | `58c5436b893a007b353d96218f70cba4dfaaf226743ed79870ef8cba23ef92b0` |

These are source-content checks, not a fresh fetch or a physical-hardware experiment. `docs/sources.md` and the existing module-2 NZCV source record were also read. The review did not introduce a new compiler or C claim.

`fourBitFlags` obtains actual ADD arithmetic columns from `fourBitAddition`, then derives *teaching-width* NZCV from column 3 and the low four result bits. It never substitutes the machine's actual 32-bit flags. An independent script checked every one of the 256 ordered pairs against elementary modulo-16 arithmetic and signed bounds, including every column's inputs, carry-in, total, kept bit and carry-out. It also checked operand and retained signed readings independently. The 256 checks include zero obtained by wrapping, both signed boundaries, positive overflow, negative overflow, mixed-sign inputs and all four C/V combinations.

| Focus | Four-bit input patterns | Retained pattern | Exact unsigned sum | Exact signed sum | Teaching NZCV |
| --- | --- | --- | --- | --- | --- |
| N | `1000 + 0001` | `1001` | 9 | −7 | `1000` |
| Z | `0000 + 0000` | `0000` | 0 | 0 | `0100` |
| C | `1111 + 0010` | `0001` | 17 | 1 | `0010` |
| V | `0111 + 0001` | `1000` | 8 | 8 | `1001` |
| Fresh practice | `1000 + 1001` | `0001` | 17 | −15 | `0011` |

All rendered retained readings, C/V range claims and practice feedback agree with these facts. In particular, N describes the retained signed reading; it does not decide whether the exact signed sum fitted. The practice correctly demonstrates negative signed overflow with N clear. The zero example is correct under both readings. The 32-bit bridge correctly changes the top bit from 3 to 31, unsigned maximum to 4294967295 and signed bounds to −2147483648 and 2147483647.

The independent script separately ran actual 32-bit ADD and ADDS on all five miniature input pairs. Actual 32-bit ADDS leaves `0000` for every nonzero pair and `0100` for zero plus zero; these differ from the teaching flags where expected. Actual ADD preserves its previous flags. This confirms that the component's teaching qualification is substantive.

Invalid four-bit operands were also checked in both positions: negative, 16, fractional, NaN and infinity all reject.

Independent executable evidence: `flag-primer-technical-model.mjs` and `flag-primer-technical-model.json` beside this report.

## Corpus and focused checks

All five named input pairs are present as real 32-bit `calculate_add` calls in `scripts/real-tools/corpus/module1-four-bit.json`; the existing two-instruction source matches the implementation's ADD/RET calculation body. The new unit guard also checks corpus inclusion.

Executed GNU/QEMU comparisons:

| Command scope | Result |
| --- | --- |
| Initial `--corpus --only module1-four-bit -v`, ordinary PATH | Exit 2: `aarch64-linux-gnu-as` unavailable on PATH. This initial command did not pass. |
| Same scope with `AL_TOOLS=/workspace/scratch/arm-tools` | Exit 0: one program, 12 calls, 36 instruction states, zero differences. |
| `--corpus --only module2-flags -v` with the same tools | Exit 0: one program, 16 calls, 52 instruction states, zero differences. |

The real-tool comparison validates the underlying supported 32-bit programs. It does not purport to execute invented four-bit processor flags in QEMU. All 256 miniature additions were exhaustively checked mathematically; only the recorded corpus calls were run through GNU/QEMU.

Focused Vitest history is preserved separately:

- Initial primer plus canonical-prose run: two files, 35 tests passed, exit 0, before the two later guards were added.
- Primer plus existing lesson-facts plus canonical-prose run: 78 passed, one failed, exit 1. The failure is finding 1 above; the new exact practice-facts guard passed.
- After the two test-only corrections, independently reran the exact failed command, `npx vitest run packages/views/src/flag-primer.test.ts content/lessons/adding-and-the-flags.facts.test.ts content/lessons/module-2.prose.test.ts`: all three files and 79 tests passed, exit 0. Output is preserved in `flag-primer-technical-final-vitest.log`. This rerun does not change the previous command's exit status. There were no subsequent production changes requiring repeat browser checks.

This reviewer did not run or claim the full `npm run check` suite. The managing agent owns that separate result.

## Final-build browser checks

Automated Chromium interaction used fresh storage, service workers blocked, viewports 1280×900 and 375×812, and the actual theme select. All four combinations passed the independent script `flag-primer-technical-browser.mjs`; results and 24 screenshots are listed in `flag-primer-technical-browser.json`. Screenshots were also opened and visually inspected: desktop/light examples, desktop/dark correct feedback, phone/light examples and phone/dark correct feedback.

Actual rendered colours were checked separately in `flag-primer-technical-theme.json`: light body background/text `rgb(243, 246, 245)` / `rgb(16, 26, 24)`; dark `rgb(16, 22, 21)` / `rgb(232, 238, 237)`. The screenshots visibly agree. The main browser log's transparent root background is an HTML-element measurement, not the page surface; the separate body measurements establish the rendered colours.

Checked in every configuration:

- All four example cards' operand bits, result bits and NZCV values; readable bit positions, input/result labels and signed/unsigned equations.
- Fresh practice: no selected answer or feedback. Incomplete submission gives the specific instruction to choose all four bits.
- Incorrect attempt: choices stay visible, all four computed flags and the explanation appear. Reload restores the incorrect answers and recomputes their verdict.
- Changing a choice hides feedback; reloading this unsubmitted edited state keeps feedback hidden. Corrected submission and reload restore the correct verdict.
- Clear after reload removes all checked radio buttons and feedback, removes the saved slot, and remains clear after another reload.
- Seven malformed/forged restored-state variants: null, string, invalid choice, numeric choices, nonboolean submitted marker, forged `correct:true` on wrong choices and forged `correct:false` on right choices. Correctness is derived from choices, never the saved correctness property. Incomplete/invalid choices cannot show completed feedback.
- Completing or clearing the miniature never opens either Arm calculation. Checking an incorrect main 32-bit prediction does open its adder, preserving the original any-checked-prediction rule. Show all and Reset work on that adder.
- Wrong 32-bit flag-challenge work keeps the follow-up and its explanatory note closed. Passing work opens both. Reload regrades the saved work. Corrupting one answer closes the follow-up even with a saved `firstPassedAt` marker.
- No page horizontal overflow at the captured initial, wrong-feedback, correct-feedback, opened-adder or follow-up states. New radio label targets measure 100.25×44 pixels on desktop and 63.25×44 pixels on phone. Minimum new-primer text size measured 12 pixels.
- No console errors or uncaught page errors.

## Answer disclosure and scope limits

The practice explicitly supplies its result bits, so N/Z can be read directly as intended. Its computed flags, exact sums, range verdicts and full explanation first appear after a complete submission. The worked examples use distinct inputs. The initial 32-bit prediction does not show its computed result. The follow-up note containing the three challenge additions' values remains inside the passed-challenge gate, and was absent on initial, failed and corrupted-restoration states. No unintended learner-visible answer disclosure was found.

Read only in source: term/caption prose, shared flag-row implementation, generic schema/persistence code, the flags grader and source/corpus associations. Browser checks covered actual flag values and gating for the first lesson, not every later lesson or hint-ladder state.

Untested here: physical Arm hardware, Firefox/Safari, assistive-technology screen-reader output, persistent storage denial/quota errors, multi-tab synchronisation, every viewport width, and learning outcomes with a beginner. No claim about those is implied by the passing technical checks.
