# Module 0 stepping-note review

Independent learner and technical review, 18 October 2026. Scope: the role badges on the two
Module 0 predictions, runtime role-label wiring and the shared simulator note. The reviewer
did not draft or edit these changes.

## Verdict

No findings. “Prediction” names what the learner does in these figures. It does not imply
that the prediction card contains Next and Back controls. Both cards retain `timeModel: steps`,
so this presentational change does not misrepresent how their results are computed.

The shared note explains one instruction per step and the lack of automatic changes between
steps without naming flags or memory before Module 0 introduces them. It does not assert that
every simulator step requires a button press. The Investigation prose already explains the
simulator, the marker and Next/Back controls, so no duplicate paragraph is needed.

## Technical check

Read `CLAUDE.md`, `docs/style.md`, the Module 0 context, the draft brief and the existing
`LessonView` role branch. A declared role takes precedence over the model badge. With no role
note, the existing runtime renders a plain badge and no disclosure. `RUNTIME_STRINGS` extends
the platform's existing role labels with the course's separately drafted “Prediction” label.
The two additions in the lesson do not change prediction props, measures or gating. There are
no platform changes.

The shared model note remains at the foot of the lesson because both prediction figures retain
their actual time model. It also remains available from the Investigation figure's “Stepped”
badge. The change removes the stepping disclosure from the prediction cards; it does not
remove the simulator explanation from the page.

## Built-page inspection

Inspected the final production page at
`http://localhost:4282/assembly-lab/#/lesson/meet-the-machine` in fresh Chromium contexts at
375 × 812 and 1280 × 800, in light and dark themes. Read the note and inspected screenshots of
the first prediction and the open Investigation note in all four configurations.

- Both prediction cards displayed the plain “Prediction” badge, with zero model-note toggles
  and zero model-note elements. Their time-model attributes still read `steps`.
- Neither prediction exposed an outcome before commitment.
- The first prediction's commitment showed the same simulator feedback and explanation,
  and made the Investigation's Next control available. It was absent before commitment.
- The Investigation badge still opened the final shared note.
- The lesson footer contained the same final shared note under “How the simulator steps”.
- No horizontal overflow, clipped text or page errors occurred in these configurations.

No newly assumed vocabulary was found. Register and instruction are already introduced;
the simulator is explained in Investigation before the remaining local disclosure. Both
style closing passes found the short note concrete and consistent with the surrounding prose.

Observations are in `/tmp/stepping-note-browser-review.json`; screenshots are
`/tmp/stepping-note-{prediction,investigation}-{375,1280}-{light,dark}.png`. These are local
review artefacts. The managing session's automated checks are separate from this review.

The managing session reports 36 focused unit checks and 20 automated browser cases across
phone and desktop, including both predictions and stepper gating, all passing. Strict types,
production build and diff checks also passed. Browser log: `/tmp/stepping-note-browser.log`.
