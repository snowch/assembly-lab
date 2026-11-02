# Independent learner review

2 November 2026. Reviewer: separate GPT-6.1 agent/session at High effort. I did not
implement or edit this change. I read AGENTS.md, CLAUDE.md, docs/style.md,
docs/authoring.md and this change's brief before reviewing. I did not read the
authors' rationale or draft notes. The scope was the published
`#/lesson/same-bits-two-readings` page, titled **Signed and unsigned readings**, as
a learner who has completed earlier lessons and knows the front page's prerequisites.

Reviewed the final build supplied by the managing session on branch
`feat/bit-weight-readings`, base HEAD
`71c1801ae7ae6c2b9882e024b8ff6e3eab23c35c`, with the implementation uncommitted.
I did not build or change source. Preview used a separate port, 4182.

## Verdict and findings

No material learner finding. The unsigned, signed, then comparison sequence can be
followed from the visible prose and controls. The first example demonstrates the
mechanism before the learner constructs another pattern. The construction requires
applying the weights, rather than copying the initial example.

No correction is requested. The observations considered and rejected are retained
below so that they do not become unsupported findings later.

- **Rejected: set/clear is unexplained.** The preceding built hexadecimal page says:
  “A bit that is 1 is set, and a bit that is 0 is clear: to set a bit is to make it
  1, and to clear it is to make it 0.” I verified this text in all four browser
  configurations. My initial source search missed the paragraph selected into that
  split page.
- **Rejected: the full 32-bit example needs another compulsory smaller example.**
  “A bit with value 1 contributes its weight. A bit with value 0 contributes zero”
  defines the operation; the separate all-ones figure demonstrates it completely.
  The top-bit and other-bits contributions keep the large sum manageable, while
  opening “Show calculation” exposes every contribution. A four-bit candidate would
  shorten arithmetic but add another width and another set of limits before the
  same rule. Appendix B offers that candidate through a visible link, and the main
  explanation does not depend on opening it. No additional bridge is required here.
- **Rejected as a material finding: “Scroll to see the bit weights →” remains on
  desktop.** At 1280 pixels all weights fit (942-pixel region and content), so this
  instruction is redundant. It does not obscure the values or impede the next
  action. At 375 pixels it correctly announces contained scrolling (317-pixel
  region, 473-pixel content). Hiding it when there is no overflow is optional polish.

## Preparation and assumed knowledge

The mechanism is defined in the visible prose: weights double from the right,
ones contribute their weights, zeros contribute nothing, and the signed reading
changes only the top weight. It is demonstrated by the initial all-ones pattern,
the named reading controls and their contribution/result table. Editing one bit
practises the contribution rule before the new construction. The construction
then asks the learner to choose bits and give a reading; the later exercise applies
both readings to fresh patterns.

The page assumes basic binary place values and arithmetic, C's `int`/`unsigned`,
register names and widths, and hexadecimal grouping/prefix notation. The front
page and earlier lessons cover these. “Weight”, “top bit”, “unsigned reading”,
“signed reading” and “two’s complement” are defined locally. Set/clear comes from
the preceding hexadecimal page, as quoted above. I found no additional unexplained
assumed knowledge in the reviewed content. I did not treat knowledge from later
flags, width, or negation lessons as available.

The required activities have visible headings and entries before completion:
“Reading the bits”, “Bits that read as −3”, and “Three more patterns”. Unsigned,
Signed and Compare appear together initially. The optional scratch register is
named before its disclosure and says that its edits do not fill the exercise.
The appendix backlink names the current published lesson and leads to it.

## Actual browser checks

Used headless Chromium through Playwright against the production preview, with
375×812 and 1280×800 viewports and both light and dark themes. Each configuration
set the preference and asserted the actual `html[data-theme]`. I inspected rendered
text and screenshots in addition to DOM assertions.

All four configurations passed these checks:

- The teaching reader starts with all 32 bits set, unsigned selected, and the fresh
  all-ones pattern. Signed and Compare preserve those bits. Both readings show
  the corresponding contributions, with only the top weight changing sign.
- Pressing the top bit updates its value and results; its weight remains present
  when its value becomes zero. “Clear bits” clears every bit while keeping weights;
  “Reset to all ones” restores the initial pattern and unsigned mode.
- Selected value/weight cell centres align exactly for positions 31, 30, 3, 2, 1,
  0. The top-bit marker's centre equals bit 31's centre. Decimal weights remain
  intact within cells. The ellipsis has accessible text “Bits 29 to 4 omitted”.
- On the phone the strip scrolls inside its region; scrolling to the right exposes
  the remaining positions. Compare remains usable, and the page has no horizontal
  overflow. The normal and comparison figures are legible in both themes.
- “Show calculation” opens the full contribution calculation. The all-ones signed
  calculation contains all 32 contributions and its total.
- Make −3 blocks missing work, rejects wrong work, presents the five hints in
  order, and keeps the worked explanation absent before successful completion.
  The final hint supplies its promised explicit guidance. A correct submission
  passes, reveals the explanation, survives reload and is graded again. Confirmed
  “Clear work” / “Discard work” removes completion, the explanation and revealed
  hints and restores the initial fields. No challenge answer is recorded here.
- The scratch register starts clear, can be edited, and does not change the graded
  answer. The preceding hexadecimal reader retains its subtraction pattern,
  remains editable, and has no numerical-reading controls. The appendix backlink
  returns to the correct published reading page.

Ordinary reload returns the exploratory reader to its initial bits/unsigned mode;
challenge work is saved. This is distinct from the application-update handoff.
I did not simulate a service-worker update or claim to browser-verify that handoff.
No page errors occurred in the completed matrix; overflow was zero. The screenshots
reviewed include `/tmp/learner-reader-full-{375,1280}-{light,dark}.png` and
`/tmp/learner-compare-{375,1280}-{light,dark}.png`.

## Commands, failures and limits

Preview command:

```sh
npm run preview -w @al/course -- --port 4182 --strictPort
```

Review command:

```sh
node /tmp/weights-learner-browser.mjs
```

The final run exited 0 and completed all four configurations. Earlier exploratory
runs of that same temporary script exited 1 on reviewer assumptions, before the
whole matrix completed. They are not counted as passes:

1. Expected edited reader bits/Compare to survive an ordinary reload. Actual
   initial/unsigned state matches the component's update-handoff-only state.
2. Expected the gated figure wrapper to be absent. Its wrapper exists without the
   gated explanation; the assertion was corrected to inspect the explanation.
3. Guessed status text “Blocked”; actual missing-work status is “Tests could not run”.
4. Expected “Clear work” alone to reset hints. The first press opens confirmation.
5. Reached the same missing confirmation after a completed submission. The corrected
   script presses “Discard work” and verifies the actual reset.

These failures changed the temporary review harness only. No source or test
expectation in the repository was altered. A separate inline Playwright follow-up
exited 0, checked the built prerequisite quote, zero overflow in Compare, top-bit
marker centres and omitted-position accessible label in all four configurations.

Source-only reading covered the prerequisite prose, published split lesson wiring,
and the small amount of reader/handoff, gated-note and challenge-reset code needed
to distinguish the above harness mistakes from product faults. This is a learner
review, not an independent Arm/C semantics or model audit. I did not run the full
repository check suite or the application's update-handoff browser scenarios.
