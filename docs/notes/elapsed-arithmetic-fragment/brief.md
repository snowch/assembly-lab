<!-- Copyright © 2026 Christopher Snow -->

# Calculate elapsed ticks without a function-writing prerequisite

The learner constructs arithmetic that leaves elapsed ticks in w0 for wrapped and unwrapped unsigned 32-bit counter readings. Assembly functions, the calling convention and loading arbitrary large immediates are deferred.

The stated prerequisites include reading simple C. Earlier lessons supply registers, addition/subtraction, fixed-width result bits and signed/unsigned readings. This page demonstrates counter wrap and forward elapsed distance. Seeing a C function or recorded ret does not establish assembly-function-writing competence. The user identified that unsupported prerequisite and asked whether the large then value required a loading hint.

The essential route is counter wrap, subtraction as addition, a worked forward-distance example, then arithmetic construction. Run tests loads now into w0 and then into w1 for each independent test. A visible table derives input pairs directly from the four existing test cases. Expected answers remain gated. Learners enter arithmetic only; the application supplies termination outside the editable artifact. Large constants need no loading instructions.

The existing four checked pairs include two without wrap and two with wrap. Native differential corpus references remain complete programs, unchanged. The new fragment reference is extracted from that same recorded subtraction. Wrong operand order and adding the readings must fail; plain sub and flag-writing subs must both pass. Tests check the result count rather than flags. A fresh reflection pair already follows the exercise and asks for forward-path reasoning and the less-than-one-turn assumption.

Likely misconceptions, treated as hypotheses: loading the displayed constant manually; treating a smaller now value as a negative elapsed count; reversing operands after wrap; equating successful arithmetic with having written an assembly function. The prepared-input text/table, wrong-order checks and fresh reflection distinguish these.

The shared editor/grader change is explicitly opt-in through application-owned metadata. Other exercises retain their existing termination contract. Existing learner artifacts, including explicit ret and Text/Tap switching, remain unchanged. Blank new work asks for an instruction; clearing still requires the existing confirmation. Diagnostics retain learner source line numbers.

Separate drafting: bidirectional_counter_copy supplied the task, captions and hints. The implementation pass adapted it to name Run tests at the moment inputs are loaded. Independent learner and technical reviews are required before merge. Review artifacts and functional logs are stored outside the repository under /workspace/work/elapsed-fragment/.

Functional verification covers all four input pairs, wrong answers, legacy drafts, source errors, confirmed reset, keyboard operation, phone/desktop and light/dark. Agent reviews and passing tests are not evidence of learning effectiveness. No new novice session has been conducted.
