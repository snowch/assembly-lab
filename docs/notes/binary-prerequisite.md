# Binary prerequisite

## Fact brief and drafting

The author approved explicitly naming basic binary knowledge beside C and arithmetic,
with a direct Bit Lab refresher. Learners should be able to read small binary numbers
using place values. Hexadecimal, two’s complement and assembly are taught in this course.

Bit Lab’s content/index.ts identifies chapter patterns as “Build a number from bits”
and introduces binary digits and place values. Its App.tsx routes lessons with
#/lesson/<id>. Sources checked 31 October 2026:
https://github.com/snowch/bit-lab/blob/main/content/index.ts and
https://github.com/snowch/bit-lab/blob/main/apps/course/src/App.tsx.
The refresher URL is https://snowch.github.io/bit-lab/#/lesson/patterns.

A separate GPT-6.1 Medium drafting agent read docs/style.md and drafted the summary,
detail and consistency edits. The brief required an assessable, basic prerequisite,
no extra activity or gate. Its accepted finding narrows the C self-check feedback
to C readiness; it cannot establish binary readiness. The plan’s stronger conversion
requirement is aligned with small-number reading. The detail uses the existing
Marked renderer for its link and code-formatted digits. Existing browser checks
retain companion assertions and check the visible binary prerequisite and actual link.

Independent review and validation follow.

## Focused validation

Both focused unit files passed (22 tests). The six existing footer, prerequisite and
no-script browser checks passed on phone and desktop (12.0 seconds). Production
build passed (10.89 seconds); TypeScript, changed-file formatting and diff checks passed.
# Binary prerequisite independent review

Separate GPT-6.1 High reviewer; did not draft or edit the change. Read docs/notes/binary-prerequisite.md and final diff against the previously read CLAUDE.md, docs/style.md and authoring review requirements. Distinct learner and technical passes complete: pass, no outstanding findings or recommended fixes.

## Learner pass

The closed details state visibly names binary alongside C and arithmetic. The opened detail gives an assessable scope: know the two digits and read a small binary number using place values, with a named refresher beside it. The resource remains optional for someone who already has that knowledge. Module 1's hexadecimal and signed-reading teaching and Module 0's assembly teaching remain clear. No new prerequisite jargon beyond the expressly required basic binary knowledge; no new mechanism/activity or preparation bridge required. Both style closing passes found no issue in the changed wording.

Own production preview on4491 started only after /tmp/binary-prereq-build.log reported success; no reviewer build. Chromium browser and screenshots checked closed/open prerequisites at375 and1280px in both actual themes. Summary visible while details closed; opened content renders0 and1 as code, an ordinary link without raw Markdown, and the answer disclosure limits its readiness claim to C. Text and link remain readable with normal wrapping. Document scrollWidth equals375/1280, no horizontal overflow, no page/console errors. Actual html data-theme and body colours verified: light rgb(243,246,245), dark rgb(16,22,21).

## Technical pass

The Marked renderer change is confined to the numerical prerequisite paragraph. The plan and learner wording now agree on reading small numbers rather than an additional decimal-to-binary conversion requirement. Source-read Module1's one-pattern-three-readings.prose.ts and its signed-weight teaching confirm hexadecimal and signed representation are introduced in the course. No machine/ISA claims changed.

Rendered refresher href is exactly https://snowch.github.io/bit-lab/#/lesson/patterns. Independently loaded that exact public route in Chromium through the configured proxy with TLS verification intact: title Build a number from bits · Bit Lab, level1 heading Build a number from bits. Its introductory paragraph explains the two possible bit values and place-value weights before the prediction/inspection activity, so it matches the refresher's purpose. Clicking the actual rendered local refresher also navigated to that exact public URL and level1 heading. The proxy-configured browser harness served localhost requests from the local preview via a temporary route handler; public requests used the configured proxy normally. An initial harness attempt timed out before local hydration; corrected harness succeeded, so no product finding.

Evidence: /tmp/binary-prereq-browser-evidence.json; /tmp/binary-prereq-{375,1280}-{light,dark}-{closed,open}.png; /tmp/binary-prereq-public-destination.png and /tmp/binary-prereq-public-evidence.json. Managing session reports22 focused unit and6 existing browser tests passed; reviewer did not rerun the full suite. Unchanged lesson interactions and no-script summary were outside this narrow change. Reviewer preview4491 stopped.
