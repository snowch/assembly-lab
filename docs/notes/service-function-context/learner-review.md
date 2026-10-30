# Independent learner review: function context before inputs

Copyright © 2026 Christopher Snow

Reviewed on 30 October 2026. The reviewer did not draft or edit the implementation.
Scope: the `km_to_service` introduction, its join to the existing trace exercise, and the
matching canonical prose. No product changes or commits were made during this review.

## Verdict and findings

No blocking or non-blocking findings in the changed introduction.

The opening states what the function returns before showing its C signature. The signature
comes before the input explanations. Four bullets then explain the inputs in signature order.
The sentence “The car's odometer records the total distance it has travelled” supplies the
ordinary meaning before the bullets use it. “The odometer reading before the current trip
began” distinguishes that input from “the distance travelled on the current trip”. A learner
can therefore understand why those are separate inputs.

The existing argument-to-register mapping follows the bullets. The compiler explanation,
example call and request for two values follow it. The exercise still asks for register values
“when the function returns”, so the moment being traced remains explicit. The introduction
does not state either answer or supply a completed trace. Both answer fields were blank,
“No tests run yet” was visible, and the first hint remained behind its button on fresh loads.

## Prior knowledge and unexplained assumptions

Read the front page's “Before you start” panel, all the Fundamentals prerequisite prose
(including constant addition and returning to the caller), the full current lesson prose and
labels, the challenge definition, and its recorded listing. Also read `AGENTS.md`,
`CLAUDE.md`, `docs/style.md`, and this change's fact brief.

The learner is expected to read small C functions with `int` arguments and `return`, as the
front page says. Earlier lessons introduce registers, operands, destination-first arithmetic,
read-before-write, sequential execution, constants, GCC, listings, `-O1`, arguments, callers,
returns and the result register. This lesson's preceding walkthrough makes four incoming
registers visible. The revised passage explains the odometer and the `#50` notation locally.

No new unexplained technical knowledge was found in the changed introduction. The review does
not assume knowledge from later modules.

## Built-page evidence

Reviewed the completed production build served at
`http://localhost:4411/assembly-lab/#/lesson/meet-the-machine` after `/tmp/service-build.log`
reported “built in 13.81s”. Used Chromium with fresh browser contexts at 375 × 812 and
1280 × 900, choosing light and dark through the site's actual theme control. Inspected the
rendered introduction, bullets, exercise, blank fields and hint gate in all four combinations.
Phone views were also inspected after scrolling the paired listing horizontally to its
instructions.

| Width | Requested and rendered theme | Body background | Page client / scroll width | Signature client / scroll width |
| --- | --- | --- | --- | --- |
| 375 | light | `rgb(243, 246, 245)` | 375 / 375 | 341 / 341 |
| 375 | dark | `rgb(16, 22, 21)` | 375 / 375 | 341 / 341 |
| 1280 | light | `rgb(243, 246, 245)` | 1280 / 1280 | 702 / 702 |
| 1280 | dark | `rgb(16, 22, 21)` | 1280 / 1280 | 702 / 702 |

The code fence renders as a three-line code block, with no raw Markdown fences, clipped text
or horizontal overflow at either width. The signature font measures 15.48 px. On phones, each
bullet wraps legibly. The inline example call wraps inside the exercise. Its paired listing
retains C and instructions side by side in a contained horizontal scroller: 317 px client width,
588 px scroll width, `overflow-x: auto`. Scrolling exposes all instructions without widening the
page. All four fresh contexts recorded no page errors.

Local evidence: `/tmp/service-learner-browser.json`, `/tmp/service-learner-browser.mjs`,
`/tmp/service-learner-phone.mjs`, and screenshots named
`/tmp/service-learner-{375,1280}-{light,dark}-{intro,exercise}.png`. Additional phone screenshots
use `bullets`, `instructions` and `fields` suffixes. These are temporary review artifacts.

## Limits

This was a learner review of the changed passage and its exercise context, not a full course
review or instruction-set audit. Prerequisites and canonical prose were read in source; the
changed passage and exercise were inspected in the built browser. This review did not submit
exercise answers, open hints, replay the preceding activities, or run the full automated suite.
Those interactions and grading are unchanged by this prose edit. No challenge answers are
recorded here.
