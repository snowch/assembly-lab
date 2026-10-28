# Scannable prompt validation

Copyright © 2026 Christopher Snow

All 34 lessons were audited. The final draft changes 52 prompt/setup properties across
28 rendered lessons (25 prose files). Parallel starting facts and dense output requirements
use existing Markdown lists. Instruction order, independent-call boundaries, result timing,
widths, signedness, values and grading contracts remain unchanged. No platform or runtime
component was changed; canonical prose records were synchronised.

Independent source review caught two places where a new input list would join a takeaway
list without an intervening paragraph; explicit setup sentences now separate them. The review
also prompted clear operand names in two native/checked-arithmetic contracts where “their sum”
was ambiguous after listing all inputs, including a correction or address. Three remaining
parallel input pairs were formatted consistently. Review notes record the evidence and final
browser coverage separately.

## Check history

- Initial content suite: 62 files passed, one failed; 1,415 tests passed and two failed
  (53.29 seconds, exit 1). Both failures were stale Module 2 format assumptions: counting
  new question-input bullets as takeaway bullets, and requiring one old comma-separated
  input/result sentence.
- The revised existing assertions still require six takeaways, the fresh question and closed
  answer, both input-register mappings, the return register, absence of a leaked solution,
  and the existing wrap-case coverage. The existing browser assertion now requires the two
  actual list items and return fact. No timeout, grading assertion or test skip was changed.
- Focused rerun: the affected Module 2 file passed all 31 tests (5.02 seconds, exit 0).
  This does not change the original suite's exit status.
- Production build passed (21.48 seconds), with the existing bundle-size advisory.
  This frozen product build was used for the independent browser reviews. Later root edits
  changed tests and engineering notes only.

Full check, exact-commit CI, merge and live deployment results are recorded in the pull request.
A partial local run is not described as a full pass. No physical Raspberry Pi test is claimed.
