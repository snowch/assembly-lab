# Check 22: Conversions and checked arithmetic

Independent learner/checker pass, 23 October 2026. Reviewed the final built preview at `http://localhost:4322/assembly-lab/#/lesson/checked-arithmetic` (footer commit `edc67a4`), without app edits or rebuilding. Read AGENTS.md/CLAUDE.md, all ten lesson sections, source data/prose/labels, the earlier load review, relevant prerequisite prose, and the memory/prediction model-backed views.

## Verdict

The accepted phone tracking problem is materially corrected in the checked states. No remaining medium/high finding or new prerequisite blocker was found. The checked-add exercise now follows its contract explanation and short generalisation directly; formatting and sanitizer material is in the initially closed reflection detail after the attempt.

## Built-site evidence

Four fresh Chromium contexts: 375 × 900 and 1280 × 900, each in actual light and dark themes. `html[data-theme]` and computed `--bg` confirmed light `#f3f6f5` and dark `#101615`; initial document width did not exceed the viewport. Independently inspected all four post-store screenshots.

- All four dependent figures begin locked. Committing the first prediction unlocks the three conversion steppers; committing the wrong-flag prediction unlocks its memory stepper. Incorrect choices also unlock inspection. The first conversion and investigation steppers were advanced once to check their model-derived state.
- After the wrong-flag example's store, controls, current/next instruction, three compact register summaries, NZCV and the two rows of four addressed bytes remain legible. The common legend reads “Written by this instruction” and “Other bytes: not accessed”; repeated per-byte role sentences are visually hidden, with explicit accessible byte roles retained. The destination cells are marked as stored; the four neighbouring cells are unmarked and retain their values.
- Exact post-store evidence: destination `0x410000` through `0x410003` contains `00 00 00 80`; neighbours `0x410004` through `0x410007` remain `11 22 33 44`. Flags show N=1, Z=0, C=0, V=1. These are the wrong-flag demonstration's observations, not a challenge solution. The visible transfer sentence identifies a four-byte write from `w0` at `0x410000`.
- The whole post-store figure measured 1087.70px on phone and 953.64px on desktop. Against the earlier review's approximately 1725px phone figure, the compact byte grid removes substantial avoidable scrolling. A short register-to-memory correspondence remains below it, but the actual neighbour evidence is already together with the flags and controls; no need to scroll to that duplicate correspondence to judge preservation.
- Back returns the memory stepper from k=2 to k=1. Reset returns it to k=0, restoring the initial destination bytes `aa bb cc dd`, the four unchanged neighbours, initial registers and flags.
- The unmodified final challenge starter was run once per context, then only its first hint was opened. Feedback reports the failed checks; the hint says “The result has two parts: stored sum bits and a boolean report.” No solution was submitted and no later hint was opened.
- “Answer, formatting and run-time checks” starts closed and opens on request. The ordinary page before the exercise contains no formatting contract or sanitizer walkthrough.

## Task focus, definitions and prerequisites

The final task explicitly distinguishes signed inputs, a four-byte destination, low 32 stored bits, the separate 1/0 report, unchanged following bytes, and storing before replacing the result register. The explanation states both status meanings, including false/0 when the result fits exactly. Promotion's worked case states that arithmetic takes place in `int` and does not overflow. These local qualifications preserve the distinction between narrow storage, arithmetic width and returned status.

No new claim that pointers or flags are untaught is warranted. `memory-and-addresses.prose.ts` introduces a pointer as an address, the `w`/`x` distinction, four-byte stores and following-byte preservation. `adding-and-the-flags.prose.ts` teaches carry versus signed overflow; `compare-and-choose.prose.ts` explains `cset`. `loading-widths` supplies casts and extension, and `c-and-overflow` supplies `INT_MAX`, `#include`, the target and C23/compiler-setting context. Integer promotion, `_Bool`, the checked-add destination/status contract, `printf` and sanitizer are explained locally. The source model derives memory transfers from instruction access records, not scripted byte animation.

## Residual observations and limits

No additional fix requested. The retained transfer correspondence is a possible low-priority simplification, not evidence that the previous medium tracking problem survives: the essential destination/neighbour comparison now occupies two compact rows.

Artifacts: `/tmp/check-22/run.mjs`, four context JSON logs and `*-store.png` screenshots; a follow-up script is also in that directory. Browser checks covered initial, committed, first-step, post-store, Back, Reset, minimal failed attempt/first hint, and the reflection disclosure. Source/prerequisite checks were read-only. Did not submit a valid challenge answer, exercise later hints, test alternate inputs, restored work, keyboard/screen-reader use, external links or compiler calls. A follow-up intended to extend stepping to return timed out waiting for the initial prediction input; returned-state coverage is therefore not claimed. No full suite or differential suite was run; this is a bounded final-build learner/checker pass, not a claim of exhaustive correctness or measured learning performance.
