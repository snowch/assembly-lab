# Shared wording and state audit

18 October 2026; source HEAD `6d757f5`; built site `http://localhost:4290/assembly-lab/`.
Independent candidate report, not a final verdict. No repository files edited. Read CLAUDE.md, docs/style.md, the shared strings/renderer/control implementations, and the two previous review summaries. Browser checks below used fresh contexts at 375×900 and 1280×900 with system light/dark (four configurations). This is a shared-component review, not 24 whole-lesson reviews.

## S1 — Medium candidate: the generic step note describes the wrong interaction

**Locations:** `packages/views/src/strings.ts:11–16`; `content/lessons/one-pattern-three-readings.ts:73–76`; `content/lessons/adding-and-the-flags.ts:93–97`; role/note selection `platform/lesson-runtime/src/LessonView.tsx:68–80`.

**Rendered evidence:** On Module 1, `#ix-predict-add-12` still has “STEPPED” above its question. Opening it shows “Each step runs one instruction in the simulator. Between steps, the simulated processor stays as the last instruction left it.” Its interaction is selecting an option then “Check your prediction”, with no stepping controls. The Module 0 role correction was not applied to these later prediction records.

Stronger manifestation: `#ix-add-columns` in Adding and the four flags displays the identical note. Its controls say “Next column” and “Next group of four”; one press reveals only Column 0's arithmetic and leaves the flags pending. `AdderFigure.tsx:432–462` advances the count of displayed bit columns, not the executed-instruction index. I independently confirmed this in all four browser configurations after the coordinator alerted me to reader03's candidate. The note is opened inside this figure's caption, not an elsewhere-scoped simulator explanation.

**Why it matters:** One visible label now means three interactions: choose/check, execute one instruction, reveal part of one instruction's arithmetic. The adder can teach an incorrect unit of execution. Later flags prose correctly says one `adds` writes all flags, and the end note says the drawing shows arithmetic rather than a circuit; those qualifications do not make the local generic disclosure describe this control accurately.

**Prerequisites:** Module 0 has established that Next executes one instruction. This is an inconsistent application of a known concept, not missing prerequisite knowledge.

**Smallest direction:** Apply the existing Prediction role to later prediction cards, including comparison predictions. Give arithmetic-reveal figures an accurate role/note identifying their columns as parts of one instruction's calculation. Preserve the simulator model and true instruction steppers. Treat this as one systemic finding, not one per card.

**Evidence:** `/tmp/shared-badge-{375,1280}-{light,dark}.png`; `/tmp/shared-adder-{375,1280}-{light,dark}.png`; `/tmp/shared-adder.json`. New candidate relative to prior English-review IDs; the earlier L4 concerned untaught flags in the note and is resolved.

## S2 — Medium candidate: “Changed” sometimes means “written with the same value”

**Locations:** `packages/views/src/strings.module0.ts:54`; `packages/views/src/strings.ts:22`; `packages/views/src/parts.tsx:111–115`; `packages/views/src/trace.ts:128–139`; `packages/views/src/interactives/CompilerPlayground.tsx:234–237`.

**Rendered setup, not a challenge solution:** Open From C to instructions, check its prerequisite prediction, and use the free compiler playground to compile `unsigned same(unsigned x) { return x; }` with input 6. Run it and advance twice. The first instruction copies the input to a temporary; the second writes that same value back to the return register. The w0 card shows 6 both before and after the second step, but now explicitly says “Changed”. Reproduced in all four configurations.

**Source check:** `viewAt` creates `written` from every register-write event; it does not compare before/after values. The compiler and other steppers pass `view.written.has(n)` as the primitive's `changed` prop. DecimalRegister prints “Changed”; RegisterRow supplies “Changed by the last instruction” as its tooltip. FlagsRow, in contrast, checks whether flag values actually differ. Therefore this is a shared semantics mismatch rather than merely a custom-program edge case.

**Why it matters:** A learner following values can see a label asserting a change while the value stays identical. It blurs the difference between executing a write and changing stored bits, exactly the state distinction the recent total fix aimed to clarify.

**Prerequisites:** By Module 0, a register contains a value and an instruction writes its result to a register. No additional specialist knowledge should be needed to interpret the label.

**Smallest direction:** Label tracked write events as writes, or separately track actual value changes. Preserve the useful indication that an instruction wrote a destination even when its bits remain equal. Check captions that describe the same outline as a value change.

**Evidence:** `/tmp/shared-written-{375,1280}-{light,dark}.png`, `/tmp/shared-evidence.json`. New candidate relative to the earlier English-review IDs.

## S3 — Low candidate: a caption describes the after-state while the initial figure shows the before-state

**Location:** `content/lessons/one-pattern-three-readings.labels.ts:28`; context `one-pattern-three-readings.prose.ts:9–16`; initial state determined by shared StepperFigure.

**Rendered evidence:** The first figure's caption says “fuel_used_wrong(50, 38) as first written; w0 after its subtraction.” On initial load its w0 card shows 50, and its status says “Press Next to run the first instruction.” The prose directly above discusses the subtraction result. This mismatch is present in all four configurations; pressing Next resolves it, so it is low rather than blocked learning.

**Why it matters:** The learner must infer that the caption names a future state, not the currently displayed state. That is the same missing execution-point problem as the previous total question, although the control status supplies a way out.

**Prerequisites:** The learner knows stepping from Module 0. That makes this a local caption/state mismatch, not a request to teach stepping again.

**Smallest direction:** Make the caption describe stepping through the run and identify when to inspect the post-subtraction value, or make the displayed initial state match the caption without weakening a prediction gate. No new numerical explanation needed.

**Evidence:** `/tmp/shared-initial-{375,1280}-{light,dark}.png`; `/tmp/shared-evidence.json`. New candidate relative to earlier IDs. Do not merge it into resolved L1 about total; this is another execution-point occurrence.

## S4 — Low candidate: the compiler step status prints Markdown punctuation as code text

**Location:** `packages/views/src/interactives/CompilerPlayground.tsx:215–220`; source string `packages/views/src/strings.ts:63` (the ran function).

**Rendered evidence:** The same free playground run prints literal backticks around the executed instruction in the “Ran …” status, while the “Next …” card above renders instruction code normally. Seen in all four configurations, including `/tmp/shared-written-375-dark.png`.

**Why it matters:** This is a small presentation inconsistency: punctuation used to encode formatting appears as if it is part of assembly. It is especially unfortunate beside the otherwise carefully paired instruction view. It does not block understanding.

**Prerequisites:** Assembly syntax has been introduced; Markdown syntax has not, and learners should not need it to read the status.

**Smallest direction:** Render this shared Markdown-bearing status through the same code-span helper used by the other steppers. No prose rewrite or new explanation required. New candidate, separate from the old L22 “chips” wording.

## Resolved and retained context

- Prior **L1** is resolved: Module 0 now asks “After the first instruction runs, where is the value of total kept?” Its caption also specifies that moment. Verified rendered in all four configurations.
- Prior **L3** is resolved in source: captions no longer depend on a “dark line-number chip”; the teaching view uses paired operations.
- Prior **L4** is resolved: the generic simulator note now avoids the premature flags/memory terminology. S1 concerns where that corrected note is applied, not its removed vocabulary.
- The recent **offline-readiness** correction is clear in the built page: it names automatic whole-course download, explains that individual lessons need not be opened, and gives the exact ready message. Preparing and ready states were observed across fresh contexts; this audit is not a separate network/offline functional test.
- The recorded teaching links, optional original compiler references, multi-statement qualification and complete-source access are present in the reviewed shared renderer. No candidate here asks to replace checked mappings with raw GCC line tags or force one C statement per instruction.
- Prior L22 (“the chips can build”) remains in the Tap editor source, as do earlier diagnostic candidates. Those are already tracked; I did not duplicate them as new findings or rerun their browser probes.
- Prior M6 hint-heading concerns remain a separate existing backlog; this pass did not enumerate new hint instances.

No challenge answers are included in this report. Screenshots of unchecked prediction cards show their offered choices but do not identify an answer. No content or executable code changed, so no automated suite was rerun.
