# Where next? independent learner review

Copyright © 2026 Christopher Snow

## Scope and method

Independent reader, not the author of the page, starter or route implementation. Review one
ancillary page as a learner who knows the front-page prerequisites and all lessons through
Module 9, but none of Modules 10–13. Later lesson links offer optional routes and do not supply
knowledge needed by this first playground transfer. Read CLAUDE.md, docs/style.md and the
review brief in docs/authoring.md. Source review is separate from final built-page verification.

No product files were edited by this reviewer. No challenge answers appear in this report.

## Prerequisite inventory and bridge

Already taught: integer argument/result registers; 32/64-bit names for one register; arithmetic,
flags, branches and loops; loads/stores and arrays; the unchanged trip function; BL and the link
register; saving/restoring x29/x30 in a 16-byte aligned frame. Calls and returns explicitly
explains that a caller making another call must protect its original return address. Its small
returning caller is sufficient preparation for the new handwritten main wrapper.

New local preparation: breakpoint meaning; separate external editor/debugger; plain assembly
directives; playground main entry convention; full X0 display versus w0; decimal display;
import/export controls; temporary check data; and the difference between emulated services and
physical board execution. These must be locally understandable for the Module 9 reader.

The familiar trip function is an appropriate bridge. Adding a second new arithmetic task or
starting with the external site's macro-heavy demonstration would distract from transferring
known code into a new workspace. A full replay of another course is unnecessary. The program
is complete with its caller; visible code plus a download gives a discoverable entry without
completion gating.

## Source findings for independent adjudication

### L1: assembler section meaning (medium, provisional)

Quote: “`.text` selects the instruction section”.

Effect: the reader has not met assembler sections before Module 12. Naming the selected section
does not explain what this directive does for the lines that follow. Direction: give the plain
meaning at the first directive use without requiring ELF/loading knowledge.

### L2: main entry contract (medium, provisional)

Quote: “The starter supplies a caller named `main`” and “`.global main` makes the name `main`
available outside this source file.”

Effect: the page has not yet stated why this particular caller name is the beginning selected by
the playground. The learner knows arbitrary course function labels but not this external entry
convention. Direction: make the playground's initial transfer to main explicit locally.

### L3: hardware boundary term (low, provisional)

Quote: “Its user-program environment has no board boot process or UART.”

Effect: UART is introduced in Module 12; this page deliberately permits entry after Module 9.
Direction: describe the boundary in already-known words or give the plain meaning locally.

### L4: variable checks versus fixed starter inputs (medium, provisional)

Quote: “Then choose one addition to the program, such as reading a trip from input or printing
its result” followed by “Write your own checks for several inputs”.

Effect: the starter writes fixed values into its argument registers. Merely varying a check's
standard input or command-line arguments cannot change that calculation. Choosing only the
suggested printing extension does not establish variable inputs either. Direction: connect
multi-input checking to a program that actually reads those inputs, or begin with a fixed-run
check and introduce input-reading before variable cases.

### L5: exit status meaning (low, provisional)

Quote: “with an optional exit code”.

Effect: command-line arguments are defined locally but exit code is not yet taught before
Module 12. Direction: give its plain role as a program-completion status where checks name it.

### Rejected candidate: QEMU name

QEMU is already defined in Adding, subtracting and the flags as a program that imitates Arm
processors. Mentioning the later GNU/QEMU route is not itself a missing prerequisite. The
actual native-tool setup is deferred to that route, not required by the playground starter.

## Closing style passes

Source sentence pass: direct short instructions, specific headings and a locally identified
worked program. The named points above concern meaning, not sentence length. Source idea pass:
the page helps choose a goal and supplies a small complete transfer; independent program input
contracts and the external entry convention need particular care. The three rendered section
headings keep the optional page focused rather than turning it into a directory of projects.

## Final built-page verification

Pending the parent's final production-build URL. This initial source review is not a browser
verdict. Phone 375 / desktop 1280, actual light/dark themes, discovery links, contained code
scrolling, source download and revised local explanations will be recorded after observation.

## Source corrections observed before built review

All five source points now have local corrections, awaiting final rendered verification:

- L1: “`.text` begins a group of instructions” supplies the plain directive role.
- L2: “The playground starts this program at `main`, with a prepared stack and a return
  destination” establishes the selected entry and caller environment before the code.
- L3: the boundary now says “code that talks directly to hardware devices”, without requiring
  an unexplained UART term before Module 12.
- L4: “The starter reads neither, so those fields do not change its trip” distinguishes fixed
  MOV inputs from input/argument fields. Variable checks follow code that actually reads input;
  printing with fixed inputs starts with a fixed-output check.
- L5: exit status is explained as the number reported when the program finishes, and the text
  distinguishes the deliberate completion status from printing the answer.

These are source observations only; the final browser check will confirm their actual presence
and usable relation to the code and controls. No product files were edited by this reviewer.

## Final production-build verification

Approved after observing the final production build served at
`http://localhost:4398/assembly-lab/` (build log `/tmp/where-next-build-final.log`, 19.81 seconds).
The first four-context browser run passed. A subsequent complete four-context run explicitly
compared the current exported prose with the actual article text, including the final phone
instructions, stopping moment, fixed-starter check and all five local corrections. Both runs
exited 0; the later result is `/tmp/where-next-learner-final-browser.log`.

Observed contexts:

| Width | Requested and actual theme | Body background | Page scroll width |
| --- | --- | --- | --- |
| 375 | light | rgb(243, 246, 245) | 375 |
| 375 | dark | rgb(16, 22, 21) | 375 |
| 1280 | light | rgb(243, 246, 245) | 1280 |
| 1280 | dark | rgb(16, 22, 21) | 1280 |

Verified in each context:

- The front-page discovery link opens the ancillary page, with its own H1 and browser-tab title.
  This is a discoverable optional route rather than an additional numbered lesson.
- All three section headings, preparation, directive/entry definitions, X0/w0 explanation,
  exact stopping guidance, exit-status explanation and fixed-versus-read input distinction are
  rendered from the final current copy. L1–L5 are closed in the built page.
- The entire starter is visible and equals the downloaded public source byte for byte. The
  download has the expected `.s` filename. It fits at all four checked widths without overflow;
  no horizontal scrolling was needed in these contexts. The harness's conditional keyboard-
  scrolling branch was therefore not exercised, rather than counted as a passed scrolling test.
- The explicit external open control advertises and has a new-tab target with noopener. The
  prerequisite, native-tool and Pi route links point to the named lessons. This reader verified
  the local link contract; actual external import/assemble/execution is recorded separately by
  the starter author and independent technical reviewer, not claimed by this local-page run.
- The footer link opens the page. The end-of-Module-9 discovery link also opens it while the
  existing ordinary next-lesson link still leads to the first Module 10 lesson.
- Reload preserves this route and the selected actual theme. The back-to-plan link works.
- There are no JavaScript page errors, broken/locked figures or document horizontal overflow.

All four final full-page screenshots were visually inspected:
`/tmp/where-next-learner-375-light.png`, `375-dark.png`, `1280-light.png`, `1280-dark.png`.
The complete code, labels, links and two action controls are readable, with clear contrast in
both themes. The code block is an actual checked source example, not a claim that the page runs
an external debugger. Three specific headings and the small complete starter support the
transfer without requiring another course's lesson sequence.

Sentence pass on the final page: new terms are now given their relevant plain meanings locally;
controls and stopping moments are specific. Idea pass: the reader can identify what stays the
same, load a complete familiar program into the new environment, distinguish a returned result
from printed output, and choose whether to continue with their own input-handling project or
the separately linked native/hardware paths. The fixed-input check bridges the external checks
interface before expecting variable-input testing. No further blocking learner finding remains.

The external site's future availability or changes, physical mobile file-picker behaviour,
physical Arm execution and Pi boot were not established by this local learner review.

## Release-candidate recheck after final small changes

The 9.55-second release-candidate build (`/tmp/where-next-build-release-candidate.log`) was
checked separately after the prior approval. The final Step 1 now explicitly tells the learner
to record existing checks before importing and explains that program export does not carry
those checks. The action controls use a div rather than a paragraph; the home discovery text
now has the course's reading measure. JavaScript-off rendering is checked separately by the
technical reviewer, not claimed here.

A complete final four-context run exited 0 at 375/1280 in actual light/dark themes:
`/tmp/where-next-learner-release-candidate.log`. It again compared current exported prose to the
rendered article, including the new check-preservation phrase, and verified the source download,
home/footer/Module 9 discovery, unchanged ordinary next link, title/route/back/reload and no
page errors or horizontal overflow. The home discovery paragraph measured 343 pixels on the
phone and 704 pixels on desktop, within its computed 704-pixel maximum in both themes.

All four refreshed release-candidate screenshots were visually inspected. The download/open
controls remain distinct and readable, with no overlap after the semantic container change.
All earlier learner corrections remain visible and understandable. No new learner blocker or
product edit was introduced by this review. The earlier source/built checks above remain
separate observations rather than being silently replaced by this recheck.
