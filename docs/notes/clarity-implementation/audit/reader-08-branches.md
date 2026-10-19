# Independent learner review: 08, Branches

Read-only review of `branches`; no previous review notes read. Read CLAUDE.md, docs/style.md, docs/authoring.md, front-page Before you start, lesson order, this lesson's prose/labels/tasks/hints/feedback/model note/listings/structure and relevant prerequisite definitions. No content edits.

## Actual browser coverage

Built site `http://localhost:4290/assembly-lab/#/lesson/branches`, fresh Chromium contexts at 375 and 1280 pixels, light and dark. Read initial and expanded page text. In all four configurations, committed a deliberately incorrect first prediction, ran two steps, selected the boundary preset in the branch-path figure, ran the untouched construction starter's tests, and opened its first hint. Opened the lesson disclosures and read their rendered text. Visually inspected stepping and branch-path screenshots at both widths and themes. No horizontal document overflow in any configuration. Did not solve either challenge, exercise every hint in-browser, or finish both steppers. All hint/feedback strings were read in source. A final optional attempt to capture the generalisation heading timed out on its heading locator; that screenshot was not obtained. Its text was read from rendered initial/expanded page captures and source.

Evidence: `/tmp/reader08-initial.txt`; `/tmp/reader08-open-{375,1280}-{light,dark}.txt`; `/tmp/reader08-step-{375,1280}-{light,dark}.png`; `/tmp/reader08-arrows-{375,1280}-{light,dark}.png`; `/tmp/reader08-badge-expanded375.png`.

## Candidates

### 1. Medium: prediction cards still carry the stepping explanation

Quote: **“STEPPED”**, and on opening it, **“Each step runs one instruction in the simulator. Between steps, the simulated processor stays as the last instruction left it.”** Above “A prediction about how many instructions describe(15) runs.”

Location: `content/lessons/branches.ts:93` and `:168`; shared wording `packages/views/src/strings.ts:11` and `:13`. Neither prediction interactive supplies `role: "prediction"`.

State: untouched first prediction, before choosing/checking; reproduced all four configurations. The explanation also remains on the later failure prediction. These cards have prediction controls, not step controls. The actual stepper is a separate locked card below.

Learner effect: the label describes the engine rather than the learner's current task, and the note explains an action that cannot be performed here. This repeats the placement problem the user identified in Module 0.

Direction: apply the prediction-role presentation consistently to these prediction kinds; retain stepping guidance at the actual stepper. No need to alter model behaviour.

### 2. Medium: the generalisation relies on an example introduced only inside a closed note

Quote: **“In `maybe_beep`, the `if` became a branch, `cbz`.”** Then **“In `maybe_beep`, the branch decides whether execution reaches the instructions that run `beep`.”**

Location: `content/lessons/branches.prose.ts:107` and `:108`. The example and meaning of `beep` occur at `:100`–`:104`, inside “An excerpt of GCC's maybe_beep”; `content/lessons/branches.ts:205` places it in section details.

State: ordinary reading with optional notes left closed. The preceding main Explanation text discusses `service`, not `maybe_beep`; it gives no direction to open this note before continuing. The next section assumes the hidden example has been read.

Learner effect: the explanation of why a branch is needed to control another function depends on a program the reader has not seen. The unfamiliar function names make this central comparison harder to follow.

Direction: put the minimum necessary setup for this example in the main flow, or explicitly make reading the note part of the transition. Keep optional compiler detail optional.

### 3. Low: feedback presupposes a branch even in the branch-free starter

Quote: **“The wrong value comes back. Which label did the run reach, and which branch sent it there?”**

Location: `content/lessons/branches.prose.ts:73`–`:74`; starter at `content/lessons/branches.listings.ts:59`.

State: press Run tests on the untouched construction starter. Observed in all four configurations; the quoted feedback appears for its first failed case. The supplied starter has no branch or label declaration.

Learner effect: a learner using tests to establish what the starter does is directed to inspect a branch and destination that do not exist. The feedback assumes a more advanced implementation state than the actual submission.

Direction: select feedback from the run/submission's actual structure, or use general return-value guidance when no branch exists. Preserve branch-specific feedback for submissions that contain branches.

## Assumed knowledge

The substantive missing setup is `maybe_beep`/`beep` above: defined on this page, but only behind a closed optional note that the following main prose silently requires.

No additional unsupported prerequisite candidate is raised. Evidence for key prerequisites: front page explicitly assumes `int`, `unsigned`, `return` and `if`; Module 0 defines instructions, registers, simulator and GCC/`-O1` (`meet-the-machine.prose.ts:10`, `:16`, `:51`); `constants-and-widths.prose.ts:46` explains optional `#`; the immediately preceding lesson defines compare operand order (`compare-and-choose.prose.ts:23`–`:26`), `cmn` (`:30`), signed/unsigned conditions (`:93`–`:107`) and csel/cset (`:110`–`:112`); warning-word service bit is supplied in masks. This lesson defines labels and taken/not-taken before its prediction, and `cbz` before construction. Time/state references in its main prediction and count task identify the whole function run and explicitly include `ret`; no analogous missing execution moment was found there.
