# Independent learner/interface review: Writing w and x registers

Reviewed 2026-11-12 against the recovered build served at
`http://localhost:4440/?style=new#/lesson/register-widths`. The rendered footer identifies
commit `bd57219`. This is a fresh review, not a reinstatement of a lost review. No implementation
files were changed by this reviewer.

## Scope and learner position

I read `CLAUDE.md`, the shared-style-preview brief and recovery note, the front page's
“Before you start” requirements, and the preceding lesson material relevant to registers,
hexadecimal, signed and unsigned readings, `mov`, `movk` and `lsl`. I reviewed this one lesson
as a learner who has completed the earlier lessons and has not read later lessons.

The page expects basic C, binary place values and arithmetic from “Before you start”. Earlier
lessons supply register destinations and instruction order; 32-bit arithmetic; hexadecimal
notation; signed/unsigned readings; `ret`; loading constants with `mov`; and building halves
with `movk` and `lsl 16`. This page introduces byte and address locally, before using them.
I found no additional untaught prerequisite that prevents the learner doing the activities.
The optional calculator also explains the distinction between changing scratch bits and
executing instructions, including what widening and narrowing do.

## Findings

No blocking, major or minor learner/interface finding in the states checked. No suggested
wording replacement or challenge answer is included in this report.

The first instruction display, the logger example and the exercise are assembly-only. There
is no paired C/assembly listing on this particular published lesson. I checked those actual
listings for readable instruction text and contained layout; this review does not claim to
have checked a paired C listing elsewhere.

## Browser evidence

Headless Chromium through the repository's installed Playwright drove the actual recovered
preview. Each of these twelve combinations was checked:

| Width | Light | Dark |
| --- | --- | --- |
| 375 px | Current and New | Current and New |
| 834 px | Current and New | Current and New |
| 1280 px | Current and New | Current and New |

Actual `data-theme` and `data-style-preview` matched each requested combination. All twelve
had document scroll width equal to viewport width; the inspected lesson elements did not
escape the viewport. No browser `pageerror` was recorded. I visually inspected screenshots
of the rendered 64-bit figure, calculator, exercise/feedback and the page shell across the
matrix, including light/dark phone, tablet and desktop examples.

- **Prediction gate and 64-bit diagram:** before checking “Check your prediction”, the
  stepper remains closed. After a checked prediction it opens. The labels “x3: 64 bits”,
  “Upper 32 bits”, “Lower 32 bits”, “w3”, “cleared” and “written” remain distinguishable.
  The two halves, their bit groups, complete hexadecimal register display and explanatory
  note fit at 375 px. Current/New preserve the semantic markings in both themes.
- **Stepping:** I advanced the figure twice and ran the logger instruction. Switching
  Current → New preserved the figure step, entire figure text and logger state in every
  width/theme context. Separate phone checks exercised Back and Reset and confirmed the
  initial step was restored. Instruction highlighting, “Ran … Next …” status and the
  before/after labels remain visible and readable.
- **Entered work:** two deliberately incorrect exercise values, an applied calculator
  scratch value, a working-note canary and the first opened hint survived style switching
  in every width/theme context. Comparisons used the actual input values and rendered
  figure/calculator/note text, not inferred storage state. The incorrect submissions retained
  their per-field feedback. The five hint controls were also opened in sequence in a separate
  phone check; no hint was exposed before pressing its control.
- **Calculator:** its open panel, 64-bit bit controls, value input, width/reading controls,
  scratch result and arithmetic controls remain available at phone width. A separate check
  narrowed the scratch value to 32 bits, switched style and retained the result, then used
  Reset calculator. The local explanation keeps calculator resizing distinct from a real
  register write.
- **Saved work and ordinary reload:** in all six width/theme contexts I submitted a valid
  exercise, switched to Current and reloaded. The completed verdict and saved answer fields
  returned, and reopening Working notes restored the note canary. Independent calculator
  scratch closed/reset on reload, matching the established baseline. Transient figure
  stepping is not required to persist through ordinary reload. These baseline resets are
  not reported as new-style faults.
- **Keyboard and routing:** in both appearances at all three widths/themes, a focused
  “Skip to content” link was visible at the top and hit-testing its centre returned the
  link itself; Enter focused `#main`. In New, all four outline links were activated with
  keyboard focus and Enter. Each focused its target heading without changing the lesson
  hash route; every focused heading was at or below the sticky header's lower edge. At
  375 px the disclosure opened by keyboard and closed after each selection.
- **Toolbar/help:** the preview strip reserves space above the app at the top of the page.
  The focused skip link remains above it. The keyboard-opened help panel is fully within
  the viewport in both appearances/themes: at 375 px its bounds are x=49 to 359, y=68 to
  approximately 167. It dismisses by activating its summary again. It does not clip its
  explanation or permanently cover lesson instructions. The normal sticky shell can pass
  over scrolled content; a tall element screenshot can capture it partway down the image,
  which is not evidence of an extra floating toolbar in the document.

## Limits

This was a focused browser review of register-widths, with source reading only for the
prerequisite sequence and published lesson composition. It was not a full course regression
run, ISA/model audit, real-device touch test, screen-reader test, offline/service-worker test,
or review of later lessons. Temporary browser evidence and driver scripts are under
`/tmp/reg-review` and `/tmp/reg-*.cjs` in this workspace. No full-suite result is claimed.
