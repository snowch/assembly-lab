# Register-state labels across the course

User request (30 October 2026): label register values by the execution moment on every page,
using appropriate separate agents. Approved examples: Before the first instruction; After
`add w0, w0, w1` (the actual last executed instruction); Final values when execution ends.
Back and Reset must keep the label in agreement with the bank.

## Facts and scope

- `packages/views/src/trace.ts` viewAt reconstructs the same state shown by the bank, clamps the
  step, and supplies the executed listing index and stop reason. Use this data, not the next
  marker, hypothetical result or a separate counter.
- Stop kinds are returned, limit and fault. Short introductory activities also deliberately stop
  after the displayed arithmetic sequence without returning. Avoid implying a successful return
  at a fault or an unfinished bounded trace. Some figures start at a preset nonzero step.
- Next, Back, Reset, scenario/input selection, deletion switches and update handoff can change
  the viewed state. Labels must follow the viewed state automatically.
- Native figures are labelled recordings. Static register-width schematics, editable bits,
  prediction inputs and arithmetic-column reveals are not instruction execution. Existing truthful
  labels can remain; do not add a false execution label just to cover a page.
- Keep specialised context such as shared caller registers. Prefer replacing a vague 'Registers
  now' label rather than adding a duplicate. One temporal label per bank/group, no extra headings
  or duplicate live announcements. Render assembly as code and contain long labels on phones.

Sources: CLAUDE.md, docs/style.md, docs/authoring.md, docs/visual-language.md, model run and trace
helpers, recorded/compiler sources used by each figure. All displayed state remains model-derived.

## Agents and ownership

- Implementation/inventory: GPT-6.1 (`gpt-6.1-sol`), High, separate register_labels_impl agent;
  source components/helpers/strings and component unit tests only.
- Drafting: separate GPT-6.1, Medium, checked copy brief; return copy, no implementation edits.
- Independent learner review: separate GPT-6.1, High; built phone/desktop, actual light/dark themes.
- Independent technical review: separate GPT-6.1, Extra High; state derivation, faults/limits,
  presets, hidden gates, restoration, and coverage of all relevant component families.

Root integrates copy/canonical notes, course-wide browser checks, builds, CI and merge. Leave the
unrelated untracked docs/notes/module-12/pi-sources-brief.md untouched. Do not change platform/.
