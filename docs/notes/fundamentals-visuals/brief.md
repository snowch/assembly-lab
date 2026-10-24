# Fundamentals presentation follow-up

User evidence: tablet screenshot shows both source panes fitting while Show C remains;
subtraction screenshots show ten chapter-style breaks around short repetitive paragraphs.
User requests plain horizontal scrolling on narrow screens, less fragmentation and visuals.

Checked inputs: recorded increment_int listing and existing primitive facts tests/corpus.
The call argument is 7, add writes 8 to w0, caller remains waiting until ret; ret writes no
ordinary register. The model supplies the call, without teaching bl, x30 or stack storage.
A return path denotes control, not a transfer or calculation of the value in w0.
Arithmetic read/write paths derive from flowAt; pending writes must not show computed answers.
Fresh challenge inputs must remain distinct from worked examples.

Scope: four newly split Fundamentals lessons, PrimitiveOperation, local course CSS and browser
coverage. Preserve ten authoring sections, their accessible headings, complete numbered paired
C and instruction panes, contained scrolling and all challenges. Remove visual section labels
and redundant heading breaks only on these four lessons. Other lessons retain their styling.

Process: separate copy drafting and component implementation; independent learner and technical
review, followed by final built-page verification. Runtime guidance read from
skill://plugin_connector_1p_c5b7d5df5d7081918f2c4be5a633ed5d/cloud-environment-runtime/SKILL.md.

Initial failures, focused reruns and full-suite results will be recorded separately.

## Prose reduction

The separate drafting pass reduced the ten section bodies while retaining their essential
definitions and rules. Counts exclude figure copy, challenge tasks and hints, model notes,
objectives and headings; they count whitespace-separated words in the section strings.

| Lesson | Original | Revised |
| --- | ---: | ---: |
| One addition | 279 | 182 |
| A tiny function | 303 | 213 |
| Subtraction and reuse | 224 | 137 |
| Instructions in sequence | 245 | 167 |
| Total | 1,051 | 699 |

The reduction is 352 words, approximately 34%. Starting values now remain in the model-derived
figures where they are needed; repeated walkthrough sentences became focused checks of the
observed result. Canonical prose was synchronised and its eight focused tests passed.

## Implemented and independently checked

Four lesson section-body counts: addition 279→182, function 303→213, subtraction 224→137,
sequence 245→167; total 1,051→699 (about 34% less). Definitions, challenges and all ten authoring
sections remain. Seven supporting headings are visually clipped; activity, practice and reflection
retain full headings. This local course stylesheet does not alter the platform or later lessons.
The actual initial arithmetic figure now shows old sources, the operation and an unknown future
write. After execution the model result replaces that unknown. The function figure connects
caller and register, and distinguishes an initial argument path from the labelled dashed return.

Each lesson has an independent browser-reader record in this directory. A separate technical
review checks sources, term assumptions, shared uses and the built function. All readers checked
375, 768 and 1280 CSS pixels in both actual themes, plus stepped, restored and reset states.
No blocking finding. The sceptic records one minor intro/caption repetition as non-blocking
context rather than a required correction.

Focused checks, separately from the full suite:

- Component unit command: 7 passed.
- Canonical/schema command: 8 passed.
- Independent semantic command: 3 files, 47 passed.
- Fundamentals educational command: 36 passed, zero skipped/failed (2 minutes).
  It checks every fresh challenge, local scroll/keyboard movement and resize at 375/768/1280,
  source associations, state restoration and reset in both themes/projects.
- Typecheck and production build passed before reader review.

Final full-check and remote CI results belong in the pull-request validation record. No new program or
call was introduced; the existing GNU/QEMU corpus retains all displayed primitive/function runs.

Initial full check exited 1 in unit tests: 15 files/16 assertions reported the same
rationed-word violation (“carry” used in ordinary prose before its arithmetic definition).
There were 2,829 passing assertions. A focused gate diagnostic also exited 1 (29 pass/1 fail).
The draft was corrected to “Use the first result when running the second instruction”, with
canonical copy synchronised; no term exemption was added. Full check restarted afterwards.

Restarted full check: formatting, copyright, platform integrity, types, all 144 unit-test files
(2,845 assertions) and the production build passed. The complete 1,138-case browser inventory
was started before the branch was pushed; merge waits for local and remote checks to pass.
The final revised sentence was independently rechecked in the rebuilt page in both themes
at phone and desktop widths, as recorded in sequence-reader.md.
