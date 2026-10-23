# Independent check: Products and their widths

Checked the final served build at `http://127.0.0.1:4322/assembly-lab/#/lesson/products-and-widths` on 23 October 2026. No application edits, build, challenge answers or submissions were made.

## Verdict and evidence

No blocking or new medium/high-severity finding in this bounded check. The previous **medium** execution-moment ambiguity is resolved.

The high-half stepper now says “Step through the instructions that write the product halves.” The separate diagram says “Compare the completed high and low halves for the same input bits.” Its visible note is explicit: “Completed products. This diagram shows the end of the run; Next and Reset in the stepper above do not change it.”

In all four fresh width/theme combinations, the independent stepper started at `data-k=0`, with “Press Next to run the first instruction. Next: mul x2, x0, x1.” After two Next presses it reached `data-k=2`, with “Ran umulh x3, x0, x1. Next: smulh x4, x0, x1.” Reset restored the original moment. The completed diagram remained identical across those three states, and its note accurately explained why. The learner can distinguish the current instruction state from the completed comparison without inferring an unstated relationship. Direction: retain this explicit distinction; no further change needed for this finding.

Both predictions retained their gates: choosing an option alone left the associated stepper locked; committing unlocked it. Eight locked figures were present initially. The first multiplication then executed once, and Reset restored the initial state. Its ran instruction and related C statement each had one active highlight. The late-widening multiplication likewise executed and reset after commitment. This check does not record prediction or challenge answers.

All six rendered C/assembly pairings retained the complete four-line numbered C source beside instructions. Pane top coordinates matched in every pairing. At 375 px their contained listing content measured 588 px inside 302/317 px viewports; at 1280 px it fit inside 927/942 px viewports. Thus the paired layout scrolls within the listing on phones. Document scroll widths were exactly 375 and 1280 respectively, with no page overflow. High-half controls measured 44 px high. The diagram's two labelled halves remained adjacent and readable in the inspected phone image.

Actual rendered themes matched the requests: light body background `rgb(243, 246, 245)` and dark `rgb(16, 22, 21)`, with matching `html[data-theme]`. No page errors were captured.

## Prerequisites and learner reading

Read all ten lesson sections, their captions and both challenge tasks in source. Earlier material supplies hexadecimal, signed/unsigned register interpretations, 32/64-bit register views, a `w` write clearing the upper half, wrapping, addition/subtraction, function input/return registers, and instruction stepping. Loading different widths explicitly introduces a C cast: “A C **cast** requests a conversion”. Constants and widths and the prior compiler disclosure supply target integer widths and `-O1`. The local lesson defines product and the high/low bit ranges, describes multiply-add/subtract operand roles, and explains the widening instruction choices before the final challenge. No additional definite unexplained prerequisite was found. This was a focused check, not a fresh audit of every prior lesson.

## Coverage and limits

Browser: four sequential fresh Chromium contexts at 375×900 and 1280×900, actual light/dark; both prediction selection/commit gates; initial multiplication and late-widening execution/reset; high-half initial/middle/reset; completed comparison; rendered pairing geometry; controls; document overflow. A second bounded four-context pass corrected the diagnostic selector for C highlighting and recorded pairing geometry. It did not change the application.

Source: AGENTS/CLAUDE guidance, all lesson sections/prose/labels, recorded listings, prior cast/width explanations, ProductHalves and productHalves computation, relevant MemoryPrediction/MemoryStepper and ListingView rendering, source/authoring guidance. The diagram reads the completed model trace while the stepper owns its current index, consistent with the visible note.

Artifacts: `/tmp/course-load-implementation/check15.cjs`, `check15-results.json`, `check15-run.log`, and `check15-{375,1280}-{light,dark}-{diagram,pair}.png`. Selected phone diagram and dark paired-listing images were visually inspected; metrics and interaction assertions cover all four combinations.

Not tested: challenge submissions/hints, every prediction alternative, all widening/signed/subtract steppers, high-half completion/Back, persisted restoration, keyboard-only use, external compiler calls or technical differential revalidation. No test suite was run by this checker. These limits do not weaken the checked initial/middle/Reset relationship, but prevent a claim of exhaustive lesson verification.
