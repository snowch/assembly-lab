# Independent learner/checker: Division and remainders

Reviewed final site at `http://localhost:4322/assembly-lab/#/lesson/division-and-remainders`, source HEAD `edc67a48045e107fe70e40e9fd443378b53e61af`. No application edits or builds. This is a bounded learning-load and implementation check, not a novice usability study or a new ISA accuracy audit.

## Verdict and severity

No confirmed high, medium or low defect in the inspected states. Retain the later synthesis. The page introduces division through a small signed quotient prediction, then derives a remainder using multiplication/subtraction already taught in Products and their widths. The exceptional assembly demonstrations are locally distinguished from C. The final exercise combines familiar product width, register views and division with an explicitly explained incoming-value contract. Counting its instructions would not establish excessive learning load.

Evidence: “The recorded remainder function first uses `sdiv` to put the quotient in `w2`.” The register-preservation demand is named before construction: “Preserve the dividend until the subtraction uses it.” The final contract says “Naming `w1` as the input does not mean an instruction has written it.” These directions explain the mechanisms needed at their point of use.

No corrective direction is required. An optional focused rehearsal of the incoming upper-half contract remains a possible teaching improvement, not a demonstrated prerequisite gap or release blocker. It should not replace the final synthesis with another full worked solution.

## Prerequisites and reading

Read AGENTS.md/CLAUDE.md; all ten lesson sections, prose, labels, recorded programs; shared MemoryPrediction, MemoryStepper, DivisionParts and its model-derived helper. Checked immediate prerequisite Products and their widths and relevant Constants and widths material. Earlier instruction/register/bit-reading, branch, shift and paired-listing conventions are assumed; these are earlier-course material. Products explicitly teaches `msub`, full-width multiplication, narrowing loss and clearing the upper physical register on a `w` write. Constants already defines remainder. GCC settings and target widths are established earlier and repeated in the local disclosure. No confirmed unexplained prerequisite was found in this bounded comparison.

Novelty is signed/unsigned division, rounding towards zero, deriving a remainder from the original inputs and quotient, exceptional A64 division versus C rules, and recognising the recorded constant-divisor transformation. The final incoming-value contract is explained locally. Deriving the compiler's multiplier or asserting its speed is not demanded: “the instruction sequence is this compiler's choice, not a timing claim.”

## Final browser evidence

Four fresh sequential contexts: 375×900 and 1280×900, each with light and dark system preference. Screenshots visibly confirm actual light and dark rendering; the root has no explicit `data-theme` under automatic theme and its own background is transparent, so those two logged values are not treated as proof of theme. Initial and final document scroll widths equal viewport widths in all four contexts. No page errors were observed.

In each context:

- Initial quotient-dependent figures and the failure walkthrough were gated; no memory bytes or transfer diagram appeared.
- Committed the first prediction using a nonmatching choice. The gate unlocked without requiring a correct retry. Followed both quotient steppers and the remainder stepper to return; inspected the model-derived grouping diagram.
- Exercised remainder Back and Reset: the recorded position moved from returned to the previous instruction, then to `data-k=0`.
- Committed the unsigned-choice prediction using a nonmatching choice and followed its walkthrough to return.
- Completed both exceptional division demonstrations, including both division instructions and return. They remain assembly-only, with no invented C pairing or memory-byte display.
- Completed the recorded constant-division sequence. Paired C/instruction views remained present for C-derived examples; desktop screenshot shows complete numbered C beside checked instruction associations. Phone screenshot and shared renderer source show a contained horizontal listing rather than page overflow.
- Inspected the untouched final exercise and its explicit input, output, width and zero-distance contract. Did not submit challenge code or open answer-bearing hints.

The lesson supplies no comparison-case selector (`cases` absent; browser count zero), so changing comparison cases is not applicable. Its ordinary paired listings and standalone assembly cases were checked instead. Across completed arithmetic and exceptional steppers, memory-cell and transfer counts stayed zero. Shared source confirms memory is optional and no memory area is supplied by this lesson.

Artifacts: `/tmp/check-16/check.cjs`, `/tmp/check-16/browser.log`, and screenshots `/tmp/check-16/{375|1280}-{light|dark}-{remainder|diagram|challenge}.png`. Visually inspected phone light remainder/final challenge, phone dark diagram and desktop dark remainder. Browser log contains demonstration output; challenge solutions are not reproduced in this note.

## Limits

No challenge solving, test submission, later hints, saved-work reload, keyboard/screen-reader audit, external compiler calls, full-suite runs or new differential tests. Full-suite evidence belongs to the managing session. Technical source reading supports the stated boundaries but does not substitute for an independent full architecture audit. No claim of measured beginner learning outcomes.
