# Browser-test migration for the approved flags presentation

The old page used all cases in one editor and a permanently expanded 33-place adder. The approved page uses a one-case-at-a-time registered grader and an optional scrolling calculation. Those presentation tests are replaced by `flags-lesson.spec.ts`; shared model/grader and generic-platform unit tests remain. Unchanged later lessons retain their browser tests.

Replacements cover every column against the real record, signed/unsigned display invariance, prediction commitment, checked-case aggregation and invalidation, existing work and hint migration, reset/reload, malformed/tampered saved state, keyboard/touch targets, themes and scoped routing.

- tests/educational/module-2.spec.ts: "loads with no console error, selected sections, two challenges and a closed note"

- tests/educational/module-2.spec.ts: "the two predictions commit before they reveal, and the model says which is right"

- tests/educational/module-2.spec.ts: "a commitment is kept, and is still there after a reload"

- tests/educational/module-2.spec.ts: "stays shut until the prediction before it is checked"

- tests/educational/module-2.spec.ts: "draws each column from the model's record: the answer bit and the carry into the next column"

- tests/educational/module-2.spec.ts: "goes back a column, shows every column at once, and starts again"

- tests/educational/module-2.spec.ts: "asks for twelve choices, none made, and the program it is about"

- tests/educational/module-2.spec.ts: "is completed by tapping the twelve choices, on a phone and on a desk"

- tests/educational/module-2.spec.ts: "asks for every choice before it grades anything"

- tests/educational/module-2.spec.ts: "opens the adder on 1 plus 0xffffffff only once the choices pass, and draws C 1 and Z 1"

- tests/educational/module-2.spec.ts: "rejects a wrong flag, names the addition and not the flag, and does not complete"

- tests/educational/module-2.spec.ts: "fails the starting point, which has chosen nothing, and a run of all zeros"

- tests/educational/module-2.spec.ts: "survives a reload, graded again, and is gone when the work is cleared"

- tests/educational/module-2.spec.ts: "text is legible, controls are reachable, nothing scrolls sideways, prose keeps its measure"

- tests/educational/module-2.spec.ts: "and so are the figures once they have been used: the adder part way, a verdict shown, the note open"

- tests/educational/module-2.spec.ts: "the adder's 33 places fit the screen, on a phone and on a desk"

- tests/educational/module-2.spec.ts: `the adder is drawn in the ${theme} theme, with filled bits, carries and flags told apart`

- tests/educational/module-2.spec.ts: "the way back leads to the front page, where the lesson is listed"

- tests/educational/module-2-improve.spec.ts: "a group move says which columns it worked, and reaches the state 32 single steps reach"

- tests/educational/module-2-improve.spec.ts: "the column just worked is the model's, and Back restores the column before"

- tests/educational/module-2-improve.spec.ts: "the carries at bit 31 and the lines for C and V show only when column 31 is done, and bit 31 is labelled"

- tests/educational/module-2-improve.spec.ts: "keeps its 33 places aligned at 360 pixels, with no sideways scroll, in every row"

- tests/educational/module-2-improve.spec.ts: `shows the figure, the calculation and the panel in the ${theme} theme`

- tests/educational/module-2-improve.spec.ts: "is three groups, one for each addition, each with a row of N, Z, C and V, none chosen"

- tests/educational/module-2-improve.spec.ts: "names each wrong flag with its rule, never its value, and keeps the answers chosen when the learner tries again"

- tests/educational/module-2-improve.spec.ts: "shows the text after the flags challenge only once it passes, with the adder it opens"

The mixed old prediction test also visited M2 L2; its independent commit/restore and stale-flag tests remain in the M2 L2 sections of both suites.
