# Visible call: independent technical review

Copyright © 2026 Christopher Snow

Reviewed on 27 October 2026 by a separate agent that did not write the implementation
or prose. Review used the inherited model and effort. No product files were edited.

## Verdict

Approved. No blocking technical or browser-state finding remains in the reviewed build.
The figure now demonstrates both sides of the return-address mechanism: BL writes X30,
then RET selects that address. The caller and function read the same model register bank.

## Source and model checks

- Arm Instruction Set Reference Guide 100076_0100_00_en D2.35 states that BL branches
  to its label and writes PC+4 to X30. D2.130 specifies RET's optional register operand,
  defaulting to X30. The lesson's source-language-independent explanation is supported.
- AAPCS64 2025Q4 sections 6.1.1, 6.5 and 6.9 support the register roles, BL/BLR call
  mechanism and result convention. The lesson distinguishes instruction semantics from
  the convention determining the integer-result register. It does not promise that an
  arbitrary called function preserves all registers.
- The displayed start is trace step 1, immediately before BL; the displayed end remains
  step 5, after the caller's addition. Setup and cleanup remain in the executed program
  and are qualified in the model note. BL's sole general-purpose write and exact target
  address are pinned by the facts test. RET's unchanged register bank is checked there too.
- The complete GNU/QEMU corpus program is unchanged. An independent differential rerun
  passed: one program, four calls, 32 instruction states, zero differences (0.1 s),
  `/tmp/bl-tech-native.log`. This is emulated execution, not physical hardware validation.
- The complete recorded increment_int body and its C associations are unchanged. The
  caller's two assembly instructions are explicitly course-written and have no invented
  C associations. The challenge still names two separate moments; the model-derived
  answers and full-wrapper grader preserve those moments' observed register values.
- BL is moved, not duplicated, in the first-taught instruction map. The link-register
  term is declared where it is now defined. The later call lesson still develops saving
  the link, stack use and register preservation. Earlier function content establishes
  the argument/result register and source function name before this lesson uses them.
- The plan, source record, facts follow-up and bl-validation.md accurately describe the
  changed scope and separate primary-source semantics from modern-page reachability.
  The validation note labels the full check as pending rather than claiming a full pass.

## Browser checks

Inspected the built site served at port 4399, built in 16.96 seconds. Used actual light
and dark themes at 375×812 with touch/mobile enabled and 1280×812. Script and observations:
`/tmp/bl-tech.mjs` and `/tmp/bl-tech-browser.log`.

In all four contexts, checked all five displayed states, including the initial state,
BL, both additions and RET; each state's reload; Back through the complete sequence;
and reset before BL. Exactly one next marker exists until completion and one just-ran
marker after each step. X30 is marked written only after BL. Its named target remains
stable through RET and the caller addition. W0/W1 writes and values agree with the trace.
The shared bank, X30 target and current-operation cue are readable beside the controls.
No page overflow or page error was observed. Full-figure and control-area screenshots
were visually inspected at both widths; actual light/dark control screenshots were
also inspected. The paired function listing remains horizontally contained on phones.
The BL reference link is present in the rendered references disclosure.

All four legacy saved positions were separately injected and restored. Each moves to the
corresponding new visible position while preserving the original machine state. New saves
record the start offset, avoiding repeated migration on reload. Reset returns to before BL.

## Findings considered

- No numeric X30 address is shown before BL. This is appropriate: the model's old value is
  a harness return sentinel, not this call's return address. “Not yet set for this call”
  does not claim X30 is empty or zero.
- Keeping the scope to BL, the familiar function and one caller addition is sufficient.
  Adding stack instructions here would introduce a second mechanism; the real wrapper
  still executes and the omitted preparation is acknowledged.
- The function's result survives RET because this instruction does not write W0, not
  because a separate caller register bank receives a copy. The figure and prose agree.

No test assertion failed in this independent review. Full-suite and deployment checks are
outside this review's execution scope; the parent session records them separately.

## Final vocabulary correction and recheck

The full course run subsequently exposed an omission not caught in the first review:
“BL: branch with link” used **branch** before its Module 4 vocabulary introduction.
Severity: medium, because the page named a new mechanism without defining the term.
Accepted correction: explain the branch beside BL and declare the term here. The final
paragraph now says “A branch changes where execution continues” before explaining the
call's saved address. This matches the source semantics and gives the learner the meaning
before the optional reference label uses it. Conditional branch development remains later.

Reviewed the final 12.93-second build at the same preview URL in all four width/theme
contexts. `/tmp/bl-tech-final.mjs` and `/tmp/bl-tech-final.log` verify the rendered definition,
expanded BL name, actual theme, initial-to-BL transition, X30 write and no page overflow.
Visually inspected the final phone-dark and desktop-light paragraphs. No product component
changed after the preceding all-state browser review, so that state coverage still applies.

The constants-and-widths introduced-set assertion now includes BL because it is taught in
an earlier Fundamentals lesson. Its challenge allow-list remains mov/movk/ret; neither
its editor nor allowed instructions was broadened. New gate assertions explicitly keep BL
unknown before this lesson, known here, and STP still unknown here. Independent targeted
rerun of introduced.test.ts and constants-and-widths.test.tsx passed: 2 files, 38 tests,
15.61 seconds, `/tmp/bl-tech-gates-final.log`. These changes correct the expected prerequisite
set without weakening the exercise restriction or the first-taught boundary.

Final verdict remains approved. The original full-course failure is retained by the parent
session's validation history; this focused recheck does not relabel that attempt as passing.
