# Module 5 drafting brief

The checked program facts are in `listings.md`, `facts/runs.md` and the executable facts tests.
Use only numbers and instruction sequences verified there. The learning sequence, prerequisites,
originality decision and planned figures are in `../module-5-plan.md`.

Draft each lesson's prose and labels in a separate pass from the implementation, following
`docs/style.md` and `docs/authoring.md`. Keep canonical prose and exported strings together.
The author has particularly asked for clear, plain English and explicit explanations of what
registers contain. Name the calculation and the value it stores; do not compress this into a
variable being "in place of" another variable.

The explanation must distinguish:

- A loop's body, one execution of that body, and one processor instruction.
- The first test, which can skip the body, and the backward branch, which repeats it.
- Counting up through an excluded endpoint and counting down towards zero.
- Flags from `subs` and flags replaced by a later comparison.
- A long but finite run, a simulator budget exhausted, and a condition proved always true.
- The behaviour of recorded GCC output and what C requires of every implementation.

Introduce loop, body and iteration in plain English. Explain the displayed C shorthand at its
first use. Prior modules already supply unsigned wrap, logical shifts, flags and branches.
Keep the C forward-progress qualification in a clearly scoped note rather than omitting it.

Predictions must not reveal their results before commitment, including captions and nearby prose.
Hints may become progressively specific but the initial task must leave the work to the learner.
The final answer exercise uses input pairs absent from the preceding run selectors.

The loop figure's values are computed from executed instructions. For a truncated run, describe
only the executions observed so far. A zero count means the body instruction did not run; it does
not by itself explain why. UI history may show a bounded number of entries and state how many
observed entries were omitted.
