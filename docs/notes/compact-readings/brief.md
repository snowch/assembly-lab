# Compact reading figure

The user supplied a mobile HTML mock and accepted the recommendation to use its compact grid and top-bit/remaining-bits/total display, with unsigned-only introduction, visible bit numbers, no overflowing cards, and prediction results withheld until an answer.

## Checked facts and implementation scope

- `packages/views/src/readings.ts`: `readingsOfPattern` runs the model; `topBitTable` obtains top-bit and lower-bit contributions from model states; `bitWeightsOfPattern` keeps weights independent of whether a bit is set.
- Unsigned bit n has weight 2^n. Signed two's complement changes only bit 31's weight. A clear bit contributes zero, not a negative or positive amount. Source: existing checked C23 representation claims in docs/sources.md and the two's-complement appendix.
- Start this teaching reader with only bit 0 set (value 1), using its existing recorded program with a model call producing 1. Keep the hexadecimal activity and legacy scratch reader independent.
- Keep Unsigned, Signed, Compare discoverable. Offer an explicitly named preset for only bit 31, initially in Unsigned; changing reading alone must preserve bits.
- Use compact numbered bit controls. Replace the large horizontal weight strip with one selected-bit weight/contribution display. Show only the selected reading until Compare. Distinguish a bit's weight from its contribution when clear.
- The main calculation is top-bit contribution + other bits' contribution = total. Full sums remain optional and follow the selected reading. Group large decimal numbers. Keep values and labels contained at 320, 375, 390 and desktop widths in both themes.
- Add a focused prediction using fixed starting bits: only bit 31 set, bit 0 clear. Ask which reading changes when bit 0 is set. Compute the after state and verdict from the model. Do not render the after sums, answer-revealing hint, or feedback until a choice. The explorer must not accidentally display the answer while the prediction is pending. The prediction is a named, visible entry; no completion-gated hidden activities.
- Reset returns to unsigned with only bit 0 set; clearing bits does not change the reading. Check handoff/restoration for any added state.

## Prior knowledge and writing

The learner has completed Fundamentals and Reading hexadecimal and knows binary place values, bits, set/clear, w0 and 32-bit patterns. Signed representation is introduced here. Follow docs/style.md, docs/visual-language.md and CLAUDE.md. Keep the first explanation unsigned-only. Introduce negative top weight and the name two's complement beside Signed; comparisons belong beside Compare. Keep the appendix link local to signed/compare. Avoid adding long instructional prose, duplicated numbers, task counters, or unnecessary headings.

## Process

Separate draft (GPT-6.1 Medium), implementation (GPT-6.1 High), independent learner review (High) and technical/sceptic review (Extra High), following docs/authoring.md. Root integrates lesson data and tests, runs required checks, then merges after green and verifies deployment. Keep original failing run statuses separate from passing reruns.

## Independent review amendments

- Preserve the chosen reading for both named bit presets. The initial reading is already Unsigned; only Reset restores that mode. This avoids changing an unrelated control during later Signed/Compare exploration.
- Add local directions from top-bit inspection to Signed and then Compare; place the always-visible prediction entry after exploration with a prerequisite direction. No mode is locked.
