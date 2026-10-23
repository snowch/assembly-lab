# Check 02: Constants and widths

Independent learner/checker review, 23 October 2026. Checked the stable final built site at
`http://localhost:4322/assembly-lab/#/lesson/constants-and-widths`. No application edit or build
was made by this reviewer.

## Verdict and evidence

No actionable fault found in the checked change. Severity: none. Direction: retain the shorter
final-task introduction and the existing instruction listing.

The final section now says, “Follow the four instructions in the listing. Track the two register
values separately.” Its task still says, “Without running them, give x1 and w2 after all four,
as decimal numbers.” The actual four-line listing remains inside the exercise, followed by two
clearly labelled final-value fields. The former prose copy of the full instruction sequence is
absent. This removes a second traversal without removing the operations, requested moment or
independent register tracking. The assembly-only task correctly has no invented C pairing.

The introductory service example retains its complete C beside its checked instructions. The
worked half-register drawing retains separate Next actions, current/next status, and textual
“new” and “kept” labels. At phone width its halves stack legibly; desktop shows them alongside
each other. The width experiment retains the nested narrow-register label and explicit
“cleared” and “written” marks. Colour is supplementary in the inspected light and dark states.
The closing time note still says, “Each step runs one instruction in the simulator.”

Fresh arrival shows locks for the constant tester, learner-solution drawing and width drawing.
The first and width predictions release their respective experiments after a committed wrong
choice, with feedback. The learner-solution drawing stays locked after running the invalid
starting construction. Neither that drawing nor a worked construction answer is shown on
arrival. No challenge answer is recorded here. There is no shared comparison-reveal component
in this lesson's ten-section data, so that path is not applicable.

## Coverage and limits

Read AGENTS.md and CLAUDE.md; all ten sections, objectives, captions, tasks and hint ladders;
entry prerequisites; both preceding lessons' prose; the Module 1 listing records and source
associations; sources.md; ConstantTester and the WideStepper gate implementation. Earlier
lessons teach operands, register overwriting, returns, stepping, editing, signed/unsigned
readings, hexadecimal and set/clear. The lesson locally explains void, constants, assembling,
GNU assembler, movk/lsl syntax, remainder, overlapping names, long and the unsigned suffix.
No additional missing prerequisite was confirmed in this bounded pass.

Fresh Chromium contexts at 375×900 and 1280×900, each with light and dark preference: inspected
initial and committed states; committed both predictions with incorrect choices; tried one
rejected and one accepted tester input; opened the optional pattern note; stepped the movk
worked figure twice; stepped the width experiment twice and Reset; ran the invalid starting
construction, opened only its first hint and switched to Tap. Actual backgrounds were
`rgb(243, 246, 245)` for light and `rgb(16, 22, 21)` for dark. Initial and committed document
horizontal overflow was zero in all four contexts. Visually inspected phone light movk,
phone dark width and desktop light movk captures, in addition to the DOM/text checks.

Reproducible scripts/logs: `/tmp/check02.cjs`, `/tmp/check02.log`,
`/tmp/check02-metrics.cjs`, `/tmp/check02-metrics.log`. Captures:
`/tmp/check02-{375|1280}-{light|dark}-{initial|movk|width|committed}.png`.

Passing construction, successful-solution trace, final exercise grading, complete hint progression,
restoration and full accessibility/technical verification were source-only or untested. No
external compiler call, full suite or native differential check was run. This is a bounded
interaction check, not evidence of beginner completion rates.
