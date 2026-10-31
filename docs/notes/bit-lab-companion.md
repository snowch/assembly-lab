# Bit Lab companion references

## Checked facts and scope

The author moved From gates to a compiled if to Bit Lab. On 31 October 2026,
https://github.com/snowch/bit-lab/blob/main/README.md describes an interactive companion
about how computers represent and process data. Its topics include binary, hexadecimal,
two’s complement, arithmetic, flags and comparisons. The public site
https://snowch.github.io/bit-lab/ responds successfully with the Bit Lab title.

Update current companion links and descriptions in the prerequisites, shared footer,
JavaScript-free fallback, README and plan. These are optional resources, not added
prerequisites. Historical source and review records retain the URLs they checked.

## Draft and review

A separate GPT-6.1 agent at Medium effort drafted the short companion descriptions
from the checked facts and docs/style.md. The implementation uses the Bit Lab title,
public course URL and its represent/process-data scope. The internal companion key
is bitLab in both app and fallback. Existing link and title tests retain their checks.

Independent learner and technical review and validation results follow below.

## Validation

The initial focused unit run had 21 passes and one failure: a static-footer test
still used the renamed notes property. Its title assertion was updated to bitLab;
no check was removed. The production build passed in 7.25 seconds.

After correcting that stale property, both focused unit files passed (22 tests).
The six existing footer/further-reading/no-script browser cases passed on phone
and desktop (14.9 seconds). TypeScript, changed-file formatting and diff checks passed.
# Bit Lab companion reference review

Independent reviewer: separate GPT-6.1 session, High effort; did not draft or edit product changes. Read CLAUDE.md, docs/style.md, docs/authoring.md and docs/notes/bit-lab-companion.md. Reviewed final diff for README, plan, shared strings/app footer/static fallback and existing assertions.

## Learner pass

Pass. “You can use this course without reading the companion resources” keeps Bit Lab optional. “Bit Lab explores how computers represent and process data” is direct, fits its neighbours and needs no new assumed knowledge beyond the front page. No new mechanism, prerequisite or exercise is introduced; no preparation bridge needed. Both style closing passes found no issue in the changed text. Titles remain italicised in prose and the companion link is named Bit Lab.

Built-site browser review used own Vite preview on 4491 after /tmp/bitlab-build.log reported success; no reviewer build. Checked and visually read screenshots of expanded homepage prerequisites, homepage footer and #/lesson/meet-the-machine footer at 375 and 1280px, each in light and dark themes. Also checked the JavaScript-disabled fallback footer at both widths and both system colour schemes. The Bit Lab links are visible, readable, correctly wrapped and use https://snowch.github.io/bit-lab/. No page overflow: document scroll widths were exactly 375/1280px. No stale learner-visible former title/URL in checked pages and no console/page errors in JavaScript-enabled runs.

Actual rendered theme checked by both html data-theme and computed body background: light rgb(243,246,245), dark rgb(16,22,21); no-script system preferences produced the same respective colours. Evidence: /tmp/bitlab-browser-evidence.json and /tmp/bitlab-{375,1280}-{light,dark}-{prereqs,home-footer,lesson-footer,noscript}.png.

## Technical pass

Pass after one existing test assertion correction. The internal bitLab key is consistent in the application, fallback and tests. GitHub connector independently fetched https://github.com/snowch/bit-lab/blob/main/README.md: title and scope support the revised descriptions and plan topics. A proxy HTTPS GET to https://snowch.github.io/bit-lab/ returned HTTP 200 at that URL with title “Bit Lab · How computers represent and process data”. No new Arm/C/ISA semantics were asserted, so no architecture revalidation required.

Historical records remain unchanged: docs/notes/checkpoint-1/review/findings.md and docs/notes/module-11/scenario-crosswalk.md retain their checked programmer-calculator paths/URLs. Search found no stale companion keys after the correction.

Accepted finding: apps/course/src/static-page.test.ts:107 initially referenced STRINGS.companions.notes after the key rename (medium, would break the existing assertion/type check). Direction: update this existing assertion to bitLab. Managing session corrected it; reviewer re-read the diff and independently confirmed the resulting built fallback link/title. Managing session reports initial focused unit run 21 passed/1 failed, corrected rerun 22 passed, and focused browser run 6 passed. These are managing-session results, not independent full-suite claims.

No outstanding findings or recommended product fixes. Unchanged lesson interactions and the full test suite were outside this focused review. The temporary browser harness initially timed out on an unnecessarily exact Theme label selector; a diagnostic showed successful hydration without errors, and the corrected harness completed all states. This was a reviewer harness issue, not a site finding. Preview 4491 stopped after review.
