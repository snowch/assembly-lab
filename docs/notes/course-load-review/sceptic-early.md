# Independent challenge: early course (00–08)

Review of snapshot f1fdf35, bounded to readers 00–08, proposals 1, 2 and 8, and the report's opening judgement. No application changes, rebuild, challenge solutions or external compilation. Outcomes below distinguish a reproducible presentation/sequence fact from an inference about learning. “Accept” does not establish novice failure rates.

## Evidence and independent prerequisite pass

Read AGENTS.md, CLAUDE.md, review brief, every assigned reader note, proposals and report opening. Checked entry requirements in `apps/course/src/strings.ts:33–51`, relevant lesson prose/data, source associations, shared renderers, `packages/machine/src/run.ts` arithmetic/shift/condition/select implementation, and `regs.ts` names/aliases. `docs/sources.md` identifies the Arm/AAPCS, GNU, recorded GCC and C evidence; this review does not replace the recorded differential checks or independently consult the entire Arm manual.

The entry baseline includes binary conversion and small C functions, conditionals, loops and arrays; assembly, compiler installation, pointers and library knowledge are expressly unnecessary. I checked these potential hidden prerequisites rather than assuming them:

- Register operand ordering is genuinely unavailable before Module 0's first prediction. `meet-the-machine.prose.ts` says only “It adds two register values and stores the result”; `StepperFigure.tsx:505` exposes the compact operand explanation at the first completed step. This supports a discovery-framing concern, not a blocked prerequisite claim.
- GCC is introduced as “a C compiler” in Module 0's question. The optional compiler note defines `-O1`; crucially, the required generalisation also says “`-O0` and `-O1` are two of GCC's optimisation settings” and defines their role. Later references therefore have prior teaching even if the optional note was never opened.
- `one-pattern-three-readings.prose.ts:24–28` teaches hexadecimal, `0x`, bit 31 and signed weighting. These are credited in all following lessons. The first labels precede the full definition briefly, but no independent manipulation requires an unexplained reading.
- `constants-and-widths.prose.ts:11,45–46,72–74` explicitly explains `void`, remainder, optional `#`, target-specific `long` and `u`. The wide view and upper-half clearing are taught there. No external assembler or compiler command is required for the core activity.
- Masks defines symbolic warning names, `&`, `~`, `|`, `^` and `<<` before applying them; it defines fields, standalone `lsl`, C `>>` and `ubfx` locally. “No firm missing prerequisite” survives, although no prior *practice* of field replacement exists.
- Shifts locally teaches C division rounding and the shifted `add` operand, including that forming it does not change its source. Do not label these silent C/assembly prerequisites.
- Compare locally defines the conditional C expression and `bool`; `cmp` explicitly reuses subtraction flags. Branches defines `wzr`, labels and branch rules before its first path question, then `cmn` before investigating the other path. Its construction defines `cbz` and label-writing conventions locally. Optional `void`/call material is marked and explained. No additional essential unexplained knowledge was confirmed in my pass.

Live bounded inspection used Chromium at 375×900, rendered dark background `rgb(16, 22, 21)`, against `http://localhost:4210/assembly-lab/`: fresh page states for meet-the-machine, masks, adding-and-the-flags, branches, compare-and-choose and shifts; committed first mask and shift predictions; inspected the released feedback and experiment ordering. I did not repeat the readers' four-context matrix. Independently viewed saved phone screenshots `subtracting-and-the-tick-counter-375-dark-columns.png` and `masks-375-light-investigate.png`; they substantiate small-cell inspection costs and the mitigating textual readouts. All saved artifacts cited here are under `/tmp/course-load-review/`.

## Per-note challenge ledger

### 00 — Meet the machine

**M0-1: downgrade medium candidate to low framing/design option.** The unavailable destination convention is real. However, the question is explicitly a prediction, any answer releases feedback and the worked explanation, and no successful inference is needed to continue. The wrong alternatives surface useful storage misconceptions. Requiring explicit “best guess” wording for every novel prediction is not established by the brief. If changing it, use the existing failure experiment's discovery framing; do not put the answer above the question. Reject the inference that this is a medium blocked first attempt.

**Long first worked state: retain as design recommendation only.** The multiple representations can require tracking and horizontal movement, particularly in the user's reported phone context. The instruction is repeated near the next question; bits and reads/writes are optional; detail closes on advance. These directly challenge a general persistent-density claim. Height and four registers do not establish overload. A compact operation prototype is reasonable, not a necessary replacement proven by this review.

**Keep claims: accept.** Decimal default, model-derived operand diagram, focused subsequent destination questions, bounded editor, deliberate missing-return experiment and later trace all have distinct instructional jobs. Reject a blanket answer-disclosure or instruction-count finding.

### 01 — Same bits, two readings

**Experiment-to-construction switching: accept low, qualify scope.** `one-pattern-three-readings.prose.ts:35` explicitly directs the learner to the earlier experiment; `RegisterReader` and `AnswerEditor` maintain separate state. Following that advice incurs navigation and re-entry. But scratch use is optional: the taught top-bit rule supports a direct attempt. This is a support-location inconvenience, not mandatory duplicate work or inability to construct the pattern. An adjacent optional scratch area is the smallest candidate; transferring a pattern requires care to preserve an independent attempt.

**Four-bit rehearsal: retain optional, no medium finding.** Binary weighting is entry knowledge; the hexadecimal digit mapping and worked grouped pattern precede use. No evidence requires another checkpoint. Keep the grouped bits/digits, optional calculation, top-bit decomposition, familiar subtraction and committed prediction gates. Reject splitting notation and signed readings solely because both appear here.

### 02 — Constants and widths

**Upper-half clearing framed as recall: downgrade low finding to optional framing judgement.** The behaviour is new, but “prediction” plus a wrong-answer-permitted gate can intentionally discover it. The alias explanation does not promise preservation. No incorrect interface state or required success is demonstrated. Explicit discovery wording could help; withholding the architectural rule is not itself a fault.

**Repeated final instruction sequence: accept low presentational duplication.** `constants-and-widths.prose.ts:78–80` repeats the sequence supplied by the challenge listing. Keep the final temporal instruction and let the listing carry the operations. Do not infer that the four-step synthesis is too hard.

**Decomposition checkpoint/# relocation: optional only.** The worked halves and explicit remainder definition precede writing. Multiple arithmetic/syntax operations here have preparation. Keep the sufficient-rule wording, assembler tester, stepped preserved/written halves and wide/narrow diagram. No missing prerequisite or required separate lesson survives.

### 03 — Adding and the four flags

**Rule/reference distance: accept obstacle, downgrade medium to low on current evidence.** The four definitions at `adding-and-the-flags.prose.ts:27–32` are separated from the twelve grouped inputs by the adder; live construction text confirms labels but no local rules. A compact unworked reference beside the fields is justified. Nevertheless the task groups cases and flags, identifies wrong flags and preserves correct responses; scrolling to a previously taught rule alone does not demonstrate *substantial* tracking failure. Keep three cases; a one-case-first alternative remains a trial proposal.

**Keep claims: accept.** The first question applies prior signed/unsigned knowledge, not four unexplained flags. Column controls advance arithmetic rather than machine instructions; the source makes that distinction. The persistence experiment isolates one new lifetime rule; optional future `cmn`/`cset` material is not needed. Reject four-flags/opcode-count overload and blanket worked-example spoiler claims.

### 04 — Subtracting and the tick counter

**Compressed phone grid: accept low.** The saved partial-column screenshot shows closely packed original/transformed operand rows; comparing aligned bits needs care. The selected-column card explicitly gives each operand, carry, total and kept result, and the controls are visible with it. This contradicts any claim that the only usable detail is a tiny grid. The reader's height measurement belongs to the completed state, not every state. A selected-group enlargement is an optional treatment of a concrete inspection cost, not proof the whole calculation must be split.

**Sequence proposals: accept current four-bit-to-32-bit bridge; retain no-borrow checkpoint and moving the proof as optional.** The completed adders are labelled worked final states, not spoiled independent questions. Signed negation reuses earlier range/V knowledge and has its own gate. There is no demonstrated necessity to reorder it. Keep the ring/strip, full-turn assumption, familiar adder and separate negation prediction.

### 05 — Masks and fields

**Experiment follows field-reading detour: accept medium avoidable switching.** `masks.prose.ts:37–49` promises the basic combination figure, then introduces field/shift/extraction and a 64-bit listing qualification before that figure. The learner returns to simpler warning logic after a different task. This is stronger than a count: it is a specific interruption between stated rules and their associated manipulation. Move the existing bit-operation experiment directly after its rules, then put field prose with its diagram.

**Field-writing construction: downgrade “confirmed medium overload” to medium-priority design hypothesis.** The jump is substantial: no earlier field-write rehearsal, several subgoals and out-of-range containment from a `ret` starter. But rule selection and decomposition are precisely the construction's purpose; its task explicitly specifies low-three-bit containment, the worked read demonstrates positioning, and graduated hints supply decomposition before full code. Lack of a prior equivalent worked program does not establish an unreasonable attempt. A guided in-range first task followed by containment is a worthwhile prototype, not a proven prerequisite repair. Preserve meaningful synthesis and the existing failure experiment.

**Tiny full-width operation rows: accept low.** Saved screenshot visibly compresses columns; the local rule, numeric values, selected-bit sentence and semantic table mitigate it. Prefer a readable active byte with optional full-width inspection, but do not hide evidence needed by another preset.

**Keep claims: accept with correction.** Prediction gates, synchronous function/rule changes, field diagram, own-attempt stepping and post-success BFI comparison are justified. However the praised prediction's “low-byte-first” staging is incomplete: live committed mask feedback shows full-width before/after rows *and then* the low-byte mask diagram. `ProbePrediction.tsx:94–120` renders both outcome rows and `maskView`. Record this sibling of 06's duplication as low presentation cost; preserve mask/input/result causal evidence rather than simply deleting the useful mask diagram.

### 06 — Shifts

**Duplicate starting register after commit: accept low.** Live committed state has “w0 when the call starts” and identical “w0 before”; `ProbePrediction.tsx:64–80` renders start independently of stored outcome. Both are labelled, so reject any state-ambiguity or blocked-comparison escalation. Keep one adjacent before/after pair after commitment; inspect mask-view sibling above.

**Initial lsl versus preceding asr: optional continuity improvement.** Selection and direction are explicit, and `lsl` is prior learning. No misleading preset established. **Six-result staging: optional only**, since grouping, local rounding rule and experiment support exist. **Tiny rows: no additional defect confirmed** beyond the bounded inspection concern; loss/fill text externalises the pertinent fact. Accept all seven keep/sequence points, including shifted-operand synthesis and genuine gates; reject novelty by opcode or field count.

### 07 — Compare and choose

**Opening repeated representations: accept low.** Source and live initial state show complete C, raw assembly and paired results; prediction repeats the paired material. Consistency protects against false-run confusion, but another whole listing adds little to the same question. Keep one complete paired representation by the attempt, including provenance access.

**Repeated flags inside/outside Compare stage: accept low from source and reader state evidence.** `StepperFigure.tsx:497` renders flags while `panels.tsx:105` supplies compare-stage state. Two consistent flag rows can support local comparison as well as cost space; no medium failure follows. Avoid duplicate full rows only while preserving the standalone stepper and stage explanation.

**Extra conditions and compiler-generalisation relocation: optional only.** Initial explorer groups six rules and secondary catalogue is closed; core construction can reuse taught conditions and source order. `cmp` reuses `subs`, so compare/condition/select is one supported chain. Accept the reader's keeps and reject a premature first-prediction finding: it asks which listing part changes, not execution of all unexplained conditions.

### 08 — Branches

**Opening source-attribution diversion: accept medium as sequence judgement.** `branches.prose.ts:12–16`, confirmed in the live initial page, makes the learner parse teaching versus original debug associations before defining the first branch. The raw listing duplicates the complete pair. Prior knowledge of source pairing means the idea is not wholly new, but the disputed associations concern the unfamiliar operations and interrupt the stated flow-control question. Make that detailed discrepancy secondary beside compiler references; preserve the checked pairing and complete motivating function. No need to remove the authentic mixed branch/select program.

**Construction skeleton or cbz rehearsal: optional trial, no confirmed missing prerequisite.** `cbz` and labels are explained locally, conditions and assembly editing are earlier practice, and overlapping C tests are entry knowledge. Moving from tracing to construction raises task demand deliberately. **Phone horizontal pair: reject independent defect**, because it follows binding paired-listing policy and the current operation is restated beside controls. Accept keep points concerning path arrows, skipped/not-reached distinctions, presets, boundary comparison, local construction guidance and final transfer. First path does not require executing `cmn`; no blanket unfamiliar-opcode objection survives.

## Managing proposals and report opening

**Proposal 1: accept a prototype direction, reject presenting its full sequence as established best sequence.** The user's repeated confusion gives an appropriate reason to test a smaller primitive activity. Assembly-only operations respect the current pairing rule. But addition → storage reuse → subtraction → sequencing → convention → whole function is one design, not a causal conclusion from these reviews. Module 0 already gives computed first-step support and bounded subsequent questions. Trial a compact first operation and observe tracing before committing to all proposed stages.

**Proposal 2: accept moving the existing logic experiment; accept staged field-writing as a candidate only.** These have different evidential strengths, as 05 records. Do not merge a confirmed interruption with a proven excessive-novelty claim. Keep out-of-range containment and BFI as later synthesis/comparison, without implying current hints are unavailable.

**Proposal 8: accept as a review guardrail, with no independent claim about later lessons inspected here.** Familiar mechanisms should combine; a wrong permitted prediction can be diagnostic. This directly prevents inflating 00, 02, 06–08 into prerequisite or spoiler findings.

**Report opening: qualify.** “Split attention” is supported by specific early examples, especially masks' interrupted rule-to-experiment sequence and branches' source-attribution diversion. “Premature composition” is an instructional hypothesis for masks and Module 0, not established novice inability. “One new mental model at a time” is too categorical as a finding: related representations/mechanisms may need joint teaching, and the course explicitly calls for synthesis. Prefer a small first application of a newly introduced mechanism before demanding a larger composition where trial evidence supports it. The report already labels the precise Module 0 redesign a recommendation rather than measured outcome; preserve that qualification prominently. Figure heights, item counts and prediction-first ordering cannot establish the general opening diagnosis by themselves.

## Limits

This is a sceptical evidence check, not a novice trial, fresh four-theme/width audit, exhaustive interaction regression or architecture certification. Several accepted local presentation findings rely on source plus the readers' browser records rather than my replay of every state. I did not solve constructions, inspect all restored/reset states or validate every numerical input. No conclusion about learning-outcome magnitude, accessibility compliance, or the later course follows from this bounded pass. Proposed directions remain recommendations; no implementation or policy change is authorised.
