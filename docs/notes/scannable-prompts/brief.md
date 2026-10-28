# Make exercise starting states easier to scan

Copyright © 2026 Christopher Snow

## Request and checked implementation facts

The author asks to turn dense exercise setup sentences into bullets, starting with the
Subtraction and reuse challenge: before sub w1, w0, w1, w0 holds 18 and w1 holds 5; give
the values after execution. Apply the same treatment to similar prompts on other pages.
The two starting values are independent facts; the instruction and question must remain
clearly separated from them. Preserve the exercise's values, register order and moment asked.

ChallengeRunner already renders task strings through Prose, which supports Markdown lists;
other lesson prose already uses lists. No platform, layout component or new rendering API
is needed. The checked primitive programs and graders supply the starting values and answers.
Existing canonical prose tests compare the source wording with docs/notes prose records.

Audit all 34 lessons for dense exercise/prediction starting-state or input-contract prompts.
Use bullets for parallel register/value, parameter/role or memory facts that readers must hold
at once. Keep short single-fact prompts concise. Preserve instruction order, widths, signedness,
preconditions, output timing and function-call semantics. Separate the question/result required
from the starting inputs, without adding headings, duplicate explanations or revealing answers.
Do not turn general explanations, hints and feedback into lists indiscriminately. Use ordered
steps or code only where a genuine execution sequence needs it; unordered bullets must not
obscure temporal order. Already clear lists/figures need no reformatting.

## Process and ownership

Follow CLAUDE.md and docs/authoring.md; edit against both passes of docs/style.md. Separate
drafting agent owns lesson prose and canonical records. Root owns tests, integration and a
small authoring-guidance update. Record per-lesson audit decisions. Independent learner and
technical reviewers check final source and built pages at phone/desktop in actual light/dark,
including the starting-state lists, code formatting and retained exercise interactions.
No program, grader, numeric answer, challenge/figure ID, prediction gate or persistence change.
No platform edits. Leave docs/notes/module-12/pi-sources-brief.md untouched.
