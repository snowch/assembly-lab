# Independent technical review: both counter directions

Copyright © 2026 Christopher Snow

The reviewer did not write the product implementation or copy. Reviewed the Arm counter helpers, interactive, strings and independent fixed subtraction pane; the RISC-V mathematical model, interactive and new native checker. This review establishes arithmetic/source/UI consistency. It does not establish novice learning effectiveness or physical-hardware behaviour.

## Arithmetic and instruction checks

- Arm `counterChange` selects the existing machine-backed four-bit ADD/SUB view. The low four result bits agree with unsigned arithmetic modulo 16. For subtraction of 1, `fourBitSubtraction` adds the four-bit negation `1111`; its carry out is 1 exactly when no borrow beyond the four stored positions is needed. The explorer therefore correctly displays `1 - work.addition.carryOut` as borrow needed.
- The displayed borrow is distinct from Arm's C. `subs` writes C = 1 for no unsigned borrow; ordinary `add` and `sub` leave NZCV unchanged. The visible architecture note states both the real instruction width and the no-borrow convention. No four-bit architectural register or C flag is claimed.
- An independent Arm Linux assembly program iterated all 16 starting values. For +1 it extracted bit 4 before masking to 15; for −1 it used actual `subs` followed by `cset ..., lo` to record the borrow. It emitted 64 bytes, two result/marker bytes per operation, using GNU assembler 2.42 and QEMU AArch64 10.0.13. All 32 operations matched the bundled product model and a separate integer oracle. The native zero-decrement pair is result 15 / borrow 1; the fifteen-increment pair is result 0 / carry 1.
- The reviewer bundled the current Arm model with esbuild, then ran ten complete turns in each direction: 320 total steps. Each direction returned to 13, and history never exceeded five readings.
- Independently reran `node tools/check-counter-wrap.js` in the RISC-V repository. It passed 32 actual xv6 comparisons and 32 independent QEMU comparisons, with no failures. Inspection confirmed that the separate native program writes all 64 data bytes and calculates carry/borrow through instructions rather than importing the model's arithmetic. RISC-V's lack of a carry/overflow flag is explicit in the visible note.
- The fixed Arm `counterWrap()` and `CounterSubtraction` worked pair remain independent of exploration state. Their model still supplies the earlier/later values. The updated introduction identifies that pair as its own worked example, so changing the explorer does not silently change the following arithmetic.

Temporary verification sources and outputs: `/workspace/work/bidirectional-counter-review/arm-counter.s`, `arm-counter.elf`, `arm-counter.bin`, `arm-model.mjs` and `arm-model.json`. The first model-bundle invocation used the RISC-V working directory and failed to resolve the Arm source; the corrected invocation from the Arm repository passed. That setup error is not counted as a successful check.

## State and storage

Reviewed both guards and migration paths. Current histories contain one to five integer readings in 0..15; adjacent pairs must be one modular +1 or −1 step. The last pair determines the actual last operation and its marker. A full turn does not make the state look like a fresh, unoperated counter. Each step stores only the new bounded history.

New state keys isolate this explorer. Arm old numeric ticks retain their previously clamped displayed progress and are not overwritten by rendering; RISC-V old ticks retain the former start 14 and its actual old trace. Reset establishes the new canonical reading 13. Corrupt current data resets the miniature rather than reviving stale legacy progress. Source inspection found no writes to lesson source, predictions, exercise outcomes or native CPU state. The parent's broader automated tests independently exercise those preservation flows; this reviewer did not claim to repeat all of them.

## Built browser checks

Independently checked both courses at 320, 390 and 1440 px in actual light and dark themes:12 contexts. Arm used `http://localhost:4282/assembly-lab/#/lesson/subtracting-and-the-tick-counter`; RISC-V used `http://localhost:4220/lessons/addition-wraps/`.

Each context followed +1 through 13, 14, 15, 0, then −1 to 15. It showed 0000 / carry 1 followed by 1111 / borrow 1. The next −1 correctly cleared borrow to 0. Sixteen further presses in each direction returned to the same reading, and the visible history stayed at five entries. Controls remained enabled and physically below the display. No page overflow or page errors occurred.

Actual rendered backgrounds were checked rather than inferred from selected preferences: Arm's opaque ancestor was `rgb(247, 250, 248)` / `rgb(16, 27, 26)`; RISC-V's panel was `rgb(255, 255, 255)` / `rgb(23, 41, 37)`. Comparing each button with its own baseline found 0 px movement at the carry-to-borrow boundary in all 12 contexts. Arm feedback retained 102 px at phone widths and 51 px at desktop; RISC-V retained 66 px and 44 px respectively. Screenshots and measured output are under `/workspace/work/bidirectional-counter-review/`.

## Findings and rechecks

### T1, low, closed: sparse in-memory histories bypassed the Arm guard

Original source used `readings.every(...)`. JavaScript skips sparse holes, so an unknown value such as `{readings: Array(1)}` passed the guard; cloning produced `[undefined]`, and the following view rejected it. JSON storage cannot produce sparse holes, so this was a defensive restore-API defect rather than an observed saved-work failure.

The implementation now validates `Array.from(readings).every(...)`. Independent final-model check confirmed that the sparse input returns canonical `{readings:[13]}`, while all 32 arithmetic comparisons and full-cycle checks remain correct.

### Rechecked width qualification

The ordinary decrement message now says “No borrow from beyond the stored bits is needed.” This correctly permits internal column borrows, such as binary `0010 − 0001`, while reporting no borrow out of the whole counter. The under-zero message identifies a group of 16 from the next position and the retained reading 15; it does not claim that the four-bit register stores a fifth bit or a negative unsigned reading.

### Rejected harness alarm: apparent phone control movement

An intermediate review script called Playwright `locator.screenshot()` before measuring the boundary state. Screenshot capture scrolled the whole card, producing an apparent 197 px movement at 320 px. The viewport shift exactly matched the change in page scroll, while document positions and feedback heights were unchanged. Moving measurement before screenshot capture removed the artefact. Final strict measurements showed 0 px movement for each button in all 12 contexts. No product change or relaxed tolerance was required for this alarm.

No open technical finding remains in the reviewed build.
