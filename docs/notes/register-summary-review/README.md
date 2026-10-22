# Independent register-summary review

Reviewed 22 October 2026 against the production build served at `http://localhost:4182/assembly-lab/`. The reviewer wrote the register inventory, but did not write the implementation. This combines an independent learner pass over the changed display and a technical pass against its source and model-derived states. It is not a review of every sentence in every lesson.

## Findings

No blocking finding in the changed register summaries or disclosure.

One minor observation: the area from the top of the “Registers” heading/button row to the bottom of the initial summary cells measures **115.67 CSS pixels** at every sampled width. The issue gives approximately 90–110 pixels as a visual target. The cells are visibly compact and all four fit on one row, including at 320 pixels, so the small excess is not a functional failure. Direction if further tightening is wanted: reduce the gap between the heading and summary rather than shrinking values or the button. This is an observation, not a requirement to chase an exact height.

Rejected concerns:

- The taller written card is not a regression to the old grid. The visible “Written” label explains the mark without relying on colour, and the four cards retain one row.
- The stack's six summaries do not all occupy one phone row. Complete eighteen-character hexadecimal values need their own space, and whole cells wrap readably.
- The 64-bit diagram remains taller and can wrap its whole hexadecimal token on the narrowest view. Its upper/lower 32-bit grouping and alias remain visible. It is a teaching diagram, so compact-summary height targets do not apply.

The display adds no new learner terms. “Registers”, the existing register names, and “Written” retain the lesson's meanings. The surrounding introductory caption explains that an outlined register was written by the last instruction. The summary does not introduce a new tool, compiler option or C concept.

## Rendered learner checks

The screenshot sets were visually inspected, both individually for the key states and as contact sheets across the width/theme matrix. Light and dark were confirmed from the actual `html[data-theme]` value.

- Module 0 initial collapsed state: 320, 360, 375, 390, 430, 768 and 1280 pixels wide, plus 812 × 375 landscape. Four small values occupy one row. No page horizontal overflow was measured. Name/value relationships remain clear in both themes.
- Module 0 expanded at 375: all 128 bits and 16 byte groups remain present for four registers. The screenshot shows four complete 32-bit patterns. Back and Reset preserve the expanded state. Executing through `ret` leaves zero written markers. A stepped collapsed screenshot shows a visible Written label.
- Module 0 at 320 with `html` text size set to 200%: the summaries wrap into two rows, retaining their complete values and staying within their container in both themes. This is text scaling, not a claim of testing browser UI zoom on a physical phone.
- The separate instruction-removal experiment retains all 128 visible bits after removing `ret`, in both themes.
- Memory at 320, 375 and 1280: the exact `x0` hexadecimal string and the `w0` string remain complete. The memory-byte diagram still has visible address and cell boundaries.
- Stack at 320, 375 and 1280: stack pointer plus five ordinary registers wrap as complete cells. The long `x19`, `x29` and `x30` hexadecimal strings remain readable. Initial and stepped states were inspected.
- Compiler at 375: the actual Run with these inputs action reveals five register summaries. A second expression also uses five registers and retains a readable strip. A `return 0` experiment with input zero writes zero over the initial zero in `w8`; the cell visibly says Written in both themes. This directly tests a write with unchanged bits.
- The existing labelled 16-bit halves and named 64-bit upper/lower diagrams remain intact at phone width in both themes. The named 64-bit figure was also captured at 320 and 1280.

Keyboard activation and disclosure associations were checked separately; see `keyboard-measurements.json`. The button remains focused when Enter expands its region, and its visible focus outline is captured in `keyboard-focus.png`.

## Technical checks and limits

The shared primitive accepts already formatted strings or numbers and does not coerce the memory helper's `bigint` values through `Number`. Ordinary register write marks still come from `view.written`; the stack pointer uses the executed step's `writes` entries. The change does not restyle `.al-reg` or the full bit/half/byte diagrams. `FlagsRow` retains its distinct actual-value-change semantics.

`measurements.json`, `shared-measurements.json` and `extra-measurements.json` record the browser observations. The first shared compiler screenshots show its pre-run editor; the later `compiler-compiled`, `compiler-many` and `compiler-zero-write` captures are the exercised register states. No summary is expected in the pre-run editor. The `375-16halves` captures were recaptured at the correct phone width after an initial capture at desktop width.

The review did not separately exercise a three-summary runtime configuration, long signed decimal values, restored saved lesson state, or 200% text on the memory/stack/compiler pages. Those remain limits of this browser review; the generic layout/source audit is not a substitute for those cases. The repository's focused tests and full `npm run check` are managed and recorded by the implementing session. This reviewer did not run the full suite.

The browser scripts were ad hoc review tooling. Two initial attempts stopped because the script used “Show bits” instead of the actual “Show the bits”, or expected summaries after Compile C before Run with these inputs. Another used the generic prediction button label in a figure whose label is “See what happens”. The corrected runs completed; these were review-script selector mistakes, not product failures.
