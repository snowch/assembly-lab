# Independent reader/checker: 12 Loading different widths

Verdict: accepted local correction L13 and relevant shared corrections are effective. No remaining supported finding or introduced clarity regression identified within this review's coverage. No course files edited.

## Method and actual coverage

Read CLAUDE.md, docs/style.md and docs/authoring.md; then this lesson's full prose, labels, structure, both challenge tasks and all ten hints. Read the front-page prerequisites and relevant prior explanations of hexadecimal/signed bits, register widths and memory/addressing. Formed the initial reading before consulting the audit summary and verification coverage plan. No author self-justification was used.

Chromium at 375 and 1280 pixels in light and dark, with the raw `assembly-lab:v1:theme` localStorage string and asserted HTML `data-theme`. Initial full-page states were captured at http://localhost:4291/assembly-lab/#/lesson/loading-widths. All four configurations were then freshly opened and interacted with at the final http://localhost:4292/assembly-lab/#/lesson/loading-widths. The coordinator identified the intervening build change as unrelated to this lesson.

In all four final-build configurations: checked both predictions using an incorrect offered choice; observed result/explanation and gate opening; advanced the signed-byte load by one instruction; opened the Stepped disclosure; ran both untouched challenge starters and opened all five hints for each; opened the signed-cast detail; read the model limitations. Page scroll width equals viewport width in all four. Representative phone/desktop and both-theme screenshots were visually inspected; readable source pairing, byte diagrams and post-prediction explanations.

Artifacts: `12-{width}-{theme}-initial.{png,txt}`, `12-{width}-{theme}-prediction{0,1}.png`, `12-{width}-{theme}-load.png`, and `12-{width}-{theme}-checked.txt` beside this report. Browser scripts `check12.mjs` and `check12-states.mjs` record actions. The initial attempt to select the Stepped button by its exact accessible name timed out; selecting the actual figure button resolved the probe issue and the final interaction run completed all four configurations.

Limits: did not submit challenge solutions, exercise every wrong assembly program, step every width example, or validate all instruction semantics against hardware. Full suite and build were outside this read-only assignment. Challenge solutions are not reproduced here.

## Reconciliation

- **L13 limitations vocabulary: fixed.** `loading-widths.prose.ts`, `modelVsReality`: “The sensor record has a byte layout defined for this exercise. A compiler may arrange the fields of a C record differently. The exercise supplies the bytes and addresses…” The preceding final task explicitly defines the record as fields at byte positions. This now states the limitation using concepts taught on the page, without requiring knowledge of structs or allocation APIs. The remaining phrase “obtaining storage” is ordinary context, not a procedure the learner must already perform.
- **Shared role/help alignment: fixed here.** Static listings display Diagram; both gated question cards display Prediction; the two coding tasks display Exercise. Actual instruction steppers retain Stepped and its one-instruction description. Initial closed gates and post-check opened figures both behave coherently.
- **Hint roles: coherent here.** Both second rungs describe an actual incorrect load/extension choice; both third rungs give a concrete smaller case. Hints appear under their corresponding concept/mistake/example/partial-answer/answer headings. No mismatch found.
- **Timing and register meaning: clear here.** The first question explicitly asks “after the load”; the failure question explicitly names the changed program and return result. Motivation distinguishes extension into the low 32-bit view from clearing the upper half, and the loaded-state diagram visibly separates copied, extended and cleared regions. No source/register confusion found.

## Assumed untaught knowledge

No newly required unexplained knowledge found. Prior lesson introduces bytes, pointers as addresses, bracket syntax, load/store widths, little-endian order and the shared x/w register relationship. Signed bit interpretation and hexadecimal appear earlier. This lesson defines zero/sign extension, casts and byte offsets locally. Optional signed-conversion detail now explains what a signal means. Compiler setting/target details rely on previous introductions; the task does not require operating a compiler. The sensor record is explicitly specified in bytes, so it does not require C structure-layout or memory-allocation knowledge.
