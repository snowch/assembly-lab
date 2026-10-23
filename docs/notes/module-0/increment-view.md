# Tiny function activity implementation

Copyright © 2026 Christopher Snow

The user requested a complete single-add function immediately after the opening addition. This implementation adds one `function` activity inside the existing activity sequence; later arithmetic activities and their prediction gates keep their purposes.

## Model and display

`INCREMENT_INT` is the separately recorded GCC listing supplied by the managing session. The function activity executes its two instructions using `traceOf`/`viewAt`. `ListingView` keeps its complete numbered C paired with the two instructions and uses the checked source associations for execution highlighting. The single current `w0` register, write mark and caller result read simulator state. Only the trace's `returned` stop changes the caller from waiting to resumed. No special `bl`, return-address register, stack, invented caller program or numeric program counter is introduced.

The activity starts at function entry: the caller has already supplied the argument. Its caller box labels the original argument throughout. Running the addition changes the current register but does not resume the caller. Running `ret` resumes the caller with the existing value, with no write mark on `w0`. The function stage does not show the separate operand-flow result card used by arithmetic-only activities.

The separate drafting session owns labels and explanation copy. This implementation consumes those labels; it does not claim learner clarity or independent technical approval.

## Saved work

New writes identify the activity by its program entry. Older numeric stage records are interpreted through the operation-only sequence before locating the current activity. Thus inserting the function does not reinterpret an older saved destination/reuse/subtraction/sequence activity as another task. Starting again records the first activity's entry and clears its step/prediction.

## Focused verification

`npx vitest run packages/views/src/primitive.test.tsx` passed: **one file, seven tests, 3.65 seconds**. The tests retain the existing arithmetic results and prediction checks, and cover the complete function's initial/after-add/after-ret values, complete listing, matched highlights, caller waiting/re-entry, absence of a result before the return, no `w0` write at `ret`, fresh-store restoration, Start again and a legacy saved destination prediction. The old sequence-stage test also exercises its legacy numeric mapping.

These are jsdom/model interaction checks. No production build, real browser, visual/theme check, full suite or differential tool run was performed by this implementation session. Those remain the managing session's coordinated checks and independent review work.
