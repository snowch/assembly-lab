# First compiler listing introduction

Copyright © 2026 Christopher Snow

## Checked brief

- User approved moving general compiler provenance, reproduction instructions and
  C-line matching explanation from Putting it together to A tiny function.
- Tiny function is the first complete C/assembly listing. It already introduces
  GCC, version 16.1.0, 64-bit Arm and -O1. Keep that essential visible introduction.
- Its recorded source/instructions are INCREMENT_INT in meet-the-machine.listings.ts;
  raw request/response in docs/notes/module-0/increment. Submitted flags are
  -g -O1 -fno-verbose-asm. Local reproduction additionally needs -S and -o.
- Displayed C has four lines: signature, brace, return n + 1, brace. ADD and RET
  are checked against displayed line 3; original references identify line 4.
  Do not carry over trip's line5/6/7 example or its -O0 instruction count.
- Use increment_int.c/increment_int.s for the reproduction command. Compiler
  Explorer is an online compiler service. Explain any local command option used;
  keep instructions optional and state required cross-compiler installation.
- Keep general source/line notes only with the first increment example, closed by
  default. Keep original references available there. Later trip listing omits them
  and retains brief GCC version/setting/target attribution without redefining -O1.
- Keep all recorded listings, debug references, source associations and simulator
  behaviour unchanged. Later mismatch-specific examples such as branches retain
  their own details.
- Prior knowledge: addition, constants, registers, instruction/operand, C functions.
  The current tiny-function prose defines caller, argument and listing.
- Follow docs/style.md and CLAUDE.md. Separate draft of adapted optional notes,
  then independent learner and technical final-build reviews of both pages.

## Draft and independent review

Separate drafting agent `bullets_draft` produced
function-compiler-notes.prose.ts from the checked brief and recorded increment
request/response. Independent reviewer: GPT-6.1 Sol (`gpt-6.1-sol`), High effort,
in separate learner and technical passes. The reviewer edited no product or tests.

**Learner pass.** The essential GCC/version/target/-O1 introduction remains visible
before the first complete C/assembly example. The two clearly named optional notes
now accompany that example and default closed, as do its original compiler
references. Compiler Explorer and each command option are explained; local
reproduction explicitly requires the named cross-compiler. The existing one-ADD/RET
function is already a small complete introduction, so this context needs no extra
execution bridge or prerequisite. The line note uses the displayed return expression
and distinguishes computing the result from returning. Putting it together retains
brief version/setting/target attribution without repeating the definition or notes.
No new assumed knowledge blocks either activity; no answer disclosure was added.

**Accepted finding, high severity, resolved.** Opening the compiler note at 375px
made the page 733px wide: the long command expanded the notes' implicit grid track.
The first min-width/max-width correction constrained the container but left its
child track at 704px, so independent checking still failed. The final
minmax(0, 1fr) track correction was independently verified in the rebuilt site.
The command now scrolls inside its own pre element; its phone client/scroll widths
are 281/696px while page width remains 375px. The original screenshot is
/tmp/compiler-intro-independent-review/first-phone-open.png. No unresolved or
rejected product finding remains.

**Technical pass.** Read the actual component/data/prose/test diff, both lessons,
prerequisites, style/authoring guidance and recorded compiler material. Submitted
flags exactly match request.json: -g -O1 -fno-verbose-asm. The local command adds
-S and the named output and uses increment_int.c/increment_int.s; all its options
are explained. ADD/RET retain checked displayed-line-3 associations and compiler
line-4 references. The raw response records line 5 with the copyright comment;
the existing, tested removal of that comment lowers the displayed original
reference to line 4, the closing brace. Listings, debug records, associations and
model logic were not edited. Canonical prose is synchronised.

On the final 10.84s build at port 4401, an independent Chromium script passed both
lessons at 375/1280px in actual light/dark with fonts loaded. Checked initial closed
notes, compiler note open, both notes open and original references open; inspected
both-page screenshots in all four configurations. No page overflow or console/page
errors occurred. Enter/Space open and close the disclosures. Tab reaches the
scrollable command, ArrowRight scrolls it, and Tab then reaches the next summary.
The command also scrolls to its end without moving the page sideways. Original
references show 4/4 while teaching tags show 3/3; notes/references are absent from
the two-argument example and trip figure, whose 3/4/5/6 teaching tags remain.

Verified tiny-function ADD/RET values, write marks, matched C highlights, caller
resumption, reset and restored ADD/returned states. Verified trip arithmetic/RET,
Back/reset and its existing reload-to-start behaviour. One ad hoc review assertion
initially expected trip stepping to persist; the unchanged source and existing
browser test establish local inspection resetting on reload. Corrected that oracle;
the separate final four-configuration run passed. No model behaviour finding.

Read the revised regressions: ownership/absence expectations follow the move,
keyboard checks retain Enter/Space and cover the command stop, and open-note page
overflow is asserted. Removing the stale twenty-instruction prose assertion leaves
the recorded -O0 count and source-mapping assertions intact. Shared notes layout
has only StepperFigure/PrimitiveOperation rendering uses; other source-specific
compiler-reference decisions remain unchanged.

Evidence: /tmp/compiler-intro-independent-review/review.mjs, results.json and final
closed/open/returned/scrolled-command/trip PNGs. Limits: Chromium viewport review,
not physical devices, Firefox/WebKit or screen-reader testing. The local GCC command
was source-checked, not executed with a local GCC 16.1 installation. This independent
run is separate from the unit/browser runs, skips and failures recorded below; it
does not certify full CI, GNU/QEMU reruns or deployment.

## Validation

Strict TypeScript, changed-file formatting, copyright and production build (9.76s)
passed. First focused unit run: 65 passed, 1 failed because it expected the removed
optional prose claim about twenty instructions at -O0. Removed that stale prose
assertion while retaining the recorded twenty-instruction and source-mapping checks.
Added a first-use placement/provenance regression. Final focused run: 4 files,
67 tests passed. Initial two-file browser run: 148 passed, 2 failed and 2 skipped. The failures
expected Tab to skip the newly scrollable command; the command correctly gets a
keyboard stop. Updated assertions verify that stop and then the next summary.
Independent review also found phone overflow from the notes' implicit grid track.
First CSS correction constrained its container but not the track; the separate
16-test focused run had 15 passed and 1 phone-overflow failure. The final grid-track
correction passed all 16 focused browser tests in 50.0s. Final build (10.84s), types
and formatting passed. Full CI/deployment evidence follows in the PR.

## CI follow-up

Initial full CI: 2,946 unit tests passed and 1 failed. The course-wide compiler
reference placement assertion still named the old introduction and inspected only
top-level properties. Update it to inspect the primitive figure's stage as well,
expect the tiny-function opt-in, and retain the branches mismatch opt-in. This
changes the assertion to enforce the approved placement without weakening coverage.
Product code and final built-page review are unchanged.

Independent verification by GPT-6.1 Sol (`gpt-6.1-sol`), High effort: checked the
test diff against the actual fundamentals, trip and branches data. The filter now
covers both supported property locations and still requires an explicit true.
The exact expected list enforces tiny-function/worked-function and retains the
branches mismatch example; unexpected additional opt-ins still fail. Existing
per-program association and compiler-record checks are untouched. The separate
focused run passed all 77 tests (4.26s); this does not change the earlier CI failure.
No finding. No product/browser recheck was needed for this assertion-only change.

## Browser CI follow-up

The next full CI passed all unit tests and had 1,223 browser tests pass, 4 fail
and 23 skip. All four failures were the course-wide disclosure browser test still
expecting the old trip disclosure. Remove meet-the-machine from that exception
set, retaining tiny-function and the branches mismatch example. Keep all rendered
count, default-closed, opening, source-association, theme and overflow checks.
No product changes.

Independently checked the one-line diff against the final lesson data and rendered
placement review. Removing only meet-the-machine correctly enforces zero trip
disclosures while retaining tiny-function and branches. All other assertions,
including unchanged teaching associations, actual themes, default-closed/opening
behaviour, errors and whole-course overflow at desktop/360px phone widths, remain intact.
The separate focused run passed all four tests in 31.3s; the earlier full-browser
failures/skips remain recorded above. No finding or additional product recheck.
