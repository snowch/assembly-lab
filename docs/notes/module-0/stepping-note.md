# Module 0: place the stepping note with the stepper

## Brief and checked facts

The learner should meet the simulator explanation when learning to step through a program.
Before the first prediction, the learner has encountered registers and the recorded function's
instructions. Flags and memory have not been introduced. Draft against `docs/style.md`.

- `PROSE.investigation` already explains that the simulator is a JavaScript program in the
  browser, introduces the instruction marker, and explains Next and Back. No additional lesson
  paragraph is needed.
- `VIEW_STRINGS.modelNote` supplies the generic simulator explanation through
  `packages/views/src/book.tsx`. Its current references to flags and memory precede their
  introduction when displayed above the first prediction.
- `platform/lesson-runtime/src/LessonView.tsx` uses a figure's role for its badge and optional
  note when a role exists. With a role and no role note, it displays a badge without an expander.
  The figure's actual `timeModel` remains unchanged.
- Both Module 0 predictions compute simulator results after commitment. They do not offer Next
  and Back controls. The first checks the first write; the second checks a value at the end.
- `packages/machine/src/run.ts` advances the simulated processor by executing one instruction
  per recorded step. A run may compute successive steps automatically; a step does not mean
  that the learner must press a control.

## Separate draft

The prediction role label is **Prediction**. It identifies the activity without suggesting that
its figure has stepping controls.

The shared simulator note becomes:

> Each step runs one instruction in the simulator. Between steps, the simulated processor stays
> as the last instruction left it.

This explains the simulator's sequence without introducing flags or memory, and does not claim
that every instruction requires a button press. The existing investigation prose remains
unchanged. The managing session will give both Module 0 predictions the role and retain the
stepping explanation on the investigation figure.

Independent review and built-site verification belong to the managing session.
