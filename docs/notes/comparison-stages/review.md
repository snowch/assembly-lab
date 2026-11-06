# Comparison stages: independent review

Copyright © 2026 Christopher Snow

Reviewed 6 November 2026 by a separate Codex reviewer using the inherited model
and effort. This reviewer did not draft the changed copy or implement the
component. Learner and technical passes were conducted separately. No product
files or learner prose were edited in this review.

## Scope and conclusion

The final built activity gives source inspection, instruction prediction and
calling the functions distinct, discoverable places. No supported high, medium
or low severity finding remains within this change's scope.

Read `AGENTS.md`, `CLAUDE.md`, `docs/style.md`, `docs/authoring.md`,
`docs/visual-language.md`, `docs/sources.md`, the published
`arithmetic-on-register-bits` composition and copy, its recorded listings,
`ListingCompare`, `PredictionBox`, call-result strings, CSS and focused tests.
Read the relevant earlier Fundamentals, hexadecimal, signed/unsigned readings
and four-bit arithmetic material, including the published lesson ordering.

Browser checks used the frozen production build at
`http://localhost:4381/assembly-lab/#/lesson/arithmetic-on-register-bits`.
The managing session confirmed the build was frozen before these checks. The
subsequent geometry-test assertion change did not alter production files.

## Learner pass

- **Discoverability and grouping:** “Inspect the functions”, “Predict the
  instructions” and “Call and compare” are visible before commitment. The call
  guidance names its prerequisite and the visible control. A learner can see
  the next activity while its execution remains gated. Prediction feedback and
  its instruction summary stay in the prediction group; returned bits, C
  values, meanings and the weight calculation stay with the call controls.
  Source inspection remains the first group in initial, committed and executed
  states. Commitment adds paired instructions there without relocating the
  group. The call introduction remains outside prediction feedback throughout.
- **Spacing:** in all four browser configurations, consecutive stage boxes have
  a 16 px gap. Each later stage adds a 1 px rule and 16 px top padding. Its
  heading therefore starts 33 px below the preceding stage's bottom. Internal
  grid gaps are 12 px. The screenshots show a readable separation in both
  themes before and after results appear. This is a measured description, not
  a newly invented course-wide spacing requirement.
- **Sentence pass:** the moved guidance uses short active directions, the
  control's exact name and rendered emphasis. The headings name concrete
  activities. It adds no number, new technical term or claim about execution.
- **Understanding pass:** the moved guidance explains what to compare and how
  the calculation relates to the returned values. It does not expose the
  instruction comparison or numerical results before either gate. Starting
  arguments retain their explicit independent-call label.

### Preparation and assumed knowledge

No unexplained prerequisite was found in the changed headings or guidance.
The necessary preparation was checked rather than inferred from the reviewer's
own programming knowledge:

| Knowledge used here | Earlier preparation or local explanation |
| --- | --- |
| GCC, a listing and the optimisation setting | `fundamentals.prose.ts`, function introduction: “GCC, a compiler” and the explanation of `-O1`; local “Which compiler?” details retain exact recording settings |
| Arguments, incoming registers and the returned register | Fundamentals defines “argument”, demonstrates one- and two-argument complete functions, and gives a fresh tracing task |
| Subtraction operand order and register reuse | Fundamentals subtraction and sequence activities define, demonstrate and practise both mechanisms |
| Hexadecimal register display | The earlier published `one-pattern-three-readings` activity teaches this display |
| Signed and unsigned readings, positional weights and the highest bit | `same-bits-two-readings` defines them, demonstrates a complete small pattern, supplies fresh practice and bridges to a fresh register pattern |
| Subtraction with a fixed number of places | `four-bit-arithmetic` demonstrates the same subtraction at small width and supplies a fresh subtraction task; its final bridge explicitly moves to 32 places |
| Bare `unsigned`, selected target width and C type readings | The current lesson explains these immediately before the figure |
| Independent calls rather than one stateful instruction sequence | The caption and starting-arguments label both state this locally |

The smallest complete candidate is already present: the preceding four-bit
subtraction, following the small-pattern signed/unsigned examples. That bridge
has been defined, demonstrated and practised before this page composes it with
C types and complete functions. Repeating another arithmetic walkthrough here
would not repair an identified preparation gap. This is a review judgement;
no observation of a novice learner was conducted.

## Technical pass

- The schema adds an optional introduction with an empty default. Existing call
  configurations can omit it. The published lesson supplies the moved prose;
  it is removed from prediction feedback rather than duplicated there.
- `compareListings` still assembles and compares the recorded instructions.
  Prediction commitment still controls instruction disclosure. Selection alone
  exposes neither listings nor results. Both possible submitted choices reveal
  the comparison, with matching or non-matching feedback as appropriate.
- The call control is disabled before commitment and after execution. Its
  handler also checks those states. Both independent traces retain their own
  entry names and the same starting arguments. Results still require both
  commitment and the explicit call action, and are recomputed from model state.
- Independently executed both recorded programs through `traceOf`, then checked
  each browser's rendered typed values against those runs. No result number is
  supplied by the new labels or guidance. Call execution by keyboard Space
  succeeds without moving the page in all four configurations.
- The recorded C, instruction order, original compiler references and checked
  teaching associations are unchanged. Read the original Compiler Explorer
  requests and responses; the displayed operation sequence agrees with the
  recordings. The shared renderer keeps all four numbered C lines and both
  checked instruction associations for each function.
- Read the locally retained N3096 text, §§6.2.5p11 and 6.5p5. The local distinction
  between defined unsigned wrap and an out-of-range signed calculation remains
  consistent with those clauses. The new copy changes no C or Arm semantic
  claim. Existing model and native-corpus coverage for these recordings remains
  in place; this review did not rerun GNU/QEMU.
- The non-call branch retains its two C panes, prediction, comparison rows,
  summary and optional complete paired listings. Its stage-specific CSS is
  scoped to the call-stage wrapper. The only non-call content use found is in
  retained `SOURCE_LESSONS`, superseded in the published sequence. This branch
  was inspected in source; there is no published non-call route to claim as a
  browser check.

## Browser evidence

Chromium at 375 × 900 and 1280 × 900, each in light and dark themes. The actual
root theme and computed body background were checked, not just the stored
preference. Backgrounds were respectively `rgb(243, 246, 245)` and
`rgb(16, 22, 21)`.

Each configuration checked all nine states:

1. Initial, with the three headings and disabled call control visible.
2. Submitted prediction that matches the model, before calling.
3. Calls executed.
4. Executed state restored by reloading.
5. Reset calls, preserving the prediction and listings.
6. Reset-call state restored by reloading.
7. Lesson storage cleared and reloaded, closing both gates.
8. Submitted prediction that differs from the model, before calling.
9. Calls executed after that differing prediction.

All 36 state/configuration checks passed. Page scroll width equalled the
viewport in every state, and no browser page error occurred. Complete paired
listings remain horizontal: on phones their 588 px contents scroll within a
317 px container; on desktop all contents fit within 942 px. Also scrolled both
phone listings to the instructions in both themes and verified the instruction
pane remained beside its C pane, with the complete numbered C still in the same
contained listing and checked C-line tags present. Viewed initial, committed,
non-matching and executed screenshots across both widths and themes; viewed the
scrolled phone source directly as well.

Evidence lives outside the product tree:

- `/workspace/scratch/comparison-stages-review.cjs`
- `/workspace/scratch/comparison-stages-review/report.json`
- `/workspace/scratch/comparison-stages-review/scrolled.json`
- `/workspace/scratch/comparison-stages-review/model.json`
- `/workspace/scratch/comparison-stages-review/model-browser.json`
- `/workspace/scratch/comparison-stages-review/*-initial.png`,
  `*-matching.png`, `*-different-prediction.png`, `*-executed.png` and
  `*-source-scrolled.png`

The first independent browser probe exited 1 because its provisional assertion
required at least 20 px of stage padding alone. Inspection measured the actual
16 px padding plus border and external gap. The probe was corrected to test
positive padding, a visible rule and non-overlap; a separate browser check
confirmed the 33 px heading separation. The rerun passed. This was a mistaken
probe assumption, not a production failure; the original exit status remains 1.

## Rejected concerns and limits

- **Early call control leaks the result:** rejected. It is discoverable while
  disabled, and names the action without revealing instructions or values.
  Browser and source checks both confirm the two gates.
- **Phone listings lose their instructions:** rejected. They use the existing
  horizontally contained renderer, as taught in Fundamentals. Active scrolling
  exposed both instruction panes while page width remained contained.
- **Three headings fragment the lesson outline:** rejected for this change.
  These are local activity groups inside one comparison figure, with different
  controls and evidence, rather than additional prose-only lesson sections.
- This review did not run a full unit suite, educational suite, screen reader,
  Firefox/WebKit, physical hardware or novice study. Full-suite and focused
  product-test outcomes belong in the managing session's validation record,
  separately from these independent browser/model checks. Lesson-wide reset was
  checked by clearing lesson storage and reloading; the visible **Reset calls**
  control was exercised directly. The retained non-call branch is source-only
  coverage, as described above.
