# Automated verification

Run on 18 October 2026 for the clarity implementation. These results supplement the
[independent lesson and shared-interface review](summary.md).

## Full check

`npm run check` completed formatting, copyright, platform integrity and TypeScript
checks, all 2,747 unit/integration tests in 136 files, and the production build.
Its browser stage completed 1,044 cases in 25.4 minutes: 1,018 passed, 23 skipped
by the suite, and three failed. The command exited 1. The three failures were test
expectations corrected and rechecked below; no application failure remains from this run.

## Corrected browser expectations

Two desktop assertions still described the previous lesson structure:

- The masks test expected the enlarged view's old input. It now verifies that the
  enlarged input and result match the low eight bits of the main prediction. The
  main prediction is independently pinned to its configured input and simulator result.
- The calls-and-returns test expected three gated steppers. The accepted correction
  removed the duplicate, leaving two. The test now expects two for this lesson and
  three for recursive calls, both on first load and after clearing saved work.
  Unlocking and persistence assertions remain in place.

An independent sceptic accepted both test changes. Focused browser reruns passed:

```sh
AL_PORT=4293 npx playwright test tests/educational/masks.spec.ts \
  --grep 'the first prediction shows the mask'
# 2 passed: desktop and phone

AL_PORT=4294 npx playwright test tests/educational/module-9.spec.ts \
  --grep 'gates, committed feedback and persistence'
# 4 passed: both lessons, desktop and phone
```

Each actual focused run used a separate temporary output directory to preserve the
full run's failure artifacts. These are corrections to obsolete expectations;
the focused passes do not turn the original full command into a zero-exit run.

## Fractional-position assertion

The third full-run failure was an exact viewport-position assertion in the invalid
hexadecimal-input test. It measured a 0.25 CSS pixel difference on phone. An unchanged
focused rerun passed on phone but reproduced the same difference on desktop.

Independent measurement found unchanged action dimensions and unchanged position
within the challenge. The revised test checks those local measurements exactly and
allows less than half a CSS pixel of viewport movement. Invalid-input feedback and
unchanged saved bits are still checked for every rejected input. No application code
was changed for this test failure.

```sh
AL_PORT=4295 npx playwright test tests/educational/one-pattern-three-readings.spec.ts \
  --grep 'changes no bit for text' --repeat-each=3
```

All six runs passed: three on desktop and three on phone.

## Final source checks

The final two visible input-state headings in `CountPrediction` and `LoopPrediction`
landed after the full run's production build. A separate production build included
them, and independent readers checked initial and committed states at both widths
and in both themes. Keeping that build separate avoided replacing assets during
the full browser run.

- The two affected component suites passed all 32 tests, including visible headings
  and retained input values after committing an answer.
- The final subtraction and constants prose/facts checks passed all 96 tests in
  three files.
- Final-source Prettier and TypeScript checks passed. Later test-only edits received
  focused formatting and TypeScript checks; `git diff --check` passed.

These focused counts overlap the full unit/integration coverage and are not added
to it. After the full browser run, `npm run build -w @al/course` passed again,
updating the ordinary production preview to the final application source.
