# Independent learner review: Recursive calls and separate frames

Copyright © 2026 Christopher Snow

Reviewed the built lesson at `http://localhost:4200/assembly-lab/#/lesson/recursive-calls` on 18 October 2026. Reviewer: separate Codex agent, inherited session model and effort; no model override. The reviewer did not draft or edit this lesson. Scope: a learner who knows the front page prerequisites and every lesson through Calls and returns.

## Findings for the sceptic

### R1. Medium: the explanation assigns saved brightness to the wrong frame

Quote: “A later call reuses the register names, but the earlier call's saved values remain in its stack frame.” The preceding sentence names the return address and brightness as these saved values.

Effect: a learner looking for the current call's original brightness in its frame will find a different value. This undermines the lesson's main explanation of what recursive calls preserve.

Evidence: the displayed instruction sequence stores incoming `x19` before replacing `w19` with the current argument. The subsequent callee saves that incoming value in its own frame. At the investigation's initial snapshot, the first frame's saved `x19` slot contains the initial caller state, while the next frame contains the first invocation's brightness. The current deepest call has not yet executed its `str x19` at that snapshot. The instructions and byte diagram support this distinction; the quoted wording collapses it.

Direction: distinguish the current brightness in `w19`, its preservation by the next callee, and the incoming state saved in the current frame. Keep the explanation tied to this recorded listing, rather than making a universal statement about recursive frame layout.

### R2. Medium: the stack diagram shows bytes without identifying their roles

Quote: “Each frame holds the values for a different invocation.” The diagram repeats the label “fade_sum: 32 bytes” for every frame.

Effect: the learner can see stack growth but must reconstruct every saved register and distinguish the invocations manually. On the phone, the stack spans several screens; the instructions and register display are far above the bytes. This makes following a brightness across a call especially difficult and amplifies R1.

Evidence: screenshots `desktop-light-stack.png` and `phone-light-stack.png` show separate frames and individual byte addresses, but no saved-register labels, frame invocation identifier, or indication of which bytes represent the saved return address. The allocation and memory are computed correctly for the displayed point; the missing information is the link between those bytes and the mechanism described in the prose.

Direction: add model-derived identifiers or annotations that connect the visible saved values to their register roles and call instances. Keep raw bytes available. Avoid presenting unexecuted stores as already saved at an early instruction position.

### R3. Low: the model note assumes unexplained operating-system vocabulary

Quote: “A real process also has finite stack space, but this model does not reproduce operating-system stack growth, guard pages or the way exhaustion is reported.”

Effect: a beginner is asked to understand the limits of the model using terms the course has not explained. “Guard pages” is especially opaque and unnecessary to understand the recursive example.

Evidence: the preceding Calls and returns lesson also names “stack guard pages” in its model note, without defining them. Earlier memory lessons explain addresses, bytes and access faults but do not explain guard pages or processes. Repetition of the name is not an introduction.

Direction: describe the relevant limitation in terms already taught, or briefly explain the named operating-system mechanism if retaining it serves the lesson.

## Prerequisite audit

The page can reasonably assume unsigned 32-bit arithmetic, shifts and their C syntax, conditional branches, memory addresses, pre-index and post-index addressing, and preserved registers. Calls and returns introduces the stack, stack pointer, frame, frame pointer, link register, `bl`, `stp`, `ldp`, AAPCS64 preservation rules, and the reason for `-fno-inline`. Earlier lessons explain GCC and `-O1`. Recursion and the base case are explained at the point of use here. No unexplained C construct blocks either exercise. The operating-system terms in R3 remain an assumed-knowledge finding.

## Browser checks

Used Chromium through Playwright at 1280 × 800 and 375 × 812, in light and dark themes. Read the complete rendered prose, expanded the recorded-function note, inspected the stack at its deepest allocation and on return, and inspected the failure recording at its limit.

- No browser page errors or document horizontal overflow in any of the four combinations.
- All three gated stack figures stayed closed before the relevant prediction was checked and opened after it was checked.
- Both starting exercises failed meaningful cases. Both five-hint ladders were accessible and readable.
- Repairs made using the hints passed both exercises. Text survived a Text/Tap/Text round trip and reload; rerunning the tests after reload passed.
- Stack byte addresses render at 11 pixels on the phone. Light and dark text, byte boxes and changed-byte outlines were legible.

The prose otherwise supplies a clear sequence: recursive call, saved state, base case, return order, and progress towards the stopping input. The principal issue is the connection between the explanation and the stack picture, rather than sentence length.

Artifacts: `/tmp/reader-recursion/`. `review.mjs` and `exercises.mjs` contain the browser actions; `results.json` and `exercises-results.json` record outcomes. Screenshots cover all four display combinations. No production files were changed and no site rebuild was performed.
