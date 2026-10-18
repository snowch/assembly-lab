# Module 0: time in the total prediction

## Brief and checked facts

The learner should distinguish a register from the value it holds, and identify where the first
value of `total` is kept. The learner knows a little C and basic arithmetic; this section has just
defined a register. Draft against `docs/style.md`.

- `TRIP_DISTANCE` in `content/lessons/meet-the-machine.listings.ts` starts with
  `int total = leg1 + leg2;` and `add w0, w0, w1`. Its checked source association is C line 3.
- The arguments put `leg1` in `w0` and `leg2` in `w1`. The first addition replaces `w0` with
  their sum. The next addition and subtraction each update `w0` again.
- `content/lessons/meet-the-machine.ts` selects the `first-write` prediction measure.
  `packages/views/src/interactives/TracePrediction.tsx` checks the first step's written register,
  from a simulator trace computed only after commitment. It does not check the final value.
- `content/lessons/meet-the-machine.facts.test.ts` pins the successive values of `w0` for the
  example call: 205, 247 and 232.
- This recorded function uses `w0` for the successive values of `total`. That is a fact about
  this listing, not a rule that every C variable always stays in one register.

## Separate draft

Updated the canonical `prose.md` first, then copied its wording to
`meet-the-machine.prose.ts` and `meet-the-machine.labels.ts`.

The introduction identifies the first C statement. The question and caption explicitly ask
about the state after the first instruction. The explanation, still shown only after commitment,
distinguishes the original argument from the first value of `total` and its later updates.
Options and prediction behaviour are unchanged. The caption now belongs to the canonical prose;
the prose consistency test's list of captions outside that file needs the corresponding update.

Independent review and built-site verification belong to the managing session.
