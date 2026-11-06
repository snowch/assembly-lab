# Independent technical review

Copyright © 2026 Christopher Snow

6 November 2026. Independent agent review. I did not draft the prose or implement
the interaction or navigation. I read `AGENTS.md`, `CLAUDE.md`,
`docs/authoring.md`, `docs/style.md`, the local learning-design skill, the written
brief, published lesson order, the relevant recorded GCC responses and the
locally retained C23 draft N3096. This is expert inspection, not a novice study.

## Technical source pass

The recorded `trip_remaining` and `trip_remaining_u` functions subtract travelled
distance from planned distance. Both recorded instructions are `sub w0, w0, w1`
and `ret`; checked C associations point to the displayed return statement while
the original compiler references remain preserved. Neither instruction updates
the arithmetic condition flags. The new explanation does not require a flags
tutorial or later branch instructions.

For the published inputs, the negative signed result is representable. It is a
valid C result and serves the stated overrun contract. The unsigned result is
defined by modulo arithmetic but does not directly express that contract's
negative remaining distance. An unsigned return value alone does not identify
whether a wrap occurred. N3096 §6.2.5p11 supplies the unsigned rule; §6.5p5 supplies
the out-of-range expression rule. The local signed bounds qualification preserves
the distinction between those language rules and this compiler's instructions.

The interpretation is gated on the explicit call after the instruction prediction.
The policy question asks for a fresh pre-subtraction decision rather than another
calculation of the worked example. Its check is in closed answer details. Earlier
C `if` knowledge is required by the front page; no assembly branch writing is
required. I found no answer leakage in the changed source route.

The source recordings and authored lesson titles remain unchanged. Numbers must
come from published `LESSONS`, whose within-module order differs from the source
authoring groupings. The appendix schema keys 14 and 15 correspond to plan labels
A and B. I checked these against `content/lessons/index.ts` and
`content/plan/plan.ts`.

## Findings and decisions

- **Accepted, reference coverage:** the initial internal-link matcher excluded
  fragment and query suffixes. I reported this to the implementer. The final
  matcher numbers these links while retaining the complete href; the independent
  focused run passes its Markdown and JSX preservation fixtures.
- **Resolved design concern:** the course passes a separate display-book clone
  with numbered titles for the platform's prerequisite lookup. The managing
  session confirmed this narrow adapter is intentional because the unchanged
  platform has no prerequisite-label hook. Canonical lessons and the current
  lesson retain their authored titles. Grading uses the current lesson's
  challenges and the original grade function, not the lookup titles.
- **Coverage checked in source:** JSX links exist in `ListingCompare` and
  `TeachingReadings`; ancillary lesson links also exist on Where next. No current
  caption, title or details-summary contains an internal Markdown lesson link.

## Verification

Before final integration, the focused command
`npx vitest run packages/views/src/interactives/ListingCompare.calls.test.tsx content/lessons/module-1.listings.test.ts content/lessons/pacing.test.ts`
passed: 3 files, 26 tests, exit 0. It checks model-derived independent calls,
prediction and call gates, reset, restoration, source-record fidelity and pacing.
This was a focused run, not a full-suite result.

A second focused run after the semantic edits passed 5 files and 61 tests, exit
0. The final focused command added
`packages/views/src/lesson-references.test.tsx`,
`content/lessons/one-pattern-three-readings.facts.test.ts` and
`content/lessons/pacing-1-4.prose.test.ts` to the first command: 6 files, 67 tests,
exit 0. The new reference tests check one-based reordering and insertion, A/B,
full/shortcut/collapsed Markdown links, query and fragment preservation, external
links, inline and fenced code, idempotence, opaque props, artifact identity and
the prerequisite display adapter. I inspected the educational expectation edits:
they retain exact link text and destination assertions and do not loosen layout
tolerances or remove the existing model-value checks.

I independently drove the final production build served at
`http://localhost:4351/assembly-lab/` with Chromium at 375 × 812 and 1280 × 800,
in both light and dark themes. The rendered `html[data-theme]` matched each
requested theme. All four combinations passed these checks:

- All 76 plan links, including the opening action, carry one generated position.
  The trip page is Module 1, lesson 4; the current heading keeps its authored title.
- The prediction hides instructions and the returned explanation. Submitting the
  prediction reveals the paired listings, while results still await the explicit
  call. After calling, both model-derived C readings and the application meaning
  appear together. The concluding answer remains in closed details initially.
- The returned-reading JSX link names Module 1, lesson 2 and reaches that page.
  Reload restores results. Reset calls hides results and their interpretation
  while retaining the submitted prediction and listings. Calling again works.
- Appendix pages show Module A and Module B, lesson 1. The appendix return link
  has one complete position and reaches the signed-readings lesson.
- Where next has three numbered lesson links. No JavaScript page errors occurred;
  the trip and Where next pages had no page-level horizontal overflow.

I inspected the four returned-result screenshots at
`/workspace/scratch/numbered-reference-technical-review/returned-{375,1280}-{light,dark}.png`.
The text, wrapped equations and generated reference remain readable in the
checked themes. The paired C/instruction layout remains the existing contained
listing. The first ad hoc browser probe exited 1 because my assertion expected
every plan link to start with “Module”; the opening action correctly starts with
“Start with”. I corrected that reviewer assertion and reran all four combinations
successfully. This was not a product failure or a relaxed product requirement.

After the final build added the position paragraph's `fit-content` rule and
extracted navigation strings, I repeated the affected checks at both widths and
both rendered themes. Current position, authored heading and legacy appendix-link
normalisation still pass. The position paragraph measured 141 pixels wide in all
four cases and stayed within the viewport; no page-level horizontal overflow
appeared. I inspected the four `final-header-*` screenshots in the same scratch
directory. These final affected-state checks passed, exit 0.

No unresolved technical finding remains. Canonical lesson titles, recorded C,
compiler listings, original source references, stable routes and `platform/`
have no changes. The course-owned adapter changes render data rather than
post-render DOM content. Full-suite results belong to the managing session's
validation record. GNU/QEMU tools are not installed in this review environment;
I have not rerun native differential checks. I did not perform screen-reader,
complete keyboard-only or observed-novice testing. Those limits do not change the
source and browser findings above.

## Follow-up test-contract review

The managing session's later full unit run found the old `strings.test.ts`
expectations that the rendered lesson array and interactive registry were the
same objects as their authoring sources. I reviewed the proposed replacement in
source. Render clones and provider wrappers intentionally change those object
identities. Comparing every lesson's id, module, order and authored title, keeping
challenge initial/test objects identical, and requiring the exact original
registry key set with callable views are appropriate replacement contracts.

I requested one additional completeness assertion: compare every lesson's full
challenge id/order list before checking challenge object identities. Iterating
only surviving challenges would not detect a lost final challenge. This preserves
the useful completeness guarantee of the old identity check. I confirmed the
final source includes that exact per-lesson challenge id/order assertion; the
follow-up review has no remaining finding. The managing session records the
original full-run failure and subsequent rerun separately.

## CI appendix-expectation follow-up

I independently reviewed the later test-only diff in
`tests/educational/bit-weights.spec.ts`. The old exact appendix-link text omits the
now-required generated position. Its replacement calls the independent expected
label helper with the same target id and the complete original custom wording,
“More about two’s complement in Appendix B”. That helper derives the expected
module label and one-based ordinal from published lessons and plan data, rather
than calling the product formatter. The assertion remains an exact `toHaveText`
comparison; the original `#/lesson/twos-complement` href and visibility assertions
remain intact. No coverage is removed or loosened, and no product code changes
in this diff. I found no issue. The managing session records the original CI
browser failures and the focused rerun separately; this follow-up is source-only.
