# Independent learner and navigation review

Copyright © 2026 Christopher Snow

6 November 2026. Independent agent review; I did not draft the copy or implement the
navigation or interactive changes. I read `AGENTS.md`, `CLAUDE.md`,
`.agents/skills/learning-design/SKILL.md`, `docs/authoring.md`, `docs/style.md`, the
published lesson ordering and relevant prerequisite source. This review applies the
learning-design workflow. It is an expert inspection, not an observed novice study.

Final decision: keep the revised trip route and generated navigation. Three low
navigation/visual findings were accepted, corrected and independently checked.
No material learner or navigation finding remains open in the reviewed scope.

## Source pass

No material learner finding in the revised trip explanation. The
visible opening names the task: “The trip computer should show how much distance
remains and how far you have gone beyond the plan.” It gives planned and travelled
distances before the comparison. The two independent calls retain the same inputs;
changing the return policy does not silently change the worked example.

The intended outcome is to choose C types and a pre-subtraction check from a stated
return policy, separating a defined C result from a useful application result. The
required route goes from the trip purpose, through predicted instructions and
executed results, to policy choice and one fresh zero-return question. The worked
subtraction itself was already demonstrated and practised on the preceding
four-bit page. Its bridge says “The next page applies this rule with 32 places.”
Another compulsory miniature would duplicate that preparation. The current
application asks for a different policy without requiring the learner to write a
branch instruction that the course has not yet introduced.

Preparation inspected in source:

- The front page requires small C functions using `int`, `unsigned`, `return`, and
  `if`/`else`, alongside basic arithmetic and binary place values.
- Module 0 introduces arguments in registers, arithmetic instructions and function
  returns. The trip example uses those existing conventions.
- The earlier hexadecimal page introduces grouped bit notation. Signed and
  unsigned readings defines the weights, demonstrates their calculation and
  supplies practice before the four-bit arithmetic lesson.
- Arithmetic with four bits explicitly distinguishes miniature width from Arm
  registers. It demonstrates inversion plus one and retained low bits, then asks
  for a fresh subtraction before the 32-bit bridge.
- Signed overflow, unsigned wrapping and undefined behaviour are defined locally.
  The compiler disclosure defines `-O1` and `-g`; essential application reasoning
  does not depend on opening it.

I found no newly required unexplained prerequisite in the changed route. “Caller”
and “return” belong to the earlier function preparation. The explanation does not
require knowledge of condition flags or the later conditional branch instructions.

Cognitive-load judgment: the returned calculation reuses the taught top-bit and
lower-bit contributions. The additional prose gives that result a purpose near
the output. The concluding choice names negative, zero and separate error
behaviour in one sentence, then asks only for a check. This is a review judgment;
no learner responses were observed.

## Browser pass

Used headless Chromium through Playwright against the production preview on port
4186, at 375×812 and 1280×800, in light and dark themes. Each context set the
preference and asserted the actual `html[data-theme]`. This was the managing
session's integrated build, with the changes still uncommitted. The reviewer did
not build or modify the application.

The stable matrix exited 0:

- All 75 published lessons were visited in each configuration: 300 page visits.
  Their visible current positions matched independent ordinal counts from the
  front page's module groups. There were 195 internal lesson anchors per
  configuration; their position labels matched their destination's position.
  There were no missing or repeated module labels and no page overflow or browser
  errors. This crawl covers anchors present in each initial rendered page; it
  does not pretend that every gated answer state of every lesson was opened.
- “Module 1, lesson 4” is visible above the unchanged lesson heading. The trip
  result's link says “Module 1, lesson 2: Signed and unsigned readings”; following
  it by keyboard opens that page and shows its corresponding current position.
  Plan, previous/next links, inline prose and appendix A/B labels use the same
  scheme. Appendix B's return link and Module 2 link contain one position each.
- Initial trip state contains both C functions and starting arguments, with no
  instructions or returned values. Selecting a prediction alone does not reveal
  them. Committing a mismatching prediction reveals the instructions and feedback,
  before either function is called.
- Calling both functions reveals equal result bits, distinct C readings, the
  distance-beyond-plan meaning, the defined unsigned wrap and its missing warning.
  The result text explains that the existing instructions do not check whether
  the trip exceeded its plan. The taught weights remain next to that explanation.
- Reload preserves the committed prediction and returned results. Reset calls
  removes the returned values and explanation, retains the committed prediction
  and instructions, and permits another call. A second call restores the result
  explanation and numbered backlink.
- “Check your reasoning” starts closed and opens and closes with Enter. Its
  question is visible without opening any optional detail. I read the revealed
  reasoning but do not repeat the assessment answer in this review.
- Keyboard activation works for prediction, call, reset and the result backlink.
  After Call both functions disables itself, Tab reaches Reset calls; after reset,
  Shift+Tab reaches the enabled call button. Navigation focus outlines are 3px
  in both themes. This checks a usable keyboard route, not screen-reader output.
- The two paired listings scroll within their own regions on a phone. Each is
  317px wide with 588px content; scrolling to the right reveals the instructions
  and source-line tags. At desktop width their 942px content fits. Page overflow
  stays zero.
- Where next's three lesson destinations are numbered. Its existing playground
  and reference URLs remain unchanged in the rendered anchors. A source diff
  also confirms this change did not alter external URL literals. I did not test
  availability of external services.

I inspected returned-state screenshots in all four configurations, the main
reading page at phone/light and desktop/dark, appendix headers at phone/dark and
desktop/light, and the desktop/light plan. These show readable current versus
destination positions, distinct Previous/Next labels and reflowing link text.

The separate legacy `TeachingReadings.tsx` JSX appendix link was read in source.
The current published reading page uses `ReadingSequence`; its hexadecimal
`RegisterReader` disables that teaching branch. No published lesson instance
reached that JSX branch during this browser review. The live trip-result JSX
backlink and main reading page's appendix anchor were browser-checked.

After the managing session extracted unchanged position strings and limited the
position paragraph to its content width, a further four-configuration check
exited 0. The first-use CTA was numbered, the current position remained correct,
its measured width was 141px in every configuration, and page overflow was zero.
These source-only and rendered changes do not invalidate the earlier destination
crawl.

## Source navigation findings, now corrected

- **Low, numbering consistency.** The first-use course entry has a lesson `href`
  but initially rendered only “Start with Module 0”, without lesson position or
  title, while the continuation entry used a generated destination label. The user asked for every forward/back lesson destination to
  show its position. Direction: apply the generated destination label to first-use
  entry too. This was reported to the managing and navigation agents before the
  browser pass; accepted and corrected. Independently verified in the browser.
- **Low, repeated orientation labels.** Appendix B's authored anchors include
  “Return to Module 1: Signed and unsigned readings” and “Module 2: Subtraction flags
  and negation”. Prepending a full module/lesson position leaves a second module
  reference in the same anchor. Direction: normalise the legacy position part while
  retaining the title and any useful return direction. This was reported before
  the browser pass, accepted and corrected. Independently verified in the browser.
  Numbers and targets were checked against source lesson order before raising
  this observation.

## Final CTA finding and independent verification

- **Low, visual separation.** The first numbered entry CTA read visually as
  “Start withModule 0, lesson 1: One addition” on desktop. Its two spans were flex
  items without a gap; the source's whitespace did not create visible separation.
  Evidence: `/tmp/numbered-learner-1280-light-plan.png`. Direction: apply the existing
  continuation CTA's gap and stacking to the first-use CTA. The managing session
  accepted this finding and changed the shared entry CTA layout. The final
  production build passed an independent four-configuration browser check:
  `inline-grid`, 4px between text rows, 75.8px target height, a visible 3px focus
  outline and zero page overflow. Enter opens Module 0, lesson 1. I inspected
  final phone/dark and desktop/light hero screenshots. The words and position
  are visibly separated; no correction remains open.

## Commands, scope and limitations

Temporary review scripts:

```sh
node /tmp/numbered-learner-browser.mjs
node /tmp/numbered-learner-followup.mjs
node /tmp/numbered-learner-cta.mjs
```

All three stable scripts exited 0. The first covers the full crawl and trip matrix;
the second covers keyboard continuation after call/reset, contained listing
scroll, first-use entry label, appendix backlinks and Where next destinations.
The CTA script covers the final spacing fix in all four configurations.
The final position check was an inline Playwright script, also exit 0. Its
screenshots are `/tmp/numbered-learner-final-position-{375,1280}-{light,dark}.png`.
Other screenshots and the crawl results remain under
`/tmp/numbered-learner-*`; the main JSON record is
`/tmp/numbered-learner-results.json`.

The earlier exploratory run exited 1 during a concurrent production rebuild,
when the restored returned state was absent after reload. It is not a passing
run. It also misclassified Previous/Next labels because the review harness
initially expected Module to be the first word of the entire anchor; the visible
direction spans precede it. The harness was corrected to extract the numbered
position after those direction labels. The stable four-configuration rerun
passed without changing application code or product test expectations.

No full repository suite was run by this reviewer. The managing session records
that separately. I did not conduct a novice session, screen-reader review,
service-worker update handoff or hardware test. The judgment to keep the teaching
route rests on source inspection and rendered interaction checks, not evidence
that a beginner can transfer the mechanism. No material learner correction is
requested for the revised trip explanation.
