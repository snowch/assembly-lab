# Independent shared technical verification

Reviewed current working-tree implementation without editing source. Read CLAUDE.md, docs/style.md and docs/authoring.md first. Assessed implementations before reconciling shared.md, summary.md and diagnostics.md. This reviewer did not author the changes. No model override was used; review used the inherited session model. Root/coordinator handles full-suite and whole-lesson verification separately.

## Scope and verdict

Production snapshot: http://localhost:4291/assembly-lab/. Browser checks used Chromium in fresh contexts at 375×900 and 1280×900, light and dark system themes. All four configurations executed the targeted states below without page errors. All targeted shared fixes are verified. The low mobile presentation regression found during this review was corrected and independently rechecked in the rebuilt preview. No accepted shared finding remains open.

Source checks cover role assignment, prediction gates, write events versus value differences, grouped-hex parsing, initial-register heading, responsive bit rows, array byte grouping, compiler status formatting, changed assembler diagnostics and front-page status. No claim of exhaustive input coverage, all hint paths, every lesson interaction, accessibility certification or a new real-hardware differential run is made.

## Finding corrected during verification

**Low — whole hexadecimal addresses break across lines in phone array elements.**

Location: packages/views/src/interactives/MemoryStepper.tsx:169 fixes four byte columns inside each four-byte element; packages/views/src/memory.css:105–119 supplies the element container. At 375px, the displayed address `0x410000` splits into `0x410` and `000`; the other addresses also split. “Not accessed by this instruction” takes five lines. The new element labels and boundaries are useful and correct, but the narrow cells make the address-to-index explanation harder to follow.

Evidence: shared-array-375-light.png and shared-array-375-dark.png. Desktop addresses remain whole. All four byte addresses and read highlights are technically correct; no horizontal overflow was detected. Coordinator independently viewed and accepted this finding.

Direction accepted and implemented: retain each element's boundary/index and four bytes, using two columns within an element at phone width and four where they fit. After the root changed the CSS and rebuilt4291, this reviewer independently reran the targeted matrix. All 16 addresses each occupy one line in every configuration; all four groups retain four bytes, the load highlights the correct four bytes, and no internal overflow occurs. Screenshots now show the corrected state. Memory data, instruction output and source associations remain intact.

## Verified fixes

- **Action roles and guidance.** Parsed all lessons: 48 predictions and 48 exercises have their respective roles; five arithmetic figures have Calculation. Actual instruction steppers retain the simulator step note. The arithmetic disclosure explicitly identifies columns as parts of one calculation. Pressing Next column advances the displayed column, matching that note. The first prediction gate remained locked until the prediction was checked. The initially missed `compare-bfi` and `compare-no-clear` nonstepping result diagrams were reported during source review, corrected to Diagram, and verified on the built page in all four configurations. Gate implementations remain intact.
- **Written versus changed.** The actual trace collects register write events, including equal-value writes. In the free compiler playground, an identity function writes input 6 back to the return register without changing its value; the card now says Written. Real bit-difference marking remains based on before/after comparison, and flag change detection remains separate. No machine semantics changed.
- **Compiler status formatting.** The same playground's executed-instruction status contains a real code element, with no literal Markdown backticks. The temporary missing `withCode` import reported during source review was corrected before the build.
- **Grouped hexadecimal.** Typing `0x0000 7530` succeeds and shows the normalized assembly value. Source accepts whitespace only between hexadecimal digit groups; ordinary malformed input remains rejected. It does not broaden decimal syntax accidentally.
- **Visible input state.** RunPrediction retains the visible heading “Registers before the run” after checking, correctly distinguishing the unchanged input cards from the executed outcome.
- **Temporal bit labels.** “w0 when the call starts”, “w0 before” and “w0 after” occupy their own readable lines on the phone; the long label wraps at word boundaries on desktop. Verified actual computed dimensions and representative screenshots in both themes.
- **Array semantics.** Each declared element retains four consecutive bytes in one indexed group. After the first array load, exactly four bytes from the accessed element are highlighted. Data are reconstructed from the trace; element type/group size is explicit metadata rather than inferred from byte contents. No byte loss, reorder, false grouping or overflow was observed. The phone address-readability concern described above is now resolved.
- **Front page.** The unsupported claim about other planned modules is absent in all four contexts; the remaining status sentence accurately explains published drafts.

## Diagnostics checks

Independently inspected parser call sites and actual model results, not only the author's notes. Ran missing `.global`, invalid global name, excess `.zero` arguments and empty `.word` operand cases; the common diagnostic correctly encompasses missing, invalid or extra directive operands. Three invalid shift/extension forms select the intended messages, and “extension” replaces the unexplained noun “an extend”. An attempted load from an instruction address produces fault.readInstruction with the expected source instruction, line and address. The new message accurately identifies absent encoded instruction bytes as this simulator's representation limitation. No parser/run behavior changed.

These diagnostics were checked against source and executable model calls; they were not separately forced through every challenge editor in the browser. No instruction-set or C semantic claim was altered by these shared edits, so a new real-tool run was not needed for this review. The coordinator separately checks changed technical lesson claims against primary sources.

## Artifacts and limitations

- shared-browser.cjs: reproducible targeted browser runner.
- shared-browser.json: observed values, roles, input/result labels, grouping and errors for the four configurations.
- shared-{adder,hex,temporal,array,write}-{375,1280}-{light,dark}.png: rendered evidence. Screenshots include prediction UI states, not written exercise solutions.
- No source edits, build or broad test run performed by this reviewer. No challenge solutions are reproduced in this report.

## Final rebuild and theme verification

Original browser contexts used Playwright colorScheme with fresh storage, so auto theme followed the requested light/dark system preference; no JSON-encoded localStorage theme was used. For the final rebuilt preview, the entire targeted shared matrix was rerun with the raw theme string stored explicitly and html[data-theme] asserted equal to the requested theme. Both phone and desktop passed in both themes. The shared-browser.json records appliedTheme, one-line address counts, four-byte groups, highlights, retained input labels, Written status, real code markup and no page errors. Updated screenshots preserve the same four configurations.
