# Independent learner review: register-state labels

Reviewed 30 October 2026 against the unchanged production build served at
`http://localhost:4411/assembly-lab/`. The reviewer made no product edits.
Read `CLAUDE.md`, `docs/style.md`, the written brief and coverage inventory before
reviewing the pages in course order. This is a focused review of learning clarity and
layout, not a technical trace audit or a fresh review of every lesson's prose.

## Result

Ready within the agreed label scope. No blocking finding in the normal course examples.
The labels identify the displayed moment clearly, stay beside their banks, and follow
forward, backward and reset controls. One existing extreme long-source layout limitation
is recorded below; it persists with the new label removed.

## Browser coverage

Chromium exercised 13 representative figures in each of four configurations: 375 × 812
and 1280 × 900, with actual light and dark themes. All 52 cases completed without page
errors, normal-example page overflow or label overflow. The rendered `html[data-theme]`
matched the requested theme in every case. Labels use the theme's muted foreground at
15 px with 23.25 px line height, and were readable in inspected screenshots.

| Family | Lesson and figure | States exercised in all four configurations |
| --- | --- | --- |
| Primitive fixed inputs | `one-addition`, `worked-addition` | Initial, Run, completed operation, Start again |
| Primitive function | `tiny-function`, `worked-function` | Initial, arithmetic step, return, Start again |
| Returning to caller | `returning-to-caller`, `follow-return` | Initial, two steps, Back, bounded endpoint, Start again |
| Primitive sequence | `instructions-in-sequence`, `worked-sequence` | Initial, both arithmetic steps, bounded endpoint, Start again |
| Stepper | `meet-the-machine`, `step-trip` | Initial, two steps, Back, returned endpoint, Reset |
| Wide stepper | `constants-and-widths`, `service-halves` | Initial, arithmetic step, return, Back, Reset |
| Word stepper | `shifts`, `step-div2` | Prediction checked, initial, two steps, Back, return, Reset |
| Solution stepper | `masks`, `step-solution` | Challenge run, initial, two steps, Back, return, Reset |
| Select stepper | `compare-and-choose`, `step-own-less-fuel` | Passing saved solution, initial, compare/select, Back, return, Reset |
| Memory stepper | `loading-widths`, `step-signed-gradient` | Prediction checked, initial, load, return, Back, Reset |
| Stack stepper | `calls-and-returns`, `step-small-returning-call` | Initial, two steps, Back, return, Reset |
| Compiler playground | `from-c-to-instructions`, `play-from-c-to-instructions` | Prediction checked, Compile C, Run with these inputs, initial, two steps, Back, return, Reset |
| Native model bank | `debug-native-instructions`, `native-gdb-stops` | Prediction checked, initial, two steps, Back, return, Reset |

The primitive activities expose Start again rather than Back; no absent Back control is
claimed as tested. The caller walkthrough ends at its deliberately bounded endpoint,
where the bank retains an After label rather than claiming the whole run has returned.

Screenshots were captured for every matrix case. Visual inspection included every family
at phone width, phone light/dark word views, phone dark native comparison, desktop light
Stepper and shared caller bank, and desktop dark solution, stack and native views.

## Learning clarity

- “Before the first instruction” distinguishes the incoming bank from a result. “After”
  names the instruction that ran, with assembly rendered as code. “Final values” appears
  at completed returns. Back and Reset restored the corresponding earlier wording.
- “Registers shared by caller and function” remains above the caller bank. Its initial
  “Before the call” returns on Start again and keeps hidden setup out of the learner's
  explanation. Later labels identify the visible completed instruction.
- The single-operation primitive bank keeps “Before the instruction” after Run. The
  separate destination result remains visibly separate. The multi-instruction primitive
  bank changes its label as its actual contents advance.
- Solution details retain their explicit before/after rows. One temporal paragraph names
  the instruction for that group; the detail disclosure receives no second heading.
- Native evidence retains “Recorded GNU/QEMU/GDB run”. The temporal label appears only
  under “Browser model”, making its association clear on both stacked and side-by-side
  layouts. The recorded startup panel retains its own stop context.
- The early static register-width diagram receives no execution label. Prediction inputs
  and other static diagrams were inspected in context on these routes, rather than
  treated as steppable current-state banks.
- The added label is an ordinary paragraph, not another heading or live region. Existing
  run statuses still explain the next action. No unnecessary second bank label was seen.

The review treated only the front-page prerequisites and earlier course lessons as known.
The new labels assume the learner knows an instruction, a register and execution order;
these are introduced before the first changed figure needs them. The caller and later
families use their already introduced function/return and instruction vocabulary. No new
untaught term was found in the added labels. This is not a claim that all pre-existing
prose on these routes has received a new prerequisite audit.

## Existing limitation: extreme learner-written source

Severity: moderate layout limitation, retained outside this change's scope after the
managing reviewer considered the isolation evidence.

An additional probe used a valid logical instruction with a hexadecimal immediate padded
by 110 leading zeroes in the masks solution figure. At phone width 375, the displayed
“After” instruction wrapped internally but its grid track extended beyond the figure:
label width 576 px, parent figure width 343 px, parent scroll width 1038 px and page scroll
width 1055 px. Both actual themes reproduced it. Desktop width 1280 remained contained.

Shortening the label to an ordinary instruction left the page at 1055 px and the label
track at 576 px. Hiding the temporal label also left the page at 1055 px and parent scroll
width at 1038 px. This isolates an existing sibling/grid expansion rather than overflow
introduced by the temporal paragraph. The normal instruction matrix had no such overflow.

Direction for separate layout work: constrain the solution figure's grid track and contain
long learner-written listing/status text, then repeat the phone probe. The present review
does not claim arbitrary long-source phone containment.

## Evidence and limits

Disposable browser harnesses and screenshots are under `/tmp/register-label-learner/`;
`results.json` records the 52 completed cases, states, actual themes, label geometry and
page widths. `long-results.json` records the additional long-source probe. The isolation
script is `/tmp/register-label-long-isolate.mjs`. Harness setup mistakes were corrected
before the final complete matrix; they were not product failures.

Faults, limits, restored positions, migrations, all wide modes and nonzero presets belong
to the independent technical review and managing session's broader checks. This learner
review exercised representative routes for all 11 executing families, not every figure or
route. It did not run the full unit or educational suite and does not claim those results.
No build change occurred during the final matrix.
