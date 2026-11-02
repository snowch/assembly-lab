# Reading explanations in sequence: independent technical review

Reviewed 2 November 2026 by a separate Codex agent that did not draft or edit the
implementation. The session's inherited model and effort were used without an
override. Read `CLAUDE.md`, `docs/style.md`, `docs/authoring.md` and
[the checked brief](brief.md) before reviewing the changed source and built page.

Verdict: no correction required. No high-, medium- or low-severity technical
finding survived the source, model and browser checks below.

## Accuracy and scope

- The opening paragraph and the explanation before the reader now teach only
  unsigned weights and contributions. They identify bit 0, doubling to the left,
  bit 31 and the model-backed all-ones starting example. The Signed and Compare
  button names remain visible from the start, as the brief requires.
- Signed visibly explains “The signed reading gives the top bit weight
  −2,147,483,648”, keeps lower weights positive, names two’s complement, distinguishes
  the top bit from a separate minus sign and supplies the local C `int` connection.
  Compare visibly explains the same bits, the two top weights and equality when
  the top bit is clear. Required explanations are outside optional details.
- The representation claims agree with C23 draft N3096, 6.2.6.2p1–3 and p6. I read
  the primary text in `/tmp/bitweights-n3096.txt`: unsigned positional weights,
  the unchanged lower signed weights, the negative top weight and the name
  “two’s complement”. The `int` statement retains “here”; it does not assert that
  every C implementation has 32-bit `int` or that signed C arithmetic wraps.
- `readingsOfPattern` still writes the pattern with assembled `mov`/`movk` and
  obtains both readings from the executed machine state. `topBitTable` derives
  the isolated top and lower contributions through that reader. The change
  filters which existing sums are rendered; it changes neither arithmetic nor
  the bit-writing path. The all-ones starting call remains the existing model
  run, separate from the earlier hexadecimal exercise.
- Switching views calls only `setView`. Reset still restores `first` and selects
  Unsigned; Clear bits preserves the selected view. The existing handoff keys for
  bits and selected reading remain unchanged. The earlier hexadecimal reader and
  optional scratch reader do not use `TeachingReadings`.
- The lesson still declares unsigned reading, signed reading, top bit and two’s
  complement in `introduces`. Moving the explanation into local guidance does not
  introduce a term earlier in the course. The previous hexadecimal activity
  already teaches setting and clearing bits. No new unexplained assembly or C
  mechanism is required by the changed guidance.
- Current Module 1, pacing, appendix and new reader canonical prose records are
  synchronised. Historical drafting/review notes remain historical. The added
  exact-record check covers the new guidance, and the numeric facts check now
  includes its grouped weights.

## Built-page verification

I started a separate preview on port 4183 after the managing session reported the
final build ready. The custom Chromium browser check
`/tmp/reading-sequence-technical.mjs` exited 0. It exercised all six combinations
of 320, 375 and 1280 px with light and dark themes. Actual `html[data-theme]` and
computed body colours were checked: light `rgb(243, 246, 245)` and dark
`rgb(16, 22, 21)` backgrounds.

Every combination checked:

- initial unsigned-only prose, all three buttons, all ones and a closed calculation;
- opening the full calculation before changing bits or switching modes;
- the active guidance, appendix-link visibility and exactly the selected sum(s);
- preservation of the edited pattern across Signed and Compare;
- model-consistent totals after clearing bit 0, then clearing the top bit, including
  equality of the two readings while the signed top weight remains negative;
- zero, Clear bits, and reset with the calculation both open and closed;
- reset restoring all ones, Unsigned and its guidance; ordinary reload returning
  to that initial state with a closed calculation;
- the optional scratch reader remaining a separate legacy reader whose edits
  neither alter the teaching reader nor populate the challenge;
- the earlier hexadecimal exercise retaining its original example and showing
  no numerical-reading controls or guidance.

There were no browser page/console errors and no page horizontal overflow.
Screenshots and measurements are in `/tmp/reading-sequence-technical/`. I visually
inspected initial, Signed/open and Compare/open images at 320 px, Signed/dark and
Compare/light at 375 px, and Signed/light and Compare/dark at 1280 px. The local
guidance, buttons, grouped weights and selected full calculations were legible.
Phone tables retain their contained horizontal scrollers.

The managing session's separate focused run in
`/tmp/reading-sequence-unit.log` passed 2 files / 10 tests, including the existing
teaching-reader handoff test. I read that test and the unchanged handoff mechanism:
it saves and restores the edited bits and Signed selection together, then resets
both. I did not repeat that run or trigger a coordinated service-worker update in
my browser. This review's browser matrix is not a claim that the full course suite
or GNU/QEMU differential suite was rerun by this reviewer.

## Test adaptation review

The new component and educational checks assert interaction and sequence: absent
initial signed explanation, per-view calculation membership, retained edited bits,
and reset removing the signed calculation and guidance. The educational check
opens the calculation before switching views, so it would catch a stale open
calculation containing both readings. The appendix browser check now first asserts
that its link is absent in Unsigned, selects Signed, verifies its local explanation
and C connection, then follows the live link. This preserves the link's original
navigation assertion while matching its intended new location.

I also reviewed the managing session's test-only correction from `innerText` to
`textContent` when capturing the hexadecimal row before `toHaveText`. This removes
the rendering-dependent newline mismatch while preserving the comparison of the
entire row before and after switching views. The independent browser matrix
separately compares the hexadecimal value itself across every mode change.

The prior static expectation that the complete signed explanation precedes the
figure was intentionally replaced with an unsigned-only assertion over the first
two sections. Visible signed explanations are checked separately in the component
and browser tests. No challenge-answer, arithmetic, reset, handoff or existing
layout assertion was removed to obtain a pass.

## Accepted and rejected findings

Accepted technical correction requests: none.

Rejected concerns, with evidence:

- **Initial Signed/Compare names violate the sequence:** rejected. The brief
  explicitly preserves all three visible buttons. Only unsigned mechanisms are
  explained before a view is selected; the names identify discoverable actions.
- **The signed mechanism has moved into optional detail:** rejected. The built
  Signed guidance is visible above its bit controls; the optional disclosure
  contains only its expanded calculation. Compare has its own visible explanation.
- **View changes or reset could leave an old calculation behind:** rejected.
  Source passes the current selected-reading list into the calculation on every
  render. All six browser cases preserved an open disclosure while its content
  changed correctly, and reset produced only the unsigned sum.
- **A separate smaller exercise is needed before the current challenge:**
  rejected for this change. The same editable figure allows practising each
  reading and the comparison immediately beside their explanations. A smaller
  complete example remains available through the optional appendix. This is a
  discoverable sequence with no unlock gate, as requested.

After forming my own verdict I cross-checked the independent learner review. It
reported no correction requests and independently confirmed local signed and
comparison explanations, discoverable view names, per-view calculations, resets,
ordinary refresh and scratch independence at 375 and 1280 px in both actual themes.
Its judgement that the short Signed paragraphs each perform a distinct teaching
job agrees with the source and screenshots. There is no unresolved disagreement
between the two reviews.

My separate preview was stopped with Ctrl-C after review (intentional exit 130).
No review preview remains running on my behalf.

## Amendment: full-run findings and focus-test correction

The managing session reported that CI for the original head `52a12eb` passed
3,111 unit tests and finished its browser suite with 1,453 passed, 20 skipped and
one failure. The failure was the existing four-bit group outline test: after
focusing bit 21 it expected one highlighted group and observed two.

I independently reviewed the test-only correction in
`tests/educational/one-pattern-three-readings.spec.ts` and the shared
`BitToggles` implementation. The implementation intentionally highlights a group
when either its bits have keyboard focus **or** its group is hovered:
`hover === nibble || focus === nibble`. Clicking Compare leaves the pointer at
the button's screen coordinates. The taller explanation and subsequent scrolling
can move another group beneath that stationary pointer while bit 21 receives
focus. Two highlights in that combined state do not demonstrate a broken focus
outline.

Accepted correction: park the pointer at `(0, 0)` after scrolling the reader into
view and before the keyboard-focus assertions. This is the smallest harness fix:
it establishes a keyboard-only state without changing production interaction or
allowing extra highlights. The test still requires exactly one highlighted group,
exactly four bit buttons, digit index 2, a solid 2 px outline and an underlined
digit. Blur must still clear every highlight. The desktop's separate explicit
hover of bit 9 must still highlight only digit index 5. No assertion was weakened,
removed or given a wider tolerance.

I also reproduced the difference independently in the built page at 1280 × 800.
With the original pointer position, zero groups were highlighted before focus,
then digit indices `[1, 2]` were highlighted after bit 21 received focus. With the
pointer parked first, the corresponding result was `[2]`. The unchanged build was
served on my separate port 4183 preview; the short harness
`/tmp/reading-sequence-focus-review.mjs` exited 0. I then stopped that preview with
Ctrl-C (intentional exit 130).

The managing session's focused repeat run, independently read in
`/tmp/reading-sequence-focus-rerun.log`, passed all six cases: three repetitions
each in desktop and phone browser contexts. This is a focused rerun, not a passing
replacement for the original CI result.

The separate local full check was intentionally stopped for isolation after an
offline batch-1 timeout clicking App status. I read
`/tmp/reading-sequence-full-check.log`: 567 passed, 14 skipped, one failed, one
interrupted and 891 did not run; the managing session recorded command exit 130.
The interruption occurred in offline batch 4 after that timeout, so this was not a
completed full-suite pass. The unchanged-build isolated desktop batch-1 rerun in
`/tmp/reading-sequence-offline-rerun.log` passed (24.3 seconds total). No app or
offline-test change was made for that result. A passing rerun does not alter the
original failure or establish a cause for the timeout.
