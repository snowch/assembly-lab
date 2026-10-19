# Fresh learner review: 12 — Loading different widths

Independent read-only review of `loading-widths`, using CLAUDE.md, docs/style.md and docs/authoring.md. No earlier review notes read.

## Coverage

Read the entire target prose, labels, options, explanations, five-level hint ladders, model note and interactive configuration; inspected the shared memory-stepper/prediction strings and rendering code. Checked the front-page prerequisite panel and prerequisite material in the preceding course order, especially the full memory-and-addresses lesson, signed/unsigned readings and w/x widths; the large combined read of other prerequisite prose was truncated, so this is not a claim of complete fresh reading of all twelve preceding chapters.

Actual Chromium browser: http://localhost:4290/assembly-lab/#/lesson/loading-widths, widths 375 and 1280, both light and dark themes. Read rendered lesson text and visually inspected the first signed-load stepper in all four configurations. Submitted one deliberately incorrect initial prediction and ran its first instruction in all four. Inspected an expanded prediction badge and opened the first construction hint on phone/light. Did not solve challenges or exhaustively run all figures/inputs. No horizontal overflow observed in the four configurations. Screenshots: `/tmp/loading12-{375,1280}-{light,dark}-step.png`; expanded-note evidence `/tmp/loading12-prediction-badge.png`.

## Finding 1 — Low: the stepping explanation still precedes a prediction that has no step controls

Exact text: badge **“STEPPED”**, opening **“Each step runs one instruction in the simulator. Between steps, the simulated processor stays as the last instruction left it.”**, immediately above **“What hexadecimal value does w0 hold after the load?”**

Location: `content/lessons/loading-widths.ts:93` (`predict-signed-gradient`, `timeModel: STEPS` and no prediction role); shared text `packages/views/src/strings.ts:10`. The second prediction `predict-unsigned-gradient` uses the same configuration. The runtime chooses a model badge/note when no role is provided (`platform/lesson-runtime/src/LessonView.tsx:67`).

State/setup: fresh phone visit; press the STEPPED badge above the initial signed-gradient multiple-choice question, before choosing an answer. Reproduced and captured in `/tmp/loading12-prediction-badge.png`; the badge itself is present in all four browser configurations.

Learner effect: the note describes stepping when the available action here is choosing and checking an answer. It creates the same guidance-placement ambiguity recently reported by the user; the actual stepper sits below the question and is locked until a prediction is checked.

Direction: apply the prediction role to these prediction figures, leaving stepping guidance with the actual stepper. This requires no changes to the lesson's explanation or answer logic.

## Unsupported prior knowledge

None established in the target material. Relevant evidence:

- The front page assumes int/unsigned arguments, return, conditionals, loops and arrays, and explicitly promises that Module 6 introduces pointers.
- `memory-and-addresses.prose.ts` question defines bytes, addresses, pointer declaration/dereference and const; its motivation defines brackets and little-endian byte order. Its compiler note gives char/short/int/long widths and explains standalone unsigned.
- `constants-and-widths.prose.ts` failure experiment explains that x and w names are views of one register and that writing w clears the upper half; its generalisation introduces long.
- `one-pattern-three-readings.prose.ts` investigation explains hexadecimal and the signed top bit.
- This lesson itself defines zero/sign extension before the prediction, explains a cast beside the cast example, explains the byte-offset syntax before the record challenge, and explains signals within the optional conversion note.

The two prediction questions specify their observation point (“after the load” and what the changed program “return[s]”), so I found no equivalent of the earlier ambiguous “where is total?” timing question. The target explicitly distinguishes byte-to-w extension from clearing x's upper half, and the stepped diagram's copied/sign-filled/cleared labels support that distinction.
