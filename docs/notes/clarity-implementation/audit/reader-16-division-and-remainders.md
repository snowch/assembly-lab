# Independent learner review: Division and remainders

Reviewed 2026-10-18. Read-only review of lesson 16. No previous review notes consulted.

## Coverage

Read CLAUDE.md, docs/style.md, docs/authoring.md, the front-page prerequisite panel, course order in content/lessons/index.ts, the complete target structure, prose, labels, prediction options and explanations, both challenge tasks and five-step hint ladders, model notes, recorded snippets, and relevant shared prediction/stepper/product strings and renderers. Read the preceding Products and widths prose in full and checked earlier prerequisite definitions where needed (references below). Did not reread every earlier lesson in full.

Actual Chromium at http://localhost:4290/assembly-lab/#/lesson/division-and-remainders, fresh contexts at 375×900 and 1280×900, light and dark. Captured the full initial page in each configuration; committed a prediction and stepped its first instruction in each configuration. Visually inspected the four stepper screenshots, plus phone screenshots of the expanded prediction guidance and the generalisation section with its figure unlocked. Source-reading covers explanations/hints not all separately exercised in the browser. No exhaustive challenge solving or input combinations.

Screenshots: /tmp/course-clarity-audit/reader16-{375,1280}-{light,dark}-{initial,step}.png; reader16-prediction-guidance.png; reader16-generalisation.png.

## Findings

### 1. Low: prediction cards still carry the stepping explanation

Quote: “Stepped”; opening it gives “Each step runs one instruction in the simulator. Between steps, the simulated processor stays as the last instruction left it.” This appears immediately above “Which hexadecimal quotient does it return?”

Source: content/lessons/division-and-remainders.ts:10 assigns the steps time model to every non-listing figure, including the prediction helper at line 26. The shared note is packages/views/src/strings.ts:10. The second prediction receives the same treatment.

Reproduction: fresh page, expand the Stepped button above the first prediction before choosing an option. Actual DOM has data-kind=memory-prediction, data-time-model=steps, with the note inside its caption. Phone screenshot reader16-prediction-guidance.png records this state.

Learner effect: the question asks for a function result and has no stepping controls. Explaining how each step works here suggests an action the learner cannot take within this card. The adjacent stepper is the appropriate place for this guidance, matching the recent introductory-page correction.

Direction: apply the prediction-role badge to this lesson's prediction figures and keep the stepping disclosure with the steppers. Preserve the prediction gate.

### 2. Medium: the division-by-ten explanation and its figure surround unrelated material

Quote before the edge-case experiments: “For unsigned division by ten, this recorded GCC version uses multiplication by `0xcccccccd` and a right shift by 35.”

Quote immediately above the actual division-by-ten figure: “The final calculation uses fuel in millilitres and distance in metres.” The section then explains multiplying fuel by 100, zero distance, and widening a divisor, before the caption “Follow GCC’s recorded division-by-ten sequence.”

Source: content/lessons/division-and-remainders.prose.ts:36 and :38. Placement: content/lessons/division-and-remainders.ts:175–197 mounts two exceptional-division experiments after the constant-division paragraph; :199–213 mounts groups_of_ten after the fuel-calculation prose.

Reproduction: check the first prediction to unlock the figures; read Explanation through Generalisation. Screenshot reader16-generalisation.png shows the latter adjacency. The figure's C is groups_of_ten, while the immediately preceding paragraphs prepare consumption.

Learner effect: the learner must carry the constant-division explanation across two interactive experiments and three paragraphs about another function. Its placement under fuel calculation can make the multiplication constant and shift look like ingredients for that task. The descriptive caption identifies the program but does not restore the missing adjacency.

Direction: place the division-by-ten paragraph beside its own figure, keeping the fuel-calculation guidance together directly before the fuel challenge. No additional explanation is necessarily required.

## Timing and assumed knowledge

No additional timing finding: “Which hexadecimal quotient does it return?” follows an explicit input setup and return-register statement. The changed-function question also asks what it returns, so its execution moment is clear. The post-prediction stepper separately reports “Ran … Next: …” and highlights the source operation; this worked in all four inspected configurations.

No unsupported-knowledge finding established. Evidence checked:

- Front-page Before you start permits basic C functions, arguments, return, branches, loops, arrays, and arithmetic.
- Hexadecimal and signed readings: one-pattern-three-readings.prose.ts:24–25 defines hexadecimal and the 0x notation; the earlier lesson teaches signed bit patterns.
- GCC's -O1: meet-the-machine.prose.ts:16 explains it as an optimisation setting, with the compiler command nearby.
- Register views and upper bits: constants-and-widths.prose.ts:66 says writing a w name clears the upper 32 bits of the x register; memory-and-addresses.prose.ts:14 states that w0/x0 are two views of the same register.
- Little-endian target: memory-and-addresses.prose.ts:11, :16 explains target and byte order.
- Product width, widening operations, msub and undefined C overflow: products-and-widths.prose.ts:9, :11 and its Explanation define these before this lesson.
- movk and its shifted half: constants-and-widths.prose.ts:42–44.
- Quotient, dividend, divisor, remainder and C / and % are explained in this lesson's opening, before use; signed rounding is explained before the prediction.

No new wording is supplied and no challenge answer is included in this report.
