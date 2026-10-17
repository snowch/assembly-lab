# Module 5 drafting and review, 17 October 2026

The author requested Module 5 after the clarity pass on the earlier draft modules.
Two lessons teach loops through an unsigned dashboard brightness setting. The plan and
checked drafting brief are in `../module-5-plan.md` and `brief.md`. Separate agents prepared
compiler evidence, lesson implementation, learner prose and browser tests. Independent agents
reviewed each lesson as a learner and checked the technical claims. All used the session's
selected model and inherited effort, without overrides.

## Implementation and evidence

The lessons reuse the listing, stepper, editor, prediction gates and return/count grading.
A new loop figure counts executed body instructions and plots brightness history from the
simulator. It distinguishes a completed run from an observed prefix. Its prediction component
also derives answers from execution. No new machine instruction is introduced.

The stepper accepts an explicit bounded instruction budget and shows that limit even when
the last executed instruction is a branch. The real-tools checker accepts bounded prefixes
for deliberately long or nonterminating programs. It compares only complete QEMU state
records, rejects early returns and unsupported final-memory assertions, and has time and
output bounds. A matching prefix does not prove termination or nontermination.

Recorded GCC 16.1.0 output at `-O1`, requests, responses and C sources are retained under
`compiler/`. Course-authored references and mistakes are identified separately. Facts tests
cover output, instruction counts, flags, source mapping, unsigned boundaries and the exact
20-instruction prefixes shown in the two failure steppers. Canonical prose is checked against
all exported lesson paragraphs, hints, labels and loop interface strings in both directions.

## Findings and decisions

- The counting-up summary implied every loop starts with a test. It now asks whether there is
  an initial test, preparing for the following lesson's `do` loop.
- The failure experiment asked the learner to change an instruction in a figure without an
  editor. It now describes the prepared changed program.
- The zero-count `do` explanation needed inspectable evidence. A gated stepper now lets the
  learner observe the counter wrapping and the flags, within an explicit instruction budget.
- The always-true unsigned comparison was described as the same error as decrementing zero
  in `do`. The text now presents it as a different error: the first loop is finite, while the
  second assembly program's comparison always takes the backward branch, so execution never
  reaches `ret`.
- The C note used unexplained terms. It now explains constant expressions and observable
  effects while preserving the standard's qualification about assuming termination.
- The broken comparison needed an instruction-level view. Its stepper now exposes the count,
  flags and branch so the learner can see `cmp` replace the flags from `subs`.
- Figure captions promised branch paths that the loop figure did not show. They now describe
  its actual counts and value history; the stepper shows instruction order and branches.
- The description of `subs` now says when Z is 1 and when it is 0. Partial-run labels count
  observed dimming operations rather than claiming complete body iterations.
- Course-wide tests caught missing unsigned-failure metadata expectations and repeated correct
  option positions. The expectations now include the new construction exercises, and the
  counting-up failure prediction has a different correct option position.
- The final learner check found that the shared step-limit message suggested the known-finite
  zero-count `do` run might never end. The message now describes reaching the limit without
  claiming what would happen if execution continued.

The review rejected claims that the branches were untaught: Module 4 introduces them. The
counting-up equality test is valid after the initial unsigned order check and unit increments;
equal and reversed endpoints skip the body, and the counter reaches the excluded endpoint
before wrapping. Body iterations and executed instructions are explicitly distinguished.

A repeated-distance-addition example was rejected during planning because GCC emitted the
untaught `madd`. A compiler capstone using `&&` emitted `ccmp`; the final capstone instead uses
clearly identified course-authored assembly with instructions already taught.

## Validation

Independent learner reviews exercised both lessons at 1280×800 and 375×812, in light and dark
themes, including predictions, steppers, run selectors, hints and challenge submissions.
They found no page overflow, console errors or premature answers. Independent checkers
confirmed all fixes in the final built site, including the neutral step-limit message. The
technical reviewer confirmed the final source and documentation; no findings remain open.

The complete real-tools check passed: 60 programs, 802 calls and 261,909 instruction states
compared with zero differences; 39,675 assembler lines checked with zero disagreements.
This used GNU as 2.44 and QEMU 10.0.13. The Module 5 subset accounts for ten programs and
42 calls, including explicitly bounded prefixes.

The final `npm run check` passed formatting, copyright, platform-copy integrity, strict type
checking, all 2,024 unit and integration tests, the production build, and 803 browser tests
(17 skipped). The focused Module 5 browser run also passed 45 tests, with its one expected
desktop skip for the phone-only touch exercise.
