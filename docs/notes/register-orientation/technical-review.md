# Independent technical and sceptic review

Reviewer: `register_intro_technical`, separate from copy and component authors. Reviewed
24 October 2026. Scope: opening register/memory explanation, width schematic and reference/follow-up
links; corresponding introductory sentence in Constants and widths; metadata, term gate and tests.

## Verdict

No blocking technical finding in the reviewed source and final built page.

- The count is explicitly **general-purpose integer** registers, rather than all Arm registers.
  AArch64 is introduced as Arm's 64-bit mode. Other register roles are acknowledged without
  introducing their names or machinery. Independently fetched Arm's AAPCS64 §6.1.1 from its official
  `ARM-software/abi-aa` repository: it specifies thirty-one 64-bit general integer registers and
  the x0–x30/w0–w30 naming distinction. The simulator's state has 31 slots, and its unchanged
  register parser maps corresponding names to the same index with widths 64 and 32; x31 is rejected.
- The schematic displays architecture metadata obtained from that parser. Its public export is
  the only machine-package change; parsing and execution logic are unchanged. The full register
  encloses the lower-width name in a single frame. It displays no instruction, pattern, input,
  computed result, execution marker or write colour. Thus it neither scripts a run nor suggests
  two independent stores.
- The caption states the rule for corresponding x/w names, so later w1/w2 use follows from a
  general rule rather than an unexplained extension of w0. The source and diagram do not reveal
  what a later write through a w name does to the upper half. The existing width prediction
  therefore retains its new question.
- Memory is defined before it is used. The prose explains that an add cannot consume a value
  directly from memory; it does not claim that all operands must be register names, forbid an
  immediate operand, or require every result to be stored back. The worked example explicitly
  begins with the inputs already in registers. No load/store instruction or memory operation
  is invented for the schematic. The claim is consistent with the checked Arm ADD/load/store
  sources recorded in the brief and the course assembler's operand forms.
- “Small, fast store” supplies qualitative context without promising a cycle count, a fixed
  latency advantage or a particular processor implementation. It does not claim the architectural
  count equals the physical registers of an out-of-order processor.
- Both official manual links remain optional sources, rather than prerequisites for the next
  action. The coordinating source check recorded their redirect and inability to extract their
  landing-page text; this review does not claim to have read those dynamic landing pages. The
  count/naming check uses readable official AAPCS64 and executable model metadata instead.
- The named link reaches Constants and widths, Module 1's second lesson, whose section is named
  Two names, one register. The sibling sentence now refers specifically to previous arithmetic
  w-name examples, avoiding a false claim that every earlier figure displayed only 32 bits.
  The rest of the detailed experiment is unchanged.

## Sceptic decisions

Rejected: the `constant` exemption silently moves an arithmetic concept earlier. It is scoped to
this lesson because the exact word occurs only in the linked future lesson title/route. A focused
term-use test enforces that scope. No definition, instruction or constant-fitting rule moves into
the opening. This is a cross-reference label, not an unexplained operand concept.

Rejected: the schematic supplies the later write-width prediction's answer. It explains shared
storage and selected width but does not describe the upper half after a write. No concrete machine
value appears. Fresh arithmetic practice remains distinct and unanswered.

Rejected: this requires new simulated programs or a new native corpus call. It exposes existing
register-name metadata and changes no instruction list, call or simulated state transition.

## Executed verification

Independent command:

`npx vitest run packages/views/src/register-views.test.tsx content/lessons/fundamentals.test.ts content/lessons/constants-and-widths.prose.test.ts content/lessons/meet-the-machine.test.tsx`

Four files, **38 passed**, no failed/skipped cases. This checks naming boundaries, schema, canonical
prose, model-derived count/width pins, the guarded term exemption and existing synthesis content.
It is a focused run, not a full-suite or hardware execution claim.

Final built-page checker at `http://localhost:4340/assembly-lab/`: Chromium, 375 and 1280 CSS pixels,
actual light and dark verified in four fresh contexts. Checked the qualified count/memory text,
one accessible image, frame/half containment and geometry, no execution controls, closed/open source
references and exact URLs, named follow-up navigation and corrected sibling wording. No document
horizontal overflow or page errors. Visually inspected phone-dark and desktop-light screenshots;
labels and outlines are legible, with no execution-state styling. Evidence outside the repository:
`/tmp/register-tech-browser.mjs`, `/tmp/register-tech-browser.json`,
`/tmp/register-tech-{375,1280}-{light,dark}.png`. All four contexts passed on the first checker run.

No broader full-suite or physical-board claim is made here. Separate learner readers assess the
whole lesson's pacing and assumptions; their findings require sceptic assessment if any arise.

## Final sceptic pass over learner reports

Read `opening-reader.md` and `width-reader.md` after forming the technical verdict above.
Both reports' no-blocker conclusions are supported by the actual page, model and source checks.
The opening reader checked six width/theme contexts and the first arithmetic activity; the width
reader checked the retained prediction, unlock, two steps and reset in four contexts. Their scope
and limitations are stated rather than presented as full-suite results.

The width reader considered “Split a register's 32 bits into two halves”. Rejected as a required
correction in this change: the same paragraph sequence explicitly begins “mov w0, 30000”, and its
subject is a 32-bit constant; the figure is the w0 view. The later construction explicitly says
“With a w name”. The new earlier overview already explains that this is a selected part of a wider
register, and the detailed section repeats that identity before testing a write's effect. In that
local context the shorthand describes the selected 32 bits, rather than defining the full
register as 32-bit. This judgement does not extend the constant-building rule to an x-width
instruction or claim the phrase would be clear without its surrounding w-view context.

No reader finding requires a product edit or invalidates the built-page checks recorded above.
