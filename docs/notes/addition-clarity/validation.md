# Addition clarity validation

The copy was drafted separately from checked facts. Independent learner and technical sessions reviewed the production build at 375 and 1280 pixels, in actual light and dark themes. They checked the initial diagram, Run, reset, unknown result before execution, blank challenge inputs, reuse/subtraction and sequence siblings, and the recorded/native comparison's shared badge. Neither review found an outstanding blocker. The shared badge's 174 declarations/helper uses were audited in source; representative uses were exercised in the browser, rather than claiming every later lesson was manually reviewed.

The learner review initially compared DOM textContent with line-broken innerText; its temporary helper was corrected and all four contexts then passed. The technical review initially expected CSS-transformed uppercase text in the DOM; its temporary helper was corrected and all four contexts then passed. Neither required a product change. A proposed finding that the native comparison's model note described recorded hardware was rejected: the figure separately labels recorded GNU/QEMU/GDB output and an actual computed browser-model run.

Official reference access was checked independently in anonymous browser sessions. Both documentation pages and their official PDF endpoints were publicly accessible. The optional Arm ID drawer could be dismissed. The course links the checked ADD entry and explains this beside the links; it makes no claim about other Arm products.

The first focused copy check found that a numeric prose scanner treated the reference URL's date as a lesson fact. The scanner now excludes URL targets while the browser test still asserts the exact reference href. Its focused rerun passed 17 tests.

The first full check exited 1 during units: 131 files passed and 15 failed, with 2,859 tests passed and 16 failed. The common cause was the term gate reading `shifted` inside the official ADD URL. The authored lesson has a narrow URL-only term exemption, with a separate guard proving the visible text does not introduce shifting. The platform copy remains untouched. The corrected focused units passed 35 tests in three files and the production build passed.

The first focused browser command exited 1: 39 passed and one phone/dark subtraction challenge reset test timed out. Its trace ended during the Clear work tap, without a completed tap event; this did not establish a product reset defect. An isolated three-repeat rerun passed all three. The original failure remains recorded separately from subsequent results.

Independent review evidence: `/tmp/addition-learner-review.md`, `/tmp/addition-learner-review.json`, `/tmp/addition-clarity-technical-review.md`, `/tmp/addition-clarity-technical-browser.json`, and `/tmp/addition-step-badge-inventory.json`. Logs and screenshots are session-local; this note preserves the findings and limits. Full final-commit CI and deployed checks are reported on the pull request.

The complete focused Fundamentals browser rerun passed all 40 tests in 1.5 minutes, covering phone/desktop and light/dark, including graded challenge reset. Its original 39-pass/one-timeout run is not counted as passing. No reset behaviour was changed.
