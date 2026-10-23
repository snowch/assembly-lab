# Independent learner review: the first small function

Copyright © 2026 Christopher Snow

Reviewer: separate Codex learner/checker session; no implementation or copy authorship. Scope is Module 0, with the front page's “Before you start” and no later lessons as prerequisites. This review does not use the author's explanation as evidence that the page works.

## First built-site pass

The production preview at `http://127.0.0.1:4322/assembly-lab/` was checked in fresh Chromium contexts at 375 × 900 and 1280 × 900, each in actual light and dark themes. Theme was selected through the visible control and confirmed by the rendered `data-theme` attribute. The first harness incorrectly expected an explicit attribute in system-theme mode; the second used an overly strict exact label locator. Those harness setup attempts failed before activity verification and are not product findings. The corrected four-context run completed successfully.

Evidence: `/tmp/course-load-check/increment-reader/results.json`, screenshots in the adjacent directory, and `/tmp/increment-reader.log`. The managing session owns aggregate suite results; this reader did not run the full suite or differential check.

In every context, I exercised the initial worked addition, advanced to the small function, ran its addition, reloaded that partial state, ran its return, reloaded the returned state, opened the compiler-reference details, continued to the next independent prediction, and used Start again. Assertions confirmed the single current register progresses from the supplied argument to the calculated result and retains that result through return; the caller remains waiting until return, and the register's write mark disappears after `ret`. The complete four-line C and two instructions are retained, their teaching tags both name the return-expression line, and the optional original compiler references are initially closed. Reset removes the new function state and restores the first addition; continuing reaches an unanswered prediction.

All four contexts had zero page-level horizontal overflow or page errors. Visible activity text measured at least 12px. Every visible activity control measured 44px, including the native summary. The C/instruction pair uses contained scrolling on the phone; the rest of the page does not scroll horizontally.

Directly viewed screenshots: phone light entry and after-add, phone dark after-return, desktop light entry and desktop dark after-add. Other entry/add/return/reference screenshots were captured and measured by the harness; this is not a claim that every captured image was visually inspected.

## Findings

### Medium: the phone does not expose the instruction pane's navigation

The page says “Run `add` to prepare the result. Then `ret` returns to the caller”, while the default phone figure shows only the C pane. At 375px the contained listing is 317px wide with 588px of content; its C pane is 320px wide, and the instruction pane starts at x=361px beyond the visible listing's right edge at x=346px. This occurs in both actual themes and persists after either instruction. Neither instruction row nor its next-instruction marker is initially visible. There is no local scroll direction or pane-navigation control. Screenshots `375-light-entry.png`, `375-light-add.png` and `375-dark-ret.png` show the issue.

Effect: a learner encountering their first C/assembly pair can execute both steps without discovering where the instructions and execution marker are. This is a discoverability finding, not a request to abandon the required paired layout.

Direction: make contained navigation to the instruction pane discoverable beside this first pair, preserving complete numbered C and all instruction/source associations. A small pane-navigation control or a clear local scroll affordance would address the issue without duplicating another instruction listing.

Status: the independent technical sceptic upheld this finding. The final-build correction and verification below close it; the original failing observation remains part of the record.

## Prior knowledge and possible overcalls

The front page explicitly requires reading small C functions with `int`/`unsigned` arguments and `return`; the new function does not require additional C syntax. The motivation teaches register names, operands and the read/write order before this activity. The function's local text defines caller and argument, identifies the name ending in a colon, explains the literal one, and states the input/result use of `w0`. GCC's role is supplied by “GCC, a compiler, translated the C into this assembly listing”. No use of `bl`, `x30`, stack storage or numeric instruction addresses is required.

The visible marker is explained fully later in the activity sequence; I did not make that a separate blocker because the local status already identifies which of the two operations to run and the instruction pane contains accessible next/just-ran labels. Making the pane discoverable is the stronger actionable problem. The explicit input label distinguishes this new call from the first worked addition; the input's change is not evidence of inconsistent state.

The function is a worked example, not a prediction, so its explanation of adding one does not expose a pending answer. It still withholds the computed numeric result and the caller's resumed state until the applicable model steps. Later challenge answers were neither used nor included in this review.

## Limits

This is a bounded independent browser/source review, not a novice study or full accessibility audit. I did not exercise every later challenge, every stored-state mutation, arbitrary function inputs or the GNU toolchain. The source-level stable-entry migration and ISA/compiler equivalence belong to the technical review and managing-session tests. The final affected build was rechecked as recorded below; these limits still apply.


## Final navigation correction and built-site closure

The managing session added one function-local navigation button, **Show instructions / Show C**, without replacing or duplicating the paired listing. I independently rechecked the production preview after the navigation rebuild completed. All four contexts loaded JavaScript `index-B7pdy9O1.js` and CSS `index-DRyjSuVo.css`; actual light/dark attributes were confirmed again. Evidence is `/tmp/course-load-check/increment-reader-final/results.json`, `/tmp/increment-reader-final.log` and the adjacent final screenshots. The original run and screenshots remain separate.

In fresh 375 × 900 and 1280 × 900 contexts in both themes, I repeated the first addition, entry to the function, its addition and return, partial/returned reload, optional references, continuation and restart. The supplied argument, current value, write mark and caller state retain their earlier correct relationships. The new control does not execute an instruction, reveal the returned state or change the result.

Enter activates Show instructions, Space activates Show C, and pointer activation works as touch on the phone and a click on the desktop. Keyboard focus stays on the same navigation button as its label changes. After bringing that button into view, each activation leaves both page scroll coordinates unchanged. On the phone, the contained listing's horizontal offset changes from 0 to 271px to reveal the whole instruction pane, then returns to 0 for the C pane. At desktop width both panes already fit and the listing remains at offset 0. The next marker is visible on the addition at entry and on `ret` after the addition; executed highlights stay paired with the C return expression, and after return no next instruction remains. Restart and re-entry restore Show instructions and the initial C position, rather than carrying over the previous pane state.

The new control and all other visible activity controls are 44px tall in all four contexts. Text remains at least 12px, with no page-level horizontal overflow or page errors. Directly viewed final screenshots: phone light entry with instructions selected and after-return, phone dark after-add, desktop light entry with instructions selected, and desktop dark after-return. The harness also captured and measured other C/assembly/reference states; this does not claim that every captured image was visually inspected.

Verdict: the upheld phone discoverability finding is closed in the final affected build. No further required correction was confirmed within this review's bounded scope. The complete activity still extends vertically beyond one phone viewport because its explanation precedes the interactive states; I do not claim a one-screen layout or measured novice learning outcomes.
