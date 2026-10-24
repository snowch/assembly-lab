# One addition: independent learner and built-page review

Reviewer: separate reader who did not draft or implement the change. Reviewed 24 October 2026.
Prerequisites: the course front page's basic C, arithmetic and binary conversion; no later lessons.
Built page: http://localhost:4340/assembly-lab/#/lesson/one-addition.

## Verdict and findings

No blocking learner, navigation or layout finding in this pass.

“A register is a small, fast store inside the processor” now has a reason beside it:
“For add, a value held in memory must first be brought into a register.” Memory is defined
before that explanation. The later activity explicitly says its inputs are already in registers,
so the learner need not search for an unshown memory-transfer instruction.

“It has 31 general-purpose integer registers” qualifies the count, and the next sentence
acknowledges other registers. AArch64 is immediately identified as Arm's 64-bit mode.
The page does not imply that every Arm instruction set has the same register arrangement.

“Each x name selects all 64 bits; its matching w name selects the lower 32 bits of the same
register” gives the general naming rule before the addition uses several w names. The schematic
then shows one enclosing x0 frame and w0 within its lower half. It does not look like two stores
or an executed write. Visible labels and the image's accessible name explain the relation
without relying on colour. No full bit pattern or value is introduced by this schematic.

The named Constants and widths link reaches that actual lesson, whose relevant section is
“Two names, one register”. This replaces the vague Module 1 promise. The diagram teaches width
and identity without stating the later experiment's write-clearing result. Optional Arm source
links are not required to operate the first activity, and no essential explanation is hidden
inside their disclosure.

The small addition still defines, demonstrates and practises one arithmetic operation. The
orientation adds context without adding another execution mechanism to the activity. A complete
function, memory-copy sequence or extra lookup assessment here would add material beyond its
objective. The fresh practice remains distinct and unfilled.

## Assumed knowledge and writing passes

The opening assumes bits/binary and integer values, covered by the front-page prerequisites.
Register, instruction, operand, memory and simulator are defined before the next relevant action.
“General-purpose” is explained through ordinary calculations; the special register roles are
acknowledged without requiring their names. “Destination” is identified by the first-operand
rule before execution. No compiler setting, tool command, memory-address syntax or later opcode
is required. The x/w label change is explained directly rather than assumed.

Sentence and explanation passes found no missing bridge needed for the worked addition or its
fresh trace. The one forward link gives a precise later location, while the page itself supplies
the width relationship needed now. No challenge answer is repeated in this review.

## Executed checks

Real Chromium: 375, 768 and 1280 CSS pixels, each light and dark (six contexts). Confirmed actual
html[data-theme] every time. Read the complete rendered lesson text and inspected the phone-light
and desktop-dark full-page screenshots. Register frame/labels remained readable, with one lower
view contained in the same outer frame. No page-level horizontal overflow or page errors.

In all six contexts: initial unknown destination and blank fresh fields; run the addition;
reset to the initial unknown state; open/close source details and verify both official hrefs;
follow the named width-lesson link and confirm its title and section heading. This focused pass
did not submit challenge reference answers or execute later-lesson experiments.

Evidence outside the repository: /tmp/register-opening-reader.mjs,
/tmp/register-opening-reader.json and /tmp/register-opening-{width}-{theme}.png.
All six contexts completed with no script failure. This is a learner/browser review, not a
full-suite, hardware, external-manual-availability or technical-source validation claim.
