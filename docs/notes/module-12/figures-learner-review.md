# Module 12 diagrams: independent learner review

Copyright © 2026 Christopher Snow

Reviewer: independent learner agent, same inherited model as the managing session.
Scope: the first Module 12 lesson, **Build and boot an assembly program**, with its two new
boot-flow and ELF-to-memory diagrams. Read as a learner who has completed Modules 0–11 and
no later lesson. Review date: 2026-10-22.

## Sources and review method

Read the repository's binding authoring and review instructions, front-page prerequisites,
style checklist and visual-language guide. Read the checked diagram facts and evidence,
then reviewed the actual built lesson's ten sections. Browser review used fresh Chromium
contexts at 375 × 900 and 1280 × 900, in light and dark themes, and confirmed each rendered
`data-theme` attribute. The initial complete probe used port 4182. The detail-location
probe used the identical immutable build on port 4183 to avoid a concurrent build deleting
assets beneath the preview. No native program or physical board was executed by this
reviewer; the native records are supporting sources, not a substitute for this browser review.

Screenshots are in `figure-review-images/`:

- `flow-1280-light.png`: complete side-by-side host/guest and board example paths.
- `flow-375-dark.png`: complete stacked phone paths.
- `memory-rows-375-dark.png`: paired file/RAM section rows, with `.bss` selected.
- `memory-rows-375-light.png`: the same geometry in light theme.
- `stack-375-dark.png`: measured downward stack-pointer movement.
- Matching captures exist for the other width/theme combinations.

The reviewer visually inspected desktop-light and phone-dark flow images, phone-light
memory rows, and phone-dark stack images, in addition to reading actual rendered text and
checking interactions. This distinguishes image inspection from merely taking screenshots.

## Finding

**Medium: the explanations changed by early selections lie offscreen.** The flow note
says “Select a stage to inspect its role”; the memory note says “Select a section to follow
the same contents from the file to the machine’s address space”. Both controls work and
visibly select the chosen item, but their changing explanatory panel appears after the
entire list. Clicking an early item changes content outside the visible viewport:

| Viewport | Selected item | Control vertical position | Explanation begins |
| --- | --- | --- | --- |
| 375 × 900 | `_start` | 399–502 px | 1174 px |
| 375 × 900 | `.text` | 345–555 px | 1455 px |
| 1280 × 900 | `_start` | 398–501 px | 1173 px |
| 1280 × 900 | `.text` | 371–530 px | 1225 px |

These are actual bounding rectangles after ordinary pointer activation, not estimates
from source. A learner can see the selection outline but must discover that its promised
role explanation is below the remaining nodes/rows. This matters particularly for the
file/RAM map, where the content meaning is supplied by that changing explanation.

Direction: keep the selected explanation adjacent to its selected node/row or otherwise
visible near activation. Preserve control focus and avoid automatic whole-page scrolling.
The visual-language guide requires controls adjacent to the part they change.

Sceptic disposition: accepted by the managing session. The selected description was moved
inline immediately after its control. Final independent verification is recorded below.

## What passed

Both new diagrams and all three recorded startup snapshots are hidden before the original
arithmetic prediction is committed. Revealing the diagrams does not expose the later
modified-function prediction's result or a challenge solution. The diagram states label
selection as inspection rather than instruction execution.

All seven execution-path stages select correctly and show the matching role description.
All five ELF sections select correctly and show the matching section explanation. Enter
activates the flow controls and Space activates the section controls; focus stays on the
activated control. Selection has a persistent visible outline/stripe and `aria-pressed`,
and the selected detail names its subject. These checks passed in every width/theme pair.

The three original recorded startup snapshots still show their checked PC, stack pointer
and stored-result values. The marker is explicitly injected by the verifier, rather than
claimed as natural initial RAM contents. The final result remains labelled as memory.
The new map replaces the old address cards instead of duplicating them.

No page-level horizontal overflow: scroll/client widths were 375/375 and 1280/1280 in
both themes. No visible text in either new figure was below 11 px. No console errors or
page errors were observed. All ten lesson sections remain mounted. This review did not
run a full automated suite and does not claim one passed.

## Understanding and visual checks

The execution path's repeated actor labels clearly separate the host loader from guest
instructions. Loading bytes uses a right-pointing arrow with its own legend; control
transfers use the vertical path. The guest function returns into its caller and the UART
routine returns to the waiting loop; the schematic does not present a native process exit.
The note explains selected measured addresses and omitted instructions rather than
claiming that the view is a complete trace or a timing measurement.

The physical-board path is separately headed “one possible boot chain”, uses dashed
boxes, and says it is a simplified board-dependent example rather than an observed trace.
It does not put BIOS, UEFI, or a firmware stub onto the measured QEMU path. The named
Trusted Firmware-A example is source-qualified and the image-format/handoff limit is
visible before the board nodes. The desktop places both paths side by side; the phone
stacks complete paths without mixing their arrows.

File and RAM remain paired on the phone. The selected memory-row screenshots show whole
hexadecimal endpoints wrapping at the range separator rather than clipping digits.
Each row names its source offset and destination address. Stored sections have byte
counts on both sides; `.bss` and `.stack` have dashed source sides explicitly saying
there are no stored section bytes. The shared legend explains the reserved-memory mark.
The figure distinguishes section organisation from ELF LOAD segment loading, and explains
loader zero-fill separately from startup's explicit `.bss` clearing. The UART is in its
own device box, says it is outside RAM, and is not connected to an ELF loading arrow.

The stack inset shows the measured before/after stack pointers with a downward movement
of 16 bytes, while its local prose says “towards lower addresses”. This does not imply
that the address-sorted section rows are a stack-growth animation. The figure labels
selected ranges as not to scale and their end addresses as exclusive.

## Assumptions and whole-lesson reading

Earlier modules supply hexadecimal, register widths, addresses, loads/stores, strings,
branching, calls/returns, frames and the calling convention. This lesson itself supplies
terminal/tool meanings, source/object/executable distinctions, sections, ELF segments,
entry point, host versus emulated machine, firmware, boot ROM, BIOS/UEFI, UART and MMIO.
The new labels attach `.text`, `.rodata`, `.data`, `.bss` and `.stack` to those definitions;
they do not assume C or a browser model of firmware/devices. “Guest” is locally identified
as “our startup/function/caller” under the emulated-machine discussion. “Handoff” is tied
to loading and transferring control, with board-dependent entry conditions made explicit.
No additional missing prerequisite was found that prevents using either new figure.

Read all ten rendered sections for duplication and sequencing. The existing source-to-tool
pipeline describes building files; the new path describes control after loading, so the
two serve different questions. The generalisation has been shortened to the essential
inspection commands and definitions; segment zero-fill detail is now in the memory
figure. Some nearby prose restates basic entry/firmware boundaries, but it anchors the
figures rather than reproducing a second full explanation. No repetition blocker was
found. The recorded snapshots still provide actual before/after state rather than another
static memory map.


## Final independent verification

Rechecked the immutable final build at port 4184 after the inline-description fix and
separate drafting pass that shortened the flow/board notes. Fresh Chromium contexts
covered 375 × 900 and 1280 × 900 in both themes, with actual themes confirmed. These
results are separate from the initial offscreen-panel measurements above.

All seven flow stages and all five section rows now expose their matching description
immediately after the activated control. Measured control-to-description gaps are zero
pixels, apart from one subpixel 0.75 px loader measurement during layout settling. Each
activated control retains focus, has `aria-expanded=true`, and references its actual
associated description with `aria-controls`. Unselected descriptions are hidden.

On the phone, the `_start` description now occupies y = 501–666 rather than beginning
at y = 1174; the `.text` description occupies y = 555–665 rather than beginning at
1455. Both are visible beside the action's context. Enter/Space keyboard activation
retains focus and changes the document scroll position by zero in all four contexts.
No automatic focus movement or whole-page scroll was introduced.

The final page still measures 375/375 or 1280/1280 for scroll/client width in both
respective themes, with no page errors. All stage and section selections passed the
final interaction probe. The revised board note remains explicitly board-dependent,
names Trusted Firmware-A as its example source, and says those firmware stages do not
run in this QEMU experiment. Earlier body definitions remain in place. Shortening the
note removes repeated qualifications without removing the physical-board distinction.

Final screenshots use the `-final.png` suffix. The reviewer visually inspected
`memory-rows-375-dark-final.png`, `flow-1280-light-final.png` and
`flow-375-light-final.png`. Paired file/RAM columns, readable whole address endpoints,
load/reserve marks, selected outlines and adjacent explanations remain clear. No
challenge answer is included in those screenshots. No learner-review blocker remains.

One exploratory recheck used a CSS ID selector without quoting the dot in `.text`, so
its locator timed out. The selector was corrected to an exact attribute selector and
the complete final probe passed. That instrumentation failure is not reported as an
application failure or as a passing test run. This review makes no full-suite claim.
