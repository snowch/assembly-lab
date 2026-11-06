# Independent technical review: actual production integrations

Reviewed 2026-11-06. No product code/copy authored, no dependency installation,
build or broad repository test run by this reviewer. Parent agents own full checks,
GNU/QEMU differential execution, CI and merge. See learner-review.md separately.

## Scope, artifacts and verdict

Actual stable built routes used:
- Assembly: http://localhost:4501/assembly-lab/#/lesson/four-bit-arithmetic
- Bit Lab: http://127.0.0.1:4502/bit-lab/#/lesson/adder and /#/lesson/alu
- Bit Lab retained shared use: /#/lesson/flags

Both browser scripts completed their five-context matrix successfully: 375 and1280
light/dark plus700 light. Actual theme attributes and computed backgrounds were
recorded. A separate961-light Assembly boundary check also passed. JSON records,
scripts and screenshots are in this directory. Both integrations have no open finding. Assembly's accepted selected-hover fix was
independently rechecked on rebuilt assets in all six width/theme contexts. No
arithmetic, state or provenance blocker was found.

## Independent numeric and source review

All eight selected-column triples were generated through actual offered inputs in
each course at375 light; kept bit and outgoing carry match integer sum modulo2 and
floor(sum/2). Bit Lab's five named gate values for each triple separately agree with
independent XOR/AND/OR expressions, recorded in bit-lab-gate-oracle.json. The visible
111 case gives binary11, kept1 and carry1. It does not need a third output or a
carry value2.

Assembly's actual ADD outputs and all32 visible result bits match independent
BigInt low-word arithmetic for3+3,15+1,4294967295+1,4294967295+4294967295,
0+0 and2147483647+1. The two source registers retain exact values. The w2 written
marker remains present even when0+0 writes the same numeric zero. Selecting bit3
reports carry tobit4, not a discarded carry at the cropped display boundary.

The source uses addArchitectureTrace and the existing machine run of handwritten
`primitive_add: add w2, w0, w1; ret`. Before is stateAfter(-1), after is stateAfter(0),
so the displayed write belongs to ADD and not the harness return. A/B column records
come from the step's addition model. Plain ADD preserving flags is correctly
separated from internal carries. There is no compiler-generated-C listing claim in
this new section. The existing primitive_add differential corpus is reused with
six appended width32 calls; this reviewer inspected that relationship but did not
independently run GNU/QEMU.

Bit Lab preserves its arithmetic model and exposes existing column records. ADD
passes B with initialcarry0; SUB inverts B at the adder and uses initialcarry1. The
three-input labels and selected column outputs reflect those actual signals.
The gate diagram and five equations agree; complete connected routes, junctiondots
and crossing semantics were source/visually inspected. Functional logical-dependency
claims are explicit; no electrical timing or literal AArch64 chip layout is claimed.

All nine ALU operations were exercised at3,3 in every context against an independent
integer/bitwise oracle: ADD,SUB,AND,OR,XOR,NOT,LSL,LSR,ASR. N/Z/C/V and absent-flag
dashes match those operation contracts. Only ADD/SUB show the new detail. The7+1
Signed overflow preset remains: result8,V1. Reset restores3,3 ADD. Old flags lesson
still reveals its existing CarryDiagram rather than the new detail.

## State, gates and integration

Assembly initial inputs3,3,w2=0, no revealed arithmetic outputs. Run writes6 and
reveals the selected111column. Input drafts remain separate from committed model
values. Executed state, selectedbit3, committed15,1 and an incomplete draft0x survive
actual reload without executing again. Invalid submission and its alert survive;
committed output stays16. Back survives reload before ADD with outputs hidden and
w2=0. Reset restores3,3 and does not clear the earlier exercise's partially entered
work. Malformed persisted new-slot state(bit99) safely falls back to initial.
Existing practice remains before the new figure, and gated solved material remains
unearned/hidden.

New state uses validated useSlot in the existing lesson-storage namespace. Source
review confirms coordinated update checks persistence.saved() before reload; the
new figure does not use a fake transient handoff field. We did not perform a real
service-worker update transaction: source-reviewed handoff contract plus actual
reload behavior is the evidence here. Parent owns broader offline/update tests.

Bit Lab hides new detail before Reveal and again after input/operation change;
Reset restores default/re-hides result. Keyboard Space changes selectedcolumn with
focus stable and no unexpected scroll when visible. The same live status element
remains connected while its announcement text updates. Formal challenge work
survives experiment Reset and actual reload. Transient WordLab exploration resets
on ordinary reload, matching the existing local-state contract. No storage or
cache-namespace change was introduced by this component. Other calculator/legacy
paths were source reviewed, not all manually exercised.

## Visual and keyboard evidence

Screenshots were inspected for375/1280 both themes,700light and Assembly961light.
No document overflow in any context. All four Bit Lab columns fit without a lateral
search and exceed40px in height. Assembly whole decimal register values remain one
line and contained even at961's two-column breakpoint; all32 BitRow cells fit.
At961 the three values are4294967295,4294967295,4294967294, each one line with zero
measured overflow. Continuous source→ALU→destination paths and arrowheads are
visible; destination caption stays clear (12px SVG-coordinate gap at961).
Space/Enter operation, focus and scroll behavior were checked for representative
execution/reset and column controls. No page or console errors in recorded matrix.

**Accepted finding, pending final check:** selected Assembly bit button on hover,
375dark, has text rgb(7,18,15) on background rgb(12,17,16), versus unhovered accent
background rgb(95,211,192). Generic `.button:hover:not(:disabled)` supersedes the
selected background. Evidence: assembly-dark-hover-selected.png. Parent accepted a
scoped selected-hover rule preserving the selected palette and a regression test.
This report will record the independent rebuilt recheck separately.

## Reviewer-command corrections and evidence limits

Initial Assembly review harness failed because an unscoped [data-register] query
also selected the shared BitRow wrapper. Narrowing to .al-add-registers fixed the
harness; the corrected full matrix passed. Initial gate oracle array assumed text
proof order, whereas SVG gate DOM order differs. Comparing by each gate's semantic
name fixed that reviewer error; all8x5 named checks passed. Neither failure exposed
a product numeric defect. Both originals are described rather than represented as
initial successful checks.

This is Chromium desktop automation with phone-sized viewports and expert visual
inspection. No novice learning session, actual touch hardware, screen-reader speech,
other browser engine or fresh exhaustive ISA audit is claimed. Full-suite/CI outcomes
must be added by the managing implementers, not inferred from focused checks.

## Independent final correction recheck

The parent added a scoped selected-hover rule and rebuilt the actual Assembly
production assets. Final independent browser checks at 375/700/1280 in both light
and dark passed. Hovered and idle selected palettes match; measured text contrast
exceeds 4.5:1 in each case (dark: 10.49:1). Space retains the selection, focus and
scroll position. Final screenshot confirms the previously lost dark label is
readable. Evidence: assembly-hover-final.cjs/json/log and
assembly-375-dark-final-hover.png. The accepted finding is closed.

The first recheck sampled during the normal CSS color transition and failed a
strict equality comparison. Allowing that transition to complete corrected the
review harness; the six-context recheck then passed. No additional product change
was needed. The original matrix's numeric/state results remain applicable because
the final product correction changed only the selected-hover CSS selector.
