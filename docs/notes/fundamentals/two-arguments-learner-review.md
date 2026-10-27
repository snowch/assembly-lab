# A tiny function: two-argument learner review

Copyright © 2026 Christopher Snow

Review date: 27 October 2026. Separate learner-review agent; inherited parent model and effort,
with no model override. The reviewer wrote no learner-facing implementation. Scope is the whole
`tiny-function` lesson, with only the front page's stated C/arithmetic prerequisites and the
preceding One addition and Adding a constant lessons assumed. This report contains no practice
answer.

## Material and prior knowledge

Read the actual lesson prose/labels, both recorded C/assembly examples, the figure implementation,
the preceding two lessons, the front-page prerequisite panel, CLAUDE.md, authoring/style guidance,
and the visual language/audit. The review used the production build at
`http://localhost:4398/assembly-lab/#/lesson/tiny-function`.

- Before this page: small C functions using `int`, arguments and `return` are stated prerequisites;
  One addition defines registers, inputs, destination and the register-source `add` operand rule.
  Adding a constant demonstrates reading an old `w0` before replacing it.
- Defined here before the new example: listing, caller and argument; the one-argument incoming
  register/result rule; and the purpose of `ret`.
- New local definition: “For this function, the first arrives in `w0` and the second in `w1`.”
  The same paragraph connects the C names `a` and `b`, and explicitly introduces a separate
  `add_ints` call. It does not require an assumed stack, link register, calling instruction,
  ABI acronym or callee-saved-register rule.
- Compiler/version/setting qualifications remain explained in the existing model-versus-reality
  note. The page says the simulator supplies the call and omits the instructions making it.

No unintroduced prerequisite gap was found in the changed material.

## Progression and discoverability

The first complete `increment_int` example defines and demonstrates preparation of a result
separately from return of control. The new complete two-argument example then extends only the
incoming register map, using register-source addition already demonstrated in One addition.
It adds no stack or calling machinery and no extra arithmetic instruction.

An identity function containing only `ret` would be smaller but would not demonstrate the
separate result-preparation step. A three-argument sum would require more arithmetic and is not
needed for this bridge. The two-instruction/two-argument example is an appropriate next size.

Both named activities are visible before either has run. The second is in the ordinary
“Two arguments, one result” section, with its own controls. No completion-dependent discovery
or replacement activity selector is involved. The existing fresh-input practice still applies
to `increment_int`, and its lead explicitly returns to that function. The new two-argument map
is demonstrated rather than separately graded; this bounded worked extension does not need
another quiz merely to repeat the same add/return mechanism.

## Built browser checks

Independent script: `/tmp/two-args-learner.mjs`; log `/tmp/two-args-learner-browser.log`;
structured results `/tmp/two-args-learner-results.json`. Complete run exited 0 in four contexts:
375px and 1280px, each in actual rendered light and dark themes.

Checked in every context:

- Both activities initially visible, no locked or broken figure, and separate zero-step state.
- The two-argument caller retains its original argument pair while the destination register
  changes. “First argument”/“Second argument” identify the incoming registers; only `w0`
  changes its label to “Result ready”, then “Result”. `w1` keeps its input label and value.
- After addition the caller remains Waiting. Only the return step resumes it. Written markings
  distinguish the addition's write from the return's absence of a write.
- Both complete C sources remain paired with assembly. The return-expression C line highlights
  with each associated instruction. On narrow layouts the listing scrolls inside its own box.
- Reload at intermediate and returned states, independent reset, and stepping one activity
  without advancing the other. The existing single-argument example still runs and resets.
- Existing practice starts blank, rejects a wrong submission, accepts its reference outcome and
  restores checked work on reload. No practice value is reproduced here.
- No page-level horizontal overflow and no page errors.

Initial, result-ready and returned screenshots of the new example:
`/tmp/two-args-learner-{375,1280}-{light,dark}-{initial,ready,returned}.png`.
Viewed representative states in each width/theme: readable register labels, strong directional
arrows, visible waiting/resumed distinction and contained C/assembly listing.

Because the call figure is shared, an additional targeted visual capture checked the original
single-argument example in all four contexts, in all three states. Script
`/tmp/two-args-single-visual.mjs` exited 0; screenshots
`/tmp/two-args-single-{375,1280}-{light,dark}-{initial,ready,returned}.png`. Visually inspected
phone/desktop and both themes. No sibling layout regression found.

## Findings and closing passes

No blocking learner finding. No finding was rejected or waived, and no product edit was made
by this reviewer.

Sentence/style pass: concrete headings and short local directions; no new stack/call jargon,
no redundant compiler-details block on the second example, and no generic new closing section.
Idea pass: the learner can identify the two incoming registers, distinguish the argument pair
from the one returned result, and explain why preparing that result does not resume the caller.
The caller box, per-register labels and return path carry those relationships visually.

**Independent learner verdict:** approved for the reviewed production build. This is a browser
learner review, not a personal GNU/QEMU run or hardware verification; compiler/native accuracy
belongs to the separate technical review.
