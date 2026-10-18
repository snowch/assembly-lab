# Completing the remaining course

The author requested completion of the remaining lessons after Module 6. This includes
Modules 7 to 11 and optional chapter A, under the recommendations already adopted in the
main plan. Each numbered module has two lessons; the optional chapter compares recorded
compiler output without introducing a second simulator.

Build the work in three connected groups:

1. Arrays and strings; products and division; calls and the stack. These build on the
   existing machine and memory views, adding figures only where the mechanism needs one.
2. A deliberately limited C compiler, a browser editor with keyboard and touch input,
   source-mapped assembly and an optional, explicit Compiler Explorer comparison.
3. C edge cases and safe arithmetic, then the recorded 32-bit ARM comparison.

The compiler's exact subset is recorded at checkpoint 5 before its lessons use it. Keep it
small enough for a learner to follow, and reject unsupported constructs explicitly. The
course must work without Compiler Explorer or any other network service. C undefined
behaviour is not an alternative machine result; show what the language promises separately
from the recorded instructions and simulator state.

Each module must have checked facts, original compiler records, separately drafted learner prose,
canonical text, meaningful construction and answer exercises, and independent learner and
technical reviews. Reviewers use actual pages in both themes at desktop and phone widths.
Every executable A64 example must be checked against GNU as and QEMU. The optional A32 chapter
uses retained compiler records and says that those listings are not run by this simulator.

The platform's lesson schema requires numeric module keys. Optional chapter A uses key 12
internally and continues to display A. This mapping belongs to the course plan, not to a
modified platform copy.

The final release runs the full repository check and the complete real-tools corpus. Record
review findings and fixes in each module's notes, then push the completed course and verify
the deployment. The new lessons retain the course's draft status for author feedback.
