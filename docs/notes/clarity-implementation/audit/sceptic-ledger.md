# Current whole-course clarity audit: sceptic ledger

Read-only audit of pushed 6d757f5, production preview on port4290. Readers are fresh, one per lesson, unprimed by earlier verdicts. Their reports record actual browser coverage. Findings below are directions for future edits, not drafted learner prose. No challenge answers are included.

## Baseline reconciliation

Earlier english-review recorded29 issues, and clarity-review-2 added06-N1. Current recent changes resolve L1(question moment), L3(theme-dependent line chip), and L4(early simulator terminology). The earlier remaining recommendations are not treated as new discoveries. Root owns shared app text audit; this ledger covers lesson candidates and prerequisite validation.

## Accepted candidates

Pending independent readers.

## Rejected or reduced candidates

Pending independent readers.

### Batch00–02 decisions

- **Accept shared S1, low in these locations:** model-guidance role mismatch on manual challenge00, bit editor01, predictions/tester02. Separate from resolved L4: current wording uses taught words, but belongs to the wrong activity. Source timeModel+no role confirms reader browser observations. Merge occurrences; adder may elevate mechanism severity when reader03 finishes. Reduce reader02 medium to low for generic misplaced help alone: questions and controls remain usable, and claim concerns simulator generally; no wrong answer induced.
- **Accept new N1, low:** opening lesson01 caption `one-pattern-three-readings.labels.ts:28` says after subtraction while fresh/reset stepper is before subtraction. Source initial-state props and four-configuration Next/Back/Reset verification agree. Existing state indicator mitigates but does not correct contradictory caption. Direction: state-independent caption or explicit point to reach.
- **Accept new N2, low:** lesson00 `meet-the-machine.prose.ts:52` says open a register; real control Show the bits changes all displays. Reader verified four configurations. Direction: name actual visible control/action.
- **Accept new N3, low:** lesson02 prose uses grouped hex with spaces; ConstantTester.tsx:26 accepts no spaces; error strings.ts:124 says decimal or hex0x, failing to identify the rejected grouping. Reader copied displayed notation in four configurations. Direction: support displayed grouping or state separator restriction in local help/error. This is a mismatch of taught representation and input contract, not an unsupported claim that the machine rejects the numeric value.

These are new locations/patterns relative to the old backlog (except general guidance theme already recently addressed only for trace-prediction). No new unsupported domain prerequisite found in00–02; reports quote where relevant terms are taught.

### Batch03 decisions

- **Accept S1 at medium overall:** adder's Next column visibly reveals one bit, while its own expanded figure note says each step executes one instruction. Both source and reader03 + independent shared browser reviewer verify. Per-step note source `strings.ts:11`, adder timeModel lines95/116. Local column prose and late model/circuit caveat help but do not correct the note attached to this control. This is a mechanism mismatch, stronger than generic unrelated help.
- **Accept new N4, low:** completed run-prediction keeps input registers displayed without visible before-state label (`RunPrediction.tsx:125–131`, call.args and aria-only heading), beside status stating simulator ran. Sceptic inspected completed phone image: actual register w0 remains initial2147483647 while outcome below describes the result; the missing visible time qualifier is concrete. Surrounding input prose mitigates; no incorrect calculation claimed. Direction: visible input-state label, preserving gate. Extent is shared RunPrediction, not only lesson03.

Reader03 found no further substantive prerequisite gap. Its optional early cmn/cset is explicitly deferred and unnecessary for tasks; reject treating that preview as missing prerequisite.

### Batch04 decisions

- **Merge into S1:** subtraction adders repeat column-vs-instruction mismatch; source and browser verified.
- **Accept new N5, low:** ring guidance appears before all complementation/borrow prose, with ring rendered only afterwards (`subtracting-and-the-tick-counter.prose.ts:27–45`, structure79 onward). Source order agrees with measured browser gap; final “two figures below” meets ring first. Direction: associate each diagram locally with its relevant explanation, preserve gates. Scope is this concrete misplaced sequence, not blanket demand to shorten pages.
- **Retain old M1/M2 independently of reader's no-further-findings:** full-sum account omits a and “second operand” conflicts with established assembly operand numbering. Earlier reading/explicit source checks show these remain. A fresh reader's omission is not evidence of resolution.

### Batch06 decisions

- **Retain old06-N1 at low, reduce reader medium:** prediction's text promises filled top marks for two cases while current card marks changed bits for one operation. Arithmetic and later investigation are correct; fix local referent/control instruction rather than redesign unless chosen. Existing baseline problem, not new.
- **Accept new N6, medium:** phone375 BitStrip moment labels break into two/three-character fragments while value gets auto width (`bits.css:479–489`, `bits.tsx:170`). Before/after distinction is present but visually hard to read. Reader screenshots both themes and desktop comparison support. Root independently viewed screenshot. Direction: normal readable temporal-label line with value/bits nearby, preserve wording significance.
- **Retain old M7 at medium, not reader low:** note conflates implementation-defined right shift and undefined signed left shifts using repeated GCC defines; practical guarantees unclear. This is the existing standards distinction, not simply jargon preference. Arithmetic-shift name in optional preview is a low first-use detail within that same correction, not an extra issue.
- Merge lingering probe-prediction/answer-only Stepped occurrences into S1.

### Batch05 decisions

- **Accept new N7, medium:** masks first committed prediction runs on all-set input then shows a second before/after diagram using15 without announcing changed input. Sceptic viewed `/tmp/masks-375-light-two-inputs.png`: same w0 before/after naming, first full input allones, second low-eight view with only lowerfour set; prose says figure shows loweight of “the word”. Data independently confirms separate call and mask input (`masks.ts:93,96`). Direction: same input across views or label separate example and initial value; preserve prediction gate.
- Merge badge finding into S1.
- **Accept new N8, low:** reflection `masks.prose.ts:115` asks two writes using x0/w0 without saying independent or sequential. Corresponding answer assumes original input for both; preceding challenge explicitly supplied independent starting states, but only locally. Known x/w aliasing makes sequential reading reasonable. Direction: state execution setup explicitly. Do not reproduce answer in learner review summary.
- Old L5/L6/L7 still stand independently; reader's “illustrative applications not skill needed” observation does not resolve L7 transfer explanation gap. These remain baseline low, not new count.

### Batch07–08 decisions

- Merge prediction badges into S1; reduce reader08 local medium to low because operation itself remains clear.
- **Accept new N9, low:** compare-and-choose.prose.ts:87–90 moves from modified ge run to original cs run with present-tense w0 state claims, only naming original function after second claim. Source confirms and browser outcome observed. Direction: identify changed example before its state/result. Existing same-input setup and closing distinction mitigate.
- **Accept new N10, low (reduce reader08 medium):** main generalisation names maybe_beep/beep whose actual program is only in closed note (`branches.prose.ts:100–108`). Need minimum setup visible or explicit transition to note. Main text still says branch controls whether another function runs, so core mechanism can be understood without opening note; low missing context, not blocked central concept.
- **Accept new N11, low:** generic branch-result feedback asks which branch sent run to label on untouched starter containing neither (`branches.prose.ts:74`, listings:59). Browser reproduced all4configs. Direction feedback must match actual submission or fall back to general result guidance. Separate from existing L9 undefined “block” and M4 equal-input feedback, but same corrective-feedback improvement category.
- Existing M4/L8/L9 remain despite readers not independently reporting them; no evidence of current fixes.

### Batch09 decisions

- Merge prediction guidance into S1.
- **Retain old L10, low:** noun trace used in counting-up.prose.ts:74 without identifying record/run. Prior mentions “Trace the call”/“Trace three results” are verbs, not definition. Reader verified rendered limit note; source search agrees. Direction use established run or define record. Existing backlog rediscovered, not new.

### Batch10–11 decisions

- Merge predictions into S1.
- **Reject additional number-of-limit request:** countdown explicitly says20 for “this trace”; final task supplies actionable stopping requirements. No promise every trace shares same limit. Reader10 correctly withheld it.
- **Accept new N12, low (reduce reader11 medium):** “Step through the load” investigation prose arrives after gated load figure, then introduces store figure beneath (`memory-and-addresses.prose.ts:24`, structure94,109–128). Specific load/store direction differs, so user must backtrack. Source and browser corroborate. Smallest fix move guidance adjacent or explicit backward reference; changing section structure not required. Local store caption/prose clearly distinguish store, preventing medium-severity false mechanism.
- Retain old M6 hints, L11 abstract termination permission, L12 technical “object/suitable type”. Fresh readers' no additional core prerequisite claim does not mean these optional/exercise wording items were fixed.

### Batch12–14 decisions

- Merge all additional prediction badges into S1; reduce reader14 local medium to low because mechanism of prediction remains clear.
- **Corrected reader13 factual error:** its initial final paragraph mistook section PREDICTION heading for figure role; actual browser text and source show STEPPED. Reader independently corrected report on followup. No inferred claim that array badge already fixed retained.
- **Accept new N13, low (reduce reader13 medium):** array byte diagram has no visible four-byte element/index groups and wraps rows unrelated to elements (`memory.css:35`, generic MemoryStepper). Sceptic viewed phone screenshot: access highlights and actual addresses correctly identify bytes, so not a false address mechanism. Local teaching diagram could make index→four-byte group relationship easier without mental reconstruction. Direction: optional element grouping/index layer for array examples, preserving bytes/access effects. Improvement, not necessary redesign of every memory figure.
- **Accept new N14, low:** sum_trips prose identifies count inw1/end-address operation but doesn't explicitly connect end-pointer test replacing C count decrement and w1 reused by load (`array-addresses.prose.ts:36–38`, arrays.listings.ts:12–17). Source association correctly leaves no instruction for eliminated decrement; retain true compiler output. Direction: explain this particular transformation/role change locally. General loop and register reuse concepts already taught, so no new global prerequisite.
- Retain old L13 limitations-note structures/allocation terminology; fresh12 reader no unsupported core knowledge does not resolve that optional first-use item.

### Batch15–16 decisions

- Merge predictions into S1, reduce15 local medium to low for misplaced note alone.
- **Retain old L14 low:** products hint “Its operands” lacks preceding instruction referent. Reader source+phone expanded hint reverified. Old L15 uninformative32bitinput test name remains source-only retained.
- **Accept new N15 low (reduce reader16 medium):** constant-division paragraph sits before two edge experiments, while matching groups_of_ten figure sits after fuel-calculation guidance (`division-and-remainders.prose.ts:36,38`, structure175–213). Source confirms; browser generalisation screenshot verifies mismatch. Caption still names correct example, so local association/backtracking issue rather than misleading unlabelled code. Direction relocate paragraph/figure together and keep fuel guidance adjacent to challenge.
- **Retain old M5 medium:** reader16 quoted earlier “writingw clears upperbits” as prerequisite, but incoming narrow argument only guarantees lowerbits; it does not say caller wrote awregister. Those are distinct events. Current exercise's need to ensure64bitdivisor lacks this explanation; root independently reverified source and actual rule. Fresh no-unsupported finding is not a rebuttal.

### Batch17 decisions

- **Accept new N16, low (reduce reader17 medium):** full stack walkthrough unlocked directly under prediction precedes stp/ldp/frame/x19 explanation in next section and is repeated there (`calls-and-returns.ts:119,139`, prose18). This is a guidance-order/duplicate-walkthrough improvement. Initial arithmetic prediction is explicitly solvable from context, and explanations follow immediately next section, so no blocked prediction or missing whole-course prerequisite. Direction consolidate first guided walkthrough after definitions or move minimum needed guidance before it.
- **Accept new N17, low:** calling-convention/AAPCS64 definition only in optional compiler provenance note, main preservation rules use acronym without introduction. Move minimum definition to main first-use path; keep provenance optional. Distinct from old M3 consecutive-address wording.
- Merge badges into S1.
- Retain old M3 medium paired64bitstore spacing and L16 low slot unit; fresh reader omission doesn't resolve them.

### Batch18/20/21 and shared decisions

- **Accept new N18, low:** recursion investigation imperative says advance until calls active, but independent figure already presets initialStep22/deepest allocation (`recursive-calls.prose.ts:18`, structure132). State is correct; caption says inspect active stack but not that it already advanced. Direction explicitly identify preset moment and descent-versus-return controls. Reader four-config initial snapshots + source agree.
- Merge further prediction badges (18,20,21) into S1. No additional core task timing gaps were found; don't demand redundant qualifiers when immediate setup names inputs/operation/return.
- **Accept shared S2, medium:** write-event markers are labelled Changed even when value is unchanged. Root independently confirmed source trace.written and browser6→6 example. Direction label write or separately distinguish changedbits, preserve write indication.
- **Accept shared S4, low:** CompilerPlayground status renders raw backticks from Markdown-bearing ran string, while neighbouring Next renders code normally. Root independently verified. Direction shared code-span renderer; no new prose.
- Retain old M6 hint headings and relevant optional vocabulary defects despite fresh core-task clean reads. No all-prerequisites-guaranteed claim made.

### Batch19 decisions

- Merge prediction note into S1; reduce local medium to low as elsewhere.
- **Accept new N19, low:** local compiler motivation calls register-to-register moves “load inputs” (`from-c-to-instructions.prose.ts:11`), while memory lesson explicitly defined load as memory→register. Source listing has no memory transfer. Direction consistent copying terminology; no instruction semantics change.
- **Retain old L17 low:** first learner use of immediate without connecting it to already taught constant. Reader independently confirmed preceding definitions. Later A32 occurrence is same first-use issue, not separate finding.

### Final batch22–23 decisions (reports complete)

- Merge22/23 actual stepping-badge occurrences into S1. A32's separate recorded-syntax prediction timeModelnone is not an occurrence.
- Merge22 retained initialw0 after outcome into N4, visible before-state label needed. Source run-prediction uses same shared renderer; not a new issue for every lesson.
- **Accept new N20, low:** A32 prediction prose explicitly directs “Run the A64 version...” before learner can use gated stepper (`same-c-on-a32.prose.ts:13`, structure after predict-a32-limit). Current question asks prediction and initial instructions require check before run. Source independently checked; reader actual fourconfig confirms. Direction tell learner to predict from C now, then run at available stepper. Keep gate; no reason to reveal answer early.
- A32 immediate occurrence merges old L17; earlier unintroduced use does not count as teaching the term.


## Completion

All24 reports exist, numbered00–23 once each. Every report states actual375/1280 light/dark browser coverage and its interaction limits. Reader13 badge factual error was corrected by that reader; coverage does not claim exhaustive inputs/solutions. Root independently reviewed the six-group summary and shared-component acceptance decisions. Final `git status --short` was empty; no repository files edited.
