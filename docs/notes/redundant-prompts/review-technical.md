# Independent technical review

Copyright © 2026 Christopher Snow

Reviewer: a separate technical-review agent, using the managing session's assigned
GPT-6.1 Sol / Extra High. The reviewer did not draft or edit the lessons. Review rules:
`AGENTS.md`, `CLAUDE.md`, `docs/authoring.md`, `docs/style.md` and `docs/sources.md`.

## Scope and method

Read the original and edited lesson prose, the lesson section and activity definitions,
the primitive programs, relevant facts tests and the recorded-source rules. Formed an
independent judgement before receiving the draft author's overlap account. The verdict
below rests on the actual text and activities. The model and Arm/C source boundary has
not changed: no program, input contract, compiler record, expected answer or simulator
rule is being revised.

The distinction is between a fresh decision or evidence task and asking again for the
explanation the page has already supplied. Retrieval can be useful; neither question
marks nor a closing position establish redundancy. A fresh concrete case with a checked
answer can remain useful even when it uses an already taught mechanism.

## Sceptical adjudication

The learner review proposed keeping every Module 5–11 closing question as transfer.
I checked each against its own preceding activity. The following proposed removals
are supported: none introduces new inputs, a new contract or a new choice. The original
answer does not contain an otherwise missing qualification.

| Lesson | Removed question's subject | Evidence retained on the page |
| --- | --- | --- |
| Counting up | Why the bottom test can use inequality | `explanation` already says that the entry test establishes the order and unit increments must reach the endpoint without skipping it. The final trace still checks empty and nonempty runs. |
| Counting down | Why the count check is needed alongside the brightness check | `finalTask` states both stopping rules; the second final hint explains the unwanted initial shift; `finalFeedback` explicitly distinguishes the two reasons to stop. The written exercise still checks both. |
| Memory and addresses | Why a byte store uses an x address register | `explanation` explicitly separates the 64-bit address from the one-byte transfer. The width-damage prediction and memory-copy exercise remain. |
| Loading widths | Why w and x destinations give different full-register results | `motivation` separates extension from upper-half clearing; `predictionExplain` states the full-register consequence; `investigation` describes sign extension through all 64 bits. The comparison remains available. |
| Array addresses | Why pointer increment advances by an element | `explanation` explicitly defines the pointed-to type's element step and distinguishes it from a byte step. The scaled-load and array-sum exercises remain. |
| Zero-terminated strings | Why a text buffer still needs capacity | `motivation` says to stop at capacity even when no terminator appears and requires the capacity to describe readable memory. `writeTask` still covers zero capacity and an unterminated bounded region. |
| Products and widths | Why a widening cast must precede multiplication | `explanation` describes the operand conversion before multiplication and says converting an already completed narrow result is too late. The wide-product exercise remains. |
| Division and remainders | Why a fitting final average can still be wrong | `challengeIntro` already distinguishes intermediate product overflow from a fitting quotient. The exercise still requires preservation of the full product before division. |
| Calls and returns | Why saving only the w view is insufficient | `investigation` explicitly requires all 64 bits of preserved registers; the second final hint explains losing incoming upper bits. The helper-clobbering exercise still checks preservation. |
| Recursive calls | Why the count function needs less saved state | `generalisation` already says it needs no original brightness after halving, while still needing its incoming return address. The two live model examples and recursive count exercise remain. |
| From C to instructions | Why compilers can use different instruction sequences | `explanation` states that different sequences can implement the same defined calculation; `generalisation` tells the learner to compare values, paths and source rules. The editable compiler remains. |
| Compile a loop | Why repeated small shifts can be valid when one large shift is invalid | `generalisation` states the per-operation distinction, and `finalTask` applies it explicitly. The repeated-shift C exercise remains. |
| C and overflow | Why ordinary and wrapping compilations differ | `motivation`, `investigation` and `failureExplain` already explain the different contracts and the maximum-input case. The recorded compiler comparison and pre-check exercise remain. |

Checked arithmetic: removing its broad closing question and the first answer paragraph
does not remove the account of conversions, promotions, comparison choice or signed-C
optimisation; those are taught in this lesson and its prerequisite. Keep the unique
formatting and sanitizer material, its recorded sources and the qualifications about
external functions and executed-path coverage. Rename the remaining disclosure to
“Formatting and run-time checks”. The current draft does this.

The three Fundamentals prose-only construction/failure section pairs can be removed.
Their preceding model examples and fresh-input graded exercises demonstrate and check
the destination, read-before-write, subtraction order and carrying state to the next
instruction. Keep the explicit operand rule, independent starting-state wording, marker
definition and local simulation qualification. These are retained in the draft.

Accept the learner's extra finding on Instructions in sequence: “Which register does
the first instruction write? Which instruction will read that result?” repeats the
preceding “adds into `w2`, then subtracts from that result”. Its `prediction` section
contains no figure, answer field or gate. Omitting this section is technically safe;
the actual two-instruction figure, marker explanation and fresh-input exercise remain.

Rejected broader removal: keep the Module 1–4 fresh concrete closing cases and their
checked answer disclosures. In particular, the comparison closure changes the inputs
and selected conditions, while the branch closure applies the bit-test example rather
than repeating the main graded gradient trace. Keep the native rebuilding/porting
questions and physical-board evidence tasks: they ask the learner to connect external
artifacts or record evidence a browser calculation cannot supply. Same C on A32 and the
Pi preparation lesson have substantive closing guidance, not redundant question pairs.
The retained numeric closing examples have dedicated model-backed checks in the
one-pattern, constants, addition-flags, subtraction, shifts, masks, comparison-stages
and branch-path facts tests. This is source inspection of their executable checks,
not a claim that this reviewer reran those suites.

The final source edit also removes the sequence prediction section and its unused label
from both the lesson data and canonical record. Section counts now follow the actual
selected layouts. The existing tests' only behavioural expectation change is those
counts; their register, grader, preservation, reset and gate assertions remain intact.
Removed answer disclosures have no remaining property references. The reflection lists
remain substantive sections rather than empty headings.

Reviewed the managing session's engineering documentation changes independently. Allowing
any lesson to select an ordered subset matches the schema and current course use, while
retaining challenge, term and source checks. The authoring rule correctly requires an
activity's teaching purpose and checkable fresh applications; it does not equate all
retrieval with filler or require removal of useful prediction gates.

## Verification status

Final source and built-page review passed, with no outstanding technical finding.
Checked the frozen build at `http://localhost:4399/assembly-lab/` on 28 October 2026
using a separate Chromium session. All 17 changed pages were checked at 375 px and
1280 px in both light and dark themes: 68 combinations. Verified the actual rendered
`data-theme`, page containment, substantive section bodies, selected Fundamentals
section order, retained reflection lists, removal of the obsolete Answer disclosures
and absence of browser runtime errors. Inspected screenshots of every affected closing
region in all four combinations. Opened and inspected the retained formatting and
run-time-checks disclosure at both widths in both themes.

For One addition, Subtraction and reuse, and Instructions in sequence, independently
ran every primitive figure through its displayed instructions. Checked the computed
result, restored it after reload, reset it and checked the initial registers and
instruction position. This includes both independently runnable subtraction-page
figures, and both steps of the sequence, in all four viewport/theme combinations.

The final browser checker completed successfully. Two earlier exploratory checker runs
exited 1 because the reviewer's assertion expected the single-operation “Before the
instruction” register card to change. That card deliberately retains starting inputs;
the computed output appears in the result card. The corrected checker asserts that
actual output and its restored/reset state. These were harness errors, not product
failures. Temporary screenshots and the successful JSON state record are under
`/tmp/redundant-prompts-technical/`.

The unchanged later graded exercises, their gates and preserved source qualifications
were reviewed in source; this reviewer did not separately rerun every later exercise,
GNU/QEMU native checks or physical-board work. No build, full suite, commit or product
edit was performed by this reviewer. The managing session owns the integration test
history. `git diff --check` passed. The unrelated untracked Module 12 Pi sources brief
was not changed.
