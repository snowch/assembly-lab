# Independent technical review: Chapter 12 figures

Copyright © 2026 Christopher Snow

Reviewed by the separate `boot_technical` agent, which did not implement the figures,
draft their labels or extend the native recorder. Read `CLAUDE.md`, the static-schematic
allowance and arrow semantics in `docs/visual-language.md`, `boot-facts.md`, the new
`figure-facts.md`, the diagram labels, native assembly/linker sources and verifier.

## Source and native evidence

The responsibility flow may show selected recorded instruction addresses and a clearly
labelled schematic of responsibilities. The physical-board example must remain separate:
it is a source-backed example, not execution evidence from the direct-loaded QEMU image.
The drafted board labels group ROM/platform firmware, later loader and selected next
program, explicitly omit intermediate stages and qualify image format and handoff rules.
This avoids inventing an obligatory board boot chain or suggesting that this ELF is
a physical-board disk or firmware image.

The earlier independent review checked QEMU 8.2.2 `hw/arm/boot.c`: non-Linux ELF reset
sets the PC directly to its ELF entry. No guest reset stub, BIOS or UEFI executes before
`_start` for the documented command. Trusted Firmware-A's design supports the qualified
ROM/firmware/later-loader comparison, including BL33 as possible UEFI software.

For the added file-to-memory explanation, independently read QEMU 8.2.2
[`include/hw/elf_ops.h`](https://github.com/qemu/qemu/blob/v8.2.2/include/hw/elf_ops.h)
and [`hw/core/loader.c`](https://github.com/qemu/qemu/blob/v8.2.2/hw/core/loader.c).
The ELF loader obtains file and memory sizes from each load segment; the ROM-loader
reset path copies the file-backed bytes and explicitly zero-fills the remaining memory.
The labels correctly distinguish that loader zero-fill from our program's later
explicit `.bss` writes. SHT_NOBITS sections have memory size without stored section
bytes; their section-header file offsets must not be pictured as source bytes to copy.

Inspected the new ELF64 parser independently. Header indices, program-header and
section-header layouts match ELF64 little-endian metadata. It checks allocation and
PROGBITS/NOBITS type, file bounds, unique load-segment coverage and the file-to-memory
offset relation for file-backed sections. The recorded writable segment includes an
alignment gap as well as `.bss` and stack storage; the picture must not silently close
that real address gap or imply that a complete ELF is copied contiguously into RAM.

The new GDB sequence records `_start`, `boot_ready`, `trip_distance`, `after_trip`,
`uart_puts` and `halt` in actual control-flow order and checks each PC against its symbol.
The explicit `tbreak *uart_puts` stops before the helper's first instruction, avoiding
source-level prologue skipping. One `stepi` then executes the actual stack-saving `stp`:
SP moves from `0x40082010` to `0x40082000`, reserving a 16-byte frame below the old SP.
The later halt stop still confirms that the helper restored the original stack pointer.

Independently reran:

```sh
/tmp/al-docker exec al-native-tools python3 /work/scripts/native/check.py
```

It returned exit status 0 against the new evidence, including ELF image layout, flow
PCs and the measured frame. Existing native arithmetic, deliberate-error, BSS marker,
challenge, UART, emulator console-exit and optional Linux-assembly checks also passed.
The program sources did not change for these figures; the download remains checked
against them. No physical hardware was run.

## Findings and corrections

1. **Medium, corrected: selected rows hid the numeric mapping from their accessible
   name.** Initially each entire file-to-memory row was a button named only “Select a
   section” and its section name, overriding the visible offsets, addresses and sizes.
   Its accessible name now includes the file range and byte count, or explicit absence
   of stored bytes, followed by the memory range and byte count. The selected status
   supplies the section's explanatory meaning. Verified those names in the built DOM.
2. **Medium, corrected: RAM was labelled as the entire address space.** The label
   “Machine address space” was also used for the interval `0x40000000–0x48000000`.
   That interval is RAM, not the whole device-containing address space. It now says
   “RAM on QEMU virt”. The UART remains visibly separate and explicitly outside RAM.
3. **Preventive clarification accepted: board stages and mapping gaps.** The physical
   example groups early ROM/firmware responsibilities rather than pretending to show
   an obligatory exact list of TF-A stages. Its note identifies omitted stages, board
   handoff conditions and accepted image format. The file-to-memory picture displays
   selected unscaled ranges with their actual exclusive ends, preserving address gaps;
   it does not show the whole ELF as a contiguous copied block.

## Figure implementation, tests and final browser check

Reviewed all added rendering code in `NativeBootDiagrams.tsx`, its schema and integration
in `NativeFigure`, scoped `native.css`, lesson placement and labels. The native figure's
prediction gate still encloses both diagrams. The old duplicate address-card list was
removed while the existing recorded startup controls and values remain. Responsibility
selection reveals explanatory text and does not execute native instructions. The board
schematic has no recorded PC values or interactive execution controls.

The visible legends distinguish downward control transfers, rightward loading arrows
and the non-arrow reservation connector. File-backed sections use loading arrows;
`.bss` and `.stack` have no displayed source bytes or source offsets to copy. Address
ranges use a dash rather than a movement arrow. The two actual `LOAD` segment ranges
remain visible separately from the selected section mappings. The loader zero-fill
note and explicit startup BSS-clear note are both present. The UART card is outside
the RAM mapping rows and says no ELF section is loaded there.

Reviewed the three added direct-component tests and the extended existing Module 12
browser tests. They add meaningful checks for NOBITS absence of file bytes, rendered
memory bounds, measured frame size within the reserved stack, non-address-sorted
control order, separation of the board example, prediction gating and keyboard
selection. They preserve the earlier challenge, recorded/model, reset and restored-work
assertions. No previous assertion was removed or weakened for these additions.

The independent focused browser probe on the production preview at port 4182 returned
exit status 0. It used fresh Chromium contexts at 375 and 1280 pixels, each in actual
light and dark themes. In each context:

- Both diagrams were absent before committing the prediction, then appeared.
- Enter selected each of the seven responsibility nodes; its pressed state and
  corresponding description updated while keyboard focus stayed on that node.
- Space selected all five section mappings, updating pressed state and description
  without moving focus. Numeric accessible names matched the recorded ranges/counts.
- The file-backed byte counts were 216, 82 and 4. The two memory-only sections had
  no source bytes, while their memory sizes remained 8 and 4096 bytes.
- The segment summaries matched 298/298 file/memory bytes and 4/4112 bytes. The
  four-byte alignment gap before BSS remains visible in the actual section bounds.
- The frame showed SP `0x40082010` before the save and `0x40082000` after it, with
  the explicit decrease of 16 bytes. Its range is inside the shown stack reservation.
- The document width equalled its viewport width, 375/375 or 1280/1280. No browser
  console errors or page errors were captured.

Captured the flow, section mapping and stack figure in every size/theme combination.
Visually inspected phone/light flow, desktop/dark flow, phone/light and phone/dark
mappings, desktop/light mapping and the phone/dark stack. The flow's measured PC order
matches the evidence rather than sorted address order. Its separate board example is
clearly qualified. Phone mapping ranges wrap between complete endpoint values rather
than splitting a hexadecimal address; the loading and reservation marks remain distinct.
The stack figure's before/after labels make its time direction explicit while the prose
states that SP moves towards lower addresses. No remaining technical blocker was found.

This review did not run a full repository suite or physical hardware. Full-suite results
belong to the managing session's validation record; browser accessibility checks here
inspect names, semantic controls and keyboard behaviour, not a physical screen-reader run.

## Final correction: explanations attached to their controls

The independent learner's medium finding about offscreen explanations is accepted.
Its quoted directions promise that selecting an item explains its role or contents,
but the earlier implementation placed that explanation after all remaining nodes or
rows. The reader's measured distances support the finding, and source inspection
confirms the original placement. This was a visibility problem, not a failure of the
recorded data or of selection itself. No unsupported learner finding needed rejection.

Reviewed the final correction: each control now owns an explanation immediately after
it in the same list item or row wrapper. React `useId` provides stable, instance-specific
IDs. `aria-controls` names the matching explanation; `aria-expanded` and `aria-pressed`
agree with selection; nonselected explanations use the actual HTML `hidden` attribute.
The correction adds no focus movement, scroll call, native execution or altered facts.
The shorter drafted notes retain the recorded-address/schematic distinction, selection
versus execution distinction, source-qualified board example and board-defined image
format/handoff limits. The board stages remain explicitly outside the QEMU experiment.

Independently checked the final immutable production preview on port 4184 at
375 pixels/dark and 1280 pixels/light. The focused probe returned exit status 0.
For all seven flow controls and all five section controls, Enter or Space preserved
focus, expanded the matching explanation, and left exactly one visible status per
diagram. Every controlled ID resolved to the immediate next sibling; the explanation's
top met the control's bottom with a measured zero-pixel gap. All IDs were unique across
the two diagram instances. Both actual themes matched the requested themes, viewport
and document widths remained equal, and no console or page errors were captured.

Inspected final phone/dark selected `.text` and desktop/light selected `_start`
screenshots: their explanations are visibly attached to their controls. The complete
hexadecimal endpoints, file-byte versus reservation marks and separately qualified
board path remain legible. This final check supersedes the earlier panel-placement
inspection. Native facts and their verifier were unchanged, so no new native run was
performed for this layout/accessibility correction. No remaining technical blocker.

### Regression assertion and audit record

Independently reviewed the final test-only `expectInlineExplanation` helper. It requires
the activated control to keep keyboard focus, report expanded state, identify a visible
controlled explanation and place that explanation within four pixels of its bottom edge.
The four-pixel allowance accommodates the independently measured zero/subpixel boundary
gap while still rejecting the former many-hundred-pixel separation. It checks the absolute
gap, so substantial overlap would also fail. The helper is applied after keyboard selection
of the trip node and every memory section; earlier assertions remain. This is a focused
regression check supported by measured geometry, not a weakened test or timeout.

Read the new Module 12 section in `docs/visual-audit.md` and the current
`figures-validation.md`. Their keep/refine/new dispositions match the implementation:
new responsibility schematic, refined file/RAM mapping replacing duplicate address cards,
retained gated startup snapshots and unchanged arithmetic comparisons/challenge contracts.
The validation note correctly leaves final full-check and focused-browser outcomes pending
instead of claiming unfinished runs passed. Directly read the available local logs: the
first full check records 138 unit files / 2774 tests and a successful build before its
browser tail of 50 passed, one skipped, 1038 not run and one interrupted. The focused final
unit log records two files / 16 tests passing. These observations do not turn the stopped
full command into a passing run. This final source/document review ran no additional tests.

## Independent final CI confirmation

Independently fetched the raw log for check job `120121478022` in
[PR CI run 39863996017](https://github.com/snowch/assembly-lab/actions/runs/39863996017).
It records 138 unit files / 2774 tests passing, 1067 browser tests passing with 23
skipped, and “All checks passed”. The checkout is PR merge commit
`b0c126e9a0b168971bbe273722b923b9f3fc0aa9`. Independently queried GitHub's commit
metadata: its parents are base `4e6a37b659606e2d46d2d58258ed374a75262d81` and
implementation `cd60bee6b4b172368a4cba0d6acd57ce30b2483f`; both merge and implementation
have tree `7e5962c895bb3cc9eeb876677a8d4435a8bb9be5`. The tested merge therefore has
the same source contents as the implementation. Run/job status independently confirms
completed success for `check`, `real-tools` and `native-lessons`.

Read the final `figures-validation.md` and corrected visual-audit header. Their distinction
between historical backlog, implemented Module 12 work, interrupted local commands and
complete successful CI is accurate. Directly read the focused browser log's eight-test
passing summary. Independently counted the second local full-check progress log: 655
passing test lines and 17 skipped through case 672, without a final success summary.
The workspace interruption and unobserved shell exit status remain managing-session
history rather than an invented completed result. The final pending changes are solely
documentation recording validation. No additional application change or test run was
made for this final confirmation.
