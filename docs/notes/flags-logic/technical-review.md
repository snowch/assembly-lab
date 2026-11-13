<!-- Copyright © 2026 Christopher Snow -->

# Independent technical review: optional flag logic

Reviewer did not draft the learner copy or implement the product. Read `AGENTS.md`, `CLAUDE.md`, `docs/style.md`, the checked brief, the new renderer/copy, the controller/markup/CSS diff, existing flag model/state and tests. Compared the adapted geometry with `/workspace/scratch/bitlab-reference/AluCircuit.tsx`, recorded in the brief at Bit Lab commit `659ec31dd8e52b8a067c6acbf15cce841f47f004`. No product edits made by this reviewer.

Final technical verdict: candidate 5 passes the affected built-site checks below. Accepted learner findings and follow-up geometry/label/cue findings are corrected. No remaining technical blocker. Historical failures and earlier pending verdicts remain recorded in their candidate sections.

## Technical conclusions

The renderer uses the selected comparison's existing four-bit `FlagsModel`. Inputs, retained bits, per-column incoming/outgoing carries, flag labels, XOR equation and accessible description all read that model. It rejects a 32-bit model. The only controller change renders this companion view when the comparison renders; no arithmetic, lesson-store schema, practice or grading code changed.

The four full adders have distinct A/B paths, a result output and the next-column carry connection. Bit 0's incoming carry reads the model's zero. The bit 2 carry-out wire joins the V input tap at x185; bit 3's carry-out joins the other tap at x70. The result paths feed the NOR's curved input edge, and the N junction joins bit 3's result path. Junction dots identify the flag taps; wire crossings without dots do not add connections. The XOR retains the source's extra input curve, with an explicit XOR label; the NOR has its inversion bubble and explicit NOR label. Every input/result bit, inter-column carry and flag output has a visible digit, so signal state does not depend on colour. Read-only cells have no button roles, tab stops or editing affordance.

The explanation of V is correct, including zero. At the top bit, write input sign bits as p/q and carries as i/o: `p + q + i = resultSign + 2o`. When both signs are zero, o is zero and the result sign is i; overflow therefore means i differs from o. When both signs are one, o is one and the result sign is i; overflow means i is zero. With opposite signs, o equals i and the signed sum fits. This proves both directions of the carry-XOR/sign-change equivalence. “Non-negative inputs” correctly includes zero; replacing it with “positive” would weaken the definition. NAND would be wrong for two clear top carries.

The qualification appears before the drawing: “The drawing explains the flag rules, not an Arm processor’s physical circuit. A processor may calculate carries differently.” The same paragraph identifies four-bit illustration versus the page's 32-bit Arm addition. No timing, ripple-adder implementation or physical Arm claim is made. FA, XOR and NOR are defined locally; N/sign-bit meaning and retained versus exact sums are introduced earlier on the same page. No new unexplained prerequisite was found.

## Built candidate 1, immutable port 4500

Automated Chromium review: `/tmp/flags-logic-technical-browser.mjs`; measurements `/tmp/flags-logic-technical-browser.json`; figure screenshots `/tmp/flags-logic-{width}-{theme}-{case}.png`.

All 32 combinations of widths 320/375/834/1280, actual light/dark themes and four comparison cases passed. Measured page backgrounds were `rgb(247, 250, 248)` and `rgb(16, 27, 26)`, rather than trusting the stored preference alone. Minimum rendered SVG text was 12.2px at 320px. No horizontal page overflow or horizontally clipped SVG labels. Figure screenshots inspected at 320 light, 834 light and 1280 dark. Bit-index glyphs extend slightly above the SVG rectangle, but `overflow: visible` and the caption gap keep them visible; the bottom output fits the drawing.

Verified the disclosure starts closed, opens/closes with Enter/Space and retains summary focus. Changing each comparison keeps it open and keeps keyboard focus on the selected example button. Reload restores the selected example; its newly opened circuit shows the restored inputs. Disclosure openness itself is native/transient and starts closed on reload. No extra focusable bit controls. SVG image has a title and a model-filled description naming inputs/result/carries/flags. No JavaScript errors.

Opening the diagram and changing cases did not change committed challenge data. Prediction explorer/column trace/follow-up results remained absent before their existing gates. Existing gate, restoration and reset behaviour is also covered by the separate regression command below.

Accepted presentation finding raised by the managing review: candidate 1's “C=1” was close to the duplicated carry-out digit. The smallest correction is the separate upward C tap and higher label already made in source. Mathematical values and branch identity do not need changing. Final built recheck is pending.

## Verification record

- Focused unit command: `npx vitest run packages/views/src/flags-lesson/logic.test.ts packages/views/src/flags-lesson/state.test.ts content/lessons/adding-and-the-flags.test.tsx content/lessons/adding-and-the-flags.facts.test.ts` exited 0: 4 files, 81 tests passed, no skips. The new exhaustive test covers all 256 input pairs, all four top-carry combinations, every displayed column/bit/carry/flag, independent signed-range/sign-change checks and accessible interpolation.
- Existing built flags regression: `npx playwright test flags-lesson.spec.ts --config /tmp/flags-logic-review-playwright.config.mjs`, against candidate 1 at port 4500, exited 0: 30 passed in 1.2 minutes, no failures or skips. Both projects exercise actual themes, prediction gates, arithmetic columns, practice submission/invalidation, migrations, reload/reset, shared navigation and hints. The command's only diagnostics were Node's existing `NO_COLOR`/`FORCE_COLOR` warnings.
- Full repository suite and CI are the managing session's separate record; no full-suite claim is made here.

## Independent learner-finding scepticism

Read the full independent `learner-review.md` after receiving its provisional findings. L1/L2/L3 were checked independently; all three survive scepticism:

- **Accepted: 320px readability.** Passing the 11px floor does not establish easy circuit tracing. At 320px the figure is only 244px wide; measured 12.2px labels and the compact carry/XOR branches make this a real presentation concern. A minimum 360px diagram in a contained horizontal scroll region is proportionate. It must keep page overflow at zero, make the horizontal movement discoverable, expose both diagram edges with keyboard scrolling and show focus. This trades an optional diagram's width for readable connections without enlarging the required lesson.
- **Accepted: V mechanism placement.** The user specifically asked why the top carries feed XOR. In candidate 1, the complete N/Z/C/V list separates the picture from that explanation on phones. Put V and its explanation beside the picture on desktop and directly after it on phones; the other flag rules can follow. This changes reading order rather than the mathematical claim.
- **Accepted: exact XOR input contact.** At x70 and x94 the gate body's curved input edge is y256.5124, while the separate XOR curve is y251.7124. Input wires ending at y254 cross the extra curve but stop 2.5124 units before the body. Stroke coverage almost bridges this for a set carry; a clear carry leaves about 0.46 SVG units uncovered. The inherited reference geometry has the same detail. Extending both input endpoints to y257 is the smallest robust correction. The existing output at y293.2 and wire starting y294 already overlap through their stroke widths.

L3 is the C-label correction recorded above. Reject the stronger assertion that the XOR appears entirely disconnected: the extra input curve is already crossed and screenshots read as XOR; exact body contact nevertheless deserves the small geometric correction. The learner's rejected concerns about NAND, independent experiment/state, required optional reading, dark-theme rendering and example continuity agree with the independent source/browser evidence above and should not return as findings. No unexplained gate prerequisite survives: the page says “FA means full adder” and defines XOR/NOR by their complete input/output conditions before asking the learner to reason with them. No prior OR-gate course is needed for those local definitions.

## Candidate 3 recheck, immutable port 4502

Source reinspection confirms the new 360px minimum diagram, contained named/focusable scroll region, V/why placement before N/Z/C, upper C tap, XOR endpoints at y257 and padded `viewBox="0 -8 480 482"`. No arithmetic, state, store or gate changes.

Focused unit command repeated after these edits: all 4 files / 81 tests passed, exit 0, no skips.

The existing-only flags Playwright command repeated against candidate 3 exited 0: 30 passed in 1.7 minutes, no failures/skips. This review's command is separate from the managing session's expanded candidate-3 run, which exited 1 with 30 passes and four new C-label-gap failures. The original failure is not replaced by the existing-only pass: the new text bounding-box assertion found that C at baseline 172 touched the carry digit's bounding box. The managing session's smallest correction moves C to baseline 160 and its upward tap to y170; final built verification is pending.

The expanded browser script `/tmp/flags-logic-technical-final.mjs` passed the 320/375/834 light/dark case combinations before discovering a remaining boundary issue at 1280 light: the 360px scroll region has `clientWidth=360`, `scrollWidth=360`, but the sideways-scroll cue is visible. The `max-width:359.99px` container threshold meets the rounded 360px boundary in Chromium. The smallest correction is an integer threshold below 360px. This is a direction mismatch, not lost diagram content; it remains a low presentation finding until the final build is checked.

The same pass confirmed at least 18px SVG labels, no page overflow, no vertical clipping/scrollbar, named keyboard-scrollable region with a 3px focus outline, V/why immediately after the diagram in stacked layouts and next to it at desktop, separated C label, and model identity/restore/gate continuity in the combinations already completed. Full final pass remains pending.

Candidate 4 at port 4503 independently confirms the cue correction: at 1280px the client and scroll widths are both 360 and cue display is `none`. Build ID `841b7e2a47365492ce1e7b54fdbaffe464217329ad9a0804bd31c396bcf5a004`. This is a focused correction check, not final certification; the C-label-gap correction is later.

Review-harness history: an initial final-candidate navigation attempt failed with `ERR_CONNECTION_REFUSED` before the server was started. A later first focus assertion incorrectly expected `:focus-visible` after pointer interaction plus programmatic focus; the harness was corrected to enter keyboard modality first. Neither attempt establishes a product failure. The scroll-cue assertion is the real built-site finding described above. The final script also checks responsive order from measured container geometry rather than assuming a viewport breakpoint.

## Final candidate 5 verification, immutable port 4504

Build ID `6f38aed81e5863aa5699419d47b2e0d5fac2060650571ec49533e4fc1fc34d31`. Final source inspection confirms C baseline 160/upward tap endpoint 170, XOR input endpoints 257, the padded viewBox and integer 359px scroll-cue threshold. No subsequent model/state/store/grading change was present.

`node /tmp/flags-logic-technical-final.mjs` exited 0. All 32 width/theme/example combinations passed; measurements `/tmp/flags-logic-technical-final.json`, figure screenshots `/tmp/flags-logic-final-{width}-{theme}-{case}.png`. Actual theme backgrounds match the earlier measured light/dark colours. Main labels are at least 18px. Every SVG text box is inside the padded SVG; minimum measured top clearance is 4px and bottom clearance 8px. C and its carry digit have at least 9px between their text bounding boxes. No page overflow or unintended vertical diagram scrollbar.

The diagram's scroll region is 244px/299px wide on 320px/375px phones with a 360px scroll width, and the cue is visible. At 834px it is 519px with no overflow; at 1280px it is exactly 360px with no overflow. The cue is hidden in both non-overflow cases and both themes. Keyboard focus has a 3px outline, arrow keys scroll the phone diagram, and both diagram ends remain available within the contained region. The viewBox padding fixes the index-clipping risk introduced by containment.

A separate final keyboard probe used only native Tab and repeated ArrowRight/ArrowLeft to reach both horizontal limits at 320px/375px in both themes: four states passed. It did not use Home/End or set `scrollLeft` to establish access. Measurements `/tmp/flags-logic-technical-scroll.json`; endpoint screenshots `/tmp/flags-logic-final-{width}-{theme}-{left|right}.png`.

V/why is the next block after the figure on phones/tablet, with N/Z/C after that explanation. At desktop V/why shares the figure's top edge in the adjacent column. The two signed-overflow directions and XOR definition remain intact. Visual inspection of final screenshots confirms separated C/bit labels and continuous XOR connections in both themes.

All four selections continue to agree with independently calculated input/result/column/flag values. The disclosure stays open on switching cases and focus stays on the activated control. Native Enter/Space operation, restored selection after reload, closed-on-reload disclosure, no editable circuit cells, accessible SVG description and unchanged unopened answer gates all pass. No page errors.

`node /tmp/flags-logic-technical-fonts.mjs` exited 0: an additional 32 stress states across Arial/DejaVu Sans, 320px/1280px, both themes and all examples. Minimum C/carry label gap remains 9px; all text boxes fit the drawing, with no page or vertical overflow. Measurements `/tmp/flags-logic-technical-fonts.json`.

This is a real Chromium/DOM/visual check, not a screen-reader or physical-device certification. No forced-colour or physical Arm implementation test was performed. Full repository checks, the managing session's expanded final regression run and exact-head CI are recorded separately by that session. They are not inferred from these focused passes.

## CI keyboard-harness follow-up at bb6f859

The managing session reported the original exact-head CI command failed: 1,477 browser tests passed, 21 skipped and the two phone/light+dark optional-logic tests failed when one ArrowLeft left the region at its 61px maximum. The same-head local full run had 1,479 browser passes / 21 skips; the unit suite had 3,474 passes. These are separate reported command results, not a replacement for the CI failure and not commands rerun by this reviewer.

The failing test first polls only for positive ArrowRight movement, directly assigns `scrollLeft=scrollWidth`, then immediately sends one ArrowLeft and expects a reduction. It does not first establish a settled keyboard-scrolling endpoint. This mixes the browser's asynchronous key-scroll state with a scripted jump.

Independent read-only reproduction against unchanged candidate 5: `/tmp/flags-scroll-race-review.mjs`, measurements `/tmp/flags-scroll-race-review.json`. In 24 paired mobile trials across 320/375, both themes, CPU rates 1×/4× and three repetitions, the original sequence failed once under 4× CPU at 375 light. First-right position was 40, scripted right endpoint 61, and the ArrowLeft position remained 61 after one second and after another second. Thus the CI symptom is reproducible outside CI. The same region subsequently reached both endpoints with repeated native keys; the pure-keyboard variant failed zero of 24 trials. This establishes a mixed-sequence timing/state problem in the harness. The exact internal Chromium animation mechanism is an inference, not directly instrumented.

The proposed source fix removes the scripted jump, explicitly asserts focus, issues repeated `region.press` calls and polls for the exact right limit before reversing and the exact zero limit afterwards. It tests stronger behaviour than the old single-key partial movement assertion: keyboard access to the complete circuit in both directions. No product edit is indicated by the evidence.

A browser-only negative control prevented arrow-key defaults on the region. The proposed eight-press/right-end assertion correctly rejected it (`max=61`, observed `scrollLeft=0`). This confirms the endpoint check still detects broken keyboard access rather than merely waiting through the old failure.

An additional independent run of the exact edited eight-key/50ms-delay sequence under 4× CPU exited 0: all 12 mobile states passed (320/375, light/dark, three repetitions), each reaching exactly the right limit and then zero with focus retained. Script `/tmp/flags-scroll-keyboard-final.mjs`, measurements `/tmp/flags-scroll-keyboard-final.json`. The proposed test fix passes independent review and retains meaningful endpoint coverage. Final source/product browser review above remains valid because this follow-up changes only the test harness; final focused/CI reruns of the amended commit remain the managing session's record.
