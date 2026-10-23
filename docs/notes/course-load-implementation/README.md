# Learner-first course changes

User authorisation: implement the whole-course learning-load recommendations and choose the treatment that helps the learner. Work builds on the independent [review](../course-load-review/README.md), its accepted/downgraded/rejected [decisions](../course-load-review/ledger.md), and the follow-up recommendation to redesign the opening while retaining later synthesis. This implementation does not claim measured beginner learning outcomes.

## Checked facts and implementation scope

- `add`/`sub` read operands before writing the destination; unchanged registers persist. The opening now uses computed assembly-only activities before argument conventions and the complete paired C function. Shown programs have model facts and GNU/QEMU corpus coverage.
- Memory-transfer roles, exact addresses, source widths, physical register clearing, array boundaries and stack frames come from simulator traces. Compact diagrams retain this evidence; detail is available for inspection. Related load/addressing cases share a fixed comparison position.
- C-derived listings retain complete numbered C beside checked instructions, with original records untouched. Compiler comparisons use full width and coordinated contained scrolling.
- Boot assets, recorded startup and GNU/QEMU/GDB commands retain their execution boundary. Placement/startup support is now beside first use; debugger operations are grouped by meaningful stops.
- Later loops, recursion, compiler work and native testing still compose previously practised mechanisms. No wholesale opcode-by-opcode rewrite was made.

Separate implementation/drafting passes worked from the review evidence and checked source facts. The records below identify their files and focused checks. New copy was edited against `docs/style.md`; canonical prose was synchronised.

## Implementation records

[Opening](opening.md), [early sequence](early.md), [memory](memory.md), [stack](stack.md), [references/compiler](references.md), [native/checked arithmetic](native.md), [bitwise inspection](bitops.md), [independent technical challenge](technical-review.md).

Root also removed repeated committed-prediction rows, removed duplicate compare-panel flags, made loop register summaries decimal-first with optional bits, and added optional selected-four-bit-group enlargement to the adder. The adder uses already-revealed simulator columns, with separately drafted labels. Root-focused tests cover partial-result boundaries, Reset, optional bits and prediction commitment.

## Review decisions

The opening is an implemented prototype, not a proven universal sequence. Existing prediction commitment remains permissive; incorrect attempts receive useful feedback and do not require retries to continue. Fields receive a bounded first application, while general replacement/containment remains synthesis. Width selection and multiplication were not indiscriminately reordered. Formatting and sanitizer reading follows the checked-add attempt. The explicit final sensor-record field bullets remain, since the stronger matched-comparison problem took priority over another diagram duplicating those fields.

## Validation

See [validation history](validation.md), [all-lesson coverage](coverage.md) and the [independent audit](audit.md) for outcomes, failed commands, retained/rejected findings and exact limitations. Reader notes named `check-NN.md` each cover one lesson, with earlier prerequisites only and four width/theme contexts. This is bounded browser verification, not exhaustive state/input coverage or a novice usability study. Source-only paths and untested states stay explicit.
