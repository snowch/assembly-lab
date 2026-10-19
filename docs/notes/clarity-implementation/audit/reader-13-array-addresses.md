# Independent learner review: lesson 13, Array addresses and moving pointers

Read-only review. No prior review notes consulted. Reviewed CLAUDE.md, docs/style.md, docs/authoring.md, the front-page prerequisite panel, earlier lesson prose for the relevant register/bit/flag/branch/loop/memory background, and all target prose, labels, choices, feedback, hint ladders, model note, recorded listings and relevant shared memory/listing/stepper strings. Earlier lesson reading was prerequisite-focused, not a fresh complete review of their exercises.

Browser: http://localhost:4290/assembly-lab/#/lesson/array-addresses, Chromium, 375×900 and 1280×900, light and dark, fresh context each. In each configuration viewed opening/paired source, selected and checked a prediction, stepped the pre-index example once and the sum example once. Additionally stepped the sum through its first load at phone width. Screenshots in `/tmp/course-clarity-audit/13-*`; browser text logs `13-browser.txt` and `13-extra.txt`. No horizontal page overflow in any configuration. Did not solve writing challenges or exhaustively exercise every trace/input. Hint wording reviewed in source; no hint-specific browser defect claimed.

## Findings

### 1. Medium: the array illustration does not show array-element boundaries

Quote: “Each element occupies four bytes, so each increase in the index moves the address forward by four bytes.” (`content/lessons/array-addresses.prose.ts:12`, motivation). Figure labels: “Memory bytes” and “Addresses increase from left to right, then continue on the next row.” (`packages/views/src/strings.memory.ts:5–6`; rendering `packages/views/src/interactives/MemoryStepper.tsx:131`).

Setup/state: check the initial prediction, then step the pre-index figure once. At 375px the sixteen individual byte cards wrap in rows of three; each four-byte element crosses a row boundary. At 1280px cards wrap in rows of nine, also unrelated to element boundaries. Each card shows address, byte value and access state, but none identifies the element/index or groups the four bytes belonging to a distance. Evidence: `13-375-light-pre.png`, `13-1280-dark-pre.png`.

Learner effect: the mechanism is converting an element position into bytes, but the picture shows only the latter. Learners must mentally reconstruct four-byte groups across visual rows before they can connect the array index to the selected journey. The mobile row shape can suggest a grouping unrelated to the data.

Direction: retain byte/access detail while making the four-byte element boundaries and indices visible in array figures. Preserve those groups as the layout wraps. This can also make the unscaled-load experiment's crossing of elements directly visible. No numerical challenge answer is needed.

### 2. Low: explain the change in w1's role in the compiled summing loop

Quote: “Its end address comes from `add x3, x0, w1, uxtw 2`: zero-extend the count in `w1`, shift it left by two, then add the starting address.” (`content/lessons/array-addresses.prose.ts:36`). Later: “You can count down the remaining elements, or compare the moving pointer with an end address.” (`:38`). C includes `count--;` but the assembly has no decrement (`content/lessons/arrays.listings.ts:12–17`).

Setup/state: unlock the sum figure and run through its first load. `w1`, described as the count, now contains a loaded distance. The related C highlights `total += *trips++`, while the complete C still contains `count--;`, a line with no paired executing instruction. The display is technically correct. The prose describes the end-address calculation and lists two possible stopping rules but does not explicitly connect this GCC output to the disappearance of the changing C count or reuse of its register. Evidence: `13-375-light-sum-first-load.png`, `13-extra.txt`.

Learner effect: a learner following C variable names alongside register state can reasonably wonder when the count gets decremented or why its register has become a distance. This is the same distinction between a register's role and its current contents that needs explicit execution moments in earlier examples.

Direction: explain locally which stopping rule this compiled listing uses, why it no longer needs a changing count after computing the end address, and when `w1` is reused. Keep the C and genuine compiler output unchanged. This is clarification of the demonstrated listing, not a request for a one-to-one C/instruction mapping.

## Assumed knowledge

No separate unsupported-knowledge finding. Relevant definitions precede their use: Module 0 defines registers and arguments; Module 1 explains hexadecimal and w/x register views; masks/shifts explain lsl; branches explains labels and condition spellings; counting-up/down explains iteration, increments/decrements and initial zero-count tests. Memory-and-addresses defines bytes/addresses, pointers, dereference, const, little endian, target C widths and the overlap of w0/x0; loading-widths defines zero extension and byte offsets. This lesson defines array/element/index, pre/post-index forms, pointer arithmetic and `*trips++`, `+=`, and `uxtw` before they are required for the final task. Module 0's compiler note explains GCC and -O1.

The undefined relationship in finding 2 is a particular compiler transformation, not an unexplained instruction or general C syntax. Prediction questions themselves specify the measured moment adequately: function return, or the changed load's result. The browser text shows a STEPPED badge on the initial prediction figure as well as on steppers; the PREDICTION text above it is the section heading. The helper in `content/lessons/array-addresses.ts:23–24` sets `kind: "memory-prediction"` and `timeModel: "steps"` without an explicit role. This review does not claim that prediction cards have a Prediction badge.
