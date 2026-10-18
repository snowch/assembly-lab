# Independent review: Compile a loop and follow its branches

Reviewed 18 October 2026 by a separate reader/technical reviewer, using the inherited session model and effort (no override). This reviewer did not author the lesson or its implementation.

Scope: build 3 at `http://localhost:4204/assembly-lab/#/lesson/compile-a-loop`; prior knowledge is the front page, Modules 0–9 and *From C to instructions*. Read `CLAUDE.md`, `docs/style.md`, `docs/authoring.md`, the prerequisite loop and compiler lessons, the current lesson structures, compiler run/grader/editor implementation and retained compiler records. No production edits or rebuilds were made.

## Findings for sceptic review

### P2: C exercise feedback hides the concrete failed case

Quote: “The function returned a different value from the one required by this test.”

Evidence: running the untouched starting C in the final challenge produces three failure cards. Each contains only the case label and this sentence. Inputs, actual value and expected value are absent. By comparison, the assembly exercise displays these fields. `gradeC` already supplies `inputs`, `actual` and `expected` for mismatches, so the loss occurs in rendering the verdict with a detail string. Recorded in `/tmp/reader-c-loop/log.json` and verified in the page.

Effect: the learner cannot follow the failed calculation from its inputs or compare what their program returned with the required result. Some test labels identify an operation without giving the actual input values.

Direction: preserve the concrete case evidence alongside any explanatory text; verify the failed starting C in the built page.

### P2: A finite loop can exhaust the machine budget without a budget diagnostic

Quote: “The assembly did not complete with the result calculated by the C evaluator. Check the reported run before using its result.”

Evidence: unlock the first playground, keep its original source and rate, change count to 800 and press “Run with these inputs”. The quoted message appears, with no listing or trace to inspect. Count 700 runs; count 1000 produces the separate, clear evaluator-limit diagnostic. `runC` passes a 10,000-instruction maximum to `traceOf`, then folds a non-returned trace into the same machine failure as a disagreement in the returned value. The generated loop needs more than that instruction budget at count 800, although its C evaluation completes.

Effect: the lesson asks learners to change the count and explicitly distinguishes a budget limit from a non-terminating loop. Here the interface conceals the relevant limit and appears to report disagreement between the compiler and machine. The requested “reported run” is unavailable.

Direction: distinguish machine execution-budget exhaustion from result disagreement, identify which limit was reached, and make the recovery action usable without referring to an absent trace.

### P2: Phone stepping separates the branch destination from the controls

Quote: “Step over the backward branch to see which comparison runs next.”

Evidence: at 375 × 812, run the original program and advance through its backward branch. The Next control, last-run status and registers are visible below the bottom of the full listing. The highlighted next instruction near the top of the listing and its associated C line are above the viewport. `/tmp/reader-c-loop/trace-18.png` captures this position. Moving between the controls and source/branch destination requires substantial repeated scrolling. The source mapping itself is correct in the DOM and retained record.

Effect: the page's central investigation is mechanically possible, but the learner cannot see the branch transition where they are stepping. They must remember the prior state while finding the next highlighted line.

Direction: keep the current instruction and associated source line visible near the stepping controls, or provide an equivalent view that makes the branch transition visible on a phone. Preserve access to the complete listing.

### P3: The maximum-count condition is ambiguous

Quote: “If both count and counter can reach that maximum, `i <= count` never becomes false.”

Evidence: both variables have unsigned type for every call, including the ordinary finite example. The non-termination argument requires the input `count` to equal the type's maximum; `count` is not itself updated by the loop. The surrounding paragraph explains wrapping correctly but does not state that input condition directly.

Effect: “can reach” can be read as a statement about the variables' possible ranges, which would misleadingly apply to every call, rather than the particular maximum-valued input.

Direction: state the exact input condition and distinguish the fixed count from the changing counter.

## Prior knowledge audit

No further unexplained prerequisite was confirmed. Module 5 defines loop, body and iteration and walks through the parts of `for`; it also distinguishes the initial tests of `while` and `do`. Modules 2–4 establish unsigned values, wrapping, shifts, comparisons, conditional result instructions and branch labels. The immediately preceding compiler lesson introduces working registers, source mapping, the C evaluator, fixed translation patterns, supported syntax and the optional Compiler Explorer service. The present page explains that execution limits do not establish non-termination. “Initialisation” is supported by the immediately following concrete register setup and the earlier `for` walkthrough.

## Browser and technical checks

- Read the actual built prose and figures at 1280 × 800 and 375 × 812 in both light and dark themes. Screenshots and extracts are in `/tmp/reader-c-loop/`. No page errors, horizontal document overflow or visible controls shorter than 40 pixels were observed in those states.
- Both prediction gates remain closed until a prediction is checked; an incorrect prediction provides feedback and unlocks its investigation. The failed-condition explanation is gated in the prediction figure.
- Stepped the original loop through its backward branch and to return, then ran the zero-count path. The branch returns to the comparison sequence, and generated line mapping matches `accumulated_charge.course.json`.
- Original source and changed-boundary source compile from C rather than selecting a prepared trace. Actual source, generated listings and line maps are retained in the repository; GCC comparison requests retain their `-O1` option separately from the course compiler output.
- Division by zero, a shift count equal to the type width and a non-progressing loop each produce diagnostics before a machine trace is shown. The separate machine-budget case is the finding above.
- Both untouched challenge starts fail; both valid implementations pass all their cases. Read all five hint levels. The manager identified hint updates not yet present in this build, so the old fifth assembly hint and old C common-mistake hint are not filed as new findings.
- Built a complete valid C challenge using only statement controls at phone width, including adding lines, selecting operands/operators, entering constants and closing the block. Switching to text shows the same source. The completed result persists and is regraded after reload.
- The statement builder is usable with touch-sized controls. Its generated indentation is flat inside nested blocks, but braces remain explicit; this did not prevent constructing or understanding this exercise.

The browser review is not a new QEMU run or a comprehensive compiler audit. Full differential verification and the independent compiler review remain separate evidence.
