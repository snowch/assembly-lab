# Independent review of the addition architecture integration

Copyright © 2026 Christopher Snow.

Reviewed 2026-11-06 by a separate learner/technical reviewer who authored no product
code or learner copy. The actual built course was reviewed after the approved
mockups. No open learner, arithmetic or technical blocker remains.

## Learner review

M1 L3's required first example now uses 3 + 3, so its bit 1 necessarily encounters
two operand ones and incoming carry one. Kept bit 1 and outgoing carry 1 are shown
separately. The existing width example, subtraction method and fresh 6 − 3 practice
remain. The new final section generalises that preparation to one actual 32-bit
ADD: read w0/w1, calculate, write w2. It explicitly distinguishes the enlarged low
four bits from the full instruction width and continues bit 3's carry into bit 4.
The next page's C-type/subtraction comparison retains a coherent purpose.

The specific Bit Lab link offers the gate construction without making it an
undeclared prerequisite. Definitions, register moments and functional-model limits
are local. The bridge does not claim electrical timing or real processor layout.
Required material stays visible; gated solved work remains hidden until earned.

Worked exposure does not establish mastery. Existing subtraction practice offers
fresh application of the arithmetic method, but is not a diagnostic assessment of
all eight full-adder cases. No new lesson or assessment is required for the approved
scope. This expert review is not a novice learning study.

## Technical and integration review

Source review confirms the existing machine model runs handwritten primitive_add:
`add w2, w0, w1`, followed by `ret` for the execution harness. The figure observes
stateAfter(-1) before execution and stateAfter(0) after the ADD, rather than the
harness return. The six appended differential corpus calls use width 32 and the
same existing instruction. No generated-C provenance is implied. This reviewer
inspected the corpus relationship but did not independently run GNU/QEMU.

Independent actual-built browser checks passed at 375/1280 in light/dark and 700
light. All eight column triples were generated through the offered inputs and both
outputs match integer arithmetic. Whole-word output and all 32 visible bits match
independent BigInt arithmetic for 3 + 3, 15 + 1, UINT32_MAX + 1,
UINT32_MAX + UINT32_MAX, 0 + 0 and 2147483647 + 1. Source registers remain unchanged;
only w2 is marked written, including the same-value zero write. Plain ADD leaves
flags unchanged; internal carries are not automatically stored flags.

Executed state, selected column, committed inputs and an incomplete pending draft
survive actual reload without executing again. Invalid input leaves the committed
model unchanged and its alert persists. Back restores before-ADD state; Reset
restores 3, 3 without clearing earlier exercise work. Malformed saved new-slot state
falls back safely. State uses the existing validated lesson useSlot contract;
source review confirms coordinated reload waits for persistence. A real service
worker update transaction was not independently driven by this reviewer.

Keyboard Enter/Space keep focus and avoid unexpected scroll for visible controls.
No page/console errors or document overflow occurred. Phone/desktop/intermediate
screenshots were inspected. A separate 961px two-column breakpoint check with both
inputs UINT32_MAX confirms all three long register values remain one line and
contained, all 32 bit cells fit, and destination caption clears its continuous
arrow. The reused BitRow and original four-bit/practice gates were checked.

## Accepted finding and independent final correction

A selected bit button's generic hover background overrode its selected background,
leaving near-black selected text on near-black in dark mode. The initial actual
colors were foreground rgb(7,18,15), background rgb(12,17,16). The parent accepted
a scoped selected-hover rule retaining the accent palette and rebuilt the assets.

Independent final checks at 375/700/1280 in both themes passed. Idle/hover selected
palettes match, text contrast exceeds 4.5:1 (dark: 10.49:1), and keyboard selection,
focus and scroll remain stable. Final phone screenshot confirms readable text.
The finding is closed; no further product correction was requested.

The first review harness used an overly broad data-register selector that also
included the reused BitRow wrapper; narrowing to the scalar cards corrected it.
The first hover recheck sampled during a normal CSS transition; waiting for that
transition corrected the reviewer assertion. Subsequent complete checks passed.
Neither reviewer harness error implicated product arithmetic.

Detailed review scripts, JSON and screenshots are retained in the execution
workspace at `/workspace/scratch/architecture-implementation-review`, including
separate learner-review.md and technical-review.md, assembly-browser.json,
assembly-961.json and assembly-hover-final.json. Full repository checks, CI and
merge are recorded by the implementing agent separately. No physical touch device,
screen-reader speech, other browser engine, novice study or new exhaustive ISA
validation is claimed by this focused review.
