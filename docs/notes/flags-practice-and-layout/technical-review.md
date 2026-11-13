# Independent technical review: six-case flag practice and reading layout

Reviewer: independent Codex technical/sceptic/checker pass, 13 November 2026.
The reviewer did not author the product or its tests. Used the inherited available
session model/effort, with no model override. Instructions: `AGENTS.md`,
`CLAUDE.md`, the checked brief and separate copy draft. Source scope includes the
canonical challenge, labels and prose, paired Module 2 prose record, controller,
model/state, generic renderer tests, numerical facts tests, educational test diff,
GNU/QEMU corpus and CI wiring, and every shared reading-card consumer.

## Source conclusions

No blocking accuracy, grading or migration issue found. The original three IDs,
inputs and order are preserved. The three additional cases distinguish signed
overflow from carry, a negative reading from signed overflow, and zero from
carry. New labels describe inputs without stating an answer. No arithmetic model,
platform file or storage namespace changes are present.

The controller obtains its 32-bit practice models from the canonical grader's
cases; navigation, restoration length and reset length follow that case count.
Both per-case canonical grading and aggregate canonical grading remain required.
The stored presentation check bit and historical `firstPassedAt` cannot establish
current completion. Editing removes that case's canonical answer proof and leaves
other cases intact. Restoration sanitises indices/choices and extends older
three-case presentation data with three unanswered cases.

The canonical reference, fields/groups, prose/hints, paired prose record and test
expectations have been extended together. The meaningful assertions in the old
tests remain: wrong answers fail, references pass, untouched fields begin blank,
and incomplete or edited work cannot open the follow-up. Numeric inventory
expansion is supported by separate model assertions for the new input/result
contrasts, rather than only a larger allowlist. All additional input pairs occur
in the GNU/QEMU differential corpus (two already existed). The CI job installs
GNU tools/QEMU and consumes the corpus without a new special case.

`caseFields` retains the pre-existing assumption that canonical expected fields
are authored in N/Z/C/V order; the canonical construction enforces that order.
The new local `followupShown` cache is valid because its content is fixed per
mount, and only overall completion controls whether it is visible. It avoids
replacing native disclosure state during unrelated case navigation.

The informational stale non-rendered “challenge's three calls” comment was
corrected to six before candidate2. Other surviving mentions of three in facts
tests refer to three specific examples and are valid.

## Browser evidence

Initial immutable build: `http://localhost:4512/assembly-lab/`, candidate1.
Native Playwright was loaded with `createRequire` from the repository package.
Actual rendered `html[data-theme]` was asserted after selecting the exact Theme
combobox; all geometry runs used both light and dark.

Independent browser script passed six-case count and blank initial feedback,
wrong submission/disabled next, full completion, reload, edit invalidation and
re-locking the follow-up, restored edited work, hints/clear, malformed presentation
without canonical proof, and migration with both old three-case presentation and
canonical answers plus a historical completion timestamp. The first three remain
recognised; each new case initially has no selected answer; all six must pass.

The layout matrix contains 100 samples: five cases including the longest signed
negative operands, widths 320/375/834/920/1280, both themes and normal/DejaVu Sans
fallback fonts. Equation text ranges remain inside reading cards; whole values,
minus signs and negative-addend parentheses remain together; the follow-up hex
values remain bounded; there is no page horizontal overflow. Disclosure height is
at least 44 pixels and its separation from the reading cards is at least 24
pixels. Phone and desktop screenshots were inspected in both themes. A further
40 browser samples cover all four comparison examples and the miniature feedback
consumer across the same widths/themes. The miniature sample deliberately checks
a wrong flag submission to exercise feedback layout.

Candidate1's own disclosure keyboard check verified Enter/Space without changing
cases between keys. It did not cover preservation while switching cases. The
managing session's later stronger check exposed replacement of the open native
disclosure during navigation, and candidate2 adds the local completion cache.
Final candidate2 at `http://localhost:4513/assembly-lab/` independently passed the
same 100-sample matrix and state attacks, with zero page errors. Its only runtime
difference is the completion cache. Direct additional checks confirm the same
native disclosure DOM node and open state survive keyboard navigation among cases
1/4/6; the case button retains focus; Space closes the still-open disclosure after
navigation and summary focus remains; editing removes an open disclosure;
re-completion creates a closed one; reload retains genuine completion. Final dark
320px fallback and light 1280px screenshots were inspected, together with a
320px dark screenshot of the longest negative signed equation. Evidence is in the
`final/` scratch subdirectory.

Scratch evidence is in `/workspace/scratch/flags-practice-technical/`:
`browser.mjs`, `browser.json`, `browser.log`, `siblings.mjs`, `siblings.json`,
`siblings-final.log`, and the named light/dark phone/desktop screenshots. The
initial custom harness used the wrong expected pass-mark label and a later
sibling harness used the wrong miniature intent field name; only harnesses were
corrected. `siblings-harness-history.log` retains the interrupted attempt.

## Checks and historical outcomes

Independent focused rerun: four files, 84 tests passed, exit 0
(`focused-unit.log`). This covers state/migration, the additional model cases,
canonical challenge/generic rendering and stated numerical facts. No full suite
was run by this reviewer.

The earlier managing-session focused run (`flags-practice-unit1.log`) failed four
stale three-case/numeric inventory expectations. The later six-file rerun
(`flags-practice-unit2.log`) passed 93 tests; the rerun does not erase the first
failure. The managing session also reported an earlier unredirected TS2554
missing `blank` argument failure; both retained named typecheck log/exit pairs
are subsequent successful invocations and are not evidence of that earlier
failure.

An independent focused GNU/QEMU invocation could not start because
`aarch64-linux-gnu-as` is absent locally (`real-tools.log`). Corpus coverage and
CI wiring were inspected, but this reviewer does not claim a real-tool pass.
The managing session's full checks, final exact-head CI, merge/public verification
and final expanded educational rerun are separate results. Its candidate1 expanded
educational test exposed the disclosure navigation issue; that historical failure
must remain separate from candidate2's successful rechecks.

## Learner findings and sceptic decision

The independent learner reviewer reported no introduced blocker after its own
case/gate/migration/layout checks. Its Low inherited assumption finding quotes
“The CPU performs one addition.” (`strings.ts:329`). Accepted: repository search
finds no earlier expansion/definition of CPU; the earlier fundamentals lesson
teaches “processor”, including “An instruction tells the processor to perform an
operation”, which does not establish the acronym. The smallest direction is to
use the taught term or explain the abbreviation. This text is unchanged by the
current work; it is inherited copy debt and does not block the added practice or
layout correction.

Read the completed `learner-review.md` after forming the independent technical
assessment. Its second Low finding, losing the open disclosure during case
navigation, is accepted and closed: the candidate2 cache preserves the same node
while completion stays true, and the independent final browser checks above
verify focus/open state and invalidation. Its layout, migration and hint
conclusions agree with source/model checks and this review's browser evidence.
No learner finding was rejected in this pass. The learner report's real-tool
boundary is satisfied here only by corpus/CI inspection; local execution remains
blocked by missing GNU tools, as recorded above.

## Knowledge and limitations

The added tasks assume hexadecimal, signed and unsigned readings, 32-bit ranges,
and the four flag rules. These are taught before the practice or in Module 1;
no new instruction, compiler option, C feature or tool knowledge is needed by
the added cases. Model truth remains subject to the course's existing documented
GNU/QEMU accuracy chain; no live hardware claim is introduced.

Browser coverage uses local Chromium, normal and DejaVu Sans fallback fonts.
It does not establish behaviour on physical phones, every browser/font stack or
assistive technology. The browser checks exercise native keyboard disclosure
controls but are not a screen-reader audit. The unmodified generic renderer was
checked in source/unit tests, not mounted as a second browser lesson.
