# Independent final reader: 18 recursive-calls

Read-only review of the final production page at `http://localhost:4292/assembly-lab/#/lesson/recursive-calls`. No course files edited. Read CLAUDE, style and authoring instructions, then the lesson's prose, labels, structure, hints and figure code before the audit summary and verification checklist. This reviewer did not draft the changes.

## Verdict

**Accepted correction N18 verified. No additional lesson-local correction required for the requested changes.** Shared prediction/exercise roles and the changed hint ladder also read coherently in this lesson. This is a scoped verification, not a claim that every possible interaction was tested.

The investigation now says: “This figure starts at the deepest point, with all four calls active. Use Back to inspect how the calls built the stack, or Next to follow the remaining instructions and returns.” (`content/lessons/recursive-calls.prose.ts`, investigation; `recursive-calls.ts`, initialStep 22.) The displayed initial state is instruction position 22, four active frames and 128 allocated bytes in every configuration. Back reaches position 21, Next restores 22, and another Next reaches 23. The changed text therefore describes both the preset and available controls accurately. Completion displays no active frames; Reset returns to position zero. The text's four-call claim concerns the preset rather than every later control state, so Reset does not contradict it.

Both prediction cards have Prediction labels and their steppers remain locked until checking the corresponding prediction. Actual steppers retain Stepped. Exercise cards have Exercise. The failure prediction visibly labels its register values “Registers before the run”, including after the prediction is checked. Its end-state feedback clearly distinguishes the recording limit from a returned function.

Both exercises' first four hints were opened in the browser after running the unedited starter. The Common mistake hints identify faulty behaviour; Smaller example hints use concrete smaller inputs. The supplied starter feedback does not assume a successful call that did not occur. Full hint text and reference solutions were reviewed in source only; no solution is reproduced here.

## Browser evidence

Actual Chromium, fresh context for each configuration: 375 × 900 and 1280 × 900, light and dark. Set raw `assembly-lab:v1:theme` and asserted `html[data-theme]` each time. On every configuration:

- checked initial gates, checked predictions and inspected their resulting explanations;
- checked investigation preset, Back, Next, completion using the position slider, and Reset;
- checked failure recording end state and visible before-run input label;
- ran both untouched challenge starters and opened the first four hints;
- captured preset and hint/feedback screenshots; no horizontal document overflow or browser page errors occurred.

Evidence: `reader18-evidence.json`, `reader18-{375,1280}-{light,dark}-preset.png`, `reader18-{375,1280}-{light,dark}-hints.png`; reproducible probe `probe-reader18.mjs` in this directory. Screenshots were visually inspected at phone light, desktop light and phone dark; DOM/state assertions were performed in all four configurations.

## Prerequisites

Assumed only the front-page small-C-functions and arithmetic prerequisites and preceding lessons through calls-and-returns. Checked the front-page prerequisite panel, relevant earlier unsigned-width/shift teaching, and the entire preceding calls-and-returns prose. Calls-and-returns defines caller/callee, link register, stack, stack pointer, frame, frame pointer, calling convention, preservation and stack alignment, and explains `-fno-inline`. Earlier shift teaching supplies unsigned halving and truncation; Module 0 supplies compiler optimisation context. This lesson locally defines recursion and base case. No newly required untaught knowledge found in the changed teaching sequence. “Invocation” is used in the established context of one function call and frame, rather than as an unexplained new mechanism.

## Limits / shared observation

Not an exhaustive execution of successful challenge solutions, every call position or every saved-work state. No full suite, build or compiler/ISA recertification was run by this reader.

At initial unlock while the investigation is offscreen, its bounded listing retains the complete-C/notes portion at the top. On phone this can initially hide instruction rows inside the listing viewport, though the adjacent status names the executed and next instructions and the listing can scroll. Desktop initially shows the paired table heading. This is a shared listing visibility observation, not an N18 prose failure or an established newly introduced regression. Reported to the coordinator for grouping and scope assessment; the accepted preset-state correction remains verified.
